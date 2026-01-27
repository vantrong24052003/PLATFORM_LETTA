# Agent Search - Testing Strategy

**Status**: 🟡 **PLANNED**
**Coverage Target**: 100%

---

## 1. Test Structure

```
rails_letta/spec/
├── controllers/
│   └── letta/
│       └── agents_controller_spec.rb      # NEW
├── services/
│   └── letta/
│       └── agents/
│           ├── list_spec.rb               # NEW
│           ├── get_spec.rb                # NEW
│           └── create_spec.rb             # EXISTS
└── fixtures/
    └── letta/
        └── agents.yml                     # NEW (if needed)
```

---

## 2. Controller Tests: `agents_controller_spec.rb`

**Location**: `spec/controllers/letta/agents_controller_spec.rb`

```ruby
# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Letta::AgentsController, type: :controller do
  let(:organization) { create(:organization) }
  let(:agent_mapping) { create(:agent_mapping, organization: organization) }
  let(:agent_id) { agent_mapping.letta_agent_id }

  describe 'GET #index' do
    context 'with valid params' do
      let(:valid_params) do
        {
          organization_id: organization.id,
          page: 1,
          per_page: 20
        }
      end

      before do
        allow(Letta::Agents::List).to receive_message_call(
          success: true,
          data: [],
          meta: { current_page: 1, total_pages: 1, total_count: 0, per_page: 20 }
        )
      end

      it 'returns success' do
        get :index, params: valid_params
        expect(response).to have_http_status(:ok)
      end

      it 'calls List service' do
        expect(Letta::Agents::List).to receive(:new).with(valid_params).and_call_original
        get :index, params: valid_params
      end
    end

    context 'with search params' do
      it 'passes keyword to service' do
        params = { organization_id: organization.id, keyword: 'support' }
        expect(Letta::Agents::List).to receive(:new).with(hash_including(keyword: 'support'))
        get :index, params: params
      end

      it 'passes date range to service' do
        params = {
          organization_id: organization.id,
          from_date: '2025-01-01',
          to_date: '2025-01-31'
        }
        expect(Letta::Agents::List).to receive(:new).with(hash_including(from_date: '2025-01-01', to_date: '2025-01-31'))
        get :index, params: params
      end
    end

    context 'without organization_id' do
      it 'returns bad request' do
        get :index, params: {}
        expect(response).to have_http_status(:bad_request)
      end
    end
  end

  describe 'GET #show' do
    context 'agent exists in organization' do
      before do
        allow(Letta::Agents::Get).to receive_message_call(
          success: true,
          data: { id: agent_id, name: 'Test Agent' }
        )
      end

      it 'returns success' do
        get :show, params: { id: agent_id, organization_id: organization.id }
        expect(response).to have_http_status(:ok)
      end

      it 'returns agent data' do
        get :show, params: { id: agent_id, organization_id: organization.id }
        json = JSON.parse(response.body)
        expect(json['success']).to be true
        expect(json['data']['id']).to eq agent_id
      end
    end

    context 'agent not found' do
      before do
        allow(Letta::Agents::Get).to receive_message_call(
          success: false,
          error: 'Agent not found'
        )
      end

      it 'returns not found' do
        get :show, params: { id: 'non-existent', organization_id: organization.id }
        expect(response).to have_http_status(:not_found)
      end
    end

    context 'agent in different organization' do
      let(:other_org) { create(:organization) }

      before do
        allow(Letta::Agents::Get).to receive_message_call(
          success: false,
          error: 'Agent not found'
        )
      end

      it 'returns not found' do
        get :show, params: { id: agent_id, organization_id: other_org.id }
        expect(response).to have_http_status(:not_found)
      end
    end
  end
end
```

---

## 3. Service Tests: `list_spec.rb`

**Location**: `spec/services/letta/agents/list_spec.rb`

