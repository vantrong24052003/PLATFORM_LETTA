# frozen_string_literal: true

module Integration
  module Letta
    class Endpoints
      AGENTS = {
        CREATE_AGENT: "/v1/agents/",
      }.freeze

      TOOLS = {
        EXECUTE: "/letta/tools/execute"
      }.freeze

      MESSAGES = {
        CREATE_MESSAGE: ->(agent_id) { "/v1/agents/#{agent_id}/messages" },
        STREAM_MESSAGE: ->(agent_id) { "/v1/agents/#{agent_id}/messages/stream" },
      }.freeze
    end
  end
end
