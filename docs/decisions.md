# Engineering Decisions

## Decision 001 — pnpm workspace over Nx/Turborepo
Use pnpm workspace. Lower complexity, faster early-stage iteration.

## Decision 002 — Delay framework installation
Stabilize monorepo foundation before installing frameworks. Maintain controlled layering.

## Decision 003 — Avoid Bolt template
Product mismatch, excessive inherited complexity, Codex confusion risk.

## Decision 004 — Project-level .npmrc
Pin `registry=https://registry.npmjs.org`. Prevents local Verdaccio interference in CI and other environments.

## Decision 005 — Node16/Node16 TypeScript pair for backend and shared
`module: Node16` outputs CJS (no `"type": "module"`). `moduleResolution: Node16` is the modern non-deprecated Node resolution. TypeScript 5.9 enforces this pair.

## Decision 006 — (Superseded by Decision 018)
Shared package originally pointed `main`/`types` to `src/index.ts`. Replaced in Phase 5 with a proper build pipeline.

## Decision 007 — Node16 not CommonJS + Node16
TypeScript 5.9 (TS5110) rejects mismatched pairs. `module: Node16` outputs CJS when no `"type": "module"` present — functionally identical to CommonJS but correctly paired.

## Decision 008 — Fastify adapter for NestJS
2–4× better p99 throughput than Express. First-class NestJS support. Cheaper to adopt early than migrate after business logic exists.

## Decision 009 — Global ValidationPipe
`whitelist: true` strips unknown fields. `forbidNonWhitelisted: true` makes contract violations explicit. `transform: true` coerces request objects to DTO instances. Applied globally at bootstrap.

## Decision 010 — ConfigModule.forRoot({ isGlobal: true })
Single `.env` load at startup. No re-importing ConfigModule in each feature module. `@nestjs/config` wraps dotenv — no extra dependency.

## Decision 011 — pnpm.onlyBuiltDependencies allowlist
pnpm 10 blocks all postinstall scripts by default. Explicit allowlist in `package.json` is version-controlled and CI-safe. Current allowlist: `@nestjs/core`, `esbuild`, `sharp`.

## Decision 012 — Next.js App Router
App Router is Next.js 13+ default. Server Components by default. Pages Router is in maintenance mode. Filesystem-based routing under `app/`.

## Decision 013 — Tailwind CSS v4
Eliminates `tailwind.config.ts`. Single-line CSS entry. Oxide (Rust) engine for faster builds. Native binary (`@tailwindcss/oxide-linux-x64-gnu`) must be installed explicitly on Linux.

## Decision 014 — ESNext/Bundler for frontend tsconfig
Next.js uses SWC/Turbopack — TypeScript is for type-checking only, not compilation. `Bundler` resolution is correct for bundled browser code.

## Decision 015 — outputFileTracingRoot in next.config.ts
Points to monorepo root. Ensures correct dependency graph for deployment output tracing.

## Decision 016 — Explicit @tailwindcss/oxide-linux-x64-gnu
pnpm did not auto-install this optional dep. Tailwind v4 PostCSS fails without the native binding. Explicit installation is the reliable fix.

## Decision 017 — Node 20 + Next.js 16 upgrade
Node 20 LTS. Next.js 16 introduces Turbopack default bundler (5–10× faster builds). Required for Next.js 16: `>=20.9.0`.

## Decision 018 — Dual tsconfig for shared (typecheck vs build)
`tsconfig.json` (noEmit: true) for IDE/typecheck. `tsconfig.build.json` (composite, declaration, outDir: dist) for compilation. Separation prevents accidental emission from typecheck path.

## Decision 019 — Backend uses tsc --build
Leverages project references. Incremental compilation via `.tsbuildinfo`. Auto-rebuilds shared if stale.

## Decision 020 — Frontend skips TypeScript project references
`moduleResolution: Bundler` resolves shared via workspace symlink + `types` field in package.json. Next.js/Turbopack handles compilation. No value in adding references to frontend tsconfig.

## Decision 021 — Domain types are plain TypeScript interfaces
`@serveflow/shared` has zero framework dependencies. Types serve as the single source of truth across backend, frontend, and future mobile.

---

## Decision 022 — node-postgres (pg) over ORM for Phase 6

Use `pg` (node-postgres) directly without an ORM or query builder.

Reason:
- Explicit SQL is readable, debuggable, and has no magic
- No learning curve for ORM-specific query API
- Full control over query shape, indexes, and RETURNING clauses
- No ORM migration lock-in — raw `.sql` files are portable and version-controllable
- pg is the reference PostgreSQL client for Node.js — stable, minimal, battle-tested
- Can adopt TypeORM or Drizzle in Phase 12 (SaaS evolution) if query complexity justifies it

Trade-off:
- More boilerplate per query vs ORM
- Manual row-to-domain type mapping required — acceptable at this scale

