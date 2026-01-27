# Letta Engine - Documentation

**AI Engine**: Letta (formerly MemGPT)  
**Version**: 0.5.x  
**Official Site**: https://docs.letta.com

---

## Overview

This folder contains all Letta-specific documentation for integrating Letta Engine into the Rails platform.

**What is Letta?**
- Memory-augmented AI agent framework
- Stateful conversations with persistent memory
- Support for RAG (Retrieval Augmented Generation)
- Tool execution & approval workflow

---

## Documentation Index

### 1. Letta Engine Database
**File**: [01-letta-database.md](./01-letta-database.md)  
**Content**: 
- Letta's 48 internal tables
- Schema structure (agents, memory_blocks, sources, tools)
- How Letta stores agent state

### 2. Custom Rails Schema for Letta
**File**: [02-custom-db-schema.md](./02-custom-db-schema.md)  
**Content**:
- `letta_bot_templates` table design
- `letta_agent_mappings` table design
- Data mapping strategy (Template → Agent)
- JSONB structures (`tools`, `source_ids`, `theme_config`)

### 3. Letta API Workflow
**File**: [03-letta-workflow.md](./03-letta-workflow.md)  
**Content**:
- Letta REST API endpoints
- Agent creation workflow
- Message sending (streaming)
- Tool execution & approval flow
- Source management (RAG)

---

## Key Concepts

### Memory Blocks
Letta agents have structured memory:
- **Persona**: "Who am I?" (from `bot_templates.system_prompt`)
- **User**: "Who is the user?"
- **Archival**: Long-term knowledge (RAG)

### Sources (RAG)
- Upload documents/text to Letta
- Get `source_id` (UUID)
- Attach to agents via `source_ids` JSONB array

### Tools
- Functions the agent can call
- Defined in `bot_templates.tools` array
- Letta executes and returns results

---

## Future: Multi-Engine Support

If we add Claude or GLM later:

```
docs/
├── 00-index.md           # General
├── 01-architecture.md    # General
├── 02-concepts.md        # General
├── letta/                # Letta-specific
│   ├── 01-letta-database.md
│   ├── 02-custom-db-schema.md
│   └── 03-letta-workflow.md
├── claude/               # Future
│   ├── 01-claude-api.md
│   └── 02-custom-schema.md
└── glm/                  # Future
    ├── 01-glm-api.md
    └── 02-custom-schema.md
```

---

## Related

- **Plans**: See `/plan/letta/` for implementation tasks
- **Skills**: See `/skills/` for generic development guidelines
