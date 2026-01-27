# Agent Search - Testing

This document defines the testing strategy for agent search functionality.

**Coverage Goal**: 80%+

---

## 1. Coverage Goals

| Component | Target Coverage |
|-----------|-----------------|
| Controllers | 90%+ |
| Services | 90%+ |
| Overall | 80%+ |

---

## 2. Controller Specs

```ruby
RSpec.describe Letta::AgentsController, type: :controller do
  describe 'GET #index' do
    it 'returns paginated agent list' do
      get :index, params: { page: 1, per_page: 20 }

      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json['meta']).to include('current_page', 'total_count')
    end

    it 'filters by keyword' do
      get :index, params: { keyword: 'support' }

      expect(response).to have_http_status(:ok)
    end
  end

  describe 'GET #show' do
    it 'returns agent details' do
      agent = create(:agent_mapping)

      get :show, params: { id: agent.letta_agent_id }

      expect(response).to have_http_status(:ok)
    end

    it 'returns 404 for non-existent agent' do
      get :show, params: { id: 'non-existent' }

      expect(response).to have_http_status(:not_found)
    end
  end
end
```

---

## 3. Service Specs

```ruby
RSpec.describe Letta::Agents::List do
  describe '#call' do
    it 'returns agents for organization' do
      result = described_class.new(organization_id: org.id).call

      expect(result[:success]).to be true
      expect(result[:data]).to be_an(Array)
    end

    it 'applies keyword filter' do
      result = described_class.new(organization_id: org.id, keyword: 'support').call

      expect(result[:data].all? { |a| a['name']&.include?('support') }).to be true
    end
  end
end
```

---

## 4. Running Tests

```bash
bundle exec rspec
COVERAGE=true bundle exec rspec
```

---

## Related

- [00-overview.md](./00-overview.md) - Feature overview
- [03-implementation.md](./03-implementation.md) - Implementation code
