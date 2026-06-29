# 8i Wallet MVP Implementation Plan

## Status

Approved planning document for the MVP. This document is implementation guidance only; product features should be built in later tasks.

## Product Constraints

8i Wallet sells prepaid software credits for use inside the 8i Wallet platform.

The MVP must not implement or imply:

- Crypto tokens
- Cash-out or withdrawal functionality
- User-to-user credit transfers
- User resale of credits
- Investment value or credit appreciation
- Ownership or resale of third-party model/provider credits

The MVP must implement:

- Prepaid 8i Credits
- Internal wallet balance
- Append-only wallet ledger
- Stripe Checkout for credit packs
- Server-side AI provider calls
- Transparent usage and purchase history
- Admin review and credit adjustment tooling

## 1. App Architecture

Use:

- Next.js App Router
- TypeScript
- Tailwind CSS
- Prisma
- Supabase Postgres
- Supabase Auth
- Stripe Checkout
- OpenAI SDK first
- Zod for input validation

Recommended folder structure:

```text
app/
  (public)/
  (app)/
  admin/
  api/
    ai/
    checkout/
    stripe/
components/
lib/
  auth/
  db/
  env/
  validation/
server/
  admin/
  ai/
  stripe/
  wallet/
prisma/
docs/
```

Application boundaries:

- Public pages are read-only marketing, legal, pricing, and auth entry points.
- Authenticated pages read wallet, ledger, usage, and account data for the current user only.
- Admin pages require a DB-backed admin role from `profiles.role`.
- Wallet mutations happen only in server-side wallet services.
- Stripe webhooks are the only automated source of purchase-credit ledger entries.
- OpenAI calls happen only server-side.
- Browser code must never receive provider API keys, Stripe secret keys, service-role keys, or database secrets.

Core server modules:

- `server/wallet`: ledger writes, balance reads, adjustment logic, wallet creation.
- `server/stripe`: checkout session creation, webhook verification, idempotent event processing.
- `server/ai`: provider router, OpenAI request execution, usage extraction, credit deduction.
- `server/admin`: role checks, admin audit logging, adjustment validation.
- `lib/env`: typed environment variable validation.
- `lib/validation`: shared Zod schemas.

## 2. Database Schema

Use UUID primary keys for app tables where practical. Use large integers for balances, credit units, token counts, and provider cost micros.

Recommended conventions:

- IDs: `uuid` primary keys with database-generated defaults.
- Auth user IDs: `uuid`, aligned with Supabase Auth user IDs.
- Timestamps: `timestamptz`.
- Credit amounts: `bigint` integer credit units.
- Provider costs: `bigint` micros, not floating point.
- Token counts: `bigint`.
- Money paid to Stripe: integer cents.
- Structured metadata: `jsonb` only where fixed columns are not practical.

Core tables:

### `profiles`

Stores application profile and role data for Supabase-authenticated users.

Important fields:

- `id uuid primary key`
- `email text not null`
- `display_name text`
- `role text not null default 'user'`
- `status text not null default 'active'`
- `created_at timestamptz not null`
- `updated_at timestamptz not null`

Constraints:

- `role in ('user', 'admin')`
- `status in ('active', 'disabled')`

MVP admin authorization must use this DB-backed role, not email-only checks. An email allowlist can be used only for initial bootstrap/seeding.

### `wallets`

One wallet per user.

Important fields:

- `id uuid primary key`
- `user_id uuid not null unique references profiles(id)`
- `cached_balance_units bigint not null default 0`
- `status text not null default 'active'`
- `created_at timestamptz not null`
- `updated_at timestamptz not null`

The ledger remains the source of truth. `cached_balance_units` is a performance cache and must be reconcilable to ledger entries.

### `wallet_ledger`

Append-only record of every wallet balance mutation.

Important fields:

- `id uuid primary key`
- `wallet_id uuid not null references wallets(id)`
- `user_id uuid not null references profiles(id)`
- `entry_type text not null`
- `amount_units bigint not null`
- `balance_before_units bigint not null`
- `balance_after_units bigint not null`
- `source_type text not null`
- `source_id text`
- `idempotency_key text not null unique`
- `reason text`
- `admin_user_id uuid references profiles(id)`
- `metadata jsonb`
- `created_at timestamptz not null`

Entry types:

