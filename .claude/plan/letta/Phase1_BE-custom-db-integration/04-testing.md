# Custom DB Integration - Testing

This document defines the testing strategy for bot template management.

**Coverage Goal**: 80%+

---

## 1. Coverage Goals

| Component | Target Coverage |
|-----------|-----------------|
| Models | 95%+ |
| Controllers | 90%+ |
| Services | 90%+ |
| Overall | 80%+ |

---

## 2. Model Specs

### spec/models/letta/bot_template_spec.rb

```ruby
# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Letta::BotTemplate, type: :model do
  describe 'associations' do
    it { should have_many(:agent_mappings).dependent(:destroy) }
  end

  describe 'validations' do
    subject { build(:letta_bot_template) }

    it { should validate_presence_of(:name) }
    it { should validate_presence_of(:system_prompt) }
    it { should validate_presence_of(:organization_id) }
    it { should validate_inclusion_of(:status).in_array(%w[active inactive]) }
  end

  describe 'scopes' do
    describe '.active' do
      it 'returns only active templates' do
        active = create(:letta_bot_template, status: 'active')
        inactive = create(:letta_bot_template, status: 'inactive')

        expect(described_class.active).to include(active)
        expect(described_class.active).not_to include(inactive)
      end
    end

    describe '.for_organization' do
      it 'filters by organization_id' do
        org1 = create(:letta_bot_template, organization_id: 'org-1')
        org2 = create(:letta_bot_template, organization_id: 'org-2')

        expect(described_class.for_organization('org-1')).to include(org1)
        expect(described_class.for_organization('org-1')).not_to include(org2)
      end
    end
  end
end
```

### spec/models/letta/agent_mapping_spec.rb

```ruby
# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Letta::AgentMapping, type: :model do
  describe 'associations' do
    it { should belong_to(:bot_template).class_name('Letta::BotTemplate') }
  end

  describe 'validations' do
    subject { build(:letta_agent_mapping) }

    it { should validate_presence_of(:organization_id) }
    it { should validate_presence_of(:customer_user_id) }
    it { should validate_presence_of(:letta_agent_id) }
    it { should validate_uniqueness_of(:letta_agent_id) }
  end

  describe 'scopes' do
    describe '.for_user' do
      it 'filters by customer_user_id' do
        user1 = create(:letta_agent_mapping, customer_user_id: 'user-1')
        user2 = create(:letta_agent_mapping, customer_user_id: 'user-2')

        expect(described_class.for_user('user-1')).to include(user1)
        expect(described_class.for_user('user-1')).not_to include(user2)
      end
    end
  end
end
```

---

## 3. Request Specs

### spec/requests/letta/bot_templates_spec.rb

```ruby
# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Letta::BotTemplates', type: :request do
  let(:organization) { create(:organization) }
  let(:user) { create(:user, organization: organization) }

  before { sign_in user }

  describe 'GET /letta/bot_templates' do
    it 'returns bot templates for current organization' do
      template = create(:letta_bot_template, organization: organization)
      other = create(:letta_bot_template, organization: create(:organization))

      get letta.bot_templates_path, as: :json

      expect(response).to have_http_status(:ok)

      json = JSON.parse(response.body)
      expect(json['data'].size).to eq(1)
      expect(json['data'][0]['id']).to eq(template.id)
    end

    it 'supports pagination' do
      create_list(:letta_bot_template, 25, organization: organization)

      get letta.bot_templates_path, params: { page: 2, per_page: 10 }, as: :json

      expect(response).to have_http_status(:ok)

      json = JSON.parse(response.body)
      expect(json['data'].size).to eq(10)
      expect(json['meta']['current_page']).to eq(2)
    end
  end

  describe 'GET /letta/bot_templates/:id' do
    it 'returns a single bot template' do
      template = create(:letta_bot_template, organization: organization)

      get letta.bot_template_path(template), as: :json

      expect(response).to have_http_status(:ok)

      json = JSON.parse(response.body)
      expect(json['data']['id']).to eq(template.id)
    end

    it 'returns 404 for non-existent template' do
      get letta.bot_template_path(id: SecureRandom.uuid), as: :json

      expect(response).to have_http_status(:not_found)
    end
  end

  describe 'POST /letta/bot_templates' do
    it 'creates a new bot template' do
      params = {
        bot_template: {
          name: 'New Bot',
          system_prompt: 'You are helpful',
          tools: ['search'],
          source_ids: [],
          theme_config: { primaryColor: '#000' }
        }
      }

      expect {
        post letta.bot_templates_path, params: params, as: :json
      }.to change(Letta::BotTemplate, :count).by(1)

      expect(response).to have_http_status(:created)
    end

    it 'returns 422 with invalid params' do
      params = { bot_template: { name: '' } }

      post letta.bot_templates_path, params: params, as: :json

      expect(response).to have_http_status(:unprocessable_entity)

      json = JSON.parse(response.body)
      expect(json['error']).to be_present
    end
  end

  describe 'PATCH /letta/bot_templates/:id' do
    it 'updates a bot template' do
      template = create(:letta_bot_template, organization: organization)

      patch letta.bot_template_path(template),
        params: { bot_template: { name: 'Updated Name' } },
        as: :json

      expect(response).to have_http_status(:ok)
      expect(template.reload.name).to eq('Updated Name')
    end
  end

  describe 'DELETE /letta/bot_templates/:id' do
    it 'deletes a bot template' do
      template = create(:letta_bot_template, organization: organization)

      expect {
        delete letta.bot_template_path(template), as: :json
      }.to change(Letta::BotTemplate, :count).by(-1)

      expect(response).to have_http_status(:no_content)
    end
  end
end
```