---

## Decision 023 — Versioned SQL migration files with custom runner

Use versioned `.sql` files (`001_*.sql`, `002_*.sql`, ...) and a custom TypeScript migration runner instead of a migration library (Flyway, db-migrate, golang-migrate).

Reason:
- Zero migration library dependency — one less thing to configure and maintain
- Migration files are plain SQL — readable by anyone, portable to any tool
- Custom runner is 60 lines — fully understood and controlled
- Schema tracking via `schema_migrations` table follows the industry-standard pattern
- Each migration runs in a transaction — atomic, rolled back on failure
- Idempotent by design — safe to re-run at any time

Trade-off:
- No automatic rollback scripts (up-only) — acceptable for Phase 6; add down migrations in Phase 12 if needed
- No out-of-order migration detection — file naming convention enforces order

---

## Decision 024 — pg Pool injected via NestJS DI token (DATABASE_POOL)

Export a `Pool` instance via a custom provider token (`DATABASE_POOL`) from `DatabaseModule`, rather than using `@InjectRepository` or per-repository pool construction.

Reason:
- Single connection pool shared across all repositories — no pool per repository
- Pool configuration centralized in `database.provider.ts` — one place to tune max connections, timeouts
- Clean NestJS DI pattern: repositories receive pool via `@Inject(DATABASE_POOL)`
- `DatabaseModule.exports = [...databaseProviders]` makes pool available to any importing module
- `@Optional()` injection in HealthService allows graceful startup if DB is not configured

---

## Decision 025 — tsx for migration runner, not tsc compile

Use `tsx` to run `migrate.ts` directly from source, rather than compiling it to `dist/` and running with Node.

Reason:
- Migration runner is a standalone script, not part of the server bundle
- Running from source means SQL files at `src/database/migrations/*.sql` are accessible via `__dirname`
- No file-copying step needed to get `.sql` files into `dist/`
- `tsx` is a dev dependency — not bundled into production; migrations are a pre-deployment step
- Consistent with industry practice (ts-node/tsx for scripts, tsc for server bundles)

---

## Decision 026 — Health endpoint includes DB connectivity check

`GET /health` performs `SELECT 1` against the pg pool and returns `{ status: 'ok', db: 'connected' | 'disconnected' | 'not configured' }`.

Reason:
- Validates end-to-end stack health in a single HTTP call
- Never throws — DB error caught internally, response is always `status: 'ok'` with degraded `db` field
- `@Optional()` injection means the endpoint still works if DatabaseModule is not loaded
- `HealthResponse` in shared updated with optional `db` field — backward-compatible (existing `{ status: 'ok' }` still satisfies the type)

---

## Decision 027 — Add .nvmrc at monorepo root

Pin `20` in `.nvmrc` at the repository root.

Reason:
- Next.js 16 requires `>=20.9.0` — `.nvmrc` automates `nvm use 20` for all developers
- Prevents "wrong Node version" errors in CI and on other machines
- Single source of truth for the required Node version

---

## Decision 028 — Docker Compose port 5433 for dev PostgreSQL

Map the dev PostgreSQL container to `localhost:5433` instead of the default `5432`.

Reason:
- System PostgreSQL (Ubuntu package) is already bound to `127.0.0.1:5432` on this machine
- Using `5433` avoids the port conflict without requiring system PostgreSQL to be stopped
- `DB_PORT=5433` in `.env.example` documents this explicitly

Trade-off:
- Diverges from PostgreSQL default port — must be set correctly in `.env`
- Production/CI environments will typically use `5432` — their `.env` will override correctly

---

## Decision 029 — Official OpenAI SDK only for Phase 7

Use the official `openai` Node SDK and the Responses API as the single model
integration layer.

Reason:
- aligned with current OpenAI platform direction
- first-party timeout and retry support
- structured output support via the official SDK helpers
- avoids abstraction layers before ServeFlow has multiple providers or modalities

---

## Decision 030 — Centralize prompt definitions in @serveflow/prompts

Prompts live in a dedicated workspace package instead of being embedded directly
inside services.

Reason:
- keeps prompt content versioned and reviewable
- avoids string sprawl inside NestJS services
- preserves a clean boundary between prompt content and execution code
- still simple enough for this stage: plain TypeScript, no prompt framework

---

## Decision 031 — Structured JSON outputs only

Phase 7 AI endpoints return structured JSON only, never raw text as an internal
contract.

Reason:
- feature modules need deterministic payloads
- DTO validation can reject malformed or incomplete model output
- frontend testing is simpler when response shapes are stable
- avoids fragile regex parsing of model prose

---

## Decision 032 — No AI overengineering in Phase 7

Explicitly avoid LangChain, vector databases, RAG, agents, orchestration
frameworks, embeddings infrastructure, and streaming in this phase.

