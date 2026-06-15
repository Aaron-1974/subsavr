# Architecture Decisions

## Why Next.js App Router?
Server Components reduce client JavaScript. Route handlers replace a separate API server. One repo, one deployment.

## Why Clerk over NextAuth?
Clerk provides production-grade auth with pre-built UI. NextAuth requires building your own sign-in screens and session handling from scratch.

## Why Prisma over Drizzle?
Prisma's schema file is the single source of truth for the database. Readable by non-engineers. Type-safe client eliminates a whole class of runtime bugs.

## Why Claude Vision for receipt scanning?
Claude understands context — it knows a Netflix receipt in Australia means AUD and 10% GST. Regex-based parsing breaks on every format variation. Claude handles them all.

## Why PostgreSQL over SQLite?
SQLite doesn't support concurrent writes. PostgreSQL's DECIMAL(10,2) type is essential for money — never use floats for currency.

## Money arithmetic — never use floats

0.1 + 0.2 === 0.30000000000000004 in JavaScript.

All amounts stored as DECIMAL(10,2) in PostgreSQL. Rounded to 2dp on every calculation step. Never accumulate floating-point errors.

## Testing strategy
Unit tests for pure functions. API route tests for the full request/response cycle. No snapshot tests — they break on every style change and provide low value.
