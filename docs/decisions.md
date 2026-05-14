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

---

## Decision 004

Add `.npmrc` at project root to pin `registry=https://registry.npmjs.org`.

Reason:
- developer environment had a local Verdaccio registry configured globally
- project should always resolve packages from the public npm registry
- prevents install failures in CI and other environments

---

## Decision 005

Backend and shared tsconfigs use `module: Node16` and `moduleResolution: Node16`.

Reason:
- `module: Node16` outputs CJS when the package has no `"type": "module"` — NestJS-compatible
- `moduleResolution: Node16` is the modern non-deprecated equivalent of the old `Node` (node10) algorithm
- TypeScript 5.9 enforces that Node16 module and moduleResolution must be paired together
- In CJS mode (no `"type": "module"` in package.json): barrel imports and relative imports without extensions still work identically to the deprecated `node10` behavior
- Respects `"exports"` field in `package.json` for consumed packages — strictly better than node10

---

## Decision 006

Shared package exposes `src/index.ts` directly via `main` and `types` fields.

Reason:
- avoids a build step for shared in Phase 2
- internal monorepo packages can reference TypeScript source directly
- Phase 5 will introduce a proper build pipeline when contracts stabilize
- keeps Phase 2 minimal and focused on shells only

---

## Decision 007

Use `module: Node16` + `moduleResolution: Node16` — not `module: CommonJS` + `moduleResolution: Node16`.

Reason:
- TypeScript 5.9 (TS5110) rejects mixing `module: CommonJS` with `moduleResolution: Node16`; the pair must be consistent
- `module: Node16` is not ESM — it conditionally emits CJS or ESM based on the nearest `package.json` `"type"` field; with no `"type": "module"`, output is CJS
- This is not an ESM migration; the compiled output remains identical `"use strict"` CommonJS
- Node16 pairing resolves the VSCode deprecation warning while preserving all CJS runtime behavior

---

# Future Precautions

## TS Config Deprecation

- Always explicitly set both `module` and `moduleResolution` together — never rely on TypeScript defaults; defaults are tied to legacy behavior and change across TS versions
- Valid non-deprecated pairings for Node.js server code: `Node16/Node16`, `NodeNext/NodeNext`
- Valid non-deprecated pairings for browser/bundler code: `ESNext/Bundler`, `ES2022/Bundler`
- Never set `moduleResolution: Node` or `moduleResolution: node10` in new code
- After any TypeScript major version upgrade, run `tsc --noEmit` across all packages and scan for new deprecation warnings before merging

## Keeping Compiler Configs Modern

- Pin the TypeScript version in root `package.json` and update deliberately — major TS releases sometimes tighten pairing validation (as seen with TS5110)
- Each app package owns its own `tsconfig.json`; the base only holds target, lib, and strict flags — never module settings
- When NestJS CLI generates a tsconfig in Phase 3, merge it onto our existing base rather than replacing it wholesale; NestJS defaults may re-introduce deprecated settings

## Ecosystem Compatibility Before Upgrades

- Before upgrading TypeScript: check NestJS compatibility matrix and verify their own `tsconfig.json` template for the target version
- Before upgrading Node.js runtime: verify `module: Node16` target still reflects correct semantics (Node16 maps to Node.js ≥16 CJS/ESM hybrid behavior)
- `NodeNext` is the forward-looking alias for "latest Node.js module behavior" — consider migrating from `Node16` to `NodeNext` when NestJS formally supports it

## Environment-Specific npm/pnpm Registry Config

- Never rely on global pnpm/npm registry config in a project; always provide a project-level `.npmrc`
- Keep `.npmrc` in version control so all environments (CI, teammates, Codex) use the same registry
- Local Verdaccio or Nexus registries are common in enterprise setups; the project `.npmrc` overrides them predictably