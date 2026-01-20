class Letta::StreamingMessagesService
  def stream_message(params, &block)
    path = Integration::Letta::Endpoints::MESSAGES[:STREAM_MESSAGE].call(params[:agent_id])
    body = { input: params[:input], stream_tokens: true }

    Integration::Letta::Util::HttpClient.post_stream(path:, body:, &block)
  end
end
