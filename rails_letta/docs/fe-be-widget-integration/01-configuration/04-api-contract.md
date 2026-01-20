# API Contract: Widget ↔ PLATFORM_LETTA

Giao thức giao tiếp giữa Widget và BE. Widget tự động gọi APIs này, **customer không cần code**.

**Base URL**: `http://localhost:3000/api/letta`

---

## 📌 **Flow Mặc Định** (Zero Config)

```
1. Customer paste script:
   <script src="embed.js" data-assistant-id="chatbot-123"></script>

2. Widget auto-load:
   - GET /api/letta/bots/chatbot-123 (lấy config)
   - Render bubble icon

3. User click bubble:
   - POST /api/letta/bots/chatbot-123/agents (tạo agent mới)
   - Open chatbox
   - Ready to chat

4. User chat:
   - POST /api/letta/agents/:agentId/messages
   - Display response

Customer KHÔNG CẦN code gì!
```

---

## 1. Bot Template APIs (Widget tự động gọi)

### 1.1 Get Bot Config
```http
GET /api/letta/bots/:chatbotId
```

**Widget tự động gọi khi load**.

**Response (200)**:
```json
{
  "message": "Bot retrieved successfully",
  "data": {
    "bot": {
      "id": "chatbot-123",
      "name": "E-commerce Support Bot",
      "system": "You are a helpful shopping assistant.",
      "greeting": "Hello! How can I help?",
      "tools": ["search_products"],
      "theme": {
        "primaryColor": "#1677ff",
        "botAvatarUrl": "data:image/png;base64,...",
        "bubbleIconUrl": "data:image/png;base64,...",
        "footerText": "Powered by AI"
      }
    }
  }
}
```

**Widget dùng để**:
- Apply theme (colors, icons)
- Display greeting
- Enable tools

---

### 1.2 Create Agent (Anonymous)

```http
POST /api/letta/bots/:chatbotId/agents
Content-Type: application/json

{}  // Empty body = anonymous agent
```

**Widget tự động gọi khi user click bubble lần đầu** (nếu customer không custom).

**Response (201)**:
```json
{
  "message": "Agent created successfully",
  "data": {
    "mapping": {
      "chatbotId": "chatbot-123",
      "userId": null,
      "agentId": "agent-xyz-789",
      "createdAt": "2026-01-12T10:30:00Z"
    }
  }
}
```

---

### 1.3 Create Agent (With userId) - OPTIONAL

```http
POST /api/letta/bots/:chatbotId/agents
Content-Type: application/json

{
  "userId": "customer_user_123"
}
```

**Chỉ gọi khi customer custom**: `ChatbotWidget.getOrCreateAgent(userId)`

**Response**:
- Nếu agent đã tồn tại cho userId này → trả về agent cũ
- Nếu chưa → tạo agent mới và lưu mapping

```json
{
  "message": "Agent created successfully",
  "data": {
    "mapping": {
      "chatbotId": "chatbot-123",
      "userId": "customer_user_123",
      "agentId": "agent-xyz-789",
      "createdAt": "2026-01-12T10:30:00Z"
    }
  }
}
```

---

### 1.4 Get Agent by userId - OPTIONAL

```http
GET /api/letta/bots/:chatbotId/agents?userId=customer_user_123
```

**Chỉ gọi khi customer custom** để check agent đã tồn tại chưa.

**Response (200)** - Found:
```json
{
  "message": "Agent retrieved successfully",
  "data": {
    "mapping": {
      "chatbotId": "chatbot-123",
      "userId": "customer_user_123",
      "agentId": "agent-xyz-789"
    }
  }
}
```

**Response (404)** - Not found:
```json
{
  "error": "Agent not found for this user"
}
```

---

## 2. Chat APIs (Widget tự động gọi)

### 2.1 Send Message

```http
POST /api/letta/agents/:agentId/messages
Content-Type: application/json

{
  "message": "Hello! What products do you have?"
}
```

**Widget tự động gọi khi user gửi message**.

**Response (200)** - Simple text:
```json
{
  "message": "Message sent successfully",
  "data": {
    "response": {
      "messages": [
        {
          "role": "assistant",
          "content": "Hi! We have electronics, clothing, and home goods.",
          "created_at": "2026-01-12T10:30:05Z"
        }
      ]
    }
  }
}
```

**Response (200)** - Tool call:
```json
{
  "message": "Message sent successfully",
  "data": {
    "response": {
      "messages": [
        {
          "role": "assistant",
          "content": "I'll search our products for you.",
          "message_type": "tool_call_message",
          "tool_calls": [
            {
              "id": "call_abc",
              "function": {
                "name": "search_products",
                "arguments": "{\"query\":\"Nike\"}"
              }
            }
          ]
        }
      ],
      "approval_requests": [
        {
          "id": "req_xyz",
          "tool_name": "search_products",
          "tool_call_id": "call_abc",
          "tool_args": {
            "query": "Nike"
          }
        }
      ]
    }
  }
}
```

**Widget tự động handle tool calls** (see section 3).

---

### 2.2 Approve Tool Call

```http
POST /api/letta/agents/:agentId/messages
Content-Type: application/json

{
  "approve": true,
  "approval_request_id": "req_xyz"
}
```

**Widget tự động gọi sau khi user approve**.

