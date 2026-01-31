# Development Workflow System

Complete flow-driven development system using agents, skills, and commands.

---

## Overview

```
USER INPUT (ticket-id + title)
       ↓
┌─────────────────────────────────────────────────────────────┐
│  workflow-executor (agent)                                  │
│  - Orchestrates entire flow                                   │
│  - Delegates to specialized agents                            │
│  - Calls commands sequentially                                │
│  - Gets user approvals at key points                          │
└─────────────────────────────────────────────────────────────┘
       ↓                    ↓                    ↓
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│ requirement- │   │ codebase-    │   │ code-        │
│ scout (agent)│   │ analyzer     │   │ reviewer      │
│              │   │ (agent)      │   │ (agent)      │
└──────────────┘   └──────────────┘   └──────────────┘
       ↓                    ↓                    ↓
┌─────────────────────────────────────────────────────────────┐
│  COMMANDS + SKILLS                                            │
├─────────────────────────────────────────────────────────────┤
│  1. /create-base-require → base-require-generation skill    │
│  2. /create-issue          → issues-generation skill         │
│  3. /create-plan           → requirement-analysis +           │
│                             → plan-generation skills          │
│  4. /start-implementation  → (no skill, direct logic)        │
│  5. /compare-actual-vs-plan → (no skill, comparison logic)   │
│  6. /generate-pr           → (no skill, formatting)           │
│  7. /code-review           → (code-reviewer agent)            │
└─────────────────────────────────────────────────────────────┘
       ↓
┌─────────────────────────────────────────────────────────────┐
│  implementation-advisor (agent)                              │
│  - Reads PLAN and TASKS                                        │
│  - Suggests code changes                                       │
│  - Gets user approval per change                              │
│  - Applies changes with Write/Edit tools                      │
└─────────────────────────────────────────────────────────────┘
       ↓
COMPLETE: BASE-REQUIRE → ISSUE → PLAN → TASKS → CODE → PROGRESS → PR → CODE-REVIEW
```

---

## File Structure

```
.claude/
├── commands/                   # Slash commands (7)
│   ├── create-base-require.md
│   ├── create-issue.md
│   ├── create-plan.md
│   ├── start-implementation.md
│   ├── compare-actual-vs-plan.md
│   ├── generate-pr.md
│   └── code-review.md
│
├── skills/                     # Skills (4)
│   ├── base-require-generation/SKILL.md
│   ├── issues-generation/SKILL.md
│   ├── requirement-analysis/SKILL.md
│   └── plan-generation/SKILL.md
│
├── agents/                     # Subagents (5)
│   ├── workflow-executor.md
│   ├── codebase-analyzer.md
│   ├── implementation-advisor.md
│   ├── code-reviewer.md
│   └── requirement-scout.md
│
└── workflow/                   # Workflow files
    ├── base-require/.template.md
    ├── base-require/.keep
    ├── issues/.keep
    ├── plans/.keep
    ├── implementation/.keep
    ├── progress/.keep
    ├── reviews/pr/.keep
    ├── reviews/code-review/.keep
    └── README.md
```

---

## Flow Sequence

### Phase 1: Requirements
```
User: "Start feature TICKET-001"
       ↓
workflow-executor: Collects ticket-id, title
       ↓
workflow-executor: → /create-base-require
       ↓
base-require-generation skill: Creates BASE-REQUIRE with user inputs
       ↓
OUTPUT: BASE-REQUIRE-001.md
```

### Phase 2: Issue Generation
```
workflow-executor: → /create-issue BASE-REQUIRE-001.md
       ↓
issues-generation skill:
  - Extract all sections from BASE-REQUIRE
  - Generate FR/NFR IDs
  - Fetch external docs via MCP (web-reader, web-search)
       ↓
OUTPUT: ISSUE-001.md (with Work Type, Architecture Context, Requirements, etc.)
```

