---
name: stripe-billing
description: Use when building Stripe Checkout, webhooks, credit packages, payment success handling, refunds, or billing records.
---

Use Stripe Checkout for MVP.

Webhook handlers must:
- Verify Stripe webhook signature
- Be idempotent
- Store processed event IDs
- Never trust client-submitted payment status
- Credit the wallet only after verified payment success
- Record all wallet mutations in the append-only ledger

Do not store card data.

Do not create cash-out or transfer features.
