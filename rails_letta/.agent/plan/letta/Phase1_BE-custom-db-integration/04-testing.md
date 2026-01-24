# Custom DB Integration - Testing

**Feature**: Custom Database Schema for Letta Bot Templates  
**Status**: 🔴 Not Started  
**Parent**: [00-overview.md](./00-overview.md)

---

## Overview

This document defines the testing strategy for the custom DB integration feature.

**Coverage Goal**: 80%+ across all files

---

## Model Specs

### spec/models/letta/bot_template_spec.rb

```ruby
require 'rails_helper'

RSpec.describe Letta::BotTemplate, type: :model do
  describe 'associations' do
    it { should belong_to(:organization) }
    it { should have_many(:agent_mappings).dependent(:destroy) }
  end

  describe 'validations' do
    it { should validate_presence_of(:name) }
    it { should validate_presence_of(:system_prompt) }
    it { should validate_presence_of(:human_name) }
    it { should validate_presence_of(:persona_name) }
    it { should validate_length_of(:name).is_at_most(255) }
  end

  describe 'callbacks' do
    context 'before_validation' do
      it 'sets default human_name' do
        template = build(:bot_template, human_name: nil)
        template.valid?
        expect(template.human_name).to eq('User')
      end

      it 'sets default theme_config' do
        template = build(:bot_template, theme_config: nil)
        template.valid?
        expect(template.theme_config).to include('primaryColor' => '#3B82F6')
      end
    end
  end

  describe 'scopes' do
    describe '.recent' do
      it 'orders by created_at desc' do
        old = create(:bot_template, created_at: 2.days.ago)
        new = create(:bot_template, created_at: 1.day.ago)
        expect(described_class.recent).to eq([new, old])
      end
    end

    describe '.by_name' do
      it 'filters by name (case-insensitive)' do
        match = create(:bot_template, name: 'Customer Support')
        no_match = create(:bot_template, name: 'Sales Bot')
        expect(described_class.by_name('customer')).to include(match)
        expect(described_class.by_name('customer')).not_to include(no_match)
      end
    end
  end
end
```

---

### spec/models/letta/agent_mapping_spec.rb

```ruby
require 'rails_helper'

RSpec.describe Letta::AgentMapping, type: :model do
  describe 'associations' do
    it { should belong_to(:bot_template) }
    it { should belong_to(:organization) }
  end

  describe 'validations' do
    it { should validate_presence_of(:letta_agent_id) }
    it { should validate_presence_of(:user_id) }
    it { should validate_presence_of(:organization_id

) }
    it { should validate_uniqueness_of(:letta_agent_id) }
  end

  describe 'scopes' do
    describe '.active' do
      it 'returns mappings with letta_agent_id' do
        active = create(:agent_mapping, letta_agent_id: 'agent_123')
        expect(described_class.active).to include(active)
      end
    end

    describe '.for_user' do
      it 'filters by user_id' do
        user1_mapping = create(:agent_mapping, user_id: 1)
        user2_mapping = create(:agent_mapping, user_id: 2)
        expect(described_class.for_user(1)).to include(user1_mapping)
        expect(described_class.for_user(1)).not_to include(user2_mapping)
      end
    end
  end
end
```

---

## Request Specs

### spec/requests/letta/bot_templates_spec.rb

```ruby
require 'rails_helper'

RSpec.describe 'Letta::BotTemplates', type: :request do
  let(:organization) { create(:organization) }
  let(:user) { create(:user, organization: organization) }

  before { sign_in user }

  describe 'GET /letta/bot_templates' do
    it 'returns bot templates for current organization' do
      template = create(:bot_template, organization: organization)
      other_org_template = create(:bot_template)

      get letta_bot_templates_path
      expect(response).to have_http_status(:ok)
      
      json = JSON.parse(response.body)
      expect(json['data'].size).to eq(1)
      expect(json['data'][0]['id']).to eq(template.id)
    end

    it 'supports pagination' do
      create_list(:bot_template, 25, organization: organization)

      get letta_bot_templates_path, params: { page: 2, per_page: 10 }
      expect(response).to have_http_status(:ok)

      json = JSON.parse(response.body)
      expect(json['data'].size).to eq(10)
      expect(json['meta']['current_page']).to eq(2)
    end
  end

  describe 'GET /letta/bot_templates/:id' do
    it 'returns a single bot template' do
      template = create(:bot_template, organization: organization)

      get letta_bot_template_path(template)
      expect(response).to have_http_status(:ok)

      json = JSON.parse(response.body)
      expect(json['data']['id']).to eq(template.id)
    end

    it 'returns 404 for non-existent template' do
      get letta_bot_template_path(id: 99999)
      expect(response).to have_http_status(:not_found)
    end
  end

  describe 'POST /letta/bot_templates' do
    it 'creates a new bot template' do
      params = {
        bot_template: {
          name: 'New Bot',
          description: 'Test bot',
          system_prompt: 'You are helpful',
          human_name: 'User',
          persona_name: 'Bot'
        }
      }

      expect {
        post letta_bot_templates_path, params: params
      }.to change(Letta::BotTemplate, :count).by(1)

      expect(response).to have_http_status(:created)
    end

    it 'returns422 with invalid params' do
      params = { bot_template: { name: '' } }

      post letta_bot_templates_path, params: params
      expect(response).to have_http_status(:unprocessable_entity)

      json = JSON.parse(response.body)
      expect(json['errors']).to be_present
    end
  end

  describe 'PATCH /letta/bot_templates/:id' do
    it 'updates a bot template' do
      template = create(:bot_template, organization: organization)

      patch letta_bot_template_path(template), params: {
        bot_template: { name: 'Updated Name' }
      }

      expect(response).to have_http_status(:ok)
      expect(template.reload.name).to eq('Updated Name')
    end
  end

  describe 'DELETE /letta/bot_templates/:id' do
    it 'deletes a bot template' do
      template = create(:bot_template, organization: organization)

      expect {
        delete letta_bot_template_path(template)
      }.to change(Letta::BotTemplate, :count).by(-1)

      expect(response).to have_http_status(:no_content)
    end
  end
end
```

