# Phân Tích Hiện Trạng

Document này phân tích **hiện trạng** của 2 projects: FE (ui_mgpt) và BE (PLATFORM_LETTA).

---

## FE Project: ui_mgpt

### Technology Stack
- Framework: React + TypeScript
- UI Library: Ant Design
- State Management: Không có
- Build Tool: Vite

### Data Model

```typescript
interface AIAssistant {
  id: string;                    // Tạo bằng: crypto.randomUUID()
  name: string;                  // Ví dụ: "E-commerce Support Bot"
  greeting: string;              // Format: Markdown
  status: 'active' | 'inactive';
  knowledgeIds: string[];        // References đến knowledge bases
  systemPrompt?: string;         // Ví dụ: "You are a helpful assistant"
  primaryColor?: string;         // Ví dụ: "#1677ff"
  botAvatarUrl?: string;         // Ảnh encode Base64
  bubbleIconUrl?: string;        // Ảnh encode Base64
  footerText?: string;           // Ví dụ: "Powered by AI"
  createdAt: string;             // ISO string
  updatedAt: string;             // ISO string
}
```

### Storage Integration - Phase 3

**Phase 3 sẽ implement**: FE utility functions gọi BE APIs

```typescript
// Functions cần implement trong ui_mgpt/src/utils/storage.ts:

addAIAssistant(item): Promise<AIAssistant>
  → Gọi POST /api/letta/bots

getAIAssistants(): Promise<AIAssistant[]>
  → Gọi GET /api/letta/bots

updateAIAssistant(id, updates): Promise<void>
  → Gọi PUT /api/letta/bots/:id

deleteAIAssistant(id): Promise<void>
  → Gọi DELETE /api/letta/bots/:id
```

### Embed Code Generation

**Vị trí**: `src/components/EmbedCodeModal.tsx` (dòng 20-22)

**Logic**:
```typescript
const embedCode = `<script src="https://uimgpt.com/embed.js" data-assistant-id="${assistant.id}"></script>`;
```

**Đầu vào**: AIAssistant object
**Đầu ra**: HTML script tag string với attribute data-assistant-id

### Tính Năng Đã Có

**FE Admin UI hoạt động**:
1. Form tạo/sửa AI Assistant với đầy đủ fields
2. Upload ảnh avatar và bubble icon (Base64)
3. Config name, greeting, system prompt, theme, tools
4. Generate embed code với assistant.id
5. Quản lý danh sách assistants (list, edit, delete)

**Cần bổ sung**:
- Kết nối FE với BE APIs (Phase 3)
- FE sẽ gọi POST/GET/PUT/DELETE /api/letta/bots
- Source of truth: BE storage thay vì browser storage

---

## BE Project: PLATFORM_LETTA

### Technology Stack
- Runtime: Node.js
- Framework: Express.js
- Language: TypeScript
- AI Integration: @letta-ai/letta-client
- Letta Server: http://localhost:8283

### API Endpoints

**Base URL**: `http://localhost:3000`

**Endpoints liên quan đến Widget Platform**:

```
POST /api/letta/agents
  Đầu vào Body: {
    name?: string,
    system?: string,
    tools?: string[],
    memory_blocks?: Array<{label: string, value: string}>
  }
  Đầu ra: {
    message: "Agent created successfully",
    data: { agent: LettaAgentObject }
  }
  Status: 201 Created
  Sử dụng: BotService gọi khi tạo agent cho chatbot user

POST /api/letta/agents/:agentId/messages
  Đầu vào Params: agentId (string)
  Đầu vào Body: {
    message?: string,
    messages?: Array<{role: string, content: string}>,
    approve?: boolean,
    approval_request_id?: string
  }
  Đầu ra: {
    message: "Message sent successfully",
    data: {
      response: {
        messages: Array<MessageObject>
      }
    }
  }
  Status: 200 OK
  Sử dụng: Widget gọi để gửi user message và nhận AI response
```

**Note**: BE còn có endpoints khác (`POST /api/letta/tools`, `DELETE /api/letta/blocks/:blockId`, v.v.) nhưng đây là developer utilities, không dùng trong widget platform flow.

### Service Layer

**LettaService - Methods liên quan đến Widget Platform**:

