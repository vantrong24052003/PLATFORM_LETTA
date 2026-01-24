# Streaming - SSE Implementation

**Feature**: Server-Sent Events for real-time chat streaming  
**Status**: 🔴 Not Started  
**Parent**: [../00-implementation-plan.md](../00-implementation-plan.md)

---

## Overview

Implement real-time streaming of Letta responses using Server-Sent Events (SSE) to improve user experience with progressive message display.

---

## Goals

1. **Backend SSE Controller**: Create Rails controller to handle SSE connections
2. **Letta Streaming Client**: Modify Letta HTTP client to support streaming responses
3. **Widget Integration**: Update widget to consume SSE events
4. **Error Handling**: Implement reconnection logic and timeout handling

---

## Tasks

### Task 1: Rails SSE Controller
- [ ] Create `Letta::StreamingController`
- [ ] Implement SSE response format
- [ ] Handle connection lifecycle
- [ ] Add heartbeat mechanism

### Task 2: Letta Client Streaming
- [ ] Update `External::LettaService` for streaming
- [ ] Parse streaming response chunks
- [ ] Handle partial JSON responses
- [ ] Implement error recovery

### Task 3: Widget Updates
- [ ] Add EventSource integration
- [ ] Progressive message rendering
- [ ] Loading states
- [ ] Reconnection logic

### Task 4: Testing
- [ ] Request specs for SSE endpoints
- [ ] Integration tests for streaming flow
- [ ] Browser testing with real widget

---

## Technical Design

### SSE Response Format
```
event: message_start
data: {"agent_id": "...", "message_id": "..."}

event: content_block_delta
data: {"text": "Hello"}

event: content_block_delta
data: {"text": " world"}

event: message_stop
data: {"finish_reason": "end_turn"}
```

### Rails Route
```ruby
# config/routes.rb
namespace :letta do
  resources :agents do
    post 'stream', to: 'streaming#create'
  end
end
```

---

## Acceptance Criteria

- [ ] SSE endpoint responds with correct headers
- [ ] Letta responses stream in real-time (< 100ms latency per chunk)
- [ ] Widget displays progressive updates
- [ ] Reconnection works after network interruption
- [ ] Tests pass with 80%+ coverage

---

## References

- [Rails ActionController::Live](https://api.rubyonrails.org/classes/ActionController/Live.html)
- [MDN EventSource](https://developer.mozilla.org/en-US/docs/Web/API/EventSource)
- [Letta Streaming API](http://localhost:8283/docs#streaming)
