# ServeFlow Core — Engineering Roadmap v2

## Why Roadmap v2 Exists

The original roadmap was correct in principle:

- build in controlled layers
- keep the architecture simple
- prioritize business value
- learn software architecture through implementation

Phases 1–9 validated that direction.

Implementation also revealed one missing foundation between "channel integration"
and "safe deployment":

- conversation persistence
- session management
- message history
- idempotency
- auditability

### Original Assumption

After the first WhatsApp adapter existed, the next highest-value step would be
deployment and restaurant validation.

### Implementation Discovery

Once WhatsApp became a real inbound channel, ServeFlow was no longer a purely
stateless request/response system. Real webhook traffic introduces retries,
multi-turn conversations, duplicate delivery risk, and supportability needs.

### Roadmap Adjustment

Roadmap v2 preserves completed phases unchanged and inserts a new foundational
phase before deployment:

`Phase 10 — Conversation Reliability Foundation`

This is an evolution of the roadmap, not a replacement of it.

## Original Future Phases Preserved As Anchors

The original roadmap explicitly contained these future phases:

| Original Phase | Original Goal | Roadmap v2 Treatment |
|---|---|---|
| Phase 9 | Booking Workflow MVP | The core workflow foundation was implemented across actual Phases 8 and 9; the remaining multi-turn booking maturity is now carried by Phase 13 — Guided Booking Sessions |
| Phase 10 | First Deployable Demo | Preserved directly, moved to Phase 11 because conversation reliability must come first |
| Phase 11 | Customer Validation | Preserved as a core business activity that begins with Phase 11 deployment and continues through Phases 12 and 13 |
| Phase 12 | SaaS Evolution Planning | Preserved as a later strategic activity after validation, not as an immediate build phase |

---

## Philosophy

Build the system in controlled architectural layers.

Do NOT introduce complexity before it is needed.

Optimize for:
- clarity
- shipping speed
- maintainability
- customer validation
- long-term scalability

Preserve:
- modular monolith architecture
- business-first development
- incremental learning
- deployable product focus
- architectural education through implementation

---

## Phase Overview

| Phase | Goal | Status |
|---|---|---|
| Phase 1 | Monorepo Foundation | COMPLETED |
| Phase 2 | TypeScript App Initialization | COMPLETED |
| Phase 3 | NestJS Backend Setup | COMPLETED |
| Phase 4 | Next.js Frontend Setup | COMPLETED |
| Phase 5 | Shared Packages & Contracts | COMPLETED |
| Phase 6 | PostgreSQL Integration | COMPLETED |
| Phase 7 | AI Provider Abstraction + Gemini Integration | COMPLETED |
| Phase 8 | Workflow Foundation | COMPLETED |
| Phase 9 | WhatsApp Integration | COMPLETED |
| Phase 10 | Conversation Reliability Foundation | PENDING |
| Phase 11 | First Deployable Demo | PENDING |
| Phase 12 | Restaurant Context Model | PENDING |
| Phase 13 | Guided Booking Sessions | PENDING |
| Phase 14 | Operator Surface & Basic Auth | FUTURE |
| Phase 15 | Observability & Audit Trail | FUTURE |
| Phase 16 | Availability & Booking Rules | FUTURE |

---

# Phase 1 — Monorepo Foundation

## Objective

Create a clean pnpm monorepo foundation.

## Tasks

- Setup pnpm workspace
- Setup root package.json
- Setup tsconfig base
- Create apps structure
- Create packages structure
- Create Codex memory system

## Rules

Do NOT:
- install frameworks yet
- add CI/CD
- add Docker
- add testing
- add advanced tooling

Focus:
- clean structure
- minimal complexity
- long-term maintainability

---

# Phase 2 — TypeScript App Initialization

## Objective

Initialize lightweight backend/frontend TypeScript applications.

## Tasks

### Backend
- setup TypeScript app shell
- create src structure
- minimal entrypoint

### Frontend
- setup frontend shell
- minimal app structure

### Shared
- initialize shared package

## Rules

Do NOT:
- overabstract
- add complex tooling
- add business logic yet

---

# Phase 3 — NestJS Backend Setup

## Objective

Initialize the backend foundation properly.

## Tasks

- Install NestJS
- Setup module structure
- Setup config handling
- Setup DTO validation
- Setup environment management

## Rules

Avoid:
- CQRS
- event sourcing
- advanced patterns
- microservices

Keep:
- modular monolith
- feature-based modules

---

# Phase 4 — Next.js Frontend Setup

## Objective

Create operational dashboard foundation.

## Tasks

- Install Next.js
- Setup TailwindCSS
- Setup layout system
- Setup routing structure

## Rules

Avoid:
- animation complexity
- excessive UI libraries
- overdesigned components

---

# Phase 5 — Shared Packages & Contracts

