# Custom DB Integration - Overview

**Feature**: Custom Database Schema for Letta Bot Templates
**Status**: ✅ **RESOLVED**
**Parent**: [../00-execution-steps.md](../00-execution-steps.md)

---

## Overview

This feature establishes the foundational database schema for managing Letta bot templates and agent mappings within the Rails application. 
**Context**: We are operating within an existing **Self-Hosted Letta Database** (Shared Schema). This database is already populated with core system tables.
**Scope**: We are explicitly adding only 2 custom tables (`bot_templates`, `agent_mappings`) to support multi-tenancy without interfering with existing schema.

---

## Business Goals

1. **Multi-Tenancy**: Enable multiple organizations to manage their own bot templates independently
2. **UI Customization**: Allow admins to configure chat widget appearance per bot
3. **Agent Lifecycle Management**: Track which Letta agents belong to which bot templates
4. **Audit Trail**: Maintain created_at/updated_at timestamps for all entities

---

## Technical Goals

1. **Database Schema**: Create `letta_bot_templates` and `letta_agent_mappings` tables
2. **Models**: Implement ActiveRecord models with validations and scopes
3. **Migrations**: Write safe, reversible migrations
4. **API Endpoints**: Expose RESTful CRUD operations for bot templates
5. **Service Layer**: Implement `Letta::AgentService` for agent creation/retrieval

---

## Dependencies

**Infrastructure**:
- PostgreSQL database (already exists)
- Rails 8.1.1 (already installed)

**External Services**:
- Letta Engine (http://localhost:8283)

**Environment Variables**:
- `LETTA_API_URL` - Must be configured

---

## Out of Scope

- Streaming (separate feature)
- Tool approval (separate feature)
- RAG sources (separate feature)
- Widget development (Phase 2)
- Frontend integration (Phase 3)

---

## Acceptance Criteria

- [x] Database migrations run successfully
- [x] Models have proper validations (presence, uniqueness)
- [x] API endpoints return correct HTTP status codes
- [x] Multi-org isolation is enforced (organization_id scoping)
- [x] Letta agents can be created via service layer
- [x] Agent mappings are stored after creation
- [x] RSpec tests pass with 80%+ coverage
- [x] No N+1 queries in list endpoints

---

## Timeline Estimate

**Duration**: 3-5 days

**Breakdown**:
- Day 1: Database schema & migrations
- Day 2: Models & validations
- Day 3: API endpoints & controllers
- Day 4: Service layer (AgentService)
- Day 5: Testing & bug fixes

---

## Tasks

See individual task files:
- [01-database-schema.md](./01-database-schema.md) - Schema design & migrations
- [02-api-design.md](./02-api-design.md) - API endpoints specification
- [03-implementation.md](./03-implementation.md) - Service & controller logic
- [04-testing.md](./04-testing.md) - Testing strategy

---

## References

- **Architecture Doc**: [../../../docs/01-architecture.md](../../../docs/01-architecture.md)
- **Letta Database Doc**: [../../../docs/letta/01-letta-database.md](../../../docs/letta/01-letta-database.md)
- **Skill**: [../../../skills/05-database-migration/](../../../skills/05-database-migration/)
