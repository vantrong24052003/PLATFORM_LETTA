---
description: Compare actual implementation against original plan to generate progress report
argument-hint: <path-to-tasks> <path-to-plan>
tools: Read, Write, Glob
---

# Compare Actual vs Plan

Compare actual implementation (TASKS file) against original plan (PLAN file) to generate progress report.

## Allowed Tools
- **Read**: Read TASKS and PLAN files
- **Write**: Create PROGRESS file
- **Glob**: Find existing PROGRESS files for numbering

## Instructions

1. **Validate Input**
   - Extract tasks_path and plan_path from: `$ARGUMENTS`
   - IF tasks_path is empty: RETURN "ERROR: TASKS path required" and EXIT
   - IF plan_path is empty: RETURN "ERROR: PLAN path required" and EXIT
   - IF tasks_file does not exist: RETURN "ERROR: TASKS file not found" and EXIT
   - IF plan_file does not exist: RETURN "ERROR: PLAN file not found" and EXIT
   - IF tasks_file not in `.claude/workflow/implementation/`: RETURN "ERROR: Invalid TASKS directory" and EXIT
   - IF plan_file not in `.claude/workflow/plans/`: RETURN "ERROR: Invalid PLAN directory" and EXIT

2. **Compare Tasks**
   - Use **Read** tool to read TASKS file (actual implementation)
   - Use **Read** tool to read PLAN file (original plan)
   - Compare task statuses: Planned vs Actual
   - Calculate progress percentage

3. **Identify Deviations**
   - Find added tasks (in TASKS but not in PLAN)
   - Find modified tasks
   - Find completed vs pending tasks

4. **Generate Progress Report**
   - Use **Write** tool to create: `.claude/workflow/progress/PROGRESS-{N}.md`
   - Use **Glob** to find existing PROGRESS files: `.claude/workflow/progress/PROGRESS-*.md`
   - N = max(existing PROGRESS numbers) + 1
   - Format includes:
     - Summary table (Total Tasks, Completed, In Progress, Progress %)
     - Task Status vs Plan table
     - Deviations section (Added Tasks, Modified Tasks)
     - Blockers section

5. **Return Result**
   - RETURN: "Created: .claude/workflow/progress/PROGRESS-{N}.md"
   - EXIT 0

## Usage

```bash
/compare-actual-vs-plan .claude/workflow/implementation/TASKS-001.md .claude/workflow/plans/PLAN-001.md
```

## Exit Codes
- `0`: Success
- `1`: Validation failed
