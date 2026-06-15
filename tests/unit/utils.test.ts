import {
  formatCurrency,
  toMonthly,
  toAnnual,
  extractGst,
  addGst,
  computeSpendingSummary,
  truncate,
  getInitials,
  getDomain,
  isRenewalSoon,
} from "@/lib/utils";
import type { Subscription } from "@/types";

const mockSub = (overrides: Partial<Subscription> = {}): Subscription => ({
  id: "sub_test",
  userId: "usr_test",
  name: "Test Service",
  category: "STREAMING",
  status: "ACTIVE",
  amount: 10,
  currency: "AUD",
  billingCycle: "MONTHLY",
  nextBillingAt: new Date("2026-07-01"),
  includesGst: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

describe("formatCurrency", () => {
  it("formats AUD correctly", () => {
    expect(formatCurrency(9.99, "AUD")).toBe("A$9.99");
  });
  it("handles zero", () => {
    expect(formatCurrency(0, "AUD")).toBe("A$0.00");
  });
  it("handles large numbers", () => {
    expect(formatCurrency(1234.56, "AUD")).toBe("A$1,234.56");
  });
});

describe("toMonthly", () => {
  it("monthly stays the same", () => {
    expect(toMonthly(10, "MONTHLY")).toBe(10);
  });
  it("annual divides by 12", () => {
    expect(toMonthly(120, "ANNUALLY")).toBeCloseTo(10, 1);
  });
  it("quarterly divides by 3", () => {
    expect(toMonthly(30, "QUARTERLY")).toBeCloseTo(10, 1);
  });
});

describe("toAnnual", () => {
  it("monthly multiplies by 12", () => {
    expect(toAnnual(9.99, "MONTHLY")).toBeCloseTo(119.88, 1);
  });
  it("annual stays the same", () => {
    expect(toAnnual(120, "ANNUALLY")).toBeCloseTo(120, 1);
  });
});

describe("extractGst", () => {
  it("extracts 10% GST from inclusive price", () => {
    expect(extractGst(11)).toBe(1.0);
    expect(extractGst(22)).toBe(2.0);
  });
  it("rounds to 2 decimal places", () => {
    expect(extractGst(9.99)).toBeCloseTo(0.91, 2);
  });
});

describe("addGst", () => {
  it("adds 10% GST", () => {
    expect(addGst(10)).toBe(11.0);
    expect(addGst(100)).toBe(110.0);
  });
});

describe("computeSpendingSummary", () => {
  it("returns zeroes for empty list", () => {
    const summary = computeSpendingSummary([]);
    expect(summary.totalMonthly).toBe(0);
    expect(summary.activeCount).toBe(0);
  });
  it("sums active subscriptions", () => {
    const subs = [
      mockSub({ amount: 10 }),
      mockSub({ id: "sub_2", amount: 20 }),
    ];
    const summary = computeSpendingSummary(subs);
    expect(summary.totalMonthly).toBe(30);
    expect(summary.totalAnnual).toBe(360);
  });
  it("excludes cancelled subscriptions", () => {
    const subs = [
      mockSub({ amount: 10 }),
      mockSub({ id: "sub_2", amount: 20, status: "CANCELLED" }),
    ];
    expect(computeSpendingSummary(subs).totalMonthly).toBe(10);
  });
  it("normalises annual billing to monthly", () => {
    const subs = [mockSub({ amount: 120, billingCycle: "ANNUALLY" })];
    expect(computeSpendingSummary(subs).totalMonthly).

