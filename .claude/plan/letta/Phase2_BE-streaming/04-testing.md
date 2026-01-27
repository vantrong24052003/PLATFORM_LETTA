# Streaming - Testing

**Feature**: Server-Sent Events for Real-Time Chat Streaming  
**Status**: 🔴 Not Started  
**Parent**: [00-overview.md](./00-overview.md)

---

## Overview

Testing strategy for SSE streaming endpoint.

**Coverage Goal**: 80%+

---

## Request Specs

### spec/requests/letta/streaming_spec.rb

```ruby
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
      # Mock Letta streaming response
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

## Service Specs

### spec/services/letta/streaming_service_spec.rb

```ruby
require 'rails_helper'

RSpec.describe Letta::StreamingService do
  let(:agent_id) { 'agent_123' }
  let(:message) { 'Hello, agent!' }
  let(:service) { described_class.new(agent_id: agent_id, message: message) }

  describe '#stream' do
    it 'yields chunks from Letta API' do
      letta_client = instance_double(External::LettaService)
      allow(External::LettaService).to receive(:new).and_return(letta_client)
      
      allow(letta_client).to receive(:stream_message).and_yield(
        { type: 'content_block_delta', text: 'Chunk1' }
      ).and_yield(
        { type: 'content_block_delta', text: 'Chunk2' }
      )

      chunks = []
      service.stream { |chunk| chunks << chunk }

      expect(chunks.size).to eq(2)
      expect(chunks[0][:text]).to eq('Chunk1')
    end

    it 'handles errors gracefully' do
      letta_client = instance_double(External::LettaService)
      allow(External::LettaService).to receive(:new).and_return(letta_client)
      allow(letta_client).to receive(:stream_message).and_raise(StandardError, 'Connection failed')

      expect {
        service.stream { |chunk| }
      }.to raise_error(StandardError, 'Connection failed')
    end
  end
end
```

---

## Integration Tests

### Browser-based (Capybara + Selenium)

```ruby
require 'rails_helper'

RSpec.describe 'Streaming Chat', type: :system, js: true do
  it 'displays progressive text updates' do
    visit chat_path

    fill_in 'message', with: 'What is AI?'
    click_button 'Send'

    # Wait for first chunk
    expect(page).to have_content('Artificial', wait: 2)

    # Wait for complete message
    expect(page).to have_content('Intelligence is', wait: 5)
  end

  it 'shows loading indicator during streaming' do
    visit chat_path

    fill_in 'message', with: 'Hello'
    click_button 'Send'

    expect(page).to have_css('.streaming-indicator')
    
    # Indicator disappears when done
    expect(page).not_to have_css('.streaming-indicator', wait: 10)
  end
end
```

---

## Manual Testing Checklist

- [ ] Open browser dev tools (Network tab)
- [ ] Send message via widget
- [ ] Verify EventSource connection established
- [ ] Verify events appear in real-time
- [ ] Verify text appears progressively in UI
- [ ] Disconnect network mid-stream
- [ ] Verify reconnection works
- [ ] Verify timeout after 30s (if Letta hangs)

---

## Performance Testing

```ruby
# Load test (optional Phase 2)
require 'benchmark'

RSpec.describe 'Stream Performance' do
  it 'handles 10 concurrent streams' do
    threads = []
    
    time = Benchmark.measure do
      10.times do
        threads << Thread.new do
          post stream_letta_agent_path('agent_123'), params: { message: 'Test' }
        end
      end
      threads.each(&:join)
    end

    expect(time.real).to be < 5.0 # All streams complete in 5s
  end
end
```

---

## Acceptance Criteria

- [ ] Request specs pass
- [ ] Service specs pass
- [ ] Integration tests pass (browser)
- [ ] Manual testing checklist complete
- [ ] No memory leaks (streams are closed)
- [ ] Coverage >= 80%
