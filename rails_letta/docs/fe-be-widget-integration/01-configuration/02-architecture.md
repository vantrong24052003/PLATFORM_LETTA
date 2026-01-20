# Architecture: FE Widget & BE Server

## System Overview

```
  CUSTOMER WEBSITE                     EMBED WIDGET (FE)                    PLATFORM_LETTA (BE)                LETTA AI
┌──────────────────┐               ┌─────────────────────┐              ┌─────────────────────┐           ┌──────────────┐
│                  │  paste script │                     │   HTTP API   │                     │  Client  │              │
│  Customer's HTML │───────────────▶│    embed.js         │◀────────────▶│  Express + Letta    │◀─────────▶│  Letta Cloud │
│  <script src=... │               │  data-assistant-id  │              │     Service         │           │  / Self-host │
│   data-assistant-│               │  - Auto-init        │              │                     │           │              │
│   id="xxx">      │               │  - Render UI        │              │  - Bot templates    │           │ [Agent Mem]  │
│                  │               │  - Expose APIs      │              │  - Agent mapping    │           │ [Tools]      │
│  Custom logic:   │               │  - Stateless        │              │  - Chat handler     │           └──────────────┘
│  setAgent()      │               └─────────────────────┘              └─────────────────────┘
│  createAgent()   │
└──────────────────┘
      CUSTOMER                           FRONTEND                            BACKEND                         AI BRAIN
```

---

## Component Roles

### Customer Website (100% Tự Do)
- **Paste embed script** (chatbotId có SẴN):
  ```html
  <script src="https://uimgpt.com/embed.js"
          data-assistant-id="chatbot-123"></script>
  ```
- **Widget tự động init** - Customer KHÔNG cần gọi init()
- **Customer quyết định logic agent** (sau khi widget load):
  - ✅ Gọi `ChatbotWidget.setAgent(agentId)` (từ DB/URL/session)
  - ✅ Gọi `ChatbotWidget.createAgent(userId)` (tạo mới)
  - ✅ Custom `ChatbotWidget.onBubbleClick()` (check login trước)
  - ✅ Không làm gì (widget tạo agent khi user click)

---

### Embed Widget (Stateless, Zero Business Logic)
- **Runtime**: Chạy trên browser của end-user.
- **Nhận từ customer**:
  - `chatbotId` (required)
  - `agentId` (optional)
  - `userId` (optional - nếu muốn widget tự get/create)
- **KHÔNG quan tâm**:
  - agentId được lưu ở đâu?
  - agentId được lấy như thế nào?
  - Logic map user → agent?
  - Persistence strategy?
- **Chỉ làm**:
  1. Nhận config
  2. Call BE (get/create agent nếu cần)
  3. Render UI
  4. Handle chat + tool calls

---

### PLATFORM_LETTA (Multi-tenant BE)
- **Lưu trữ**:
  - Bot Templates: `chatbotId → {system, tools, theme}`
  - Agent Mappings: `(chatbotId + userId) → agentId` (optional)
- **Không lưu**: Business data của customer

---

### Letta AI Server
- **Lưu trữ**: Conversation memory theo `agentId`
- **Không biết**: chatbotId, userId, customer business logic

---

## Responsibility Boundary

```
┌────────────────────────────────────────────────────┐
│ CUSTOMER WEBSITE                                   │
│                                                    │
│ Customer TỰ QUYẾT ĐỊNH agentId từ đâu:            │
│                                                    │
│ Example A: Query DB                                │
│   agentId = db.query("SELECT agent_id FROM ...")  │
│                                                    │
│ Example B: URL param                               │
│   agentId = new URL(location).searchParams.get()  │
│                                                    │
│ Example C: Session                                 │
│   agentId = getSessionAgentId()                    │
│                                                    │
│ Example D: Hardcode                                │
│   agentId = "agent-support-001"                    │
│                                                    │
│ Example E: Không truyền (tạo mới)                  │
│   agentId = null                                   │
│                                                    │
└────────────────────────────────────────────────────┘
                     │
                     ▼ Pass config
┌────────────────────────────────────────────────────┐
│ WIDGET                                             │
│                                                    │
│ Nhận: { chatbotId, agentId? }                      │
│ Không care: agentId từ đâu                         │
│                                                    │
└────────────────────────────────────────────────────┘
                     │
                     ▼ HTTP API
┌────────────────────────────────────────────────────┐
│ PLATFORM_LETTA                                     │
│                                                    │
│ Store: Bot Templates + Agent Mappings              │
│ Forward: Messages ↔ Letta                          │
│                                                    │
└────────────────────────────────────────────────────┘
                     │
                     ▼
┌────────────────────────────────────────────────────┐
│ LETTA AI                                           │
│                                                    │
│ Store: Conversation memory (agentId)               │
│                                                    │
└────────────────────────────────────────────────────┘
```

