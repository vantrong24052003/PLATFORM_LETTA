---
name: requirement-analysis
description: Analyzes an issue to identify clear requirements, ambiguities, and provides interpretation options.
---

# Requirement Analysis Skill

## Input
```
.claude/workflow/issues/ISSUE-XXX.md
```

## Output
```json
{
  "summary": "string (max 2 sentences)",
  "clear_requirements": ["string"],
  "ambiguities": ["string"],
  "clarification_options": [
    {
      "option_id": "A",
      "developer_view": "string",
      "non_technical_view": "string"
    }
  ]
}
```

## Behavior
1. Read entire issue content
2. Extract explicitly stated requirements to `clear_requirements`
3. Extract missing information to `ambiguities`
4. If `ambiguities.length > 0`: generate 3 options
5. If `ambiguities.length = 0`: return `clarification_options: []`

## Constraints
1. Each option describes meaning only
2. No implementation details in options
3. No fallback to natural language

## Exit Codes
- `0`: Success
- `1`: Input file missing
- `2`: Input file invalid format
