# Phase Execution Principles

## Philosophy

Architecture maturity must follow product maturity.

Do NOT introduce complexity before it is required.

---

# Current Founder Priorities

1. Shipping speed
2. Maintainability
3. Simplicity
4. Customer validation
5. Long-term scalability

---

# Incremental Layering

Build in controlled phases as defined in `docs/roadmap.md`.

General layering order:
1. Foundation & structure
2. Framework setup
3. Persistence
4. AI integration
5. Workflow orchestration
6. External channel adapters
7. Reliability & state
8. Deployment & productization

---

# Complexity Rules

Avoid introducing early:
- microservices
- CQRS
- event sourcing
- Kubernetes
- workflow engines
- AI agent orchestration
- complex abstractions

---

# Codex / Claude Rules

Always:
- preserve readability
- prefer incremental changes
- explain reasoning briefly
- avoid massive rewrites
- maintain architectural consistency

---

# Startup Rule

Useful systems > impressive systems.