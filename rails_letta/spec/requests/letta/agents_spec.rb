# frozen_string_literal: true

require 'rails_helper'

RSpec.describe "Letta::Agents", type: :request do
  describe "POST /letta/agents" do
    let(:valid_params) do
      {
        name: "Test Agent",
        system: "You are a helpful assistant",
        llm_config: {
          model: "gpt-4",
          model_endpoint_type: "openai",
          model_endpoint: "https://api.openai.com/v1",
          context_window: 8192,
        },
        embedding_config: {
          embedding_model: "text-embedding-ada-002",
          embedding_endpoint_type: "openai",
          embedding_endpoint: "https://api.openai.com/v1",
          embedding_dim: 1536,
        },
      }
    end

    let(:letta_response) do
      {
        "id" => "agent-123",
        "name" => "Test Agent",
        "system" => "You are a helpful assistant",
        "llm_config" => valid_params[:llm_config],
        "embedding_config" => valid_params[:embedding_config],
        "created_at" => "2024-01-24T10:00:00Z",
      }
    end

    context "with valid params" do
      before do
        allow(Integration::Letta::Util::HttpClient).to receive(:post).and_return(letta_response)
      end

      it "creates an agent via Letta API" do
        post "/letta/agents", params: valid_params, as: :json

        expect(response).to have_http_status(:created)
        json = JSON.parse(response.body)

        expect(json["data"]).to be_present
        expect(json["data"]["id"]).to eq("agent-123")
        expect(json["data"]["name"]).to eq("Test Agent")
        expect(json["data"]["system"]).to eq("You are a helpful assistant")
      end

      it "uses default config when llm_config not provided" do
        params_without_config = { name: "Simple Agent", system: "Test" }
        post "/letta/agents", params: params_without_config, as: :json

        expect(Integration::Letta::Util::HttpClient).to have_received(:post) do |args|
          payload = args[:body]
          expect(payload[:llm_config][:model]).to eq("GLM-4.7")
          expect(payload[:embedding_config][:embedding_model]).to eq("text-embedding-3-small")
        end
      end
    end

    context "with invalid params" do
      it "returns error when name is missing" do
        post "/letta/agents", params: { system: "Test" }, as: :json

        expect(response).to have_http_status(:unprocessable_entity)
        json = JSON.parse(response.body)

        expect(json["error"]).to eq("Validation failed")
        expect(json["data"]).to be_present
      end
    end

    context "when Letta API fails" do
      before do
        allow(Integration::Letta::Util::HttpClient).to receive(:post).and_raise(StandardError.new("API Error"))
      end

      it "returns error response" do
        post "/letta/agents", params: valid_params, as: :json

        expect(response).to have_http_status(:unprocessable_entity)
        json = JSON.parse(response.body)

        expect(json["error"]).to be_present
        expect(json["data"]).to include("API Error")
      end
    end
  end
end
