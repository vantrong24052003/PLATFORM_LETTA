# Agent Search - Implementation

This document defines the code implementation for agent search.

---

## 1. Request Flow

```
Client → Controller → Service → AgentMapping (IDs) → Letta API → Filter → Paginate → Response
```

---

## 2. Controllers

### Letta::AgentsController

**Location**: `app/controllers/letta/agents_controller.rb`

```ruby
# frozen_string_literal: true

class Letta::AgentsController < ApplicationController
  DEFAULT_PAGE = 1
  DEFAULT_PER_PAGE = 20
  MAX_PER_PAGE = 100

  # GET /letta/agents
  def index
    result = Agents::List.new(search_params).call

    if result[:success]
      render json: { data: result[:data], meta: result[:meta] }
    else
      render json: { error: result[:error] }, status: :bad_request
    end
  end

  # GET /letta/agents/:id
  def show
    result = Agents::Get.new(show_params).call

    if result[:success]
      render json: { data: result[:data] }
    else
      render json: { error: result[:error] }, status: :not_found
    end
  end

  private

  def search_params
    params.permit(:keyword, :from_date, :to_date, :page, :per_page, :sort_by, :sort_order)
      .reverse_merge(page: DEFAULT_PAGE, per_page: DEFAULT_PER_PAGE)
  end

  def show_params
    params.permit(:id, :organization_id)
  end
end
```

---

## 3. Service Objects

### Letta::Agents::List

**Location**: `app/services/letta/agents/list.rb`

```ruby
# frozen_string_literal: true

class Letta::Agents::List < ApplicationService
  def call
    # Get agent IDs for organization
    agent_ids = AgentMapping
      .where(organization_id: current_organization.id)
      .pluck(:letta_agent_id)

    return { success: true, data: [], meta: empty_meta } if agent_ids.empty?

    # Fetch from Letta API
    agents = LettaAPI.agents.list(ids: agent_ids)

    # Apply filters & pagination
    filtered = apply_filters(agents)
    sorted = apply_sorting(filtered)
    paginated = Kaminari.paginate_array(sorted).page(params[:page]).per(params[:per_page])

    { success: true, data: paginated, meta: pagination_meta(paginated) }
  end
end
```

### Letta::Agents::Get

**Location**: `app/services/letta/agents/get.rb`

```ruby
# frozen_string_literal: true

class Letta::Agents::Get < ApplicationService
  def call
    # Verify agent belongs to organization
    mapping = AgentMapping.find_by(
      letta_agent_id: params[:id],
      organization_id: params[:organization_id]
    )

    return { success: false, error: 'Agent not found' } if mapping.nil?

    # Fetch from Letta API
    agent = LettaAPI.agents.get(params[:id])

    { success: true, data: agent }
  end
end
```

---

## Related

- [00-overview.md](./00-overview.md) - Feature overview
- [01-database-schema.md](./01-database-schema.md) - No DB changes
