---
allowed-tools: Read, Write, Edit, Bash, Grep, Glob
argument-hint: "<feature-name> --demo"
description: DEMO workflow: requirement -> code -> test -> fix -> push. MUST follow exact steps.
---

# workflow-demo - Complete Development Workflow DEMO

**Hello Boss!** This is the DEMO workflow to showcase Claude CLI capabilities.

---

## DEMO OBJECTIVE

**Key Point**: AI follows the DESIGNED WORKFLOW step-by-step - NOT "AI does everything autonomously".

**Workflow**: `Requirement -> Plan -> Code -> Test -> Fix -> Review -> Push`

**IMPORTANT**: This is a DEMO - show that AI follows process, not magic.

---

## GOLDEN RULES (MUST FOLLOW)

1. **NEVER skip steps** - Always execute in order
2. **ALWAYS read docs first** - Understand patterns before coding
3. **ASK for confirmation** - Before moving to next step
4. **SHOW your work** - Display what you are doing
5. **EXPLAIN your reasoning** - Don't just do, explain why
6. **NEVER assume feature** - ALWAYS ask what to build first

---

## WORKFLOW STEPS (EXACT ORDER)

---

## STEP 0: READ CONTEXT (MANDATORY - DO NOT SKIP)

### Command
```bash
# AI MUST read these files BEFORE anything else
cat .claude/docs/letta/00-what-is-letta.md
cat .claude/docs/letta/02-core-concepts.md
cat .claude/CLAUDE.md
```

### What AI does:
- Read Letta engine overview
- Understand core concepts
- Read project rules (CLAUDE.md)

### Constraints:
- NO DO NOT proceed without reading docs
- NO DO NOT guess patterns
- YES MUST understand Service Object pattern
- YES MUST understand organization scoping requirements

### Output:
```
[OK] Context loaded: Letta engine, Service Object pattern, org scoping rules understood
```

### Checkpoint:
AI MUST say: "Context loaded. Ready to gather requirements."

---

## STEP 1: GATHER REQUIREMENTS (CRITICAL - ASK FIRST!)

### FIRST QUESTION - ALWAYS ASK THIS FIRST

Before doing anything, AI MUST ask what feature to build:

```markdown
Boss, I will demo a complete development workflow.

**Before we start, what feature do you want to build?**

### Options:
1. **GET /letta/agents** - List all agents for current organization
   - Pros: Simple, good for demo, shows pagination & filtering
   - Cons: Might be too simple

2. **GET /letta/agents/:id** - Show single agent detail
   - Pros: Shows error handling, 404 cases
   - Cons: Less logic than list endpoint

3. **POST /letta/agent_mappings** - Create agent mapping
   - Pros: Shows association logic, more complex
   - Cons: Need to understand agent mapping flow

4. **PATCH /letta/agents/:id** - Update agent info
   - Pros: Shows update logic, partial update
   - Cons: Need to mock Letta API update

Which option do you choose, or do you want to demo a different feature?
```

### AFTER USER SELECTS FEATURE - ASK DETAILED QUESTIONS

Use `AskUserQuestion` tool to gather ALL requirements upfront. Ask 4-6 questions with 4 options each:

