# Phase Completion Protocol

Use this workflow whenever a phase is completed.

---

# Phase Completion Prompt

Read:

1. .codex/instructions.md
2. docs/current-phase.md
3. docs/roadmap.md
4. docs/tasks.md
5. docs/decisions.md
6. docs/architecture.md

Then:

## 1. Analyze Current Progress

Identify:
- completed work
- created files
- architectural decisions
- current repository state
- important milestones

---

## 2. Update Documentation

Update:
- docs/tasks.md
- docs/current-phase.md
- docs/decisions.md
- docs/architecture.md (if architecture changed)

Requirements:
- mark completed tasks
- update active phase
- define next phase
- preserve architectural consistency

---

## 3. Generate Phase Summary

Provide:
- phase summary
- completed milestones
- architecture changes
- intentional omissions
- current repo status
- next recommended phase

---

## 4. Generate Notion Update Content

Generate a structured markdown block suitable for the Notion day log page.

Include:
- phase completion title
- completed work
- created files
- architecture decisions
- current status
- next phase
- founder milestone summary

Keep formatting clean and readable.

---

## 5. Prepare Next Phase

Identify:
- next phase objective
- next implementation scope
- things intentionally delayed
- architectural constraints

---

# Important Rules

Do NOT:
- skip documentation updates
- introduce unplanned complexity
- jump phases
- rewrite architecture impulsively

Always:
- preserve simplicity
- maintain Codex consistency
- optimize for long-term maintainability
- keep startup velocity high