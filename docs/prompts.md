# Reusable Codex Prompts

---

# Session Recovery Prompt

Read these files completely before making decisions:

1. .codex/instructions.md
2. docs/current-phase.md
3. docs/roadmap.md
4. docs/tasks.md
5. docs/decisions.md
6. docs/architecture.md
7. docs/product.md

Then:
- summarize current state
- identify active phase
- identify next recommended step
- preserve architectural consistency
- avoid premature complexity

---

# Phase Completion Prompt

Read docs/phase-completion-protocol.md and execute the protocol completely.

---

# Cleanup Prompt

Analyze repository complexity.

Goals:
- simplify architecture
- remove unnecessary tooling
- preserve scalable foundations
- optimize for maintainability

Avoid:
- premature enterprise complexity
- experimental abstractions
- excessive frameworks

---

# Monorepo Initialization Prompt

Initialize a clean pnpm monorepo foundation.

Requirements:
- minimal complexity
- TypeScript foundation
- scalable structure
- no premature tooling
- Codex-friendly architecture

---

# Architecture Review Prompt

Review current architecture.

Focus:
- maintainability
- simplicity
- scalability
- developer clarity
- startup velocity

Identify:
- unnecessary complexity
- architectural drift
- maintainability risks