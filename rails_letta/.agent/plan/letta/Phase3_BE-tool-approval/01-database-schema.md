# Tool Forwarding - Database Schema

**Status**: 🟡 Planning
**Convention**: Rails Migration & ActiveRecord

---

## 1. Platform Schema Extensions (Public Schema)

We extend existing platform tables to support automated tool forwarding. These fields are essential for routing and security.

### 1.1. `BotTemplate` Extension
- **Field**: `customer_domain` (`string`)
- **Index**: Yes
- **Rationale**: This defines the "WHERE" for tool forwarding. Since LeTTa Engine is agnostic of customer infrastructure, each template must specify where to route external tool requests.

### 1.2. `Organization` Extension
- **Field**: `secret_key` (`string`)
- **Rationale**: This defines the "HOW" for security. Each organization requires a unique shared secret to sign (HMAC SHA-256) outbound requests. This allows the customer's backend to verify that the execution request is authentic and originated from our platform.

---

## 2. Migrations (Ruby)

```ruby
# Migration 1: Routing Support
class AddCustomerDomainToBotTemplates < ActiveRecord::Migration[8.1]
  def change
    add_column :bot_templates, :customer_domain, :string
    add_index :bot_templates, :customer_domain
  end
end

# Migration 2: Security Support
class AddSecretKeyToOrganizations < ActiveRecord::Migration[8.1]
  def change
    add_column :organizations, :secret_key, :string
  end
end
```

---

## 3. LeTTa System Tables (Internal Reference)

We interact with Letta's native tables using ActiveRecord models mapped to the existing schema. No new tables are created in the `letta` schema.

### 3.1. `Message` Model
Used to identify and intercept tool call events during orchestration.

```ruby
class Message < ApplicationRecord
  # Mapping to existing table in the 'letta' schema
  # self.table_name = "letta.messages"

  belongs_to :agent

  # Scope to find tool calls from the assistant
  scope :pending_tools, -> { where(role: 'assistant').where.not(tool_calls: nil) }
end
```

---

## 4. Data Flow & Lookup Logic

When a tool call is detected, Rails must resolve both the **Destination** and the **Signature**:

```ruby
# Resolve Routing Context
template = BotTemplate.joins(:agent_mappings)
                      .find_by(agent_mappings: { agent_id: current_agent_id })

organization = Organization.find(template.organization_id)

# Execution Context
target_url = "https://#{template.customer_domain}/letta/tools/execute"
signature_key = organization.secret_key
```
