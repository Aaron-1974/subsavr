export type Currency = "AUD" | "USD" | "NZD" | "GBP" | "EUR";

export type BillingCycle = "WEEKLY" | "FORTNIGHTLY" | "MONTHLY" | "QUARTERLY" | "ANNUALLY";

export type SubscriptionStatus = "ACTIVE" | "PAUSED" | "CANCELLED" | "TRIAL";

export type SubscriptionCategory =
  | "STREAMING"
  | "MUSIC"
  | "GAMING"
  | "PRODUCTIVITY"
  | "CLOUD_STORAGE"
  | "NEWS_MEDIA"
  | "FITNESS"
  | "FOOD_DELIVERY"
  | "FINANCE"
  | "SECURITY"
  | "DEVELOPER_TOOLS"
  | "EDUCATION"
  | "COMMUNICATION"
  | "OTHER";

export type ScanStatus = "PENDING" | "PROCESSING" | "COMPLETE" | "FAILED";

export interface Subscription {
  id: string;
  userId: string;
  name: string;
  description?: string | null;
  logoUrl?: string | null;
  websiteUrl?: string | null;
  category: SubscriptionCategory;
  status: SubscriptionStatus;
  amount: number;
  currency: Currency;
  billingCycle: BillingCycle;
  nextBillingAt: Date;
  trialEndsAt?: Date | null;
  includesGst: boolean;
  gstAmount?: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Receipt {
  id: string;
  userId: string;
  subscriptionId?: string | null;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  extractedData?: ReceiptExtractedData | null;
  confidence?: number | null;
  scanStatus: ScanStatus;
  scanError?: string | null;
  scannedAt?: Date | null;
  detectedName?: string | null;
  detectedAmount?: number | null;
  detectedDate?: Date | null;
  detectedGst?: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReceiptExtractedData {
  serviceName?: string;
  amount?: number;
  currency?: Currency;
  date?: string;
  billingPeriod?: string;
  gstAmount?: number;
  gstIncluded?: boolean;
  accountEmail?: string;
  planName?: string;
  invoiceNumber?: string;
  confidence: number;
  rawText?: string;
}

export interface SpendingSummary {
  totalMonthly: number;
  totalAnnual: number;
  currency: Currency;
  activeCount: number;
  pausedCount: number;
  trialCount: number;
  gstTotal: number;
  byCategory: CategoryBreakdown[];
}

export interface CategoryBreakdown {
  category: SubscriptionCategory;
  total: number;
  count: number;
  percentage: number;
}

export interface ApiSuccess<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  error: string;
  code?: string;
}

export const BILLING_CYCLE_MONTHS: Record<BillingCycle, number> = {
  WEEKLY: 1 / 4.33,
  FORTNIGHTLY: 1 / 2.17,
  MONTHLY: 1,
  QUARTERLY: 3,
  ANNUALLY: 12,
};

export const CATEGORY_LABELS: Record<SubscriptionCategory, string> = {
  STREAMING: "Streaming",
  MUSIC: "Music",
  GAMING: "Gaming",
  PRODUCTIVITY: "Productivity",
  CLOUD_STORAGE: "Cloud Storage",
  NEWS_MEDIA: "News & Media",
  FITNESS: "Fitness",
  FOOD_DELIVERY: "Food Delivery",
  FINANCE: "Finance",
  SECURITY: "Security",
  DEVELOPER_TOOLS: "Developer Tools",
  EDUCATION: "Education",
  COMMUNICATION: "Communication",
  OTHER: "Other",
};

export const BILLING_CYCLE_LABELS: Record<BillingCycle, string> = {
  WEEKLY: "Weekly",
  FORTNIGHTLY: "Fortnightly",
  MONTHLY: "Monthly",
  QUARTERLY: "Quarterly",
  ANNUALLY: "Annually",
};
