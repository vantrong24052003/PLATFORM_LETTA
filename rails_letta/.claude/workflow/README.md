# Workflow

Linear file-based development workflow.

## Flow

```
BASE-REQUIRE → ISSUE → PLAN → TASKS → PROGRESS → PR → CODE-REVIEW
```

## Directories

| Directory | Purpose | Created By |
|-----------|---------|------------|
| base-require/ | Original requirements | /create-base-require |
| issues/ | Structured issues | /create-issue |
| plans/ | Implementation plans | /create-plan |
| implementation/ | Execution checklists | /start-implementation |
| progress/ | Progress tracking | /compare-actual-vs-plan |
| reviews/pr/ | Pull request specs | /generate-pr |
| reviews/code-review/ | Code reviews | /code-review |

## Commands

```bash
# Step 0: Create base requirement
/create-base-require <ticket-id> "<title>"

# Step 1: Create issue from base require
/create-issue .claude/workflow/base-require/BASE-REQUIRE-001.md

# Step 2: Create plan (interactive selection if ambiguities)
/create-plan .claude/workflow/issues/ISSUE-001.md

# Step 3: Start implementation
/start-implementation .claude/workflow/plans/PLAN-001.md

# Step 4: Compare actual vs plan
/compare-actual-vs-plan .claude/workflow/implementation/TASKS-001.md .claude/workflow/plans/PLAN-001.md

# Step 5: Generate PR
/generate-pr .claude/workflow/plans/PLAN-001.md .claude/workflow/progress/PROGRESS-001.md

# Step 6: Code review
/code-review .claude/workflow/reviews/pr/PR-001.md src/
```

## File Naming

- BASE-REQUIRE-{XXX}.md
- ISSUE-{XXX}.md
- PLAN-{XXX}.md
- TASKS-{XXX}.md
- PROGRESS-{XXX}.md
- PR-{XXX}.md
- CODE-REVIEW-{XXX}.md

XXX = auto-increment from 001
