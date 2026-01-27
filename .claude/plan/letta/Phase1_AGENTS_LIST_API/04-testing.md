# Agents List API - Testing

## Test Structure

```
spec/
├── requests/
│   └── letta/
│       └── agents_spec.rb          # MODIFY - add index endpoint tests
├── services/
│   └── letta/
│       └── agents/
│           └── list_spec.rb        # NEW - Service unit tests
└── factories/
    └── agents_factory.rb           # MODIFY - ensure factory exists
```

## Test Coverage Goals
- **Target**: 100% coverage
- **Files to test**:
  - `app/services/letta/agents/list.rb`
  - `app/controllers/letta/agents_controller.rb` (index action)
  - `app/controllers/concerns/organization_authable.rb`

## Service Tests (list_spec.rb)

### Test Cases
1. **Happy Path**
   - Returns paginated list of agents
   - Returns correct pagination metadata
   - Serializes agents correctly

2. **Filtering**
   - Filters by name (partial match)
   - Filters by status (active)
   - Filters by status (inactive)
   - Combines multiple filters

3. **Pagination**
   - Uses default page (1)
   - Uses default per (20)
   - Respects custom page parameter
   - Respects custom per parameter
   - Caps per at MAX_PER (100)

4. **Organization Scoping**
   - Only returns agents for current organization
   - Does not return agents from other organizations

5. **Edge Cases**
   - Empty result (no agents)
   - Invalid page number (negative)
   - Invalid per number (zero, negative)

### Template
```ruby
# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Letta::Agents::List do
  let(:organization) { create(:organization) }
  let(:other_org) { create(:organization) }

  before do
    create_list(:agent, 5, organization:, name: 'Test Agent')
    create_list(:agent, 3, organization: other_org, name: 'Other Agent')
  end

  describe '#call' do
    context 'with valid params' do
      it 'returns success with data' do
        result = described_class.new(
          organization_id: organization.id
        ).call

        expect(result[:success]).to be true
        expect(result[:data].count).to eq(5)
      end

      it 'returns pagination metadata' do
        result = described_class.new(
          organization_id: organization.id,
          page: 1,
          per: 10
        ).call

        expect(result[:pagination]).to include(
          current_page: 1,
          total_count: 5
        )
      end
    end

    context 'organization scoping' do
      it 'only returns agents for current organization' do
        result = described_class.new(
          organization_id: organization.id
        ).call

        agent_names = result[:data].map { |a| a[:name] }
        expect(agent_names).to all include('Test')
        expect(agent_names).to_not include('Other Agent')
      end
    end

    context 'filtering by name' do
      before do
        create(:agent, organization:, name: 'Special Agent')
      end

      it 'returns partial matches' do
        result = described_class.new(
          organization_id: organization.id,
          name: 'Special'
        ).call

        expect(result[:data].count).to eq(1)
        expect(result[:data][0][:name]).to eq('Special Agent')
      end
    end

    context 'pagination' do
      before { create_list(:agent, 25, organization:) }

      it 'uses default per of 20' do
        result = described_class.new(
          organization_id: organization.id
        ).call

        expect(result[:data].count).to eq(20)
        expect(result[:pagination][:current_page]).to eq(1)
        expect(result[:pagination][:total_pages]).to eq(2)
      end

      it 'respects custom per parameter' do
        result = described_class.new(
          organization_id: organization.id,
          per: 10
        ).call

        expect(result[:data].count).to eq(10)
        expect(result[:pagination][:total_pages]).to eq(4)
      end

      it 'caps per at MAX_PER' do
        result = described_class.new(
          organization_id: organization.id,
          per: 200
        ).call

        expect(result[:pagination][:per_page]).to eq(100)
      end
    end

    context 'edge cases' do
      it 'handles empty results' do
        empty_org = create(:organization)
        result = described_class.new(
          organization_id: empty_org.id
        ).call

        expect(result[:data]).to eq([])
        expect(result[:pagination][:total_count]).to eq(0)
      end
    end
  end
end
```

## Controller Tests (agents_spec.rb)

### Test Cases
1. **Authentication**
   - Returns 401 without API key
   - Returns 401 with invalid API key
   - Returns 200 with valid API key

2. **Happy Path**
   - Returns list of agents
   - Returns pagination metadata
   - Returns correct JSON structure

3. **Filtering**
   - Name filter works via query params
   - Status filter works via query params

4. **Pagination**
   - Page parameter works
   - Per parameter works

### Template
```ruby
# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Letta::Agents', type: :request do
  describe 'GET /letta/agents' do
    let(:organization) { create(:organization, secret_key: 'test_key_123456789012345') }
    let!(:agents) { create_list(:agent, 3, organization:) }
    let(:headers) { { 'X-Organization-Key' => organization.secret_key } }

    context 'with valid authentication' do
      it 'returns list of agents' do
        get '/letta/agents', headers:

        expect(response).to have_http_status(:ok)
        json = JSON.parse(response.body)
        expect(json['data']['agents'].count).to eq(3)
      end

      it 'returns pagination info' do
        get '/letta/agents', headers:

        json = JSON.parse(response.body)
        expect(json['data']['pagination']).to include('current_page', 'total_count')
      end
    end

    context 'without authentication' do
      it 'returns 401' do
        get '/letta/agents'

        expect(response).to have_http_status(:unauthorized)
        json = JSON.parse(response.body)
        expect(json['error']).to eq('Unauthorized')
      end
    end

    context 'with invalid API key' do
      it 'returns 401' do
        headers = { 'X-Organization-Key' => 'invalid_key' }
        get '/letta/agents', headers:

        expect(response).to have_http_status(:unauthorized)
      end
    end

    context 'filtering' do
      let!(:special_agent) { create(:agent, organization:, name: 'Special Bot') }

      it 'filters by name' do
        get '/letta/agents?name=Special', headers:

        json = JSON.parse(response.body)
        expect(json['data']['agents'].count).to eq(1)
        expect(json['data']['agents'][0]['name']).to eq('Special Bot')
      end
    end

    context 'pagination' do
      before { create_list(:agent, 25, organization:) }

      it 'paginates results' do
        get '/letta/agents?per=10', headers:

        json = JSON.parse(response.body)
        expect(json['data']['agents'].count).to eq(10)
        expect(json['data']['pagination']['total_pages']).to eq(3)
      end
    end
  end
end
```

## Running Tests

```bash
# Run all tests
cd rails_letta
bundle exec rspec

# Run with coverage
COVERAGE=true bundle exec rspec

# Run specific test file
bundle exec rspec spec/services/letta/agents/list_spec.rb

# Run specific test line
bundle exec rspec spec/services/letta/agents/list_spec.rb:12
```

## Coverage Report

After running with `COVERAGE=true`, open:
```bash
open coverage/index.html
```

Target: 100% coverage for:
- `app/services/letta/agents/list.rb`
- `app/controllers/letta/agents_controller.rb`
- `app/controllers/concerns/organization_authable.rb`
