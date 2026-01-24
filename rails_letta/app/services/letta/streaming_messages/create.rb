# frozen_string_literal: true

class Letta::StreamingMessages::Create < ApplicationService
  def call
    stream_path = Integration::Letta::Endpoints::MESSAGES[:STREAM_MESSAGE].call(params[:agent_id])
    request_body = { input: params[:input], stream_tokens: true }

    buffer_and_yield_events(stream_path, request_body) do |event|
      yield event
    end
  rescue StandardError => e
    Rails.logger.error("Streaming Error: #{e.message}")
    yield({ type: :error, payload: { message: e.message } })
  end

  private

  def buffer_and_yield_events(path, body)
    buffer = +""

    Integration::Letta::Util::HttpClient.post_stream(path:, body:) do |chunk|
      buffer << chunk

      while (newline_index = buffer.index("\n"))
        line = buffer.slice!(0, newline_index + 1).strip
        next if line.empty?

        parse_sse_line(line) do |event|
          yield event
        end
      end
    end
  end

  def parse_sse_line(line)
    return unless line.start_with?("data:")

    data_string = line.delete_prefix("data:").strip
    return if data_string == "[DONE]"

    parse_json_and_yield_events(data_string) do |event|
      yield event
    end
  end

  def parse_json_and_yield_events(json_string)
    data = JSON.parse(json_string)

    content = extract_text_content(data)
    yield({ type: :content, payload: { content: } }) if content.present?

    yield({ type: :done, payload: { usage: data["usage"] } }) if data["usage"]
  rescue JSON::ParserError
  end

  def extract_text_content(data)
    return data["content"] if data["content"]

    choice = data.dig("choices", 0)
    choice&.dig("delta", "content") || choice&.dig("message", "content")
  end
end
