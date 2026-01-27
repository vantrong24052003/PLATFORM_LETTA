# frozen_string_literal: true

require "rails_helper"

RSpec.describe "Letta::Agents", type: :request do
  describe "GET /letta/agents" do
    let(:organization) { create(:organization, secret_key: "test_key_123456789012345") }
    let!(:agents) { create_list(:agent, 3, organization:, is_deleted: false) }
    let(:headers) { { "X-Organization-Key" => organization.secret_key } }

    context "with valid authentication" do
      it "returns list of agents" do
        get "/letta/agents", headers:

        expect(response).to have_http_status(:ok)
        json = JSON.parse(response.body)
        expect(json["data"]["agents"].count).to eq(3)
      end

      it "returns pagination info" do
        get "/letta/agents", headers:

        json = JSON.parse(response.body)
        expect(json["data"]["pagination"]).to include("current_page", "total_count", "total_pages", "per_page")
      end

      it "returns agents with correct structure" do
        get "/letta/agents", headers:

        json = JSON.parse(response.body)
        agent = json["data"]["agents"].first

        expect(agent).to have_key("id")
        expect(agent).to have_key("name")
        expect(agent).to have_key("description")
        expect(agent).to have_key("system")
        expect(agent).to have_key("organization_id")
        expect(agent).to have_key("created_at")
        expect(agent).to have_key("updated_at")
        expect(agent).to have_key("status")
      end
    end

    context "without authentication" do
      it "returns 401" do
        get "/letta/agents"

        expect(response).to have_http_status(:unauthorized)
        json = JSON.parse(response.body)
        expect(json["error"]).to eq("Unauthorized")
        expect(json["data"]).to eq("Missing X-Organization-Key header")
      end
    end

    context "with invalid API key" do
      it "returns 401" do
        headers = { "X-Organization-Key" => "invalid_key" }
        get "/letta/agents", headers:

        expect(response).to have_http_status(:unauthorized)
        json = JSON.parse(response.body)
        expect(json["error"]).to eq("Unauthorized")
        expect(json["data"]).to eq("Invalid API key")
      end
    end

    context "filtering" do
      let!(:special_agent) { create(:agent, organization:, name: "Special Bot", is_deleted: false) }

      it "filters by name" do
        get "/letta/agents?name=Special", headers:

        json = JSON.parse(response.body)
        expect(json["data"]["agents"].count).to eq(1)
        expect(json["data"]["agents"][0]["name"]).to eq("Special Bot")
      end

      it "filters by status active" do
        create(:agent, organization:, name: "Deleted", is_deleted: true)

        get "/letta/agents?status=active", headers:

        json = JSON.parse(response.body)
        expect(json["data"]["agents"].count).to eq(4)
        expect(json["data"]["agents"].all? { |a| a["status"] == "active" }).to be true
      end

      it "filters by status inactive" do
        deleted_agent = create(:agent, organization:, name: "Deleted", is_deleted: true)

        get "/letta/agents?status=inactive", headers:

        json = JSON.parse(response.body)
        expect(json["data"]["agents"].count).to eq(1)
        expect(json["data"]["agents"][0]["id"]).to eq(deleted_agent.id)
      end
    end

    context "pagination" do
      before { create_list(:agent, 25, organization:, is_deleted: false) }

      it "paginates results" do
        get "/letta/agents?per=10", headers:

        json = JSON.parse(response.body)
        expect(json["data"]["agents"].count).to eq(10)
        expect(json["data"]["pagination"]["total_pages"]).to eq(3)
        expect(json["data"]["pagination"]["current_page"]).to eq(1)
      end

      it "returns page 2" do
        get "/letta/agents?page=2&per=10", headers:

        json = JSON.parse(response.body)
        expect(json["data"]["agents"].count).to eq(10)
        expect(json["data"]["pagination"]["current_page"]).to eq(2)
      end
    end

    context "organization scoping" do
      let(:other_org) { create(:organization, secret_key: "other_key_123456789012345") }
      let!(:other_agents) { create_list(:agent, 5, organization: other_org, is_deleted: false) }

      it "only returns agents for current organization" do
        get "/letta/agents", headers:

        json = JSON.parse(response.body)
        expect(json["data"]["agents"].count).to eq(3)
      end
    end
  end

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
