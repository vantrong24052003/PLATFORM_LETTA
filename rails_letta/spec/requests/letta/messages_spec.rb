# frozen_string_literal: true

require 'rails_helper'

RSpec.describe "Letta::Messages", type: :request do
  describe "POST /letta/messages" do
    let(:valid_params) do
      {
        agent_id: "agent-123",
        input: "Hello, how are you?",
      }
    end

    let(:letta_response) do
      {
        "id" => "msg-456",
        "agent_id" => "agent-123",
        "role" => "assistant",
        "text" => "I'm doing great! How can I help you today?",
        "created_at" => "2024-01-24T10:00:00Z",
        "tool_calls" => [],
      }
    end

    context "with valid params" do
      before do
        allow(Integration::Letta::Util::HttpClient).to receive(:post).and_return(letta_response)
      end

      it "creates a message via Letta API" do
        post "/letta/messages", params: valid_params, as: :json

        expect(response).to have_http_status(:created)
        json = JSON.parse(response.body)

        expect(json["data"]).to be_present
        expect(json["data"]["id"]).to eq("msg-456")
        expect(json["data"]["text"]).to eq("I'm doing great! How can I help you today?")
        expect(json["data"]["role"]).to eq("assistant")
      end

      it "sends correct payload to Letta API" do
        post "/letta/messages", params: valid_params, as: :json

        expect(Integration::Letta::Util::HttpClient).to have_received(:post).with(
          hash_including(
            path: anything,
            body: { input: "Hello, how are you?" }
          )
        )
      end
    end

    context "when Letta API fails" do
      before do
        allow(Integration::Letta::Util::HttpClient).to receive(:post).and_raise(StandardError.new("Connection timeout"))
      end

      it "returns error response" do
        post "/letta/messages", params: valid_params, as: :json

        expect(response).to have_http_status(:unprocessable_entity)
        json = JSON.parse(response.body)

        expect(json["error"]).to eq("Message creation failed")
        expect(json["data"]).to include("Connection timeout")
      end
    end
  end
end
