# FE-BE Widget Integration Suite

Bộ tài liệu hướng dẫn tích hợp **PLATFORM_LETTA** (BE) và **Embed Widget** (FE) để tạo ra chatbot có thể nhúng vào bất kỳ website nào.

**⚠️ Lưu ý**: Một số docs (`01-current-state.md`, `02-gaps-analysis.md`, `03-implementation-plan.md`) có thể mention file storage (`data/*.json`). **ĐÃ THAY ĐỔI** sang **Letta PostgreSQL** (bảng `letta.bot_templates`, `letta.agent_mappings`). Xem [migrations/README.md](../../migrations/README.md) và [plan/00-task-checklist.md](./plan/00-task-checklist.md) để có thông tin chính xác.

---

## Cấu Trúc Tài Liệu

```
fe-be-widget-integration/
├── README.md                          - File này (entry point)
├── plan/
│   ├── 00-implementation-order.md     - THỨ TỰ A-Z + CHECKLIST (BẮT ĐẦU TỪ ĐÂY)
│   ├── 01-current-state.md            - Phân tích hiện trạng FE + BE
│   ├── 02-gaps-analysis.md            - Phân tích thiếu gì, cần gì
│   ├── 03-implementation-plan.md      - Chi tiết từng task implement
│   ├── 04-database-schema.md          - Database schema
│   └── 05-docker-deployment.md        - Docker compose setup
├── 01-configuration/
│   ├── 01-overview.md                 - Hiểu flow, chatbotId vs agentId
│   ├── 02-architecture.md             - Thiết kế hệ thống
│   ├── 03-sequence-diagrams.md        - Sơ đồ luồng chi tiết
│   └── 04-api-contract.md             - Specs API đầy đủ
└── 02-widget-implementation/
    ├── 01-project-setup.md            - Setup widget project
    ├── 02-agent-lifecycle.md          - Quản lý agent
    ├── 03-ui-renderer.md              - Render bubble + chatbox
    ├── 04-chat-handler.md             - Xử lý chat messages
    ├── 05-tool-execution.md           - Tool calls + webhooks
    └── 06-build-deploy.md             - Build và deploy widget
```

---

## Thứ Tự Đọc

### Nếu Bạn Muốn Deploy/Implement Ngay (Recommended)

1. **[Implementation Order](./plan/00-implementation-order.md)** ← BẮT ĐẦU - Thứ tự A-Z + Checklist đầy đủ
2. **[Docker Deployment](./plan/05-docker-deployment.md)** - Setup docker-compose
3. **[Migrations](../../migrations/README.md)** - SQL tạo 2 bảng bot

### Nếu Bạn Muốn Hiểu Toàn Bộ Hệ Thống

1. **[Plan: Current State](./plan/01-current-state.md)** - Hiện tại FE + BE có gì
2. **[Plan: Gaps Analysis](./plan/02-gaps-analysis.md)** - Thiếu gì, cần làm gì
3. **[Plan: Docker Deployment](./plan/05-docker-deployment.md)** - Self-hosted architecture
4. **[Plan: Database Schema](./plan/04-database-schema.md)** - PostgreSQL schema chi tiết
5. **[Plan: Task Checklist](./plan/00-task-checklist.md)** - List TẤT CẢ tasks
6. **[Plan: Implementation](./plan/03-implementation-plan.md)** - Chi tiết từng task
7. **[Configuration: Overview](./01-configuration/01-overview.md)** - Flow tổng quan
8. **[Configuration: API Contract](./01-configuration/04-api-contract.md)** - APIs cần implement

---

## Architecture: Self-Hosted Full Stack

