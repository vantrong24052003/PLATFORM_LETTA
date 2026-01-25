---
name: issues-generation
description: Find and resolve ALL requirement ambiguities (clarification specialist)
---

# Issues Generation

**Purpose**: Transform BASE-REQUIRE → ISSUE + Resolve ALL unclear points

## Task Flow

```
Read BASE-REQUIRE → Find Ambiguities → Ask User → Record Choices → Write ISSUE
```

### Step 1: Transform Format
- Copy: title, description, work_type
- Add Status column to FR/NFR tables
- Copy: api_mapping, acceptance_criteria
- Add placeholder: "## Clarification Chosen"

### Step 2: Find Ambiguities (call requirement-analysis)
For EACH FR/NFR, check:
- Data source (DB/API/hybrid?)
- Response format (raw/wrapped?)
- Pagination (cursor/offset?)
- Nested resources (always/opt-in/never?)
- Error handling (return error/throw?)
- Auth (required/optional/public?)
- Filtering (server-side/client-side?)
- Sorting, rate limiting, caching, validation...

### Step 3: Ask User (for EACH ambiguity)
```
Ambiguity: {question}
Context: FR-1: {requirement text}

A) {option A simple}
   → {option A technical}

B) {option B simple}
   → {option B technical}

Select: _
```

### Step 4: Record & Write
- Append all selections to "Clarification Chosen" section
- Write to `.claude/workflow/issues/ISSUE-{N}.md`

## Constraints
- MUST resolve ALL ambiguities before completing
- MUST NOT skip "obvious" ones
- MUST NOT proceed without user selection

