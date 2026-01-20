# frozen_string_literal: true

module Letta
  class AgentService
    DEFAULT_LLM_CONFIG = {
      model: "GLM-4.7",
      model_endpoint_type: "openai",
      model_endpoint: "https://api.z.ai/api/coding/paas/v4",
      context_window: 128_000
    }.freeze

    DEFAULT_EMBEDDING_CONFIG = {
      embedding_model: "text-embedding-3-small",
      embedding_endpoint_type: "openai",
      embedding_endpoint: "https://api.z.ai/api/coding/paas/v4",
      embedding_dim: 1536
    }.freeze

    def create(params)
      body = {
        name: params[:name],
        system: params[:system],
        llm_config: DEFAULT_LLM_CONFIG,
        embedding_config: DEFAULT_EMBEDDING_CONFIG,
        memory_blocks: params[:memory_blocks],
        tools: params[:tools],
        tool_rules: params[:tool_rules],
        include_base_tool_rules: params[:include_base_tool_rules]
      }

      Integration::Letta::Util::HttpClient.post(path: Integration::Letta::Endpoints::AGENTS[:CREATE], body:)
    end
  end
end
