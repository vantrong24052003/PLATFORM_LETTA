# Custom DB Integration - Implementation

**Feature**: Custom Database Schema for Letta Bot Templates  
**Status**: 🔴 Not Started  
**Parent**: [00-overview.md](./00-overview.md)

---

## Code Flow

### Request Flow
1. [letta-custom-db] Client sends POST /letta/bot_templates
2. [letta-custom-db] Controller extracts & validates params (fail fast)
3. [letta-custom-db] Service creates bot template in DB
4. [letta-custom-db] Service triggers Letta Agent creation via API
5. [letta-custom-db] Service stores mapping (user <-> agent)
6. [letta-custom-db] Controller renders JSON result

### Service Flow (Letta::BotTemplateService)
1. [letta-custom-db] Validate unique constraints
2. [letta-custom-db] Create BotTemplate record
3. [letta-custom-db] Call LettaClient to create agent
4. [letta-custom-db] Save AgentMapping
5. [letta-custom-db] Return result object

---

## Models

### 1. Letta::BotTemplate

**Location**: `app/models/letta/bot_template.rb`

```ruby
module Letta
  class BotTemplate < ApplicationRecord
    # [letta-custom-db] Define table name explicitly
    self.table_name = 'letta_bot_templates'

    # [letta-custom-db] Associations
    belongs_to :organization
    has_many :agent_mappings, class_name: 'Letta::AgentMapping', dependent: :destroy

    # [letta-custom-db] Validations
    validates :name, presence: true, length: { maximum: 255 }
    validates :system_prompt, presence: true
    validates :organization_id, presence: true

    # [letta-custom-db] Set defaults before validation
    before_validation :set_defaults

    private

    def set_defaults
      # [letta-custom-db] Apply default values if not present
      self.human_name ||= 'User'
      self.persona_name ||= 'Assistant'
    end
  end
end
```

### 2. Letta::AgentMapping

**Location**: `app/models/letta/agent_mapping.rb`

```ruby
module Letta
  class AgentMapping < ApplicationRecord
    # [letta-custom-db] Mapping table between Users and Letta Agents
    self.table_name = 'letta_agent_mappings'

    # [letta-custom-db] Associations
    belongs_to :bot_template, class_name: 'Letta::BotTemplate'
    belongs_to :organization

    # [letta-custom-db] Validations (Strict isolation)
    validates :letta_agent_id, presence: true, uniqueness: true
    validates :user_id, presence: true
    validates :organization_id, presence: true
  end
end
```

---

## Controllers

### Letta::BotTemplatesController

**Location**: `app/controllers/letta/bot_templates_controller.rb`

```ruby
module Letta
  class BotTemplatesController < ApplicationController
    # [letta-custom-db] Standard CRUD for bot templates
    
    # GET /letta/bot_templates
    def index
      # [letta-custom-db] List templates for current org
      templates = current_organization.bot_templates.page(params[:page])
      render json: { data: templates }
    end

    # POST /letta/bot_templates
    def create
      # [letta-custom-db] Strict parameter validation
      name, org_id = params.require([:name, :organization_id])
      
      # [letta-custom-db] Delegate to Service Object
      service = Letta::CreateBotTemplateService.call(
        name: name, 
        organization_id: org_id,
        params: bot_template_params
      )

      # [letta-custom-db] Render result
      render json: { data: service.result }, status: :created
    end

    private

    def bot_template_params
      # [letta-custom-db] Strong parameters
      params.require(:bot_template).permit(:system_prompt, :human_name, :persona_name)
    end
  end
end
```

---

## Service Objects

### Letta::AgentService

**Location**: `app/services/letta/agent_service.rb`

**Purpose**: Get or create Letta agents for bot templates.

```ruby
module Letta
  class AgentService
    # [letta-custom-db] Standard Service Pattern: self.call
    
    def self.call(bot_template:, user_id:)
      # [letta-custom-db] Check existing mapping
      mapping = AgentMapping.find_by(bot_template: bot_template, user_id: user_id)
      return mapping.letta_agent_id if mapping

      # [letta-custom-db] Create new agent via API
      new(bot_template, user_id).create_agent
    end

    def initialize(bot_template, user_id)
      @bot_template = bot_template
      @user_id = user_id
    end

    def create_agent
      # [letta-custom-db] Call Letta API
      client = External::LettaService.new
      response = client.create_agent(
        name: "#{@bot_template.name}-#{@user_id}",
        system: @bot_template.system_prompt
      )
      
      # [letta-custom-db] Store mapping
      store_mapping(response['id'])
      response['id']
    end

    private

    def store_mapping(letta_id)
      # [letta-custom-db] Persist to DB
      AgentMapping.create!(
        bot_template: @bot_template,
        user_id: @user_id,
        organization_id: @bot_template.organization_id,
        letta_agent_id: letta_id
      )
    end
  end
end
```

---

## File Structure

```
app/
├── controllers/
│   └── letta/
│       └── bot_templates_controller.rb
│
├── models/
│   └── letta/
│       ├── bot_template.rb
│       └── agent_mapping.rb
│
└── services/
    └── letta/
        └── agent_service.rb
```
