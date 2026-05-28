# Architecture

## Current Stage

Phase 6 — PostgreSQL Integration Completed.

Architecture style:
modular monolith.

---

# Architecture Philosophy

Prefer:
- simplicity
- maintainability
- explicit structure
- incremental complexity

Avoid:
- premature abstractions
- microservices
- unnecessary tooling
- hidden complexity

---

# Current Monorepo Structure

```txt
serveflow-core/
│
├── .codex/
├── .nvmrc                              # pins Node 20
├── .npmrc                              # pins public npm registry
├── .gitignore
├── .env.example                        # DB + PORT env var template
├── docker-compose.yml                  # postgres:16-alpine on port 5433
├── docs/
│
├── apps/
│   ├── backend/
│   │   ├── src/
│   │   │   ├── main.ts                 # NestJS/Fastify bootstrap + ValidationPipe
│   │   │   ├── app.module.ts           # ConfigModule + DatabaseModule + HealthModule + CustomerModule + BookingModule
│   │   │   │
│   │   │   ├── database/
│   │   │   │   ├── database.provider.ts    # DATABASE_POOL token + pg Pool factory
│   │   │   │   ├── database.module.ts      # exports DATABASE_POOL
│   │   │   │   ├── migrate.ts              # standalone migration runner (tsx)
│   │   │   │   └── migrations/
│   │   │   │       ├── 001_create_customers.sql
│   │   │   │       └── 002_create_bookings.sql
│   │   │   │
│   │   │   └── modules/
│   │   │       ├── health/
│   │   │       │   ├── health.module.ts       # imports DatabaseModule
│   │   │       │   ├── health.controller.ts   # GET /health → Promise<HealthResponse>
│   │   │       │   └── health.service.ts      # SELECT 1 ping → { status, db }
│   │   │       ├── customer/
│   │   │       │   ├── customer.module.ts     # imports DatabaseModule, exports CustomerRepository
│   │   │       │   └── customer.repository.ts # findById, findByPhone, create
│   │   │       └── booking/
│   │   │           ├── booking.module.ts      # imports DatabaseModule, exports BookingRepository
│   │   │           └── booking.repository.ts  # findById, findByCustomerId, create, updateStatus
│   │   │
│   │   ├── .env                        # local DB credentials (gitignored)
│   │   ├── dist/
│   │   ├── tsconfig.json               # Node16/Node16, decorators, references → shared
│   │   └── package.json               # pg, dotenv, tsx + migrate script
│   │
│   └── frontend/
│       ├── app/
│       │   ├── globals.css
│       │   ├── layout.tsx
│       │   └── page.tsx               # HealthResponse | null placeholder
│       ├── next.config.ts
│       ├── postcss.config.mjs
│       ├── tsconfig.json
│       └── package.json
│
├── packages/
│   ├── shared/
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   └── types/
│   │   │       ├── index.ts
│   │   │       ├── health-response.ts  # { status: 'ok'; db?: '...' }
│   │   │       ├── api-response.ts
│   │   │       ├── booking.ts
│   │   │       └── customer.ts
│   │   ├── dist/
│   │   ├── tsconfig.json
│   │   ├── tsconfig.build.json
│   │   └── package.json
│   │
│   ├── prompts/                        # stub (Phase 7)
│   └── configs/                        # stub (Phase 7)
│
├── package.json                        # root scripts + pnpm.onlyBuiltDependencies
├── pnpm-workspace.yaml
└── tsconfig.base.json
```

---

# Database Architecture

## Connection Pool

```
ConfigService (NestJS)
  └── DatabaseModule (database.module.ts)
        └── DATABASE_POOL provider (database.provider.ts)
              └── new Pool({ host, port, database, user, password, max: 10 })
```

Pool is created once at app startup. Injected into repositories and HealthService via the `DATABASE_POOL` injection token.

## Dependency Graph

```
AppModule
  ├── ConfigModule.forRoot({ isGlobal: true })
  ├── DatabaseModule  ──────────────────────────────┐ exports DATABASE_POOL
  ├── HealthModule    → imports DatabaseModule       │
  ├── CustomerModule  → imports DatabaseModule       │
  └── BookingModule   → imports DatabaseModule  ─────┘
```

## Repository Pattern

Repositories are thin — DB access only, no business logic.
Raw SQL via parameterized queries (`$1`, `$2`, ...) — no ORM, no query builder.
Row-to-domain mapping is explicit (snake_case → camelCase) inside each repository.