---

## 4. Service Specs

### spec/services/letta/bot_templates/create_spec.rb

```ruby
# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Letta::BotTemplates::Create do
  describe '#call' do
    subject { described_class.new(params).call }

    let(:params) do
      {
        organization_id: 'org-123',
        name: 'Test Bot',
        system_prompt: 'You are helpful',
        tools: [],
        source_ids: [],
        theme_config: {}
      }
    end

    context 'with valid params' do
      it 'creates a bot template' do
        expect { subject }.to change(Letta::BotTemplate, :count).by(1)

        result = subject
        expect(result[:success]).to be true
        expect(result[:data]).to be_a(Letta::BotTemplate)
      end
    end

    context 'with invalid params' do
      let(:params) { { name: '' } }

      it 'returns error' do
        result = subject

        expect(result[:success]).to be false
        expect(result[:error][:code]).to eq('validation_failed')
      end
    end
  end
end
```

### spec/services/letta/bot_templates/update_spec.rb

```ruby
# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Letta::BotTemplates::Update do
  describe '#call' do
    subject { described_class.new(params).call }

    let!(:template) { create(:letta_bot_template, name: 'Original') }
    let(:params) { { bot_template: template, name: 'Updated' } }

    context 'with valid params' do
      it 'updates the bot template' do
        result = subject

        expect(result[:success]).to be true
        expect(template.reload.name).to eq('Updated')
      end
    end

    context 'with invalid params' do
      let(:params) { { bot_template: template, name: '' } }

      it 'returns error' do
        result = subject

        expect(result[:success]).to be false
        expect(result[:error][:code]).to eq('validation_failed')
      end
    end
  end
end
```

---

## 5. Test Fixtures (FactoryBot)

### spec/factories/letta/bot_templates.rb

```ruby
# frozen_string_literal: true

FactoryBot.define do
  factory :letta_bot_template, class: 'Letta::BotTemplate' do
    organization_id { 'org-123' }
    sequence(:name) { |n| "Bot Template #{n}" }
    greeting { 'Hello! How can I help you today?' }
    status { 'active' }
    system_prompt { 'You are a helpful assistant.' }
    tools { [] }
    source_ids { [] }
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
# frozen_string_literal: true

FactoryBot.define do
  factory :letta_agent_mapping, class: 'Letta::AgentMapping' do
    association :bot_template, factory: :letta_bot_template
    organization_id { 'org-123' }
    customer_user_id { 'user-123' }
    sequence(:letta_agent_id) { |n| "agent-#{n}" }
  end
end
```

---

## 6. Running Tests

```bash
# All tests
bundle exec rspec

# Specific file
bundle exec rspec spec/models/letta/bot_template_spec.rb

# Coverage report
COVERAGE=true bundle exec rspec

# View coverage report
open coverage/index.html
```

---

## Related

- [00-overview.md](./00-overview.md) - Feature overview
- [03-implementation.md](./03-implementation.md) - Implementation code
