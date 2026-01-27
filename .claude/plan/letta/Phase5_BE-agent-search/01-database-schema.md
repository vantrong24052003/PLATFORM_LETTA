# Agent Search - Database Schema

**Status**: ✅ **NO CHANGES NEEDED**
**Reason**: Agents are stored in Letta Engine. We only use `AgentMapping` for scoping.

---

## 1. Existing Tables (No Changes)

### 1.1. `agent_mappings` (Already Exists)

Used to link Letta agents to organizations and bot templates.

| Column | Type | Notes |
|--------|------|-------|
| `id` | bigint | PK |
| `letta_agent_id` | string | Agent ID in Letta Engine |
| `bot_template_id` | bigint | FK to bot_templates |
| `organization_id` | bigint | FK to organizations |
| `created_at` | datetime | |
| `updated_at` | datetime | |

**Indexes**:
- `index_agent_mappings_on_letta_agent_id`
- `index_agent_mappings_on_organization_id`
- `index_agent_mappings_on_bot_template_id`

**Query Pattern**:
```ruby
# Get all Letta agent IDs for an organization
agent_ids = AgentMapping.where(organization_id: org_id).pluck(:letta_agent_id)

# Get mapping for specific agent
mapping = AgentMapping.find_by(letta_agent_id: agent_id, organization_id: org_id)
```

---

## 2. Letta Engine Tables (External)

### 2.1. `agents` (Letta Schema - Read Only)

We access this via Letta API, not direct DB access.

| Field | Type | Notes |
|-------|------|-------|
| `id` | string/uuid | PK |
| `name` | string | Searchable |
| `description` | string | Searchable (nullable) |
| `system` | string | System prompt |
| `created_at` | datetime | For date filtering |
| `updated_at` | datetime | |

---

## 3. Query Strategy

### Step 1: Get Agent IDs (Our DB)
```ruby
# Get all Letta agent IDs belonging to the organization
letta_agent_ids = AgentMapping
  .where(organization_id: current_organization.id)
  .pluck(:letta_agent_id)
```

### Step 2: Fetch from Letta API
```ruby
# Fetch agent details from Letta Engine
agents = Integration::Letta::Util::HttpClient.get(
  path: "/api/agents",
  query: { ids: letta_agent_ids.join(',') }
)
```

### Step 3: Apply Filters & Pagination
```ruby
# Filter by name/description
filtered = agents.select do |agent|
  keyword.present? ? (
    agent['name']&.downcase&.include?(keyword.downcase) ||
    agent['description']&.downcase&.include?(keyword.downcase)
  ) : true
end

# Filter by date range
filtered = filtered.select do |agent|
  agent['created_at'] >= from_date && agent['created_at'] <= to_date
end if from_date || to_date

# Paginate
Kaminari.paginate_array(filtered).page(page).per(limit)
```

---

## 4. No Migrations Required

```bash
# No migrations needed for this feature
# Existing schema is sufficient
```

---

## 5. Future Enhancements (Out of Scope)

| Enhancement | Migration Needed |
|-------------|------------------|
| Agent caching table | Yes - `cached_agents` |
| Search analytics | Yes - `agent_search_logs` |
| Favorite agents | Yes - `agent_favorites` |
| Agent tags | Yes - `agent_tags`, `agent_taggings` |
