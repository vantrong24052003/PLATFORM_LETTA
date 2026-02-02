---
name: requirement-analysis
description: Detect unclear points in requirements (analysis specialist)
---

# Requirement Analysis

**Purpose**: Find ALL ambiguous/missing information in requirements

## Task Flow

```
Read Requirements → Check Categories → Generate Options → Return JSON
```

### Step 1: Parse Requirements
- Extract all FR (FR-1, FR-2...)
- Extract all NFR (NFR-1, NFR-2...)
- Note context from acceptance criteria

### Step 2: Check Categories (for EACH requirement)

For API work:
- Data Source: Local DB / External API / Hybrid?
- Response Format: Raw array / Wrapped object / Custom?
- Pagination: Cursor / Offset / None?
- Nested: Always include / Opt-in param / Never?
- Errors: Return error object / Throw exception / Result wrapper?
- Timeout: What value? Retry on timeout?
- API Key: Env var / Per-user / Shared?

For DB work:
- Table: Existing / New? Schema?
- Indexes: Which columns?
- Transaction: Yes / No?
- Soft Delete: Yes / No?
- Timestamps: Yes / No?

General:
- Auth: Required / Optional / Public?
- Filtering: Server-side / Client-side?
- Sorting: Default field / User override?
- Rate Limiting: Yes / No?
- Caching: TTL / No cache?
- Validation: Which fields required?

### Step 3: Generate Options
For EACH ambiguity found:
- Create 2-3 distinct options (A, B, C)
- Each option: simple + technical view
- Mark first as recommended

### Step 4: Return JSON
```json
{
  "ambiguities": [
    {
      "question": "Data source for FR-1?",
      "options": [
        {"id": "A", "simple": "...", "technical": "...", "recommended": true},
        {"id": "B", "simple": "...", "technical": "...", "recommended": false}
      ]
    }
  ]
}
```

## Constraints
- Check EVERY category (don't skip)
- Generate 2-3 options only
- No overlap between options

