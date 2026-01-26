# Skills - Definition & Purpose

## What is a Skill? (Skill là gì?)

**Skill** is a **GENERIC, reusable meta-instruction** that guides an AI agent on **HOW** to execute a specific type of task, **independent of any particular project**.

**Key Principle**: Skills MUST be **project-agnostic**. Any AI agent in any project should be able to use them.

**Analogy**: 
- **Skill** = Universal cooking technique (e.g., "How to sauté vegetables") → Works for any cuisine
- **Plan** = Recipe for a specific dish (e.g., "Pad Thai recipe") → Only for Thai food

**Examples**:
- ✅ **Generic Skill**: `debug_application` (applies to any web app)
- ❌ **Project-Specific**: `debug_rails_letta` (only for this project)

---

## Why do we need Skills? (Tại sao cần Skills?)

**Problem**: Without skills, AI agents must learn task patterns from scratch every time.

**Solution**: Skills provide:
1. **Consistency**: Same best practices applied across projects
2. **Efficiency**: Faster execution with pre-defined guidelines
3. **Quality**: Avoid common mistakes through documented anti-patterns
4. **Reusability**: Use across multiple projects/contexts

---

## When to use Skills? (Khi nào dùng Skills?)

Use skills when:
- Starting a new phase of work (e.g., backend setup, frontend integration)
- Facing a common development pattern (e.g., multi-tenancy, API integration)
- Need quality guardrails (e.g., testing, code review)

**Do NOT use** for:
- Project-specific implementations (use Plans instead)
- One-time tasks (write inline instructions)
- Trivial operations (no skill needed)

---

## Where are Skills stored? (Skills lưu ở đâu?)

```
.agent/skills/
├── 01-debug-application/
│   └── SKILL.md          # Guidelines for debugging web apps
├── 02-refactor-code/
│   └── SKILL.md          # Guidelines for code refactoring
├── 03-write-tests/
│   └── SKILL.md          # Guidelines for testing
├── 04-api-design/
│   └── SKILL.md          # Guidelines for API design
├── 05-database-migration/
│   ├── SKILL.md          # Guidelines for migrations
│   ├── scripts/          # Helper scripts
│   └── references/       # Migration templates
├── 06-code-review/
│   └── SKILL.md          # Guidelines for code reviews
└── 07-research/
    └── SKILL.md          # Guidelines for research
```

**Each skill folder contains**:
- `SKILL.md`: Core guidelines (required)
- Additional resources (optional): templates, examples, scripts

---

## Who uses Skills? (Ai dùng Skills?)

**Primary User**: AI Agent (Antigravity)
- Reads skill before executing a phase
- Follows guidelines to maintain quality

**Secondary User**: Human Developer
- Reference for best practices
- Template for creating new skills

---

## Skill vs Plan (Phân biệt)

| Aspect | Skill | Plan |
|---|---|---|
| **Nature** | General guidelines | Project-specific steps |
| **Reusability** | High (cross-project) | Low (single project) |
| **Specificity** | "How to do X" | "Do X for Project Y" |
| **Contains** | Best practices, patterns | Commands, file paths, data |
| **Example** | "Multi-tenancy pattern" | "`rails g resource Letta::BotTemplate`" |

**Skill**: HOW to build a multi-tenant Rails backend (general)
**Plan**: Build `rails_letta` backend with these tables (specific)

---

## Skill Structure (Template)

```markdown
---
name: skill-name
description: "One-line purpose"
---

# Skill: Title

## Purpose
What problem does this skill solve?

## When to Use
- Scenario 1
- Scenario 2

## Guidelines
### 1. Principle/Pattern Name
- Rule 1
- Rule 2

### 2. Another Principle
- Rule 1
- Rule 2

## Checklist for AI Agent
- [ ] Step 1
- [ ] Step 2
```

---

## Naming Convention

**Skill Folders**: `XX-action-object` (generic, reusable)
- `01-debug-application`: HOW to debug applications
- `02-refactor-code`: HOW to refactor code
- `03-write-tests`: HOW to write tests
- `04-api-design`: HOW to design APIs

**Note**: Number prefix indicates common execution order, NOT strict dependency.

---

## Summary (5W)

1. **What**: Reusable guidelines for common development tasks
2. **Why**: Ensure consistency, quality, and efficiency
3. **When**: Before starting a new phase or facing a common pattern
4. **Where**: `.agent/skills/` directory
5. **Who**: AI agents (primary), developers (secondary)

**Golden Rule**: If it contains project-specific code/data → It's a **Plan**, not a Skill.
