# Implementation Plan - Rails LeTTa Platform

**Project**: Multi-tenant AI Chatbot Platform
**Status**: 🟡 Planning Phase
**Last Updated**: 2026-01-24

---

## Overview

This is the **master implementation plan** for the entire Rails LeTTa Platform project, covering all AI engine integrations.

**Purpose**: Build a multi-tenant SaaS platform that allows organizations to create and manage AI chatbot assistants.

**Architecture**:
- Multi-organization isolation
- Pluggable AI engines (Letta, Claude, GLM...)
- Admin dashboard (ui_mgpt)
- Embeddable chat widget

---

## AI Engine Integrations

### 1. Letta Integration
**Folder**: [letta/](./letta/)
**Status**: 🟡 In Progress
**Plan**: [letta/00-execution-steps.md](./letta/00-execution-steps.md)

**Summary**:
- Custom database schema (bot_templates, agent_mappings)
- Letta HTTP client integration
- RESTful APIs for bot management
- Memory-augmented conversations with RAG

**Features**:
- [Phase 1: Custom DB Integration](./Phase1_BE-custom-db-integration/) - ✅ **RESOLVED**
- [Phase 2: Streaming Workflow](./Phase2_BE-streaming/) - ✅ **RESOLVED**
- [Phase 3: Tool Approval](./Phase3_BE-tool-approval/) - 🔴 Planned
- [Phase 4: RAG Sources](./Phase4_BE-rag-sources/) - 🔴 Planned

---

### 2. Claude Integration (Future)
**Folder**: `claude/`
**Status**: 🔴 Not Started
**Plan**: `claude/00-implementation-plan.md`

**Summary**:
- Anthropic Claude API integration
- Conversation management
- Prompt templates

---

### 3. GLM Integration (Future)
**Folder**: `glm/`
**Status**:  Not Started
**Plan**: `glm/00-implementation-plan.md`

**Summary**:
- ChatGLM API integration
- Chinese language support
- On-premise deployment option

---

## Project-Wide Components

These components are **shared** across all AI engine integrations:

### Frontend (ui_mgpt)
- React admin dashboard
- Bot template configuration
- Organization management
- **Location**: `/ui_mgpt` (separate repo/folder)

### Embed Widget
- Vanilla JS chat widget
- Theme customization
- Cross-origin embedding
- **Location**: `/widget` (in rails_letta)

### Backend Core
- Rails 8.1.1 API
- Multi-tenancy (organization_id scoping)
- PostgreSQL database
- CORS configuration
- **Location**: `/app` (in rails_letta)

---

## Development Sequence

### Phase 1: Letta Core (Current)
**Timeline**: Weeks 1-2
**Focus**: Get basic Letta integration working

- [ ] Database schema & migrations
- [ ] Letta HTTP client
- [ ] API endpoints (bot templates CRUD)
- [ ] Agent service (get or create)
- [ ] RSpec tests

**Details**: See [letta/00-execution-steps.md](./letta/00-execution-steps.md)

---

### Phase 2: Widget & Frontend
**Timeline**: Weeks 3-4
**Focus**: Build user-facing components

- [ ] Vanilla JS widget (embed.js)
- [ ] Widget-backend communication
- [ ] UI_mgpt API integration
- [ ] Theme customization

---

### Phase 3: Advanced Features
**Timeline**: Weeks 5-6
**Focus**: Enhance functionality

- [x] Streaming messages (SSE)
- [ ] Tool approval workflow
- [ ] RAG sources management
- [ ] Analytics dashboard

---

### Phase 4: Multi-Engine Support
**Timeline**: Week 7+
**Focus**: Add Claude/GLM

- [ ] Abstract AI client interface
- [ ] Claude integration
- [ ] Engine selection in UI
- [ ] Comparison testing

---

## Progress Tracking

| Component | Status | Progress |
|---|---|---|
| **Letta Integration** | 🟡 In Progress | 10% |
| ├─ Custom DB | 🟡 Active | 0/5 tasks |
| ├─ Streaming | � Planned | - |
| ├─ Tool Approval | 🔴 Planned | - |
| └─ RAG Sources | 🔴 Planned | - |
| **Widget** | � Not Started | 0% |
| **Frontend** | � Not Started | 0% |
| **Claude** | 🔴 Not Started | 0% |
| **GLM** | � Not Started | 0% |

**Overall Project**: 5% complete

---

## Dependencies

**Infrastructure**:
- PostgreSQL (database)
- Node.js (widget build)
- Letta Engine (port 8283)

**Environment**:
- `PORT=4000` (Rails API)
- `LETTA_API_URL=http://localhost:8283`
- `UI_URL=http://localhost:5173`

---

## Documentation

- **Architecture**: [../docs/01-architecture.md](../docs/01-architecture.md)
- **Letta Docs**: [../docs/letta/](../docs/letta/)
- **Skills**: [../skills/](../skills/)

---

## Next Steps

1. ✅ Review this master plan
2. ✅ **Completed**: [Letta Custom DB Integration](./letta/BE-custom-db-integration/)
3. ✅ **Completed**: [Streaming Workflow](./letta/BE-streaming/)
4. ➡️ **Next**: Plan & Implement Tool Approval Workflow
