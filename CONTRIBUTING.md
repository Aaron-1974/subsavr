# Contributing to SubSavr

Thanks for your interest in contributing! Every bug fix, feature, and
documentation improvement is genuinely appreciated.

## Before you start

- Check open issues to see what's already being worked on
- For large features, open an issue first to discuss the approach

## Local setup

```bash
git clone https://github.com/Aaron-1974/subsavr.git
cd subsavr
npm install
cp .env.example .env.local
npm run db:push
npm run dev
```

## Workflow1. Branch from develop: `git checkout -b feat/my-feature develop`
2. Make your changes
3. Run checks: `npm run lint && npm test`
4. Open a PR against develop

## Commit style## Code style

- TypeScript strict mode — no any, use unknown if unsure
- All money calculation functions must have unit tests
- Run npm run format before committing

## Questions?

Open an issue with the question label — no question is too basic.
