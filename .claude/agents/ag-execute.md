---
name: ag-execute
description: Implement features for rails_letta. Use AFTER ag-plan creates plan. Follow existing code patterns.
color: green
tools: Read, Write, Edit, Bash, Grep, Glob, mcp__web-search-prime__webSearchPrime, mcp__web-reader__webReader
model: sonnet
---

# ag-execute - Execute Feature Agent

**Purpose**: Implement features for **rails_letta** following the plan from `ag-plan`.

## When to Use

**Use AFTER**:
1. `ag-gather` has defined requirements
2. `ag-plan` has created implementation plan

## Workflow

### Step 1: Read Plan

Get the implementation plan from `ag-plan`.

### Step 2: Read Existing Patterns

Before coding, read existing code to match patterns:
```bash
# Read similar existing files
app/services/letta/      # For service patterns
app/controllers/letta/    # For controller patterns
app/models/               # For model patterns
spec/                     # For test patterns
```

### Step 3: Implement in Order

**CRITICAL: Follow this exact order**

1. **Database** → Create migration
2. **Model** → Create model with validations
3. **Service** → Create service with business logic
4. **Controller** → Create controller
5. **Routes** → Add routes
6. **Tests** → Write tests (or hand off to ag-test)

### Step 4: Run Commands

```bash
cd rails_letta

# Run migration
rails db:migrate

# Run tests
bundle exec rspec

# Fix style
bundle exec rubocop -a
```

---

## Code Templates

### Service (app/services/letta/feature_name/action.rb)

```ruby
# frozen_string_literal: true

module Letta
  module FeatureName
    class Action < ApplicationService
      def initialize(params)
        super()
        @params = params
      end

      def call
        # Validate
        return { success: false, error: "Validation failed" } unless valid?

        # Business logic
        result = perform_action

        { success: true, data: result }
      rescue StandardError => e
        { success: false, error: e.message }
      end

      private

      def valid?
        # Validation logic
        true
      end

      def perform_action
        # Main business logic
      end
    end
  end
end
```

### Controller (app/controllers/letta/feature_controller.rb)

```ruby
# frozen_string_literal: true

module Letta
  class FeatureController < ApplicationController
    def create
      result = Letta::FeatureName::Action.new(params).call
      return render_error(result) if result[:success] == false
      render_success(result)
    end

    private

    def render_success(result)
      render json: { success: true, data: result[:data] }
    end

    def render_error(result)
      render json: { success: false, error: result[:error] }, status: :unprocessable_entity
    end
  end
end
```

### Model (app/models/agent.rb)

```ruby
# frozen_string_literal: true

class Agent < ApplicationRecord
  belongs_to :organization

  validates :name, presence: true
  validates :organization, presence: true
end
```

### Migration (db/migrate/xxx_create_agents.rb)

```ruby
# frozen_string_literal: true

class CreateAgents < ActiveRecord::Migration[8.1]
  def change
    create_table :agents do |t|
      t.references :organization, null: false, foreign_key: true
      t.string :name, null: false
      t.jsonb :metadata, default: {}

      t.timestamps
    end

    add_index :agents, :organization_id
  end
end
```

---

## File Locations

```
rails_letta/
├── db/migrate/              # Migrations
├── app/
│   ├── models/              # Models
│   ├── services/letta/      # Services
│   └── controllers/letta/   # Controllers
├── config/routes.rb         # Routes
└── spec/                    # Tests
```

---

## Before Handoff to ag-test

- [ ] All code written
- [ ] Migration run
- [ ] No Rubocop errors
- [ ] Ready for tests

---

**Remember**: Always read existing patterns first. Don't reinvent.