```
┌─────────────────────────────────────────────────────────┐
│ Docker Stack (BẠN GÁNH HẾT)                            │
├─────────────────────────────────────────────────────────┤
│  Letta Server (với PostgreSQL)                          │
│  → docker-compose up -d                                 │
│  → Migration tạo 2 bảng custom                          │
└─────────────────────────────────────────────────────────┘
                    ↓ APIs
┌─────────────────────────────────────────────────────────┐
│ FE Admin UI (Deploy riêng - Vercel/Netlify)            │
│  Admin tạo bot templates                                │
└─────────────────────────────────────────────────────────┘
                    ↓ Generate embed code
┌─────────────────────────────────────────────────────────┐
│ Customer Website (Customer tự host)                     │
│  <script src="embed.js" data-assistant-id="...">       │
│  → Widget gọi APIs của bạn                             │
└─────────────────────────────────────────────────────────┘
```

Chi tiết: [Docker Deployment](./plan/05-docker-deployment.md)

---

## Concept Quan Trọng

### chatbotId (Bot Template)
- **Phân biệt PROJECT**: Platform phục vụ 100 projects thì có 100 chatbotIds
- **Config riêng**: Mỗi chatbotId có system prompt, tools, theme riêng
- **Lưu trong**: Letta PostgreSQL (bảng `letta.bot_templates`)
- **Ví dụ**:
  - `bot_ecommerce_A` cho Project A (shopping assistant)
  - `bot_support_B` cho Project B (support bot)

### agentId (Conversation Thread)
- **Phân biệt THREAD**: 1 chatbotId có nhiều users thì có nhiều agentIds
- **Memory**: Mỗi agentId là 1 conversation history riêng biệt
- **Ví dụ**:
  - Project A: user 1 có `agent_001`, user 2 có `agent_002`
  - Project B: ticket 1 có `agent_101`, ticket 2 có `agent_102`

### userId (Business Logic)
- **Customer tự define**: Để map user của họ với agentId
- **Không bắt buộc**: Widget có flow mặc định (anonymous agent) nếu customer không provide userId

---

## Workflow Tổng Quát

### Giai đoạn 1: Admin Setup (One-time)
```
Admin tạo Bot Template
  ↓
Nhận chatbotId: "bot_abc123"
  ↓
Generate embed script
  ↓
Gửi cho customer
```

### Giai đoạn 2: Customer Integration
```
Customer paste script tag vào website:
  <script src="embed.js" data-assistant-id="bot_abc123"></script>

Widget tự động:
  1. Đọc chatbotId từ data-assistant-id
  2. Load bot config từ BE
  3. Render bubble icon
```

### Giai đoạn 3: Runtime - Flow Mặc Định
```
User click bubble
  ↓
Widget gọi POST /api/letta/bots/:chatbotId/agents
  ↓
BE tạo agent mới (nếu chưa có) hoặc trả về agent hiện có
  ↓
Widget nhận agentId
  ↓
Chatbox mở, hiển thị greeting
  ↓
User gõ message
  ↓
Widget gọi POST /api/letta/agents/:agentId/messages
  ↓
AI response hiển thị trong chatbox
  ↓
Tool calls được execute (nếu AI trigger)
```

### Giai đoạn 3a: Runtime - Custom Agent Logic (Nếu Customer Cần)
```
Customer có thể override logic mặc định:

Example 1: Customer tự quản lý agentId
  <script src="embed.js" data-assistant-id="bot_abc123"></script>
  <script>
    const agentId = getFromMyDatabase(currentUser.id);
    ChatbotWidget.setAgent(agentId);
  </script>

Example 2: Map userId sang agentId
  <script src="embed.js" data-assistant-id="bot_abc123"></script>
  <script>
    ChatbotWidget.getOrCreateAgent(currentUser.id);
  </script>

Example 3: Custom logic khi click bubble
  <script src="embed.js" data-assistant-id="bot_abc123"></script>
  <script>
    ChatbotWidget.onBubbleClick(async () => {
      const userId = await fetchCurrentUserId();
      await ChatbotWidget.getOrCreateAgent(userId);
      ChatbotWidget.openChat();
    });
  </script>
```

---

## Quick Start

### Bước 1: Admin tạo bot template

