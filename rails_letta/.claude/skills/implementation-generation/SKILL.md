---
name: implementation-generation
description: Generate code from PLAN (code generation specialist)
---

# Implementation Generation

**Purpose**: Convert tasks → actual code files

## Task Flow

```
Read PLAN → Read Reference Files → Generate Code → Write Files
```

### Step 1: Read PLAN
- Extract all tasks (T1, T2, T3...)
- Extract: File, Action, Description for each task
- Note reference files to follow patterns

### Step 2: Read Reference Files
For each task:
- If reference exists: Read it to understand pattern
- Note: Class structure, naming conventions, error handling
- Example: `Letta::Agents::List` → follow same pattern

### Step 3: Generate Code
For each task:
- If Action = "Create": Write new file following reference pattern
- If Action = "Modify": Edit existing file adding new code
- Follow Rails conventions:
  - Services: `app/services/letta/{feature}/{action}.rb`
  - Controllers: `app/controllers/letta/{name}_controller.rb`
  - Routes: `config/routes.rb`
  - Endpoints: `lib/integration/letta/endpoints.rb`

### Step 4: Write Files
- Create directories if needed
- Write each file
- Verify write success

## Code Patterns
- Service: `class ApplicationService; def call; ...; end; end`
- Controller: `class XxxController; def index; ...; end; end`
- Routes: `namespace :letta do resources :xxx end`
- Endpoints: `ENDPOINTS = { KEY: "/path" }.freeze`

## Constraints
- Follow existing patterns exactly
- Use Read before Write (never guess)
- Don't modify unrelated code

