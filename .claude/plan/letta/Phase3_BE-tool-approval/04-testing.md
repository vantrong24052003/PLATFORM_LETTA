# Tool Approval - Testing

This document defines the testing strategy for tool approval workflow.

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

## 2. Unit Tests (RSpec)

### Model: ToolApproval

```ruby
RSpec.describe ToolApproval, type: :model do
  it { should validate_presence_of(:organization_id) }
  it { should validate_presence_of(:agent_id) }
  it { should validate_presence_of(:tool_name) }
  it { should validate_inclusion_of(:status).in_array(%w[pending approved denied]) }
end
```

### Service: Letta::Tools::Forwarder

```ruby
RSpec.describe Letta::Tools::Forwarder do
  it 'sends correct payload to customer domain' do
    # Test payload structure
  end

  it 'includes HMAC SHA-256 signature' do
    # Test signature calculation
  end

  it 'handles timeout errors' do
    # Test 10s timeout handling
  end
end
```

---

## 3. Request Tests

### POST /letta/approvals/:id/approve

```ruby
RSpec.describe 'Approvals', type: :request do
  describe 'POST /letta/approvals/:id/approve' do
    it 'returns 200 and resumes stream' do
      approval = create(:tool_approval, status: 'pending')

      post approve_letta_approval_path(approval)

      expect(response).to have_http_status(:ok)
      expect(approval.reload.status).to eq('approved')
    end

    it 'returns 403 for wrong organization' do
      approval = create(:tool_approval)
      other_user = create(:user, organization: create(:organization))

      sign_in other_user
      post approve_letta_approval_path(approval)

      expect(response).to have_http_status(:forbidden)
    end
  end
end
```

---

## 4. E2E Tests (Playwright)

- [ ] User triggers tool requiring approval
- [ ] Widget displays approval card
- [ ] User clicks "Approve" → agent continues
- [ ] User clicks "Deny" → agent stops

---

## 5. Running Tests

```bash
bundle exec rspec
COVERAGE=true bundle exec rspec
```

---

## Related

- [00-overview.md](./00-overview.md) - Feature overview
- [03-implementation.md](./03-implementation.md) - Implementation code
