# Sequence Diagrams

## 1. Admin Setup (One-time)

```mermaid
sequenceDiagram
    actor Admin
    participant Platform as Platform Admin UI
    participant BE as PLATFORM_LETTA

    Admin->>Platform: Create Bot Template<br/>(name, system, tools, theme)
    Platform->>BE: POST /api/bots<br/>{name, system, tools}
    BE-->>Platform: {chatbotId: "bot_abc123"}
    Platform-->>Admin: Generate embed script<br/><script src="..."></script><br/>chatbotId: "bot_abc123"
    
    Note over Admin: Gửi script + chatbotId<br/>cho customer
```

---

## 2. Customer Integration - Option A (Customer quản lý agentId)

```mermaid
sequenceDiagram
    actor User
    participant Website as Customer Website
    participant CustDB as Customer DB
    participant Widget as Embed Widget
    participant BE as PLATFORM_LETTA

    User->>Website: Login / Open page
    Website->>CustDB: Check agentId for user_123
    CustDB-->>Website: agentId: "agent-xyz-789"
    
    Website->>Widget: ChatbotWidget.init({<br/>  chatbotId: "bot_abc123",<br/>  agentId: "agent-xyz-789"<br/>})
    
    Widget->>BE: GET /api/letta/agents/agent-xyz-789<br/>(Verify agent exists)
    BE-->>Widget: {agent: {...}}
    
    Widget->>Widget: Render chatbox UI
    Note over Widget: Ready with existing thread
```

---

## 3. Customer Integration - Option B (Widget tự get/create agent)

```mermaid
sequenceDiagram
    actor User
    participant Website as Customer Website
    participant Widget as Embed Widget
    participant BE as PLATFORM_LETTA
    participant Letta as Letta AI

    User->>Website: Login / Open page
    
    Website->>Widget: ChatbotWidget.init({<br/>  chatbotId: "bot_abc123",<br/>  userId: "user_123"<br/>})
    
    Widget->>BE: GET /api/bots/bot_abc123/agents?userId=user_123
    
    alt Agent exists
        BE-->>Widget: {agentId: "agent-xyz-789"}
        Note over Widget: Reuse existing agent
    else Agent not found
        Widget->>BE: POST /api/bots/bot_abc123/agents<br/>{userId: "user_123"}
        BE->>BE: Get bot config
        BE->>Letta: Create agent with bot config
        Letta-->>BE: agentId
        BE->>BE: Save mapping (chatbotId + userId → agentId)
        BE-->>Widget: {agentId: "agent-new-456"}
        Widget->>Website: onAgentCreated("agent-new-456")
        Note over Website: Customer có thể lưu<br/>agentId vào DB của họ
    end
    
    Widget->>Widget: Render chatbox UI
    Note over Widget: Ready
```

---

## 4. Customer Integration - Option C (Anonymous user)

```mermaid
sequenceDiagram
    actor User
    participant Website as Customer Website
    participant Widget as Embed Widget
    participant BE as PLATFORM_LETTA
    participant Letta as Letta AI

    User->>Website: Open page (no login)
    
    Website->>Widget: ChatbotWidget.init({<br/>  chatbotId: "bot_abc123"<br/>})
    
    Note over Widget: Không có agentId/userId<br/>→ Tạo agent mới
    
    Widget->>BE: POST /api/bots/bot_abc123/agents<br/>{}
    BE->>Letta: Create agent
    Letta-->>BE: agentId
    BE-->>Widget: {agentId: "agent-temp-999"}
    
    Widget->>Widget: Render chatbox UI
    Note over Widget: Ready (session-based,<br/>không persist)
```

---

## 5. Chat Flow (Simple Text)

```mermaid
sequenceDiagram
    actor User
    participant Widget as Embed Widget
    participant BE as PLATFORM_LETTA
    participant Letta as Letta AI

    User->>Widget: Type: "Hello!"
    Widget->>Widget: Display user message
    
    Widget->>BE: POST /api/letta/agents/:agentId/messages<br/>{message: "Hello!"}
    BE->>Letta: Forward message
    Letta->>Letta: Process with memory (thread-specific)
    Letta-->>BE: "Hi! How can I help?"
    BE-->>Widget: {messages: [{role: "assistant", content: "..."}]}
    
    Widget->>Widget: Display assistant message
```

