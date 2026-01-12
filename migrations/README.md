# Migration: Tạo 2 Bảng Bot

---

## Vì Sao Cần?

- **Vấn đề**: FE lưu bot config trong localStorage → Mất khi clear browser
- **Giải pháp**: Lưu vào DB, tái sử dụng khi tạo agents

---

## Tạo Bảng Gì?

### 1. `bot_templates` - Lưu config bot

| Cột | Map Từ | Ý Nghĩa |
|-----|--------|---------|
| `id` | FE: `AIAssistant.id` | Bot ID |
| `name` | FE: `AIAssistant.name` | Tên bot |
| `greeting` | FE: `AIAssistant.greeting` | Lời chào |
| `system` | FE: `AIAssistant.systemPrompt` | System prompt |
| `llm_config` | Letta: `agents.llm_config` | Model config (JSON) |
| `tool_rules` | Letta: `agents.tool_rules` | Tool rules (JSON) |
| `theme_config` | FE: `primaryColor`, avatars | Theme (JSON) |
| `organization_id` | Letta: `agents.organization_id` | Org ID |
| `status` | FE: `AIAssistant.status` | active/inactive |

**Example**:
```json
{
  "id": "bot_123",
  "name": "Support Bot",
  "system": "You are a support agent",
  "llm_config": {"model": "GLM-4.7"}
}
```

---

### 2. `agent_mappings` - Map user → agent

| Cột | Ý Nghĩa |
|-----|---------|
| `chatbot_id` | Bot ID (FK to `bot_templates.id`) |
| `user_id` | User ID (từ customer website) |
| `agent_id` | Agent ID (trong `letta.agents`) |

**Example**:
```
chatbot_id: "bot_123"
user_id: "user_456"
agent_id: "agent-xxx-yyy-zzz"
```

**Constraint**: 1 user chỉ có 1 agent per bot

---

## Mapping Tổng Quan

```
FE localStorage: AIAssistant
         ↓ (migrate)
    bot_templates
         ↓ (load config)
    Platform BE
         ↓ (call Letta API)
    letta.agents (Letta tự tạo)
         ↑ (reference)
    agent_mappings
```

**FK duy nhất**: `agent_mappings.chatbot_id` → `bot_templates.id`

**KHÔNG có FK** tới `letta.agents` (Letta tự quản lý)

---

## Run Migration

```bash
cat migrations/create_bot_tables.sql | docker exec -i letta_server psql -U letta -d letta
```

---

## Flow Sử Dụng

**Admin tạo bot**:
```
FE → POST /api/letta/bots {id, name, system, ...}
BE → INSERT INTO bot_templates (...)
```

**Widget get agent**:
```
1. Check: SELECT * FROM agent_mappings WHERE chatbot_id=? AND user_id=?
2. Nếu chưa có:
   - Load: SELECT * FROM bot_templates WHERE id=?
   - Call Letta: POST /v1/agents (với config từ bot_templates)
   - Letta tạo: INSERT INTO letta.agents (...) [tự động]
   - Save: INSERT INTO agent_mappings (chatbot_id, user_id, agent_id)
3. Return: agent_id
```

**Chat**:
```
POST /v1/agents/:agentId/messages
```
