---
description: Create new BASE-REQUIRE file from template
argument-hint: <ticket-id> <title>
tools: Read, Write, Glob, AskUserQuestion
---

# Create Base Requirement from Template

Create a new BASE-REQUIRE file from template with interactive prompts for information gathering.

## Allowed Tools
- **Read**: Read template file
- **Write**: Create new BASE-REQUIRE file
- **Glob**: Find existing BASE-REQUIRE files for numbering
- **AskUserQuestion**: Interactive prompts for work type, requirements, etc.

## Instructions

1. **Validate Input**
   - Extract ticket_id and title from: `$ARGUMENTS`
   - IF ticket_id is empty: RETURN "ERROR: Ticket ID required" and EXIT
   - IF title is empty: RETURN "ERROR: Title required" and EXIT

2. **Get Next Number**
   - Use **Glob** to find existing BASE-REQUIRE files: `.claude/workflow/base-require/BASE-REQUIRE-*.md`
   - N = max(existing numbers) + 1
   - First file: N = 001

3. **Read Template**
   - Use **Read** tool to read: `.claude/workflow/base-require/.template.md`

4. **Interactive Prompts**
   - Use **AskUserQuestion** to gather:
     - Work Type (New Feature / API Extension / Integration / Bug Fix / Refactor / Enhancement)
     - Description (what needs to be built and why)
     - Requirements (FR items)
     - Non-Functional Requirements (optional)
     - External References URLs (optional)
     - API Mapping (optional)
     - Acceptance Criteria

5. **Generate Output**
   - Use **Write** tool to create: `.claude/workflow/base-require/BASE-REQUIRE-{N}.md`
   - Fill template with gathered information
   - Auto-fill: Created date (today), Ticket ID, Title

6. **Return Result**
   - RETURN: "Created: .claude/workflow/base-require/BASE-REQUIRE-{N}.md"
   - EXIT 0

## Usage

```bash
/create-base-require TICKET-001 "User authentication with email"
```

Interactive prompts will appear for:
- Work Type selection
- Description
- Requirements
- Acceptance Criteria
- External References (optional)
- API Mapping (optional)

## Exit Codes
- `0`: Success
- `1`: Validation failed
