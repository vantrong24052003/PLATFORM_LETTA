# Phân Tích Gaps

Document này phân tích **các thiếu sót** cần implement để kết nối FE và BE.

---

## Gap 1: Bot Template Storage và APIs

### Mô Tả Vấn Đề
FE tạo AIAssistant objects trong localStorage. BE không có storage hoặc endpoints cho bot configurations. Widget không thể load bot config vì không có API.

### Hiện Trạng
```
Phía FE:
  Data: AIAssistant lưu trong localStorage
  Fields: id, name, greeting, systemPrompt, theme, tools
  Truy cập: Chỉ trong browser

Phía BE:
  Storage: Không có
  APIs: Không có
  Biết về FE data: Không biết gì
```

### Implementation Cần Có

**Cấu trúc data**:
```typescript
interface BotTemplate {
  id: string;              // Giống AIAssistant.id từ FE
  name: string;
  system: string;          // Hướng dẫn hành vi AI
  greeting: string;        // Message khởi đầu (Markdown)
  tools: string[];         // Array of tool names
  toolWebhooks?: {
    [toolName: string]: {
      url: string;
      method: 'GET' | 'POST';
      auth?: {
        type: 'bearer' | 'basic';
        token: string;
      }
    }
  };
  theme: {
    primaryColor: string;
    botAvatarUrl: string;  // Base64
    bubbleIconUrl: string; // Base64
    footerText: string;
  };
  createdAt: string;       // ISO timestamp
  updatedAt: string;       // ISO timestamp
}
```

**Storage Layer**:
```
Loại: File-based JSON storage
Vị trí: ./data/bot_templates.json
Format: Array of BotTemplate objects
Truy cập: BotService class với Map cache
Persistence: Ghi vào file khi create/update/delete
```

**Endpoints cần có**:
```
POST /api/letta/bots
  Đầu vào Body: Partial<BotTemplate> (không có id, timestamps)
  Đầu ra Body: { message: string, data: { bot: BotTemplate } }
  Status: 201 Created
  Tác động: Generate UUID, lưu vào storage

GET /api/letta/bots/:chatbotId
  Đầu vào Params: chatbotId (string)
  Đầu ra Body: { message: string, data: { bot: BotTemplate } }
  Status: 200 OK hoặc 404 Not Found

PUT /api/letta/bots/:chatbotId
  Đầu vào Params: chatbotId (string)
  Đầu vào Body: Partial<BotTemplate>
  Đầu ra Body: { message: string, data: { bot: BotTemplate } }
  Status: 200 OK hoặc 404 Not Found
  Tác động: Update updatedAt timestamp, lưu vào storage

DELETE /api/letta/bots/:chatbotId
  Đầu vào Params: chatbotId (string)
  Đầu ra Body: { message: string, data: { success: boolean } }
  Status: 200 OK hoặc 404 Not Found
  Tác động: Xóa khỏi storage
```

**Files cần implement**:
```
src/types/index.ts          - Thêm BotTemplate interface
src/services/letta/bot.service.ts  - BotService class
src/controllers/letta/bot.controller.ts - HTTP handlers
src/routes/letta/bot.routes.ts - Express routes
data/bot_templates.json     - File storage
```

---

## Gap 2: Agent Mapping System

### Mô Tả Vấn Đề
Không có cơ chế map (chatbotId + userId) sang agentId. Kết quả: Không thể reuse agents, mỗi interaction tạo agent mới, không có persistent chat history per user.

### Hiện Trạng
```
BE APIs:
  POST /api/letta/agents → Luôn tạo agent mới
  GET /api/letta/agents/:agentId → Cần biết trước agentId

Vấn đề:
  Widget có chatbotId và userId
  Widget cần agentId
  Không có API để resolve: (chatbotId + userId) → agentId
```

### Implementation Cần Có

**Cấu trúc data**:
```typescript
interface AgentMapping {
  chatbotId: string;
  userId: string | null;   // null nghĩa là anonymous user
  agentId: string;         // Letta agent ID
  createdAt: string;       // ISO timestamp
}
```

**Storage Layer**:
```
Loại: File-based JSON storage
Vị trí: ./data/agent_mappings.json
Format: Array of AgentMapping objects
Key Strategy: `${chatbotId}_${userId || 'anonymous'}`
Truy cập: BotService class với Map cache
```

