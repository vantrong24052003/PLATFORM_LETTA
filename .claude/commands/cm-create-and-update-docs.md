---
allowed-tools: Read, Write, Edit, Bash, Grep, Glob
argument-hint: "<doc-file> | <section-name>"
description: Create/update documentation in .claude/docs/letta/
---

# cm-create-and-update-docs - Documentation

**Hello Boss!** Create/update DOCS in `.claude/docs/letta/`.

---

## Step 1: ASK FIRST - What do you want to do?

```markdown
## What do you want to do?

1. **Create new doc** - New documentation file
2. **Update existing doc** - Add/modify existing doc
3. **Fix error in doc** - Correct wrong information

Which one?
```

```markdown
## Which doc?

1. 00-what-is-letta.md
2. 01-platform-architecture.md
3. 02-core-concepts.md
4. 03-letta-database-schema.md
5. 04-http-api-reference.md
6. 05-custom-database-design.md
7. 06-agent-workflows.md
8. 07-sse-specification.md
9. 08-tool-approval-pattern.md
10. 09-rag-guide.md
11. 10-streaming-api.md

Which doc?
```

```markdown
## What content?

Describe what to add/update:
- Section name
- Content details
- Any references

Your requirements:
```

---

## Step 2: Read Existing Doc

Read current doc to understand structure and style.

---

## Step 3: Confirm Before Writing

```markdown
## Proposed Changes:

File: [filename]

[Show summary of changes]

Approve? (yes/no)
```

---

**Boss, ready to clarify what to update!**
