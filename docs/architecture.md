# Architecture

## Current Stage

Phase 7 — AI Foundation Completed.

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
│   │   │       ├── ai/
│   │   │       │   ├── ai.module.ts           # isolated AI module
│   │   │       │   ├── ai.controller.ts       # POST /ai/faq, /ai/booking-intent
│   │   │       │   ├── ai.service.ts          # centralized prompt execution + structured parsing
│   │   │       │   ├── ai.constants.ts        # OpenAI tokens + defaults
│   │   │       │   ├── ai.types.ts            # AI module internal execution types
│   │   │       │   ├── dto/                   # request/response DTOs
│   │   │       │   ├── prompts/               # adapter into @serveflow/prompts
│   │   │       │   └── providers/
│   │   │       │       └── openai.provider.ts # official OpenAI SDK client
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
│   │   │       ├── ai.ts               # FAQ + booking intent contracts
│   │   │       ├── api-response.ts
│   │   │       ├── booking.ts
│   │   │       └── customer.ts
│   │   ├── dist/
│   │   ├── tsconfig.json
│   │   ├── tsconfig.build.json
│   │   └── package.json
│   │
│   ├── prompts/                        # centralized prompt package
│   └── configs/                        # stub (Phase 7)
│
├── package.json                        # root scripts + pnpm.onlyBuiltDependencies
├── pnpm-workspace.yaml
└── tsconfig.base.json
```

---

# AI Architecture

## Dependency Graph

```
AppModule
  ├── ConfigModule.forRoot({ validate: validateEnvironment, isGlobal: true })
  ├── AiModule
  │    ├── OPENAI_CLIENT provider → official OpenAI SDK client
  │    ├── AiService              → structured prompt execution boundary
  │    └── AiController           → /ai/faq, /ai/booking-intent
  ├── DatabaseModule
  ├── HealthModule
  ├── CustomerModule
  └── BookingModule
```

## Prompt Package

Prompt definitions live in `packages/prompts`.

This keeps:
- prompt content versioned separately from NestJS module code
- prompt review lightweight
- business rules explicit in plain TypeScript

The backend AI module imports prompt definitions through `modules/ai/prompts/`
so the AI module still has a coherent local folder structure.

## Structured Output Flow

```
HTTP request DTO
  → AiController
    → AiService
      → OpenAI Responses API
        → JSON-structured response
          → DTO validation
            → ApiResponse<T>
```

No raw model prose is used as an internal contract.

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
  ├── ConfigModule.forRoot({ isGlobal: true, validate: validateEnvironment })
  ├── AiModule
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

Phase 8 — WhatsApp Integration:
- webhook controller boundary
- payload validation strategy
- handoff into Phase 7 AI services
- minimal message orchestration without workflow engines
