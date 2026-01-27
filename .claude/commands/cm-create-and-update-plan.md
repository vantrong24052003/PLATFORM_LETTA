---
allowed-tools: Read, Write, Edit, Bash, Grep, Glob, mcp__web-search-prime__webSearchPrime, mcp__web-reader__webReader
argument-hint: "<feature-name> <phase-number>"
description: Create implementation plan with templates (00-04.md)
---

# cm-create-and-update-plan - Create Implementation Plan

**Hello Boss!** Create PLANS in `.claude/plan/letta/`.

---

## Step 1: ASK FIRST - What do you want to plan?

```markdown
## What do you want to plan?

1. **New feature** - New functionality from scratch
2. **Next phase** - Continue existing feature (Phase5, Phase6...)
3. **Update existing plan** - Modify current plan

Which one?
```

```markdown
## Feature/Phase name?

Please provide:
- Feature name (e.g., "agent-search", "webhook-integration")
- Phase number (if continuing)

Your input:
```

---

## Step 2: Read Existing Context

Read `.claude/CLAUDE.md` and similar phase plans.

---

## Step 3: Show Plan Structure Before Creating

```markdown
## Will create:

.claude/plan/letta/Phase<N>_<feature>/
├── 00-overview.md       # Business & technical goals
├── 01-database-schema.md # DB design
├── 02-api-design.md     # API endpoints
├── 03-implementation.md # Code structure
└── 04-testing.md        # Test strategy

Approve? (yes/no)
```

---

**Boss, ready to clarify what to plan!**
