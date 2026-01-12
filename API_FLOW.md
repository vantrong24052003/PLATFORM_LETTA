# 🚀 API Integration Flow

## 📋 Overview

Hệ thống gồm 3 components chính:
1. **PLATFORM_LETTA** (Backend API)
2. **UI_MGPT** (Admin Dashboard)
3. **Widget** (Chatbot embedded vào customer website)

---

## 🔄 Complete Flow

### 1️⃣ Admin tạo Bot trên UI_MGPT

**Endpoint:** `POST /api/letta/bots`

**Request:**
```json
{
  "id": "bot-uuid-123",
  "name": "Customer Support Bot",
  "greeting": "Hello! How can I help you today?",
  "system": "You are a helpful customer support assistant...",
  "organization_id": "org-123",
  "llm_config": {
    "model": "GLM-4.7",
    "temperature": 0.7
  },
  "knowledge_base_ids": [],
  "theme_config": {
    "primaryColor": "#007bff",
    "position": "bottom-right"
  }
}
```

**Response:**
```json
{
  "message": "Bot created successfully",
  "data": {
    "bot": {
      "id": "bot-uuid-123",
      "name": "Customer Support Bot",
      "status": "active",
      "created_at": "2026-01-13T10:00:00Z"
    }
  }
}
```

---

### 2️⃣ Admin quản lý Knowledge Bases

#### Tạo Knowledge Base mới

**Endpoint:** `POST /api/letta/knowledge-bases`

**Request:**
```json
{
  "name": "Product Documentation",
  "description": "All product information and FAQs",
  "content": "Our products include laptops, phones, tablets. Laptops start at $999...",
  "organization_id": "org-123"
}
```

**Response:**
```json
{
  "message": "Knowledge Base created successfully",
  "data": {
    "knowledgeBase": {
      "id": "kb-uuid-456",
      "name": "Product Documentation",
      "status": "processing",
      "letta_source_id": null,
      "created_at": "2026-01-13T10:05:00Z"
    }
  }
}
```

**Note:** Status sẽ chuyển từ `processing` → `success` khi Letta đã index xong content.

#### List Knowledge Bases

**Endpoint:** `GET /api/letta/knowledge-bases?organization_id=org-123`

**Response:**
```json
{
  "message": "Knowledge Bases retrieved successfully",
  "data": {
    "knowledgeBases": [
      {
        "id": "kb-uuid-456",
        "name": "Product Documentation",
        "status": "success",
        "created_at": "2026-01-13T10:05:00Z"
      }
    ]
  }
}
```

#### Update Knowledge Base

**Endpoint:** `PUT /api/letta/knowledge-bases/:id`

**Request:**
```json
{
  "name": "Updated Product Documentation",
  "content": "Updated content here..."
}
```

#### Delete Knowledge Base

**Endpoint:** `DELETE /api/letta/knowledge-bases/:id`

---

### 3️⃣ Admin quản lý Tools

#### List Tools (hiển thị trên UI)

**Endpoint:** `GET /api/letta/tools`

**Response:**
```json
{
  "message": "Tools retrieved successfully",
  "data": {
    "tools": [
      {
        "id": "tool-1",
        "name": "search_product",
        "description": "Search products in database",
        "created_at": "2026-01-13T09:00:00Z"
      },
      {
        "id": "tool-2",
        "name": "get_order_status",
        "description": "Get customer order status",
        "created_at": "2026-01-13T09:10:00Z"
      }
    ]
  }
}
```

#### Create Tool

**Endpoint:** `POST /api/letta/tools`

**Request:**
```json
{
  "name": "search_product",
  "description": "Search products in database by name or category",
  "sourceCode": "def search_product(query: str, category: str = None):\n    # Implementation\n    return results",
  "jsonSchema": {
    "type": "object",
    "properties": {
      "query": {"type": "string"},
      "category": {"type": "string"}
    },
    "required": ["query"]
  }
}
```

**Response:**
```json
{
  "message": "Tool registered successfully",
  "data": {
    "tool": {
      "id": "tool-123",
      "name": "search_product"
    }
  }
}
```

#### Delete Tool

**Endpoint:** `DELETE /api/letta/tools/:id`

---

### 4️⃣ Admin link KBs & Tools vào Bot

**Endpoint:** `PUT /api/letta/bots/:botId`

**Request:**
```json
{
  "knowledge_base_ids": ["kb-uuid-456", "kb-uuid-789"],
  "llm_config": {
    "tools": ["search_product", "get_order_status"]
  }
}
```

**Note:** Khi update Bot với KBs & Tools, các agent mới tạo sẽ tự động có KBs & Tools này.

---

### 5️⃣ Admin lấy Embed Script

**UI_MGPT generate script:**
```html
<script
  src="https://platform-letta.com/embed.js"
  data-bot-id="bot-uuid-123"
></script>
```

**Admin copy & paste vào customer website.**

---

### 6️⃣ Customer mở chat trên Website (Widget Flow)

#### Step 1: Widget get/create Agent

**Khi user mở chat lần đầu, Widget tự động gọi:**

**Endpoint:** `POST /api/letta/bots/:botId/agents`

