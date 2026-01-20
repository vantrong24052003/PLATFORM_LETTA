class Letta::StreamingMessagesController < ApplicationController
  include ActionController::Live

  def create
    service = Letta::StreamingMessagesService.new

    service.stream_message(permit_params) do |chunk|
      response.stream.write(chunk)
    end
  ensure
    response.stream.close
  end

  private

  def permit_params
    params.permit(:agent_id, :input)
  end
end
