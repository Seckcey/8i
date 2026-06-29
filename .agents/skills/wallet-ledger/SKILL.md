---
name: wallet-ledger
description: Use when building or changing wallet balances, credit purchases, deductions, refunds, admin adjustments, or ledger logic.
---

All wallet changes must use an append-only ledger.

Never update a wallet balance without recording:
- user_id
- wallet_id
- entry_type
- amount
- balance_before
- balance_after
- source
- source_id
- idempotency_key
- created_at

Ledger entries must not be deleted.

Every credit purchase, usage deduction, refund, failed adjustment, and admin adjustment must be auditable.

Prefer deriving balance from ledger entries or reconciling stored balance against ledger totals.
