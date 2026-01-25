# frozen_string_literal: true

class Letta::AgentsController < ApplicationController
  include OrganizationAuthable

  def index
    result = Letta::Agents::List.new(
      list_params.merge(organization_id: current_organization.id)
    ).call

    if result[:success]
      render_success(response: { agents: result[:data], pagination: result[:pagination] })
    else
      render_error(error: result[:error], status: :internal_server_error)
    end
  end

  def create
    result = Letta::Agents::Create.new(permit_params).call

    if result[:success]
      render_success(response: result[:data], status: :created)
    else
      render_error(error: "Validation failed", response: result[:errors], status: :unprocessable_entity)
    end
  end

  private

  def list_params
    params.permit(:organization_id, :page, :per, :name, :status)
  end

  def permit_params
    # system: agent system prompt
    # include_base_tool_rules: include default memory tools; when true, it adds
    #   => tools: ["memory_insert", "conversation_search", "memory_replace"]
    # tools: user-defined available tools, e.g. ["websearch", "memory_insert"]
    # tool_rules: allow / deny tools, e.g. [{ type: "allow", tool_name: "websearch" }], default is allow all tools
    # memory_blocks: user-defined predefined agent memory
    #   => reference: https://docs.letta.com/guides/agents/memory-blocks/#what-are-memory-blocks
    params.permit(
      :name,
      :system,
      :include_base_tool_rules,
      tools: [],
      memory_blocks: [ :label, :value ],
      tool_rules: [ :type, :tool_name ],
      llm_config: [ :model, :model_endpoint_type, :model_endpoint, :context_window ],
      embedding_config: [ :embedding_model, :embedding_endpoint_type, :embedding_endpoint, :embedding_dim ]
    )
  end
end
