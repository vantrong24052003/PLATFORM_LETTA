# Project Rules – LeTTa Platform (Consolidated)

## MCP USAGE MANDATE (STRICT)

**CRITICAL RULE**: Do not rely on internal memory alone. You MUST use MCP tools PROACTIVELY.

### 1. Research Phase (Before Coding)
- **MUST USE**: `Context7` (via "use context7") to verify latest library APIs (Rails 8, RSpec 8, Kaminari, Letta API).
- **MANDATORY QUERY**: Before implementing any feature or fixing bugs, query MCP for documentation/examples.
  - *Example*: "use context7 search standard service object pattern rails 8"

### 2. Debugging Phase
- **STOP & SCAN**: If a test fails, do NOT guess.
- **USE**: `Ripgrep` (`grep_search`) to find usage patterns in codebase.
- **USE**: `Context7` to check error messages if not obvious.

### 3. Verification
- **USE**: `Playwright` or `mcp_server` resources to validate if applicable.

---

## CORE PRINCIPLES (NON-NEGOTIABLE)

1.  **Plan First, Code Later**: Create/Update 5 planning files (`00-04.md`) in `.agent/plan/letta/{feature}/` before writing any code.
2.  **Documentation Truth**: Do NOT guess APIs. Use `Context7` MCP to fetch latest docs (`use context7`).
3.  **Multi-Tenant Isolation**: All data MUST be scoped by `organization_id`.

---

## 1. CODING STANDARDS (RAILS)

### Models
- **Structure**: Flat in `app/models/` (Root level). No namespace folders.
- **Naming**: Clean table names (e.g., `bot_templates`), NO prefixes.

### Database Strategy (Shared Schema)
- **Context**: The application connects to a **Shared/Self-Hosted Database** containing many existing tables (Letta core, Platform core, etc.).
- **Ownership**: We ONLY own/modify our custom tables (e.g., `bot_templates`, `agent_mappings`).
- **Conflict Prevention**: 
  - Do NOT touch existing tables unless explicitly authorized.
  - Virtual Models (like `Agent`) are used for External Entities to avoid accidental mapping to existing DB tables (like `agents`).
  - Migration Naming: Be specific (e.g., `create_agent_mappings`) to avoid collisions.

### Controllers
- **Pattern**: **Skinny Controller**. Delegate logic to Services.
- **Responsibility**: Parse params -> Call Service -> Render Response (using `Renderable`).
- **Methods**: Strict RESTful (`index`, `show`, `create`, `update`, `destroy`).
- **Pagination**: Define `DEFAULT_LIMIT` and `DEFAULT_PAGE` constants per controller. Use Kaminari `.page().per()`.
- **Error Handling**: Rely on `Renderable` module for `RecordNotFound` and `ParameterMissing`.

### Service Objects (Strict Pattern)
- **Folder Structure**: `app/services/{namespace}/{resource_name}/` (e.g., `app/services/letta/bot_templates/`). **NO `_service` suffix in folder**.
- **File Naming**: Action verbs (`create.rb`, `update.rb`, `delete.rb`).
- **Class Naming**: `Letta::Resource::Action` (e.g., `Letta::BotTemplates::Create`).
- **Inheritance**: MUST inherit from `ApplicationService`.
- **Invocation**: `Service.new(params).call` (Instance method).
- **Params**: `ApplicationService` handles initialization. Access via `params` accessor.

  ```ruby
  # app/services/letta/bot_templates/create.rb
  class Letta::BotTemplates::Create < ApplicationService
    def call
      # Logic using `params`
    end
  end
  ```

### Validations & Params
- **Strict**: Use `params.require(:key)` inline for mandatory params.
- **Merging**: Merge IDs or Objects into params before passing to Service if needed.

---

## 2. MCP TOOL USAGE (PRIORITY HIGH)

- **Context7**: MANDATORY for Docs/Examples.
- **Playwright**: MANDATORY for E2E Verification.
- **Ripgrep**: For Code Search (instead of slow grep).

---

## 3. WORKFLOW COMMANDS

| Command | Description |
|---|---|
| `/feature` | Create new feature plan structure |
| `/test` | Run RSpec (`bundle exec rspec`) |
| `/lint` | Run RuboCop (`bundle exec rubocop -A`) |
| `/refactor` | Refactor code logic |

---

## 4. DOCUMENTATION POLICY

- **No Unauthorized Edits**: Report errors in `.agent/docs/` to User first.
- **Auto-Update**: Update `.agent/plan/` files as implementation evolves.

---

## 5. GIT CONFIG
- **Branch**: `feature/name`.
- **Commit**: Conventional Commits (`feat: ...`, `fix: ...`).