**Endpoints cần có**:
```
POST /api/letta/bots/:chatbotId/agents
  Đầu vào Params: chatbotId (string)
  Đầu vào Body: { userId?: string }
  Logic:
    1. Kiểm tra mapping đã tồn tại cho (chatbotId + userId)
    2. Nếu có: trả về agentId hiện có
    3. Nếu không:
       a. Load bot template config
       b. Tạo Letta agent với bot config
       c. Lưu mapping
       d. Trả về agentId mới
  Đầu ra Body: {
    message: string,
    data: { mapping: AgentMapping }
  }
  Status: 201 Created (mới) hoặc 200 OK (đã có)

GET /api/letta/bots/:chatbotId/agents?userId=xxx
  Đầu vào Params: chatbotId (string)
  Đầu vào Query: userId (string, optional)
  Đầu ra Body: {
    message: string,
    data: { mapping: AgentMapping }
  }
  Status: 200 OK hoặc 404 Not Found
```

**Files cần implement**:
```
src/types/index.ts          - Thêm AgentMapping interface
src/services/letta/bot.service.ts  - Thêm mapping methods
src/controllers/letta/bot.controller.ts - Thêm agent handlers
src/routes/letta/bot.routes.ts - Thêm agent routes
data/agent_mappings.json    - File storage
```

---

## Gap 3: Embed Widget

### Mô Tả Vấn Đề
FE generate embed code trỏ đến `https://uimgpt.com/embed.js`. File không tồn tại. Không có widget project, không có build process, không có deliverable.

### Hiện Trạng
```
Code được generate:
  <script src="https://uimgpt.com/embed.js" data-assistant-id="xxx"></script>

Thực tế:
  File: Không tồn tại
  Project: Không tồn tại
  Chức năng: Không có
```

### Implementation Cần Có

**Cấu trúc project**:
```
widget/
├── package.json
├── webpack.config.js
├── src/
│   ├── index.js              - Entry point, auto-init
│   ├── bot.js                - loadBotConfig()
│   ├── agent.js              - Agent lifecycle
│   ├── ui.js                 - Render bubble + chatbox
│   ├── chat.js               - Chat message handling
│   ├── tool-execution.js     - Tool call execution
│   └── styles.css            - Widget styles
└── dist/
    └── embed.js              - Build output (single file)
```

**Technology Stack**:
```
Ngôn ngữ: Vanilla JavaScript (ES6+)
Build Tool: Webpack
Bundler Config: UMD format
CSS: Inline qua style-loader
Dependencies: Không (standalone)
Output: Single file embed.js
```

**Chức năng cốt lõi**:
```javascript
// Auto-initialization khi script load
(function autoInit() {
  Đầu vào: <script> tag với attribute data-assistant-id
  Xử lý:
    1. Đọc chatbotId từ data-assistant-id
    2. Gọi GET /api/letta/bots/:chatbotId
    3. Apply theme lên UI
    4. Render bubble icon
  Đầu ra: Bubble hiển thị trên customer page
})();

// API expose ra
window.ChatbotWidget = {
  setAgent(agentId: string): void
    Đầu vào: Agent ID
    Hành động: Set agent hiện tại cho chat

  createAgent(userId?: string): Promise<string>
    Đầu vào: User ID (optional)
    Hành động: Gọi POST /api/letta/bots/:chatbotId/agents
    Đầu ra: Agent ID

  getOrCreateAgent(userId: string): Promise<string>
    Đầu vào: User ID
    Hành động: Thử GET trước, tạo mới nếu không tìm thấy
    Đầu ra: Agent ID

  openChat(): void
    Đầu vào: Không
    Hành động: Hiện chatbox UI

  closeChat(): void
    Đầu vào: Không
    Hành động: Ẩn chatbox UI

  onBubbleClick(callback: Function): void
    Đầu vào: Callback function
    Hành động: Register custom click handler
};
```

**Build Command**:
```bash
npm run build
  Đầu vào: src/**/*.js, src/**/*.css
  Xử lý: Webpack bundle với babel-loader
  Đầu ra: dist/embed.js (minified, single file)
```

---

## Gap 4: FE Admin UI Architecture

### Mô Tả Vấn Đề
FE hiện tại lưu AIAssistant trong localStorage only. BE không biết gì về bot templates. Cần thay đổi FE để BE là source of truth.

### Hiện Trạng
```
FE Operation: addAIAssistant(data)
  Đầu vào: Dữ liệu assistant
  Hành động: Lưu vào localStorage
  Network Call: Không có
  Source of Truth: Browser localStorage (SAI)

FE Operation: updateAIAssistant(id, updates)
  Đầu vào: ID + updates
  Hành động: Update localStorage
  Network Call: Không có
  Source of Truth: Browser localStorage (SAI)
```

### Implementation Cần Có

**Thay đổi FE Architecture**:
```
Source of Truth: BE (data/bot_templates.json)
FE Role: Admin UI để CRUD bot templates
localStorage: Không cần (hoặc chỉ là cache để UX tốt)
```

