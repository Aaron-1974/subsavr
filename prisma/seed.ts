import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const user = await prisma.user.upsert({
    where: { email: "demo@subsavr.com" },
    update: {},
    create: {
      clerkId: "user_demo_seed_001",
      email: "demo@subsavr.com",
      name: "Demo User",
      currency: "AUD",
      timezone: "Australia/Melbourne",
    },
  });

  console.log("User created:", user.email);

  const now = new Date();

  await prisma.subscription.createMany({
    data: [
      {
        userId: user.id,
        name: "Netflix",
        category: "STREAMING",
        amount: 22.99,
        billingCycle: "MONTHLY",
        nextBillingAt: new Date(now.getTime() + 3 * 86400000),
        includesGst: true,
        gstAmount: 2.09,
        status: "ACTIVE",
      },
      {
        userId: user.id,
        name: "Spotify Premium",
        category: "MUSIC",
        amount: 13.99,
        billingCycle: "MONTHLY",
        nextBillingAt: new Date(now.getTime() + 15 * 86400000),
        includesGst: true,
        gstAmount: 1.27,
        status: "ACTIVE",
      },
      {
        userId: user.id,
        name: "Adobe Creative Cloud",
        category: "PRODUCTIVITY",
        amount: 87.49,
        billingCycle: "MONTHLY",
        nextBillingAt: new Date(now.getTime() + 22 * 86400000),
        includesGst: true,
        gstAmount: 7.95,
        status: "ACTIVE",
      },
      {
        userId: user.id,
        name: "iCloud+",
        category: "CLOUD_STORAGE",
        amount: 4.49,
        billingCycle: "MONTHLY",
        nextBillingAt: new Date(now.getTime() + 8 * 86400000),
        includesGst: true,
        gstAmount: 0.41,
        status: "ACTIVE",
      },
      {
        userId: user.id,
        name: "GitHub Copilot",
        category: "DEVELOPER_TOOLS",
        amount: 15.00,
        billingCycle: "MONTHLY",
        nextBillingAt: new Date(now.getTime() + 18 * 86400000),
        includesGst: false,
        status: "ACTIVE",
      },
    ],
  });

  console.log("Subscriptions seeded successfully.");
  console.log("Done! Login with demo@subsavr.com to explore the app.");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