```markdown
## Required Questions (AI MUST ASK WITH 4 OPTIONS EACH):

### Question 1: API Design Style
Context: Define how the endpoint will be designed

Options:
1. **RESTful resource** - GET /letta/agents, /letta/agents/:id
   - Pros: Standard, easy to use, RESTful
   - Cons: Can over/under-fetch data

2. **RPC-style action** - POST /letta/listAgents
   - Pros: More flexible for complex operations
   - Cons: Not RESTful, hard to cache

3. **GraphQL** - Single endpoint with flexible queries
   - Pros: Exact data needed, single request
   - Cons: Need to setup GraphQL, more complex

4. **REST with nested resources** - GET /letta/organizations/:org_id/agents
   - Pros: Clear relationship, RESTful
   - Cons: Longer URLs

### Question 2: Authentication Method
Context: How to authenticate organization

Options:
1. **API Key header** - X-Organization-Key: <key>
   - Pros: Standard for APIs, simple
   - Cons: Key can leak if not HTTPS

2. **Bearer token** - Authorization: Bearer <token>
   - Pros: OAuth2 standard, has refresh token
   - Cons: More complex, need token management

3. **Query parameter** - ?api_key=<key>
   - Pros: Simplest
   - Cons: Not secure, logged in access logs

4. **HMAC signature** - Signed request with secret
   - Pros: Very secure, prevents replay attacks
   - Cons: Complex to implement, hard to debug

### Question 3: Response Format
Context: How to return data to client

Options:
1. **JSON response** - Standard JSON with data wrapper
   - Pros: Simple, universal support
   - Cons: Not real-time

2. **SSE streaming** - Server-Sent Events for real-time
   - Pros: Real-time updates
   - Cons: Complex, not all browsers support

3. **JSON with cursor-based pagination** - Next/prev cursor
   - Pros: Stable pagination for large datasets
   - Cons: More complex than offset-based

4. **JSON API format** - Standard JSON:API spec
   - Pros: Consistent structure, includes relationships
   - Cons: Verbose, learning curve

### Question 4: Pagination Strategy
Context: How to handle large result sets

Options:
1. **Kaminari offset-based** - page=1&per=20
   - Pros: Simple, easy to implement, Kaminari available
   - Cons: Slow for very large data, skip issues

2. **Cursor-based** - cursor=<last_id>
   - Pros: Fast, stable, realtime-safe
   - Cons: Cannot jump to random page

3. **No pagination** - Return all at once
   - Pros: Simplest
   - Cons: Slow, memory issues with large data

4. **Infinite scroll** - Load more on demand
   - Pros: Good UX for mobile/web apps
   - Cons: Complex to implement

### Question 5: Filtering & Searching
Context: How client can filter/sort data

Options:
1. **Basic filters only** - name, status, created_at
   - Pros: Simple, sufficient
   - Cons: Limited flexibility

2. **Advanced filters** - Multiple fields with AND/OR logic
   - Pros: Flexible, powerful
   - Cons: Complex parsing, security concerns

3. **Full-text search** - PostgreSQL full-text search
   - Pros: Powerful search, relevance ranking
   - Cons: Complex setup, indexing overhead

4. **No filters** - Return all records (with pagination)
   - Pros: Simplest
   - Cons: Client must filter locally

### Question 6: Error Handling Strategy
Context: How to return errors

Options:
1. **Standard JSON errors** - { error: "...", data: {...} }
   - Pros: Follows project pattern
   - Cons: Verbose for simple errors

2. **RFC 7807 Problem Details** - Standardized error format
   - Pros: Industry standard, detailed errors
   - Cons: Verbose, not commonly used

3. **Simple error codes** - { code: "AGENT_NOT_FOUND" }
   - Pros: Simple, easy client handling
   - Cons: Less context

4. **Rails default** - Use Rails exception handling
   - Pros: Built-in, less code
   - Cons: Inconsistent format
```

### Document Requirements

AFTER collecting all answers, document requirements:

```markdown
# Feature: [Name]

## Problem
[What are we solving?]

## Goals
- [ ] Goal 1
- [ ] Goal 2

## Success Criteria
1. [Criteria 1]
2. [Criteria 2]

## Technical Approach
- Service: `Letta::Module::Action`
- Endpoint: [METHOD] /letta/...
- Database: [Migration info]

## Decisions Made
- API Design: [chosen option]
- Authentication: [chosen option]
- Response Format: [chosen option]
- Pagination: [chosen option]
- Filtering: [chosen option]
- Error Handling: [chosen option]
```

### Checkpoint:
AI MUST say: "Requirements documented. Please confirm to proceed with planning."

---

## STEP 2: CREATE IMPLEMENTATION PLAN

### Command
```bash
/cm-create-and-update-plan "<feature-name>" "Phase1"
```

### What AI does:
1. Create plan folder: `.claude/plan/letta/Phase1_<feature>/`
2. Create exactly 5 files with templates
3. Fill in content based on requirements

### Constraints:
- NO DO NOT skip any template file
- NO DO NOT proceed without showing plan
- YES MUST create all 5 files
- YES MUST follow template structure

