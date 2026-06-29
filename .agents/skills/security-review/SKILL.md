---
name: security-review
description: Use before finishing auth, payments, wallet, admin, API route, or provider integration work.
---

Check for:
- Secrets exposed to browser
- Missing auth checks
- Missing admin checks
- Broken object-level authorization
- Unsafe wallet mutation logic
- Missing Stripe signature verification
- Missing idempotency
- Logging of sensitive data
- SQL injection risk
- Open redirects
- Unvalidated inputs
- Missing rate limits

Recommend minimal fixes first.