```bash
curl -X POST http://localhost:3000/api/letta/bots \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Support Bot",
    "system": "You are a helpful assistant.",
    "greeting": "Hello! How can I help you?",
    "tools": [],
    "theme": {
      "primaryColor": "#1677ff",
      "botAvatarUrl": "",
      "bubbleIconUrl": "",
      "footerText": "Powered by AI"
    }
  }'

# Response:
# {
#   "message": "Bot template created successfully",
#   "data": {
#     "bot": {
#       "id": "bot_abc123",
#       ...
#     }
#   }
# }
```

### Bước 2: Customer tích hợp widget

**Flow mặc định (Không cần code thêm)**:
```html
<!DOCTYPE html>
<html>
<body>
  <h1>My Website</h1>

  <!-- Paste script tag -->
  <script src="http://localhost:3000/embed.js"
          data-assistant-id="bot_abc123"></script>

  <!-- Widget tự động hoạt động:
       1. Render bubble
       2. User click bubble → tạo agent
       3. Chat flow bắt đầu
  -->
</body>
</html>
```

**Custom logic (Nếu cần quản lý agent theo user)**:
```html
<!DOCTYPE html>
<html>
<body>
  <h1>My Website</h1>

  <!-- Embed widget -->
  <script src="http://localhost:3000/embed.js"
          data-assistant-id="bot_abc123"></script>

  <!-- Custom: Map userId sang agentId -->
  <script>
    const currentUserId = getCurrentUser().id;
    ChatbotWidget.getOrCreateAgent(currentUserId);
  </script>
</body>
</html>
```

---

## Hiện Trạng BE APIs

### Đã có
```
POST   /api/letta/agents
GET    /api/letta/agents/:agentId
POST   /api/letta/agents/:agentId/messages
```

### Cần bổ sung
```
POST   /api/letta/bots                        - Admin tạo bot template
GET    /api/letta/bots/:chatbotId             - Widget load bot config
PUT    /api/letta/bots/:chatbotId             - Admin update bot
DELETE /api/letta/bots/:chatbotId             - Admin xóa bot
POST   /api/letta/bots/:chatbotId/agents      - Widget tạo/get agent cho bot
GET    /api/letta/bots/:chatbotId/agents?userId=xxx - Check agent mapping
```

Chi tiết: [API Contract](./01-configuration/04-api-contract.md)

---

## Implementation Plan

### Phase 1: Backend Bot Template System (4-6 giờ)

**Sản phẩm**:
- BotTemplate và AgentMapping types
- BotService với file-based storage
- Bot CRUD endpoints
- Agent mapping endpoints

**Files**:
- `src/config/database.config.ts` (kết nối PostgreSQL)
- `src/services/database.service.ts` (query helper)
- `src/types/index.ts`
- `src/services/letta/bot.service.ts` (CRUD với DB)
- `src/controllers/letta/bot.controller.ts`
- `src/routes/letta/bot.routes.ts`

**Database**:
- `letta.bot_templates` (PostgreSQL table)
- `letta.agent_mappings` (PostgreSQL table)

