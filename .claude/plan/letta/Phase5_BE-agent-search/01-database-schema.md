# Agent Search - Database Schema

This document defines the database schema for agent search functionality.

---

## 1. Schema Overview

**No database changes required.** Agents are stored in Letta Engine. We only use `AgentMapping` for scoping.

---

## 2. Existing Tables

### AgentMapping (Already Exists)

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | PK |
| `letta_agent_id` | string | Agent ID in Letta Engine |
| `bot_template_id` | uuid | FK to bot_templates |
| `organization_id` | string | Multi-tenant isolation |
| `customer_user_id` | string | End-user identifier |
| `created_at` | timestamp | Auto |
| `updated_at` | timestamp | Auto |

---

## 3. Query Strategy

```ruby
# Step 1: Get agent IDs for organization (Our DB)
agent_ids = AgentMapping
  .where(organization_id: current_organization.id)
  .pluck(:letta_agent_id)

# Step 2: Fetch from Letta API
agents = LettaAPI.agents.list(ids: agent_ids)

# Step 3: Apply filters & pagination
filtered = agents.select { |a| keyword_match?(a, keyword) }
paginated = Kaminari.paginate_array(filtered).page(page).per(limit)
```

---

## Related

- [00-overview.md](./00-overview.md) - Feature overview
- [03-implementation.md](./03-implementation.md) - Query implementation
