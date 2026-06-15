import Anthropic from "@anthropic-ai/sdk";
import type { ReceiptExtractedData, Currency } from "@/types";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

const EXTRACTION_PROMPT = `You are a receipt and invoice data extraction specialist for an Australian subscription tracking app.

Extract structured billing information from subscription receipts and invoices.

Respond with valid JSON only — no markdown, no explanation, just the JSON object.

Extract these fields where present:
- serviceName: The subscription service name (e.g. "Netflix", "Spotify")
- amount: Total charge as a number (e.g. 15.99)
- currency: ISO currency code (default "AUD" for Australian receipts)
- date: Billing date in YYYY-MM-DD format
- billingPeriod: e.g. "Monthly", "Annual"
- gstAmount: GST component in AUD if shown
- gstIncluded: Boolean — true if GST is included in the total
- accountEmail: Email address on the account
- planName: Specific plan name e.g. "Premium", "Family Plan"
- invoiceNumber: Invoice or receipt reference number
- confidence: Your confidence in the extraction from 0.0 to 1.0

Australian context: GST is 10% and is typically included in the displayed price.
Return null for any field you cannot confidently determine. Never guess.`;

interface ScanResult {
  success: boolean;
  data?: ReceiptExtractedData;
  error?: string;
}

export async function scanReceiptImage(
  imageBase64: string,
  mimeType: "image/jpeg" | "image/png" | "image/webp" | "image/gif"
): Promise<ScanResult> {
  try {
    const response = await client.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 1024,
      system: EXTRACTION_PROMPT,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: mimeType,
                data: imageBase64,
              },
            },
            {
              type: "text",
              text: "Extract all subscription billing information from this receipt. Return only the JSON object.",
            },
          ],
        },
      ],
    });

    const rawText = response.content
      .filter((block) => block.type === "text")
      .map((block) => (block as { type: "text"; text: string }).text)
      .join("");

    const extracted = parseResponse(rawText);
    return { success: true, data: extracted };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown scan error";
    console.error("[ReceiptScanner] Scan failed:", message);
    return { success: false, error: message };
  }
}

function parseResponse(rawText: string): ReceiptExtractedData {
  const cleaned = rawText
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  const parsed = JSON.parse(cleaned);

  return {
    serviceName: parsed.serviceName ?? undefined,
    amount: typeof parsed.amount === "number" ? parsed.amount : undefined,
    currency: isValidCurrency(parsed.currency) ? parsed.currency : "AUD",
    date: parsed.date ?? undefined,
    billingPeriod: parsed.billingPeriod ?? undefined,
    gstAmount: typeof parsed.gstAmount === "number" ? parsed.gstAmount : undefined,
    gstIncluded: typeof parsed.gstIncluded === "boolean" ? parsed.gstIncluded : undefined,
    accountEmail: parsed.accountEmail ?? undefined,
    planName: parsed.planName ?? undefined,
    invoiceNumber: parsed.invoiceNumber ?? undefined,
    confidence:
      typeof parsed.confidence === "number"
        ? Math.min(1, Math.max(0, parsed.confidence))
        : 0.5,
    rawText: rawText.substring(0, 500),
  };
}

const VALID_CURRENCIES: Currency[] = ["AUD", "USD", "NZD", "GBP", "EUR"];

function isValidCurrency(value: unknown): value is Currency {
  return typeof value === "string" && VALID_CURRENCIES.includes(value as Currency);
}
