# 📬 Postman Collection

## 📥 Import vào Postman

1. Mở Postman
2. Click **Import** → **Upload Files**
3. Chọn file `postman_collection.json`

## 🎯 Collection Structure

### **1. Bots (Chatbot Templates)**
- ✅ Create Bot
- ✅ List Bots
- ✅ Get Bot by ID
- ✅ Update Bot
- ✅ Delete Bot
- ✅ Get/Create Agent for Bot (User-specific)
- ✅ Get Agent Mapping by User

### **2. Knowledge Bases**
- ✅ Create Knowledge Base
- ✅ List Knowledge Bases
- ✅ Get Knowledge Base by ID
- ✅ Update Knowledge Base
- ✅ Delete Knowledge Base

### **3. Tools**
- ✅ List Tools
- ✅ Create Tool (Multiple examples)
- ⚠️ Delete Tool (not implemented)

### **4. Agents (Direct - for Testing)**
- ✅ Create Agent Directly
- ✅ List Agents
- ✅ Get Agent by ID

### **5. Messages (Chat)**
- ✅ Send Message to Agent
- ✅ Send Message with Tool Approval
- ✅ List Messages

### **6. Widget Embed**
- ✅ Get Widget Script

---

## 🔧 Environment Variables

Collection đã có sẵn các biến:

| Variable | Default Value | Description |
|----------|---------------|-------------|
| `BASE_URL` | `http://localhost:4000` | Backend API URL |
| `BOT_ID` | `bot-uuid-123` | Bot ID (set after creating bot) |
| `KB_ID` | `kb-uuid-456` | Knowledge Base ID |
| `TOOL_ID` | (empty) | Tool ID |
| `AGENT_ID` | (empty) | Agent ID (set after creating agent) |

### Cách sử dụng biến:

1. **Sau khi Create Bot**, copy `id` từ response
2. Click **Variables** tab trong Collection
3. Update `BOT_ID` value
4. Tương tự cho `AGENT_ID`, `KB_ID`

---

## 🚀 Typical Flow

### **Demo Flow 1: Tạo Bot từ đầu**

```
1. Create Knowledge Base
   → Copy `id` từ response (e.g. "kb-uuid-456")

2. Create Bot
   → Set `knowledge_base_ids: ["kb-uuid-456"]` in body
   → Copy `id` từ response (e.g. "bot-uuid-123")

3. Get/Create Agent for Bot
   → URL: POST /api/letta/bots/bot-uuid-123/agents
   → Body: { "userId": "user-001" }
   → Copy `agentId` từ response

4. Send Message
   → URL: POST /api/letta/messages/{agentId}
   → Body: { "message": "Hello!" }
```

### **Demo Flow 2: Direct Agent Testing**

```
1. Create Tool (e.g. calculator)
   → Note tool name

2. Create Agent Directly
   → Set `tools: ["calculator"]` in body
   → Copy agent `id`

3. Send Message
   → URL: POST /api/letta/messages/{agentId}
   → Test tool functionality
```

---

## 📝 Notes

### **Multi-tenant Support**
- `organization_id` cần được gửi trong body khi tạo Bot/KB
- Production: phải validate qua JWT token
- Demo: client tự gửi

### **Knowledge Base Status**
- `processing`: đang index content
- `success`: đã index xong, sẵn sàng dùng
- `failed`: lỗi khi index

### **Widget Integration**
```html
<!-- Embed in customer website -->
<script
  src="http://localhost:4000/embed.js"
  data-assistant-id="bot-uuid-123">
</script>
```

---

## 🔗 Related Documentation

- [API_FLOW.md](../API_FLOW.md) - Detailed API documentation
- [README.md](../README.md) - Project setup guide
