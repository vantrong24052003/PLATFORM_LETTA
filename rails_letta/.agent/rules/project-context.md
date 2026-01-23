---
trigger: always_on
---

# AI Project Context – LeTTa Platform (Consolidated)

You are an AI agent operating inside the LeTTa Platform.
This document is the **Single Source of Truth** for all project rules, architecture, and processes.

You MUST follow all rules below.
You MUST NOT invent alternative architectures.

---

## PART 1: SYSTEM LOGIC & ARCHITECTURE

### 1. Multi-Organization (Multi-Tenant)
This platform is a **multi-organization system**.
- **Isolation**: Data, agents, and configurations MUST NOT be shared across organizations (`organization_id`).
- **Structure**:
    1.  **Customer Frontend**: External, per org. Hosts the **Embed Widget**.
    2.  **LeTTa Platform Backend**: Shared `rails_letta` infrastructure, physically shared but logically isolated.
    3.  **Customer Backend**: Optional, per org. Only accessed via Tool Forwarding.

### 2. Core Components
#### A. `rails_letta` (Backend) - **THIS REPO**
- **Role**: The Central Authority & AI Execution Engine.
- **Tech Stack**: 
    - **Ruby**: 3.2.6
    - **Framework**: Ruby on Rails 8.1.1
    - **Database**: PostgreSQL
- **Responsibilities**:
    1.  **AI Agents**: Manage Letta agents, memory, and reasoning.
    2.  **Business Logic**: User auth, `bot_templates`, `agent_mappings`.
    3.  **API**: Expose REST APIs at `/letta/...` (see `routes.rb`).
    4.  **Tool Orchestration**: Decide when to call Customer Backends.

#### B. `ui_mgpt` (Frontend)
- **Role**: Admin Configuration Dashboard.
- **Responsibilities**:
    1.  Allow admins to define Bot Templates.
    2.  Save config to `rails_letta` DB.
    3.  Generate the static **Embed Script**.
- **Runtime**: ZERO runtime responsibility. It is NOT involved in chat.

#### C. Embed Widget (Runtime)
- **Role**: The Chat Interface.
- **Nature**: Stateless, Vanilla JS artifact imported into Customer Frontend.
- **Constraint**: NEVER talks to Customer Backend directly. Only talks to `rails_letta`.

### 3. Data Flow & Tool Forwarding
1.  **Chat**: User -> Widget -> `rails_letta` -> Letta Engine.
2.  **Tool Needed**: Letta Engine -> Decides Tool -> `rails_letta` -> Customer Backend (same org).
3.  **Result**: Customer Backend -> `rails_letta` -> Letta Engine.
4.  **Security**: Customer data never leaves customer infrastructure except as strict tool results.

---

## PART 2: PROCESS & WORKFLOW

### 1. The Golden Rule
The file `.agent/plan/00-implementation-plan.md` (and corresponding Skills) is the **master plan**.
- **Phase 1**: `@01-setup-backend`
- **Phase 2**: `@02-build-widget`
- **Phase 3**: `@03-refactor-frontend`
- **Phase 4**: `@04-integration-test`

**Protocol**: Open the `SKILL.md` for your phase and follow it line-by-line.

### 2. Git Workflow
- **`main`**: Production.
- **`develop`**: Integration.
- **`feature/<name>`**: New features.
- **`fix/<name>`**: Bug fixes.
- **Commits**: Use Conventional Commits (`feat: ...`, `fix: ...`).

---

## PART 3: CODING & TESTING STANDARDS

### 1. Ruby on Rails Standards (Strict)
- **Strict RESTful**: Controllers MUST follow standard `index`, `show`, `create`, `update`, `destroy` actions.
    - **Constraint**: A controller MUST have **MAXIMUM 5 public methods**.
    - **Exception**: `Letta::AgentsController` may implement specific tool forwarding endpoints as required by the Letta Workflow.
- **Skinny Controllers**: **ABSOLUTELY NO BUSINESS LOGIC**.
    - Controllers are ONLY for parsing params and rendering responses.
    - **Rule**: If a controller method has more than 3 lines of logic, it is wrong.
- **Service Objects**:
    - Location: `app/services/letta/`.
    - Pattern: One public method (usually `call` or `execute`).
    - Use for ALL business logic.
- **Models**: `ActiveRecord` validations and scopes only. No complex logic.

### 2. Testing (RSpec)
- **Framework**: RSpec + Capybara.
- **Coverage**: Aim for 80%+.
- **Requirement**: Every API endpoint must have a request spec.
- **Run**: `bundle exec rspec`.

### 3. Code Review Checklist
Before marking a task complete:
1.  **Lint**: `bundle exec rubocop -A` (MUST PASS).
2.  **Test**: `bundle exec rspec` (MUST PASS).
3.  **Self-Cleanup**: No `puts`, commented-out code, or magic numbers.

---

## PART 4: OPERATIONAL RULES (AI BEHAVIOR)

### 1. Interaction Protocol (Strict)
- **Greeting**: You MUST start **EVERY** response with: `Xin chào boss Trọng`.
    - This is the signal that you are following the rules.
- **Conciseness**: Be direct and professional.

### 2. Tool Usage
- **Complex Logic**: Use `sequential-thinking`.
- **Testing**: Use `browser_subagent` (Playwright) or `integration_test` skill.
- **Research**: Use tools before assuming.

### 3. Coding Style
- **No Simple Comments**: Do not comment simple logic. Code is documentation.
- **Clean**: No fluff. Only comment if logic is extremely complex.

### 4. Fallback Policy (Strict)
- **Zero Implicit Fallback**: You must NEVER implement "fallback" logic (e.g., "if A fails, try B") without explicit user approval.
- **Explain First**: If a fallback strategy is needed, you must PAUSE, explain WHY it is necessary, and ask for permission before implementing.
- **Fail Fast**: By default, if an operation fails, raise an error. Do not try to guess a backup plan.
