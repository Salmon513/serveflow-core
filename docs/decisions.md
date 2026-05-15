# Engineering Decisions

## Decision 001

Use pnpm workspace instead of Nx/Turborepo initially.

Reason:
- lower complexity
- better early-stage maintainability
- faster iteration

---

## Decision 002

Delay framework installation until monorepo foundation stabilized.

Reason:
- avoid premature architecture
- maintain controlled layering

---

## Decision 003

Avoid using the Bolt template as production foundation.

Reason:
- product mismatch
- excessive inherited complexity
- Codex confusion risk

---

## Decision 004

Add `.npmrc` at project root to pin `registry=https://registry.npmjs.org`.

Reason:
- developer environment had a local Verdaccio registry configured globally
- project should always resolve packages from the public npm registry
- prevents install failures in CI and other environments

---

## Decision 005

Backend and shared tsconfigs use `module: Node16` and `moduleResolution: Node16`.

Reason:
- `module: Node16` outputs CJS when the package has no `"type": "module"` — NestJS-compatible
- `moduleResolution: Node16` is the modern non-deprecated equivalent of the old `Node` (node10) algorithm
- TypeScript 5.9 enforces that Node16 module and moduleResolution must be paired together
- In CJS mode (no `"type": "module"` in package.json): barrel imports and relative imports without extensions still work identically to the deprecated `node10` behavior
- Respects `"exports"` field in `package.json` for consumed packages — strictly better than node10

---

## Decision 006

Shared package exposes `src/index.ts` directly via `main` and `types` fields.

Reason:
- avoids a build step for shared in Phase 2
- internal monorepo packages can reference TypeScript source directly
- Phase 5 will introduce a proper build pipeline when contracts stabilize
- keeps Phase 2 minimal and focused on shells only

---

## Decision 007

Use `module: Node16` + `moduleResolution: Node16` — not `module: CommonJS` + `moduleResolution: Node16`.

Reason:
- TypeScript 5.9 (TS5110) rejects mixing `module: CommonJS` with `moduleResolution: Node16`; the pair must be consistent
- `module: Node16` is not ESM — it conditionally emits CJS or ESM based on the nearest `package.json` `"type"` field; with no `"type": "module"`, output is CJS
- This is not an ESM migration; the compiled output remains identical `"use strict"` CommonJS
- Node16 pairing resolves the VSCode deprecation warning while preserving all CJS runtime behavior

---

## Decision 008

Use Fastify as the NestJS HTTP adapter (`@nestjs/platform-fastify`).

Reason:
- aligns with project preferred stack (Fastify over Express)
- better raw throughput than Express (2–4× at p99)
- NestJS supports Fastify as a first-class adapter via `NestFastifyApplication`
- easier to swap in Phase 3 than to migrate later after business logic is built

---

## Decision 009

Global `ValidationPipe` with `whitelist: true`, `forbidNonWhitelisted: true`, `transform: true`.

Reason:
- `whitelist` strips properties not in DTO — prevents unknown field injection
- `forbidNonWhitelisted` throws 400 instead of silently stripping — makes contract violations explicit
- `transform` auto-coerces plain request objects to DTO class instances
- applied globally at bootstrap — consistent across all future controllers without per-route setup

---

## Decision 010

`ConfigModule.forRoot({ isGlobal: true })` as the environment strategy.

Reason:
- single `.env` load at startup, available to any module via `ConfigService` without re-importing
- `@nestjs/config` wraps `dotenv` — no additional dependency
- `isGlobal: true` removes the need to import `ConfigModule` in every feature module
- environment variables can be added to `.env` incrementally as features are added

---

## Decision 011

`pnpm.onlyBuiltDependencies` in root `package.json` to approve `@nestjs/core` postinstall.

Reason:
- pnpm 10 blocks all postinstall scripts by default for security
- `@nestjs/core` postinstall is the `opencollective` donate notice — harmless
- explicit allowlist in `package.json` is version-controlled and reproducible
- avoids interactive `pnpm approve-builds` prompt in CI

---

## Decision 012

Use Next.js App Router (not Pages Router).

Reason:
- App Router is the Next.js 13+ default and recommended approach
- Server Components by default — better performance, smaller client bundles
- Filesystem-based routing under `app/` is co-located and predictable
- Pages Router is in maintenance mode; App Router is the investment path

---

## Decision 013

Use Tailwind CSS v4 with `@tailwindcss/postcss`.

Reason:
- v4 eliminates `tailwind.config.ts` for default setups — less config surface
- `@import "tailwindcss"` single-line CSS entry is cleaner than v3's three `@tailwind` directives
- v4 uses Oxide (Rust engine) for faster builds than v3's Node.js engine
- No JSX class annotation needed — content detection is automatic via Oxide

