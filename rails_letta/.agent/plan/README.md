# Implementation Plans

**Purpose**: Implementation plans for all AI engine integrations
**Structure**: Each engine has its own folder with feature-based sub-plans

---

## Active Integrations

### 1. Letta Integration
**Folder**: [letta/](./letta/)
**Status**: 🟡 In Progress
**Main Plan**: [letta/00-implementation-plan.md](./letta/00-implementation-plan.md)

**Features**:
- 🟡 [Custom DB Integration](./letta/custom-db-integration/) - Current focus
- 🔴 [Streaming](./letta/streaming/) - SSE implementation
- 🔴 [Tool Approval](./letta/tool-approval/) - User approval workflow
- 🔴 [RAG Sources](./letta/rag-sources/) - Document management

---

## Planned Integrations

### 2. Claude Integration (Future)
**Folder**: `claude/`
**Status**: 🔴 Not Started

### 3. GLM Integration (Future)
**Folder**: `glm/`
**Status**: 🔴 Not Started

---

## Structure

```
plan/
├── README.md              # This file
│
└── letta/                 # Letta integration
    ├── 00-implementation-plan.md
    ├── README.md          # Feature convention (00-04 format)
    │
    ├── custom-db-integration/
    │   ├── 00-overview.md
    │   ├── 01-database-schema.md
    │   ├── 02-api-design.md
    │   ├── 03-implementation.md
    │   └── 04-testing.md
    │
    ├── streaming/
    │   ├── 00-overview.md
    │   ├── 01-database-schema.md
    │   ├── 02-api-design.md
    │   ├── 03-implementation.md
    │   └── 04-testing.md
    │
    ├── tool-approval/
    │   └── (same 00-04 structure)
    │
    └── rag-sources/
        └── (same 00-04 structure)
```

---

## How to Use

1. Read feature overview: `letta/{feature}/00-overview.md`
2. Follow tasks: `01 → 02 → 03 → 04`
3. Mark complete in overview file
4. Reference docs in `/docs/letta/` for details

---

## Related

- [Docs](../docs/) - Technical reference
- [Skills](../skills/) - Generic guidelines
- [Workflows](../workflows/) - Commands
