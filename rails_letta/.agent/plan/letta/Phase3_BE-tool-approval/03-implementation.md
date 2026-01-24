# Tool Forwarding - Implementation Detail

**Feature**: Automated Bidirectional Tool Execution
**Status**: 🟡 Planning
**Convention**: Rails Service-Oriented Architecture

---

## 1. Flows

### Request Flow (Streaming Interception)
1. **Chat Widget**: Sends user message to `POST /letta/agents/:id/stream`.
2. **Rails Orchestrator**: Initiates a streaming loop with LeTTa Engine.
3. **LeTTa Engine**: Determines a tool is needed and emits a `tool_call` event.
4. **Rails Interceptor**: Detects the `tool_call` event within the loop.
5. **Resolution**: Rails looks up the `customer_domain` from the `BotTemplate`.
6. **Execution**: Rails calls `Letta::Tools::Forwarder` service.
7. **Relay**: The result of the execution is sent back to the LeTTa Engine.
8. **Finalization**: LeTTa Engine processes the result and resumes the message stream.

### Configuration Flow (Admin)
1. **User**: Sets `customer_domain` in the `ui-mgpt` dashboard.
2. **Rails**: Updates the `BotTemplate` record in the database.

---

## 2. Models

### BotTemplate Extension
**Location**: `app/models/bot_template.rb`

```ruby
class BotTemplate < ApplicationRecord
  # Existing validations...
  # New domain validation for forwarding safety
  validates :customer_domain, format: { with: URI::DEFAULT_PARSER.make_regexp(%w[http https]) }, allow_blank: true
end
```

---

## 3. Service Objects

### Letta::Tools::Forwarder
Handles the secure outbound request to the customer's private backend.

**Location**: `app/services/letta/tools/forwarder.rb`

```ruby
class Letta::Tools::Forwarder < ApplicationService
  def call
    # 1. Prepare Payload (Tool Name, Arguments, Context)
    # 2. Add Security Header (HMAC SHA-256)
    # 3. Dispatch POST to https://{customer_domain}/letta/tools/execute
    # 4. Return result as standardized JSON string for LeTTa Engine
  end
end
```

### Letta::StreamingMessages::Create (Refactor)
Extends the existing streaming service to handle tool call detection.

**Location**: `app/services/letta/streaming_messages/create.rb`

```ruby
class Letta::StreamingMessages::Create < ApplicationService
  # Define event type constants to avoid hardcoding
  EVENT_TOOL_CALL = "tool_call"
  EVENT_CONTENT_BLOCK_DELTA = "content_block_delta"

  # ... existing logic ...
  
  private
  
  def handle_event(event_type, data)
    if event_type == EVENT_TOOL_CALL
      # Automated Internal Orchestration
      result = Letta::Tools::Forwarder.new(tool_data: data).call
      # Notify LeTTa Engine of the tool result
    else
      # Forward normal SSE events to widget
      yield_to_client(event_type, data)
    end
  end
end
```

---

## 4. Key Orchestration Logic (No Widget Interaction)

1. **State Persistence**: No custom table for tool state is used. Orchestration is transient and managed within the request-response lifecycle of the Letta run.
2. **Security**: Signature validation ensures that the Customer Backend only processes requests originating from the LeTTa Platform.
3. **Internal Only**: The entire "Forwarding" hub is invisible to the end user. They only see the final response from the AI.
