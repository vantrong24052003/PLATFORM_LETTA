---
description: Transform BASE-REQUIRE file into structured ISSUE format
argument-hint: <path-to-base-require>
tools: Read, Write, Glob, Grep, mcp__web-reader__webReader, mcp__web-search-prime__webSearchPrime
---

# Create Issue from Base Requirement

Transform a BASE-REQUIRE file into structured ISSUE format using issues-generation skill.

## Allowed Tools
- **Read**: Read BASE-REQUIRE file, check existing ISSUE files for numbering
- **Write**: Create new ISSUE file
- **Glob**: Find existing ISSUE files to determine next number
- **Grep**: Search for specific patterns in files
- **mcp__web-reader__webReader**: Fetch content from URLs in External References
- **mcp__web-search-prime__webSearchPrime**: Search for additional context on referenced topics

## Instructions

1. **Validate Input**
   - Extract path from: `$ARGUMENTS`
   - IF path is empty: RETURN "ERROR: Path required" and EXIT
   - IF file does not exist: RETURN "ERROR: File not found" and EXIT
   - IF file path not in `.claude/workflow/base-require/`: RETURN "ERROR: Invalid directory" and EXIT

2. **Process BASE-REQUIRE**
   - Use **Read** tool to read the BASE-REQUIRE file
   - Use **Glob** tool to find existing ISSUE files: `.claude/workflow/issues/ISSUE-*.md`
   - Extract: Title, Description, Work Type, Requirements (FR/NFR), External References, API Mapping, Acceptance Criteria

3. **Fetch External References** (if URLs exist)
   - For each URL in Documentation Links table:
     - Use **mcp__web-reader__webReader** to fetch content
     - Store as reference content
   - For missing context, use **mcp__web-search-prime__webSearchPrime** to search

4. **Generate Output**
   - Use **Write** tool to create: `.claude/workflow/issues/ISSUE-{N}.md`
   - N = max(existing ISSUE numbers) + 1
   - Format includes:
     - Title and Summary
     - Work Type
     - Architecture Context
     - Functional Requirements table (ID, Description, Priority, Status)
     - Non-Functional Requirements table
     - External References (Documentation Links, Assets) + **Fetched Content**
     - API/Data Mapping (Request/Response)
     - Acceptance Criteria

5. **Return Result**
   - RETURN: "Created: .claude/workflow/issues/ISSUE-{N}.md"
   - EXIT 0

## Usage

```bash
/create-issue .claude/workflow/base-require/BASE-REQUIRE-001.md
```

## Exit Codes
- `0`: Success
- `1`: Validation failed