**Request:**
```json
{
  "user_id": "user-xyz-789"
}
```

**Response:**
```json
{
  "message": "Agent retrieved or created successfully",
  "data": {
    "agentId": "agent-abc-456"
  }
}
```

**Note:**
- Agent này được tạo từ Bot Template (có sẵn KBs + Tools)
- Mỗi `(botId + userId)` map to 1 unique `agentId`
- Conversation history được lưu trong agent

#### Step 2: Widget gửi message

**Endpoint:** `POST /api/letta/agents/:agentId/messages`

**Request:**
```json
{
  "message": "How much does the iPhone 15 cost?"
}
```

**Response:**
```json
{
  "message": "Message sent successfully",
  "data": {
    "response": {
      "messages": [
        {
          "id": "msg-1",
          "role": "assistant",
          "content": "The iPhone 15 starts at $999 for the base model.",
          "created_at": "2026-01-13T10:30:00Z"
        }
      ],
      "usage": {
        "total_tokens": 150
      }
    }
  }
}
```

**Note:**
- Agent tự động search Knowledge Base nếu cần
- Agent có thể call Tools (search_product, get_order_status, etc.)
- Tool calls có thể require approval (đã config auto-approve trong code)

---

## 🎯 API Endpoints Summary

### Bots (CRUD đầy đủ)
- `GET /api/letta/bots` - List bots
- `POST /api/letta/bots` - Create bot
- `GET /api/letta/bots/:id` - Get bot details
- `PUT /api/letta/bots/:id` - Update bot
- `DELETE /api/letta/bots/:id` - Delete bot
- `POST /api/letta/bots/:botId/agents` - Get/Create agent for user (Widget)

### Knowledge Bases (CRUD đầy đủ)
- `GET /api/letta/knowledge-bases` - List knowledge bases
- `POST /api/letta/knowledge-bases` - Create knowledge base
- `GET /api/letta/knowledge-bases/:id` - Get KB details
- `PUT /api/letta/knowledge-bases/:id` - Update KB
- `DELETE /api/letta/knowledge-bases/:id` - Delete KB

### Tools
- `GET /api/letta/tools` - List tools
- `POST /api/letta/tools` - Create tool
- `DELETE /api/letta/tools/:id` - Delete tool

### Agents (Testing only)
- `POST /api/letta/agents` - Create agent directly (Postman/Testing)
- `GET /api/letta/agents/:id` - Get agent details (Testing)
- `GET /api/letta/agents` - List agents (Testing)

### Messages (Chat)
- `POST /api/letta/agents/:agentId/messages` - Send message (Widget)

---

## 🔐 Authentication

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

---

## 🎨 Widget Integration Example

### Customer Website (rails_lv1)

```html
<!DOCTYPE html>
<html>
<head>
  <title>My Store</title>
</head>
<body>
  <h1>Welcome to My Store</h1>

  <!-- Chatbot Widget -->
  <script
    src="http://localhost:4000/embed.js"
    data-bot-id="bot-uuid-123"
  ></script>
</body>
</html>
```

**Widget tự động:**
1. Render chat UI
2. Gọi API get/create agent
3. Handle chat messages
4. Auto-approve tool calls
5. Display responses

---

## 📊 Database Schema

### bot_templates
```sql
- id (UUID, PK)
- name (string)
- greeting (text)
- system (text)
- llm_config (JSONB)
- tool_rules (JSONB)
- knowledge_base_ids (UUID[])
- theme_config (JSONB)
- organization_id (UUID)
- status (enum: active/inactive)
- created_at, updated_at
```

### agent_mappings
```sql
- id (int, PK)
- chatbot_id (UUID, FK → bot_templates)
- user_id (string, nullable)
- agent_id (string, unique)
- created_at
- last_used_at
```

### knowledge_bases
```sql
- id (UUID, PK)
- name (string)
- description (text)
- content (text)
- letta_source_id (string, nullable)
- status (enum: pending/processing/success/failed)
- organization_id (UUID)
- created_at, updated_at
```

---

## 🚦 Status Codes

- `200 OK` - Success
- `201 Created` - Resource created
- `204 No Content` - Deleted successfully
- `400 Bad Request` - Missing required fields
- `404 Not Found` - Resource not found
- `409 Conflict` - Letta approval pending
- `500 Internal Server Error` - Server error

---

## 📝 Notes

1. **Knowledge Base Processing:**
   - KB status: `pending` → `processing` → `success`/`failed`
   - Content được upload to Letta as Source
   - Source được attach vào Agent khi tạo

2. **Agent Mapping:**
   - 1 Bot + 1 User = 1 Agent
   - Agent có conversation history riêng
   - Anonymous users: `user_id = null`

3. **Tool Auto-Approval:**
   - Widget tự động approve tool calls
   - Backend config `include_base_tool_rules: false`
   - Avoid `PENDING_APPROVAL` errors

4. **Widget Architecture:**
   - Vanilla JS/TypeScript
   - Built với Webpack
   - Single `embed.js` file
   - No dependencies required

---

## 🔗 Links

- Backend: http://localhost:4000
- Admin UI: http://localhost:5173
- Test Site: http://localhost:3000

---

**Last Updated:** 2026-01-13
