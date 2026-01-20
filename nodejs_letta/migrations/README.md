# Migrations

## Run migrations

```bash
# All custom tables (bot_templates, agent_mappings, knowledge_bases)
cat 001_init_custom_tables.sql | docker exec -i letta_server psql -U letta -d letta
```

## What's included

This migration creates **3 custom tables** in the `letta` schema:

### 1. bot_templates
- Store chatbot configurations from UI_MGPT
- Fields: id, name, greeting, system, llm_config, tool_rules, knowledge_base_ids, theme_config
- Indexes: organization_id, status, knowledge_base_ids (GIN)

### 2. agent_mappings
- Map (bot + user) → agent_id in letta.agents
- Fields: id, chatbot_id, user_id, agent_id
- FK: chatbot_id → bot_templates.id (CASCADE delete)
- Unique constraint: (chatbot_id, user_id)

### 3. knowledge_bases
- Manage reusable knowledge bases
- Fields: id, name, description, content, letta_source_id, status
- Link to letta.sources via letta_source_id
- Indexes: organization_id, status, letta_source_id

## Features

✅ Auto-update timestamp triggers for all tables
✅ Proper indexes for query performance
✅ Idempotent (safe to re-run with IF NOT EXISTS)
✅ No FK to Letta internal tables (avoid conflicts)

## Verify

```bash
# Check tables created
docker exec letta_server psql -U letta -d letta -c "\dt letta.*" | grep -E "(bot_templates|agent_mappings|knowledge_bases)"

# Check table structures
docker exec letta_server psql -U letta -d letta -c "\d letta.bot_templates"
docker exec letta_server psql -U letta -d letta -c "\d letta.agent_mappings"
docker exec letta_server psql -U letta -d letta -c "\d letta.knowledge_bases"
```
