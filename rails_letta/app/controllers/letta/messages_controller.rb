class Letta::MessagesController < ApplicationController
  def create
    response = Letta::MessagesService.new.create_message(permit_params)
    render_success(response:, status: :created)
  end

  private

  def permit_params
    params.permit(:agent_id, :input)
  end
end
