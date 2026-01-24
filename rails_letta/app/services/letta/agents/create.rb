# frozen_string_literal: true

class Letta::Agents::Create < ApplicationService
  DEFAULT_LLM_CONFIG = {
    model: "GLM-4.7",
    model_endpoint_type: "openai",
    model_endpoint: "https://api.z.ai/api/coding/paas/v4",
    context_window: 128_000,
  }.freeze

  DEFAULT_EMBEDDING_CONFIG = {
    embedding_model: "text-embedding-3-small",
    embedding_endpoint_type: "openai",
    embedding_endpoint: "https://api.z.ai/api/coding/paas/v4",
    embedding_dim: 1536,
  }.freeze

  def call
    agent = Agent.new(params)

    response = Integration::Letta::Util::HttpClient.post(
      path: Integration::Letta::Endpoints::AGENTS[:CREATE_AGENT],
      body: build_payload(agent)
    )
    { success: true, data: response }
  rescue StandardError => e
    { success: false, errors: e.message }
  end

  private

  def build_payload(agent)
    {
      name: agent.name,
      system: agent.system,
      llm_config: agent.llm_config || DEFAULT_LLM_CONFIG,
      embedding_config: agent.embedding_config || DEFAULT_EMBEDDING_CONFIG,
      memory_blocks: agent.memory_blocks,
      tools: agent.tools,
      tool_rules: agent.tool_rules,
      include_base_tool_rules: agent.include_base_tool_rules,
    }
  end
end
