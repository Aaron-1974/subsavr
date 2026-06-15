# Deployment Guide

## Vercel (recommended)

1. Install Vercel CLI: npm i -g vercel
2. Run: vercel
3. Add environment variables in Vercel dashboard
4. Run migrations: DATABASE_URL="your_url" npm run db:migrate:prod

## Railway

1. Create project at railway.app
2. Add PostgreSQL service
3. Connect GitHub repo
4. Set environment variables
5. Build command: npm run db:migrate:prod && npm run build
6. Start command: npm start

## Environment Variables Required

- DATABASE_URL
- DIRECT_URL
- NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
- CLERK_SECRET_KEY
- ANTHROPIC_API_KEY
- NEXT_PUBLIC_APP_URL

See .env.example for the full list.
