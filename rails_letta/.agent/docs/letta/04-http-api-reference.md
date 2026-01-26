# Letta Integration Guide

**Purpose**: How to integrate Rails LeTTa with Letta AI Engine  
**Audience**: Developers implementing Letta features  
**Last Updated**: 2026-01-24

---

## Overview

This guide explains how to integrate the Rails LeTTa backend with the Letta AI Engine, covering API communication, authentication, and best practices.

---

## Prerequisites

**Infrastructure**:
- Letta Engine running on `http://localhost:8283`
- PostgreSQL database
- Rails 8.1.1+

**Environment Variables**:
```bash
LETTA_API_URL=http://localhost:8283
LETTA_API_KEY=your_api_key  # If authentication is enabled
```

---

## Letta API Client

### Creating the Client

**Location**: `app/services/external/letta_service.rb`

```ruby
module External
  class LettaService
    BASE_URL = ENV.fetch('LETTA_API_URL', 'http://localhost:8283')

    def initialize
      @conn = Faraday.new(url: BASE_URL) do |f|
        f.request :json
        f.response :json
        f.adapter Faraday.default_adapter
      end
    end

    # Create agent
    def create_agent(name:, system:, human: 'User', persona: 'Assistant')
      response = @conn.post('/api/agents') do |req|
        req.body = {
          name: name,
          system: system,
          human: human,
          persona: persona
        }
      end

      response.body
    end

    # Send message
    def send_message(agent_id:, message:)
      response = @conn.post("/api/agents/#{agent_id}/messages") do |req|
        req.body = { message: message }
      end

      response.body
    end

    # Get agent memory
    def get_agent_memory(agent_id)
      response = @conn.get("/api/agents/#{agent_id}/memory")
      response.body
    end
  end
end
```

---

## Key API Endpoints

### 1. Create Agent
```http
POST /api/agents
Content-Type: application/json

{
  "name": "Customer Support Bot",
  "system": "You are a helpful customer support agent...",
  "human": "User",
  "persona": "Assistant"
}
```

**Response**:
```json
{
  "id": "agent-abc123",
  "name": "Customer Support Bot",
  "created_at": "2026-01-24T12:00:00Z"
}
```

---

### 2. Send Message
```http
POST /api/agents/{agent_id}/messages
Content-Type: application/json

{
  "message": "What is your refund policy?"
}
```

**Response**:
```json
{
  "messages": [
    {
      "role": "assistant",
      "content": "Our refund policy allows..."
    }
  ]
}
```

---

### 3. Get Agent Memory
```http
GET /api/agents/{agent_id}/memory
```

**Response**:
```json
{
  "memory": {
    "human": "User is asking about refunds",
    "persona": "I am a helpful support agent"
  }
}
```

---

## Error Handling

### Common Errors

**1. Agent Not Found (404)**
```ruby
begin
  letta_service.send_message(agent_id: 'invalid', message: 'Hello')
rescue Faraday::ResourceNotFound => e
  Rails.logger.error("Agent not found: #{e.message}")
  # Handle gracefully
end
```

**2. Connection Timeout**
```ruby
begin
  letta_service.create_agent(name: 'Bot', system: 'You are...')
rescue Faraday::TimeoutError => e
  Rails.logger.error("Letta Engine timeout: #{e.message}")
  # Retry or show error to user
end
```

**3. API Rate Limit (429)**
```ruby
begin
  letta_service.send_message(agent_id: id, message: msg)
rescue Faraday::TooManyRequestsError => e
  # Implement exponential backoff
  sleep(2)
  retry
end
```

---

## Testing

### RSpec Stub Examples

```ruby
# spec/services/external/letta_service_spec.rb
require 'rails_helper'

RSpec.describe External::LettaService do
  let(:service) { described_class.new }

  describe '#create_agent' do
    it 'creates agent via Letta API' do
      stub_request(:post, "#{ENV['LETTA_API_URL']}/api/agents")
        .with(body: hash_including(name: 'Test Bot'))
        .to_return(status: 200, body: { id: 'agent_123' }.to_json)

      result = service.create_agent(name: 'Test Bot', system: 'You are...')
      expect(result['id']).to eq('agent_123')
    end
  end
end
```

---

## Best Practices

### 1. Connection Pooling
Use persistent connections to avoid TCP handshake overhead:

```ruby
class LettaService
  def initialize
    @conn = Faraday.new(url: BASE_URL) do |f|
      f.adapter :net_http_persistent
    end
  end
end
```

### 2. Timeout Configuration
Set reasonable timeouts:

```ruby
@conn = Faraday.new(url: BASE_URL) do |f|
  f.options.timeout = 30      # 30 seconds
  f.options.open_timeout = 5  # 5 seconds
end
```

### 3. Retry Logic
Implement retries for transient failures:

```ruby
def send_message_with_retry(agent_id:, message:, retries: 3)
  attempts = 0
  begin
    send_message(agent_id: agent_id, message: message)
  rescue Faraday::Error => e
    attempts += 1
    retry if attempts < retries
    raise
  end
end
```

---

## Performance Tips

1. **Eager Loading**: Preload agent data to avoid N+1 queries
2. **Caching**: Cache agent IDs and memory blocks
3. **Async Processing**: Use background jobs for non-critical operations
4. **Connection Reuse**: Reuse Faraday connections

---

## Security

1. **API Keys**: Store in encrypted credentials, not ENV files
2. **HTTPS**: Use HTTPS in production
3. **Validation**: Validate all inputs before sending to Letta
4. **Rate Limiting**: Implement rate limiting on your side

---

## Monitoring

### Key Metrics to Track

- Letta API response time
- Error rate (4xx, 5xx)
- Agent creation success rate
- Message send latency

### Example Logging

```ruby
def send_message(agent_id:, message:)
  start_time = Time.current
  
  response = @conn.post("/api/agents/#{agent_id}/messages") do |req|
    req.body = { message: message }
  end

  duration = Time.current - start_time
  Rails.logger.info("Letta API call: #{duration}ms")

  response.body
rescue StandardError => e
  Rails.logger.error("Letta API error: #{e.class} - #{e.message}")
  raise
end
```

---

## Related Documentation

- [Letta Database Schema](./01-letta-database.md) - Understanding Letta's 48 tables
- [Custom DB Integration](./custom-db-integration/) - Our Rails tables
- [Streaming Guide](./streaming/) - SSE implementation
- [Tool Approval](./tool-approval/) - Tool approval workflow

---

## External Resources

- [Letta Official Docs](https://docs.letta.ai)
- [Letta GitHub](https://github.com/letta-ai/letta)
- [Letta API Reference](http://localhost:8283/docs)
