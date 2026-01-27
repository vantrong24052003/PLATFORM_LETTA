# Custom DB Integration - Implementation

This document defines the code implementation for bot template management.

---

## 1. Request Flow

```
Client → Rails Router → Controller → Service → Model → PostgreSQL
```

**Flow Sequence**:
1. Client sends request to `/letta/bot_templates`
2. Controller validates params with `params.require(:bot_template)`
3. Controller calls `Letta::BotTemplates::Create.new(params).call`
4. Service creates/updates model in database
5. Controller renders JSON response

---

## 2. Models

### Letta::BotTemplate

**Location**: `app/models/letta/bot_template.rb`

```ruby
# frozen_string_literal: true

class Letta::BotTemplate < ApplicationRecord
  has_many :agent_mappings,
    class_name: 'Letta::AgentMapping',
    foreign_key: :bot_template_id,
    dependent: :destroy,
    inverse_of: :bot_template

  # Validations
  validates :organization_id, :name, :system_prompt, presence: true
  validates :status, inclusion: { in: %w[active inactive] }

  # Scopes
  scope :active, -> { where(status: 'active') }
  scope :for_organization, ->(org_id) { where(organization_id: org_id) }
end
```

### Letta::AgentMapping

**Location**: `app/models/letta/agent_mapping.rb`

```ruby
# frozen_string_literal: true

class Letta::AgentMapping < ApplicationRecord
  belongs_to :bot_template,
    class_name: 'Letta::BotTemplate',
    foreign_key: :bot_template_id,
    inverse_of: :agent_mappings

  validates :organization_id, :customer_user_id, :letta_agent_id, presence: true
  validates :letta_agent_id, uniqueness: true

  scope :for_user, ->(user_id) { where(customer_user_id: user_id) }
end
```

---

## 3. Controllers

### Letta::BotTemplatesController

**Location**: `app/controllers/letta/bot_templates_controller.rb`

```ruby
# frozen_string_literal: true

module Letta
  class BotTemplatesController < ApplicationController
    DEFAULT_LIMIT = 25
    DEFAULT_PAGE = 1

    before_action :set_template, only: %i[show update destroy]

    # GET /letta/bot_templates
    def index
      templates = current_organization.bot_templates
        .page(params[:page] || DEFAULT_PAGE)
        .per(params[:per_page] || DEFAULT_LIMIT)

      render json: { data: templates, meta: pagination_meta(templates) }
    end

    # GET /letta/bot_templates/:id
    def show
      render json: { data: @template }
    end

    # POST /letta/bot_templates
    def create
      result = BotTemplates::Create.new(template_params.merge(organization_id: current_organization.id)).call

      if result[:success]
        render json: { data: result[:data] }, status: :created
      else
        render json: { error: result[:error] }, status: :unprocessable_entity
      end
    end

    # PATCH/PUT /letta/bot_templates/:id
    def update
      result = BotTemplates::Update.new(template_params.merge(bot_template: @template)).call

      if result[:success]
        render json: { data: result[:data] }
      else
        render json: { error: result[:error] }, status: :unprocessable_entity
      end
    end

    # DELETE /letta/bot_templates/:id
    def destroy
      @template.destroy
      head :no_content
    end

    private

    def set_template
      @template = current_organization.bot_templates.find(params[:id])
    end

    def template_params
      params.require(:bot_template).permit(
        :name, :greeting, :status, :system_prompt,
        tools: [], source_ids: [], theme_config: {}
      )
    end

    def pagination_meta(collection)
      {
        current_page: collection.current_page,
        total_pages: collection.total_pages,
        total_count: collection.total_count,
        per_page: collection.limit_value
      }
    end
  end
end
```

---

## 4. Service Objects

### Letta::BotTemplates::Create

**Location**: `app/services/letta/bot_templates/create.rb`

```ruby
# frozen_string_literal: true

module Letta
  module BotTemplates
    class Create < ApplicationService
      def call
        template = BotTemplate.new(params)

        if template.save
          { success: true, data: template }
        else
          { success: false, error: { code: 'validation_failed', details: template.errors } }
        end
      rescue StandardError => e
        { success: false, error: { code: 'internal_error', message: e.message } }
      end
    end
  end
end
```

### Letta::BotTemplates::Update

**Location**: `app/services/letta/bot_templates/update.rb`

```ruby
# frozen_string_literal: true

module Letta
  module BotTemplates
    class Update < ApplicationService
      def call
        template = params[:bot_template]

        if template.update(update_params)
          { success: true, data: template }
        else
          { success: false, error: { code: 'validation_failed', details: template.errors } }
        end
      rescue StandardError => e
        { success: false, error: { code: 'internal_error', message: e.message } }
      end

      private

      def update_params
        params.except(:bot_template)
      end
    end
  end
end
```

---

## Related

- [00-overview.md](./00-overview.md) - Feature overview
- [01-database-schema.md](./01-database-schema.md) - Database schema
- [02-api-design.md](./02-api-design.md) - API endpoints