Chi tiết: [Implementation Plan Phase 1](./plan/03-implementation-plan.md#phase-1-backend---bot-template-system)

---

### Phase 2: Widget Build (8-12 giờ)

**Sản phẩm**:
- Widget project với Webpack
- Auto-init từ script tag
- Bot config loader
- Agent lifecycle manager
- UI renderer (bubble + chatbox)
- Chat handler
- Exposed JavaScript APIs

**Cấu trúc**:
```
widget/
├── src/
│   ├── index.js         - Entry point, auto-init
│   ├── bot.js           - Load bot config
│   ├── agent.js         - Agent CRUD
│   ├── ui.js            - Render bubble/chatbox
│   ├── chat.js          - Chat flow
│   └── styles.css       - Styles
├── dist/
│   └── embed.js         - Build output
└── webpack.config.js
```

Chi tiết: [Implementation Plan Phase 2](./plan/03-implementation-plan.md#phase-2-widget---build-embedjs)

---

### Phase 3: FE Architecture Change (3-4 giờ)

Thay đổi FE để BE là source of truth:
- Update `ui_mgpt/src/utils/storage.ts` để gọi BE APIs
- Loại bỏ localStorage làm source of truth
- FE load data từ BE khi mount
- Thêm GET /api/letta/bots endpoint (list all bots)

Chi tiết: [Implementation Plan Phase 3](./plan/03-implementation-plan.md#phase-3-frontend---chuyển-sang-be-source-of-truth)

---

### Phase 4: Integration Testing (4-6 giờ)

**Test cases**:
1. Luồng hoàn chỉnh end-to-end
2. Agent mapping với nhiều users
3. Multi-project isolation

Chi tiết: [Implementation Plan Phase 4](./plan/03-implementation-plan.md#phase-4-integration-testing)

---

## Timeline Tổng

| Phase | Nội dung | Thời gian | Dependencies |
|-------|----------|-----------|--------------|
| Phase 1 | Backend Bot APIs | 4-6h | Không |
| Phase 2 | Widget Build | 8-12h | Phase 1 hoàn thành |
| Phase 3 | FE Architecture Change | 3-4h | Phase 1 hoàn thành (song song với Phase 2) |
| Phase 4 | Testing | 4-6h | Phase 1, 2, 3 hoàn thành |
| **Tổng** | | **19-28h** | |

---

## Quick Start (Minimal Implementation)

Nếu muốn demo nhanh (6-8 giờ):

1. Backend Bot CRUD cơ bản (3h) - Chưa có agent mapping
2. Widget cơ bản (3-4h) - Anonymous agent only
3. Integration test đơn giản (1h)

**Kết quả**: Demo hoạt động - customer paste script thì chat được

Chi tiết: [Implementation Plan Quick Start](./plan/03-implementation-plan.md#minimal-viable-implementation-quick-start)

---

## Stuck Points và Rules

### Widget Behavior
- Widget KHÔNG tự động check localStorage
- Customer quyết định logic quản lý agentId
- Widget chỉ expose APIs cho customer sử dụng

### Phân biệt Concepts
- chatbotId = PROJECT (100 projects có 100 chatbotIds)
- agentId = THREAD (1 project có nhiều users có nhiều agentIds)
- userId = BUSINESS LOGIC (customer tự define)

### Backend Requirements
- Cần lưu Bot Templates (chatbotId → config)
- Cần lưu Agent Mappings (chatbotId + userId → agentId)
- Storage: File-based JSON (đơn giản, không cần DB)

### Output Cuối Cùng
- 1 file `embed.js` để embed
- Vanilla JavaScript (không dependencies)
- Build bằng Webpack

---

## Documents Tham Khảo

### Configuration (Hiểu hệ thống)
- [Overview](./01-configuration/01-overview.md) - Flow tổng quan
- [Architecture](./01-configuration/02-architecture.md) - Thiết kế hệ thống
- [Sequence Diagrams](./01-configuration/03-sequence-diagrams.md) - Sơ đồ luồng
- [API Contract](./01-configuration/04-api-contract.md) - Specs API đầy đủ

### Plan (Implementation)
- [Current State](./plan/01-current-state.md) - Phân tích hiện trạng
- [Gaps Analysis](./plan/02-gaps-analysis.md) - Phân tích gaps
- [Implementation Plan](./plan/03-implementation-plan.md) - Chi tiết tasks

### Widget Implementation (Code)
- [Project Setup](./02-widget-implementation/01-project-setup.md)
- [Agent Lifecycle](./02-widget-implementation/02-agent-lifecycle.md)
- [UI Renderer](./02-widget-implementation/03-ui-renderer.md)
- [Chat Handler](./02-widget-implementation/04-chat-handler.md)
- [Tool Execution](./02-widget-implementation/05-tool-execution.md)
- [Build Deploy](./02-widget-implementation/06-build-deploy.md)

---

## Chuẩn Tài Liệu

Tất cả docs trong suite này tuân theo:
- Dùng tiếng Việt, giữ thuật ngữ chuyên ngành tiếng Anh
- Không có icons hoặc emojis
- Định nghĩa rõ input/output cho mọi function/API
- Code examples cụ thể
- Hướng dẫn từng bước
- Không mơ hồ (tránh câu "hoặc")
- Dựa trên source code thực tế đã inspect
