---
description: Create TASKS checklist from PLAN for implementation tracking
argument-hint: <path-to-plan>
tools: Read, Write, Glob
---

# Start Implementation from Plan

Create TASKS execution checklist from PLAN file for tracking implementation progress.

## Allowed Tools
- **Read**: Read PLAN file
- **Write**: Create TASKS file
- **Glob**: Find existing TASKS files for numbering

## Instructions

1. **Validate Input**
   - Extract path from: `$ARGUMENTS`
   - IF path is empty: RETURN "ERROR: Path required" and EXIT
   - IF file does not exist: RETURN "ERROR: File not found" and EXIT
   - IF file path not in `.claude/workflow/plans/`: RETURN "ERROR: Invalid directory" and EXIT

2. **Process Plan**
   - Use **Read** tool to read PLAN file
   - Extract tasks array with: id, description, depends_on
   - Extract N from PLAN-{N}.md

3. **Generate TASKS**
   - Create checklist for each task with sub-items
   - Identify affected files for each task
   - Track blockers

4. **Write Output**
   - Use **Write** tool to create: `.claude/workflow/implementation/TASKS-{N}.md`
   - Format includes:
     - Progress Summary table (Task, Status, Notes)
     - Execution Checklist with:
       - Task ID and description
       - Checkbox items for each task
       - Affected files
     - Blockers section

5. **Return Result**
   - RETURN: "Created: .claude/workflow/implementation/TASKS-{N}.md"
   - EXIT 0

## Usage

```bash
/start-implementation .claude/workflow/plans/PLAN-001.md
```

## Exit Codes
- `0`: Success
- `1`: Validation failed
