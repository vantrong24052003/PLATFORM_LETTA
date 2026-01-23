# Implementation Plan - rails_letta

This document defines the **CORRECT ORDER** and **CHECKLIST** for implementing the LeTTa Platform backend.
It strictly adheres to:
- **Rails 8.1.1** & **Ruby 3.2.6**
- **Multi-Tenancy** (`organization_id`)
- **Strict Architecture** (Admin Config -> Widget -> Backend -> Letta Engine)

---

## Phase 1: Setup Backend & Database (Rails)

**Goal**: Implement the custom schema and CRUD APIs required for Bot Templates.

### 1.1. Database Schema (Migrations)
- [ ] Create `Letta::BotTemplate` model & table (`bot_templates`)
    - Columns: `id, organization_id, name, greeting, status, system_prompt, tools, source_ids, theme_config`
- [ ] Create `Letta::AgentMapping` model & table (`agent_mappings`)
    - Columns: `id, organization_id, bot_template_id, customer_user_id, letta_agent_id`
    - Index: `UNIQUE(organization_id, bot_template_id, customer_user_id)`

### 1.2. Models & Validation
- [ ] `app/models/letta/bot_template.rb`
    - Validations: `presence: name, system_prompt, organization_id`
- [ ] `app/models/letta/agent_mapping.rb`
    - Validations: `presence: organization_id, letta_agent_id`
    - Associations: `belongs_to :bot_template`

### 1.3. Services (Business Logic)
- [ ] `app/services/letta/bot_service.rb`
    - `create(params)`: Create template
    - `update(id, params)`: Update template
- [ ] `app/services/letta/agent_service.rb` (Update existing)
    - `get_or_create_agent(bot_id, user_id, org_id)`:
        - Check mapping
        - If missing: Load template -> Call Letta Engine -> Create Agent -> Save Mapping

### 1.4. Controllers (APIs)
- [ ] `app/controllers/letta/bot_templates_controller.rb`
    - `index` (Scoped by `organization_id`)
    - `show`
    - `create`
    - `update`
    - `destroy`
- [ ] `app/controllers/letta/agent_mappings_controller.rb`
    - `create` (Nested under bot_templates)
- [ ] Routes in `config/routes.rb`: `resources :bot_templates { resources :agent_mappings }`

### 1.5. Letta Integration (Client & Forwarding)
- [ ] `lib/letta/client.rb`: Implement HTTP Client for Letta Engine.
- [ ] `app/services/letta/tool_forwarding_service.rb`: Handle tool execution forwarding.
- [ ] Streaming support: Implement `Live::SSE` helper for `POST /stream`.

---

## Phase 2: Build Embed Widget (Vanilla JS)

**Goal**: Create the static JS artifact that customers import.

### 2.1. Project Setup
- [ ] Create `widget/` directory
- [ ] Setup Webpack/Vite for bundling `embed.js`

### 2.2. Core Logic
- [ ] `init(config)`: Read `data-assistant-id`
- [ ] `connect()`: Call `GET /letta/bots/:id` to load theme/config
- [ ] `renderUI()`: Draw bubble & chat window based on theme
- [ ] `chat()`: Call `POST /letta/agents/:id/messages` (Proxy via Backend)

---

## Phase 3: Refactor Frontend (ui_mgpt)

**Goal**: Connect the Admin Dashboard to the real Backend.

### 3.1. API Integration
- [ ] Replace `localStorage` logic with API calls to `/letta/bot_templates`
- [ ] Ensure all requests send `organization_id` header or param

---

## Phase 4: Integration Testing

**Goal**: Verify the full loop.

### 4.1. End-to-End
- [ ] Admin creates Bot -> Widget loads Bot -> User chats -> Agent created -> Chat persists.
- [ ] Repeat with 2nd User -> Different Agent created.
- [ ] Repeat with 2nd Organization -> Complete isolation verified.
