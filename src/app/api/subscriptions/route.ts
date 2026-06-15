import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { prisma } from "@/lib/db/client";

const createSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  category: z.enum([
    "STREAMING", "MUSIC", "GAMING", "PRODUCTIVITY", "CLOUD_STORAGE",
    "NEWS_MEDIA", "FITNESS", "FOOD_DELIVERY", "FINANCE", "SECURITY",
    "DEVELOPER_TOOLS", "EDUCATION", "COMMUNICATION", "OTHER",
  ]),
  amount: z.number().positive().max(100000),
  currency: z.enum(["AUD", "USD", "NZD", "GBP", "EUR"]).default("AUD"),
  billingCycle: z.enum(["WEEKLY", "FORTNIGHTLY", "MONTHLY", "QUARTERLY", "ANNUALLY"]),
  nextBillingAt: z.coerce.date(),
  trialEndsAt: z.coerce.date().optional(),
  includesGst: z.boolean().default(true),
  websiteUrl: z.string().url().optional().or(z.literal("")),
});

export async function GET(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  try {
    const user = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const subscriptions = await prisma.subscription.findMany({
      where: {
        userId: user.id,
        ...(status && status !== "ALL" ? { status: status as never } : {}),
      },
      orderBy: { nextBillingAt: "asc" },
    });

    return NextResponse.json({ data: subscriptions });
  } catch (err) {
    console.error("[API] GET /subscriptions:", err);
    return NextResponse.json({ error: "Failed to fetch subscriptions" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 422 }
    );
  }

  try {
    const user = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const data = parsed.data;
    let gstAmount: number | undefined;
    if (data.currency === "AUD" && data.includesGst) {
      gstAmount = Math.round((data.amount / 11) * 100) / 100;
    }

    const subscription = await prisma.subscription.create({
      data: {
        userId: user.id,
        name: data.name,
        description: data.description,
        category: data.category,
        amount: data.amount,
        currency: data.currency,
        billingCycle: data.billingCycle,
        nextBillingAt: data.nextBillingAt,
        trialEndsAt: data.trialEndsAt,
        includesGst: data.includesGst,
        gstAmount,
        websiteUrl: data.websiteUrl || null,
        status: data.trialEndsAt ? "TRIAL" : "ACTIVE",
      },
    });

    return NextResponse.json({ data: subscription }, { status: 201 });
  } catch (err) {
    console.error("[API] POST /subscriptions:", err);
    return NextResponse.json({ error: "Failed to create subscription" }, { status: 500 });
  }
}
