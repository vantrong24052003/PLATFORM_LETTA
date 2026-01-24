# Task 1: Custom Database Schema for Letta

**Engine**: Letta  
**Estimated Time**: 2 hours  
**Status**: 🟡 Not Started

---

## Objective

Design and create custom Rails tables to store:
1. **Bot Templates** (Configuration blueprints)
2. **Agent Mappings** (Runtime user ↔ agent links)

---

## Table 1: `letta_bot_templates`

**Purpose**: Store bot configuration that will be used to spawn Letta agents.

### Schema

| Column | Type | Required | Index | Default | Description |
|---|---|---|---|---|---|
| `id` | UUID | ✅ | PK | | Primary key |
| `organization_id` | String | ✅ | Yes | | Multi-tenant isolation |
| `name` | String | ✅ | | | Human-readable name |
| `greeting` | Text | ❌ | | | Welcome message for users |
| `status` | String | ❌ | | `'active'` | `'active'` or `'inactive'` |
| `system_prompt` | Text | ✅ | | | Persona memory (Letta's "Who am I?") |
| `tools` | JSONB | ❌ | | `[]` | Array of tool names |
| `source_ids` | JSONB | ❌ | | `[]` | Array of Letta source UUIDs (RAG) |
| `theme_config` | JSONB | ❌ | | `{}` | Widget UI customization |
| `created_at` | Timestamp | ✅ | | | Auto |
| `updated_at` | Timestamp | ✅ | | | Auto |

### JSONB Structures

**`tools`** (Array of strings):
```json
["tool_name_1", "tool_name_2"]
```

**`source_ids`** (Array of UUIDs):
```json
["source-uuid-1", "source-uuid-2"]
```

**`theme_config`** (Object):
```json
{
  "primaryColor": "#1677ff",
  "botAvatarUrl": "data:image/png;base64,...",
  "bubbleIconUrl": "data:image/png;base64,...",
  "footerText": "Powered by LeTTa"
}
```

---

## Table 2: `letta_agent_mappings`

**Purpose**: Map end-users to their Letta agents (1 user + 1 bot = 1 agent).

### Schema

| Column | Type | Required | Index | Description |
|---|---|---|---|---|
| `id` | UUID | ✅ | PK | Primary key |
| `organization_id` | String | ✅ | Yes | Multi-tenant isolation |
| `letta_bot_template_id` | UUID | ✅ | FK | Foreign key to `letta_bot_templates` |
| `customer_user_id` | String | ✅ | Yes | End-user identifier (from customer app) |
| `letta_agent_id` | String | ✅ | Unique | Letta Engine agent UUID |
| `created_at` | Timestamp | ✅ | | Auto |
| `updated_at` | Timestamp | ✅ | | Auto |

### Constraints

**Unique Composite Index**:
```ruby
add_index :letta_agent_mappings, 
  [:organization_id, :letta_bot_template_id, :customer_user_id], 
  unique: true, 
  name: 'idx_letta_mappings_org_bot_user'
```

**Reason**: One user can only have ONE agent per bot template per organization.

---

## Implementation Steps

### Step 1: Generate Resources

```bash
rails g resource Letta::BotTemplate \
  organization_id:string:index \
  name:string \
  greeting:text \
  status:string \
  system_prompt:text \
  tools:jsonb \
  source_ids:jsonb \
  theme_config:jsonb \
  --no-test-framework

rails g resource Letta::AgentMapping \
  organization_id:string:index \
  letta_bot_template:references \
  customer_user_id:string:index \
  letta_agent_id:string:index \
  --no-test-framework
```

### Step 2: Edit Migrations

**Migration 1 (`create_letta_bot_templates.rb`)**:
```ruby
class CreateLettaBotTemplates < ActiveRecord::Migration[8.0]
  def change
    create_table :letta_bot_templates, id: :uuid do |t|
      t.string :organization_id, null: false, index: true
      t.string :name, null: false
      t.text :greeting
      t.string :status, default: 'active'
      t.text :system_prompt, null: false
      t.jsonb :tools, default: []
      t.jsonb :source_ids, default: []
      t.jsonb :theme_config, default: {}
      
      t.timestamps
    end
  end
end
```

**Migration 2 (`create_letta_agent_mappings.rb`)**:
```ruby
class CreateLettaAgentMappings < ActiveRecord::Migration[8.0]
  def change
    create_table :letta_agent_mappings, id: :uuid do |t|
      t.string :organization_id, null: false
      t.references :letta_bot_template, type: :uuid, null: false, foreign_key: true
      t.string :customer_user_id, null: false
      t.string :letta_agent_id, null: false
      
      t.timestamps
    end
    
    add_index :letta_agent_mappings, :letta_agent_id, unique: true
    add_index :letta_agent_mappings, 
      [:organization_id, :letta_bot_template_id, :customer_user_id], 
      unique: true, 
      name: 'idx_letta_mappings_org_bot_user'
  end
end
```

### Step 3: Run Migrations

```bash
rails db:migrate
```

### Step 4: Verify

```bash
rails dbconsole
```

```sql
\dt letta*
\d letta_bot_templates
\d letta_agent_mappings
```

Expected: 2 tables with correct schema.

---

## Model Definitions

**File**: `app/models/letta/bot_template.rb`
```ruby
class Letta::BotTemplate < ApplicationRecord
  has_many :agent_mappings, 
    class_name: 'Letta::AgentMapping',
    foreign_key: :letta_bot_template_id,
    dependent: :destroy
    
  validates :organization_id, :name, :system_prompt, presence: true
  validates :status, inclusion: { in: %w[active inactive] }
end
```

**File**: `app/models/letta/agent_mapping.rb`
```ruby
class Letta::AgentMapping < ApplicationRecord
  belongs_to :bot_template, 
    class_name: 'Letta::BotTemplate',
    foreign_key: :letta_bot_template_id
    
  validates :organization_id, :customer_user_id, :letta_agent_id, presence: true
  validates :letta_agent_id, uniqueness: true
end
```

---

## Acceptance Criteria

- [ ] Migrations run successfully
- [ ] Tables created with UUID primary keys
- [ ] Indexes created (including composite unique index)
- [ ] Models have validations
- [ ] Associations work (`template.agent_mappings.count`)
- [ ] Default values set for JSONB columns

---

## Skills Used

- [05-database-migration](../../skills/05-database-migration/)

---

## Next Task

After schema complete → **Task 2**: [02-letta-client-http.md](./02-letta-client-http.md)
