---
description: Generate code from PLAN
argument-hint: <path-to-plan>
tools: Read, Write, Edit, Glob, Grep
---

# Start Implementation from Plan

Generate code skeleton from PLAN file.

## Allowed Tools
- **Read**: Read PLAN file, reference files
- **Write**: Create new files
- **Edit**: Modify existing files
- **Glob**: Find existing files
- **Grep**: Search for patterns

## Instructions

1. **Validate Input**
   - Extract path from: `$ARGUMENTS`
   - IF path is empty: RETURN "ERROR: Path required" and EXIT
   - IF file does not exist: RETURN "ERROR: File not found" and EXIT

2. **Read Plan**
   - Use **Read** tool to read PLAN file
   - Extract: tasks, files to change, technical approach

3. **Generate Code**
   - For each task in PLAN:
     - Read reference file (if specified)
     - Create/modify file according to task
     - Follow existing patterns
   - Use **Write** for new files
   - Use **Edit** for existing files

4. **Return Result**
   - List files created/modified
   - EXIT 0

## Usage

```bash
/start-implementation .claude/workflow/plans/PLAN-001.md
```

## Exit Codes
- `0`: Success
- `1`: Validation failed