- `stripe_purchase_credit`
- `ai_usage_debit`
- `admin_credit`
- `admin_debit`
- `refund_debit`
- `reversal_credit`

Rules:

- Inserts only. No update or delete path in app code.
- Debit entries use negative `amount_units`.
- Credit entries use positive `amount_units`.
- Non-admin system entries must include a deterministic idempotency key.
- Admin entries must include `admin_user_id` and `reason`.

### `credit_packages`

Local source of truth for purchasable credit packs.

Important fields:

- `id uuid primary key`
- `slug text not null unique`
- `name text not null`
- `description text`
- `credit_units bigint not null`
- `price_cents bigint not null`
- `currency text not null default 'usd'`
- `stripe_price_id text`
- `active boolean not null default true`
- `sort_order integer not null default 0`
- `created_at timestamptz not null`
- `updated_at timestamptz not null`

Stripe metadata must not be trusted as the source of truth for package contents. The local `credit_packages` row determines credits granted.

### `stripe_customers`

Maps application users to Stripe Customers.

Important fields:

- `id uuid primary key`
- `user_id uuid not null unique references profiles(id)`
- `stripe_customer_id text not null unique`
- `created_at timestamptz not null`
- `updated_at timestamptz not null`

### `stripe_checkout_sessions`

Stores locally created checkout sessions.

Important fields:

- `id uuid primary key`
- `user_id uuid not null references profiles(id)`
- `credit_package_id uuid not null references credit_packages(id)`
- `stripe_checkout_session_id text not null unique`
- `stripe_customer_id text`
- `status text not null`
- `credit_units bigint not null`
- `amount_total_cents bigint`
- `currency text`
- `credited_ledger_entry_id uuid references wallet_ledger(id)`
- `created_at timestamptz not null`
- `completed_at timestamptz`

The webhook reconciles Stripe events to this local row. Metadata is only a lookup/reconciliation aid.

### `stripe_events`

Stores webhook event processing state.

Important fields:

- `id uuid primary key`
- `stripe_event_id text not null unique`
- `event_type text not null`
- `processing_status text not null`
- `payload jsonb not null`
- `error_message text`
- `received_at timestamptz not null`
- `processed_at timestamptz`

### `ai_requests`

Stores AI request metadata. Do not store full raw prompts by default.

Important fields:

- `id uuid primary key`
- `user_id uuid not null references profiles(id)`
- `wallet_id uuid not null references wallets(id)`
- `provider text not null`
- `model text not null`
- `status text not null`
- `response_id text`
- `prompt_preview text`
- `prompt_hash text`
- `input_token_estimate bigint`
- `output_token_estimate bigint`
- `error_code text`
- `error_message text`
- `created_at timestamptz not null`
- `completed_at timestamptz`

Prompt storage policy:

- Do not store full raw prompts by default.
- `prompt_preview` is optional and should be short, sanitized, and UI-safe.
- `prompt_hash` is optional and can support debugging/deduplication without storing prompt text.
- Store provider/model/status/usage/response ID/cost metadata instead of raw content.

### `provider_usage`

Stores actual or estimated provider usage and related wallet deduction.

Important fields:

- `id uuid primary key`
- `ai_request_id uuid not null unique references ai_requests(id)`
- `user_id uuid not null references profiles(id)`
- `provider text not null`
- `model text not null`
- `input_tokens bigint`
- `output_tokens bigint`
- `total_tokens bigint`
- `provider_cost_micros bigint`
- `credit_units_debited bigint`
- `wallet_ledger_id uuid references wallet_ledger(id)`
- `created_at timestamptz not null`

### `admin_audit_log`

Stores admin actions.

Important fields:

- `id uuid primary key`
- `admin_user_id uuid not null references profiles(id)`
- `action text not null`
- `target_type text not null`
- `target_id text`
- `metadata jsonb`
- `ip_address text`
- `user_agent text`
- `created_at timestamptz not null`

## 3. Wallet Ledger Design

The wallet ledger is append-only and is the accounting source of truth.

Balance mutation algorithm:

1. Start a database transaction.
2. Load and lock the wallet row.
3. Read `cached_balance_units` as the current balance.
4. Validate the requested ledger entry.
5. Reject debits that would make the balance negative.
6. Insert a `wallet_ledger` row with before/after balances.
7. Update `wallets.cached_balance_units`.
8. Commit.

