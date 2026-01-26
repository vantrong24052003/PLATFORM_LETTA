# frozen_string_literal: true

class Letta::MessagesController < ApplicationController
  def create
    result = Letta::Messages::Create.new(permit_params).call

    if result[:success]
      render_success(response: result[:data], status: :created)
    else
      render_error(error: "Message creation failed", response: result[:errors], status: :unprocessable_entity)
    end
  end

  private

  def permit_params
    params.permit(:agent_id, :input)
  end
end
