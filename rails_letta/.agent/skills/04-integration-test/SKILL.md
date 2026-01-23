---
name: 04-integration-test
description: "Phase 4: End-to-End Integration Testing (Rails)"
---

# Integration Testing Skill

## Overview
This skill guides you through **Phase 4**: Verifying the full loop from Widget to Backend to LeTTa Engine.

**Strict Rule**: Do NOT mock Service objects or Controller internals. We test the full stack. Use **VCR** for external HTTP calls.

## Test Stack
- **RSpec**: Testing Framework.
- **VCR**: Record & Replay HTTP interactions (fixtures).
- **WebMock**: Stub HTTP requests.
- **FactoryBot**: Data generation.

## Folder Structure (Strict Mapping)

Tests must mirror the `app/` structure exactly.

```text
spec/
├── factories/
│   └── letta/
│       ├── bot_templates.rb
│       └── agent_mappings.rb
├── requests/                 <-- Tests Controllers (Integration)
│   └── letta/
│       ├── bot_templates_spec.rb
│       └── streaming_messages_spec.rb
├── services/                 <-- Tests Business Logic
│   └── letta/
│       └── bot_service_spec.rb
└── lib/
    └── letta/
        └── client_spec.rb    <-- Tests HTTP Client with VCR
```

## Test Strategy

### 1. Setup VCR
**File**: `spec/support/vcr.rb`
```ruby
VCR.configure do |config|
  config.cassette_library_dir = "spec/fixtures/vcr_cassettes"
  config.hook_into :webmock
  config.filter_sensitive_data('<LETTA_API_KEY>') { ENV['LETTA_API_KEY'] }
end
```

### 2. Controller Specs (Requests)
**File**: `spec/requests/letta/bot_templates_spec.rb`
- **NO MOCKS**: Call `Letta::BotTemplatesController`.
- **Logic**: It calls `Letta::BotService`, which calls `Letta::Client`.
- **VCR**: Wrap execution in `VCR.use_cassette("letta/create_bot")`.

```ruby
RSpec.describe "Letta::BotTemplates", type: :request do
  describe "POST /letta/bot_templates" do
    it "creates a bot and persists it" do
      # Full stack execution
      post letta_bot_templates_path, params: { ... }, headers: { "X-Organization-ID" => "org-1" }
      expect(response).to have_http_status(:created)
      expect(Letta::BotTemplate.count).to eq(1)
    end
  end
end
```

### 3. Service Specs (Business Logic)
**File**: `spec/services/letta/bot_service_spec.rb`
- Verify `organization_id` isolation logic.
- Verify `get_or_create_agent` logic really calls the Client.

### 4. Client Specs (External API)
**File**: `spec/lib/letta/client_spec.rb`
- Use VCR to record REAL calls to the LeTTa Engine.
- Verify JSON payload construction matches LeTTa requirements exactly.

## Checklist
- [ ] Install `vcr`, `webmock`, `factory_bot_rails`.
- [ ] Configure `spec/support/vcr.rb`.
- [ ] Create Factories for `BotTemplate` and `AgentMapping`.
- [ ] Write Request Specs using VCR cassettes.
