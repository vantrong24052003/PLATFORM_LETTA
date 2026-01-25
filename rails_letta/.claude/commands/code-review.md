---
description: Review code changes based on PR description and source code
argument-hint: <path-to-pr> <path-to-src>
tools: Read, Write, Glob, Grep, Bash
---

# Code Review

Review code changes based on PR description and scan source code for issues, security checks, and test coverage.

## Allowed Tools
- **Read**: Read PR file, source code files
- **Write**: Create CODE-REVIEW file
- **Glob**: Find source files to review, existing CODE-REVIEW files
- **Grep**: Search for security vulnerabilities, patterns in code
- **Bash**: Run test coverage commands if needed

## Instructions

1. **Validate Input**
   - Extract pr_path and src_path from: `$ARGUMENTS`
   - IF pr_path is empty: RETURN "ERROR: PR path required" and EXIT
   - IF src_path is empty: RETURN "ERROR: SRC path required" and EXIT
   - IF pr_file does not exist: RETURN "ERROR: PR file not found" and EXIT
   - IF src_directory does not exist: RETURN "ERROR: SRC directory not found" and EXIT
   - IF pr_file not in `.claude/workflow/reviews/pr/`: RETURN "ERROR: Invalid PR directory" and EXIT

2. **Process Files**
   - Use **Read** tool to read PR file (changes, testing scope)
   - Use **Glob** tool to find source files: `{src_path}/**/*.rb`, `{src_path}/**/*.js`, etc.
   - Use **Grep** tool to search for security issues:
     - SQL injection patterns: `params\[.*\]`, `"#{.*}"` in queries
     - XSS patterns: `html_safe`, `raw`, `innerHTML`
     - Input validation checks
   - Use **Bash** tool to run test coverage if applicable: `bundle exec rspec --format json`
   - Extract N from PR-{N}.md

3. **Analyze Code**
   - Review for: code quality, security vulnerabilities, best practices
   - Check for: SQL injection, XSS, input validation
   - Assess test coverage

4. **Generate Review**
   - Categorize issues: Critical, Major, Minor
   - Security checks table
   - Test coverage comparison

5. **Write Output**
   - Use **Write** tool to create: `.claude/workflow/reviews/code-review/CODE-REVIEW-{N}.md`
   - Use **Glob** to find existing CODE-REVIEW files: `.claude/workflow/reviews/code-review/CODE-REVIEW-*.md`
   - Format includes:
     - Summary table (Verdict, Risk)
     - Issues Found (Critical, Major, Minor)
     - Security Check table
     - Test Coverage table (Target vs Actual)
     - Final Verdict

6. **Return Result**
   - RETURN: "Created: .claude/workflow/reviews/code-review/CODE-REVIEW-{N}.md"
   - EXIT 0

## Usage

```bash
/code-review .claude/workflow/reviews/pr/PR-001.md app/
```

## Exit Codes
- `0`: Success
- `1`: Validation failed