```
CustomerRepository
  ├── findById(id)          → SELECT ... WHERE id = $1
  ├── findByPhone(phone)    → SELECT ... WHERE phone = $1
  └── create(data)          → INSERT ... RETURNING ...

BookingRepository
  ├── findById(id)              → SELECT ... WHERE id = $1
  ├── findByCustomerId(id)      → SELECT ... WHERE customer_id = $1 ORDER BY ...
  ├── create(data)              → INSERT ... RETURNING ...
  └── updateStatus(id, status)  → UPDATE ... SET status = $2 RETURNING ...
```

---

# Schema

```sql
-- customers
id          UUID         PK  DEFAULT gen_random_uuid()
name        VARCHAR(255) NOT NULL
phone       VARCHAR(50)  NOT NULL  UNIQUE
email       VARCHAR(255)
created_at  TIMESTAMPTZ  NOT NULL  DEFAULT NOW()

-- bookings
id            UUID        PK  DEFAULT gen_random_uuid()
customer_id   UUID        NOT NULL  REFERENCES customers(id) ON DELETE RESTRICT
party_size    INTEGER     NOT NULL  CHECK (party_size > 0)
requested_at  TIMESTAMPTZ NOT NULL
confirmed_at  TIMESTAMPTZ
status        VARCHAR(20) NOT NULL  DEFAULT 'pending'
              CHECK (status IN ('pending','confirmed','cancelled','completed'))
notes         TEXT
created_at    TIMESTAMPTZ NOT NULL  DEFAULT NOW()

-- indexes
idx_bookings_customer_id  ON bookings(customer_id)
idx_bookings_status       ON bookings(status)

-- migration tracking
schema_migrations
  version    VARCHAR(255) PK
  applied_at TIMESTAMPTZ  DEFAULT NOW()
```

---

# Migration System

```
apps/backend/src/database/migrations/
  001_create_customers.sql
  002_create_bookings.sql

apps/backend/src/database/migrate.ts
  1. Connects to DB via Pool
  2. Ensures schema_migrations table exists
  3. Reads *.sql files sorted by filename
  4. For each file: checks if applied, runs in BEGIN/COMMIT, records in schema_migrations
  5. ROLLBACK on failure — partial migrations never committed
```

Run: `pnpm --filter @serveflow/backend migrate`

Idempotent — safe to re-run at any time.

---

# NestJS Bootstrap Architecture (updated)

```
main.ts
  └── NestFactory.create(AppModule, FastifyAdapter)
        └── ValidationPipe (global)
        └── listen(:3000)

AppModule
  ├── ConfigModule.forRoot({ isGlobal: true })
  ├── DatabaseModule → exports pg Pool (DATABASE_POOL token)
  ├── HealthModule → HealthController GET /health → { status: 'ok', db: 'connected' }
  ├── CustomerModule → CustomerRepository (findById, findByPhone, create)
  └── BookingModule  → BookingRepository (findById, findByCustomerId, create, updateStatus)
```

---

# TypeScript Configuration Strategy

| Package | module | moduleResolution | jsx | noEmit | Notes |
|---|---|---|---|---|---|
| root tsconfig.base | — | — | — | true | strict, ES2022 |
| backend | Node16 | Node16 | — | false | CJS output; decorators; project references |
| frontend | ESNext | Bundler | preserve | true | Next.js 16 Turbopack |
| shared (typecheck) | Node16 | Node16 | — | true | noEmit |
| shared (build) | Node16 | Node16 | — | false | composite; declaration; outDir=dist |

---

# Runtime Environment

| Component | Version | Notes |
|---|---|---|
| Node.js | v20.19.2 | LTS, pinned via .nvmrc |
| PostgreSQL | 16-alpine | Docker, port 5433 |
| NestJS | 11 | Fastify adapter |
| Next.js | 16.2.6 | Turbopack |
| React | 19.2.6 | Server Components |
| Tailwind | 4.3.0 | Oxide engine |
| pg | 8.x | node-postgres, no ORM |

---

# Local Development Workflow

```bash
# 1. Start DB
docker compose up -d

# 2. Setup env
cp .env.example apps/backend/.env
# edit DB_PORT=5433 (or system PG port)

# 3. Run migrations
pnpm --filter @serveflow/backend migrate

# 4. Start backend
pnpm --filter @serveflow/backend start
# GET /health → {"status":"ok","db":"connected"}

# 5. Start frontend (separate terminal, Node 20)
pnpm --filter @serveflow/frontend dev
```

---

# Next Architecture Decision

Phase 7 — OpenAI Integration:
- OpenAI API client setup (packages/prompts for centralized prompt management)
- Structured output parsing for booking intent
- AI service layer as a NestJS injectable
- Prompt versioning strategy
