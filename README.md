# 8i Wallet

8i Wallet is a prepaid AI credit wallet by 8 West Ventures. Users buy 8i Credits and spend them inside the platform on AI chat, agents, automations, document tools, image tools, coding assistants, and future API usage.

8i Credits are prepaid software credits only. They are not crypto tokens, investment products, money-transfer balances, cash-out balances, or third-party provider credits.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Prisma
- Supabase Postgres and Supabase Auth
- Stripe Checkout
- OpenAI SDK
- Zod validation

## Current State

This repository currently contains the Phase 1 app shell and foundation schema work:

- Public pages for home, pricing, terms, and privacy
- Placeholder authenticated pages for dashboard, wallet, usage, and settings
- MVP Prisma models for profiles, wallets, append-only ledger records, credit packages, Stripe records, AI request metadata, provider usage, and admin audit logs
- Typed environment validation helpers in `src/lib/env`

Runtime auth, wallet mutation services, Stripe checkout/webhooks, OpenAI provider routing, and admin tooling are planned next phases.

## Setup

Use PowerShell from the project root.

```powershell
pnpm install
Copy-Item .env.example .env
pnpm prisma:validate
pnpm prisma:generate
pnpm dev
```

Open `http://localhost:3000` after the dev server starts.

## Environment

Required variables are listed in `.env.example` and validated with Zod helpers:

- Database: `DATABASE_URL`, `DIRECT_URL`
- Public app/Supabase config: `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Server secrets: `SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `OPENAI_API_KEY`
- AI and credit settings: `OPENAI_DEFAULT_MODEL`, `CREDIT_UNIT_SCALE`, `DEFAULT_CREDIT_MARGIN_BPS`, `MIN_AI_DEBIT_UNITS`
- Admin/bootstrap settings: `ADMIN_EMAIL_ALLOWLIST`, `LOG_LEVEL`

Do not commit real secret values. Only `NEXT_PUBLIC_*` values may be exposed to browser code.

## Validation

```powershell
pnpm lint
pnpm typecheck
pnpm build
```

Run `pnpm prisma:validate` after schema changes. Run `pnpm prisma:generate` before adding server code that imports the generated Prisma client.

## Product Guardrails

Do not build cash-out, withdrawals, peer-to-peer transfers, resale, investment language, or anything implying 8i Credits appreciate in value or represent ownership of third-party model/provider credits.

Wallet mutations must be server-side only and recorded as append-only ledger entries. Stripe webhook handling must verify signatures and process paid-credit grants idempotently.