---

## 6. Tool Call Flow (HITL)

```mermaid
sequenceDiagram
    actor User
    participant Widget as Embed Widget
    participant BE as PLATFORM_LETTA
    participant Letta as Letta AI
    participant CustBE as Customer Backend
    participant DB as Customer DB

    User->>Widget: "Find Nike shoes"
    Widget->>BE: POST /api/letta/agents/:agentId/messages
    
    BE->>Letta: Forward message
    Letta->>Letta: Decide to call "search_products"
    Letta-->>BE: Tool call request
    BE-->>Widget: {<br/>  message_type: "tool_call_message",<br/>  tool_calls: [{...}],<br/>  approval_requests: [{id: "req_xyz"}]<br/>}
    
    Widget->>User: Show approval dialog
    User->>Widget: Click "Approve"
    
    Widget->>BE: POST /api/letta/agents/:agentId/messages<br/>{approve: true, approval_request_id: "req_xyz"}
    BE-->>Widget: Approved
    
    Note over Widget: Execute tool via customer webhook
    Widget->>CustBE: POST /chatbot-tools/search-products<br/>{query: "Nike"}
    CustBE->>DB: SELECT * FROM products...
    DB-->>CustBE: [Rows]
    CustBE-->>Widget: {results: [...]}
    
    Widget->>BE: POST /api/letta/agents/:agentId/messages<br/>{role: "system", message: JSON.stringify(results)}
    BE->>Letta: Submit tool output
    Letta-->>BE: Final answer
    BE-->>Widget: {messages: [{content: "Found 1 product..."}]}
    
    Widget->>User: Display final answer
```

---

## 7. Multi-Project Architecture

```mermaid
graph TB
    Platform[Platform Admin]
    
    Platform -->|Create| Bot1[chatbotId: bot_ecommerce_A]
    Platform -->|Create| Bot2[chatbotId: bot_support_B]
    Platform -->|Create| Bot3[chatbotId: bot_marketing_C]
    
    Bot1 -->|100 users| Agent1A[agentId: agent_001]
    Bot1 -->|100 users| Agent1B[agentId: agent_002]
    Bot1 -->|100 users| Agent1C[agentId: agent_...]
    
    Bot2 -->|50 tickets| Agent2A[agentId: agent_101]
    Bot2 -->|50 tickets| Agent2B[agentId: agent_102]
    
    Bot3 -->|Anonymous| Agent3A[agentId: agent_temp_001]
    Bot3 -->|Anonymous| Agent3B[agentId: agent_temp_002]
    
    style Platform fill:#e1f5ff
    style Bot1 fill:#ffe1e1
    style Bot2 fill:#e1ffe1
    style Bot3 fill:#fff3e1
```

**Giải thích**:
- 1 Platform phục vụ nhiều projects (chatbotIds).
- Mỗi chatbotId có config riêng (system prompt, tools).
- Mỗi chatbotId có nhiều agents (threads).
- Customer tự quyết định logic map user → agent.

---

## 8. Complete System Flow

```mermaid
graph TB
    Admin[Admin] -->|1. Create Bot| Platform[Platform BE]
    Platform -->|chatbotId + script| Customer[Customer]
    
    Customer -->|2. Integrate| Website[Customer Website]
    Website -->|Load script| Widget[Embed Widget]
    
    Website -->|3. Decide logic| Logic{Business Logic}
    Logic -->|Has agentId| Widget
    Logic -->|Has userId| Widget
    Logic -->|Anonymous| Widget
    
    Widget -->|4. HTTP API| BE[PLATFORM_LETTA<br/>localhost:3000/api/letta]
    BE -->|5. AI calls| Letta[Letta AI<br/>localhost:8283]
    
    Widget -->|6. Tool webhook| CustBE[Customer Backend]
    CustBE -->|Query| DB[(Customer DB)]
    
    User[End User] -->|Interact| Website
    
    style Admin fill:#e1f5ff
    style Customer fill:#ffe1e1
    style Widget fill:#e1ffe1
    style BE fill:#fff3e1
```

---

Tiếp theo: [API Contract](./04-api-contract.md)
