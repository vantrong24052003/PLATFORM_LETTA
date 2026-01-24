### Request Flow
1. [custom-db-integration] Client sends POST /letta/bot_templates
2. [custom-db-integration] Controller validates params with `params.require(:organization_id)`
3. [custom-db-integration] Controller calls `Letta::BotTemplates::Create.new(params).call`
4. [custom-db-integration] Service creates bot template in DB
5. [custom-db-integration] Controller renders JSON response

### Service Flow (Create)
1. [custom-db-integration] Initialize service with params (via `ApplicationService`)
2. [custom-db-integration] Validate & Save `BotTemplate` model
3. [custom-db-integration] Return result hash `{ success: true, data: ... }`

---

## Models

### 1. BotTemplate

**Location**: `app/models/bot_template.rb`

```ruby
class BotTemplate < ApplicationRecord
  # Associations
  has_many :agent_mappings, dependent: :destroy

  # Validations
  validates :name, presence: true
  validates :organization_id, presence: true
  validates :system_prompt, presence: true
  validates :status, inclusion: { in: %w[active inactive] }
end
```

### 2. AgentMapping

**Location**: `app/models/agent_mapping.rb`

```ruby
class AgentMapping < ApplicationRecord
  # Associations
  belongs_to :bot_template

  # Validations
  validates :organization_id, presence: true
  validates :user_id, presence: true
  validates :letta_agent_id, presence: true, uniqueness: true
end
```

---

## Controllers

### Letta::BotTemplatesController

**Location**: `app/controllers/letta/bot_templates_controller.rb`

```ruby
class Letta::BotTemplatesController < ApplicationController
  DEFAULT_LIMIT = 25
  DEFAULT_PAGE = 1

  before_action :find_template, only: %i[show update destroy]

  # GET /letta/bot_templates
  def index
    org_id = params.require(:organization_id)
    limit = params[:limit] || DEFAULT_LIMIT
    page = params[:page] || DEFAULT_PAGE

    templates = BotTemplate.by_org(org_id).page(page).per(limit)
    render_success(response: templates)
  end

  # POST /letta/bot_templates
  def create
    result = Letta::BotTemplates::Create.new(template_params).call

    if result[:success]
      render_success(response: result[:data], status: :created)
    else
      render_error(error: 'Validation failed', response: result[:errors], status: :unprocessable_entity)
    end
  end

  # PUT /letta/bot_templates/:id
  def update
    service_params = template_params.merge(bot_template: @template, id: params[:id])
    result = Letta::BotTemplates::Update.new(service_params).call

    if result[:success]
      render_success(response: result[:data])
    else
      render_error(error: 'Validation failed', response: result[:errors], status: :unprocessable_entity)
    end
  end

  # DELETE /letta/bot_templates/:id
  def destroy
    @template.destroy
    head :no_content
  end

  private

  def find_template
    @template = BotTemplate.find(params[:id])
  end

  def template_params
    scalars = [:organization_id, :name, :greeting, :system_prompt, :status]
    params.require(:bot_template).permit(scalars, tools: [], source_ids: [], theme_config: {})
  end
end
```

---

## Service Objects

### Letta::BotTemplates::Create

**Location**: `app/services/letta/bot_templates/create.rb`

```ruby
# frozen_string_literal: true

class Letta::BotTemplates::Create < ApplicationService
  def call
    template = BotTemplate.new(params)
    if template.save
      { success: true, data: template }
    else
      { success: false, errors: template.errors }
    end
  end
end
```

### Letta::BotTemplates::Update

**Location**: `app/services/letta/bot_templates/update.rb`

```ruby
# frozen_string_literal: true

class Letta::BotTemplates::Update < ApplicationService
  def call
    template = params[:bot_template]

    if template.update(update_params)
      { success: true, data: template }
    else
      { success: false, errors: template.errors }
    end
  end

  private

  def update_params
    params.except(:bot_template, :id)
  end
end
```
