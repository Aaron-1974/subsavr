<div align="center">

# SubSavr

**Stop bleeding money on subscriptions you forgot about.**

AI-powered subscription tracking with receipt scanning, renewal alerts, and Australian GST awareness.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://typescriptlang.org)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

</div>

---

## What is SubSavr?

The average Australian spends **$62/month** on subscriptions they've forgotten about. SubSavr fixes that.

You add your subscriptions (or just photograph the receipt and let AI do it), and SubSavr tells you:

- exactly what you're paying, monthly and annually
- what's renewing in the next 7 days
- how much GST you're paying (useful for freelancers and small businesses)
- where all that money is actually going, by category

---

## Features

| Feature | Status |
|---|---|
| Manual subscription tracking | ✅ Done |
| AI receipt scanning (Claude Vision) | ✅ Done |
| Renewal alerts (7-day, 3-day, same-day) | ✅ Done |
| Spending dashboard with category breakdown | ✅ Done |
| Australian GST tracking | ✅ Done |
| Dark / light mode | ✅ Done |
| Multi-currency support (AUD, USD, NZD, GBP, EUR) | ✅ Done |
| CSV export | 🔜 Planned |
| Email renewal notifications | 🔜 Planned |
| Mobile app | 🔜 Planned |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5 (strict) |
| Styling | Tailwind CSS |
| Auth | Clerk |
| Database | PostgreSQL + Prisma |
| AI | Anthropic Claude Vision |
| Testing | Jest + Playwright |
| CI/CD | GitHub Actions |

---

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- A PostgreSQL database (free: Neon, Supabase, or Railway)
- A Clerk account (free)
- An Anthropic API key

### 1. Clone the repo

```bash
git clone https://github.com/Aaron-1974/subsavr.git
cd subsavr
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in your values.

### 3. Set up the database

```bash
npm run db:push
npm run db:seed
```

### 4. Start the development server

```bash
npm run dev
```

Open http://localhost:3000

---

## Project Structure---

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) first.

---

## License

[MIT](LICENSE) — free to use, modify, and distribute.

---

<div align="center">

Built in Australia 🇦🇺 with Next.js, Claude AI, and a genuine hatred of forgotten subscriptions.

**Star this repo if SubSavr saved you money.**

</div>