### Phase 3: Planning
```
workflow-executor: → /create-plan ISSUE-001.md
       ↓
requirement-analysis skill:
  - Detects ambiguities
  - Returns clarification options (A/B/C)
       ↓
IF ambiguities exist:
  - workflow-executor: AskUserQuestion presents options
  - User selects option
  - Appends "Clarification Chosen" to ISSUE-001.md
       ↓
plan-generation skill:
  - Generates technical approach
  - Breaks down into tasks (T1, T2, T3...)
  - Identifies risks
       ↓
OUTPUT: PLAN-001.md
```

### Phase 4: Implementation Preparation
```
workflow-executor: → /start-implementation PLAN-001.md
       ↓
TASKS-001.md created with checklist
```

### Phase 5: Code Analysis
```
workflow-executor: → codebase-analyzer agent
       ↓
codebase-analyzer:
  - Scans current codebase structure
  - Finds patterns and conventions
  - Locates reference files
       ↓
RETURNS: Architecture analysis, reference files, patterns
```

### Phase 6: Implementation
```
workflow-executor: → implementation-advisor agent
       ↓
implementation-advisor:
  FOR each task in PLAN:
    - Analyze current code
    - Generate suggestion
    - AskUserQuestion: "Apply this change? (y/n)"
    - IF user approves: Edit/Write file
    - Mark task complete
       ↓
CODE CHANGES APPLIED
```

### Phase 7: Progress Check
```
workflow-executor: → /compare-actual-vs-plan TASKS PLAN
       ↓
PROGRESS-001.md generated (progress %, deviations, blockers)
```

### Phase 8: PR Generation
```
workflow-executor: → /generate-pr PLAN PROGRESS
       ↓
PR-001.md generated (summary, changes, testing checklist)
```

### Phase 9: Code Review
```
workflow-executor: → code-reviewer agent
       ↓
code-reviewer:
  - Reviews all modified files
  - Checks security vulnerabilities
  - Assesses test coverage
  - Generates report
       ↓
CODE-REVIEW-001.md generated
```

---

## Auto-Delegation Triggers

Claude automatically delegates to agents based on task description:

| Trigger | Agent |
|---------|-------|
| "Starting new feature" / "Process ticket" | workflow-executor |
| "Explore codebase" / "Understand structure" | codebase-analyzer |
| "Suggest code changes" / "How to implement" | implementation-advisor |
| "Review my code" / "Check for issues" | code-reviewer |
| "Gather requirements" / "Analyze ticket" | requirement-scout |

---

## Command → Skill Mapping

| Command | Skill(s) Used |
|---------|---------------|
| /create-base-require | base-require-generation |
| /create-issue | issues-generation |
| /create-plan | requirement-analysis → plan-generation |
| /start-implementation | (none) |
| /compare-actual-vs-plan | (none) |
| /generate-pr | (none) |
| /code-review | (delegates to code-reviewer agent) |

---

## Tool Permissions by Component

| Component | Write | Edit | Read | Bash | MCP |
|-----------|-------|------|------|------|-----|
| **Commands** |
| create-base-require | ✓ | - | ✓ | - | - |
| create-issue | ✓ | - | ✓ | - | ✓ |
| create-plan | ✓ | ✓ | ✓ | - | ✓ |
| start-implementation | ✓ | - | ✓ | - | - |
| compare-actual-vs-plan | ✓ | - | ✓ | - | - |
| generate-pr | ✓ | - | ✓ | - | - |
| code-review | ✓ | - | ✓ | ✓ | - |
| **Agents** |
| workflow-executor | ✓ | - | ✓ | - | - |
| codebase-analyzer | - | - | ✓ | ✓ | - |
| implementation-advisor | ✓ | ✓ | ✓ | - | - |
| code-reviewer | - | - | ✓ | ✓ | - |
| requirement-scout | - | - | ✓ | - | ✓ |

---

## Quick Reference

### Start a New Feature
```
Use workflow-executor agent to process ticket TICKET-001
```

### Explore Codebase
```
Use codebase-analyzer agent to understand the project structure
```

### Get Implementation Suggestions
```
Use implementation-advisor agent with PLAN-001.md
```

### Review Code
```
Use code-reviewer agent to check recent changes
```

---

## Exit Codes

All commands and agents use standard exit codes:
- `0`: Success
- `1`: Validation failed
- `2`: Warning (ambiguities, need user input)
