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

---

## 6. Database Connection Diagram

This diagram shows how our 2 custom tables connect to Letta Engine's internal tables.

```
┌─────────────────────────────────────────────────────────────────┐
│                    CUSTOM RAILS TABLES (public)                  │
└─────────────────────────────────────────────────────────────────┘

    ┌────────────────────────┐
    │  letta_bot_templates   │ (Admin creates this)
    ├────────────────────────┤
    │ id (uuid)              │
    │ organization_id        │
    │ name                   │
    │ system_prompt ────────┼──┐ (Injected into Agent Memory)
    │ source_ids ───────────┼─┐│ (Linked to Letta Sources)
    │ tools                  │ ││
    │ theme_config           │ ││
    └────────────────────────┘ ││
              │                ││
              │ 1:N            ││
              ▼                ││
    ┌────────────────────────┐ ││
    │  letta_agent_mappings  │ ││ (Runtime mapping)
    ├────────────────────────┤ ││
    │ id (uuid)              │ ││
    │ organization_id        │ ││
    │ bot_template_id (FK)   │ ││
    │ customer_user_id       │ ││
    │ letta_agent_id ────────┼─┼┼──┐ (Link to Engine)
    └────────────────────────┘ │││  │
                               │││  │
┌──────────────────────────────────────────────────────────────────┐
│                  LETTA ENGINE TABLES (letta)                      │
└──────────────────────────────────────────────────────────────────┘
                               │││  │
    ┌──────────────────────────┘││  │
    │  letta.sources            ││  │
    ├───────────────────────────┤│  │
    │ id (string) ◄─────────────┘│  │
    │ name                       │  │
    │ description                │  │
    └────────────────────────────┘  │
                                    │
    ┌───────────────────────────────┘
    │  letta.agents
    ├─────────────────────────┐
    │ id (string) ◄───────────┼─── (letta_agent_id points here)
    │ name                    │
    │ system ◄────────────────┼─── (system_prompt copied here)
    │ organization_id         │
    └─────────────────────────┘
              │ 1:N
              ▼
    ┌─────────────────────────┐
    │  letta.memory_blocks    │ (Agent's brain)
    ├─────────────────────────┤
    │ id                      │
    │ agent_id (FK)           │
    │ label (persona/human)   │
    │ value                   │
    └─────────────────────────┘
```

**Connection Summary**:
1. `letta_bot_templates.source_ids` → References `letta.sources.id` (Array)
2. `letta_agent_mappings.letta_agent_id` → References `letta.agents.id` (String)
3. `letta_bot_templates.system_prompt` → Copied to `letta.agents.system` during spawn

---

## 7. Data Mapping Strategy (Critical)

This section clarifies exactly where `bot_templates` data "lands" inside the Letta Engine.

| Bot Template Column | Database Table | Letta Destination | Purpose | Usage Type |
| :--- | :--- | :--- | :--- | :--- |
| **`system_prompt`** | `bot_templates` | **Memory Block** (`persona`) | Defines **Identity & Behavior** ("Who am I?"). Injected into the agent's core memory (RAM). | **Always Active** |
| **`source_ids`** | `bot_templates` | **Sources** (`sources`) | Defines **Knowledge Base** (RAG). Linked to the agent as reference material. | **On Demand** (Search) |
| **`tools`** | `bot_templates` | **Tools** (`tools`) | Defines **Capabilities**. Enabled for the agent to use. | **On Demand** (Execution) |
| **`theme_config`** | `bot_templates` | **Widget UI** (Client-side) | Defines **Widget Appearance** (color, icons, footer). | **Load Once** |

**`theme_config` JSONB Structure**:
```json
{
  "primaryColor": "#1677ff",
  "botAvatarUrl": "data:image/png;base64,...",
  "bubbleIconUrl": "data:image/png;base64,...",
  "footerText": "Prompted by CONFERENCE PARK"
}
```


> [!IMPORTANT]
> - **Memory Blocks** are for **Character**: "You are helpful."
> - **Sources** are for **Knowledge**: "The refund policy is 30 days."
> The `rails_letta` backend is responsible for enforcing this mapping during the `Create Agent` API call.
