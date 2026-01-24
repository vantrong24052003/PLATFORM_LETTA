# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Letta::BotTemplates', type: :request do
  let(:org_id) { 'test_org' }
  let(:headers) { { 'Content-Type' => 'application/json' } }

  describe 'GET /letta/bot_templates' do
    let!(:template) { BotTemplate.create!(name: 'Existing', organization_id: org_id, system_prompt: 'Test') }

    it 'returns list of templates' do
      get('/letta/bot_templates', params: { organization_id: org_id }, headers:)

      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json['data'].size).to eq(1)
      expect(json['data'][0]['name']).to eq('Existing')
    end

    it 'returns error if organization_id missing' do
      get('/letta/bot_templates', headers:)
      expect(response).to have_http_status(:bad_request)
    end
  end

  describe 'POST /letta/bot_templates' do
    let(:valid_params) do
      {
        bot_template: {
          organization_id: org_id,
          name: 'New Bot',
          system_prompt: 'System Prompt',
          status: 'active',
        },
      }
    end

    context 'with valid params' do
      it 'creates a new BotTemplate' do
        expect {
          post '/letta/bot_templates', params: valid_params, as: :json
        }.to change(BotTemplate, :count).by(1)

        expect(response).to have_http_status(:created)
      end
    end

    context 'with invalid params' do
      it 'returns error' do
        post '/letta/bot_templates', params: { bot_template: { name: '' } }, as: :json
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
    context 'with complex params (tools, theme)' do
      let(:complex_params) do
        {
          bot_template: {
            organization_id: org_id,
            name: 'Complex Bot',
            system_prompt: 'X',
            status: 'active',
            tools: [ 'tool-1', 'tool-2' ],
            theme_config: { 'color' => 'blue' },
          },
        }
      end

      it 'saves arrays and hashes correctly' do
        post '/letta/bot_templates', params: complex_params, as: :json
        expect(response).to have_http_status(:created)

        json = JSON.parse(response.body)['data']
        expect(json['tools']).to eq([ 'tool-1', 'tool-2' ])
        expect(json['theme_config']).to eq({ 'color' => 'blue' })
      end
    end
  end

  describe 'GET /letta/bot_templates/:id' do
    let(:template) { BotTemplate.create!(name: 'Show', organization_id: org_id, system_prompt: 'Test') }

    it 'returns the template' do
      get("/letta/bot_templates/#{template.id}", headers:)
      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)['data']['id']).to eq(template.id)
    end

    it 'returns 404 if not found' do
      get("/letta/bot_templates/uuid-not-exist", headers:)
      expect(response).to have_http_status(:not_found)
    end
  end

  describe 'PUT /letta/bot_templates/:id' do
    let(:template) { BotTemplate.create!(name: 'Old', organization_id: org_id, system_prompt: 'Test') }
    let(:update_params) { { bot_template: { name: 'New Name' } } }

    it 'updates the template' do
      put "/letta/bot_templates/#{template.id}", params: update_params, as: :json
      expect(response).to have_http_status(:ok)
      expect(template.reload.name).to eq('New Name')
    end

    it 'returns 404 if not found' do
      put "/letta/bot_templates/uuid-not-exist", params: update_params, as: :json
      expect(response).to have_http_status(:not_found)
    end
  end

  describe 'DELETE /letta/bot_templates/:id' do
    let!(:template) { BotTemplate.create!(name: 'Del', organization_id: org_id, system_prompt: 'Test') }

    it 'deletes the template' do
      expect {
        delete "/letta/bot_templates/#{template.id}", headers:
      }.to change(BotTemplate, :count).by(-1)
      expect(response).to have_http_status(:no_content)
    end

    it 'returns 404 if not found' do
      delete("/letta/bot_templates/uuid-not-exist", headers:)
      expect(response).to have_http_status(:not_found)
    end
  end
end
