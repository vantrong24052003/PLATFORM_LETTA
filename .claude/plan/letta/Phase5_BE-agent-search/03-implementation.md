# Agent Search - Implementation

**Status**: 🟡 **PLANNED**
**Pattern**: Skinny Controller + Service Objects

---

## 1. File Structure

```
rails_letta/app/
├── controllers/
│   └── letta/
│       └── agents_controller.rb          # UPDATE: add index, show
├── services/
│   └── letta/
│       └── agents/
│           ├── create.rb                 # EXISTS
│           ├── list.rb                   # NEW: search & list
│           └── get.rb                    # NEW: single agent
├── models/
│   └── agent_mapping.rb                  # EXISTS (no changes)
└── lib/
    └── integration/
        └── letta/
            ├── endpoints.rb              # UPDATE: add LIST_AGENTS, GET_AGENT
            └── util/
                └── http_client.rb        # EXISTS (no changes)
```

---

## 2. Controller: `Letta::AgentsController`

**Location**: `app/controllers/letta/agents_controller.rb`

```ruby
# frozen_string_literal: true

class Letta::AgentsController < ApplicationController
  DEFAULT_PAGE = 1
  DEFAULT_PER_PAGE = 20
  MAX_PER_PAGE = 100

  # GET /letta/agents
  def index
    result = Letta::Agents::List.new(search_params).call

    if result[:success]
      render_success(response: result[:data], meta: result[:meta])
    else
      render_error(error: result[:error], status: :bad_request)
    end
  end

  # GET /letta/agents/:id
  def show
    result = Letta::Agents::Get.new(show_params).call

    if result[:success]
      render_success(response: result[:data])
    else
      render_error(error: result[:error], status: :not_found)
    end
  end

  # POST /letta/agents (existing)
  def create
    result = Letta::Agents::Create.new(permit_params).call

    if result[:success]
      render_success(response: result[:data], status: :created)
    else
      render_error(error: "Validation failed", response: result[:errors], status: :unprocessable_entity)
    end
  end

  private

  def search_params
    params.permit(
      :organization_id,
      :keyword,
      :from_date,
      :to_date,
      :page,
      :per_page,
      :sort_by,
      :sort_order
    ).reverse_merge(
      page: DEFAULT_PAGE,
      per_page: DEFAULT_PER_PAGE,
      sort_by: 'created_at',
      sort_order: 'desc'
    )
  end

  def show_params
    params.permit(:id, :organization_id)
  end

  def permit_params
    params.permit(
      :name,
      :system,
      :include_base_tool_rules,
      tools: [],
      memory_blocks: [:label, :value],
      tool_rules: [:type, :tool_name],
      llm_config: [:model, :model_endpoint_type, :model_endpoint, :context_window],
      embedding_config: [:embedding_model, :embedding_endpoint_type, :embedding_endpoint, :embedding_dim]
    )
  end
end
```

---

## 3. Service: `Letta::Agents::List`

**Location**: `app/services/letta/agents/list.rb`

```ruby
# frozen_string_literal: true`

