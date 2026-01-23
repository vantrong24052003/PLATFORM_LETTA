# Letta Workflow Specification

This document defines the **Standard Engineering Workflows** for the LeTTa Platform.
It serves as the STRICT contract for Backend implementation.

---

## PART 1: APIs to Implement (Management Layer)

These APIs reside in `rails_letta` and are called by the Frontend/Widget.

### 1. Bot Templates (`/letta/bot_templates`)
**Actor**: Admin Dashboard (`ui_mgpt`)
**Goal**: Define a new chatbot configuration.

#### Create Template
`POST /letta/bot_templates`

**Request Body**:
```json
{
  "name": "Customer Support Bot",
  "system_prompt": "You are a friendly support agent. Use tools to find orders.",
  "tools": [
    "memory_replace",        // Built-in Letta tool
    "search_order",          // Custom RAG tool
    "check_refund_status"    // Custom Logic tool
  ],
  "theme_config": {
    "primary_color": "#FF0000",
    "avatar_url": "https://example.com/bot.png"
  },
  "organization_id": "org-123" // Multi-tenant binding
}
```

---

### 2. Agent Mappings (`/letta/bot_templates/:bot_template_id/agent_mappings`)
**Actor**: Chat Widget (`embed.js`)
**Goal**: Ensure the user has a persistent agent to talk to.

#### Get or Create Agent
`POST /letta/bot_templates/:bot_template_id/agent_mappings`

**Request Body**:
```json
{
  "user_id": "user-cust-999" // Unique ID from customer website. If null -> Anonymous.
}
```

**Response (200 OK)**:
```json
{
  "agent_id": "agent-letta-xyz", // The ID needed for chatting
  "is_new": false,               // True if a new agent was spawned
  "bot_id": "bot-abc-123",
  "user_id": "user-cust-999"
}
```

**Backend Logic**:
1.  **Check Mapping**: `SELECT agent_id FROM agent_mappings WHERE bot_id = ? AND user_id = ?`
2.  **If Found**: Return `agent_id`.
3.  **If Missing**:
    *   Load Bot Template (`system_prompt`, `tools`).
    *   Call Letta Engine: `POST /agents` (see Payload below).
    *   Insert into `agent_mappings`.
    *   Return new `agent_id`.

---

## PART 2: Letta Engine Interactions (Internal Layer)

This explains exactly what `rails_letta` sends to the LeTTa Engine.

### 1. Spawning the Agent
When `rails_letta` needs to create an agent, it sends this to LeTTa:

**Target**: `POST http://letta-engine:8000/v1/agents`

**Internal Payload**:
```json
{
  "name": "bot-abc-123_user-cust-999",
  "system": "You are a friendly support agent. Use tools to find orders.",
  "tools": ["memory_replace", "search_order"], // From Template
  "memory_blocks": [
    {
      "label": "human",
      "value": "User ID: user-cust-999",
      "limit": 2000
    },
    {
      "label": "persona",
      "value": "You are a friendly support agent...",
      "limit": 2000
    }
  ]
}
```

### 2. Tool Approval vs Execution (Critical)

Letta treats "Tool Call" and "Execution" distinctly.

`rails_letta` **MUST NOT** execute domain logic directly (e.g., must NOT query customer DB).

`rails_letta` **MUST**:
1.  **Validate**: Ensure the Agent belongs to the Organization attempting to run the tool.
2.  **Forward**: Send the tool request to the corresponding **Customer Backend**.
3.  **Wait**: Receive the JSON result from the Customer Backend.
4.  **Return**: Send the result back to Letta as `tool_return_message`.

---

## PART 3: Human-in-the-Loop (Approval Workflows)

Some tools (e.g., `delete_account`) require explicit human approval.

### 1. Detection
When streaming, if the agent needs approval, it pauses. You must look for **both**:
*   **Event**: `approval_request_message`
*   **Stop Reason**: `"requires_approval"`

```json
{
  "message_type": "approval_request_message",
  "id": "message-abc-123",
  "tool_call": {
    "name": "delete_account",
    "arguments": "{\"user_id\": \"123\"}",
    "tool_call_id": "tool-call-xyz" // REQUIRED for response
  }
}
```

### 2. Handling Response (Approve)
To approve, use the `tool_call_id`.
**CRITICAL**: Sending approval creates a **NEW RUN**. You must capture the `run_id` from the response stream to continue receiving messages.

**Endpoint**: `POST /agents/:agent_id/messages/stream`

**Body**:
```json
{
  "messages": [
    {
      "type": "approval",
      "approvals": [
        {
          "approve": true,
          "tool_call_id": "tool-call-xyz" // Must match request
        }
      ]
    }
  ],
  "stream_tokens": true
}
```

**Run Switching Logic**:
1.  Read approval stream.
2.  Capture `run_id` (e.g., `"run-new-456"`).
3.  **Resume** explicitly using that `run_id` if the stream closes early.
    *   `GET /runs/run-new-456/stream`

### 3. Handling Response (Deny)
To deny, set `approve: false`. Provide reasoning.

**Body**:
```json
{
  "messages": [
    {
      "role": "user",
      "content": "I dare not delete this account because it has active subscriptions."
    },
    {
      "type": "approval",
      "approvals": [
        {
          "approve": false,
          "tool_call_id": "tool-call-xyz"
        }
      ]
    }
  ],
  "stream_tokens": true
}
```

---

## PART 4: Sequential Workflow (The "Story")

### Step 1: Admin Setup
1.  Admin calls `POST /letta/bot_templates` to save the template.
2.  Backend saves to `bot_templates` table.

### Step 2: Widget Init
1.  User visits site. Widget calls `POST /letta/bot_templates/bot-123/agents`.
2.  Backend finds no mapping.
3.  Backend spawns agent in Letta Engine (Part 2, Step 1).
4.  Backend returns `agent_id`.

### Step 3: Chat Loop
1.  Widget calls `POST .../stream`.
2.  Backend forwards strictly to Letta.
3.  **Tool Decision**: Agent decides `search_order` is needed.

### Step 4: Forwarding (CRITICAL)
1.  **IF** tool requires approval (detected via `approval_request_message`):
    *   Widget prompts user.
    *   User Approves (Part 3, Section 2).
    *   **New Run Starts**: `rails_letta` must track the new `run_id`.
    *   Letta emits `tool_call_message` (Approved decision).
2.  **IF/THEN** (Auto or Approved):
    *   Letta emits `tool_call_message`.
    *   `rails_letta` detects this.
    *   `rails_letta` **FORWARDS** request to Customer Backend.
    *   `rails_letta` sends result back as `tool_return_message`.

### Step 5: Final Response
1.  Agent processes tool results.
2.  Stream emits: `assistant_message` (Technical text).
3.  Customer sees: "Your order #123 is arriving tomorrow."

---

## PART 5: Tool Definition Reference

When creating a tool in Letta (via Python SDK or API), it must match this JSON Schema:

```json
{
  "name": "search_order",
  "description": "Find order status by ID",
  "parameters": {
    "type": "object",
    "properties": {
      "order_id": { "type": "string", "description": "Order ID, e.g. #123" }
    },
    "required": ["order_id"]
  }
}
```