### Required Files (AI MUST CREATE ALL):
```
.claude/plan/letta/Phase1_<feature>/
+-- 00-overview.md           # Business goals, technical goals, acceptance criteria
+-- 01-database-schema.md    # Tables, columns, types, indexes
+-- 02-api-design.md         # Endpoints, methods, request/response
+-- 03-implementation.md     # Service, Controller, Model locations
+-- 04-testing.md            # Test cases, coverage targets
```

### Template for 00-overview.md:
```markdown
# <Feature Name> - Overview

**Feature**: [Description]
**Status**: IN PROGRESS

## Overview
[Brief description - 2-3 sentences]

## Business Goals
1. [Goal 1]
2. [Goal 2]

## Technical Goals
1. [Technical goal 1]
2. [Technical goal 2]

## Acceptance Criteria
- [ ] [Criteria 1]
- [ ] [Criteria 2]
- [ ] [Criteria 3]

## Constraints
- Must use organization scoping
- Must follow Service Object pattern
- Must have 100% test coverage
```

### Checkpoint:
AI MUST say: "Plan created at `.claude/plan/letta/Phase1_<feature>/`. Please review and confirm to proceed."

---

## STEP 3: IMPLEMENT CODE

### Command
```bash
/cm-implement-feature "<feature-name>"
```

### What AI does:
1. Read the plan from Step 2
2. Read existing code patterns
3. Implement in EXACT ORDER (DO NOT CHANGE ORDER)

### Constraints:
- NO DO NOT change implementation order
- NO DO NOT skip any step
- YES MUST follow Service Object pattern
- YES MUST use `frozen_string_literal: true`
- YES MUST enforce organization scoping

### Implementation Order (NON-NEGOTIABLE):
```
1. Database -> Create migration file
2. Run migration -> rails db:migrate
3. Model -> Create with validations
4. Service -> Create with business logic
5. Controller -> Create with API endpoint
6. Routes -> Add to config/routes.rb
```

### Code Templates (AI MUST FOLLOW):

#### Model Template:
```ruby
# frozen_string_literal: true

class Agent < ApplicationRecord
  belongs_to :organization

  validates :name, presence: true
  validates :organization, presence: true
end
```

#### Service Template:
```ruby
# frozen_string_literal: true

module Letta
  module Agents
    class Create < ApplicationService
      def call
        # Validate
        return { success: false, error: "Validation failed" } unless valid?

        # Business logic
        result = perform_action

        { success: true, data: result }
      rescue StandardError => e
        { success: false, error: e.message }
      end

      private

      def valid?
        # Validation logic
        true
      end

      def perform_action
        # Main business logic
      end
    end
  end
end
```

#### Controller Template:
```ruby
# frozen_string_literal: true

module Letta
  class AgentsController < ApplicationController
    def index
      result = Letta::Agents::List.new(current_organization, params).call
      render_json(result)
    end

    private

    def render_json(result)
      if result[:success]
        render json: { success: true, data: result[:data] }
      else
        render json: { success: false, error: result[:error] }, status: :unprocessable_entity
      end
    end
  end
end
```

### Critical Rules:
- YES ALL files start with `# frozen_string_literal: true`
- YES ALL queries use `current_organization` scoping
- YES Services return `{ success: true/false, data/error: ... }`
- YES Controllers are THIN, Services are THICK

### Commands AI MUST RUN:
```bash
# After migration
rails db:migrate

# After all code
bundle exec rubocop -a
```

### Output:
AI MUST display:
```
[OK] Files created:
- db/migrate/xxx_create_agents.rb
- app/models/agent.rb
- app/services/letta/agents/create.rb
- app/controllers/letta/agents_controller.rb

[OK] Migration applied
[OK] Routes configured
```

### Checkpoint:
AI MUST say: "Code implemented. Ready to write tests."

---

## STEP 4: WRITE TESTS

### Command
```bash
/cm-write-tests "<feature-name>"
```

### What AI does:
1. Read implemented code
2. Write tests in ORDER
3. Run tests with coverage

### Constraints:
- NO DO NOT skip any test type
- YES MUST target 100% coverage
- YES MUST test happy path AND edge cases

### Test Order (NON-NEGOTIABLE):
```
1. Model tests -> Validations, associations
2. Service tests -> Business logic, edge cases
3. Controller tests -> Request/response, authentication
```

### Test Templates (AI MUST FOLLOW):

