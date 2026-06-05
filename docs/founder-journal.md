# Founder Journal

## Roadmap Change Note

The roadmap changed after Phase 9 for a practical reason, not a strategic pivot.

Original assumption:
- once WhatsApp integration worked, deployment should come next

What implementation taught:
- a live messaging channel creates state
- real customer conversations need persistence and history
- webhook retries create duplicate-processing risk
- supportability requires auditability

What changed:
- deployment moved back one phase
- `Conversation Reliability Foundation` now comes first
- completed phases were preserved; only the future sequence was adjusted
- the original future business anchors were preserved instead of discarded

Why this matters:
- this preserves the original roadmap philosophy
- it avoids deploying a channel-driven system before it has minimum operational safety
- it is an example of founder learning through implementation, which is exactly
  how this repository is meant to evolve
