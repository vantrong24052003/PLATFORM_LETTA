---
name: plan-generation
description: Generates a technical implementation plan from a clarified issue.
---

# Plan Generation Skill

## Input
```
.claude/workflow/issues/ISSUE-XXX.md
```

## Output
```json
{
  "technical_approach": "string",
  "tasks": [
    {
      "id": "T1",
      "description": "string",
      "depends_on": []
    }
  ],
  "risks": ["string"],
  "test_strategy": ["string"]
}
```

## Behavior
1. Check if section `## Clarification Chosen` exists
2. If section missing: return error
3. If section exists: generate plan
4. Generate task IDs: T1, T2, T3 in order
5. Map each task to one requirement
6. Generate 3 test strategies

## Constraints
1. Task count equals requirement count
2. No new tasks beyond requirements
3. No fallback to natural language

## Exit Codes
- `0`: Success
- `1`: Input file missing
- `2`: Clarification Chosen section missing
