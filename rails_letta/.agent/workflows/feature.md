---
description: Create a new feature with clear requirements
---

# /feature - New Feature Creation

## Required Information

Before starting, you MUST provide:

| Field | Required | Example |
|-------|----------|---------|
| **Feature Name** | ✅ Yes | "Bot Template CRUD" |
| **Description** | ✅ Yes | "Create, read, update, delete bot templates" |
| **Stack** | ✅ Yes | "Rails API + React Frontend" |
| **Priority** | Optional | High / Medium / Low |
| **Related Docs** | Optional | Link to spec docs |

---

## Usage Examples

```
/feature Bot Template CRUD
- Description: Full CRUD operations for bot templates
- Stack: Rails API (Backend), React + Antd (Frontend)
- Priority: High
```

```
/feature Widget Embed Script
- Description: Generate embeddable JS script for customers
- Stack: Vanilla JS, Rails asset pipeline
- Priority: Medium
```

---

## Workflow Steps

### 1. Gather Requirements
Ask user for missing information:
- What is the feature name?
- What does this feature do?
- What stack/technologies are involved?
- Any specific constraints?

### 2. Create Implementation Plan
Create a new folder `.agent/plan/letta/<feature-name>/` and add these 5 mandatory files:

1. `00-overview.md`
2. `01-database-schema.md`
3. `02-api-design.md`
4. `03-implementation.md`
5. `04-testing.md`

**Reference**: Follow the template in `.agent/plan/letta/README.md`.

## Tasks
- [ ] Task 1
- [ ] Task 2
...

## API Contract
[Endpoints if applicable]

## Testing Plan
[How to verify]
```

### 3. Request Review
Before coding, request user approval on the plan.

### 4. Execute
Follow the plan step by step.

### 5. Verify
// turbo
```bash
bundle exec rubocop -A
```

// turbo
```bash
bundle exec rspec
```

---

## Output Artifacts
- `.agent/plan/letta/<feature-name>/` (containing 00-04 files)
- Code changes as specified in plan
- Test files
