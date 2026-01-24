# frozen_string_literal: true

class Letta::StreamingMessages::Create < ApplicationService
  def call
    mapping = AgentMapping.find_by(agent_id: params[:agent_id])
    unless mapping
      yield({ type: :error, payload: { message: "Agent not found or unauthorized" } })
      return
    end

    stream_path = Integration::Letta::Endpoints::MESSAGES[:STREAM_MESSAGE].call(params[:agent_id])
    request_body = { input: params[:input], stream_tokens: true }

    buffer_and_yield_events(stream_path, request_body) do |event|
      yield event
    end
  rescue StandardError => e
    Rails.logger.error("[Letta::StreamingMessages::Create] Error: #{e.message}")
    yield({ type: :error, payload: { message: e.message } })
  end

  private

  def buffer_and_yield_events(path, body)
    buffer = +""
    current_event_type = :content

    Integration::Letta::Util::HttpClient.post_stream(
      path:,
      body:,
      headers: { "Content-Type" => "application/json", "Accept" => "application/json" }
    ) do |chunk|
      buffer << chunk

      while (newline_index = buffer.index("\n"))
        line = buffer.slice!(0, newline_index + 1).strip
        next if line.empty?

        if line.start_with?("event:")
          current_event_type = line.delete_prefix("event:").strip.to_sym
        elsif line.start_with?("data:")
          data_string = line.delete_prefix("data:").strip
          next if data_string == "[DONE]"

          parse_json_and_yield_events(data_string, current_event_type) do |event|
            yield event
          end

          current_event_type = :content
        end
      end
    end
  end

  def parse_json_and_yield_events(json_string, event_type)
    data = JSON.parse(json_string)

    # If it's an error event from Letta, yield it directly
    if event_type == :error || data["message_type"] == "error"
      yield({ type: :error, payload: data })
      return
    end

    # Extract text content for delta updates
    content = extract_text_content(data)
    yield({ type: :content, payload: { content: } }) if content.present?

    # Check for usage/completion
    yield({ type: :done, payload: { usage: data["usage"] } }) if data["usage"]

    # Check for specific message types we might want to pass through
    if %w[thought tool_call].include?(data["message_type"])
      yield({ type: data["message_type"].to_sym, payload: data })
    end
  rescue JSON::ParserError => e
    Rails.logger.warn("[Letta::StreamingMessages::Create] JSON Parse Error: #{e.message}")
  end

  def extract_text_content(data)
    # Direct content
    return data["content"] if data["content"]

    # OpenAI-style delta
    choice = data.dig("choices", 0)
    choice&.dig("delta", "content") || choice&.dig("message", "content")
  end
end
