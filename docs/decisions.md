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