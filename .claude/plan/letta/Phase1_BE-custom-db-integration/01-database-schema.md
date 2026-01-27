# Custom DB Integration - Database Schema

This document defines the database schema for managing Letta bot templates and agent mappings.

---

## 1. Schema Overview

Two custom tables to store:
1. **Bot Templates** (Configuration blueprints)
2. **Agent Mappings** (Runtime user ↔ agent links)

---

## 2. Table: `bot_templates`

**Purpose**: Store bot configuration that will be used to spawn Letta agents.

| # | Column | Type | Constraints | Default | Description |
|---|--------|------|-------------|---------|-------------|
| 1 | `id` | uuid | PK | | Primary key |
| 2 | `organization_id` | string | Not Null, Index | | Multi-tenant isolation |
| 3 | `name` | string | Not Null | | Human-readable name |
| 4 | `greeting` | text | Nullable | | Welcome message for users |
| 5 | `status` | string | | `'active'` | `'active'` or `'inactive'` |
| 6 | `system_prompt` | text | Not Null | | Persona memory (Letta's "Who am I?") |
| 7 | `tools` | jsonb | | `[]` | Array of tool names |
| 8 | `source_ids` | jsonb | | `[]` | Array of Letta source UUIDs (RAG) |
| 9 | `theme_config` | jsonb | | `{}` | Widget UI customization |
| 10 | `created_at` | timestamp | Not Null | | Auto |
| 11 | `updated_at` | timestamp | Not Null | | Auto |

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

## 3. Table: `agent_mappings`

**Purpose**: Map end-users to their Letta agents (1 user + 1 bot = 1 agent).

| # | Column | Type | Constraints | Description |
|---|--------|------|-------------|-------------|
| 1 | `id` | uuid | PK | Primary key |
| 2 | `organization_id` | string | Not Null, Index | Multi-tenant isolation |
| 3 | `bot_template_id` | uuid | Not Null, FK | Foreign key to `bot_templates` |
| 4 | `customer_user_id` | string | Not Null, Index | End-user identifier (from customer app) |
| 5 | `letta_agent_id` | string | Not Null, Unique | Letta Engine agent UUID |
| 6 | `created_at` | timestamp | Not Null | Auto |
| 7 | `updated_at` | timestamp | Not Null | Auto |

### Constraints

**Unique Composite Index**:
```ruby
add_index :agent_mappings,
  [:organization_id, :bot_template_id, :customer_user_id],
  unique: true,
  name: 'idx_mappings_org_bot_user'
```

**Reason**: One user can only have ONE agent per bot template per organization.

---

## 4. Relationships

```
bot_templates (1) → (N) agent_mappings
    organization_id → organization_id
           id ← bot_template_id
```

---

## 5. Migration Steps

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
  theme_config:jsonb

rails g resource Letta::AgentMapping \
  organization_id:string:index \
  bot_template:references \
  customer_user_id:string:index \
  letta_agent_id:string:index
```

### Step 2: Edit Migrations

**Migration 1 (`create_letta_bot_templates.rb`)**:
```ruby
class CreateLettaBotTemplates < ActiveRecord::Migration[8.1]
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
class CreateLettaAgentMappings < ActiveRecord::Migration[8.1]
  def change
    create_table :letta_agent_mappings, id: :uuid do |t|
      t.string :organization_id, null: false
      t.references :bot_template, type: :uuid, null: false, foreign_key: { to_table: :letta_bot_templates }
      t.string :customer_user_id, null: false
      t.string :letta_agent_id, null: false

      t.timestamps
    end

    add_index :letta_agent_mappings, :letta_agent_id, unique: true
    add_index :letta_agent_mappings,
      [:organization_id, :bot_template_id, :customer_user_id],
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

---

## 6. Model Definitions

**File**: `app/models/letta/bot_template.rb`

```ruby
# frozen_string_literal: true

class Letta::BotTemplate < ApplicationRecord
  has_many :agent_mappings,
    class_name: 'Letta::AgentMapping',
    foreign_key: :bot_template_id,
    dependent: :destroy

  validates :organization_id, :name, :system_prompt, presence: true
  validates :status, inclusion: { in: %w[active inactive] }
end
```

**File**: `app/models/letta/agent_mapping.rb`

```ruby
# frozen_string_literal: true

class Letta::AgentMapping < ApplicationRecord
  belongs_to :bot_template,
    class_name: 'Letta::BotTemplate',
    foreign_key: :bot_template_id

  validates :organization_id, :customer_user_id, :letta_agent_id, presence: true
  validates :letta_agent_id, uniqueness: true

  validates :bot_template_id, uniqueness: { scope: [:organization_id, :customer_user_id] }
end
```

---

## Related

- [00-overview.md](./00-overview.md) - Feature overview
- [03-implementation.md](./03-implementation.md) - Model implementation
- [05-custom-database-design.md](../../../docs/letta/05-custom-database-design.md) - Custom schema design reference