---

## Customer Integration Examples (Họ tự do hoàn toàn)

### Example 1: Lấy agentId từ DB
```html
<!-- Customer's HTML -->
<script src="https://uimgpt.com/embed.js"
        data-assistant-id="chatbot-123"></script>
<script>
  // Widget tự động load, customer set agent từ DB
  fetch('/my-api/get-agent')
    .then(res => res.json())
    .then(data => {
      ChatbotWidget.setAgent(data.agentId);
    });
</script>
```

---

### Example 2: Lấy từ URL parameter
```html
<script src="https://uimgpt.com/embed.js"
        data-assistant-id="chatbot-123"></script>
<script>
  // Đọc agentId từ URL
  const urlParams = new URLSearchParams(window.location.search);
  const agentId = urlParams.get('agentId');

  if (agentId) {
    ChatbotWidget.setAgent(agentId);
  }
</script>
```

---

### Example 3: Hardcode (Fixed agent cho tất cả users)
```html
<script src="https://uimgpt.com/embed.js"
        data-assistant-id="chatbot-123"></script>
<script>
  // Fixed agent cho mọi user
  ChatbotWidget.setAgent("agent-support-general");
</script>
```

---

### Example 4: Check login trước khi chat
```html
<script src="https://uimgpt.com/embed.js"
        data-assistant-id="chatbot-123"></script>
<script>
  ChatbotWidget.onBubbleClick(async () => {
    const user = getCurrentUser();

    if (!user) {
      alert('Please login to chat');
      return false; // Block chat
    }

    // User logged in, create/get agent
    const agentId = await ChatbotWidget.createAgent(user.id);
    ChatbotWidget.openChat();
  });
</script>
```

---

### Example 5: Tự động tạo agent (Anonymous)
```html
<script src="https://uimgpt.com/embed.js"
        data-assistant-id="chatbot-123"></script>
<script>
  // Widget tự động tạo agent khi user click bubble lần đầu
  // Customer không cần làm gì
</script>
```

---

## Key Principle

**Widget = Auto-Init + Stateless**

```
1. Auto-init: Đọc data-assistant-id từ script tag
2. Load bot config từ BE
3. Render bubble icon
4. Expose APIs cho customer (optional):
   - ChatbotWidget.setAgent(agentId)
   - ChatbotWidget.createAgent(userId)
   - ChatbotWidget.onBubbleClick(callback)
   - ChatbotWidget.openChat()

Widget KHÔNG quan tâm:
❌ agentId lấy từ đâu
❌ Logic map user → agent
❌ Persistence strategy
```

**Customer = Business Logic Owner**

```
Customer TỰ QUYẾT ĐỊNH (sau khi widget load):
✅ Khi nào set agent (ngay, sau login, sau click bubble)
✅ agentId từ đâu (DB, URL, session, hardcode)
✅ 1 user có bao nhiêu agents
✅ Check login trước khi chat
```

---

## Data Flow (Simplified)

```
1. Customer paste: <script src="embed.js" data-assistant-id="xxx">
   ↓
2. Widget auto-init: Đọc data-assistant-id
   ↓
3. Widget → BE: GET /api/letta/bots/:chatbotId (load config)
   ↓
4. Widget: Render bubble icon (với theme từ config)
   ↓
5. Customer (optional): ChatbotWidget.setAgent() / createAgent()
   ↓
6. User click bubble → Widget open chat
   ↓
7. User chats → Widget handles everything
```

---

## Security Boundary

```
Customer Website ─┬─ FULL CONTROL ZONE
                  │  - User authentication
                  │  - agentId management (tự do hoàn toàn)
                  │  - Business logic
                  │
Widget (Runtime)  ─┤─ STATELESS ZONE
                  │  - Zero persistence
                  │  - Zero business logic
                  │  - Just UI + API calls
                  │
BE Server ────────┤─ MULTI-TENANT ZONE
                  │  - Bot templates per chatbotId
                  │  - Optional: Agent mappings (userId → agentId)
                  │
Letta AI ─────────┴─ AI ZONE
                     - Conversation memory per agentId
```

---

## Why This Architecture Works

✅ **Customer Freedom**: Không bị ép buộc localStorage, DB, hoặc bất kỳ pattern nào.
✅ **Widget Simplicity**: Zero state, zero persistence, zero business logic.
✅ **Reusable**: Same widget code cho mọi customer, chỉ khác config.
✅ **Flexible**: Customer muốn dùng localStorage? OK. Muốn dùng DB? OK. Muốn hardcode? OK.

---

Tiếp theo: [Sequence Diagrams](./03-sequence-diagrams.md)
