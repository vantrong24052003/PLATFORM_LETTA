---
allowed-tools: Read, Write, Edit, Bash, Grep, Glob
argument-hint: "<file-path> | <commit-hash> | --full"
description: Review code quality - security, performance, architecture
---

# cm-review-code - Code Review

**Hello Boss!** Review code for **rails_letta**.

---

## Step 1: ASK FIRST - What to review?

```markdown
## What to review?

1. **Specific file** - One file review
2. **All changes** - All modified files
3. **Recent commit** - Specific commit
4. **Security focus** - Security issues only

Which one?
```

```markdown
## Target?

Please specify:
- File path / commit hash
- Any specific concerns

Your input:
```

---

## Step 2: Review Based on Rules

Check against `.claude/CLAUDE.md` rules.

---

## Step 3: Report Findings

```markdown
## Code Review Report

### Critical (Must Fix)
- [file:line] Issue

### High Priority
- [file:line] Issue

### Style Issues
- [file:line] Issue
```

---

**Boss, ready to clarify what to review!**