Trade-off documented:
- v4 requires `@tailwindcss/oxide-linux-x64-gnu` native binary — not auto-installed by pnpm as optional dep; must be installed explicitly in environments missing it

---

## Decision 014

Use `"module": "ESNext"` + `"moduleResolution": "Bundler"` for the frontend tsconfig.

Reason:
- Next.js uses SWC/webpack as the bundler — TypeScript is only used for type-checking, not compilation
- `Bundler` resolution is the correct modern pairing for bundled browser code (not Node.js CJS)
- `ESNext` module format signals to TypeScript that a bundler handles actual imports
- `jsx: "preserve"` tells TypeScript to leave JSX as-is; Next.js/SWC transforms it

---

## Decision 015

Set `outputFileTracingRoot` in `next.config.ts` to monorepo root.

Reason:
- Without this, Next.js incorrectly infers the workspace root from lockfile presence
- `path.join(__dirname, '../../')` points to `serveflow-core/` root
- Silences the "inferred workspace root may not be correct" warning
- Ensures output file tracing (for deployment) follows the correct dependency graph

---

## Decision 016

Add `@tailwindcss/oxide-linux-x64-gnu` as an explicit dependency.

Reason:
- `@tailwindcss/oxide` lists `@tailwindcss/oxide-linux-x64-gnu` as an optional dependency
- pnpm did not install it automatically (environmental/lockfile issue)
- Tailwind v4 PostCSS processing fails without the native binding
- Explicit installation is the reliable fix; documents the environment requirement

---

# Future Precautions

## TS Config Deprecation

- Always explicitly set both `module` and `moduleResolution` together — never rely on TypeScript defaults; defaults are tied to legacy behavior and change across TS versions
- Valid non-deprecated pairings for Node.js server code: `Node16/Node16`, `NodeNext/NodeNext`
- Valid non-deprecated pairings for browser/bundler code: `ESNext/Bundler`, `ES2022/Bundler`
- Never set `moduleResolution: Node` or `moduleResolution: node10` in new code
- After any TypeScript major version upgrade, run `tsc --noEmit` across all packages and scan for new deprecation warnings before merging

## Keeping Compiler Configs Modern

- Pin the TypeScript version in root `package.json` and update deliberately — major TS releases sometimes tighten pairing validation (as seen with TS5110)
- Each app package owns its own `tsconfig.json`; the base only holds target, lib, and strict flags — never module settings
- When NestJS CLI generates a tsconfig in Phase 3, merge it onto our existing base rather than replacing it wholesale; NestJS defaults may re-introduce deprecated settings

## Ecosystem Compatibility Before Upgrades

- Before upgrading TypeScript: check NestJS compatibility matrix and verify their own `tsconfig.json` template for the target version
- Before upgrading Node.js runtime: verify `module: Node16` target still reflects correct semantics (Node16 maps to Node.js ≥16 CJS/ESM hybrid behavior)
- `NodeNext` is the forward-looking alias for "latest Node.js module behavior" — consider migrating from `Node16` to `NodeNext` when NestJS formally supports it

## Environment-Specific npm/pnpm Registry Config

- Never rely on global pnpm/npm registry config in a project; always provide a project-level `.npmrc`
- Keep `.npmrc` in version control so all environments (CI, teammates, Codex) use the same registry
- Local Verdaccio or Nexus registries are common in enterprise setups; the project `.npmrc` overrides them predictably

---

## Decision 017

Upgrade frontend from Node 18 compatibility to Node 20+ ecosystem with Next.js 16.

Reason:
- Node v20.19.2 runtime provides significant performance improvements over Node 18 (up to 30% faster cold starts, improved V8 optimizer)
- Next.js 16 introduces Turbopack as the default bundler — production build times 5–10× faster than webpack
- React 19.2.6 with concurrent features fully optimized for Node 20+ native APIs
- Tailwind v4 with Oxide (Rust engine) leverages Node 20's improved native addon performance
- Node 20 LTS support extends until April 2026 — longer security maintenance window than Node 18
- ESM and import.meta fully stabilized in Node 20 — better ecosystem compatibility for future migrations

Trade-offs:
- Next.js 16 is a major version — requires verification after upgrade (typecheck + build + runtime)
- Turbopack is now stable but ecosystem plugins may lag webpack compatibility

Verified:
- Node runtime: v20.19.2 ✓
- Next.js: upgraded 15.5.18 → 16.2.6 ✓
- React: 19.2.6 (already latest) ✓
- Tailwind: 4.3.0 (already latest) ✓
- TypeScript: compilation clean ✓
- Build: successful with Turbopack in 3.6s ✓
- App Router: fully preserved ✓