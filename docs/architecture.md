# Architecture

## Current Stage

Phase 1 — Monorepo Foundation Initialized.

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
├── docs/
│
├── apps/
│   ├── backend/
│   └── frontend/
│
├── packages/
│   ├── shared/
│   ├── prompts/
│   └── configs/
│
├── workflows/
├── infrastructure/
│
├── package.json
├── pnpm-workspace.yaml
└── tsconfig.base.json