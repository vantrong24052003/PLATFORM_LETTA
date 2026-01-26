# Key Concepts

## Bot Template (chatbot_id)

- Created by Admin
- Contains: name, system prompt, tools, theme
- One bot = one configuration
- Stored in rails_letta database

## Agent (agent_id)

- Created per (bot + user)
- Has separate conversation memory
- Persisted in Letta AI
- Mapped in rails_letta database

## User Identity (user_id)

- Provided by customer's website
- Determines agent reuse

## Agent Lifecycle Rules

| Scenario | user_id | Result |
|----------|---------|--------|
| Anonymous | null | New agent created |
| Same user | user_123 | Existing agent reused |
| Different user | user_456 | New agent created |

**Critical**: Agents are NOT shared across users or bots.

## Agent Mapping

Maps `(chatbot_id + user_id) → agent_id`

| chatbot_id | user_id | agent_id |
|------------|---------|----------|
| bot_shop | user_1 | agent_001 |
| bot_shop | user_2 | agent_002 |
| bot_support | user_1 | agent_003 |

Same user can have different agents per bot.

## Persistence

| Data | Storage | Persistence |
|------|---------|-------------|
| Bot Templates | PostgreSQL | Permanent |
| Agent Mappings | PostgreSQL | Permanent |
| Conversation Memory | Letta AI | Per agent |
| Chat History | Preserved across page reloads |
