# Daily Session Recovery Protocol

Use this prompt at the beginning of every new Codex or ChatGPT session.

---

# Recovery Prompt

Read these files completely before making decisions:

1. .codex/instructions.md
2. docs/current-phase.md
3. docs/roadmap.md
4. docs/tasks.md
5. docs/decisions.md
6. docs/architecture.md
7. docs/product.md
8. docs/phase-principles.md

Then:

1. Summarize the current project state
2. Identify the active phase
3. Identify completed work
4. Identify the next recommended step
5. Identify architectural constraints
6. Identify what should NOT be introduced yet
7. Continue execution from the exact current phase
8. Avoid repeating already completed work
9. Preserve long-term maintainability
10. Keep the architecture intentionally simple

Important:
This project follows controlled architectural layering.

Avoid:
- premature complexity
- unnecessary frameworks
- enterprise patterns
- excessive abstractions

Optimize for:
- shipping speed
- clarity
- maintainability
- customer validation
- Codex consistency

Before making changes:
- explain reasoning briefly
- prefer incremental modifications
- avoid massive rewrites

At the end:
- recommend the next execution step
- update docs/tasks.md if needed
- update docs/current-phase.md if phase changes
- update docs/decisions.md for important architectural decisions