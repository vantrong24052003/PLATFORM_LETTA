# Streaming API - Implementation

This document defines the code implementation for SSE streaming.

---

## 1. Request Flow

```
Client → Rails Router → Controller → Service → HttpClient → Letta Engine → SSE Stream
```

**Flow Sequence**:
1. Client sends `POST /letta/streaming_messages`
2. Controller sets SSE headers (`Content-Type: text/event-stream`)
3. Service calls `HttpClient.post_stream` to Letta Engine
4. Service yields structured events `{ type: :content, payload: ... }`
5. Controller formats as SSE and writes to response stream

---

## 2. Controllers

### Letta::StreamingMessagesController

**Location**: `app/controllers/letta/streaming_messages_controller.rb`

```ruby
# frozen_string_literal: true

module Letta
  class StreamingMessagesController < ApplicationController
    include ActionController::Live

    def create
      response.headers['Content-Type'] = 'text/event-stream'
      response.headers['Cache-Control'] = 'no-cache'
      response.headers['Connection'] = 'keep-alive'

      service = StreamingMessages::Create.new(streaming_params)

      service.call do |event|
        response.stream.write(format_sse(event))
      end
    ensure
      response.stream.close if response.stream.exist?
    end

    private

    def streaming_params
      params.permit(:agent_id, :message)
    end

    def format_sse(event)
      case event[:type]
      when :content
        "event: content_block_delta\ndata: #{event[:payload].to_json}\n\n"
      when :done
        "event: message_stop\ndata: #{event[:payload].to_json}\n\n"
      when :error
        "event: error\ndata: #{event[:payload].to_json}\n\n"
      end
    end
  end
end
```

---

## 3. Service Objects

### Letta::StreamingMessages::Create

**Location**: `app/services/letta/streaming_messages/create.rb`

```ruby
# frozen_string_literal: true

module Letta
  module StreamingMessages
    class Create < ApplicationService
      def call
        HttpClient.post_stream(
          "#{ENV['LETTA_API_URL']}/agents/#{params[:agent_id]}/messages/stream",
          body: { message: params[:message] }
        ) do |chunk|
          event = parse_chunk(chunk)
          yield event if event
        end
      rescue StandardError => e
        yield({ type: :error, payload: { code: 'stream_error', message: e.message } })
      end

      private

      def parse_chunk(chunk)
        return nil if chunk.strip.empty?

        data = JSON.parse(chunk)
        case data['type']
        when 'content_block_delta'
          { type: :content, payload: { text: data.dig('content', 'text') } }
        when 'message_stop'
          { type: :done, payload: { finish_reason: data['finish_reason'] } }
        end
      rescue JSON::ParserError
        nil # Skip invalid JSON chunks
      end
    end
  end
end
```

---

## 4. HTTP Client

### Integration::Letta::Util::HttpClient

**Location**: `app/integration/letta/util/http_client.rb`

```ruby
# frozen_string_literal: true

module Integration
  module Letta
    module Util
      class HttpClient
        def self.post_stream(url, body:, &block)
          uri = URI(url)
          http = Net::HTTP.new(uri.host, uri.port)
          http.use_ssl = (uri.scheme == 'https')

          request = Net::HTTP::Post.new(uri)
          request['Content-Type'] = 'application/json'
          request.body = body.to_json

          http.request(request) do |response|
            response.read_body do |chunk|
              block.call(chunk)
            end
          end
        end
      end
    end
  end
end
```

---

## Related

- [00-overview.md](./00-overview.md) - Feature overview
- [02-api-design.md](./02-api-design.md) - API endpoint specification
