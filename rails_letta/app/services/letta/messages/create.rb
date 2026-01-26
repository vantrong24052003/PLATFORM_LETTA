# frozen_string_literal: true

class Letta::Messages::Create < ApplicationService
  TIMEOUT = 300

  def call
    path = Integration::Letta::Endpoints::MESSAGES[:CREATE_MESSAGE].call(params[:agent_id])
    body = { input: params[:input] }

    response = Integration::Letta::Util::HttpClient.post(
      path:,
      body:,
      headers: { "Content-Type" => "application/json", "Accept" => "application/json" },
      read_timeout: TIMEOUT,
      open_timeout: TIMEOUT
    )
    { success: true, data: response }
  rescue StandardError => e
    { success: false, errors: e.message }
  end
end
