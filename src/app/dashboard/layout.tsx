import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { LayoutDashboard, CreditCard, ScanLine, Settings } from "lucide-react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-60 flex-col border-r border-border bg-card lg:flex">
        <div className="flex h-16 items-center border-b border-border px-6">
          <Link href="/dashboard" className="text-xl font-bold">
            SubSavr
          </Link>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-4">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <item.icon size={16} />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3 border-t border-border p-4">
          <UserButton afterSignOutUrl="/" />
          <span className="text-sm text-muted-foreground">Account</span>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-border px-4 lg:hidden">
          <Link href="/dashboard" className="text-lg font-bold">
            SubSavr
          </Link>
          <UserButton afterSignOutUrl="/" />
        </header>
        <main className="flex-1 overflow-auto">
          <div className="mx-auto max-w-5xl px-4 py-8">{children}</div>
        </main>
      </div>
    </div>
  );
}

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/subscriptions", label: "Subscriptions", icon: CreditCard },
  { href: "/receipts", label: "Receipts", icon: ScanLine },
  { href: "/settings", label: "Settings", icon: Settings },
];