Reason:
- current product maturity does not justify them
- Phase 7 only needs two deterministic extraction/answering endpoints
- simpler code is easier to debug with real customer traffic later
- Phase 8 needs communication integration, not platform complexity

---

# Future Precautions

## TS Config Deprecation
- Always pair `module` and `moduleResolution` explicitly — defaults change across TS versions
- Valid Node.js pairings: `Node16/Node16`, `NodeNext/NodeNext`
- Valid browser/bundler pairings: `ESNext/Bundler`, `ES2022/Bundler`

## Ecosystem Compatibility
- Before TypeScript major upgrades: check NestJS compatibility matrix
- Before Node.js upgrades: verify `module: Node16` semantics still hold

## Node Version
- Always `nvm use 20` before frontend builds (Next.js 16 requires `>=20.9.0`)
- `.nvmrc` at root automates this for nvm users

## Shared Package Build Dependency
- `@serveflow/shared` must be compiled before any app typecheck or build
- Backend `tsc --build` handles this automatically
- Root `pnpm typecheck` runs `build:shared` first

## Domain Type Discipline
- Keep `@serveflow/shared` free of framework imports permanently
- NestJS DTOs extend shared types but live in backend only
- Database entity mapping lives in repositories only

## Database
- Parameterize all SQL queries — never string-interpolate user input
- Keep repositories thin (DB access only); business logic belongs in services (Phase 7+)
- Add `restaurant_id` to bookings table when restaurants table is introduced (Phase 9)
- Connection pool max=10 is appropriate for Phase 6; tune when load increases
- In CI: run `pnpm migrate` before starting the server in integration test pipelines
- Migration files are append-only — never edit an applied migration; always add a new one

---

## Decision 033 — Keyword-based routing in WorkflowRouter for Phase 8

Use simple keyword matching to classify messages into workflow types rather than an AI classifier or rules engine.

Reason:
- zero latency overhead — no extra AI call per message
- explicit and auditable — the keyword lists are readable by non-engineers
- sufficient for Phase 8 validation; routing accuracy can be improved post-validation
- keeps the AI budget predictable (one call per workflow, not two)

Trade-off:
- keyword matching is brittle for ambiguous messages
- can be upgraded to AI-based intent routing in Phase 12 after real traffic data

---

## Decision 034 — Booking handler defers persistence when customerId is absent

When `customerId` is not present in `WorkflowInput`, BookingHandler returns the extracted intent only without calling BookingRepository.create.

Reason:
- customer identity resolution requires WhatsApp phone number lookup (Phase 9)
- the booking handler is still connected to the repository as required — it persists when it has enough data
- avoids storing orphaned booking records with no customer FK
- result shape (pendingCustomerResolution: true) communicates clearly what's missing to the caller

---

## Decision 036 — WhatsApp module is a channel adapter, not a business module

The WhatsApp module has one responsibility: translate the Meta webhook protocol
into WorkflowService calls and translate WorkflowResult back into WhatsApp messages.

Reason:
- business logic (routing, AI, booking persistence) remains inside WorkflowService
- a second channel (web chat, SMS) can reuse WorkflowService without touching WhatsApp code
- payload parsing and Meta API specifics are fully isolated from domain code
- testing workflows does not require a WhatsApp connection

---

## Decision 037 — POST /webhooks/whatsapp is fire-and-forget

The controller returns HTTP 200 immediately without awaiting WorkflowService processing.

Reason:
- Meta retries on any non-200 response — awaiting processing risks timeouts and duplicate messages
- all errors are caught and logged inside WhatsappService
- a failed processing attempt still attempts to send an error message to the customer
- this mirrors the standard pattern for all webhook receivers

---

## Decision 038 — Native fetch for WhatsApp Graph API calls

Use Node 20 built-in `fetch` instead of axios or node-fetch for outbound WhatsApp API calls.

Reason:
- Node 20 ships fetch natively — no new dependency needed
- call is simple (single POST, check status) — no need for an HTTP client library
- consistent with the existing no-new-dependencies constraint

---

## Decision 039 — WorkflowResult.data accessed via Record<string, unknown> cast in WhatsApp module

WhatsappService casts `result.data` to `Record<string, unknown>` rather than importing
internal handler types from the workflow module.

Reason:
- importing BookingWorkflowData from booking.handler would couple the channel adapter
  to workflow internals — violating module boundary
- `data: unknown` in WorkflowResult is intentional (Decision 035)
- the cast is safe: the switch on `result.type` ensures correct data shape per type

---

## Decision 035 — WorkflowResult.data typed as unknown

`WorkflowResult` in `@serveflow/shared` uses `data: unknown` rather than a discriminated union.

Reason:
- each workflow type returns a different data shape
- a discriminated union in shared would couple shared to backend-internal handler types
- callers inspect `type` first, then cast/narrow `data` — which is the correct pattern for heterogeneous results
- keeps shared contracts minimal per Phase 8 scope
