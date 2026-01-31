---
description: Generate Pull Request description from PLAN and PROGRESS files
argument-hint: <path-to-plan> <path-to-progress>
tools: Read, Write, Glob
---

# Generate Pull Request Description

Generate Pull Request description from PLAN and PROGRESS files with summary, changes, and testing checklist.

## Allowed Tools
- **Read**: Read PLAN and PROGRESS files
- **Write**: Create PR file
- **Glob**: Find existing PR files for numbering

## Instructions

1. **Validate Input**
   - Extract plan_path and progress_path from: `$ARGUMENTS`
   - IF plan_path is empty: RETURN "ERROR: PLAN path required" and EXIT
   - IF progress_path is empty: RETURN "ERROR: PROGRESS path required" and EXIT
   - IF plan_file does not exist: RETURN "ERROR: PLAN file not found" and EXIT
   - IF progress_file does not exist: RETURN "ERROR: PROGRESS file not found" and EXIT
   - IF plan_file not in `.claude/workflow/plans/`: RETURN "ERROR: Invalid PLAN directory" and EXIT
   - IF progress_file not in `.claude/workflow/progress/`: RETURN "ERROR: Invalid PROGRESS directory" and EXIT

2. **Process Files**
   - Use **Read** tool to read PLAN file (technical approach, tasks)
   - Use **Read** tool to read PROGRESS file (completed tasks, deviations)
   - Extract N from PLAN-{N}.md

3. **Generate PR Description**
   - Create title from work type and summary
   - List changes with affected files
   - Include testing instructions
   - Add linked issues reference

4. **Write Output**
   - Use **Write** tool to create: `.claude/workflow/reviews/pr/PR-{N}.md`
   - Use **Glob** to find existing PR files: `.claude/workflow/reviews/pr/PR-*.md`
   - Format includes:
     - Title (feat:, fix:, refactor: etc.)
     - Summary
     - Type (Feature/Bug Fix/Refactor/etc.)
     - Changes table (File, Changes)
     - Testing section with commands and checklist
     - Linked Issues
     - Deployment Notes (Migration, Breaking changes)

5. **Return Result**
   - RETURN: "Created: .claude/workflow/reviews/pr/PR-{N}.md"
   - EXIT 0

## Usage

```bash
/generate-pr .claude/workflow/plans/PLAN-001.md .claude/workflow/progress/PROGRESS-001.md
```

## Exit Codes
- `0`: Success
- `1`: Validation failed
