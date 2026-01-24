# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Letta::StreamingMessages', type: :request do
  describe 'POST /letta/streaming_messages' do
    let(:params) { { agent_id: 'agent-1', input: 'Stream me' } }

    before do
      # Mock post_stream to yield chunks in upstream format (e.g. valid SSE with JSON)
      allow(Integration::Letta::Util::HttpClient).to receive(:post_stream) do |kwargs, &block|
        block.call("data: {\"content\": \"Hello\"}\n\n")
        block.call("data: {\"content\": \" World\"}\n\n")
        block.call("data: [DONE]\n\n")
      end
    end

    it 'streams response chunks in correct SSE format' do
      post '/letta/streaming_messages', params:, as: :json

      expect(response.headers['Content-Type']).to include('text/event-stream')

      # Verify the response body contains the formatted events
      expect(response.body).to include("event: content\n")
      expect(response.body).to include("data: {\"content\":\"Hello\"}\n\n")

      expect(response.body).to include("data: {\"content\":\" World\"}\n\n")
    end
  end
end
