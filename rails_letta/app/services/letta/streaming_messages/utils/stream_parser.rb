# frozen_string_literal: true

module Letta::StreamingMessages::Utils
  class StreamParser
    DONE_MARKER = "[DONE]"

    def initialize
      @buffer = +""
      @current_event_type = :content
    end

    def process_chunk(chunk)
      @buffer << chunk

      while (newline_index = @buffer.index("\n"))
        line = @buffer.slice!(0, newline_index + 1).strip
        next if line.empty?

        process_line(line) do |event|
          yield event
        end
      end
    end

    private

    def process_line(line)
      if line.start_with?("event:")
        @current_event_type = line.delete_prefix("event:").strip.to_sym
      elsif line.start_with?("data:")
        data_string = line.delete_prefix("data:").strip
        return if data_string == DONE_MARKER

        begin
          json_data = JSON.parse(data_string)
          yield({ type: @current_event_type, data: json_data })
        rescue JSON::ParserError
          # Ignore malformed JSON lines
        end

        @current_event_type = :content # Reset to default
      end
    end
  end
end
