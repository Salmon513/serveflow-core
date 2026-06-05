# Knowledge Vault

## Why The Roadmap Changed

Roadmap v2 exists because implementation revealed a hidden dependency:

`channel integration -> conversation reliability -> safe deployment`

The original roadmap was still directionally correct.

What changed was the understanding of what must exist before deployment.

Key lesson:
- once a product receives real customer messages, it needs durable conversation
  state before it needs wider distribution

This repository now treats the following as foundational before deployment:

- conversation persistence
- session management
- message history
- idempotency
- auditability

This is not premature architecture.

It is the minimum architecture required by the product reality discovered in
Phases 1–9.

Important governance rule:
- preserve completed roadmap history
- adjust future sequencing only when implementation evidence requires it
- preserve original future business anchors even when sequencing changes
