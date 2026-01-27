# Tool Approval - Database Schema

This document defines the database schema for tool approval workflow.

---

## 1. Schema Overview

**Status**: ✅ **COMPLETED** - Existing tables extended for tool forwarding.

**Pending**: Approval state table for tracking pending tool approvals.

---

## 2. Completed Extensions

### 2.1. BotTemplate Extension ✅

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `customer_domain` | string | Nullable, Index | Customer backend domain for tool forwarding |

**Migration**: `20260124150011_add_customer_domain_to_bot_templates.rb`

```ruby
class AddCustomerDomainToBotTemplates < ActiveRecord::Migration[8.1]
  def change
    add_column :letta_bot_templates, :customer_domain, :string
    add_index :letta_bot_templates, :customer_domain
  end
end
```

### 2.2. Organization Extension ✅

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `secret_key` | string | Nullable | HMAC SHA-256 shared secret for signing requests |

**Migration**: `20260124150022_add_secret_key_to_organizations.rb`

```ruby
class AddSecretKeyToOrganizations < ActiveRecord::Migration[8.1]
  def change
    add_column :organizations, :secret_key, :string
  end
end
```

---

## 3. Pending: Tool Approvals Table

**Purpose**: Track pending tool execution approvals from users.

| # | Column | Type | Constraints | Description |
|---|--------|------|-------------|-------------|
| 1 | `id` | uuid | PK | Primary key |
| 2 | `organization_id` | string | Not Null, Index | Multi-tenant isolation |
| 3 | `agent_id` | string | Not Null, Index | Letta agent UUID |
| 4 | `user_id` | string | Not Null | User requesting approval |
| 5 | `tool_name` | string | Not Null | Tool being executed |
| 6 | `tool_arguments` | jsonb | | Tool arguments (JSON) |
| 7 | `status` | string | Default `'pending'` | `pending`, `approved`, `denied` |
| 8 | `resolved_at` | timestamp | | When approval was resolved |
| 9 | `created_at` | timestamp | Not Null | Auto |
| 10 | `updated_at` | timestamp | Not Null | Auto |

---

## 4. Data Flow & Lookup Logic

```ruby
# Resolve Routing Context
template = BotTemplate.joins(:agent_mappings)
                      .find_by(agent_mappings: { agent_id: current_agent_id })

organization = Organization.find(template.organization_id)

# Execution Context
target_url = "https://#{template.customer_domain}/letta/tools/execute"
signature_key = organization.secret_key
```

---

## Related

- [00-overview.md](./00-overview.md) - Feature overview
- [03-implementation.md](./03-implementation.md) - Model implementation