#### Model Test:
```ruby
# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Agent do
  let(:organization) { create(:organization) }

  describe 'associations' do
    it { should belong_to(:organization) }
  end

  describe 'validations' do
    subject { build(:agent, organization:) }
    it { should validate_presence_of(:name) }
    it { should validate_presence_of(:organization_id) }
  end
end
```

#### Service Test:
```ruby
# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Letta::Agents::Create do
  let(:organization) { create(:organization) }
  let(:params) { { name: "Test", organization_id: organization.id } }

  describe "#call" do
    context "with valid params" do
      it "returns success with data" do
        result = described_class.new(params).call
        expect(result[:success]).to be true
        expect(result[:data]).to be_present
      end
    end

    context "with invalid params" do
      it "returns failure when name is missing" do
        result = described_class.new(params.merge(name: nil)).call
        expect(result[:success]).to be false
        expect(result[:error]).to be_present
      end
    end

    context "organization scoping" do
      it "only creates agent within organization" do
        result = described_class.new(params).call
        agent = Agent.find(result[:data][:id])
        expect(agent.organization).to eq(organization)
      end
    end
  end
end
```

#### Controller Test:
```ruby
# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Letta::AgentsController, type: :controller do
  let(:organization) { create(:organization) }

  before { sign_in_organization(organization) }

  describe "GET /letta/agents" do
    context "with valid authentication" do
      it "returns success with agents list" do
        create_list(:agent, 3, organization:)
        get :index

        expect(response).to have_http_status(:success)
        json = JSON.parse(response.body)
        expect(json['success']).to be true
        expect(json['data'].count).to eq(3)
      end
    end

    context "without authentication" do
      it "returns unauthorized" do
        sign_out_organization
        get :index
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context "organization scoping" do
      it "only returns agents for current organization" do
        org1_agents = create_list(:agent, 2, organization:)
        org2_agents = create_list(:agent, 3, organization: create(:organization))

        get :index
        json = JSON.parse(response.body)

        expect(json['data'].count).to eq(2)
      end
    end
  end
end
```

### Commands AI MUST RUN:
```bash
# Run tests
bundle exec rspec

# Check coverage
COVERAGE=true bundle exec rspec
```

### Test Coverage Requirements:
- YES Happy path (success case)
- YES Validation errors
- YES Edge cases (nil, empty, boundary)
- YES Organization scoping (CRITICAL)
- YES Authentication/authorization
- YES External APIs stubbed/mocked

### Output:

**IF TESTS PASS:**
```
[OK] All tests passing
[OK] Coverage: 100%
[OK] Ready for review
```

**IF TESTS FAIL:**
```
[X] Tests failing - Moving to debug step
Failing tests:
- [test name]
- [test name]
```

### Checkpoint:
- If pass: "Tests passing. Ready for review."
- If fail: "Tests failing. Moving to debug step."

---

## STEP 5: FIX ISSUES (ONLY IF TESTS FAIL)

### Command
```bash
/cm-debug-errors "<error-message>"
```

### What AI does:
1. Read error message / stack trace
2. Identify ROOT CAUSE (not symptoms)
3. Fix MINIMAL amount of code
4. Run tests again
5. Repeat until tests pass

### Constraints:
- NO DO NOT refactor during debug
- NO DO NOT change unrelated code
- YES MUST fix root cause only
- YES MUST add test to prevent recurrence

### Debug Process:
```
1. Read error -> What exactly is failing?
2. Find location -> Which file, which line?
3. Analyze -> Why is it failing?
4. Fix -> Change minimum code needed
5. Verify -> Run tests again
6. Repeat -> Until all tests pass
```

### Output Format:
```markdown
## Debug Report: [Error]

### Root Cause
**Error:** [error message]
**Location:** [file:line]
**Cause:** [explanation]

### Fix Applied
```ruby
# Show fixed code
```

### Verification
- [ ] Test now passing
- [ ] Regression test added
```

### Checkpoint:
AI MUST say: "Tests now passing. Ready for review."

---

## STEP 6: CODE REVIEW

### Command
```bash
/cm-review-code "<feature-name>"
```

### What AI does:
1. Review all code files
2. Check against checklist
3. Report issues found

