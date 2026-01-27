# Letta Streaming API - Reference

**Source**: Letta Official API Documentation  
**Purpose**: Real-time agent message streaming  
**API Version**: v1  
**Last Updated**: 2026-01-24

---

## Overview

Letta supports streaming agent responses via Server-Sent Events (SSE), allowing clients to receive messages in real-time as the agent generates them.

**Base URL**: `http://localhost:8283` (default)

---

## Endpoint

### Stream Agent Message

```http
POST /api/agents/{agent_id}/messages/stream
Content-Type: application/json
```

**Path Parameters**:
- `agent_id` (string, required): The agent ID

**Request Body**:
```json
{
  "message": "What is the weather today?",
  "stream_tokens": true
}
```

**Response**:
```http
HTTP/1.1 200 OK
Content-Type: text/event-stream

event: message_start
data: {"agent_id":"agent_123","message_id":"msg_456"}

event: content_block_delta
data: {"text":"The"}

event: content_block_delta
data: {"text":" weather"}

event: message_stop
data: {"finish_reason":"end_turn"}
```

---

## Event Types

### 1. message_start

Sent when streaming begins.

**Data**:
```json
{
  "agent_id": "agent_abc123",
  "message_id": "msg_xyz789",
  "timestamp": "2026-01-24T12:00:00Z"
}
```

### 2. content_block_delta

Sent for each chunk of generated text.

**Data**:
```json
{
  "text": "Hello world"
}
```

### 3. tool_call_message

Sent when agent decides to use a tool.

**Data**:
```json
{
  "tool_call_id": "call_abc123",
  "tool_name": "search_database",
  "arguments": "{\"query\":\"user orders\"}"
}
```

### 4. approval_request_message

Sent when tool requires user approval.

**Data**:
```json
{
  "tool_call_id": "call_abc123",
  "tool_name": "delete_account",
  "arguments": "{\"user_id\":\"123\"}",
  "requires_approval": true
}
```

### 5. message_stop

Sent when streaming completes.

**Data**:
```json
{
  "finish_reason": "end_turn",
  "total_tokens": 150,
  "run_id": "run_xyz"
}
```

**Finish Reasons**:
- `end_turn`: Normal completion
- `requires_approval`: Waiting for tool approval
- `error`: Error occurred
- `timeout`: Request timeout

---

## Tool Approval Flow

### Step 1: Detect Approval Request

When `event: approval_request_message` is received:

```json
{
  "tool_call_id": "call_123",
  "tool_name": "delete_record",
  "arguments": "{\"id\":\"456\"}",
  "requires_approval": true
}
```

### Step 2: Send Approval Response

```http
POST /api/agents/{agent_id}/messages/stream
Content-Type: application/json

{
  "messages": [
    {
      "type": "approval",
      "approvals": [
        {
          "tool_call_id": "call_123",
          "approve": true
        }
      ]
    }
  ],
  "stream_tokens": true
}
```

**Rejection**:
```json
{
  "messages": [
    {
      "role": "user",
      "content": "I cannot approve this action."
    },
    {
      "type": "approval",
      "approvals": [
        {
          "tool_call_id": "call_123",
          "approve": false
        }
      ]
    }
  ],
  "stream_tokens": true
}
```

---

## Error Handling

### Error Event

```
event: error
data: {"code":"agent_not_found","message":"Agent does not exist"}
```

**Common Error Codes**:
- `agent_not_found` (404)
- `invalid_message` (400)
- `rate_limit_exceeded` (429)
- `internal_error` (500)

---

## Authentication

**Bearer Token** (if enabled):

```http
POST /api/agents/{agent_id}/messages/stream
Authorization: Bearer your_api_key_here
Content-Type: application/json
```

---

## Rate Limits

**Default Limits** (configurable):
- 60 requests/minute per agent
- 10 concurrent streams per user
- 30 second timeout per stream

**Headers**:
```http
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1706096400
```

---

## Example: Full Conversation Flow

### 1. Initial Message

```http
POST /api/agents/agent_123/messages/stream

{
  "message": "Show me my orders"
}
```

**Response Stream**:
```
event: message_start
data: {"agent_id":"agent_123","message_id":"msg_1"}

event: content_block_delta
data: {"text":"I'll"}

event: content_block_delta
data: {"text":" search"}

event: tool_call_message
data: {"tool_call_id":"call_1","tool_name":"search_orders","arguments":"{}"}

event: content_block_delta
data: {"text":"You have 3 orders"}

event: message_stop
data: {"finish_reason":"end_turn","total_tokens":45}
```

### 2. With Tool Approval

```http
POST /api/agents/agent_123/messages/stream

{
  "message": "Cancel order #456"
}
```

**Response Stream**:
```
event: approval_request_message
data: {"tool_call_id":"call_2","tool_name":"cancel_order","arguments":"{\"order_id\":\"456\"}"}

event: message_stop
data: {"finish_reason":"requires_approval"}
```

**Approve**:
```http
POST /api/agents/agent_123/messages/stream

{
  "messages": [{
    "type": "approval",
    "approvals": [{"tool_call_id":"call_2","approve":true}]
  }]
}
```

**Continue Stream**:
```
event: tool_call_message
data: {"tool_call_id":"call_2","tool_name":"cancel_order"}

event: content_block_delta
data: {"text":"Order canceled successfully"}

event: message_stop
data: {"finish_reason":"end_turn"}
```

---

## Connection Management

### Heartbeat

Server sends heartbeat every 15 seconds to keep connection alive:

```
: heartbeat

```

(Comment lines are ignored by SSE spec)

### Timeout

Streams automatically close after 30 seconds of inactivity (configurable).

### Reconnection

Client can reconnect using `Last-Event-ID`:

```http
GET /api/agents/agent_123/messages/stream
Last-Event-ID: msg_456
```

---

## Testing with cURL

```bash
# Basic streaming
curl -N -H "Content-Type: application/json" \
  -d '{"message":"Hello","stream_tokens":true}' \
  http://localhost:8283/api/agents/agent_123/messages/stream

# With authentication
curl -N -H "Authorization: Bearer YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello"}' \
  http://localhost:8283/api/agents/agent_123/messages/stream

# Send approval
curl -N -H "Content-Type: application/json" \
  -d '{"messages":[{"type":"approval","approvals":[{"tool_call_id":"call_1","approve":true}]}]}' \
  http://localhost:8283/api/agents/agent_123/messages/stream
```

---

## References

- [Letta Official Docs](https://docs.letta.ai)
- [Letta API Reference](http://localhost:8283/docs)
- [GitHub: Letta](https://github.com/letta-ai/letta)
- [SSE Specification](https://html.spec.whatwg.org/multipage/server-sent-events.html)
