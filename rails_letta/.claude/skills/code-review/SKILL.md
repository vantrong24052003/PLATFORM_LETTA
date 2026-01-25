---
name: code-review
description: Verify code quality and security (review specialist)
---

# Code Review

**Purpose**: Check code before merge → find issues

## Task Flow

```
Read PLAN → Read Code Files → Check Categories → Report Issues → Verdict
```

### Step 1: Read PLAN
- Extract tasks (T1, T2, T3...)
- Extract expected files
- Note: What was supposed to be implemented

### Step 2: Read Code Files
- Read each file from PLAN
- Compare with tasks:
  - Was file created/modified as expected?
  - Does code match task description?

### Step 3: Check Categories

**Security (Critical):**
- SQL Injection: Are queries parameterized?
- XSS: Is user input escaped?
- Authentication: Is auth required where needed?
- Authorization: Can users access only their data?
- Secrets: No hardcoded API keys/tokens?

**Quality (Major):**
- Error handling: Are errors caught and handled?
- Validation: Are inputs validated?
- Code style: Follows project conventions?
- DRY: No duplicated code?

**Tests (Minor):**
- Tests exist for new code?
- Edge cases covered?

### Step 4: Report Issues
Format:
```markdown
## Critical
- [ ] SQLi risk in line 42: `query = "SELECT * FROM users WHERE id = #{params[:id]}"`

## Major
- [ ] Missing validation for email format
- [ ] Inconsistent error handling

## Minor
- [ ] Missing test for edge case
```

### Step 5: Verdict
- **PASS**: No Critical/Major issues
- **CONDITIONAL**: Critical issues fixed, Major acceptable
- **FAIL**: Unresolved Critical issues

## Output
Write to: `.claude/workflow/reviews/code-review/CODE-REVIEW-{N}.md`

## Constraints
- Be thorough but practical
- Explain WHY something is an issue
- Suggest HOW to fix

