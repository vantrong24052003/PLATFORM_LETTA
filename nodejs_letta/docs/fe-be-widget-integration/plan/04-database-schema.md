# Database Schema - Migration Plan

**Tham khảo**: `migrations/README.md` - Giải thích chi tiết 2 bảng và mapping

---

## Tổng Quan

Migration này tạo **2 TABLES CUSTOM** trong Letta PostgreSQL:
1. `bot_templates` - Bot config templates
2. `agent_mappings` - Map (bot + user) → agent

**KHÔNG tạo/sửa** Letta default tables (`agents`, `messages`, ...)

---

## Vấn Đề Hiện Tại

### FE (ui_mgpt) - Lưu trong localStorage

**File**: `ui_mgpt/src/types/index.ts`

```typescript
interface AIAssistant {
  id: string;                    // chatbotId
  name: string;                  // Bot name
  greeting: string;              // Greeting message
  status: 'active' | 'inactive'; // Status
  knowledgeIds: string[];        // Not used for now
  createdAt: string;
  updatedAt: string;
  systemPrompt?: string;         // System prompt
  primaryColor?: string;         // Theme color
  botAvatarUrl?: string;         // Bot avatar (Base64)
  bubbleIconUrl?: string;        // Bubble icon (Base64)
  footerText?: string;           // Footer text
}
```

**Vấn đề**: Lưu trong localStorage → Mất khi clear browser, không share được

---

### BE (PLATFORM_LETTA) - Tạo agent

**File**: `PLATFORM_LETTA/src/types/index.ts`

```typescript
interface AgentOptions {
  name?: string;
  system?: string;                   // System prompt
  model?: string;                    // LLM model
  embedding?: string;                // Embedding model
  tools?: string[];                  // Tool names
  tool_rules?: any[];                // Tool rules
  include_base_tool_rules?: boolean; // Include base tools
  memory_blocks?: Array<{ label: string; value: string }>;
}
```

**File**: `PLATFORM_LETTA/src/controllers/letta/agent.controller.ts`

```typescript
const { name, system, model, embedding, tools, tool_rules,
        include_base_tool_rules, memory_blocks } = req.body;
const agent = await lettaService.createAgent({ name, system, ... });
```

**Vấn đề**: Mỗi lần tạo agent phải gửi full config → Lặp lại nhiều lần

---

## Giải Pháp: Migrate vào Letta PostgreSQL

### Mục đích

1. **Lưu Bot Template** trong DB thay vì localStorage
2. **Tái sử dụng** config khi tạo agents
3. **Map user → agent** để persistent chat

---

## Table 1: bot_templates

**Purpose**: Lưu Bot Template = AIAssistant (FE) + AgentOptions (BE)

### Mapping Columns

| DB Column | Source | FE/BE Field | Type | Purpose |
|-----------|--------|-------------|------|---------|
| `id` | FE | `AIAssistant.id` | VARCHAR(36) | chatbotId (UUID) |
| `name` | FE | `AIAssistant.name` | VARCHAR(255) | Bot name hiển thị |
| `greeting` | FE | `AIAssistant.greeting` | TEXT | Greeting message |
| `status` | FE | `AIAssistant.status` | VARCHAR(20) | active/inactive |
| `system` | FE | `AIAssistant.systemPrompt` | TEXT | System prompt cho Letta |
| `model` | BE | `AgentOptions.model` | VARCHAR(100) | LLM model (optional) |
| `embedding_model` | BE | `AgentOptions.embedding` | VARCHAR(100) | Embedding model |
| `tools` | BE | `AgentOptions.tools` | JSONB | Array tool names |
| `tool_rules` | BE | `AgentOptions.tool_rules` | TEXT[] | Tool rules |
| `tool_webhooks` | NEW | - | JSONB | Webhooks config (new feature) |
| `include_base_tools` | BE | `AgentOptions.include_base_tool_rules` | BOOLEAN | Include base tools |
| `memory_blocks` | BE | `AgentOptions.memory_blocks` | JSONB | Memory blocks |
| `theme_primary_color` | FE | `AIAssistant.primaryColor` | VARCHAR(7) | Hex color |
| `theme_bot_avatar_url` | FE | `AIAssistant.botAvatarUrl` | TEXT | Avatar Base64/URL |
| `theme_bubble_icon_url` | FE | `AIAssistant.bubbleIconUrl` | TEXT | Bubble icon |
| `theme_footer_text` | FE | `AIAssistant.footerText` | VARCHAR(255) | Footer text |
| `created_at` | FE | `AIAssistant.createdAt` | TIMESTAMP | Created timestamp |
| `updated_at` | FE | `AIAssistant.updatedAt` | TIMESTAMP | Updated timestamp |

### SQL Schema

