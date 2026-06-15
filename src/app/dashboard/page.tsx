import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/client";
import { computeSpendingSummary, formatCurrency, isRenewalSoon } from "@/lib/utils";
import type { Subscription } from "@/types";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: {
      subscriptions: {
        where: { status: { in: ["ACTIVE", "TRIAL", "PAUSED"] } },
        orderBy: { nextBillingAt: "asc" },
      },
    },
  });

  if (!user) redirect("/onboarding");

  const subs = user.subscriptions.map((s) => ({
    ...s,
    amount: Number(s.amount),
    gstAmount: s.gstAmount ? Number(s.gstAmount) : null,
    nextBillingAt: new Date(s.nextBillingAt),
    trialEndsAt: s.trialEndsAt ? new Date(s.trialEndsAt) : null,
  })) as unknown as Subscription[];

  const summary = computeSpendingSummary(subs);
  const renewingSoon = subs.filter((s) =>
    isRenewalSoon(new Date(s.nextBillingAt), 7)
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">
          Good {greeting()}, {user.name?.split(" ")[0] ?? "there"}.
        </h1>
        <p className="mt-1 text-muted-foreground">
          Here is where your money is going.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Monthly spend"
          value={formatCurrency(summary.totalMonthly, "AUD")}
          sublabel={`${formatCurrency(summary.totalAnnual, "AUD")} / year`}
          highlight
        />
        <StatCard
          label="Active subscriptions"
          value={String(summary.activeCount)}
          sublabel={`${summary.trialCount} on trial`}
        />
        <StatCard
          label="Renewing soon"
          value={String(renewingSoon.length)}
          sublabel="within 7 days"
          warn={renewingSoon.length > 0}
        />
        <StatCard
          label="GST this month"
          value={formatCurrency(summary.gstTotal, "AUD")}
          sublabel="tax component"
        />
      </div>

      {renewingSoon.length > 0 && (
        <section>
          <h2 className="mb-4 text-lg font-semibold">Renewing soon</h2>
          <div className="space-y-2">
            {renewingSoon.map((sub) => (
              <div
                key={sub.id}
                className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3"
              >
                <div>
                  <p className="font-medium">{sub.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(sub.nextBillingAt).toLocaleDateString("en-AU", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                    })}
                  </p>
                </div>
                <span className="savings-highlight text-base">
                  {formatCurrency(sub.amount, "AUD")}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {subs.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-20 text-center">
          <p className="mb-2 text-lg font-semibold">No subscriptions yet</p>
          <p className="mb-6 text-sm text-muted-foreground">
            Add your first subscription or scan a receipt to get started.
          </p>
          
            href="/subscriptions/new"
            className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground"
          >
            Add subscription
          </a>
        </div>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  sublabel,
  highlight = false,
  warn = false,
}: {
  label: string;
  value: string;
  sublabel?: string;
  highlight?: boolean;
  warn?: boolean;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p
        className={`mt-1 font-mono text-2xl font-bold tabular-nums ${
          highlight ? "savings-highlight" : warn ? "text-destructive" : ""
        }`}
      >
        {value}
      </p>
      {sublabel && (
        <p className="mt-0.5 text-xs text-muted-foreground">{sublabel}</p>
      )}
    </div>
  );
}

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}
