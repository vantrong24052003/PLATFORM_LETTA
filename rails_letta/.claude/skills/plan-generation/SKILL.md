---
name: plan-generation
description: Break down requirements into implementable tasks (design specialist)
---

# Plan Generation

**Purpose**: Convert clarified requirements → task breakdown

## Task Flow

```
Validate ISSUE → Extract Requirements → Generate Tasks → Find Files → Write PLAN
```

### Step 1: Validate Prerequisite
```bash
grep "## Clarification Chosen" {ISSUE} | grep "Selected:"
```
If missing: ERROR "Run /create-issue first"

### Step 2: Extract Requirements
- Read all FR from ISSUE
- Read "Clarification Chosen" for technical decisions
- Note: NFR affects approach but doesn't become tasks

### Step 3: Generate Tasks
For EACH FR:
- Create 1 task (T1, T2, T3...)
- Description: "Verb + object + detail"
  - "Add LIST_AGENTS endpoint constant"
  - "Create List service for agent listing"
  - "Add routes for external agents"
- Map to file: which file to modify/create

### Step 4: Find Files
- Use Glob to find similar existing code
- Identify: services, controllers, routes, endpoints
- Note reference files for patterns

### Step 5: Complete PLAN
- Approach: 2-3 sentences (pattern + key decisions)
- Files to Change: table with File | Action | Reference
- Tasks: table with ID | Task | File | Status
- Test Strategy: 3+ bullets
- Risks: table with Risk | Mitigation

## Constraints
- Task count = FR count (one task per FR)
- Each task maps to exactly one file
- No vague descriptions ("implement feature" ✗)