Important invariants:

- Every wallet mutation has exactly one ledger entry.
- Ledger entries are never updated or deleted by product code.
- Admin adjustments require reason, admin user, timestamp, before balance, and after balance.
- Stripe purchase credits are idempotent.
- AI usage debits are idempotent per provider usage record.
- Balances can be recomputed from ledger entries.

Do not implement `wallet_reservations` in Phase 1 or Phase 2. Add it later only if concurrent AI usage creates meaningful overspend risk.

## 4. Stripe Checkout And Webhook Flow

Use Stripe Checkout Sessions for one-time credit pack purchases.

Checkout creation flow:

1. Authenticated user selects a package.
2. Server validates the local `credit_packages` row is active.
3. Server creates or reuses the user's Stripe Customer.
4. Server creates a Stripe Checkout Session.
5. Server stores `stripe_checkout_sessions` locally.
6. User completes payment on Stripe-hosted Checkout.

Webhook processing flow:

1. Receive webhook at `app/api/stripe/webhook`.
2. Verify the Stripe signature using the raw request body.
3. Insert or find `stripe_events` by unique Stripe event ID.
4. Ignore already processed events.
5. For `checkout.session.completed`, find the local `stripe_checkout_sessions` row by Stripe session ID.
6. Re-read the local `credit_packages` row.
7. Confirm the paid amount/currency/session status are acceptable.
8. Insert one `stripe_purchase_credit` ledger entry using a deterministic idempotency key.
9. Link the ledger entry to the checkout session.
10. Mark the Stripe event processed.

Metadata rule:

- Stripe metadata may include local IDs for reconciliation.
- Stripe metadata must not determine credit amount, package price, user identity, or ledger amount by itself.
- Local database records are the source of truth.

Refund handling:

- Refunds happen through Stripe/admin process only.
- No cash-out or wallet withdrawal.
- If a refund should remove credits, insert a `refund_debit` ledger entry.
- If the user has already spent the credits, require admin review and record the outcome.

## 5. OpenAI Provider Router Design

Use the OpenAI SDK from server code only. Default to the OpenAI Responses API for new MVP flows.

Provider router responsibilities:

- Validate request input with Zod.
- Select provider and model based on server-side configuration.
- Estimate maximum required 8i Credits before sending the provider request.
- Confirm available wallet balance.
- Create an `ai_requests` row with metadata and `pending` status.
- Call the provider server-side.
- Extract provider usage, response ID, model, status, token counts, and cost metadata.
- Insert `provider_usage`.
- Insert an `ai_usage_debit` ledger entry only for successful or billable usage.
- Mark failed requests without deducting credits unless actual provider usage was billed and recorded.

Provider interface:

```ts
type AiProviderRouter = {
  estimateCreditDebit(input: AiRequestInput): Promise<CreditEstimate>;
  createResponse(input: AiRequestInput): Promise<AiProviderResponse>;
  extractUsage(response: AiProviderResponse): ProviderUsageInput;
  mapError(error: unknown): AiProviderError;
};
```

Prompt and response storage:

- Do not store full raw prompts by default.
- Store request metadata, provider, model, status, response ID, optional prompt preview, optional prompt hash, token data, cost data, and ledger linkage.
- If future features need stored conversations, require an explicit product/privacy decision first.

Configuration:

- `OPENAI_API_KEY`
- `OPENAI_DEFAULT_MODEL`
- `DEFAULT_CREDIT_MARGIN_BPS`
- `MIN_AI_DEBIT_UNITS`

## 6. Auth And Admin Design

Auth:

- Use Supabase Auth for signup, login, logout, and sessions.
- Create a `profiles` row for each auth user.
- Create a `wallets` row for each active user.
- Use server-side auth checks before loading user-owned data.

Admin:

- Store role in `profiles.role`.
- MVP roles: `user`, `admin`.
- Admin checks must query the database-backed role.
- Email allowlists may be used only for bootstrap/seeding and must not be the ongoing authorization source.
- All admin credit adjustments must insert wallet ledger rows and admin audit log rows.

RLS:

- Enable RLS on user-owned tables exposed through Supabase client access.
- Add indexes for `user_id` and foreign key columns used in policies.
- Wallet mutations should still go through server-side Prisma services.

## 7. Required Environment Variables

