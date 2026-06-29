# AGENTS.md

## Project name

8i Wallet

## Product description

8i Wallet is a prepaid AI credit wallet by 8 West Ventures. Users buy 8i Credits and spend them inside our platform on AI chat, agents, automations, document tools, image tools, coding assistants, and eventually API usage.

## Critical business rule

This is not a crypto token, not an investment product, not a money-transfer product, and not a peer-to-peer exchange.

Do not build:
- Cash-out functionality
- User-to-user credit transfers
- Resale of OpenAI, Anthropic, Google, or other provider service credits
- Anything implying 8i Credits appreciate in value
- Anything implying ownership of third-party model/provider tokens

Build:
- Prepaid software credits
- Internal wallet balance
- Append-only ledger
- Usage deductions
- Stripe checkout for credit packs
- Admin adjustment tooling
- AI provider routing
- Transparent usage history

## Technical baseline

Use:
- Next.js App Router
- TypeScript
- Tailwind CSS
- Prisma
- Supabase Postgres
- Stripe
- OpenAI SDK first
- Zod for validation

## Safety and security baseline

- Never commit secrets.
- Never log API keys.
- Never expose provider keys to the browser.
- Use server-side AI calls only.
- Every wallet mutation must be recorded in an append-only ledger.
- Balances should be derived from ledger entries when possible.
- Any admin balance adjustment must include reason, admin user, timestamp, and before/after values.
- Stripe webhook handling must verify signatures.
- All paid-credit actions must be idempotent.
- No cash-out or peer-to-peer transfers in MVP.

## UI baseline

Brand voice:
- Clean
- Premium
- Tech-forward
- Trustworthy
- Easy for small businesses to understand

Brand terms:
- Product: 8i Wallet
- Currency: 8i Credits
- Parent: 8 West Ventures
- Tagline: One wallet for every AI model.

Do not use crypto-style visuals, coin speculation language, moon/rocket language, trading charts, or investment language.

## Development workflow

Before completing a coding task:
- Run pnpm lint.
- Run pnpm build when meaningful.
- Add or update tests for core wallet/accounting logic.
- Summarize files changed.
- Identify any unresolved risks.

## OpenAI documentation rule

Always use the OpenAI developer documentation MCP server if working with OpenAI API, models, responses, Agents SDK, tools, pricing-related implementation assumptions, or error troubleshooting.
