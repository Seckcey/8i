# 8i Wallet Project Baseline

## MVP goal

Build a working prepaid AI credit wallet where users can:

1. Create an account
2. Buy 8i Credits through Stripe
3. See their wallet balance
4. Use credits to send prompts to OpenAI
5. See usage history
6. See credit purchases and deductions
7. Admin can view users and ledger entries

## MVP pages

Public:
- Home
- Pricing
- Terms
- Privacy
- Login
- Signup

Authenticated:
- Dashboard
- Wallet
- Buy Credits
- AI Chat
- Usage History
- Account Settings

Admin:
- Users
- Wallet Ledger
- Credit Adjustments
- Provider Usage
- Stripe Events

## MVP database tables

- users/profile
- wallets
- wallet_ledger
- credit_packages
- stripe_customers
- stripe_checkout_sessions
- stripe_events
- ai_requests
- provider_usage
- admin_audit_log

## Credit rules

- 8i Credits are prepaid software credits.
- Credits are redeemable only inside 8i Wallet.
- Credits have no cash value.
- Credits cannot be transferred between users in MVP.
- Credits cannot be sold by users.
- Credits cannot be withdrawn.
- Refunds happen through Stripe/admin process, not wallet cash-out.

## AI usage rules

- Server estimates provider cost.
- Server calculates 8i Credit deduction.
- Server records provider, model, input tokens, output tokens, estimated provider cost, credit deduction, and request status.
- Failed provider calls should not deduct credits unless partial usage was actually billed and recorded.

## Admin rules

- Admin adjustments require reason.
- Admin actions go to audit log.
- Admin cannot delete ledger entries.