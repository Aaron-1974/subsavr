import Link from "next/link";
import { SignedIn, SignedOut, SignUpButton } from "@clerk/nextjs";
import { ArrowRight, ScanLine, Bell, BarChart3, ShieldCheck } from "lucide-react";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col">
      <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="font-sans text-xl font-bold tracking-tight">
            SubSavr
          </Link>
          <div className="flex items-center gap-3">
            <SignedOut>
              <Link
                href="/sign-in"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Sign in
              </Link>
              <SignUpButton mode="modal">
                <button className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition-all hover:bg-accent/80">
                  Get started free
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <Link
                href="/dashboard"
                className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground"
              >
                Dashboard
              </Link>
            </SignedIn>
          </div>
        </div>
      </nav>

      <section className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
        <p className="mb-4 text-sm font-medium uppercase tracking-widest text-muted-foreground">
          Subscription Intelligence
        </p>
        <h1 className="mb-6 max-w-3xl text-5xl font-bold leading-tight md:text-7xl">
          Stop bleeding money on{" "}
          <span className="gradient-heading">subscriptions you forgot about.</span>
        </h1>
        <p className="mb-10 max-w-xl text-lg text-muted-foreground">
          SubSavr tracks every subscription, scans receipts with AI, and tells
          you exactly what you are spending — before your bank balance does.
        </p>
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <SignedOut>
            <SignUpButton mode="modal">
              <button className="flex items-center gap-2 rounded-xl bg-accent px-6 py-3 font-semibold text-accent-foreground shadow-lg transition-all hover:bg-accent/90">
                Start saving for free
                <ArrowRight size={16} />
              </button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <Link
              href="/dashboard"
              className="flex items-center gap-2 rounded-xl bg-accent px-6 py-3 font-semibold text-accent-foreground"
            >
              Go to dashboard
              <ArrowRight size={16} />
            </Link>
          </SignedIn>
          <p className="text-sm text-muted-foreground">No credit card required</p>
        </div>
      </section>

      <section className="border-t border-border bg-muted/30 px-4 py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-16 text-center text-3xl font-bold md:text-4xl">
            Everything you need to stop the bleed
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="card-interactive flex flex-col gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/15">
                  <feature.icon size={20} />
                </div>
                <h3 className="font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-24 text-center">
        <div className="mx-auto max-w-2xl">
          <p className="mb-4 text-4xl font-bold">
            The average Australian wastes{" "}
            <span className="savings-highlight text-4xl">$62/month</span> on
            forgotten subscriptions.
          </p>
          <p className="text-muted-foreground">
            SubSavr users spot them in minutes, not months.
          </p>
        </div>
      </section>

      <footer className="border-t border-border px-4 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-muted-foreground sm:flex-row">
          <p>2026 SubSavr. Made in Australia</p>
          <div className="flex gap-6">
            <Link href="https://github.com/Aaron-1974/subsavr" className="hover:text-foreground">
              GitHub
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

const FEATURES = [
  {
    icon: ScanLine,
    title: "AI Receipt Scanning",
    description:
      "Photograph any receipt. Claude Vision extracts the service name, amount, GST, and billing cycle instantly.",
  },
  {
    icon: Bell,
    title: "Renewal Alerts",
    description:
      "Get notified 7 days before any subscription bills you. No more surprise charges.",
  },
  {
    icon: BarChart3,
    title: "Spending Insights",
    description:
      "See your monthly and annual spend at a glance. Category breakdowns show where the money goes.",
  },
  {
    icon: ShieldCheck,
    title: "Australian GST Tracking",
    description:
      "Automatically calculates the GST component of each subscription. Useful for freelancers.",
  },
];
