# frozen_string_literal: true

# Service Flow Description:
# User -> Rails API (StreamingMessagesController)
# -> Create Service
#    -> POST stream Letta Engine
#       -> Receive Chunk
#          -> StreamParser (Parse SSE/JSON)
#             -> handle_event
#                -> IF tool_call
#                   -> ForwardTool Service
#                      -> Request Customer Backend (HMAC Signed)
#                      -> IF Success: send_tool_return (Back to Letta)
#                      -> IF Fail/Skip: Yield tool_call to Frontend (Approval UI)
#                -> IF content (text delta)
#                   -> Yield to Frontend (Visual Stream)
#                -> IF usage
#                   -> Yield done
class Letta::StreamingMessages::Create < ApplicationService
  TOOL_CALL_TYPE = "tool_call"
  ERROR_TYPE = "error"
  MESSAGE_TYPES_TO_PASS = %w[thought tool_call].freeze
  CONTENT_TYPE = "application/json"

  def call(&block)

    parser = Letta::StreamingMessages::Utils::StreamParser.new

    Integration::Letta::Util::HttpClient.post_stream(
      path: build_stream_path,
      body: build_request_body,
      headers: { "Content-Type" => CONTENT_TYPE, "Accept" => "text/event-stream" }
    ) do |chunk|
      parser.process_chunk(chunk) do |event|
        handle_event(event, &block)
      end
    end
  rescue StandardError => e
    Rails.logger.error("[Letta::StreamingMessages::Create] Error: #{e.message}")
    yield({ type: :error, payload: { message: e.message } })
  end

  private

  def handle_event(event, &block)
    event_type = event[:type]   
    data = event[:data]

    # Phase1: if event_type is error or data["message_type"] is error, return error
    if event_type == :error || data["message_type"] == ERROR_TYPE
      return yield({ type: :error, payload: data })
    end

    # Phase2: if event_type is tool_call, forward tool to customer backend
    # Stop methods handle_event and handle process_tool_forwarding
    return if data["message_type"] == TOOL_CALL_TYPE && process_tool_forwarding(data)

    # Phase3: Get text delta to stream to UI.
    content = extract_text_content(data)
    yield({ type: :content, payload: { content: } }) if content.present?

    # Phase4: If has usage → done
    yield({ type: :done, payload: { usage: data["usage"] } }) if data["usage"].present?

    # Phase5: frontend can render chain-of-thought or tool-call.
    if MESSAGE_TYPES_TO_PASS.include?(data["message_type"])
      yield({ type: data["message_type"].to_sym, payload: data })
    end
  end

  def process_tool_forwarding(data)
    result = Letta::StreamingMessages::Utils::ForwardTool.new(
      agent_id: params[:agent_id],
      organization_id: params[:organization_id] || "org-unknown",
      tool_data: data
    ).call

    return false unless result[:success]

    send_tool_return(data, result[:data])
    true
  end

  def find_agent_mapping
    AgentMapping.find_by(agent_id: params[:agent_id])
  end

  def build_stream_path
    Integration::Letta::Endpoints::MESSAGES[:STREAM_MESSAGE].call(params[:agent_id])
  end

  def build_request_body
    {
      messages: [
        { role: "user", content: params[:input] }
      ],
      stream: true
    }
  end

  def build_error_payload(message)
    { type: :error, payload: { message: message } }
  end

  def send_tool_return(tool_call_data, tool_result)
    payload = {
      role: "tool",
      name: tool_call_data.dig("function", "name"),
      tool_call_id: tool_call_data["tool_call_id"],
      content: tool_result.to_json
    }

    Integration::Letta::Util::HttpClient.post(
      path: Integration::Letta::Endpoints::MESSAGES[:CREATE_MESSAGE].call(params[:agent_id]),
      body: payload.to_json,
      headers: { "Content-Type" => CONTENT_TYPE }
    )
  end

  def extract_text_content(data)
    return data["content"] if data["content"]

    choice = data.dig("choices", 0)
    choice&.dig("delta", "content") || choice&.dig("message", "content")
  end
end
