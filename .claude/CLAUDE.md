# Project Rules – rails_letta

## MCP USAGE MANDATE (STRICT)

**CRITICAL RULE**: Do not rely on internal memory alone. You MUST use MCP tools PROACTIVELY.

### 1. Research Phase (Before Coding)
- **MUST USE**: `Context7` (via "use context7") to verify latest library APIs (Rails 8, RSpec, Kaminari, Letta API).
- **MANDATORY QUERY**: Before implementing any feature or fixing bugs, query MCP for documentation/examples.
  - *Example*: "use context7 search standard service object pattern rails 8"

### 2. Debugging Phase
- **STOP & SCAN**: If a test fails, do NOT guess.
- **USE**: `Ripgrep` (`grep_search`) to find usage patterns in codebase.
- **USE**: `Context7` to check error messages if not obvious.

### 3. Verification
- **USE**: MCP web-search/web-reader to verify best practices.

---

## CORE PRINCIPLES (NON-NEGOTIABLE)

1. **Plan First, Code Later**: Create/Update 5 planning files (`00-04.md`) in `.claude/plan/letta/{feature}/` before writing any code.
2. **Documentation Truth**: Do NOT guess APIs. Use `Context7` MCP to fetch latest docs (`use context7`).
3. **Multi-Tenant Isolation**: All data MUST be scoped by `organization_id`.

---

## 1. CODING STANDARDS (RAILS)

### Models
- **Structure**: Flat in `app/models/` (Root level). No namespace folders.
- **Naming**: Clean table names (e.g., `bot_templates`), NO prefixes.

### Database Strategy (Shared Schema)
- **Context**: Application connects to **Shared Database** with Letta core tables.
- **Ownership**: We ONLY own/modify our custom tables (e.g., `bot_templates`, `agent_mappings`).
- **Conflict Prevention**:
  - Do NOT touch existing tables unless explicitly authorized.
  - Migration Naming: Be specific (e.g., `create_bot_templates`) to avoid collisions.

### Controllers
- **Pattern**: **Skinny Controller**. Delegate logic to Services.
- **Location**: `app/controllers/letta/`
- **Responsibility**: Parse params → Call Service → Render Response.
- **Methods**: Strict RESTful (`index`, `show`, `create`, `update`, `destroy`).
- **Pagination**: Define `DEFAULT_LIMIT` and `DEFAULT_PAGE` constants. Use Kaminari `.page().per()`.

### Service Objects (Strict Pattern)
- **Folder Structure**: `app/services/letta/{resource_name}/` (NO `_service` suffix).
- **File Naming**: Action verbs (`create.rb`, `update.rb`, `delete.rb`).
- **Class Naming**: `Letta::Resource::Action` (e.g., `Letta::BotTemplates::Create`).
- **Inheritance**: MUST inherit from `ApplicationService`.
- **Invocation**: `Service.new(params).call`
- **Params**: Access via `params` accessor.
- **Return**: `{ success: true/false, data/error: ... }`

```ruby
# app/services/letta/bot_templates/create.rb
class Letta::BotTemplates::Create < ApplicationService
  def call
    # Logic using `params`
    { success: true, data: result }
  rescue StandardError => e
    { success: false, error: e.message }
  end
end
```

### Validations & Params
- **Strict**: Use `params.require(:key)` inline for mandatory params.
- **Merging**: Merge IDs or Objects into params before passing to Service.

### Rails Reminders
```ruby
# Queries
Agent.find(id)                    # raises if not found
Agent.find_by(name: "Test")       # returns nil
Agent.where(active: true)
Agent.page(params[:page]).per(20)

# CRUD
Agent.create!(name: "Test")
agent.update!(name: "New")
agent.destroy!

# Organization Scoping (CRITICAL)
current_organization.agents.find(params[:id])  # CORRECT
Agent.find(params[:id])                        # WRONG

# Associations
has_many :agents, dependent: :destroy    # plural
belongs_to :organization                 # singular
org.agents.create!(name: "Test")         # use association

# Strong Parameters
params.require(:agent).permit(:name, :description)
params.require(:agent).permit(tools: [:id, :name])

# Validations
validates :name, presence: true
validates :name, uniqueness: { scope: :organization_id }

# Scopes
scope :active, -> { where(active: true) }
scope :recent, -> { order(created_at: :desc) }

# JSONB
Agent.where("metadata->>'key' = ?", "value")
```

---

## 2. MCP TOOL USAGE (PRIORITY HIGH)

| Tool | Usage |
|------|-------|
| Context7 | MANDATORY for Docs/Examples |
| web-search | Find best practices |
| web-reader | Read documentation |
| Ripgrep | Code search |

---

## 3. REQUEST FLOW

```
Client → Rails Router → Controller → Service → PostgreSQL + Letta API → Response
```

---

## 4. WORKFLOW COMMANDS

| Command | Description |
|---------|-------------|
| `/create-architecture-documentation <feature> <phase>` | Generate phase plan |
| `/code-review <file>` | Review code quality |
| `/refactor-code <file>` | Refactor code |

---

## 5. DOCUMENTATION POLICY

- **Reference**: `.claude/docs/letta/` (11 docs: 00-10)
- **Plans**: `.claude/plan/letta/` (Phase plans: 00-04 structure)
- **Auto-Update**: Update plan files as implementation evolves.

---

## 6. GIT CONFIG

- **Branch**: `feature/name`
- **Commit**: Conventional Commits (`feat: ...`, `fix: ...`)

---

## 7. CRITICAL REMINDERS

### Before Coding
- Greet Boss first
- Ask before adding migrations/DB tables
- Ask before adding gems/dependencies

### Forbidden
- ❌ Reading `.env` files
- ❌ Hardcoding secrets
- ❌ Spam comments
- ❌ Cross-organization data access

### Required
- ✅ `# frozen_string_literal: true` at file top
- ✅ Organization scoping for all queries
- ✅ Tests (100% coverage)
- ✅ Follow existing patterns
