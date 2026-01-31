---
name: issues-generation
description: Transforms a base require file into a structured issue format.
---

# Issues Generation Skill

## Input
```
.claude/workflow/base-require/BASE-REQUIRE-XXX.md
```

## Output
```json
{
  "title": "string",
  "summary": "string",
  "work_type": "New Feature / API Extension / Integration / Bug Fix / Refactor / Enhancement",
  "architecture_context": {
    "type": "new_feature / api_extension / integration / bug_fix / refactor / enhancement",
    "description": "string",
    "reference_files": ["string"]
  },
  "requirements": [
    {
      "id": "FR-1",
      "description": "string",
      "priority": "High/Medium/Low",
      "status": "Pending"
    }
  ],
  "non_functional_requirements": [
    {
      "id": "NFR-1",
      "description": "string",
      "priority": "High/Medium/Low",
      "status": "Pending"
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
  "acceptance_criteria": ["string"]
}
```

## Behavior
1. Extract title from `## Title` section
2. Extract summary from `## Description` section
3. Extract work_type from `## Work Type` section
   - Find the selected type after "**Selected Type:**"
4. Extract architecture_context from `## Architecture Context` section
   - Read based on work type (New Feature, API Extension, Integration, etc.)
   - Extract reference file paths if mentioned
5. Extract functional requirements from `### Functional Requirements` table
   - Read columns: ID, Description, Priority
   - Set status to "Pending" for all
6. Extract non-functional requirements from `### Non-Functional Requirements` table
   - Read columns: ID, Description, Priority
   - Set status to "Pending" for all
7. Extract external references from `## External References` section
   - Read `### Documentation Links` table: Name, URL, Notes
   - Read `### Assets` table: Type, Link, Notes
8. Extract API mapping from `## API / Data Mapping` section
   - Read `### Request Mapping` table: External Field, Internal Field, Type, Required, Notes
   - Read `### Response Mapping` table: Internal Field, External Field, Type, Notes
9. Extract acceptance criteria from `## Acceptance Criteria` section

## Constraints
1. Output only exists if input exists
2. Missing input field returns empty string
3. Missing table section returns empty array
4. No fallback to natural language

## Exit Codes
- `0`: Success
- `1`: Input file missing
- `2`: Input file invalid format
