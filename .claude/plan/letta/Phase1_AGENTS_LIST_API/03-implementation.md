# Agents List API - Implementation

## File Structure

```
app/
├── models/
│   └── agent.rb                    # EXISTING - may need scope additions
├── services/
│   └── letta/
│       └── agents/
│           ├── create.rb           # EXISTING
│           └── list.rb             # NEW - Service for listing agents
├── controllers/
│   └── letta/
│       └── agents_controller.rb    # MODIFY - add index action
└── concerns/
    └── organization_authable.rb    # NEW - Authentication concern

spec/
├── requests/
│   └── letta/
│       └── agents_spec.rb          # MODIFY - add index tests
└── services/
    └── letta/
        └── agents/
            └── list_spec.rb        # NEW - Service tests
```

## Implementation Order

### 1. Authentication Concern
**File**: `app/controllers/concerns/organization_authable.rb`

```ruby
# frozen_string_literal: true

module OrganizationAuthable
  extend ActiveSupport::Concern

  included do
    before_action :authenticate_organization!
  end

  private

  def authenticate_organization!
    api_key = request.headers['X-Organization-Key']

    if api_key.blank?
      render json: { error: 'Unauthorized', data: 'Missing X-Organization-Key header' }, status: :unauthorized
      return
    end

    @current_organization = Organization.find_by(secret_key: api_key)

    unless @current_organization
      render json: { error: 'Unauthorized', data: 'Invalid API key' }, status: :unauthorized
    end
  end

  def current_organization
    @current_organization
  end
end
```

### 2. Service - Letta::Agents::List
**File**: `app/services/letta/agents/list.rb`

```ruby
# frozen_string_literal: true

class Letta::Agents::List < ApplicationService
  DEFAULT_PAGE = 1
  DEFAULT_PER = 20
  MAX_PER = 100

  def call
    agents = current_organization.agents
    agents = apply_filters(agents)
    agents = apply_pagination(agents)

    {
      success: true,
      data: serialize_agents(agents),
      pagination: pagination_info(agents)
    }
  rescue StandardError => e
    { success: false, error: e.message }
  end

  private

  def current_organization
    @current_organization ||= Organization.find(params[:organization_id])
  end

  def apply_filters(agents)
    agents = agents.where.not(id: nil) # Base query

    if params[:name].present?
      agents = agents.where("name ILIKE ?", "%#{params[:name]}%")
    end

    if params[:status] == 'inactive'
      agents = agents.where(is_deleted: true)
    elsif params[:status] == 'active'
      agents = agents.where(is_deleted: false)
    end

    agents
  end

  def apply_pagination(agents)
    page = [params[:page]&.to_i || DEFAULT_PAGE, 1].max
    per = [params[:per]&.to_i || DEFAULT_PER, MAX_PER].min

    agents.page(page).per(per)
  end

  def serialize_agents(agents)
    agents.map do |agent|
      {
        id: agent.id,
        name: agent.name,
        description: agent.description,
        system: agent.system,
        organization_id: agent.organization_id,
        created_at: agent.created_at,
        updated_at: agent.updated_at,
        status: agent.is_deleted ? 'inactive' : 'active'
      }
    end
  end

  def pagination_info(agents)
    {
      current_page: agents.current_page,
      total_pages: agents.total_pages,
      total_count: agents.total_count,
      per_page: agents.limit_value
    }
  end
end
```

### 3. Controller - Add index action
**File**: `app/controllers/letta/agents_controller.rb` (MODIFY)

```ruby
# frozen_string_literal: true

class Letta::AgentsController < ApplicationController
  include OrganizationAuthable

  def index
    result = Letta::Agents::List.new(
      params.merge(organization_id: current_organization.id)
    ).call

    if result[:success]
      render_success(response: { agents: result[:data], pagination: result[:pagination] })
    else
      render_error(error: result[:error], status: :internal_server_error)
    end
  end

  def create
    # EXISTING CODE
  end

  private

  def permit_params
    # EXISTING CODE
  end
end
```

### 4. Routes
**File**: `config/routes.rb` (MODIFY)

Change:
```ruby
resources :agents, only: [ :create ]
```

To:
```ruby
resources :agents, only: [ :index, :create ]
```

## Constants Summary
| Constant | Value | Location |
|----------|-------|----------|
| DEFAULT_PAGE | 1 | Service |
| DEFAULT_PER | 20 | Service |
| MAX_PER | 100 | Service |
