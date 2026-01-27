# Custom DB Integration - Overview

This document defines the implementation plan for custom database schema to manage Letta bot templates and agent mappings.

---

## 1. Overview

This feature establishes the foundational database schema for managing Letta bot templates and agent mappings within the Rails application.

**Context**: We are operating within an existing **Self-Hosted Letta Database** (Shared Schema). This database is already populated with core system tables.

**Scope**: We are explicitly adding only 2 custom tables (`bot_templates`, `agent_mappings`) to support multi-tenancy without interfering with existing schema.

---

## 2. Business Goals

1. **Multi-Tenancy**: Enable multiple organizations to manage their own bot templates independently
2. **UI Customization**: Allow admins to configure chat widget appearance per bot
3. **Agent Lifecycle Management**: Track which Letta agents belong to which bot templates
4. **Audit Trail**: Maintain created_at/updated_at timestamps for all entities

---

## 3. Technical Goals

1. **Database Schema**: Create `bot_templates` and `agent_mappings` tables
2. **Models**: Implement ActiveRecord models with validations and scopes
3. **Migrations**: Write safe, reversible migrations
4. **API Endpoints**: Expose RESTful CRUD operations for bot templates
5. **Service Layer**: Implement service layer for agent creation/retrieval

---

## 4. Scope

### In Scope
- Database migrations for `bot_templates` and `agent_mappings` tables
- ActiveRecord models with validations
- RESTful CRUD API endpoints
- Service layer for Letta agent management
- RSpec tests with 80%+ coverage

### Out of Scope
- Streaming API (Phase 2)
- Tool approval workflow (Phase 3)
- RAG sources management (Phase 4)
- Widget development (Frontend)
- Frontend integration

---

## 5. Dependencies

**Infrastructure**:
- PostgreSQL database (already exists)
- Rails 8.1.1 (already installed)

**External Services**:
- Letta Engine running on `http://localhost:8283`

**Environment Variables**:
- `LETTA_API_URL` - Must be configured

---

## 6. Acceptance Criteria

- [ ] Database migrations run successfully
- [ ] Models have proper validations (presence, uniqueness)
- [ ] API endpoints return correct HTTP status codes
- [ ] Multi-org isolation is enforced (organization_id scoping)
- [ ] Letta agents can be created via service layer
- [ ] Agent mappings are stored after creation
- [ ] RSpec tests pass with 80%+ coverage
- [ ] No N+1 queries in list endpoints

---

## Related

- [01-database-schema.md](./01-database-schema.md) - Database schema design
- [02-api-design.md](./02-api-design.md) - API endpoints specification
- [03-implementation.md](./03-implementation.md) - Service & controller logic
- [04-testing.md](./04-testing.md) - Testing strategy

- [03-letta-database-schema.md](../../../docs/letta/03-letta-database-schema.md) - Letta's internal tables
- [05-custom-database-design.md](../../../docs/letta/05-custom-database-design.md) - Custom schema design
