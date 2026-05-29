# AI Architecture

## Phase 7 Scope

ServeFlow Phase 7 introduces a production-oriented AI foundation layer.

It includes:
- official OpenAI SDK integration
- centralized prompt definitions
- structured JSON outputs only
- backend AI module isolation
- DTO validation for request and response boundaries

It intentionally excludes:
- LangChain
- vector databases
- retrieval pipelines
- agents
- orchestration frameworks
- streaming

---

## Module Boundary

The AI layer lives in:

`apps/backend/src/modules/ai`

Responsibilities:
- accept validated AI requests from controllers
- execute prompt definitions through the OpenAI SDK
- enforce structured outputs
- validate parsed payloads before returning them
- isolate timeout and retry handling

Feature modules should not call OpenAI directly.

---

## Prompt Boundary

Prompt definitions live in:

`packages/prompts`

The backend AI module imports those prompt definitions through its local
`prompts/` adapter folder so prompt content stays centralized while the backend
keeps a cohesive module structure.

---

## Structured Output Boundary

ServeFlow does not accept raw model prose as an integration contract.

Every AI endpoint must:
1. define the expected structured shape
2. request JSON-structured output from the model
3. validate the parsed output against backend DTOs
4. return the validated payload inside `ApiResponse<T>`

That keeps downstream feature modules deterministic and testable.
