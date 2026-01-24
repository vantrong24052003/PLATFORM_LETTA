# frozen_string_literal: true

class Letta::StreamingMessagesController < ApplicationController
  include ActionController::Live

  def create
    response.headers["Content-Type"] = "text/event-stream"
    response.headers["Cache-Control"] = "no-cache"
    response.headers["X-Accel-Buffering"] = "no"

    Letta::StreamingMessages::Create.new(permit_params).call do |event|
      response.stream.write("event: #{event[:type]}\n")
      response.stream.write("data: #{event[:payload].to_json}\n\n")
    end
  ensure
    response.stream.close
  end

  private

  def permit_params
    params.permit(:agent_id, :input)
  end
end
