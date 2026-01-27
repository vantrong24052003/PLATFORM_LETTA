# rails_letta Sub-Agents

Sub-agents for developing **rails_letta** (Rails 8.1.1 API Gateway for Letta).

## Agent Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          DEVELOPMENT WORKFLOW                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────┐          │
│   │ 0. DOCS FIRST (Read before anything)                         │          │
│   │    - User-defined docs: .claude/docs/letta/                 │          │
│   │    - Project rules: .claude/CLAUDE.md                       │          │
│   │    - Architecture, patterns, conventions                     │          │
│   │    - AI reads these FIRST to understand context              │          │
│   └─────────────────────────────┬───────────────────────────────┘          │
│                                 │                                             │
│                                 ▼                                             │
│   ┌─────────────────┐                                                       │
│   │  User Request   │                                                       │
│   └────────┬────────┘                                                       │
│            │                                                                │
│            ▼                                                                │
│   ┌─────────────────────────────────────────────────────────────┐          │
│   │ 1. ag-gather (blue)                                         │          │
│   │    - Ask smart questions with 2-3 solutions each            │          │
│   │    - Define success criteria                                │          │
│   │    - Output: Requirements document                          │          │
│   └─────────────────────────────┬───────────────────────────────┘          │
│                                 │                                             │
│                                 ▼                                             │
│   ┌─────────────────────────────────────────────────────────────┐          │
│   │ 2. ag-plan (yellow)                                         │          │
│   │    - Break down into phases                                 │          │
│   │    - Define dependencies                                    │          │
│   │    - Output: Implementation plan                            │          │
│   └─────────────────────────────┬───────────────────────────────┘          │
│                                 │                                             │
│                                 ▼                                             │
│   ┌─────────────────────────────────────────────────────────────┐          │
│   │ 3. ag-execute (green)                                       │          │
│   │    - Read existing patterns                                 │          │
│   │    - Write code: DB → Model → Service → Controller → Routes │          │
│   │    - Output: Working code                                   │          │
│   └─────────────────────────────┬───────────────────────────────┘          │
│                                 │                                             │
│                                 ▼                                             │
│   ┌─────────────────────────────────────────────────────────────┐          │
│   │ 4. ag-test (orange)                                         │          │
│   │    - Write Model → Service → Controller tests              │          │
│   │    - Target: 100% coverage                                  │          │
│   │    - Output: Passing tests                                  │          │
│   └─────────────────────────────┬───────────────────────────────┘          │
│                                 │                                             │
│                                 ▼                                             │
│   ┌─────────────────────────────────────────────────────────────┐          │
│   │ 5. ag-review (red)                                          │          │
│   │    - Check security, performance, code quality              │          │
│   │    - Verify organization scoping, HMAC, streaming cleanup   │          │
│   │    - Output: Approval or fix requests                       │          │
│   └─────────────────────────────┬───────────────────────────────┘          │
│                                 │                                             │
│                                 ▼                                             │
│                          ┌─────────┐                                         │
│                          │  MERGE  │                                         │
│                          └────┬────┘                                         │
│                               │                                              │
│                               ▼                                              │
│   ┌─────────────────────────────────────────────────────────────┐          │
│   │ ag-docs (cyan) - CREATE new docs after implementation       │          │
│   │    - Create API/Service/Architecture/Guide docs             │          │
│   │    - For newly implemented features                         │          │
│   └─────────────────────────────────────────────────────────────┘          │
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────┐          │
│   │ ag-debug (purple) [ANYTIME]                                  │          │
│   │    - Fix errors during any phase                             │          │
│   │    - Gather error info → search solution → fix              │          │
│   └─────────────────────────────────────────────────────────────┘          │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Quick Reference

| Step | Agent | Color | When to Use | Input | Output |
|------|-------|-------|-------------|-------|--------|
| 0 | **READ DOCS** | Gray | FIRST, before anything | .claude/docs/letta/ | Context understanding |
| 1 | **ag-gather** | Blue | After reading docs | User request | Requirements doc |
| 2 | **ag-plan** | Yellow | After ag-gather | Requirements | Implementation plan |
| 3 | **ag-execute** | Green | After ag-plan | Plan | Working code |
| 4 | **ag-test** | Orange | After ag-execute | Code | Tests (100% coverage) |
| 5 | **ag-review** | Red | Before merge | Code + Tests | Approval/Fixes |
| - | **ag-docs** | Cyan | After implementation | New feature | Documentation |
| - | **ag-debug** | Purple | Anytime | Error info | Fix |

## Example Usage

### New Feature Development
```
User: "I want to add agent creation endpoint"

→ Step 0: READ DOCS (.claude/docs/letta/, .claude/CLAUDE.md)
→ Step 1: ag-gather - Ask questions (API design? Streaming? Multi-tenancy?)
→ Step 2: ag-plan - Create implementation plan
→ Step 3: ag-execute - Write migration, model, service, controller
→ Step 4: ag-test - Write RSpec tests
→ Step 5: ag-review - Review and approve
→ After: ag-docs - Create API documentation
```

### Bug Fix
```
User: "Agent creation is failing"

→ Step 0: READ DOCS (understand patterns first)
→ ag-debug: Gather error info, search solution, fix
→ ag-test: Add regression test
→ ag-review: Quick review
```

### Documentation (create new docs)
```
User: "Help me create docs for agent API"

→ ag-docs: ag-gather (type? scope? audience?) → search → generate
```

## Naming Convention

| Type | Prefix | Example |
|------|--------|---------|
| **Commands** | `cm-` | `cm-review`, `cm-arch-plan` |
| **Agents** | `ag-` | `ag-gather`, `ag-plan`, `ag-execute` |

## All Agents Have MCP Access

- `web-search-prime` - Search best practices
- `web-reader` - Read documentation
- `4.5v-mcp` (some) - Analyze images/mockups
