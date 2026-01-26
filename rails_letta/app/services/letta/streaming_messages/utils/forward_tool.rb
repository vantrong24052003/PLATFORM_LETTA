
class Letta::StreamingMessages::Utils::ForwardTool < ApplicationService
  CONTENT_TYPE = "application/json"

  def call
    return failure("Agent mapping not found for agent_id: #{params[:agent_id]}") unless find_agent_mapping
    return failure("No customer_domain configured for BotTemplate #{find_bot_template&.id}") unless find_bot_template&.customer_domain.present?
    return failure("No secret_key configured for Organization #{params[:organization_id]}") unless find_organization&.secret_key.present?

    perform_request
  rescue StandardError => e
    failure("Forwarding failed: #{e.message}")
  end

  private

  def perform_request
    result = Integration::Letta::Util::HttpClient.post(
      path: Integration::Letta::Endpoints::TOOLS[:EXECUTE],
      body: build_payload,
      headers: build_headers,
      base_url: find_bot_template.customer_domain
    )

    result["status"] == "success" ? success(result["data"]) : failure(result["error"] || "Unknown error from customer backend")
  end

  def build_payload
    @build_payload ||= {
      tool_name: params[:tool_data].dig("function", "name"),
      arguments: JSON.parse(params[:tool_data].dig("function", "arguments") || "{}"),
      context: { agent_id: params[:agent_id], user_id: find_agent_mapping.user_id }
    }
  end

  def build_headers
    {
      "Content-Type" => CONTENT_TYPE,
      "X-Letta-Signature" => OpenSSL::HMAC.hexdigest("SHA256", find_organization.secret_key, build_payload.to_json),
      "X-Organization-ID" => params[:organization_id]
    }
  end

  def find_agent_mapping
    @find_agent_mapping ||= AgentMapping.find_by(agent_id: params[:agent_id])
  end

  def find_bot_template
    @find_bot_template ||= BotTemplate.find_by(id: find_agent_mapping.bot_template_id)
  end

  def find_organization
    @find_organization ||= Organization.find_by(id: params[:organization_id])
  end

  def success(data)
    { success: true, data: data }
  end

  def failure(message)
    { success: false, error: message }
  end
end