```env
DATABASE_URL=
DIRECT_URL=

NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

OPENAI_API_KEY=
OPENAI_DEFAULT_MODEL=

CREDIT_UNIT_SCALE=
DEFAULT_CREDIT_MARGIN_BPS=
MIN_AI_DEBIT_UNITS=

ADMIN_EMAIL_ALLOWLIST=
LOG_LEVEL=
```

Rules:

- Only `NEXT_PUBLIC_*` variables may be exposed to browser code.
- Never log secrets or environment variable values.
- Validate environment variables at startup.
- Use least-privilege keys where possible.

## 8. MVP Page List

Public:

- `/`
- `/pricing`
- `/terms`
- `/privacy`
- `/login`
- `/signup`

Authenticated:

- `/dashboard`
- `/wallet`
- `/wallet/buy`
- `/checkout/success`
- `/checkout/cancel`
- `/chat`
- `/usage`
- `/settings`

Admin:

- `/admin/users`
- `/admin/ledger`
- `/admin/adjustments`
- `/admin/provider-usage`
- `/admin/stripe-events`

## 9. Security Risks

Key risks:

- Duplicate Stripe webhooks granting duplicate credits.
- Stripe metadata being trusted instead of local database records.
- Race conditions causing negative balances.
- Ledger rows being updated or deleted.
- Provider keys leaking to browser code.
- Secrets appearing in logs.
- Raw prompts being stored unintentionally.
- XSS from rendering AI output.
- Admin role checks relying on email-only logic.
- Admin adjustments missing audit records.
- Refunds creating accounting inconsistencies.
- RLS gaps exposing cross-user data.
- Marketing or UI copy implying crypto, cash value, transferability, resale, or investment value.

Phase 1 TODO placeholders:

- TODO: Add basic per-user AI request rate limiting.
- TODO: Add basic checkout creation throttling.
- TODO: Add admin action monitoring alerts.

Do not overbuild rate limiting in the first implementation. Add placeholders and simple guardrails first.

## 10. Suggested Build Phases

### Phase 1: Foundation

- Scaffold Next.js App Router structure.
- Configure TypeScript, Tailwind, Prisma, and Supabase.
- Add environment validation.
- Add Supabase Auth session handling.
- Create Prisma schema and initial migrations.
- Add `profiles.role` with `user` and `admin`.
- Add basic layout and route protection.

### Phase 2: Wallet And Ledger Core

- Implement wallet creation.
- Implement append-only ledger service.
- Implement balance read and cached balance update.
- Add admin adjustment service with audit logging.
- Add tests for wallet debit, credit, idempotency, and non-negative balance enforcement.
- Do not implement wallet reservations in this phase.

### Phase 3: Stripe Credit Purchases

- Seed credit packages.
- Create Stripe Checkout Sessions.
- Store local checkout session records.
- Verify webhooks.
- Process `checkout.session.completed` idempotently.
- Grant credits from local package records only.
- Add Stripe event admin visibility.

### Phase 4: User Wallet UI

- Dashboard balance summary.
- Wallet transaction history.
- Buy Credits page.
- Checkout success/cancel pages.
- Usage history page.
- Account settings page.

### Phase 5: OpenAI Chat And Usage Deductions

- Implement server-side OpenAI provider router.
- Add AI Chat page.
- Record AI request metadata without full raw prompt storage by default.
- Record provider usage.
- Deduct credits through wallet ledger after successful or billable usage.
- Add TODO placeholders for basic rate limiting.

### Phase 6: Admin Console

- Admin users page.
- Admin wallet ledger page.
- Admin credit adjustment page.
- Admin provider usage page.
- Admin Stripe events page.
- Admin audit log visibility.

### Phase 7: Hardening

- Wallet ledger reconciliation job.
- Stripe event reconciliation job.
- Provider usage reconciliation job.
- Terms acceptance tracking.
- Wallet reservations if concurrent usage requires it.
- Stronger rate limiting.
- Operational alerts for failed webhooks and failed ledger writes.
- Security review for RLS, admin routes, logging, and prompt retention.
- Production Stripe webhook and go-live checklist.

## Verification Expectations

Before completing future coding tasks:

- Run `pnpm lint`.
- Run `pnpm build` when meaningful.
- Add or update tests for wallet/accounting logic.
- Summarize changed files.
- Identify unresolved risks.