```sql
CREATE TABLE bot_templates (
  -- Primary
  id                    VARCHAR(36) PRIMARY KEY,

  -- FE fields (AIAssistant)
  name                  VARCHAR(255) NOT NULL,
  greeting              TEXT NOT NULL,
  status                VARCHAR(20) DEFAULT 'active',

  -- BE fields (AgentOptions) - dùng khi tạo Letta agent
  system                TEXT NOT NULL,
  model                 VARCHAR(100),
  embedding_model       VARCHAR(100),
  tools                 JSONB DEFAULT '[]',
  tool_rules            TEXT[],
  include_base_tools    BOOLEAN DEFAULT true,
  memory_blocks         JSONB,

  -- New feature - Tool webhooks
  tool_webhooks         JSONB DEFAULT '{}',

  -- Theme (FE)
  theme_primary_color   VARCHAR(7) DEFAULT '#1677ff',
  theme_bot_avatar_url  TEXT,
  theme_bubble_icon_url TEXT,
  theme_footer_text     VARCHAR(255),

  -- Timestamps
  created_at            TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at            TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Chứng minh**: Tất cả columns đều map từ source code FE/BE ở trên ✓

---

## Table 2: agent_mappings

**Purpose**: Map (chatbotId + userId) → agentId trong Letta

**Vấn đề cần giải quyết**:
- Customer gọi widget với `chatbotId` + `userId`
- Cần check: User này đã có agent chưa?
- Nếu chưa → Tạo agent mới từ bot_templates config
- Nếu có → Dùng agent cũ (persistent chat)

### SQL Schema

```sql
CREATE TABLE agent_mappings (
  id              SERIAL PRIMARY KEY,
  chatbot_id      VARCHAR(36) NOT NULL,     -- FK to bot_templates.id
  user_id         VARCHAR(255),             -- Customer userId (NULL = anonymous)
  agent_id        VARCHAR(255) NOT NULL,    -- Letta agent ID (từ agents table)
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_used_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_chatbot_id
    FOREIGN KEY (chatbot_id)
    REFERENCES bot_templates(id)
    ON DELETE CASCADE,

  CONSTRAINT unique_chatbot_user
    UNIQUE (chatbot_id, user_id)  -- 1 user chỉ có 1 agent per bot
);
```

**Chứng minh**:
- `chatbot_id`: Từ `AIAssistant.id` ✓
- `agent_id`: Từ Letta API response khi create agent ✓
- `user_id`: Từ customer website (widget parameter) ✓

---

## Migration File

**File**: `migrations/001_add_platform_tables.sql`

```sql
-- Table 1: bot_templates
CREATE TABLE bot_templates (
  id                    VARCHAR(36) PRIMARY KEY,
  name                  VARCHAR(255) NOT NULL,
  system                TEXT NOT NULL,
  greeting              TEXT NOT NULL,
  model                 VARCHAR(100),
  embedding_model       VARCHAR(100),
  tools                 JSONB DEFAULT '[]'::jsonb,
  tool_rules            TEXT[],
  tool_webhooks         JSONB DEFAULT '{}'::jsonb,
  include_base_tools    BOOLEAN DEFAULT true,
  memory_blocks         JSONB,
  theme_primary_color   VARCHAR(7) DEFAULT '#1677ff',
  theme_bot_avatar_url  TEXT,
  theme_bubble_icon_url TEXT,
  theme_footer_text     VARCHAR(255),
  status                VARCHAR(20) DEFAULT 'active',
  created_at            TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at            TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_bot_templates_name ON bot_templates(name);
CREATE INDEX idx_bot_templates_status ON bot_templates(status);

-- Table 2: agent_mappings
CREATE TABLE agent_mappings (
  id              SERIAL PRIMARY KEY,
  chatbot_id      VARCHAR(36) NOT NULL,
  user_id         VARCHAR(255),
  agent_id        VARCHAR(255) NOT NULL,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_used_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_chatbot_id FOREIGN KEY (chatbot_id)
    REFERENCES bot_templates(id) ON DELETE CASCADE,
  CONSTRAINT unique_chatbot_user UNIQUE (chatbot_id, user_id)
);

CREATE INDEX idx_agent_mappings_chatbot_user ON agent_mappings(chatbot_id, user_id);
CREATE INDEX idx_agent_mappings_agent_id ON agent_mappings(agent_id);

-- Triggers
CREATE FUNCTION update_bot_templates_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_bot_templates_updated_at
BEFORE UPDATE ON bot_templates
FOR EACH ROW
EXECUTE FUNCTION update_bot_templates_updated_at();
```

---

## Run Migration

```bash
# Connect vào Letta PostgreSQL
psql -h localhost -p 5433 -U postgres -d postgres -f migrations/001_add_platform_tables.sql

# Verify
psql -h localhost -p 5433 -U postgres -d postgres -c "
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'bot_templates'
ORDER BY ordinal_position;
"
```

---

## Flow Sử Dụng

### 1. Admin tạo bot template (FE)

**Trước** (localStorage):
```typescript
// FE lưu vào localStorage
const assistant: AIAssistant = {
  id: 'bot_123',
  name: 'Support Bot',
  greeting: 'Hello!',
  systemPrompt: 'You are...',
  primaryColor: '#1677ff',
  ...
};
localStorage.setItem('assistants', JSON.stringify([assistant]));
```

**Sau** (Database):
```typescript
// FE gọi BE API
POST /api/letta/bots
{
  id: 'bot_123',
  name: 'Support Bot',
  greeting: 'Hello!',
  system: 'You are...',
  tools: ['search'],
  theme_primary_color: '#1677ff'
}

// BE lưu vào bot_templates table
INSERT INTO bot_templates (...) VALUES (...);
```

### 2. Widget get or create agent

**Request từ widget**:
```typescript
POST /api/letta/agents/get-or-create
{
  chatbotId: 'bot_123',
  userId: 'user_456'
}
```

**BE logic**:
```typescript
// 1. Check agent_mappings
const mapping = await db.query(
  'SELECT agent_id FROM agent_mappings WHERE chatbot_id = $1 AND user_id = $2',
  ['bot_123', 'user_456']
);

if (mapping.rows.length > 0) {
  // Có rồi → return
  return { agentId: mapping.rows[0].agent_id };
}

// 2. Load bot config từ bot_templates
const bot = await db.query(
  'SELECT * FROM bot_templates WHERE id = $1',
  ['bot_123']
);

// 3. Tạo agent trong Letta với config từ DB
const agent = await lettaService.createAgent({
  name: `${bot.name} - ${userId}`,
  system: bot.system,          // ← Từ DB
  model: bot.model,            // ← Từ DB
  tools: bot.tools,            // ← Từ DB
  tool_rules: bot.tool_rules,  // ← Từ DB
  include_base_tool_rules: bot.include_base_tools,
  memory_blocks: bot.memory_blocks
});

// 4. Save mapping
await db.query(
  'INSERT INTO agent_mappings (chatbot_id, user_id, agent_id) VALUES ($1, $2, $3)',
  ['bot_123', 'user_456', agent.id]
);

return { agentId: agent.id };
```

---

## So Sánh Trước/Sau

### Trước Migration

```typescript
// Mỗi lần tạo agent → Gửi full config
POST /api/letta/agents
{
  name: "Agent for user 123",
  system: "You are a helpful assistant...",  // Lặp lại
  tools: ["search", "checkout"],              // Lặp lại
  model: "glm-4.7",                           // Lặp lại
  ...
}
```

### Sau Migration

```typescript
// Chỉ gửi chatbotId
POST /api/letta/agents/get-or-create
{
  chatbotId: "bot_123",  // Config đã lưu trong bot_templates
  userId: "user_456"
}

// BE tự load config từ DB
```

**Benefits**:
- ✅ Không duplicate config
- ✅ Update 1 bot template → affect tất cả agents mới
- ✅ Persistent agent per user
- ✅ Ít data gửi qua network

---

## Chứng Minh Columns Đúng

| Column | Source File | Line | Confirmed |
|--------|-------------|------|-----------|
| `id`, `name`, `greeting` | `ui_mgpt/src/types/index.ts` | 71-73 | ✓ |
| `status` | `ui_mgpt/src/types/index.ts` | 74 | ✓ |
| `system` (từ systemPrompt) | `ui_mgpt/src/types/index.ts` | 79 | ✓ |
| `primaryColor` → `theme_primary_color` | `ui_mgpt/src/types/index.ts` | 80 | ✓ |
| `botAvatarUrl`, `bubbleIconUrl`, `footerText` | `ui_mgpt/src/types/index.ts` | 81-83 | ✓ |
| `name`, `system`, `model`, `embedding` | `PLATFORM_LETTA/src/types/index.ts` | 2-5 | ✓ |
| `tools`, `tool_rules` | `PLATFORM_LETTA/src/types/index.ts` | 6-7 | ✓ |
| `include_base_tool_rules` | `PLATFORM_LETTA/src/types/index.ts` | 8 | ✓ |
| `memory_blocks` | `PLATFORM_LETTA/src/types/index.ts` | 9 | ✓ |

**Kết luận**: TẤT CẢ columns đều có source từ code FE/BE ✓

---

## Mối Quan Hệ Với Letta Tables

### Custom Tables vs Letta Tables

```
Letta PostgreSQL Database
│
├── LETTA TABLES (default - đừng động)
│   ├── agents              ← Letta agent instances
│   ├── messages            ← Chat messages
│   ├── blocks, tools, ...
│
└── CUSTOM TABLES (migration tạo)
    ├── bot_templates       ← Bot configs
    └── agent_mappings      ← User-to-agent mappings
```

### Relationships

**1. bot_templates → agents** (Logic, NO FK):
- `bot_templates` chứa config template
- Dùng để TẠO agents qua Letta API
- 1 bot template → nhiều agents

**2. agent_mappings.chatbot_id → bot_templates.id** (FK):
```sql
FOREIGN KEY (chatbot_id) REFERENCES bot_templates(id) ON DELETE CASCADE
```

**3. agent_mappings.agent_id → agents.id** (Logic, NO FK):
- Reference tới Letta `agents` table
- KHÔNG dùng FK constraint (Letta quản lý riêng)
- Application-level validation

**Chi tiết đầy đủ**: Xem `migrations/TABLE_RELATIONSHIPS.md`
