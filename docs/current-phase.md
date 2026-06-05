# Current Phase

## Active Phase

Phase 9 — WhatsApp Integration

STATUS: COMPLETED

---

# Current Objective

Connect ServeFlow to WhatsApp Business so real customer messages enter the workflow
layer and receive responses. Establish the first production communication channel.

---

# Completed Work

## Phase 9 (this phase)

### WhatsApp Module
- `apps/backend/src/modules/whatsapp/whatsapp.types.ts` — internal payload types for Meta webhook
- `apps/backend/src/modules/whatsapp/whatsapp.controller.ts` — GET (webhook verification) + POST (inbound messages)
- `apps/backend/src/modules/whatsapp/whatsapp.service.ts` — customer resolution, workflow dispatch, response delivery
- `apps/backend/src/modules/whatsapp/whatsapp.module.ts` — imports CustomerModule + WorkflowModule

### Updated Files
- `apps/backend/src/config/env.validation.ts` — adds WHATSAPP_TOKEN, WHATSAPP_PHONE_NUMBER_ID, WHATSAPP_VERIFY_TOKEN
- `apps/backend/src/app.module.ts` — registers WhatsappModule
- `apps/backend/.env` — placeholder WhatsApp env vars added

### Verification
- `pnpm typecheck` — all packages clean ✓
- `pnpm --filter @serveflow/backend build` — clean ✓

---

## Phase 8 (previous)

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

- Phase 8: Workflow orchestration layer (router + handlers + WorkflowService)
- Phase 7: AI provider abstraction + Gemini integration, structured outputs
- Phase 6: PostgreSQL persistence, migrations, repositories
- Phase 5: @serveflow/shared domain types, project references, build pipeline
- Phase 4: Next.js 16.2.6 + Turbopack, Tailwind v4, App Router
- Phase 3: NestJS 11 + Fastify backend, health endpoint
- Phase 2: TypeScript shells
- Phase 1: monorepo foundation

---

# Current Repository State

- Backend: NestJS 11 + Fastify + pg pool + AI module + WorkflowModule + WhatsappModule
- WhatsappModule: channel adapter — receives Meta webhooks, resolves customers, dispatches to WorkflowService
- WorkflowService: routes customer messages → faq / booking / human_handoff handlers
- AI endpoints: `/ai/faq` and `/ai/booking-intent` (direct AI access still available)
- WhatsApp endpoints: `GET /webhooks/whatsapp` (verification) + `POST /webhooks/whatsapp` (inbound)
- Prompt package: centralized in `packages/prompts`
- Frontend: single-page tester for backend health + AI endpoints
- PostgreSQL: Docker postgres:16-alpine (port 5433) OR system PostgreSQL
- No customer or booking HTTP controllers yet
- No authentication
- No restaurant/menu DB tables yet (Phase 10+)

---

# Dependency Graph (updated)

```
AppModule
  ├── ConfigModule.forRoot({ isGlobal: true, validate: validateEnvironment })
  ├── DatabaseModule  ──────────────────────────────┐ exports DATABASE_POOL
  ├── AiModule        → exports AiService           │
  ├── HealthModule    → imports DatabaseModule       │
  ├── CustomerModule  → imports DatabaseModule  ─────┤ exports CustomerRepository
  ├── BookingModule   → imports DatabaseModule  ─────┘ exports BookingRepository
  ├── WorkflowModule  → imports AiModule + BookingModule
  │     ├── WorkflowRouter   (keyword routing)
  │     ├── FaqHandler       → AiService.answerFaq
  │     ├── BookingHandler   → AiService.extractBookingIntent + BookingRepository.create
  │     └── HumanHandoffHandler → { handoffRequired: true }
  └── WhatsappModule  → imports CustomerModule + WorkflowModule
        ├── WhatsappController  → GET /webhooks/whatsapp (verification)
        │                       → POST /webhooks/whatsapp (inbound)
        └── WhatsappService     → resolves customer → WorkflowService.execute → sendMessage
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

Execute Phase 10 — First Deployable Demo.

Goals:
- deploy backend to a public URL (Railway / Render / Fly.io)
- configure Meta webhook URL to point at deployed backend
- onboard one real restaurant with hardcoded context
- validate end-to-end: WhatsApp message → AI response → booking in DB

---

# Upcoming Phases

- Phase 10 — First Deployable Demo
- Phase 11 — Restaurant Onboarding (restaurants + menus DB tables, admin API)
- Phase 12 — Live Availability + Smart Booking

---

# Founder Reminder

Do not optimize for complexity.

Optimize for:
- shipping speed
- clarity
- maintainability
- learning velocity
