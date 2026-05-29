# Current Phase

## Active Phase

Phase 7 — AI Foundation

STATUS: COMPLETED

---

# Current Objective

Introduce a production-grade AI foundation layer with centralized OpenAI access,
structured JSON outputs, DTO validation, and minimal frontend testing surfaces.

---

# Completed Work

## Phase 7 (this phase)

### Infrastructure
- `.env.example` — adds `OPENAI_API_KEY`, `OPENAI_MODEL`, `OPENAI_TIMEOUT_MS`
- `apps/backend/src/config/env.validation.ts` — validates DB + OpenAI env vars at startup
- `package.json` — root build/typecheck now includes `@serveflow/prompts`

### Prompt Layer
- `packages/prompts/` — promoted from stub to real workspace package
- `packages/prompts/src/faq/faq.prompt.ts` — FAQ prompt definition
- `packages/prompts/src/booking/booking-intent.prompt.ts` — booking intent prompt definition
- `packages/prompts/src/shared/constraints.ts` — shared JSON-only prompt constraints

### Shared Contracts
- `packages/shared/src/types/ai.ts` — FAQ + booking intent request/response contracts
- `packages/shared/src/types/index.ts` — exports AI contracts

### Backend AI Module
- `apps/backend/src/modules/ai/ai.module.ts` — isolated AI module boundary
- `apps/backend/src/modules/ai/providers/openai.provider.ts` — official OpenAI SDK client with centralized timeout + retry config
- `apps/backend/src/modules/ai/ai.service.ts` — structured prompt execution, parsing, DTO validation, and error handling
- `apps/backend/src/modules/ai/ai.controller.ts` — `POST /ai/faq` and `POST /ai/booking-intent`
- `apps/backend/src/modules/ai/dto/` — request/response DTOs for FAQ and booking intent
- `apps/backend/src/modules/ai/prompts/index.ts` — backend-local adapter into `@serveflow/prompts`

### Updated Files
- `apps/backend/src/app.module.ts` — registers `AiModule` and env validation
- `apps/backend/package.json` — adds `openai`, `zod`, and `@serveflow/prompts`
- `apps/backend/tsconfig.json` — references prompts package build config
- `apps/frontend/app/page.tsx` — swaps placeholder page for AI tester UI
- `apps/frontend/components/ai-tester.tsx` — minimal frontend-backend AI testing surface

### Verification
- `pnpm install` — workspace link for `@serveflow/prompts` established ✓
- `pnpm typecheck` — shared, prompts, backend, frontend all clean ✓
- `pnpm --filter @serveflow/backend build` — clean ✓
- `pnpm --filter @serveflow/frontend build` under Node 20 — clean ✓

## Prior phases

- Phase 6: PostgreSQL persistence, migrations, repositories
- Phase 5: @serveflow/shared domain types, project references, build pipeline
- Phase 4: Next.js 16.2.6 + Turbopack, Tailwind v4, App Router
- Phase 3: NestJS 11 + Fastify backend, health endpoint
- Phase 2: TypeScript shells
- Phase 1: monorepo foundation

---

# Current Repository State

- Backend: NestJS 11 + Fastify + pg pool + AI module + CustomerRepository + BookingRepository
- AI endpoints: `/ai/faq` and `/ai/booking-intent`
- Prompt package: centralized in `packages/prompts`
- Frontend: single-page tester for backend health + Phase 7 AI endpoints
- PostgreSQL: Docker postgres:16-alpine (port 5433) OR system PostgreSQL
- No customer or booking controllers yet — repositories remain internal
- No authentication
- No WhatsApp integration yet

---

# AI Workflow

```bash
# Set backend env values, including OpenAI credentials
cp .env.example apps/backend/.env

# Start the backend
pnpm --filter @serveflow/backend build
pnpm --filter @serveflow/backend start

# Start the frontend
pnpm --filter @serveflow/frontend dev
```

---

# Build Order (unchanged)

```
pnpm build:shared   →  tsc -p tsconfig.build.json  →  dist/
pnpm build:backend  →  tsc --build                  →  dist/
pnpm build:frontend →  next build                   →  .next/
pnpm build          →  full orchestrated build
pnpm typecheck      →  build:shared + pnpm -r typecheck
```

---

# Next Recommended Action

Execute Phase 8 — WhatsApp Integration.

Goals:
- add inbound webhook handling
- validate and normalize WhatsApp payloads
- route messages into the Phase 7 AI foundation
- keep orchestration simple and explicit

---

# Upcoming Phases

- Phase 8 — WhatsApp Integration
- Phase 9 — Booking Workflow MVP

---

# Founder Reminder

Do not optimize for complexity.

Optimize for:
- shipping speed
- clarity
- maintainability
- learning velocity