```ruby
# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Letta::Agents::List, type: :service do
  let(:organization) { create(:organization) }
  let(:service_params) do
    {
      organization_id: organization.id,
      page: 1,
      per_page: 20
    }
  end

  describe '#call' do
    context 'with valid params' do
      let!(:mappings) { create_list(:agent_mapping, 3, organization: organization) }
      let(:letta_agents) do
        mappings.map do |m|
          {
            'id' => m.letta_agent_id,
            'name' => "Agent #{m.id}",
            'description' => 'Test description',
            'created_at' => 1.day.ago.iso8601
          }
        end
      end

      before do
        allow(Integration::Letta::Util::HttpClient).to receive(:get).and_return(letta_agents)
      end

      it 'returns success' do
        result = described_class.new(service_params).call
        expect(result[:success]).to be true
      end

      it 'returns agents' do
        result = described_class.new(service_params).call
        expect(result[:data].count).to eq 3
      end

      it 'includes pagination meta' do
        result = described_class.new(service_params).call
        expect(result[:meta]).to include(:current_page, :total_pages, :total_count, :per_page)
      end
    end

    context 'with keyword search' do
      let!(:mappings) { create_list(:agent_mapping, 3, organization: organization) }
      let(:letta_agents) do
        [
          { 'id' => '1', 'name' => 'Support Bot', 'description' => 'Helps customers', 'created_at' => 1.day.ago.iso8601 },
          { 'id' => '2', 'name' => 'Sales Agent', 'description' => 'Handles sales', 'created_at' => 1.day.ago.iso8601 },
          { 'id' => '3', 'name' => 'Support Team Lead', 'description' => 'Manages support', 'created_at' => 1.day.ago.iso8601 }
        ]
      end

      before do
        allow(Integration::Letta::Util::HttpClient).to receive(:get).and_return(letta_agents)
      end

      it 'filters by name' do
        result = described_class.new(service_params.merge(keyword: 'Support')).call
        expect(result[:data].count).to eq 2
        expect(result[:data].map { |a| a['name'] }).to include('Support Bot', 'Support Team Lead')
      end

      it 'filters by description' do
        result = described_class.new(service_params.merge(keyword: 'sales')).call
        expect(result[:data].count).to eq 1
        expect(result[:data].first['name']).to eq 'Sales Agent'
      end

      it 'is case insensitive' do
        result = described_class.new(service_params.merge(keyword: 'SUPPORT')).call
        expect(result[:data].count).to eq 2
      end
    end

    context 'with date range filter' do
      let!(:mappings) { create_list(:agent_mapping, 3, organization: organization) }
      let(:letta_agents) do
        [
          { 'id' => '1', 'name' => 'Agent 1', 'created_at' => '2025-01-10T00:00:00Z' },
          { 'id' => '2', 'name' => 'Agent 2', 'created_at' => '2025-01-20T00:00:00Z' },
          { 'id' => '3', 'name' => 'Agent 3', 'created_at' => '2025-02-01T00:00:00Z' }
        ]
      end

      before do
        allow(Integration::Letta::Util::HttpClient).to receive(:get).and_return(letta_agents)
      end

      it 'filters from date' do
        result = described_class.new(service_params.merge(from_date: '2025-01-15')).call
        expect(result[:data].count).to eq 2
      end

      it 'filters to date' do
        result = described_class.new(service_params.merge(to_date: '2025-01-25')).call
        expect(result[:data].count).to eq 2
      end

      it 'filters within range' do
        result = described_class.new(service_params.merge(from_date: '2025-01-15', to_date: '2025-01-25')).call
        expect(result[:data].count).to eq 1
        expect(result[:data].first['id']).to eq '2'
      end
    end

    context 'with sorting' do
      let!(:mappings) { create_list(:agent_mapping, 3, organization: organization) }
      let(:letta_agents) do
        [
          { 'id' => '1', 'name' => 'Charlie', 'created_at' => '2025-01-01T00:00:00Z' },
          { 'id' => '2', 'name' => 'Alpha', 'created_at' => '2025-01-03T00:00:00Z' },
          { 'id' => '3', 'name' => 'Beta', 'created_at' => '2025-01-02T00:00:00Z' }
        ]
      end

      before do
        allow(Integration::Letta::Util::HttpClient).to receive(:get).and_return(letta_agents)
      end

      it 'sorts by name asc' do
        result = described_class.new(service_params.merge(sort_by: 'name', sort_order: 'asc')).call
        expect(result[:data].map { |a| a['name'] }).to eq ['Alpha', 'Beta', 'Charlie']
      end

      it 'sorts by name desc' do
        result = described_class.new(service_params.merge(sort_by: 'name', sort_order: 'desc')).call
        expect(result[:data].map { |a| a['name'] }).to eq ['Charlie', 'Beta', 'Alpha']
      end

      it 'sorts by created_at desc (default)' do
        result = described_class.new(service_params).call
        expect(result[:data].map { |a| a['id'] }).to eq ['2', '3', '1']
      end
    end

    context 'with pagination' do
      let!(:mappings) { create_list(:agent_mapping, 25, organization: organization) }
      let(:letta_agents) do
        (1..25).map { |i| { 'id' => i.to_s, 'name' => "Agent #{i}", 'created_at' => 1.day.ago.iso8601 } }
      end

      before do
        allow(Integration::Letta::Util::HttpClient).to receive(:get).and_return(letta_agents)
      end

      it 'returns first page' do
        result = described_class.new(service_params.merge(per_page: 10, page: 1)).call
        expect(result[:data].count).to eq 10
        expect(result[:meta][:current_page]).to eq 1
      end

      it 'returns second page' do
        result = described_class.new(service_params.merge(per_page: 10, page: 2)).call
        expect(result[:data].count).to eq 10
        expect(result[:meta][:current_page]).to eq 2
      end

      it 'returns third page with remaining items' do
        result = described_class.new(service_params.merge(per_page: 10, page: 3)).call
        expect(result[:data].count).to eq 5
      end

      it 'respects max per page' do
        result = described_class.new(service_params.merge(per_page: 200)).call
        expect(result[:meta][:per_page]).to eq 100
      end
    end

    context 'when organization has no agents' do
      before do
        allow(Integration::Letta::Util::HttpClient).to receive(:get).and_return([])
      end

      it 'returns empty array' do
        result = described_class.new(service_params).call
        expect(result[:success]).to be true
        expect(result[:data]).to eq []
      end

      it 'returns zero counts in meta' do
        result = described_class.new(service_params).call
        expect(result[:meta][:total_count]).to eq 0
      end
    end

    context 'when Letta API fails' do
      before do
        allow(Integration::Letta::Util::HttpClient).to receive(:get).and_raise(StandardError.new('API Error'))
      end

      it 'returns error' do
        result = described_class.new(service_params).call
        expect(result[:success]).to be false
        expect(result[:error]).to eq 'Failed to fetch agents'
      end
    end
  end
end
```

