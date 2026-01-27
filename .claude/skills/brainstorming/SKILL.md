---
name: brainstorming
description: "You MUST use this before any creative work - creating features, building components, adding functionality, or modifying behavior. Explores user intent, requirements and design before implementation."
---

# Brainstorming Ideas Into Designs

## Overview

Help turn ideas into fully formed designs and specs through natural collaborative dialogue for the **rails_letta** project - a Rails API gateway that connects external customer systems to Letta (LLM agent framework).

**Project Context:**
- **rails_letta** is a Rails 8.1.1 API-only application
- Acts as a mediator/proxy between customer systems and Letta
- Handles SSE streaming for real-time agent responses
- Forwards tool execution with HMAC authentication
- Manages multi-tenant agents and bot templates

**Tech Stack:**
- Ruby on Rails 8.1.1 (API-only mode)
- PostgreSQL with multiple schemas
- Solid Queue for background jobs
- Solid Cache for caching
- Kamal for deployment
- ActionController::Live for SSE streaming

**Key Components:**
- `app/controllers/letta/` - API endpoints
- `app/services/letta/` - Business logic (Service Object pattern)
- `app/models/` - Agent, AgentMapping, BotTemplate, Organization
- `lib/letta/client.rb` - Letta API client

## The Process

### 1. Understanding the Idea

**Check project context first:**
- Review existing code in `rails_letta/` directory
- Understand the Letta integration architecture
- Check existing service patterns under `app/services/letta/`

**Ask questions one at a time:**
- Focus on: purpose, constraints, success criteria, security implications
- Prefer multiple choice questions when possible
- Only one question per message

**Key areas to clarify:**
- Is this a new API endpoint, service, or model?
- Does it involve Letta API integration?
- Does it require SSE streaming?
- Does it affect multi-tenancy (organization scoping)?
- Does it involve tool forwarding with HMAC?

### 2. Exploring Approaches

Propose 2-3 different approaches with trade-offs:
- Present options conversationally with your recommendation
- Lead with your recommended option and explain why
- Consider: Performance vs Security, Complexity vs Maintainability

### 3. Presenting the Design

**Break into sections, ask after each:**

**Section 1: Requirements**
- Problem statement
- Goals & objectives (API capability, agent feature, etc.)
- Success criteria
- Security considerations

**Section 2: Design**
- Architecture overview (use Mermaid diagrams)
- API endpoint design (if applicable)
- Service class structure
- Database changes (migrations if needed)
- Letta integration points

**Section 3: Planning**
- Task breakdown
- Dependencies
- Implementation order

**Section 4: Implementation**
- File locations and structure
- Code patterns to follow
- Testing approach

## Project-Specific Guidelines

### API Endpoints Pattern

All endpoints use the `/letta` namespace:

```ruby
# config/routes.rb
namespace :letta do
  resources :agents, only: [:create]
  post 'messages', to: 'messages#create'
  post 'streaming_messages', to: 'streaming_messages#create'
end
```

### Service Object Pattern

All business logic goes in service objects:

```ruby
module Letta
  module FeatureName
    class Create < ApplicationService
      def initialize(params)
        super()
        @params = params
      end

      def call
        # Business logic
        # Return { success: true, data: ... } or { success: false, error: ... }
      rescue StandardError => e
        { success: false, error: e.message }
      end
    end
  end
end
```

**File locations:**
- `app/services/letta/agents/create.rb`
- `app/services/letta/messages/create.rb`
- `app/services/letta/streaming_messages/create.rb`

### Controller Pattern

```ruby
module Letta
  class MyController < ApplicationController
    def create
      result = Letta::FeatureName::Create.new(params).call
      return render_error(result) if result[:success] == false
      render_success(result)
    end
  end
end
```

### Streaming Pattern (SSE)

For real-time agent responses:

```ruby
class Letta::StreamingMessagesController < ApplicationController
  include ActionController::Live

  def create
    response.headers['Content-Type'] = 'text/event-stream'
    response.headers['Cache-Control'] = 'no-cache'

    Letta::StreamingMessages::Create.new(params).call do |event|
      response.stream.write(event)
    end
  ensure
    response.stream.close if response.stream.respond_to?(:close)
  end
end
```

**Important:** Always cleanup streams in `ensure` block!

### Database Models

```ruby
# Migration
class CreateMyModel < ActiveRecord::Migration[8.1]
  def change
    create_table :my_models do |t|
      t.references :organization, null: false, foreign_key: true
      t.string :name, null: false
      t.jsonb :config, default: {}
      t.timestamps

      t.index [:organization_id, :name]
    end
  end
end

# Model
class MyModel < ApplicationRecord
  belongs_to :organization
  validates :name, presence: true
end
```

### Multi-Tenancy (Organization Scoping)

All data must be scoped to organizations:

```ruby
# Good - Organization scoped
agent = current_organization.agents.find(params[:id])

# Bad - No scoping
agent = Agent.find(params[:id])
```

### Tool Forwarding with HMAC

When forwarding tool execution to customer backends:

```ruby
# Generate HMAC signature
signature = OpenSSL::HMAC.hexdigest('SHA256', organization.secret_key, payload.to_json)

# Send to customer backend
HTTP.post(organization.customer_domain, headers: {
  'Content-Type' => 'application/json',
  'X-Letta-Signature' => signature
}, body: payload.to_json)
```

## Security Guidelines

- **Always scope** queries to organizations (multi-tenancy)
- **Never expose** secret keys in API responses or logs
- **Validate** HMAC signatures on tool forwarding
- **Use strong parameters** to prevent mass assignment
- **Sanitize** any data sent to Letta API

## Common Patterns

### Adding a New API Endpoint

1. Create route in `config/routes.rb` under `letta` namespace
2. Create controller in `app/controllers/letta/`
3. Create service in `app/services/letta/feature_name/`
4. Add response helper in `concerns/renderable.rb` if needed
5. Add tests

### Adding a New Model

1. Generate migration: `rails g migration CreateMyModel`
2. Add indexes for foreign keys and frequently queried columns
3. Create model with associations and validations
4. Update serializer if API-exposed

### Letta Integration

1. Use `Letta::Client` from `lib/letta/client.rb`
2. Handle Letta API errors gracefully
3. Log all API calls for debugging
4. Implement retry logic for transient failures

## After the Design

### Documentation

Document the design in `rails_letta/docs/`:

```
rails_letta/docs/
├── api/
│   └── feature_name.md
├── services/
│   └── feature_name.md
└── guides/
    └── feature_name.md
```

### Implementation (if continuing)

Ask: "Ready to set up for implementation?"

Then implement:
1. Database migration (if needed)
2. Model with validations
3. Service class with business logic
4. Controller with proper error handling
5. Routes
6. Tests (RSpec)

## Key Principles

- **One question at a time** - Don't overwhelm with multiple questions
- **Multiple choice preferred** - Easier to answer than open-ended
- **YAGNI ruthlessly** - Remove unnecessary features from designs
- **Explore alternatives** - Always propose 2-3 approaches
- **Incremental validation** - Present design in sections, validate each
- **Security first** - Always consider multi-tenancy and HMAC implications
- **Project context** - Follow existing patterns in rails_letta
