---
name: base-require-generation
description: Generates BASE-REQUIRE content from user answers and template.
---

# Base Requirement Generation Skill

## Input
```json
{
  "ticket_id": "string",
  "title": "string",
  "work_type": "New Feature / API Extension / Integration / Bug Fix / Refactor / Enhancement",
  "description": "string",
  "functional_requirements": [
    {
      "id": "FR-1",
      "description": "string",
      "priority": "High/Medium/Low"
    }
  ],
  "non_functional_requirements": [
    {
      "id": "NFR-1",
      "description": "string",
      "priority": "High/Medium/Low"
    }
  ],
  "external_references": {
    "documentation_links": [
      {
        "name": "string",
        "url": "string",
        "notes": "string"
      }
    ],
    "assets": [
      {
        "type": "string",
        "link": "string",
        "notes": "string"
      }
    ]
  },
  "api_mapping": {
    "request_mapping": [
      {
        "external_field": "string",
        "internal_field": "string",
        "type": "string",
        "required": "Yes/No",
        "notes": "string"
      }
    ],
    "response_mapping": [
      {
        "internal_field": "string",
        "external_field": "string",
        "type": "string",
        "notes": "string"
      }
    ]
  },
  "acceptance_criteria": {
    "functional": ["string"],
    "non_functional": ["string"]
  },
  "out_of_scope": ["string"],
  "notes": "string"
}
```

## Output
```markdown
# BASE-REQUIRE-XXX

> Created by: [User]
> Created date: YYYY-MM-DD
> Ticket ID: [ticket_id]

## Title
[title]

## Description
[description]

---

## Work Type
**Selected Type:** [work_type]

---

## Architecture Context
[Generated based on work type]

---

## Requirements

### Functional Requirements
| ID | Description | Priority |
|----|-------------|----------|
[FR table]

### Non-Functional Requirements
| ID | Description | Priority |
|----|-------------|----------|
[NFR table]

---

## External References

### Documentation Links
| Name | URL | Notes |
|------|-----|-------|
[links table]

### Assets
| Type | Link | Notes |
|------|------|-------|
[assets table]

---

## API / Data Mapping

### Request Mapping
| External Field | Internal Field | Type | Required | Notes |
|----------------|---------------|------|----------|-------|
[request mapping table]

### Response Mapping
| Internal Field | External Field | Type | Notes |
|----------------|---------------|------|-------|
[response mapping table]

---

## Acceptance Criteria

### Functional Criteria
[functional criteria checklist]

### Non-Functional Criteria
[non-functional criteria checklist]

---

## Out of Scope
[out of scope items]

---

## Notes
[additional notes]
```

## Behavior

1. **Generate Header**
   - Format: BASE-REQUIRE-{N}.md
   - Set created date to today (YYYY-MM-DD)
   - Use provided ticket_id and title

2. **Generate Work Type Section**
   - Include full work type table for reference
   - Mark selected type

3. **Generate Architecture Context**
   - For New Feature: Prompt for new components, database changes, new services
   - For API Extension: Prompt for reference files, existing patterns
   - For Integration: Prompt for external API docs, auth method, constraints
   - For Bug Fix: Prompt for bug location, issue link
   - For Refactor: Prompt for current issues, goals
   - For Enhancement: Prompt for existing feature, improvements needed

4. **Generate Requirements Tables**
   - Auto-generate IDs: FR-1, FR-2, FR-3...
   - Auto-generate IDs: NFR-1, NFR-2, NFR-3...
   - Set all priorities based on user input

5. **Generate External References** (if provided)
   - Format documentation links table
   - Format assets table

6. **Generate API Mapping** (if provided)
   - Format request mapping table
   - Format response mapping table

7. **Generate Acceptance Criteria**
   - Format functional criteria as checkbox list
   - Format non-functional criteria as checkbox list

8. **Generate Out of Scope** (if provided)
   - List as bullet points

9. **Generate Notes** (if provided)
   - Include as plain text

## Constraints

1. Auto-generate sequential IDs (FR-1, FR-2, NFR-1, NFR-2...)
2. Default priority: Medium if not specified
3. Empty sections return empty string or "N/A"
4. No fallback to natural language

## Exit Codes

- `0`: Success
- `1`: Input validation failed
- `2`: Template not found
