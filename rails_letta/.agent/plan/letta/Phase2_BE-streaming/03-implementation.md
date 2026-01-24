# Implementation Plan

## Architecture & Event Structure

**Data Flow**:
1. **Client**: `POST /letta/streaming_messages`
2. **Controller**: `Letta::StreamingMessagesController` (SSE Mode)
3. **Service**: `Letta::StreamingMessages::Create` -> `HttpClient.post_stream`
4. **Output**: Standard Server-Sent Events (SSE).

**SSE Event Format**:
- `event: content` -> `data: {"content": "Hello", "type": "text"}`
- `event: done` -> `data: {"stop_reason": "end_turn", "usage": {...}}`
- `event: error` -> `data: {"code": "upstream_error", "message": "..."}`

## Steps

### Step 1: Verify & Fix HTTP Client
- [x] Verify `Integration::Letta::Util::HttpClient.post_stream` correctly yields chunks.
- [x] Ensure underlying `Net::HTTP` streaming is engaged.

### Step 2: Update Service Layer
- [x] **Class**: `Letta::StreamingMessages::Create`
- [x] **Logic**:
    - Parse raw JSON lines from Letta.
    - Extract `content` and `usage`.
    - Yield structured hashes `{ type: :content, payload: ... }`.
    - Handle JSON parsing errors for partial chunks.

### Step 3: Update Controller
- [x] **Class**: `Letta::StreamingMessagesController`
- [x] **Logic**:
    - Set headers: `Content-Type: text/event-stream`, `Cache-Control: no-cache`.
    - Iterate over service yields.
    - Format as SSE: `response.stream.write("event: ...\ndata: ...\n\n")`.
    - Handle `IOError` (client disconnect) and `StandardError`.
    - Ensure `response.stream.close` in `ensure` block.

### Step 4: Testing
- [x] **Spec**: `spec/requests/letta/streaming_messages_spec.rb`
- [x] Mock `HttpClient.post_stream` to yield sample chunks.
- [x] Verify response body contains correct `data: ...` lines.
