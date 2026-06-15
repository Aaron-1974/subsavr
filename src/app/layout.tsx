import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "next-themes";
import "@/styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "SubSavr — Stop bleeding money on subscriptions",
    template: "%s | SubSavr",
  },
  description:
    "Track every subscription, scan receipts with AI, and see exactly what you're spending.",
  keywords: ["subscription tracker", "receipt scanner", "personal finance", "Australia"],
  authors: [{ name: "Aaron-1974" }],
  openGraph: {
    type: "website",
    locale: "en_AU",
    url: "https://subsavr.vercel.app",
    title: "SubSavr — Stop bleeding money on subscriptions",
    description: "AI-powered subscription tracking with receipt scanning",
    siteName: "SubSavr",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html
        lang="en-AU"
        suppressHydrationWarning
        className={inter.variable}
      >
        <body className="min-h-screen bg-background font-sans antialiased">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
