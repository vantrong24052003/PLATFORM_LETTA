# FE-BE Widget Integration Suite

Bộ tài liệu hướng dẫn tích hợp **PLATFORM_LETTA** (BE) và **Embed Widget** (FE) để tạo ra chatbot có thể nhúng vào bất kỳ website nào.

---

## 📖 Hướng dẫn nhanh

Bỏ qua các tài liệu rườm rà, bạn chỉ cần làm theo đúng 2 bước sau để hệ thống chạy thông suốt:

1.  **[BƯỚC 1: CONFIGURATION (Hiểu Flow)](./01-configuration/01-overview.md)**: Cách hệ thống hoạt động, phân biệt chatbotId vs agentId, 3 options tích hợp.
2.  **[BƯỚC 2: WIDGET IMPLEMENTATION (Code Widget)](./02-widget-implementation/01-project-setup.md)**: Cách build widget JavaScript để render UI, gọi BE, và xử lý tool calls.

---

## 💡 Concept Quan Trọng

### chatbotId (Bot Template)
- **Phân biệt PROJECT**: Platform phục vụ 100 projects → 100 chatbotIds.
- **Config riêng**: Mỗi chatbotId có system prompt, tools, theme riêng.
- **Ví dụ**: 
  - `bot_ecommerce_A` → Project A (shopping assistant)
  - `bot_support_B` → Project B (support bot)

### agentId (Conversation Thread)
- **Phân biệt THREAD**: 1 chatbotId có nhiều users → nhiều agentIds.
- **Memory**: Mỗi agentId = 1 conversation history riêng biệt.
- **Ví dụ**:
  - Project A: user 1 → `agent_001`, user 2 → `agent_002`
  - Project B: ticket 1 → `agent_101`, ticket 2 → `agent_102`

### userId (Business Logic)
- **Customer tự define**: Để map user của họ với agentId.
- **Optional**: Customer có thể tự quản lý agentId, không cần userId.

---

## 🏗️ Workflow Tổng Quát

### Giai đoạn 1: Admin Setup (One-time)
```
Admin → Tạo Bot Template → chatbotId: "bot_abc123"
     → Generate embed script
     → Gửi cho customer
```

### Giai đoạn 2: Customer Integration (Customer quyết định logic)
```
Option A: Customer tự quản lý agentId
  ChatbotWidget.init({ chatbotId, agentId })

Option B: Widget tự get/create agent
  ChatbotWidget.init({ chatbotId, userId })

Option C: Anonymous user
  ChatbotWidget.init({ chatbotId })
```

### Giai đoạn 3: Runtime
```
Widget → Check/Create agent → Render UI → Handle chat → Tool calls
```

---

## 🚀 Quick Start

### Admin creates bot:
```bash
curl -X POST http://localhost:3000/api/letta/bots \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Support Bot",
    "system": "You are helpful.",
    "tools": ["search_products"]
  }'

# Response: {chatbotId: "bot_abc123"}
```

### Customer integrates:
```html
<script src="https://cdn.yourplatform.com/chatbot-widget.js"></script>
<script>
  ChatbotWidget.init({
    chatbotId: "bot_abc123",
    userId: currentUser.id
  });
</script>
```

---

## 📊 APIs Cần Thêm Vào BE

**Hiện tại BE có**:
- ✅ `POST /api/letta/agents`
- ✅ `GET /api/letta/agents/:agentId`
- ✅ `POST /api/letta/agents/:agentId/messages`

**Cần bổ sung**:
- ❌ `POST /api/letta/bots` (Admin tạo bot template)
- ❌ `GET /api/letta/bots/:chatbotId` (Get bot config)
- ❌ `POST /api/letta/bots/:chatbotId/agents` (Widget tạo agent cho bot)
- ❌ `GET /api/letta/bots/:chatbotId/agents?userId=xxx` (Check mapping)

---

## 🔍 Stuck Points & Rules

- Widget KHÔNG tự động check localStorage. Customer quyết định logic.
- chatbotId = PROJECT (100 projects → 100 chatbotIds).
- agentId = THREAD (1 project có nhiều users → nhiều agentIds).
- BE cần lưu: Bot Templates + Agent Mappings (chatbotId + userId → agentId).
- OUTPUT CUỐI CÙNG: 1 file `chatbot-widget.js` để embed.

---

## 📖 Đọc Tiếp

1. [Overview](./01-configuration/01-overview.md) - Hiểu 3 options tích hợp
2. [Sequence Diagrams](./01-configuration/03-sequence-diagrams.md) - Xem flow chi tiết
3. [API Contract](./01-configuration/04-api-contract.md) - APIs cần implement
4. [Widget Implementation](./02-widget-implementation/01-project-setup.md) - Bắt đầu code widget
