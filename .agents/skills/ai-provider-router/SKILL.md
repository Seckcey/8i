---
name: ai-provider-router
description: Use when implementing AI model calls, provider routing, token accounting, model selection, or usage deductions.
---

Provider API keys must stay server-side only.

Every AI request should record:
- user_id
- provider
- model
- prompt/input metadata
- input token count if available
- output token count if available
- estimated provider cost
- 8i Credit deduction
- status
- error details if failed

Deduct credits only through wallet ledger.

Use OpenAI first for MVP. Design provider router so Anthropic, Gemini, Mistral, Groq, and local models can be added later.
