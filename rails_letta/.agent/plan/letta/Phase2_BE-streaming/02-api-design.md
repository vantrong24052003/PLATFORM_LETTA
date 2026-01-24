# Streaming - API Design

**Feature**: Server-Sent Events for Real-Time Chat Streaming  
**Status**: 🔴 Not Started  
**Parent**: [00-overview.md](./00-overview.md)

---

## Overview

This document defines the SSE endpoint for streaming Letta responses.

---

## Endpoint

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
data: {"agent_id": "agent_123", "message_id": "msg_456"}

event: content_block_delta
data: {"text": "The"}

event: content_block_delta
data: {"text": " weather"}

event: content_block_delta
data: {" text": " today"}

event: message_stop
data: {"finish_reason": "end_turn"}
```

---

## Event Types

### 1. message_start
**When**: Stream begins
**Data**:
```json
{
  "agent_id": "agent_123",
  "message_id": "msg_456",
  "timestamp": "2026-01-24T12:00:00Z"
}
```

### 2. content_block_delta
**When**: Each chunk of text arrives
**Data**:
```json
{
  "text": "word or phrase"
}
```

### 3. message_stop
**When**: Stream completes
**Data**:
```json
{
  "finish_reason": "end_turn | error | timeout",
  "total_tokens": 150
}
```

### 4. error
**When**: Error occurs
**Data**:
```json
{
  "code": "letta_api_error",
  "message": "Failed to connect to Letta Engine"
}
```

---

## Error Handling

**Client Disconnects**:
- Server detects disconnect via `stream.closed?`
- Stops sending events
- Cleans up resources

**Letta API Error**:
- Send `error` event
- Close stream with status 200 (SSE convention)

**Timeout** (30 seconds):
- Send `message_stop` with `finish_reason: "timeout"`
- Close stream

---

## Client Usage (JavaScript)

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

## Testing Checklist

- [ ] POST /letta/agents/:id/stream returns `text/event-stream`
- [ ] Stream sends `message_start` event first
- [ ] Stream sends multiple `content_block_delta` events
- [ ] Stream sends `message_stop` event last
- [ ] Client disconnect is handled gracefully
- [ ] Timeout after 30 seconds works
- [ ] Error events are sent when Letta API fails
