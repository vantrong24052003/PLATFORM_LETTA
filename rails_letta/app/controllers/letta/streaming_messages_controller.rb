# frozen_string_literal: true

class Letta::StreamingMessagesController < ApplicationController
  include ActionController::Live

  def create
    # SSE https://api.rubyonrails.org/classes/ActionController/Live/SSE.html
    response.headers["Content-Type"] = "text/event-stream"
    response.headers["Cache-Control"] = "no-cache"
    response.headers["X-Accel-Buffering"] = "no"

    sse = ActionController::Live::SSE.new(response.stream, retry: 300)

    Letta::StreamingMessages::Create.new(permit_params).call do |event|
      sse.write(event[:payload], event: event[:type])
    end
  ensure
    sse.close
  end

  private

  def permit_params
    params.permit(:agent_id, :input)
  end
end
