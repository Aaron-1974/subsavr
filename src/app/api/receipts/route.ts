import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db/client";
import { scanReceiptImage } from "@/lib/ai/receipt-scanner";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"] as const;
type AllowedMime = (typeof ALLOWED_TYPES)[number];

function isAllowedMime(mime: string): mime is AllowedMime {
  return (ALLOWED_TYPES as readonly string[]).includes(mime);
}

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Expected multipart/form-data" }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: "File too large. Maximum size is 10 MB." },
      { status: 413 }
    );
  }

  if (!isAllowedMime(file.type)) {
    return NextResponse.json(
      { error: `Unsupported file type: ${file.type}. Use JPEG, PNG, or WebP.` },
      { status: 415 }
    );
  }

  try {
    const user = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");

    const receipt = await prisma.receipt.create({
      data: {
        userId: user.id,
        fileName: file.name,
        fileUrl: "",
        fileSize: file.size,
        mimeType: file.type,
        scanStatus: "PROCESSING",
      },
    });

    const scanResult = await scanReceiptImage(base64, file.type);

    if (scanResult.success && scanResult.data) {
      const extracted = scanResult.data;
      const updated = await prisma.receipt.update({
        where: { id: receipt.id },
        data: {
          extractedData: extracted as object,
          confidence: extracted.confidence,
          scanStatus: "COMPLETE",
          scannedAt: new Date(),
          detectedName: extracted.serviceName ?? null,
          detectedAmount: extracted.amount ?? null,
          detectedDate: extracted.date ? new Date(extracted.date) : null,
          detectedGst: extracted.gstAmount ?? null,
        },
      });
      return NextResponse.json({ data: updated }, { status: 201 });
    } else {
      await prisma.receipt.update({
        where: { id: receipt.id },
        data: {
          scanStatus: "FAILED",
          scanError: scanResult.error ?? "Extraction failed",
        },
      });
      return NextResponse.json(
        {
          data: receipt,
          message: "Receipt uploaded but scanning failed. You can enter details manually.",
        },
        { status: 201 }
      );
    }
  } catch (err) {
    console.error("[API] POST /receipts:", err);
    return NextResponse.json({ error: "Failed to process receipt" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") ?? "1", 10);
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "20", 10), 100);

  try {
    const user = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const [receipts, total] = await Promise.all([
      prisma.receipt.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.receipt.count({ where: { userId: user.id } }),
    ]);

    return NextResponse.json({
      data: receipts,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error("[API] GET /receipts:", err);
    return NextResponse.json({ error: "Failed to fetch receipts" }, { status: 500 });
  }
}
