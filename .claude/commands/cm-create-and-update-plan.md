---
allowed-tools: Read, Write, Edit, Bash, Grep, Glob, mcp__web-search-prime__webSearchPrime, mcp__web-reader__webReader
argument-hint: "<feature-name> <phase-number>"
description: Create implementation plan with templates (00-04.md)
---

# cm-create-and-update-plan - Create Implementation Plan

**Hello Boss!** Create PLANS in `.claude/plan/letta/`.

---

## Step 1: ASK FIRST - What do you want to plan?

```markdown
## What do you want to plan?

1. **New feature** - New functionality from scratch
2. **Next phase** - Continue existing feature (Phase6, Phase7...)
3. **Update existing plan** - Modify current plan

Which one?
```

```markdown
## Feature/Phase name?

Please provide:
- Feature name (e.g., "agent-search", "webhook-integration")
- Phase number (if continuing)

Your input:
```

---

## Step 2: Read Existing Context

Read `.claude/CLAUDE.md`, `.claude/docs/letta/*.md`, and similar phase plans.

---

## Step 3: Show Plan Structure Before Creating

```markdown
## Will create:

.claude/plan/letta/Phase<N>_<feature>/
├── 00-overview.md       # Overview, Goals, Scope, Acceptance Criteria
├── 01-database-schema.md # Schema Overview, Tables, Migrations, Models
├── 02-api-design.md     # Endpoints, Authentication, Error Responses
├── 03-implementation.md # Request Flow, Models, Controllers, Services
└── 04-testing.md        # Coverage Goals, Model/Request/Service Specs

Approve? (yes/no)
```

---

## PLAN TEMPLATES (MUST FOLLOW DOCS CONVENTION)

### 00-overview.md Template
```markdown
# [Feature Name] - Overview

This document defines the implementation plan for [feature description].

---

## 1. Overview

[Brief description of what this feature does and why it matters]

---

## 2. Business Goals

1. [Goal 1]
2. [Goal 2]

---

## 3. Technical Goals

1. [Goal 1]
2. [Goal 2]

---

## 4. Scope

### In Scope
- [Item 1]
- [Item 2]

### Out of Scope
- [Item 1]
- [Item 2]

---

## 5. Dependencies

- [Dependency 1]
- [Dependency 2]

---

## 6. Acceptance Criteria

- [ ] [Criteria 1]
- [ ] [Criteria 2]

---

## Related

- [01-database-schema.md](./01-database-schema.md) - Database design
- [02-api-design.md](./02-api-design.md) - API endpoints
- [03-implementation.md](./03-implementation.md) - Code implementation
- [04-testing.md](./04-testing.md) - Testing strategy
```

### 01-database-schema.md Template
```markdown
# [Feature Name] - Database Schema

This document defines the database schema for [feature].

---

## 1. Schema Overview

[Description of tables and relationships]

---

## 2. Table: `[table_name]`

**Purpose**: [What this table stores]

| # | Column | Type | Constraints | Description |
|---|--------|------|-------------|-------------|
| 1 | `id` | uuid | PK | Primary key |
| 2 | `column_name` | type | Not Null, Index | Description |

---

## 3. Relationships

[Describe foreign keys and associations]

---

## 4. Migration Steps

```ruby
class MigrationName < ActiveRecord::Migration[8.1]
  def change
    # Migration code
  end
end
```

---

## 5. Model Definitions

```ruby
class ModelName < ApplicationRecord
  # Associations
  # Validations
  # Scopes
end
```

---

## Related

- [00-overview.md](./00-overview.md) - Feature overview
- [03-implementation.md](./03-implementation.md) - Model implementation
```

### 02-api-design.md Template
```markdown
# [Feature Name] - API Design

This document defines the RESTful API endpoints for [feature].

---

## 1. Endpoint Overview

[List all endpoints]

---

## 2. [Endpoint Name]

### [Method] /path

**Description**: [What this endpoint does]

**Request**:
```json
{
  "key": "value"
}
```

**Response** (200 OK):
```json
{
  "data": { ... }
}
```

**Errors**:
- 404 Not Found
- 422 Unprocessable Entity

---

## 3. Authentication

[Describe auth requirements]

---

## 4. Error Response Format

```json
{
  "error": {
    "code": "error_code",
    "message": "Description"
  }
}
```

---

## Related

- [00-overview.md](./00-overview.md) - Feature overview
- [03-implementation.md](./03-implementation.md) - Controller implementation
```

### 03-implementation.md Template
```markdown
# [Feature Name] - Implementation

This document defines the code implementation for [feature].

---

## 1. Request Flow

```
Client → Controller → Service → Model → Database
```

---

## 2. Models

### ModelName

**Location**: `app/models/model_name.rb`

```ruby
class ModelName < ApplicationRecord
  # Associations and validations
end
```

---

## 3. Controllers

### ControllerName

**Location**: `app/controllers/controller_name.rb`

```ruby
class ControllerName < ApplicationController
  # Actions
end
```

---

## 4. Service Objects

### ServiceName

**Location**: `app/services/service_name/action.rb`

```ruby
# frozen_string_literal: true

class ServiceName < ApplicationService
  def call
    # Implementation
  end
end
```

---

## Related

- [00-overview.md](./00-overview.md) - Feature overview
- [01-database-schema.md](./01-database-schema.md) - Database schema
- [02-api-design.md](./02-api-design.md) - API endpoints
```

### 04-testing.md Template
```markdown
# [Feature Name] - Testing

This document defines the testing strategy for [feature].

**Coverage Goal**: 80%+

---

## 1. Coverage Goals

| Component | Target |
|-----------|--------|
| Models | 95%+ |
| Controllers | 90%+ |
| Services | 90%+ |
| Overall | 80%+ |

---

## 2. Model Specs

```ruby
RSpec.describe ModelName, type: :model do
  # Tests
end
```

---

## 3. Request Specs

```ruby
RSpec.describe "Endpoint", type: :request do
  # Tests
end
```

---

## 4. Service Specs

```ruby
RSpec.describe ServiceName do
  # Tests
end
```

---

## 5. Running Tests

```bash
bundle exec rspec
```

---

## Related

- [00-overview.md](./00-overview.md) - Feature overview
- [03-implementation.md](./03-implementation.md) - Implementation code
```

---

**Boss, ready to clarify what to plan!**