```typescript
createAgent(options: AgentOptions): Promise<LettaAgentObject>
  Đầu vào: {
    name?: string,
    system?: string,
    tools?: string[],
    memory_blocks?: Array<{label, value}>
  }
  Đầu ra: Letta agent object với id, name, system, v.v.
  Tác động: Tạo agent trên Letta server (localhost:8283)
  Sử dụng: BotService gọi method này khi tạo agent cho user

sendMessage(agentId: string, params: MessageParams): Promise<MessageResponse>
  Đầu vào: Agent ID + message params
  Đầu ra: Response với messages array
  Tác động: Thêm message vào conversation history của agent
  Sử dụng: Widget gọi qua BE để chat với AI
```

**Note**: LettaService có thêm các methods khác (`listTools`, `deleteBlock`, `upsertTool`, v.v.) nhưng đây là utilities cho developer, không liên quan đến widget platform flow.

### Khả Năng Liên Quan Widget Platform

**Tính năng sử dụng cho Widget**:
1. Tạo Letta AI agents với custom system prompts
   - Dùng khi: BotService tạo agent mới cho user
2. Chat với agents (stateful conversation với memory)
   - Dùng khi: Widget gửi user message và nhận AI response
3. Tool calling với human-in-the-loop approval
   - Dùng khi: AI cần execute tool (search, database query, v.v.)

**Tính năng khác**: BE còn hỗ trợ register tools, quản lý memory blocks, v.v. nhưng đây là developer utilities.

**Lưu trữ data**: Letta server (localhost:8283) xử lý agent memory và conversation history

**Giao tiếp mạng**: Express server forward requests đến Letta server qua @letta-ai/letta-client

---

## Các Components Còn Thiếu

### Bot Template System

**Trạng thái**: Chưa implement

**Cần cho**: Widget cần load bot configuration theo chatbotId

**Thiếu gì**:
- Không có storage cho bot templates
- Không có endpoints: GET /api/letta/bots/:chatbotId
- Không có mapping giữa FE AIAssistant và BE BotTemplate

### Agent Mapping System

**Trạng thái**: Chưa implement

**Cần cho**: Chat sessions persistent theo user

**Thiếu gì**:
- Không có storage cho mappings (chatbotId + userId) đến agentId
- Không có endpoints: POST /api/letta/bots/:chatbotId/agents
- Không có endpoints: GET /api/letta/bots/:chatbotId/agents?userId=xxx

### Embed Widget

**Trạng thái**: Chưa implement

**Cần cho**: Embed code được generate phải hoạt động

**Thiếu gì**:
- File embed.js không tồn tại
- Không có widget project/codebase
- Script tag generate ra nhưng không có file đích

### FE Storage Integration (Cần Implement)

**Cần làm**: Kết nối FE với BE APIs

```
FE cần gọi BE APIs:
  POST   /api/letta/bots           - Tạo bot template
  GET    /api/letta/bots           - List all bots
  GET    /api/letta/bots/:id       - Get single bot
  PUT    /api/letta/bots/:id       - Update bot
  DELETE /api/letta/bots/:id       - Delete bot
```

**Source of truth**: BE storage (data/bot_templates.json)
**Phase 3 sẽ implement**: FE utility functions gọi các APIs này

---

## Flow Hoàn Chỉnh: Từ Admin Setup Đến User Chat

### PHASE 1: Admin Tạo Bot Template (1 LẦN DUY NHẤT)

