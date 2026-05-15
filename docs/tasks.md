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

- [x] Create TypeScript backend shell (`apps/backend/src/index.ts`)
- [x] Create backend tsconfig extending base (Node16/Node16 pair)
- [x] Add `@types/node` devDependency to backend
- [x] Create minimal backend entrypoint (prepared for NestJS bootstrap)
- [x] Create TypeScript frontend shell (`apps/frontend/src/index.ts`)
- [x] Create frontend tsconfig extending base (DOM lib included)
- [x] Initialize shared package exports (`packages/shared/src/index.ts`)
- [x] Create shared types structure (`packages/shared/src/types/index.ts`)
- [x] Add `.npmrc` for public npm registry
- [x] Verify all packages typecheck clean
- [x] Verify backend build emits correctly
- [x] Fix deprecated `moduleResolution: Node` → `Node16/Node16` pair

---

## Phase 3 — NestJS Backend Setup

### Completed

- [x] Install NestJS core packages (v11)
- [x] Install Fastify HTTP adapter (`@nestjs/platform-fastify`)
- [x] Install `@nestjs/config` for environment management
- [x] Install `class-validator` + `class-transformer` for ValidationPipe
- [x] Approve `@nestjs/core` build script via `pnpm.onlyBuiltDependencies`
- [x] Add `experimentalDecorators` + `emitDecoratorMetadata` to backend tsconfig
- [x] Add `sourceMap: true` to backend tsconfig
- [x] Replace Phase 2 shell with NestJS `main.ts` bootstrap
- [x] Create `app.module.ts` with `ConfigModule` (global) + `HealthModule`
- [x] Create `modules/health/health.service.ts` with `check()` returning `{ status: 'ok' }`
- [x] Create `modules/health/health.controller.ts` with `GET /health`
- [x] Create `modules/health/health.module.ts`
- [x] Add `clean` script to backend package.json
- [x] Verify typecheck passes
- [x] Verify build compiles cleanly
- [x] Verify server starts and `/health` returns `{"status":"ok"}`

---

## Phase 4 — Next.js Frontend Setup

### Completed

- [x] Install Next.js 15, React 19, react-dom
- [x] Install `@types/react`, `@types/react-dom`
- [x] Install Tailwind CSS v4 + `@tailwindcss/postcss`
- [x] Approve `sharp` build script via `pnpm.onlyBuiltDependencies`
- [x] Install missing `@tailwindcss/oxide-linux-x64-gnu` platform binary
- [x] Delete Phase 2 `src/` shell
- [x] Write Next.js-compatible `tsconfig.json` (ESNext/Bundler, jsx: preserve)
- [x] Create `next.config.ts` with `outputFileTracingRoot` for monorepo
- [x] Create `postcss.config.mjs` for Tailwind v4
- [x] Create `app/globals.css` with `@import "tailwindcss"`
- [x] Create `app/layout.tsx` with metadata and root HTML/body
- [x] Create `app/page.tsx` dashboard placeholder with Tailwind styles
- [x] Create `components/.gitkeep` and `lib/.gitkeep` placeholders
- [x] Add `tsconfig.tsbuildinfo` and `next-env.d.ts` to `.gitignore`
- [x] Verify `next build` compiles clean
- [x] Verify `next dev` starts and `GET /` returns HTTP 200
- [x] Verify `<title>ServeFlow</title>` and H1 render with Tailwind classes
- [x] Verify typecheck passes

---

## Phase 5 — Shared Packages & Contracts

### Upcoming Tasks

- [ ] Define shared domain types (Restaurant, Booking, Customer, etc.)
- [ ] Define API contract types (request/response shapes)
- [ ] Setup proper build pipeline for shared package
- [ ] Configure TypeScript project references
- [ ] Export reusable utilities

---

## Future

- Phase 6: PostgreSQL integration
- Phase 7: OpenAI integration
- Phase 8: WhatsApp integration
- Phase 9: Booking workflow MVP
- Phase 10: First deployable demo
