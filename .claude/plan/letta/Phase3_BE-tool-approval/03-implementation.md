# Tool Approval - Implementation

This document defines the code implementation for tool approval workflow.

---

## 1. Request Flow

```
Stream → tool_call → Forwarder → Customer Backend → Result → Letta Engine → Resume Stream
```

**Flow Sequence**:
1. Chat Widget sends message to `POST /letta/agents/:id/stream`
2. Rails initiates streaming with Letta Engine
3. Letta Engine emits `tool_call` event
4. Rails detects `tool_call`, looks up `customer_domain`
5. Rails calls `Letta::Tools::Forwarder` service
6. Result sent back to Letta Engine
7. Stream resumes with final response

---

## 2. Models

### BotTemplate Extension

**Location**: `app/models/letta/bot_template.rb`

```ruby
# frozen_string_literal: true

class Letta::BotTemplate < ApplicationRecord
  validates :customer_domain, format: {
    with: URI::DEFAULT_PARSER.make_regexp(%w[http https])
  }, allow_blank: true
end
```

---

## 3. Service Objects

### Letta::Tools::Forwarder

**Location**: `app/services/letta/tools/forwarder.rb`

```ruby
# frozen_string_literal: true

module Letta
  module Tools
    class Forwarder < ApplicationService
      def call
        # 1. Prepare Payload (Tool Name, Arguments, Context)
        # 2. Add Security Header (HMAC SHA-256)
        # 3. Dispatch POST to https://{customer_domain}/letta/tools/execute
        # 4. Return result as standardized JSON string for Letta Engine
      end
    end
  end
end
```

### Letta::StreamingMessages::Create (Extended)

**Location**: `app/services/letta/streaming_messages/create.rb`

```ruby
# frozen_string_literal: true

class Letta::StreamingMessages::Create < ApplicationService
  EVENT_TOOL_CALL = 'tool_call'
  EVENT_CONTENT_BLOCK_DELTA = 'content_block_delta'

  def call
    HttpClient.post_stream(...) do |chunk|
      event = parse_chunk(chunk)

      if event[:type] == :tool_call
        # Automated Internal Orchestration
        result = Letta::Tools::Forwarder.new(tool_data: event[:payload]).call
        # Send result back to Letta Engine
      else
        # Forward normal SSE events to widget
        yield event
      end
    end
  end
end
```

---

## Related

- [00-overview.md](./00-overview.md) - Feature overview
- [01-database-schema.md](./01-database-schema.md) - Database schema
