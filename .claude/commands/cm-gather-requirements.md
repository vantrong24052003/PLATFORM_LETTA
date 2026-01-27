---
allowed-tools: Read, Write, Edit, Bash, Grep, Glob, mcp__web-search-prime__webSearchPrime, mcp__web-reader__webReader, mcp__4_5v_mcp__analyze_image
argument-hint: "<feature-description>"
description: Gather and clarify requirements before implementation
---

# cm-gather-requirements - Gather Requirements

**Hello Boss!** Gathering requirements before implementing feature for **rails_letta**.

## Purpose

Ask smart questions, understand business context, define success criteria.

## Process

### Step 1: Understand the Big Picture

- Use MCP to gather context
- Read existing patterns in codebase
- Reference docs in `.claude/docs/letta/`

### Step 2: Ask Smart Questions

One question at a time. Always propose 2-3 solutions.

**Example:**

```markdown
## API Design

How to structure the endpoint?

1. **RESTful resource** - Standard CRUD, follows Rails conventions
2. **RPC-style action** - Custom action names, more explicit
3. **GraphQL query** - Flexible queries, single endpoint

Which approach do you prefer?
```

### Step 3: Define Success Criteria

```
Given: [current state]
When: [action]
Then: [expected outcome]
```

### Step 4: Output Requirements Document

```markdown
# Feature: [Name]

## Problem
[What are we solving?]

## Goals
- [ ] Goal 1
- [ ] Goal 2

## Success Criteria
1. [Criteria 1]
2. [Criteria 2]

## Technical Approach
- Service: `Letta::Module::Action`
- Endpoint: `POST /letta/...`
- Database: [Migration info]
```

---

**Boss, ready to gather requirements!**