```
┌─────────────────────────────────────────────────────────────┐
│ Bước 1.1: Admin mở FE UI và điền form                       │
├─────────────────────────────────────────────────────────────┤
│ Đầu vào:                                                     │
│   - name: "Support Bot"                                     │
│   - system: "You are a helpful support agent"              │
│   - greeting: "Hello! How can I help?"                      │
│   - tools: ["search_products", "check_inventory"]          │
│   - theme: {                                                │
│       primaryColor: "#1677ff",                              │
│       botAvatarUrl: "data:image...",                        │
│       bubbleIconUrl: "data:image..."                        │
│     }                                                        │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ Bước 1.2: FE gọi BE API                                     │
├─────────────────────────────────────────────────────────────┤
│ Request:                                                     │
│   POST http://localhost:3000/api/letta/bots                │
│   Body: { name, system, greeting, tools, theme }           │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ Bước 1.3: BE xử lý và lưu Bot Template                     │
├─────────────────────────────────────────────────────────────┤
│ BE tạo:                                                      │
│   - Generate UUID: "bot_abc123"                             │
│   - Add timestamps: createdAt, updatedAt                    │
│                                                              │
│ BE lưu vào: data/bot_templates.json                        │
│   {                                                          │
│     "id": "bot_abc123",                                     │
│     "name": "Support Bot",                                  │
│     "system": "You are a helpful support agent",           │
│     "greeting": "Hello! How can I help?",                  │
│     "tools": ["search_products", "check_inventory"],       │
│     "theme": { primaryColor: "#1677ff", ... },             │
│     "createdAt": "2024-01-01T00:00:00Z",                   │
│     "updatedAt": "2024-01-01T00:00:00Z"                    │
│   }                                                          │
│                                                              │
│ BE trả về:                                                   │
│   Status: 201 Created                                       │
│   Body: { data: { bot: { id: "bot_abc123", ... } } }      │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ Bước 1.4: FE generate embed code                           │
├─────────────────────────────────────────────────────────────┤
│ FE tạo string:                                              │
│   <script src="https://cdn.yourplatform.com/embed.js"     │
│           data-assistant-id="bot_abc123"></script>         │
│                                                              │
│ FE hiển thị: Modal với embed code để admin copy            │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ Bước 1.5: Admin gửi embed code cho customer               │
├─────────────────────────────────────────────────────────────┤
│ Admin copy embed code và gửi qua:                          │
│   - Email                                                    │
│   - Documentation                                           │
│   - Support ticket                                          │
└─────────────────────────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
QUAN TRỌNG: Bot Template = Mẫu chung
- Tạo 1 lần, dùng cho tất cả users
- Lưu trong BE storage (data/bot_templates.json)
- Chứa: system prompt, tools, theme để tạo agents và render UI
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

### PHASE 2: Customer Tích Hợp Widget

```
┌─────────────────────────────────────────────────────────────┐
│ Bước 2.1: Customer paste embed code vào website            │
├─────────────────────────────────────────────────────────────┤
│ File: customer-website.com/index.html                       │
│                                                              │
│ <body>                                                       │
│   <h1>My Website</h1>                                       │
│                                                              │
│   <script src="https://cdn.yourplatform.com/embed.js"     │
│           data-assistant-id="bot_abc123"></script>         │
│ </body>                                                      │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ Bước 2.2: Browser load và execute embed.js                 │
├─────────────────────────────────────────────────────────────┤
│ Browser download: embed.js từ CDN                           │
│ Browser execute: JavaScript trong file                      │
│                                                              │
│ Widget code chạy:                                           │
│   const scriptTag = document.currentScript;                │
│   const chatbotId = scriptTag.getAttribute(                │
│     'data-assistant-id'                                     │
│   );                                                         │
│   // chatbotId = "bot_abc123"                              │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ Bước 2.3: Widget load Bot Template config                  │
├─────────────────────────────────────────────────────────────┤
│ Widget gọi:                                                  │
│   GET http://localhost:3000/api/letta/bots/bot_abc123     │
│                                                              │
│ BE đọc: data/bot_templates.json                            │
│                                                              │
│ BE trả về:                                                   │
│   {                                                          │
│     "data": {                                               │
│       "bot": {                                              │
│         "id": "bot_abc123",                                │
│         "name": "Support Bot",                             │
│         "greeting": "Hello! How can I help?",              │
│         "theme": {                                          │
│           "primaryColor": "#1677ff",                       │
│           "bubbleIconUrl": "data:image..."                 │
│         }                                                    │
│       }                                                      │
│     }                                                        │
│   }                                                          │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ Bước 2.4: Widget render bubble icon                        │
├─────────────────────────────────────────────────────────────┤
│ Widget tạo DOM:                                             │
│   <div id="chatbot-bubble"                                 │
│        style="                                              │
│          position: fixed;                                   │
│          bottom: 20px;                                      │
│          right: 20px;                                       │
│          background-color: #1677ff;    ← Từ theme         │
│          ...                                                │
│        ">                                                    │
│     <img src="data:image..." />        ← Từ theme         │
│   </div>                                                    │
│                                                              │
│ Append vào: document.body                                  │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ Bước 2.5: Widget sẵn sàng                                  │
├─────────────────────────────────────────────────────────────┤
│ Trạng thái:                                                 │
│   - Bubble hiển thị ở góc phải dưới                        │
│   - Chatbox ẩn, chưa tạo agent                             │
│   - Chờ user click bubble                                  │
└─────────────────────────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MỤC ĐÍCH PHASE 2:
- Load theme từ Bot Template để render UI giống 100% với admin config
- Widget chưa tạo agent, chỉ render UI
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

