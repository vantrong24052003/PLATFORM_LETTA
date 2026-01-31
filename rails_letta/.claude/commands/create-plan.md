---
description: Generate implementation plan from ISSUE with ambiguity resolution
argument-hint: <path-to-issue>
tools: Read, Write, Edit, Glob, Grep, AskUserQuestion, mcp__web-search-prime__webSearchPrime, mcp__web-reader__webReader
---

# Create Implementation Plan from Issue

Generate implementation plan from ISSUE file. Handles ambiguity resolution with interactive option selection.

## Allowed Tools
- **Read**: Read ISSUE file, check existing PLAN files
- **Write**: Create new PLAN file
- **Edit**: Append "Clarification Chosen" section to ISSUE file
- **Glob**: Find existing PLAN files for numbering
- **Grep**: Search for specific patterns
- **AskUserQuestion**: Display options and get user selection
- **mcp__web-search-prime__webSearchPrime**: Research best practices, libraries, patterns
- **mcp__web-reader__webReader**: Fetch documentation from URLs

## Instructions

1. **Validate Input**
   - Extract path from: `$ARGUMENTS`
   - IF path is empty: RETURN "ERROR: Path required" and EXIT
   - IF file does not exist: RETURN "ERROR: File not found" and EXIT
   - IF file path not in `.claude/workflow/issues/`: RETURN "ERROR: Invalid directory" and EXIT

2. **Analyze Requirements**
   - Use **Read** tool to read issue file
   - Call requirement-analysis skill on issue file
   - Get clarification_options array with:
     - option_id (A, B, C...)
     - developer_view
     - non_technical_view

3. **Handle Ambiguities** (Interactive Selection)
   - IF clarification_options.length > 0:
     - Use **AskUserQuestion** tool to display options:
       - question: "Ambiguities detected in requirements. Please select an approach:"
       - header: "Select Option"
       - options: Map clarification_options to format
         - label: "Option {option_id}: {developer_view}"
         - description: "{non_technical_view}"
       - multiSelect: false
     - Get user selection from answers
     - Use **Edit** tool to append "## Clarification Chosen" section to issue file with selected option

4. **Research for Technical Approach** (if needed)
   - For Integration work type: Use **mcp__web-reader__webReader** to fetch external API docs
   - For New Feature: Use **mcp__web-search-prime__webSearchPrime** to research best practices
   - For API Extension: Use **Grep** to find existing patterns in codebase

5. **Generate Plan**
   - Call plan-generation skill on issue file
   - IF plan-generation returns error: RETURN error.message and EXIT 1
   - Use **Glob** to find existing PLAN files: `.claude/workflow/plans/PLAN-*.md`
   - Extract: technical_approach, tasks, risks, test_strategy

6. **Write Output**
   - Use **Write** tool to create: `.claude/workflow/plans/PLAN-{N}.md`
   - N = max(existing PLAN numbers) + 1
   - Format includes:
     - Technical Approach
     - Tasks table (ID, Description, Depends On, Status)
     - Risks table
     - Test Strategy

7. **Return Result**
   - RETURN: "Created: .claude/workflow/plans/PLAN-{N}.md"
   - EXIT 0

## Usage

```bash
/create-plan .claude/workflow/issues/ISSUE-001.md
```

If ambiguities exist, interactive selection prompt will appear automatically.

## Exit Codes
- `0`: Success
- `1`: Validation failed