---

## 4. Service Tests: `get_spec.rb`

**Location**: `spec/services/letta/agents/get_spec.rb`

```ruby
# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Letta::Agents::Get, type: :service do
  let(:organization) { create(:organization) }
  let(:agent_mapping) { create(:agent_mapping, organization: organization) }
  let(:agent_id) { agent_mapping.letta_agent_id }
  let(:letta_agent) do
    {
      'id' => agent_id,
      'name' => 'Test Agent',
      'description' => 'A test agent',
      'system' => 'You are helpful'
    }
  end

  describe '#call' do
    context 'agent exists in organization' do
      before do
        allow(Integration::Letta::Util::HttpClient).to receive(:get).and_return(letta_agent)
      end

      it 'returns success' do
        result = described_class.new(id: agent_id, organization_id: organization.id).call
        expect(result[:success]).to be true
      end

      it 'returns agent data' do
        result = described_class.new(id: agent_id, organization_id: organization.id).call
        expect(result[:data]['id']).to eq agent_id
        expect(result[:data]['name']).to eq 'Test Agent'
      end
    end

    context 'agent not in organization' do
      let(:other_org) { create(:organization) }

      it 'returns not found' do
        result = described_class.new(id: agent_id, organization_id: other_org.id).call
        expect(result[:success]).to be false
        expect(result[:error]).to eq 'Agent not found'
      end
    end

    context 'missing organization_id' do
      it 'returns error' do
        result = described_class.new(id: agent_id).call
        expect(result[:success]).to be false
        expect(result[:error]).to eq 'organization_id is required'
      end
    end

    context 'missing id' do
      it 'returns error' do
        result = described_class.new(organization_id: organization.id).call
        expect(result[:success]).to be false
        expect(result[:error]).to eq 'id is required'
      end
    end

    context 'Letta API fails' do
      before do
        allow(Integration::Letta::Util::HttpClient).to receive(:get).and_raise(StandardError.new('API Error'))
      end

      it 'returns error' do
        result = described_class.new(id: agent_id, organization_id: organization.id).call
        expect(result[:success]).to be false
        expect(result[:error]).to eq 'Agent not found'
      end
    end
  end
end
```

---

## 5. Test Coverage Goals

| Component | Coverage Target | Notes |
|-----------|-----------------|-------|
| Controller | 100% | All branches |
| Services | 100% | All edge cases |
| Error Handling | 100% | API failures, invalid params |
| Organization Scoping | 100% | Security critical |

---

## 6. Test Execution

```bash
# Run all agent-related tests
bundle exec rspec spec/controllers/letta/agents_controller_spec.rb
bundle exec rspec spec/services/letta/agents/

# Run with coverage
COVERAGE=true bundle exec rspec

# Run specific test
bundle exec rspec spec/services/letta/agents/list_spec.rb:23
```

---

## 7. Testing Checklist

- [ ] All controller specs pass
- [ ] All service specs pass
- [ ] Coverage >= 100%
- [ ] Edge cases covered (empty results, API failures)
- [ ] Organization scoping verified
- [ ] Pagination tested
- [ ] Filter combinations tested
- [ ] Sorting tested
