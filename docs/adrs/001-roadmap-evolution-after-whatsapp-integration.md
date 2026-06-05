# ADR 001 — Roadmap Evolution After WhatsApp Integration

## Status

Accepted

## Context

ServeFlow's original roadmap intentionally emphasized:

- modular monolith architecture
- business-first development
- incremental learning
- deployable MVP progression
- architectural education through implementation

That roadmap was correct in principle and remains the basis of the project.

Through Phases 1–9, the repository gained:

- shared contracts
- persistence
- AI provider abstraction
- workflow orchestration
- a real WhatsApp channel adapter

Once WhatsApp integration existed in code, a new architectural reality became
visible: ServeFlow was no longer a purely stateless request/response system.

## Original Roadmap

The original future sequence after Phase 9 was:

- Phase 10 — First Deployable Demo
- Phase 11 — Customer Validation / Restaurant Onboarding
- later SaaS evolution

This assumed deployment could happen immediately after the first external
channel was connected.

## Implementation Findings

Implementation revealed a missing foundational capability between channel
integration and safe deployment:

- conversation persistence
- session management
- message history
- idempotency
- auditability

Why this matters:

- external webhook systems can retry
- customer conversations are multi-turn, not single-request
- support and debugging require a durable history
- bookings and workflow actions must be protected from duplicate processing

These needs were not speculative. They became evident from the repository's
actual shape after Phase 9.

## Decision

The roadmap will evolve intentionally rather than be replaced.

Decision:

1. Preserve completed phases unchanged.
2. Preserve the original architectural philosophy.
3. Insert `Phase 10 — Conversation Reliability Foundation`.
4. Move deployment to `Phase 11 — First Deployable Demo`.
5. Keep the remaining roadmap conservative and close to the original sequence.
6. Treat `docs/roadmap.md` as the authoritative Roadmap v2 document for all
   future development.

Original roadmap anchors that remain intentionally preserved:

- Booking Workflow MVP
- First Deployable Demo
- Customer Validation
- SaaS Evolution Planning

## Consequences

Positive:

- deployment follows minimum operational correctness
- the roadmap teaches a more accurate architecture lesson
- future contributors inherit one consistent phase sequence
- the product path remains business-first while becoming safer
- completed history and existing learning progression remain intact

Trade-off:

- the first live deployment is slightly delayed relative to the original plan
- the roadmap becomes more explicit about statefulness earlier than originally
  expected

## Future Impact

Roadmap v2 preserves the project's original strengths while improving phase
sequencing based on implementation evidence.

Future contributors should understand:

- the roadmap changed intentionally
- the change was driven by codebase reality, not theory
- the project still rejects premature complexity
- conversation reliability is now a prerequisite for deployment

This ADR is the governance record for that roadmap evolution.