**Update FE Storage Layer**:
```typescript
// src/utils/storage.ts

const BE_API_BASE = 'http://localhost:3000/api/letta';

// CREATE
export const addAIAssistant = async (item): Promise<AIAssistant> => {
  Đầu vào: Omit<AIAssistant, 'id' | 'createdAt' | 'updatedAt'>
  Xử lý:
    1. Map AIAssistant data sang BotTemplate format
    2. Gọi POST /api/letta/bots
    3. BE tạo bot và trả về bot object với id
    4. FE nhận response, return bot object
  Đầu ra: BotTemplate object từ BE
  Tác động: BE storage được update
};

// READ
export const getAIAssistants = async (): Promise<AIAssistant[]> => {
  Đầu vào: Không
  Xử lý:
    1. Gọi GET /api/letta/bots
    2. BE trả về array of bot templates
    3. Map BotTemplate sang AIAssistant format (nếu cần)
  Đầu ra: Array of assistants từ BE
  Tác động: Không
};

// UPDATE
export const updateAIAssistant = async (id, updates): Promise<void> => {
  Đầu vào: Assistant ID + partial updates
  Xử lý:
    1. Map updates sang BotTemplate format
    2. Gọi PUT /api/letta/bots/:id
    3. BE update bot và trả về success
  Đầu ra: Không
  Tác động: BE storage được update
};

// DELETE
export const deleteAIAssistant = async (id): Promise<void> => {
  Đầu vào: Assistant ID
  Xử lý:
    1. Gọi DELETE /api/letta/bots/:id
    2. BE xóa bot và trả về success
  Đầu ra: Không
  Tác động: BE storage được update
};
```

**Data Mapping**:
```typescript
FE AIAssistant → BE BotTemplate
  id          → id (BE generate)
  name        → name
  greeting    → greeting
  systemPrompt → system
  knowledgeIds → (bỏ qua, không dùng trong bot template)
  primaryColor → theme.primaryColor
  botAvatarUrl → theme.botAvatarUrl
  bubbleIconUrl → theme.bubbleIconUrl
  footerText  → theme.footerText
  status      → (bỏ qua, không lưu trong bot template)
  createdAt   → createdAt (BE generate)
  updatedAt   → updatedAt (BE generate)
```

**Lưu ý quan trọng**:
- BE là single source of truth
- FE load data từ BE khi mount component
- FE không lưu localStorage nữa (hoặc chỉ cache tạm để UX tốt)
- Mọi thay đổi đều qua BE API

---

## Gap 5: Tool Webhook Configuration

### Mô Tả Vấn Đề
Widget cần tool webhook URLs để execute tools. Không có UI để config webhooks, không có storage cho webhook config.

### Hiện Trạng
```
FE: Không có UI cho webhook configuration
BE: Không có storage cho webhooks
Widget: Không thể execute tools mà không có webhook URLs
```

### Giải Pháp Đề Xuất

**Option A: Admin UI Configuration** (Phức tạp)
Thêm UI trong FE AIAssistantConfigPage để config webhooks per tool.

**Option B: Customer Runtime Configuration** (Đơn giản, Đề xuất)
Khách hàng provide webhook config khi embed widget.

**Implementation Option B**:
```html
<!-- Website khách hàng -->
<script src="embed.js" data-assistant-id="xxx"></script>
<script>
  ChatbotWidget.configToolWebhooks({
    search_products: {
      url: 'https://my-backend.com/tools/search-products',
      method: 'POST',
      auth: {
        type: 'bearer',
        token: 'customer_secret_123'
      }
    },
    check_inventory: {
      url: 'https://my-backend.com/tools/inventory',
      method: 'GET'
    }
  });
</script>
```

**Lợi ích**: Khách hàng có toàn quyền kiểm soát, không cần thay đổi FE/BE admin UI.

---

## Ma Trận Ưu Tiên

| Gap | Chặn Widget? | Chặn Chat? | Độ phức tạp | Ưu tiên |
|-----|-------------|-----------|-------------|---------|
| Bot Template APIs | Có | Có | Trung bình | Cao nhất |
| Agent Mapping | Không | Không | Thấp | Cao |
| Widget Build | Có | Có | Cao | Cao nhất |
| FE-BE Sync | Không | Không | Thấp | Trung bình |
| Tool Webhooks | Không | Không | Thấp | Thấp |

**Critical Path**: Bot Template APIs → Widget Build → Demo hoạt động

---

Document tiếp theo: [Kế Hoạch Implementation](./03-implementation-plan.md)
