---
name: 03-write-tests
description: "Generic testing methodology and best practices"
---

# Skill: Write Tests

## Purpose
This skill provides guidelines for writing effective automated tests, regardless of testing framework or language.

## When to Use
- Adding new features (TDD approach)
- Bug fixes (regression prevention)
- Refactoring (safety net)
- Code review requirements

---

## Guidelines

### 1. Test Pyramid Strategy

**Unit Tests (70%)**:
- Test individual functions/methods
- Fast execution (milliseconds)
- Mock external dependencies
- High coverage of edge cases

**Integration Tests (20%)**:
- Test component interactions
- Database, API calls
- Slower than unit tests
- Focus on critical paths

**E2E Tests (10%)**:
- Test full user workflows
- Slowest, most brittle
- Cover happy path + critical scenarios
- Use sparingly

### 2. Test Structure (AAA Pattern)

**Arrange**: Set up test data and preconditions
**Act**: Execute the code under test
**Assert**: Verify the expected outcome

**Example Pattern**:
```
1. Create test data
2. Call function/endpoint
3. Check result is correct
4. Verify side effects (if any)
```

### 3. Unit Testing

**What to Test**:
- Business logic functions
- Validation rules
- Edge cases and error handling
- Boundary conditions

**What NOT to Test**:
- Framework code
- Third-party libraries
- Trivial getters/setters
- Configuration

**Mocking Strategy**:
- Mock external services (APIs, databases)
- Don't mock what you own
- Use test doubles (stubs, mocks, fakes)

### 4. Integration Testing

**What to Test**:
- Database queries and transactions
- API endpoint request/response
- Authentication/authorization flow
- External service integration

**Test Database**:
- Use separate test database
- Reset state between tests
- Use transactions for isolation
- Seed test data via fixtures/factories

### 5. Test Naming

**Be Descriptive**:
- Describe WHAT is being tested
- Include EXPECTED behavior
- Mention CONDITIONS if applicable

**Pattern**:
```
test_[method]_[scenario]_[expected_result]
should_[expected_behavior]_when_[condition]
```

**Examples**:
- `test_create_user_should_save_to_database`
- `should_return_error_when_email_invalid`
- `validate_age_rejects_negative_numbers`

### 6. Test Data Management

**Factories/Fixtures**:
- Use factories for dynamic test data
- Keep fixtures minimal and focused
- Don't share test data between unrelated tests

**Avoid Magic Values**:
- Use constants for test data
- Make test data meaningful
- Document non-obvious test data

### 7. Assertions

**Be Specific**:
- Assert exact values when possible
- Use appropriate assertion methods
- Check both positive and negative cases

**Common Assertions**:
- Equality: `assert_equal`, `expect().toBe()`
- Presence: `assert_not_nil`, `expect().toBeTruthy()`
- Collections: `assert_includes`, `expect().toContain()`
- Errors: `assert_raises`, `expect().toThrow()`

### 8. Test Coverage

**What Coverage Means**:
- % of code lines executed during tests
- NOT a quality metric by itself
- Aim for 80%+ on critical code

**What to Prioritize**:
- Business logic (100%)
- API endpoints (100%)
- Data models (80%+)
- Utilities (60%+)

---

## Testing Checklist

### Before Writing Tests
- [ ] Understand requirement clearly
- [ ] Identify testable units
- [ ] Plan test cases (happy path + edge cases)

### Writing Tests
- [ ] Follow AAA pattern
- [ ] Use descriptive names
- [ ] Mock external dependencies
- [ ] Test one thing per test
- [ ] Keep tests independent

### After Writing Tests
- [ ] All tests pass
- [ ] Coverage meets target (80%+)
- [ ] No flaky tests
- [ ] Tests run in reasonable time

---

## Common Patterns

### Test Edge Cases
- Empty input
- Null/undefined values
- Very large values
- Invalid formats
- Boundary conditions

### Error Testing
- Expected errors (validation failures)
- Unexpected errors (network issues)
- Error messages are meaningful
- Cleanup happens after errors

### Async Testing
- Use async/await or promises
- Set appropriate timeouts
- Test both success and failure
- Verify callback execution

---

## Checklist for AI Agent

When writing tests:
- [ ] Identify what to test
- [ ] Write failing test first (TDD)
- [ ] Implement code to pass test
- [ ] Refactor while keeping tests green
- [ ] Add edge case tests
- [ ] Verify coverage meets target
- [ ] Ensure tests are fast and reliable