## Objective

Create stable shared contracts.

## Tasks

- shared types
- API contracts
- reusable utilities
- centralized prompts

---

# Phase 6 — PostgreSQL Integration

## Objective

Setup persistence layer.

## Tasks

- database connection
- migrations
- schema design
- repositories

---

# Phase 7 — AI Provider Abstraction + Gemini Integration

## Objective

Add AI capabilities behind a replaceable provider boundary.

## Tasks

- provider abstraction
- provider wiring via configuration
- prompt management
- structured outputs
- AI service layer
- minimal frontend testing surface

---

# Phase 8 — Workflow Foundation

## Objective

Introduce workflow orchestration without adding workflow-engine complexity.

## Features

- message routing
- FAQ handling
- booking intent extraction
- human handoff path

---

# Phase 9 — WhatsApp Integration

## Objective

Connect the first real customer communication channel.

## Tasks

- Meta developer setup
- webhook handling
- inbound message processing
- outbound response delivery

---

# Phase 10 — Conversation Reliability Foundation

## Objective

Make the first channel operationally safe before live deployment.

## Purpose

Introduce the minimum state and audit boundaries required for real customer
traffic:

- conversation persistence
- session management
- inbound/outbound message history
- idempotency for external delivery/retry behavior
- auditability for support and debugging

## Architectural Concept

Stateful workflow systems.

## Why This Phase Exists Here

WhatsApp integration changed ServeFlow from a stateless AI demo into a system
that must survive retries, multi-turn conversations, and operational failures.
This foundation was not obvious before Phase 9 existed in code.

## Dependency

Requires Phase 9.

---

# Phase 11 — First Deployable Demo

## Objective

Deploy the first real restaurant assistant to a public environment.

## Tasks

- deployment target setup
- environment configuration
- webhook configuration
- demo stabilization
- one real restaurant trial path

## Architectural Concept

Production hardening of a modular monolith.

## Why This Phase Belongs Here

Deployment should follow minimum conversation reliability, not precede it.

## Dependency

Requires Phase 10.

---

# Phase 12 — Restaurant Context Model

## Objective

Introduce explicit restaurant, branch, and menu context into the domain model.

## Purpose

Turn ServeFlow from a generic assistant into a restaurant-specific product.

## Architectural Concept

Core domain modeling and context propagation.

## Why This Phase Belongs Here

After deployment is possible, the next step is to remove hardcoded restaurant
knowledge and make the assistant usable by a real restaurant.

## Dependency

Requires Phase 11.

---

# Phase 13 — Guided Booking Sessions

## Objective

Evolve booking from single-message extraction into a multi-turn workflow.

## Purpose

Collect missing details across turns and move from "intent detected" to
"booking completed" with live operational flow.

## Architectural Concept

Long-running application workflows.

## Why This Phase Belongs Here

Session-aware workflows only make sense once conversation state exists and
restaurant context is explicit.

## Dependency

Requires Phase 10 and Phase 12.

---

# Phase 14 — Operator Surface & Basic Auth

## Objective

Create the first internal/admin interface for restaurant operators.

## Purpose

Enable operators to manage context and inspect conversations, customers, and
bookings.

## Architectural Concept

Actor boundaries and internal product surfaces.

## Why This Phase Belongs Here

An admin surface becomes meaningful after there is real restaurant data and
stateful workflow behavior to manage.

## Dependency

Requires Phase 12 and Phase 13.

---

# Phase 15 — Observability & Audit Trail

## Objective

Make production behavior visible, supportable, and explainable.

## Purpose

Track workflow outcomes, failures, retries, and operational history.

## Architectural Concept

Operational architecture and system explainability.

## Why This Phase Belongs Here

Once the demo is live and operators exist, visibility becomes a product and
support requirement.

## Dependency

Requires Phase 11 and Phase 14.

---

# Phase 16 — Availability & Booking Rules

## Objective

Move booking from capture to actual restaurant operations logic.

## Purpose

Introduce business rules around availability, booking confirmation, and booking
constraints.

## Architectural Concept

Domain invariants and policy layers.

## Why This Phase Belongs Here

This phase should follow stable restaurant context, sessions, and operator
visibility.

## Dependency

Requires Phase 12, Phase 13, and Phase 15.

---

## Roadmap Governance

`docs/roadmap.md` is the authoritative roadmap document for future phases.

Roadmap v2 must preserve these original anchors conceptually:
- Booking Workflow MVP
- First Deployable Demo
- Customer Validation
- SaaS Evolution Planning

When implementation reveals a roadmap gap:

1. preserve completed phases unless the history itself is incorrect
2. document the original assumption
3. document the implementation discovery
4. evolve the roadmap intentionally
5. update all recovery and phase-guidance documents to match

Roadmap v2 is the current source of truth for all future development.
