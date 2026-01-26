---
description: Refactor Rails Letta codebase
---

# /refactor - Code Refactoring

Improve code quality through systematic refactoring while maintaining functionality.

---

## Usage Examples

**Refactor Specific Component**:
```
/refactor services/letta/agent_service.rb
```

**Refactor Type**:
```
/refactor --extract-service (Extract service object)
/refactor --simplify (Reduce complexity)
/refactor --dry (Remove duplication)
```

**Safe Refactor** (With tests):
```
/refactor --safe
```

---

## Required Information

| Field | Required | Example |
|-------|----------|---------|
| **Target** | Recommended | `controllers/`, `services/letta_service.rb` |
| **Refactor Type** | Optional | `extract-service`, `simplify`, `dry` |
| **Reason** | Recommended | "Controller too fat", "Duplicate logic" |

---

## Workflow Steps

### 1. Pre-Refactor Verification

**Ensure Tests Pass**:
// turbo
```bash
bundle exec rspec
```

**Must be GREEN** before refactoring!

**Create Feature Branch**:
```bash
git checkout -b refactor/agent-service
```

### 2. Run Style Check

**Auto-fix Style Issues**:
// turbo
```bash
bundle exec rubocop -A
```

This separates style from logic changes.

### 3. Read Refactoring Skill

**Review Guidelines**:
```
View .agent/skills/06-refactor-code/SKILL.md
```

**Focus Areas**:
- Code smells (long methods, god objects)
- SRP violations (too many responsibilities)
- Duplication (DRY principle)
- Performance issues

### 4. Identify Code Smell

**Common Smells**:
- **Fat Controller**: Business logic in controller
- **God Object**: Class with 500+ lines
- **Long Method**: Method with 50+ lines
- **Duplicate Code**: Same logic in 3+ places

**Example**:
```ruby
# Before: Fat Controller (BAD)
class AgentMappingsController < ApplicationController
  def create
    # 50 lines of business logic here
  end
end
```

### 5. Apply Refactoring Pattern

**Extract Service Object**:
```ruby
# After: Skinny Controller (GOOD)
class AgentMappingsController < ApplicationController
  def create
    service = Letta::AgentService.new(params)
    result = service.get_or_create_agent
    render json: result
  end
end
```

**Extract Method**:
```ruby
# Before
def create
  if params[:name].present? && params[:email].valid?
    # ...
  end
end

# After
def create
  return render_error unless valid_params?
  # ...
end

private

def valid_params?
  params[:name].present? && params[:email].valid?
end
```

### 6. Run Tests After Each Change

// turbo
```bash
bundle exec rspec
```

**Must stay GREEN!**

### 7. Verify No New Offenses

// turbo
```bash
bundle exec rubocop
```

Expected: 0 new offenses

### 8. Commit Atomic Changes

**Small commits**:
```bash
git add app/services/letta/agent_service.rb
git commit -m "refactor: Extract AgentService from controller"
```

---

## Refactoring Patterns

### Pattern 1: Extract Service
**When**: Controller has business logic
**How**: Move to `app/services/`

### Pattern 2: Extract Concern
**When**: Shared behavior across models/controllers
**How**: Create module in `app/concerns/`

### Pattern 3: Replace Conditional with Polymorphism
**When**: Large switch/case statements
**How**: Use inheritance or strategy pattern

### Pattern 4: Consolidate Duplicate Code
**When**: Same logic in 3+ places
**How**: Extract to shared method/module

---

## Complexity Metrics

**RuboCop Cops to Watch**:
- `Metrics/AbcSize` - Assignment/Branch/Condition complexity
- `Metrics/CyclomaticComplexity` - Decision points
- `Metrics/MethodLength` - Lines in method
- `Metrics/ClassLength` - Lines in class

**Targets**:
- Method: < 15 lines
- Class: < 200 lines
- ABC Size: < 20
- Cyclomatic: < 10

---

## Common Refactoring Tasks

### Skinny Controllers
```ruby
# Move business logic to services
# Keep controllers < 5 lines per action
```

### DRY Services
```ruby
# Extract repeated logic to private methods
# Use composition over duplication
```

### Simplify Conditionals
```ruby
# Replace nested if/else with guard clauses
# Use early returns
```

### Optimize Queries
```ruby
# Fix N+1 queries with includes/joins
# Add database indexes
```

---

## Safety Checklist

Before each change:
- [ ] Tests are passing
- [ ] Change is small and focused
- [ ] Tests still pass after change
- [ ] No new RuboCop offenses
- [ ] Behavior is unchanged

---

## Output Artifacts

- Refactored code (improved quality)
- Green test suite (functionality preserved)
- Clean RuboCop report (0 offenses)
- Git commits (atomic changes)

---

## Verification

After refactoring:
- [ ] All tests pass
- [ ] RuboCop shows 0 offenses
- [ ] Code metrics improved (check ABC size, complexity)
- [ ] Functionality unchanged (manual test if needed)
- [ ] Performance maintained (benchmark if critical)
