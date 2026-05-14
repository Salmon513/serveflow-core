# ServeFlow Core — Codex Instructions

## Project Goal

Build an AI-powered restaurant operations platform.

Current MVP:
- WhatsApp assistant
- menu Q&A
- booking workflows
- FAQ automation
- customer capture

---

# Engineering Principles

Prefer:
- simplicity
- maintainability
- predictable structure
- explicit architecture

Avoid:
- premature abstractions
- microservices
- excessive frameworks
- unnecessary dependencies

---

# Current Architecture

Modular monolith.

---

# Monorepo Structure

apps/
  backend/
  frontend/

packages/
  shared/
  prompts/
  configs/

docs/
workflows/
infrastructure/

---

# Documentation Rules

Always keep updated:
- docs/product.md
- docs/architecture.md
- docs/decisions.md
- docs/tasks.md

---

# AI Rules

Use:
- OpenAI APIs
- centralized prompts

Avoid:
- multi-agent complexity
- unnecessary AI frameworks

---

# Coding Rules

- Prefer readable code
- Keep modules small
- Avoid hidden magic
- Explain major decisions briefly
- Make incremental changes

---

# Founder Priority

Ship fast.
Learn from users.
Reduce complexity continuously.