### Constraints:
- YES MUST check security (organization scoping!)
- YES MUST check code style
- YES MUST check test coverage
- YES MUST check for N+1 queries

### Review Checklist:

#### Security (CRITICAL):
- [ ] Organization scoping enforced (NO `Agent.find`, USE `current_organization.agents.find`)
- [ ] Strong parameters used
- [ ] No hardcoded secrets
- [ ] HMAC verification if needed

#### Code Style:
- [ ] `frozen_string_literal: true` at top
- [ ] Proper naming (PascalCase classes, snake_case methods)
- [ ] Services return `{ success: true/false, data/error: ... }`
- [ ] Thin controllers, thick services

#### Testing:
- [ ] 100% coverage
- [ ] Organization scoping tested
- [ ] Edge cases covered
- [ ] External APIs stubbed

#### Performance:
- [ ] No N+1 queries
- [ ] Database indexes on foreign keys
- [ ] No unnecessary queries

### Output Format:
```markdown
## Code Review: <feature>

### Summary
Total files: X | Critical: Y | High: Z | Style: W

### Critical (Must Fix)
| File | Line | Issue | Fix |
|------|------|-------|-----|
| ... | ... | ... | ... |

### High Priority
| File | Line | Issue | Fix |
|------|------|-------|-----|
| ... | ... | ... | ... |

### Style Issues
| File | Line | Issue | Fix |
|------|------|-------|-----|
| ... | ... | ... | ... |

### Final Verdict
[OK] APPROVED for merge
OR
[X] NEEDS FIXES (see above)
```

### Checkpoint:
- If approved: "Code approved. Ready to push."
- If needs fixes: "Issues found. Please review."

---

## STEP 7: PUSH CODE

### Command
```bash
# AI generates commands, user executes (or AI executes with confirmation)
git add .
git commit -m "feat: implement <feature-name>"
git push origin feature/<feature-name>
```

### Constraints:
- NO DO NOT push without review approval
- YES MUST use conventional commit format
- YES MUST create feature branch

### Commit Message Format:
```
feat: implement <feature-name>

- Add service: Letta::<Module>::<Action>
- Add controller: Letta::<Controller>
- Add model: <Model>
- Add tests with 100% coverage

Closes #[issue-number]
```

### Output:
```
[OK] Code committed and pushed
Branch: feature/<feature-name>
Commit: [commit-hash]
```

### Checkpoint:
AI MUST say: "WORKFLOW COMPLETE!"

---

## PRESENTATION SCRIPT (FOR DEMO)

### Opening:
```
"Boss, today I want to demo a complete development workflow.

The key point is: I will NOT do everything autonomously.
I will follow the WORKFLOW that Boss designed.

Each step has a specific command with specific rules.
I will show you what I'm doing and why.

Let me start by reading the documentation to understand context."
```

### During Each Step:
```
"Step 1: Gathering requirements
- I will ask Boss 4-6 questions
- For each question, I offer 4 options
- I wait for Boss to confirm
- Then I document the requirements

[Execute step]

"Requirements documented. Boss, please confirm to proceed with planning."
```

### Closing:
```
"The workflow is complete.

Notice that:
1. I read docs first to understand patterns
2. I asked questions instead of assuming
3. I followed exact implementation order
4. I wrote tests with full coverage
5. I fixed issues systematically
6. I reviewed against checklist
7. I pushed only when approved

This is not AI magic - this is AI following a well-designed process."
```

---

## SUCCESS METRICS

### Demo is successful if:
- [OK] All 7 steps completed in order
- [OK] Each checkpoint was confirmed
- [OK] Code runs without errors
- [OK] Tests pass with 100% coverage
- [OK] Code review passes all checks
- [OK] Feature branch pushed

### Demo fails if:
- [X] Steps were skipped
- [X] Assumptions were made without asking
- [X] Code doesn't follow patterns
- [X] Tests are missing or failing
- [X] Security issues found in review

---

## TROUBLESHOOTING

### If tests fail in Step 4:
Go to Step 5 (Debug) -> Fix -> Return to Step 4

### If review fails in Step 6:
Fix issues -> Re-run Step 6

### If stuck:
Use `/cm-deep-analysis "Current blocker in workflow"`

---

**Boss, ready to demo the complete workflow!**