---

### 2.3 Submit Tool Result

```http
POST /api/letta/agents/:agentId/messages
Content-Type: application/json

{
  "role": "system",
  "message": "{\"results\":[{\"id\":1,\"name\":\"Nike Air\"}]}"
}
```

**Widget tự động gọi sau khi execute tool**.

---

## 3. Tool Execution Flow (Customer cần implement endpoint)

### 3.1 Bot Config với Tool Webhooks

**Admin tạo chatbot với tools**:
```json
{
  "name": "E-commerce Bot",
  "system": "You are a shopping assistant.",
  "tools": ["search_products"],
  "toolWebhooks": {
    "search_products": {
      "url": "https://customer-backend.com/chatbot-tools/search-products",
      "method": "POST",
      "auth": {
        "type": "bearer",
        "token": "customer_secret_xyz"
      }
    }
  }
}
```

---

### 3.2 Customer Implementation (Backend Only)

```javascript
// Customer backend endpoint
app.post('/chatbot-tools/search-products', async (req, res) => {
  // Widget sẽ gửi tool arguments vào body
  const { query } = req.body;

  // Customer query DB của họ
  const products = await db.query(
    'SELECT id, name, price FROM products WHERE name LIKE ?',
    [`%${query}%`]
  );

  // Trả về results
  res.json({
    results: products
  });
});
```

**Customer KHÔNG cần code gì ở frontend**! Widget tự động:
1. Detect tool call từ BE response
2. Show approval dialog
3. Call customer webhook
4. Submit result về BE
5. Display final answer

---

## 4. Widget Exposed APIs (Optional Customization)

### 4.1 getOrCreateAgent(userId)

```javascript
// Customer custom: Map user → agent
const agentId = await ChatbotWidget.getOrCreateAgent(userId);
```

**Widget flow**:
```javascript
// Internal implementation
async getOrCreateAgent(userId) {
  // 1. Check existing
  const response = await fetch(
    `/api/letta/bots/${chatbotId}/agents?userId=${userId}`
  );

  if (response.ok) {
    const { data } = await response.json();
    return data.mapping.agentId;
  }

  // 2. Create new
  const createResponse = await fetch(
    `/api/letta/bots/${chatbotId}/agents`,
    {
      method: 'POST',
      body: JSON.stringify({ userId })
    }
  );

  const { data } = await createResponse.json();
  return data.mapping.agentId;
}
```

---

### 4.2 setAgent(agentId)

```javascript
// Customer custom: Set agent trực tiếp
ChatbotWidget.setAgent("agent-xyz-789");
```

**Use case**: Customer tự quản lý agentId (từ DB, URL, session).

---

### 4.3 onBubbleClick(callback)

```javascript
// Customer custom: Logic trước khi mở chat
ChatbotWidget.onBubbleClick(async () => {
  // Check login
  if (!isLoggedIn()) {
    alert('Please login first');
    return false; // Block chat
  }

  // Get/create agent
  const userId = getCurrentUser().id;
  await ChatbotWidget.getOrCreateAgent(userId);
  ChatbotWidget.openChat();
});
```

---

### 4.4 openChat() / closeChat()

```javascript
// Customer có thể mở/đóng chat programmatically
ChatbotWidget.openChat();
ChatbotWidget.closeChat();
```

---

## 5. Summary: Khi Nào Customer Cần Code?

### ✅ **KHÔNG cần code** (Mặc định - 90% use cases):
```html
<script src="embed.js" data-assistant-id="chatbot-123"></script>
<!-- HẾT! -->
```

Widget tự động:
- Load config
- Render UI
- Tạo agent
- Handle chat
- Handle tool calls (nếu customer đã config webhook)

---

### 🔧 **CẦN code** (Custom - 10% use cases):

#### Case 1: Map user → agent (persistent chat)
```javascript
ChatbotWidget.onBubbleClick(async () => {
  const userId = getCurrentUser().id;
  await ChatbotWidget.getOrCreateAgent(userId);
  ChatbotWidget.openChat();
});
```

#### Case 2: Check login trước khi chat
```javascript
ChatbotWidget.onBubbleClick(() => {
  if (!isLoggedIn()) {
    alert('Please login');
    return false;
  }
});
```

#### Case 3: Tool webhook (Backend only)
```javascript
// Customer backend
app.post('/chatbot-tools/search-products', async (req, res) => {
  const { query } = req.body;
  const results = await db.query(...);
  res.json({ results });
});
```

**Frontend KHÔNG cần code** - Widget tự động handle!

---

## 6. Testing với cURL

```bash
# 1. Get bot config (widget auto-call)
curl http://localhost:3000/api/letta/bots/chatbot-123

# 2. Create agent (widget auto-call)
curl -X POST http://localhost:3000/api/letta/bots/chatbot-123/agents \
  -H "Content-Type: application/json" \
  -d '{}'

# 3. Create agent with userId (optional)
curl -X POST http://localhost:3000/api/letta/bots/chatbot-123/agents \
  -d '{"userId":"user_123"}'

# 4. Chat
curl -X POST http://localhost:3000/api/letta/agents/agent-xyz/messages \
  -d '{"message":"Hello"}'
```

---

Tiếp theo: [Widget Implementation](../02-widget-implementation/01-project-setup.md)