### PHASE 3: User Click Bubble - Tạo Agent Lần Đầu

```
┌─────────────────────────────────────────────────────────────┐
│ Bước 3.1: User A click bubble                              │
├─────────────────────────────────────────────────────────────┤
│ Browser trigger: onclick event                              │
│ Widget code:                                                │
│   - userId = "user_001" (customer quyết định)             │
│   - Call: createAgent(userId)                              │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ Bước 3.2: Widget gọi BE tạo agent                         │
├─────────────────────────────────────────────────────────────┤
│ Widget gọi:                                                  │
│   POST http://localhost:3000/api/letta/bots/bot_abc123/   │
│        agents                                               │
│   Body: { userId: "user_001" }                             │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ Bước 3.3: BE check agent mapping                           │
├─────────────────────────────────────────────────────────────┤
│ BE đọc: data/agent_mappings.json                           │
│                                                              │
│ Check: Có agent nào cho (bot_abc123 + user_001)?          │
│   → CHƯA CÓ (lần đầu tiên)                                 │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ Bước 3.4: BE load Bot Template config                      │
├─────────────────────────────────────────────────────────────┤
│ BE đọc: data/bot_templates.json                            │
│                                                              │
│ Lấy config của bot_abc123:                                 │
│   {                                                          │
│     "system": "You are a helpful support agent",           │
│     "tools": ["search_products", "check_inventory"]        │
│   }                                                          │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ Bước 3.5: BE gọi Letta tạo agent MỚI                       │
├─────────────────────────────────────────────────────────────┤
│ BE gọi:                                                      │
│   POST http://localhost:8283/agents                         │
│   Body: {                                                    │
│     "name": "bot_abc123_user_001",                         │
│     "system": "You are a helpful support agent",           │
│     "tools": ["search_products", "check_inventory"]        │
│   }                                                          │
│                                                              │
│ Letta tạo agent và trả về:                                 │
│   {                                                          │
│     "id": "agent_xyz789",                                  │
│     "system": "You are a helpful support agent",           │
│     "tools": ["search_products", "check_inventory"],       │
│     "memory": { ... }                                       │
│   }                                                          │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ Bước 3.6: BE lưu agent mapping                             │
├─────────────────────────────────────────────────────────────┤
│ BE ghi vào: data/agent_mappings.json                       │
│   {                                                          │
│     "chatbotId": "bot_abc123",                             │
│     "userId": "user_001",                                  │
│     "agentId": "agent_xyz789",                             │
│     "createdAt": "2024-01-01T10:00:00Z"                    │
│   }                                                          │
│                                                              │
│ BE trả về widget:                                           │
│   {                                                          │
│     "data": {                                               │
│       "mapping": {                                          │
│         "agentId": "agent_xyz789"                          │
│       }                                                      │
│     }                                                        │
│   }                                                          │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ Bước 3.7: Widget mở chatbox                                │
├─────────────────────────────────────────────────────────────┤
│ Widget lưu: currentAgentId = "agent_xyz789"               │
│                                                              │
│ Widget hiển thị:                                            │
│   - Chatbox mở (display: flex)                             │
│   - Greeting message: "Hello! How can I help?"             │
│   - Input field để user gõ                                 │
└─────────────────────────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
QUAN TRỌNG: Agent = Instance riêng cho từng user
- Agent được tạo từ Bot Template config
- Config (system, tools) được copy vào agent
- Sau khi tạo, config lưu trong Letta, không cần gửi lại
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

### PHASE 4: User Chat Với AI

```
┌─────────────────────────────────────────────────────────────┐
│ Bước 4.1: User gõ message                                  │
├─────────────────────────────────────────────────────────────┤
│ User gõ: "I need help with my order"                       │
│ User click: Send button                                     │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ Bước 4.2: Widget gọi chat API                              │
├─────────────────────────────────────────────────────────────┤
│ Widget gọi:                                                  │
│   POST http://localhost:3000/api/letta/agents/            │
│        agent_xyz789/messages                                │
│   Body: {                                                    │
│     "message": "I need help with my order"                 │
│   }                                                          │
│                                                              │
│ Note: KHÔNG GỬI system prompt hay tools                    │
│       Agent đã có config sẵn trong Letta                   │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ Bước 4.3: BE forward request đến Letta                     │
├─────────────────────────────────────────────────────────────┤
│ BE gọi:                                                      │
│   POST http://localhost:8283/agents/agent_xyz789/messages │
│   Body: {                                                    │
│     "message": "I need help with my order"                 │
│   }                                                          │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ Bước 4.4: Letta xử lý message                              │
├─────────────────────────────────────────────────────────────┤
│ Letta load agent agent_xyz789:                             │
│   - system: "You are a helpful support agent"             │
│   - tools: ["search_products", "check_inventory"]         │
│   - memory: { previous_messages: [] }                      │
│                                                              │
│ Letta generate response:                                   │
│   "Sure! I can help you with your order.                   │
│    Can you provide your order ID?"                         │
│                                                              │
│ Letta trả về:                                               │
│   {                                                          │
│     "messages": [                                           │
│       {                                                      │
│         "role": "assistant",                                │
│         "content": "Sure! I can help you..."               │
│       }                                                      │
│     ]                                                        │
│   }                                                          │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ Bước 4.5: BE forward response về widget                    │
├─────────────────────────────────────────────────────────────┤
│ BE trả về:                                                   │
│   {                                                          │
│     "data": {                                               │
│       "response": {                                         │
│         "messages": [ ... ]                                 │
│       }                                                      │
│     }                                                        │
│   }                                                          │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ Bước 4.6: Widget hiển thị message                          │
├─────────────────────────────────────────────────────────────┤
│ Widget append message vào chatbox:                         │
│                                                              │
│   [User]: I need help with my order                        │
│   [Bot]:  Sure! I can help you with your order.           │
│           Can you provide your order ID?                    │
└─────────────────────────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
KHÔNG CẦN gửi system prompt hay tools mỗi lần chat
Agent đã có config lưu sẵn trong Letta
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

