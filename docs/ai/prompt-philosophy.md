# Prompt Philosophy

ServeFlow prompts are designed as operational instructions, not chat personas.

Each prompt definition includes:
- system role
- instructions
- expected JSON structure
- constraints

## Why this shape

- It keeps prompt intent readable in source control.
- It makes prompt reviews easier when product behavior changes.
- It avoids burying business rules inside long inline strings.

## Why overengineering was avoided

- No prompt framework was added.
- No prompt database was added.
- No memory or retrieval layer was added.

At this stage, plain TypeScript prompt definitions are enough.
