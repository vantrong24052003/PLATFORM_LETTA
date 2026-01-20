class Letta::MessagesService
  TIMEOUT = 300

  def create_message(params)
    path = Integration::Letta::Endpoints::MESSAGES[:CREATE_MESSAGE].call(params[:agent_id])
    body = { input: params[:input] }
    Integration::Letta::Util::HttpClient.post(
      path:,
      body:,
      read_timeout: TIMEOUT,
      open_timeout: TIMEOUT
    )
  end
end