### PHASE 5: User Quay Lại - Reuse Agent

```
┌─────────────────────────────────────────────────────────────┐
│ User A đóng website, ngày hôm sau quay lại                 │
├─────────────────────────────────────────────────────────────┤
│ Browser load: embed.js                                      │
│ Widget auto-init                                            │
│ Widget render: Bubble                                       │
│ User click: Bubble                                          │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ Widget gọi: POST /api/letta/bots/bot_abc123/agents        │
│ Body: { userId: "user_001" }                               │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ BE check: data/agent_mappings.json                         │
│   → ĐÃ CÓ: (bot_abc123 + user_001) = agent_xyz789        │
│                                                              │
│ BE KHÔNG tạo agent mới                                     │
│                                                              │
│ BE trả về: { mapping: { agentId: "agent_xyz789" } }       │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ Widget nhận: agentId = "agent_xyz789" (GIỐNG LẦN TRƯỚC)   │
│                                                              │
│ Widget load: Conversation history từ Letta                 │
│                                                              │
│ User thấy: Toàn bộ chat từ lần trước                       │
└─────────────────────────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Agent được reuse - Conversation history được duy trì
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Bảng Tổng Kết

| Component | Trạng thái | Thiếu gì | Phase implement |
|-----------|-----------|----------|-----------------|
| **FE Admin UI** | UI đã có | Cần gọi BE APIs thay vì browser storage | Phase 3 |
| **FE Embed Gen** | Đã có | OK, không cần sửa | - |
| **BE Agent APIs** | Đã có | OK, widget sẽ dùng để chat | - |
| **BE Bot Template APIs** | Chưa có | Cần implement CRUD + Agent Mapping | Phase 1 |
| **Widget (embed.js)** | Chưa có | Cần build từ đầu | Phase 2 |
| **Integration** | Chưa có | Cần test end-to-end | Phase 4 |

**Data Flow**:
```
Admin (FE) → POST /api/letta/bots → BE storage
                                      ↓
                              (data/bot_templates.json)
                                      ↓
Widget → GET /api/letta/bots/:id → BE đọc file → Trả về config
```

---

Document tiếp theo: [Phân Tích Gaps](./02-gaps-analysis.md)
