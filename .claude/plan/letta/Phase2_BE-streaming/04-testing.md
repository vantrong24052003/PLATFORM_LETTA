# Streaming API - Testing

This document defines the testing strategy for SSE streaming.

**Coverage Goal**: 80%+

---

## 1. Coverage Goals

| Component | Target Coverage |
|-----------|-----------------|
| Controllers | 90%+ |
| Services | 90%+ |
| HttpClient | 80%+ |
| Overall | 80%+ |

---

## 2. Request Specs

### spec/requests/letta/streaming_spec.rb

```ruby
# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Letta::Streaming', type: :request do
  let(:organization) { create(:organization) }
  let(:user) { create(:user, organization: organization) }
  let(:agent_id) { 'agent_123' }

  before { sign_in user }

  describe 'POST /letta/agents/:agent_id/stream' do
    it 'returns text/event-stream content type' do
      post stream_letta_agent_path(agent_id), params: { message: 'Hello' }

      expect(response.content_type).to include('text/event-stream')
    end

    it 'sends message_start event' do
      allow_any_instance_of(External::LettaService).to receive(:stream_message) do |&block|
        block.call({ type: 'message_start', agent_id: agent_id })
        block.call({ type: 'content_block_delta', text: 'Hello' })
        block.call({ type: 'message_stop', finish_reason: 'end_turn' })
      end

      post stream_letta_agent_path(agent_id), params: { message: 'Test' }

      expect(response.body).to include('event: message_start')
    end

    it 'streams content in chunks' do
      allow_any_instance_of(External::LettaService).to receive(:stream_message) do |&block|
        block.call({ type: 'content_block_delta', text: 'Word1' })
        block.call({ type: 'content_block_delta', text: ' Word2' })
      end

      post stream_letta_agent_path(agent_id), params: { message: 'Test' }

      expect(response.body).to include('"text":"Word1"')
      expect(response.body).to include('"text":" Word2"')
    end

    it 'sends message_stop event at end' do
      allow_any_instance_of(External::LettaService).to receive(:stream_message) do |&block|
        block.call({ type: 'message_stop', finish_reason: 'end_turn' })
      end

      post stream_letta_agent_path(agent_id), params: { message: 'Test' }

      expect(response.body).to include('event: message_stop')
    end

    it 'handles Letta API errors' do
      allow_any_instance_of(External::LettaService).to receive(:stream_message).and_raise(StandardError, 'API Error')

      post stream_letta_agent_path(agent_id), params: { message: 'Test' }

      expect(response.body).to include('event: error')
    end
  end
end
```

---

## 3. Service Specs

### spec/services/letta/streaming_messages/create_spec.rb

```ruby
# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Letta::StreamingMessages::Create do
  let(:agent_id) { 'agent_123' }
  let(:message) { 'Hello, agent!' }
  let(:service) { described_class.new(agent_id: agent_id, message: message) }

  describe '#call' do
    it 'yields chunks from Letta API' do
      letta_client = instance_double(External::LettaService)
      allow(External::LettaService).to receive(:new).and_return(letta_client)

      allow(letta_client).to receive(:stream_message).and_yield(
        { type: 'content_block_delta', content: { text: 'Chunk1' } }
      ).and_yield(
        { type: 'content_block_delta', content: { text: 'Chunk2' } }
      )

      chunks = []
      service.call { |chunk| chunks << chunk }

      expect(chunks.size).to eq(2)
      expect(chunks[0][:payload][:text]).to eq('Chunk1')
    end

    it 'handles errors gracefully' do
      letta_client = instance_double(External::LettaService)
      allow(External::LettaService).to receive(:new).and_return(letta_client)
      allow(letta_client).to receive(:stream_message).and_raise(StandardError, 'Connection failed')

      chunks = []
      service.call { |chunk| chunks << chunk }

      expect(chunks.first[:type]).to eq(:error)
    end
  end
end
```

---

## 4. Manual Testing Checklist

- [ ] Open browser dev tools (Network tab)
- [ ] Send message via widget
- [ ] Verify EventSource connection established
- [ ] Verify events appear in real-time
- [ ] Verify text appears progressively in UI
- [ ] Disconnect network mid-stream
- [ ] Verify reconnection works
- [ ] Verify timeout after 30s (if Letta hangs)

---

## 5. Running Tests

```bash
# All tests
bundle exec rspec

# Specific file
bundle exec rspec spec/requests/letta/streaming_spec.rb

# Coverage report
COVERAGE=true bundle exec rspec
```

---

## Related

- [00-overview.md](./00-overview.md) - Feature overview
- [03-implementation.md](./03-implementation.md) - Implementation code