class Letta::Agents::List < ApplicationService
  ALLOWED_SORT_FIELDS = %w[name created_at].freeze
  ALLOWED_SORT_ORDERS = %w[asc desc].freeze

  def call
    # Validate params
    return { success: false, error: 'organization_id is required' } if params[:organization_id].blank?

    # Step 1: Get agent IDs for this org
    agent_ids = AgentMapping
      .where(organization_id: params[:organization_id])
      .pluck(:letta_agent_id)

    return { success: true, data: [], meta: empty_pagination } if agent_ids.empty?

    # Step 2: Fetch from Letta API
    agents = fetch_agents_from_letta(agent_ids)
    return { success: false, error: 'Failed to fetch agents' } if agents.nil?

    # Step 3: Apply filters
    filtered = apply_filters(agents)

    # Step 4: Sort
    sorted = apply_sorting(filtered)

    # Step 5: Paginate
    paginated = Kaminari.paginate_array(sorted)
      .page(params[:page])
      .per([params[:per_page].to_i, 100].min)

    {
      success: true,
      data: paginated,
      meta: pagination_meta(paginated)
    }
  end

  private

  def fetch_agents_from_letta(agent_ids)
    Integration::Letta::Util::HttpClient.get(
      path: Integration::Letta::Endpoints::AGENTS[:LIST_AGENTS],
      query: { ids: agent_ids.join(',') }
    )
  rescue StandardError => e
    Rails.logger.error("Failed to fetch agents: #{e.message}")
    nil
  end

  def apply_filters(agents)
    filtered = agents

    # Keyword search (name + description)
    if params[:keyword].present?
      keyword = params[:keyword].downcase
      filtered = filtered.select do |agent|
        agent['name']&.downcase&.include?(keyword) ||
          agent['description']&.downcase&.include?(keyword)
      end
    end

    # Date range filter
    if params[:from_date].present?
      from = Date.parse(params[:from_date])
      filtered = filtered.select { |a| Date.parse(a['created_at']) >= from }
    end

    if params[:to_date].present?
      to = Date.parse(params[:to_date])
      filtered = filtered.select { |a| Date.parse(a['created_at']) <= to }
    end

    filtered
  end

  def apply_sorting(agents)
    sort_field = ALLOWED_SORT_FIELDS.include?(params[:sort_by]) ? params[:sort_by] : 'created_at'
    sort_order = ALLOWED_SORT_ORDERS.include?(params[:sort_order]) ? params[:sort_order] : 'desc'

    agents.sort_by { |a| a[sort_field] }.then { |sorted| sort_order == 'desc' ? sorted.reverse : sorted }
  end

  def pagination_meta(collection)
    {
      current_page: collection.current_page,
      total_pages: collection.total_pages,
      total_count: collection.total_count,
      per_page: collection.limit_value
    }
  end

  def empty_pagination
    {
      current_page: 1,
      total_pages: 1,
      total_count: 0,
      per_page: params[:per_page]&.to_i || 20
    }
  end
end
```

---

## 4. Service: `Letta::Agents::Get`

**Location**: `app/services/letta/agents/get.rb`

```ruby
# frozen_string_literal: true

class Letta::Agents::Get < ApplicationService
  def call
    # Validate params
    return { success: false, error: 'id is required' } if params[:id].blank?
    return { success: false, error: 'organization_id is required' } if params[:organization_id].blank?

    # Step 1: Verify agent belongs to organization
    mapping = AgentMapping.find_by(
      letta_agent_id: params[:id],
      organization_id: params[:organization_id]
    )

    return { success: false, error: 'Agent not found' } if mapping.nil?

    # Step 2: Fetch from Letta API
    agent = fetch_agent_from_letta(params[:id])
    return { success: false, error: 'Agent not found' } if agent.nil?

    { success: true, data: agent }
  end

  private

  def fetch_agent_from_letta(agent_id)
    Integration::Letta::Util::HttpClient.get(
      path: "#{Integration::Letta::Endpoints::AGENTS[:GET_AGENT]}/#{agent_id}"
    )
  rescue StandardError => e
    Rails.logger.error("Failed to fetch agent: #{e.message}")
    nil
  end
end
```

---

## 5. Update: `Integration::Letta::Endpoints`

**Location**: `lib/integration/letta/endpoints.rb`

```ruby
# frozen_string_literal: true

module Integration
  module Letta
    module Endpoints
      BASE_URL = ENV['LETTA_API_BASE'] || 'https://api.letta.com'

      module AGENTS
        CREATE_AGENT = "#{BASE_URL}/api/agents"
        LIST_AGENTS   = "#{BASE_URL}/api/agents"  # NEW
        GET_AGENT     = "#{BASE_URL}/api/agents"  # NEW (with :id appended)
      end

      # ... other endpoints
    end
  end
end
```

---

## 6. Update: `config/routes.rb`

```ruby
# frozen_string_literal: true

Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  namespace :letta do
    resources :agents, only: %i[index show create]  # ADD index, show
    resources :messages, only: [:create]
    resources :streaming_messages, only: [:create]
    resources :bot_templates, only: %i[index show create update destroy]
  end
end
```

---

## 7. Implementation Checklist

### Phase 1: Core Implementation
- [ ] Update `routes.rb` to add `index` and `show` to agents
- [ ] Update `Integration::Letta::Endpoints` with new endpoints
- [ ] Create `Letta::Agents::List` service
- [ ] Create `Letta::Agents::Get` service
- [ ] Update `Letta::AgentsController` with `index` and `show` actions

### Phase 2: Testing
- [ ] Write controller specs for `index`
- [ ] Write controller specs for `show`
- [ ] Write service specs for `List`
- [ ] Write service specs for `Get`
- [ ] Integration tests with Letta API mock

### Phase 3: Refinement
- [ ] Add error handling for Letta API failures
- [ ] Add logging for debugging
- [ ] Performance optimization if needed
- [ ] Update API documentation
