import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNow, isAfter, isBefore, addDays, format } from "date-fns";
import type { BillingCycle, Currency, Subscription, SpendingSummary } from "@/types";
import { BILLING_CYCLE_MONTHS } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ─── Currency ─────────────────────────────────────────────────────────────────

const CURRENCY_LOCALES: Record<Currency, string> = {
  AUD: "en-AU",
  NZD: "en-NZ",
  USD: "en-US",
  GBP: "en-GB",
  EUR: "en-DE",
};

export function formatCurrency(amount: number, currency: Currency = "AUD"): string {
  return new Intl.NumberFormat(CURRENCY_LOCALES[currency], {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

// ─── Dates ────────────────────────────────────────────────────────────────────

export function formatDate(date: Date, fmt = "d MMM yyyy"): string {
  return format(date, fmt);
}

export function formatRelative(date: Date): string {
  return formatDistanceToNow(date, { addSuffix: true });
}

export function isRenewalSoon(date: Date, withinDays = 7): boolean {
  const now = new Date();
  const threshold = addDays(now, withinDays);
  return isAfter(date, now) && isBefore(date, threshold);
}

export function isToday(date: Date): boolean {
  const today = new Date();
  return (
    today.getFullYear() === date.getFullYear() &&
    today.getMonth() === date.getMonth() &&
    today.getDate() === date.getDate()
  );
}

// ─── Billing ──────────────────────────────────────────────────────────────────

export function toMonthly(amount: number, cycle: BillingCycle): number {
  return amount / BILLING_CYCLE_MONTHS[cycle];
}

export function toAnnual(amount: number, cycle: BillingCycle): number {
  return toMonthly(amount, cycle) * 12;
}

export function extractGst(totalIncGst: number): number {
  return Math.round((totalIncGst / 11) * 100) / 100;
}

export function addGst(amountExGst: number): number {
  return Math.round(amountExGst * 1.1 * 100) / 100;
}

// ─── Summary ──────────────────────────────────────────────────────────────────

export function computeSpendingSummary(subscriptions: Subscription[]): SpendingSummary {
  const active = subscriptions.filter(
    (s) => s.status === "ACTIVE" || s.status === "TRIAL"
  );

  let totalMonthly = 0;
  let gstTotal = 0;
  const categoryMap = new Map<string, { total: number; count: number }>();

  for (const sub of active) {
    const monthly = toMonthly(sub.amount, sub.billingCycle);
    totalMonthly += monthly;

    if (sub.includesGst) {
      gstTotal += extractGst(monthly);
    }

    const existing = categoryMap.get(sub.category) ?? { total: 0, count: 0 };
    categoryMap.set(sub.category, {
      total: existing.total + monthly,
      count: existing.count + 1,
    });
  }

  const byCategory = Array.from(categoryMap.entries())
    .map(([category, { total, count }]) => ({
      category: category as Subscription["category"],
      total,
      count,
      percentage: totalMonthly > 0 ? (total / totalMonthly) * 100 : 0,
    }))
    .sort((a, b) => b.total - a.total);

  return {
    totalMonthly: Math.round(totalMonthly * 100) / 100,
    totalAnnual: Math.round(totalMonthly * 12 * 100) / 100,
    currency: "AUD",
    activeCount: subscriptions.filter((s) => s.status === "ACTIVE").length,
    pausedCount: subscriptions.filter((s) => s.status === "PAUSED").length,
    trialCount: subscriptions.filter((s) => s.status === "TRIAL").length,
    gstTotal: Math.round(gstTotal * 100) / 100,
    byCategory,
  };
}

// ─── Strings ──────────────────────────────────────────────────────────────────

export function truncate(str: string, max: number): string {
  if (str.length <= max) return str;
  return str.slice(0, max - 1) + "…";
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function getDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}
