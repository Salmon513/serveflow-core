# Current Sprint

## Phase 1 — Monorepo Foundation
### Completed
- [x] Setup repo structure
- [x] Setup Codex memory system
- [x] Setup pnpm workspace
- [x] Setup root TypeScript foundation
- [x] Setup workspace structure
- [x] Setup roadmap system
- [x] Setup session recovery system

---

## Phase 2 — TypeScript App Initialization
### Completed
- [x] Create TypeScript backend/frontend shells
- [x] Create backend/frontend tsconfigs (Node16/Node16 pair)
- [x] Initialize shared package exports
- [x] Add `.npmrc` for public npm registry
- [x] Verify all packages typecheck clean
- [x] Fix deprecated `moduleResolution: Node` → `Node16/Node16` pair

---

## Phase 3 — NestJS Backend Setup
### Completed
- [x] Install NestJS core packages (v11) + Fastify adapter
- [x] Install `@nestjs/config`, `class-validator`, `class-transformer`
- [x] Replace shell with NestJS `main.ts` bootstrap
- [x] Create AppModule with ConfigModule + HealthModule
- [x] Create health controller, service, module
- [x] Verify build + server start + `/health` returns `{"status":"ok"}`

---

## Phase 4 — Next.js Frontend Setup
### Completed
- [x] Install Next.js 16, React 19, Tailwind v4
- [x] Create App Router structure (app/layout.tsx, app/page.tsx, app/globals.css)
- [x] Create next.config.ts, postcss.config.mjs
- [x] Verify `next build` and `next dev` clean

---

## Phase 5 — Shared Packages & Contracts
### Completed
- [x] Create shared domain types: HealthResponse, ApiResponse<T>, Booking, Customer
- [x] Create tsconfig.build.json for shared (composite, declaration, outDir=dist)
- [x] Update shared package.json (build scripts, main/types → dist/)
- [x] Add @serveflow/shared workspace dep to backend + frontend
- [x] Configure TypeScript project references (backend → shared)
- [x] Wire HealthResponse into health service + controller
- [x] Add root orchestration scripts (build, typecheck)
- [x] Verify full typecheck + build across all packages

---

## Phase 6 — PostgreSQL Integration
### Completed
- [x] Add `.nvmrc` pinning Node 20
- [x] Add `.env.example` with DB connection variables
- [x] Create `docker-compose.yml` (postgres:16-alpine, port 5433)
- [x] Install `pg`, `dotenv` (deps); `@types/pg`, `tsx` (devDeps) in backend
- [x] Approve `esbuild` build script in root `pnpm.onlyBuiltDependencies`
- [x] Create `database/database.provider.ts` — pg Pool factory via ConfigService
- [x] Create `database/database.module.ts` — exports Pool provider
- [x] Create `database/migrations/001_create_customers.sql`
- [x] Create `database/migrations/002_create_bookings.sql`
- [x] Create `database/migrate.ts` — standalone tsx migration runner with schema_migrations tracking
- [x] Create `modules/customer/customer.repository.ts` — findById, findByPhone, create
- [x] Create `modules/customer/customer.module.ts`
- [x] Create `modules/booking/booking.repository.ts` — findById, findByCustomerId, create, updateStatus
- [x] Create `modules/booking/booking.module.ts`
- [x] Update `app.module.ts` — register DatabaseModule, CustomerModule, BookingModule
- [x] Update `health.module.ts` — import DatabaseModule
- [x] Update `health.service.ts` — async SELECT 1 DB ping
- [x] Update `health.controller.ts` — async check()
- [x] Update `packages/shared/src/types/health-response.ts` — optional db field
- [x] Add `migrate` script to backend package.json
- [x] Start PostgreSQL (Docker, port 5433)
- [x] Create `apps/backend/.env` with DB config
- [x] Run migrations: 001_create_customers ✓, 002_create_bookings ✓
- [x] Verify migration idempotency (second run: both skipped) ✓
- [x] Verify `GET /health` returns `{"status":"ok","db":"connected"}` ✓
- [x] Verify backend build: `tsc --build` clean ✓
- [x] Verify full typecheck: 0 errors ✓

---

## Phase 7 — AI Provider Abstraction + Gemini Integration
### Completed
- [x] Promote `packages/prompts` from stub to real workspace package
- [x] Add OpenAI environment variables to `.env.example`
- [x] Add backend environment validation for DB + OpenAI variables
- [x] Install official OpenAI SDK in backend
- [x] Add centralized OpenAI provider with timeout + retry handling
- [x] Create `modules/ai` with controller, service, constants, prompt adapter, and DTOs
- [x] Add structured JSON response handling for FAQ and booking intent extraction
- [x] Add shared AI request/response contracts in `@serveflow/shared`
- [x] Create `POST /ai/faq`
- [x] Create `POST /ai/booking-intent`
- [x] Create minimal frontend AI tester UI
- [x] Create `docs/ai/` documentation set
- [x] Verify backend build clean
- [x] Verify workspace typecheck clean
- [x] Verify frontend production build under Node 20 clean

---

## Phase 8 — Workflow Foundation
### Completed
- [x] Add WorkflowType + WorkflowResult to @serveflow/shared
- [x] Create workflow.types.ts — internal WorkflowInput type
- [x] Create workflow.router.ts — keyword-based routing
- [x] Create faq.handler.ts — delegates to AiService.answerFaq
- [x] Create booking.handler.ts — intent extraction + conditional BookingRepository.create
- [x] Create human-handoff.handler.ts — returns { handoffRequired: true }
- [x] Create workflow.service.ts — routes input to handler
- [x] Create workflow.module.ts — imports AiModule + BookingModule; exports WorkflowService
- [x] Register WorkflowModule in AppModule
- [x] pnpm typecheck — all packages clean ✓
- [x] pnpm build (backend) — clean ✓

---

## Phase 9 — WhatsApp Integration
### Completed
- [x] Create whatsapp.types.ts — internal Meta webhook payload types
- [x] Create whatsapp.service.ts — customer resolution, workflow dispatch, WhatsApp send
- [x] Create whatsapp.controller.ts — GET (Meta verification) + POST (inbound messages)
- [x] Create whatsapp.module.ts — imports CustomerModule + WorkflowModule
- [x] Update env.validation.ts — WHATSAPP_TOKEN, WHATSAPP_PHONE_NUMBER_ID, WHATSAPP_VERIFY_TOKEN
- [x] Register WhatsappModule in AppModule
- [x] Add WhatsApp placeholder vars to apps/backend/.env
- [x] pnpm typecheck — all packages clean ✓
- [x] pnpm --filter @serveflow/backend build — clean ✓

---

## Future

See `docs/roadmap.md` for the authoritative Roadmap v2 phase sequence.

Next phase: Phase 10 — Conversation Reliability Foundation.
