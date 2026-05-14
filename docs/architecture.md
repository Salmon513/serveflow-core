# Architecture

## Current Stage

Phase 2 — TypeScript App Initialization Completed.

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
├── .npmrc                        # pins public npm registry
├── .gitignore
├── docs/
│
├── apps/
│   ├── backend/
│   │   ├── src/
│   │   │   └── index.ts          # minimal entrypoint (NestJS placeholder)
│   │   ├── tsconfig.json         # Node16/Node16, emits CJS to dist/
│   │   └── package.json          # build + typecheck scripts, @types/node
│   │
│   └── frontend/
│       ├── src/
│       │   └── index.ts          # minimal placeholder (Next.js placeholder)
│       ├── tsconfig.json         # DOM lib, noEmit
│       └── package.json          # typecheck script
│
├── packages/
│   ├── shared/
│   │   ├── src/
│   │   │   ├── index.ts          # re-exports all shared types
│   │   │   └── types/
│   │   │       └── index.ts      # domain types (empty until Phase 5)
│   │   ├── tsconfig.json         # Node16/Node16, noEmit
│   │   └── package.json          # main + types point to src/index.ts
│   │
│   ├── prompts/
│   │   └── package.json          # stub (Phase 7)
│   │
│   └── configs/
│       └── package.json          # stub (Phase 7)
│
├── workflows/
├── infrastructure/
│
├── package.json                  # root: typescript devDep
├── pnpm-workspace.yaml
└── tsconfig.base.json            # strict, ES2022, skipLibCheck
```

---

# TypeScript Configuration Strategy

| Package | module | moduleResolution | noEmit | Notes |
|---|---|---|---|---|
| root tsconfig.base | — | — | true | base only, strict, ES2022 — never set module here |
| backend | Node16 | Node16 | false | emits CJS (no "type":"module"); NestJS-compatible |
| frontend | — | — | true | DOM lib; Next.js owns module settings in Phase 4 |
| shared | Node16 | Node16 | true | source-referenced; same Node16 pair as backend |

---

# Shared Package Access Pattern (Phase 2)

Shared package is currently consumed by source reference:
- `packages/shared/package.json` → `"main": "src/index.ts"` + `"types": "src/index.ts"`

Phase 5 will formalize this with:
- proper build pipeline for shared
- TypeScript project references
- full API contracts and utilities

---

# Next Architecture Decision

Phase 3 will introduce NestJS. Key decisions pending:
- module directory structure (feature-based)
- config module strategy (NestJS ConfigModule vs dotenv)
- validation pipe setup (class-validator)
