# frozen_string_literal: true

module Letta
  class AgentsController < ApplicationController
    # TODO: Remove verify_authenticity_token after integration with Letta
    skip_before_action :verify_authenticity_token

    def create
      response = Letta::AgentService.new.create(permit_params)
      render_success(response:, status: :created)
    end

    private

    def permit_params
      # include_base_tool_rules is option boolean using letta init tools_rules "memory_insert", "conversation_search", "memory_replace"
      # memory_blocks: https://docs.letta.com/guides/agents/memory-blocks/#what-are-memory-blocks
      params.permit(:name, :system, :include_base_tool_rules, :model, :embedding, tools: [], memory_blocks: [ :label, :value ], tool_rules: [ :type, :tool_name ])
    end
  end
end
