# Database Schema Design: rails_letta

This document defines the **custom schema** required for `rails_letta` to manage chatbot templates and agent state.

> [!NOTE]
> This schema lives in the `public` (or `rails`) schema of the PostgreSQL database, separate from the `letta` schema used by the Letta Engine. `rails_letta` owns the entire database.

---

## 1. Schema Overview

This schema defines two main tables: `bot_templates` for configuration and `agent_mappings` for state tracking.

---

## 2. Table: `bot_templates`

**Purpose**: Stores the "Source Code" of a chatbot. A blueprint created by Admins in `ui-mgpt`.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | uuid | PK, Not Null | Unique template ID |
| `organization_id` | string | Not Null, Index | **Critical**: Tenant Owner ID |
| `name` | string | Not Null | Human-readable name (e.g., "Support Bot") |
| `greeting` | string | Nullable | Default greeting message |
| `status` | string | Default 'active' | active/inactive |
| `system_prompt` | text | Not Null | The core "character" or system instruction |
| `example_messages` | jsonb | Default `[]` | Few-shot examples for the model |
| `tools` | jsonb | Default `[]` | List of enabled tool names |
| `source_ids` | jsonb | Default `[]` | List of RAG Knowledge Base IDs |
| `theme_config` | jsonb | Default `{}` | CSS vars for widget (colors, fonts) |
| `created_at` | timestamp | Not Null | Timestamp |
| `updated_at` | timestamp | Not Null | Timestamp |

**Why?**
- Separation of concerns: Agents are *instances*; this is the *class*.
- `ui-mgpt` writes to this table (scoped by org).
- `rails_letta` reads this to spawn agents (scoped by org).

---

## 3. Table: `agent_mappings` (The "State Link")

**Purpose**: Maps a specific End User + Bot Template -> Actual Letta Agent.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | uuid | PK, Not Null | Unique mapping ID |
| `organization_id` | string | Not Null, Index | **Critical**: Tenant Owner ID |
| `bot_template_id` | uuid | FK -> `bot_templates.id` | Which bot this belongs to |
| `customer_user_id` | string | Not Null, Index | The ID provided by Customer Frontend |
| `letta_agent_id` | string | Unique, Index | The ID of the actual agent in `letta.agents` |
| `created_at` | timestamp | Not Null | When this user first chatted |
| `updated_at` | timestamp | Not Null | Last active timestamp |

**Logic & Rules**:
1. **Uniqueness**: `(organization_id, bot_template_id, customer_user_id)` needs a UNIQUE composite index.
2. **Reuse**: When a user connects:
   - Query this table for `(org_id, bot_id, user_id)`.
   - **Found?** Return `letta_agent_id` -> Resume chat.
   - **Not Found?** Create new agent in Letta (for this Org) -> Insert row here -> Start chat.
3. **Anonymous Users**: Use a session-based UUID as `customer_user_id`.

**Why?**
- `letta` doesn't know about our "customer_user_id". It just knows `agent_id`.
- This table bridges the gap between our business domain and the AI engine.

---

## 4. Relationship to `letta` Tables

The `letta` schema tables (documented in `04-letta-database.md`) remain **untouched**.
We reference them but do not modify their structure.

- `agent_mappings.letta_agent_id` -> Logic Link -> `letta.agents.id`

> [!IMPORTANT]
> Since referencing across schemas (`public` -> `letta`) can be tricky with ORMs, we typically treat `letta_agent_id` as a "soft foreign key" (string reference) but enforce integrity via application logic in `rails_letta`.

---

## 5. Sample Data Flow

1. **Admin Configuration (One-time Setup)**
   - Admin uses `ui-mgpt` to define rules, tools, and theme.
   - `ui-mgpt` saves this to `bot_templates` table.
   - **Result**: Config sits in DB. No agent exists yet.

2. **Customer Import (Setup)**
   - Customer copies embed script (`botId="bot_123"`) to their Frontend.

3. **Runtime Execution (End User Chat)**
   - User loads page. Widget calls `rails_letta` with `botId="bot_123"`.
   - **Step Enable**: `rails_letta` LOADs the config row from `bot_templates` table.
   - **Step Spawn**: `rails_letta` uses that loaded config (system prompt, tools) to tell Letta Engine: "Create an agent with THESE rules."
   - **Step Map**: Resulting `agent_id` is linked to User.

**Key Concept**: The Agent is a *runtime instance* of the *stored configuration*.
