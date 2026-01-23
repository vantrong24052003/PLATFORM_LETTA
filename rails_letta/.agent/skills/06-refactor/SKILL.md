---
name: Refactor Rails Code
description: Phase 6: Refactor and improve Rails Letta codebase
---

# Refactor Rails Code

Guidelines and checklist for refactoring `rails_letta` codebase.

## Prerequisites
- All tests passing before refactor
- Git branch created for refactor work

---

## Refactoring Checklist

### 1. Code Organization
- [ ] Controllers thin (delegate to services)
- [ ] Business logic in services (`app/services/`)
- [ ] Concerns for shared behavior
- [ ] Constants defined (`app/lib/` or `config/`)

### 2. Controller Refactoring
- [ ] Single responsibility (one action, one purpose)
- [ ] Strong parameters defined
- [ ] Error handling via concerns
- [ ] Consistent response format

### 3. Service Refactoring
- [ ] One service per domain action
- [ ] Initialize with dependencies
- [ ] Return meaningful results
- [ ] Handle errors gracefully

### 4. Model Refactoring
- [ ] Validations present
- [ ] Associations defined
- [ ] Scopes for common queries
- [ ] No business logic in models

### 5. Code Quality
- [ ] Run RuboCop: `bundle exec rubocop -a`
- [ ] Remove dead code
- [ ] Remove comments (code should be self-documenting)
- [ ] DRY (Don't Repeat Yourself)

---

## Refactoring Patterns

### Extract Service Object
```ruby
# Before (in controller)
def create
  # 20 lines of logic
end

# After
def create
  result = MyService.new(params).call
  render json: result
end
```

### Extract Concern
```ruby
# app/controllers/concerns/renderable.rb
module Renderable
  def render_success(response:, status: :ok)
    render json: { data: response }, status: status
  end
end
```

### Use Constants
```ruby
# config/constants.rb or app/lib/
module LettaConfig
  DEFAULT_MODEL = 'GLM-4.7'.freeze
end
```

---

## Verification
- [ ] All tests still pass
- [ ] RuboCop passes
- [ ] No regressions
- [ ] Code reviewed
