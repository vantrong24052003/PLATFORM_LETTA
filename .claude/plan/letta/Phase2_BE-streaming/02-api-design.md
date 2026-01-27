# Streaming API - API Design

This document defines the SSE endpoint for streaming Letta responses.

---

## 1. Endpoint Overview

| Method | Path | Description |
|--------|------|-------------|
| POST | `/letta/agents/:agent_id/stream` | Stream real-time responses |

---

## 2. Stream Endpoint

### POST /letta/agents/:agent_id/stream

**Description**: Stream a message to Letta agent and receive real-time response

**Headers**:
```
Accept: text/event-stream
Authorization: Bearer <token>
```

**Request Body**:
```json
{
  "message": "What is the weather today?"
}
```

**Response** (200 OK):
```
Content-Type: text/event-stream
Cache-Control: no-cache
Connection: keep-alive

event: message_start
data: {"agent_id":"agent_123","message_id":"msg_456"}

event: content_block_delta
data: {"text":"The"}

event: content_block_delta
data: {"text":" weather"}

event: content_block_delta
data: {"text":" today"}

event: message_stop
data: {"finish_reason":"end_turn"}
```

---

## 3. Event Types

### 3.1. message_start

**When**: Stream begins

**Data**:
```json
{
  "agent_id": "agent_123",
  "message_id": "msg_456",
  "timestamp": "2026-01-24T12:00:00Z"
}
```

### 3.2. content_block_delta

**When**: Each chunk of text arrives

**Data**:
```json
{
  "text": "word or phrase"
}
```

### 3.3. message_stop

**When**: Stream completes

**Data**:
```json
{
  "finish_reason": "end_turn | error | timeout",
  "total_tokens": 150
}
```

### 3.4. error

**When**: Error occurs

**Data**:
```json
{
  "code": "letta_api_error",
  "message": "Failed to connect to Letta Engine"
}
```

---

## 4. Error Handling

### Client Disconnects
- Server detects disconnect via `stream.closed?`
- Stops sending events
- Cleans up resources

### Letta API Error
- Send `error` event
- Close stream with status 200 (SSE convention)

### Timeout (30 seconds)
- Send `message_stop` with `finish_reason: "timeout"`
- Close stream

---

## 5. Client Usage (JavaScript)

```javascript
const eventSource = new EventSource('/letta/agents/agent_123/stream', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer token'
  },
  body: JSON.stringify({ message: 'Hello' })
});

eventSource.addEventListener('content_block_delta', (event) => {
  const data = JSON.parse(event.data);
  appendText(data.text);
});

eventSource.addEventListener('message_stop', (event) => {
  eventSource.close();
});

eventSource.addEventListener('error', (event) => {
  console.error('Stream error', event);
  eventSource.close();
});
```

---

## Related

- [00-overview.md](./00-overview.md) - Feature overview
- [03-implementation.md](./03-implementation.md) - Controller implementation
- [07-sse-specification.md](../../../docs/letta/07-sse-specification.md) - SSE protocol reference
