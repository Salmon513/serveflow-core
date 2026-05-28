# Current Phase

## Active Phase

Phase 6 — PostgreSQL Integration

STATUS: COMPLETED

---

# Current Objective

Introduce durable persistence using PostgreSQL with a minimal, explicit SQL approach.

---

# Completed Work

## Phase 6 (this phase)

### Infrastructure
- `.nvmrc` — pins Node 20 at monorepo root
- `.env.example` — DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD, PORT
- `docker-compose.yml` — postgres:16-alpine on port 5433 (5432 reserved for system Postgres)

### Database Layer
- `apps/backend/src/database/database.provider.ts` — pg Pool factory via ConfigService; 10-connection pool
- `apps/backend/src/database/database.module.ts` — exports Pool provider; imported by feature modules

### Migrations
- `apps/backend/src/database/migrations/001_create_customers.sql` — customers table with UUID PK, phone unique constraint
- `apps/backend/src/database/migrations/002_create_bookings.sql` — bookings table with FK to customers, status CHECK, party_size CHECK, indexes
- `apps/backend/src/database/migrate.ts` — standalone migration runner (tsx); tracks applied migrations in schema_migrations; per-migration transactions with rollback on failure

### Repositories
- `apps/backend/src/modules/customer/customer.repository.ts` — findById, findByPhone, create; maps snake_case rows to camelCase Customer type
- `apps/backend/src/modules/customer/customer.module.ts` — imports DatabaseModule, exports CustomerRepository
- `apps/backend/src/modules/booking/booking.repository.ts` — findById, findByCustomerId, create, updateStatus; maps rows to Booking type
- `apps/backend/src/modules/booking/booking.module.ts` — imports DatabaseModule, exports BookingRepository

### Updated Files
- `apps/backend/src/app.module.ts` — registers DatabaseModule, CustomerModule, BookingModule
- `apps/backend/src/modules/health/health.module.ts` — imports DatabaseModule
- `apps/backend/src/modules/health/health.service.ts` — async DB ping (SELECT 1); returns { status: 'ok', db: 'connected'|'disconnected'|'not configured' }
- `apps/backend/src/modules/health/health.controller.ts` — async check()
- `packages/shared/src/types/health-response.ts` — optional db field added (backward-compatible)
- `apps/backend/package.json` — pg, dotenv deps; tsx devDep; migrate script

### Verification
- `pnpm migrate` — applied 001_create_customers, 002_create_bookings ✓
- `pnpm migrate` (second run) — both skipped (idempotent) ✓
- `GET /health` returns `{"status":"ok","db":"connected"}` ✓
- Backend build: `tsc --build` clean ✓
- Full typecheck: 0 errors across shared, backend, frontend ✓

## Prior phases

- Phase 5: @serveflow/shared domain types, project references, build pipeline
- Phase 4: Next.js 16.2.6 + Turbopack, Tailwind v4, App Router
- Phase 3: NestJS 11 + Fastify backend, health endpoint
- Phase 2: TypeScript shells
- Phase 1: monorepo foundation

---

# Current Repository State

- Backend: NestJS 11 + Fastify + pg pool + CustomerRepository + BookingRepository
- Health endpoint: `/health` → `{ status: 'ok', db: 'connected' }`
- Migrations: customers + bookings tables, schema_migrations tracking
- PostgreSQL: Docker postgres:16-alpine (port 5433) OR system PostgreSQL
- No controllers for customer/booking yet — repositories ready to serve Phase 7 endpoints
- No authentication
- No AI integration yet

---

# Migration Workflow

```bash
# Start PostgreSQL
docker compose up -d

# Copy .env and set DB credentials
cp .env.example apps/backend/.env

# Run migrations
pnpm --filter @serveflow/backend migrate
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

Execute Phase 7 — OpenAI Integration.

Goals:
- add OpenAI API client
- centralized prompt management in packages/prompts
- structured AI responses
- AI service layer for menu Q&A, booking intent parsing, FAQ

---

# Upcoming Phases

- Phase 7 — OpenAI Integration
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
