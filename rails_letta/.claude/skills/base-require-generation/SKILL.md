---
name: base-require-generation
description: Standardize raw user input into BASE-REQUIRE format (formatting specialist)
---

# Base Require Generation

**Purpose**: Transform raw user input (JIRA, email, verbal) → structured format

## Task Flow

```
Raw Input → Parse Fields → Generate IDs → Fill Template → Write File
```

### Step 1: Parse Input
- Extract: ticket_id, title, description, work_type
- Extract: FR list, NFR list, api_mapping, acceptance_criteria, out_of_scope
- If field missing: prompt user

### Step 2: Generate IDs
- FR: FR-1, FR-2, FR-3...
- NFR: NFR-1, NFR-2, NFR-3...
- File N: Find highest existing N, increment, zero-pad

### Step 3: Fill Template
- Use `.claude/workflow/base-require/.template.md`
- Fill all 9 sections
- Format tables correctly

### Step 4: Write File
- Path: `.claude/workflow/base-require/BASE-REQUIRE-{NNN}.md`
- Verify write success

## Constraints
- DO NOT analyze ambiguities
- DO NOT ask clarifying questions
- ONLY format what user provides

