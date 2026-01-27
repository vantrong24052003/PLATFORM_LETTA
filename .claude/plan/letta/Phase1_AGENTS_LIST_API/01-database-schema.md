# Agents List API - Database Schema

## Existing Tables (No Migration Required)

### agents table (Letta core table)
| Column | Type | Notes |
|--------|------|-------|
| id | string | Primary key |
| name | string | Agent name |
| organization_id | string | Foreign key (scoping) |
| description | string | Agent description |
| system | string | System prompt |
| created_at | timestamptz | Creation timestamp |
| updated_at | timestamptz | Update timestamp |
| is_deleted | boolean | Soft delete flag |

### agent_mappings table (Our custom table)
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Primary key |
| agent_id | string | Foreign key to agents |
| bot_template_id | uuid | Foreign key to bot_templates |
| user_id | string | User identifier |
| organization_id | string | Organization scoping |
| created_at | datetime | Creation timestamp |
| updated_at | datetime | Update timestamp |

## Indexes Used
- `idx_agent_mappings_org_template_user` - (organization_id, bot_template_id, user_id) UNIQUE
- `ix_agents_organization_id_deployment_id` - (organization_id, deployment_id)

## Query Strategy
```ruby
# Primary query - agents scoped to organization
Agent.where(organization_id: current_org_id)
     .where(is_deleted: false)
     .order(created_at: :desc)
     .page(params[:page])
     .per(params[:per] || 20)
```

## Filters Supported
1. **name** - ILIKE partial match
   ```ruby
   Agent.where("name ILIKE ?", "%#{params[:name]}%")
   ```

2. **status** - Filter by active/inactive (derived from is_deleted)
   ```ruby
   Agent.where(is_deleted: params[:status] == 'inactive')
   ```
