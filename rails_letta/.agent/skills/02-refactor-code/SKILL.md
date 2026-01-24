---
name: 02-refactor-code
description: "Generic code refactoring principles and patterns"
---

# Skill: Code Refactoring

## Purpose
This skill provides best practices for refactoring backend code to improve maintainability, readability, and performance.

## When to Use
- Code becomes difficult to understand/modify
- Adding new features requires touching many files
- Tests are hard to write
- Performance issues arise

---

## Guidelines

### 1. Refactoring Principles

**Before You Start**:
- Ensure tests exist and pass
- Create a new branch
- Commit frequently (small changes)
- Run tests after each refactor

**Golden Rules**:
- DRY (Don't Repeat Yourself)
- KISS (Keep It Simple, Stupid)
- YAGNI (You Aren't Gonna Need It)
- Single Responsibility Principle

### 2. Code Organization

**Separation of Concerns**:
- **Controllers/Handlers**: Parse input, delegate to business logic, format output
- **Services/Use Cases**: Business logic, orchestration
- **Models/Entities**: Data structure, validation
- **Repositories/Data Access**: Database operations

**File Structure**:
- Group by feature, not by type
- Keep related code close together
- Extract shared logic to utilities

### 3. Common Refactoring Patterns

#### Extract Method
**When**: Function too long, doing multiple things
```
Before: 50-line function
After: 5-line function calling smaller helpers
```

#### Extract Class/Service
**When**: Class has too many responsibilities
```
Before: UserController handles auth, CRUD, notifications
After: AuthService, UserService, NotificationService
```

#### Replace Magic Numbers with Constants
**When**: Hardcoded values scattered throughout code
```
Before: if (age > 18)
After: if (age > LEGAL_AGE)
```

#### Consolidate Duplicate Code
**When**: Same logic appears in multiple places
```
Before: Copy-paste logic in 3 files
After: Shared utility function
```

### 4. Controller/Handler Refactoring

**Keep Thin**:
- Max 5-7 lines per action
- No business logic
- No database queries (use service/repository)

**Pattern**:
```
1. Parse input (params, headers)
2. Call service
3. Format response
4. Handle errors
```

### 5. Service/Business Logic Refactoring

**Single Responsibility**:
- One service per domain action
- Clear, descriptive naming
- Return meaningful results (not just true/false)

**Dependency Injection**:
- Pass dependencies in constructor
- Don't create dependencies inside service
- Makes testing easier

### 6. Model/Entity Refactoring

**Keep Focused**:
- Validations and associations only
- No business logic
- Use scopes for common queries
- Avoid callbacks (hard to test)

### 7. Code Quality Tools

**Linters**:
- Use language-specific linters (RuboCop, ESLint, Pylint)
- Auto-fix when possible
- Enforce style guide

**Code Coverage**:
- Aim for 80%+ coverage
- Focus on critical paths
- Don't test trivial code

---

## Refactoring Checklist

### Preparation
- [ ] All tests passing
- [ ] New branch created
- [ ] Backup/commit current state

### Execution
- [ ] Identify code smell (duplication, long methods, etc.)
- [ ] Apply refactoring pattern
- [ ] Run tests
- [ ] Commit

### Validation
- [ ] All tests still pass
- [ ] No new linter warnings
- [ ] Code easier to understand
- [ ] No performance regression

---

## Code Smells to Watch For

### Bloaters
- Long methods (100+ lines)
- Large classes (500+ lines)
- Long parameter lists (5+ params)

### Object-Orientation Abusers
- Switch statements (consider polymorphism)
- Refused bequest (inheritance issues)
- Temporary fields

### Change Preventers
- Divergent change (one class changes for many reasons)
- Shotgun surgery (one change requires many file edits)

### Dispensables
- Comments (code should be self-documenting)
- Dead code
- Duplicate code

---

## Checklist for AI Agent

When refactoring:
- [ ] Tests exist before starting
- [ ] Identify specific code smell
- [ ] Apply appropriate pattern
- [ ] Run tests after each change
- [ ] Commit small, incremental changes
- [ ] Run linter before finalizing
- [ ] Verify no regressions
