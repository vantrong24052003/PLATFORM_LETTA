# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Letta::StreamingMessages', type: :request do
  describe 'POST /letta/streaming_messages' do
    let(:organization) { Organization.create!(id: 'org-1', name: 'Test Org', privileged_tools: false) }
    let(:bot_template) { BotTemplate.create!(name: 'Test', organization_id: organization.id, system_prompt: 'You are helpful') }
    let(:agent) { Agent.create!(id: 'agent-1', name: 'Test Agent', organization_id: organization.id, message_buffer_autoclear: true) }
    let(:agent_mapping) { AgentMapping.create!(bot_template:, organization_id: organization.id, user_id: 'user-1', agent:) }
    let(:params) { { agent_id: agent_mapping.agent_id, input: 'Stream me' } }

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
