# Current Phase

## Active Phase

Phase 8 — Workflow Foundation

STATUS: COMPLETED

---

# Current Objective

Introduce workflow orchestration that routes customer messages into business actions.
Simple, explicit, readable — no workflow engines, no state machines, no queues.

---

# Completed Work

## Phase 8 (this phase)

### Shared Contracts
- `packages/shared/src/types/workflow.ts` — `WorkflowType` union + `WorkflowResult` interface
- `packages/shared/src/types/index.ts` — exports workflow contracts

### Workflow Module
- `apps/backend/src/modules/workflows/workflow.module.ts` — imports AiModule + BookingModule; exports WorkflowService
- `apps/backend/src/modules/workflows/workflow.service.ts` — routes and delegates to handlers
- `apps/backend/src/modules/workflows/workflow.router.ts` — keyword-based routing (booking / human_handoff / faq)
- `apps/backend/src/modules/workflows/workflow.types.ts` — internal WorkflowInput type

### Handlers
- `handlers/faq.handler.ts` — delegates to AiService.answerFaq
- `handlers/booking.handler.ts` — extracts intent via AiService, persists via BookingRepository if customerId present
- `handlers/human-handoff.handler.ts` — returns `{ handoffRequired: true }`

### Updated Files
- `apps/backend/src/app.module.ts` — registers WorkflowModule

### Verification
- `pnpm typecheck` — all packages clean ✓
- `pnpm --filter @serveflow/backend build` — clean ✓

## Prior phases

- Phase 7: AI provider abstraction + Gemini integration, structured outputs
- Phase 6: PostgreSQL persistence, migrations, repositories
- Phase 5: @serveflow/shared domain types, project references, build pipeline
- Phase 4: Next.js 16.2.6 + Turbopack, Tailwind v4, App Router
- Phase 3: NestJS 11 + Fastify backend, health endpoint
- Phase 2: TypeScript shells
- Phase 1: monorepo foundation

---

# Current Repository State

- Backend: NestJS 11 + Fastify + pg pool + AI module + WorkflowModule + CustomerRepository + BookingRepository
- WorkflowService: routes customer messages → faq / booking / human_handoff handlers
- AI endpoints: `/ai/faq` and `/ai/booking-intent` (direct AI access still available)
- Prompt package: centralized in `packages/prompts`
- Frontend: single-page tester for backend health + AI endpoints
- PostgreSQL: Docker postgres:16-alpine (port 5433) OR system PostgreSQL
- No WhatsApp integration yet (Phase 9)
- No customer or booking HTTP controllers yet
- No authentication

---

# Dependency Graph (updated)

```
AppModule
  ├── ConfigModule.forRoot({ isGlobal: true, validate: validateEnvironment })
  ├── DatabaseModule  ──────────────────────────────┐ exports DATABASE_POOL
  ├── AiModule        → exports AiService           │
  ├── HealthModule    → imports DatabaseModule       │
  ├── CustomerModule  → imports DatabaseModule       │
  ├── BookingModule   → imports DatabaseModule  ─────┘
  └── WorkflowModule  → imports AiModule + BookingModule
        ├── WorkflowRouter   (keyword routing)
        ├── FaqHandler       → AiService.answerFaq
        ├── BookingHandler   → AiService.extractBookingIntent + BookingRepository.create
        └── HumanHandoffHandler → { handoffRequired: true }
```

---

# Workflow Flow

```
WorkflowService.execute(WorkflowInput)
  → WorkflowRouter.route(message)       → WorkflowType
  → switch(workflowType)
      'faq'          → FaqHandler       → AiService.answerFaq
      'booking'      → BookingHandler   → AiService.extractBookingIntent → BookingRepository.create?
      'human_handoff'→ HumanHandoffHandler → { handoffRequired: true }
  → WorkflowResult { type, success, data }
```

---

# Next Recommended Action

Execute Phase 9 — WhatsApp Integration.

Goals:
- add inbound webhook controller
- validate and normalize WhatsApp payloads
- resolve customer from phone number (CustomerRepository)
- route message into WorkflowService
- send response back via WhatsApp API

---

# Upcoming Phases

- Phase 9 — WhatsApp Integration
- Phase 10 — First Deployable Demo
- Phase 11 — Customer Validation

---

# Founder Reminder

Do not optimize for complexity.

Optimize for:
- shipping speed
- clarity
- maintainability
- learning velocity