---

## Service Specs

### spec/services/letta/agent_service_spec.rb

```ruby
require 'rails_helper'

RSpec.describe Letta::AgentService do
  let(:bot_template) { create(:bot_template) }
  let(:user_id) { 1 }
  let(:service) { described_class.new(bot_template: bot_template, user_id: user_id) }

  describe '#get_or_create_agent' do
    context 'when agent mapping exists' do
      it 'returns existing letta_agent_id' do
        mapping = create(:agent_mapping,
          bot_template: bot_template,
          user_id: user_id,
          letta_agent_id: 'existing_123'
        )

        result = service.get_or_create_agent
        expect(result).to eq('existing_123')
      end
    end

    context 'when agent mapping does not exist' do
      it 'creates new agent via Letta API' do
        letta_client = instance_double(External::LettaService)
        allow(External::LettaService).to receive(:new).and_return(letta_client)
        allow(letta_client).to receive(:create_agent).and_return({ 'id' => 'new_agent_456' })

        expect {
          service.get_or_create_agent
        }.to change(Letta::AgentMapping, :count).by(1)
      end

      it 'stores agent mapping in database' do
        letta_client = instance_double(External::LettaService)
        allow(External::LettaService).to receive(:new).and_return(letta_client)
        allow(letta_client).to receive(:create_agent).and_return({ 'id' => 'new_789' })

        agent_id = service.get_or_create_agent

        mapping = Letta::AgentMapping.last
        expect(mapping.letta_agent_id).to eq('new_789')
        expect(mapping.user_id).to eq(user_id)
      end
    end

    context 'when Letta API fails' do
      it 'raises error and does not create mapping' do
        letta_client = instance_double(External::LettaService)
        allow(External::LettaService).to receive(:new).and_return(letta_client)
        allow(letta_client).to receive(:create_agent).and_raise(StandardError, 'API Error')

        expect {
          service.get_or_create_agent
        }.to raise_error(StandardError, 'API Error')

        expect(Letta::AgentMapping.count).to eq(0)
      end
    end
  end
end
```

---

## Integration Tests

N/A - Will be covered in Phase 4 (End-to-End Testing)

---

## Test Fixtures (FactoryBot)

### spec/factories/letta/bot_templates.rb

```ruby
FactoryBot.define do
  factory :bot_template, class: 'Letta::BotTemplate' do
    association :organization
    sequence(:name) { |n| "Bot Template #{n}" }
    description { 'A helpful chatbot' }
    system_prompt { 'You are a helpful assistant.' }
    human_name { 'User' }
    persona_name { 'Assistant' }
    theme_config do
      {
        primaryColor: '#3B82F6',
        botAvatarUrl: nil,
        bubbleIconUrl: nil,
        footerText: 'Powered by LeTTa'
      }
    end
  end
end
```

### spec/factories/letta/agent_mappings.rb

```ruby
FactoryBot.define do
  factory :agent_mapping, class: 'Letta::AgentMapping' do
    association :bot_template, factory: :bot_template
    association :organization
    user_id { 1 }
    sequence(:letta_agent_id) { |n| "agent_#{n}" }
  end
end
```

---

## Coverage Goals

| Component | Target Coverage |
|-----------|----------------|
| Models | 95%+ |
| Controllers | 90%+ |
| Services | 90%+ |
| Overall | 80%+ |

---

## Running Tests

```bash
# All tests
bundle exec rspec

# Specific file
bundle exec rspec spec/models/letta/bot_template_spec.rb

# Coverage report
COVERAGE=true bundle exec rspec
```

---

## Acceptance Criteria

- [ ] All model specs pass
- [ ] All request specs pass
- [ ] All service specs pass
- [ ] Code coverage >= 80%
- [ ] No pending/skipped tests
- [ ] FactoryBot factories work correctly
- [ ] Tests run in < 30 seconds
