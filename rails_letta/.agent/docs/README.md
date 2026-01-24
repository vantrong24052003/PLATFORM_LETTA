# rails_letta Documentation

**Purpose**: Language-agnostic reference documentation  
**Last Updated**: 2026-01-24

---

## What is This?

This folder contains **reference documentation** for understanding the Rails LeTTa platform.

**What's Inside**:
- ✅ Concepts & architecture (what is Letta, how system works)
- ✅ HTTP API specifications (cURL examples, JSON schemas)
- ✅ General workflows & patterns (language-agnostic)
- ✅ Database schemas & design principles
- ✅ SSE, Tool Approval, RAG guides

**What's NOT Here**:
- ❌ Rails implementation code → See `/plan`
- ❌ "How to code" step-by-step guides → See `/plan`
- ❌ RSpec tests & examples → See `/plan`
- ❌ Service objects, controllers, models → See `/plan`

**Think of it as**: A reference manual that anyone (AI agents, developers using other languages, architects) can read to understand the system **without needing to know Rails**.  

---

## Structure

```
docs/
├── README.md            # This file
└── letta/               # FLAT - All Letta docs
    ├── 00-what-is-letta.md
    ├── 01-platform-architecture.md
    ├── 02-core-concepts.md
    ├── 03-letta-database-schema.md
    ├── 04-http-api-reference.md
    ├── 05-custom-database-design.md
    ├── 06-agent-workflows.md
    ├── 07-sse-specification.md
    ├── 08-tool-approval-pattern.md
    ├── 09-rag-guide.md
    └── 10-streaming-api.md
```

---

## Letta Documentation

| # | Document | Description | Source |
|---|----------|-------------|--------|
| 00 | [What is Letta](./letta/00-what-is-letta.md) | Introduction to Letta AI | Letta Docs |
| 01 | [Platform Architecture](./letta/01-platform-architecture.md) | System design | Internal |
| 02 | [Core Concepts](./letta/02-core-concepts.md) | Bot templates, agents | Internal |
| 03 | [Letta Database Schema](./letta/03-letta-database-schema.md) | 48 internal tables | Letta Source |
| 04 | [HTTP API Reference](./letta/04-http-api-reference.md) | HTTP API integration | Letta Docs |
| 05 | [Custom Database Design](./letta/05-custom-database-design.md) | Our Rails tables | Internal |
| 06 | [Agent Workflows](./letta/06-agent-workflows.md) | Agents, tools, approvals | Internal |
| 07 | [SSE Specification](./letta/07-sse-specification.md) | Server-Sent Events | W3C/MDN |
| 08 | [Tool Approval Pattern](./letta/08-tool-approval-pattern.md) | Human-in-the-loop | Generic |
| 09 | [RAG Guide](./letta/09-rag-guide.md) | Retrieval-Augmented Generation | Academic |
| 10 | [Streaming API](./letta/10-streaming-api.md) | Letta streaming API | Letta Docs |

---

## Quick Links

| Resource | Path |
|----------|------|
| Rules | `.agent/rules/` |
| Docs | `.agent/docs/` (here) |
| Plans | `.agent/plan/` |
| Skills | `.agent/skills/` |
| Workflows | `.agent/workflows/` |
