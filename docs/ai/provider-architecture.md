# AI Provider Architecture

## Why This Exists

ServeFlow's AI layer needs to switch model providers without forcing changes in
controllers, services, or feature modules. The provider abstraction isolates
transport, authentication, response extraction, and provider-specific failure
handling behind one backend interface.

## Dependency Inversion

The dependency direction is:

`AiController -> AiService -> AI_PROVIDER token -> concrete provider`

`AiService` depends on the `AiProvider` interface, not on any SDK. That keeps
business logic stable while provider implementations remain replaceable.

## Current Contract

Provider interface:

```ts
export interface AiProvider {
  generateJson<T>(prompt: string, schemaName: string): Promise<T>;
}
```

Current token:

```ts
export const AI_PROVIDER = Symbol('AI_PROVIDER');
```

## Current Implementation

Phase 7.1 ships one concrete provider:

- `GeminiProvider`

It is responsible for:

- sending prompts to Gemini
- authenticating with `X-goog-api-key`
- requesting JSON output
- extracting returned text
- stripping markdown code fences when present
- parsing JSON
- normalizing provider failures into backend exceptions

## Provider Selection

Provider selection happens in `AiModule` through environment configuration.

```env
AI_PROVIDER=gemini
```

Changing providers should require env changes only. The goal is that future
providers can be added to the module factory without touching `AiService`.

## Future Providers

This architecture is intentionally simple and supports later implementations
for:

- OpenAI
- Anthropic
- Ollama
- Azure OpenAI

Each future provider should implement `AiProvider` and be wired through the
same `AI_PROVIDER` token.

## Non-Goals

This abstraction does not introduce:

- LangChain
- agents
- MCP orchestration frameworks
- vector databases
- RAG layers
- workflow engines

The purpose is only provider isolation and clean dependency boundaries.

## Local Switching

When additional providers are implemented, local switching should be:

1. update `.env`
2. restart the backend
3. keep application code unchanged
