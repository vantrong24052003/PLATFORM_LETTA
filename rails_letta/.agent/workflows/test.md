---
description: Run RSpec test suite
---

# /test - Run Tests

Execute the full RSpec test suite or specific test files to verify code correctness.

---

## Usage Examples

**Run All Tests**:
```
/test
```

**Run Specific Directory**:
```
/test spec/services/
/test spec/controllers/letta/
```

**Run Single File**:
```
/test spec/services/letta/agent_service_spec.rb
```

**Run with Coverage Report**:
```
/test --coverage
```

**Watch Mode** (Re-run on file changes):
```
/test --watch
```

---

## Required Information

| Field | Required | Example |
|-------|----------|---------|
| **Test Path** | Optional | `spec/services/` |
| **Options** | Optional | `--coverage`, `--fail-fast` |

---

## Workflow Steps

### 1. Run Test Suite

**Full Suite**:
// turbo
```bash
bundle exec rspec
```

**Specific Path**:
```bash
bundle exec rspec spec/services/
```

### 2. Analyze Test Results

**Success Output**:
```
Finished in 2.5 seconds
50 examples, 0 failures
```

**Failure Output**:
```
Failures:

  1) Letta::AgentService#get_or_create_agent creates new agent
     Failure/Error: expect(result[:is_new]).to be true
       expected true
            got false
```

### 3. Debug Failures

If tests fail:

**a. Read Failure Message**:
- Line number of failure
- Expected vs actual values
- Stack trace

**b. Run Failed Test Alone**:
```bash
bundle exec rspec spec/path/to/failing_spec.rb:25
```

**c. Add Debug Output** (if needed):
```ruby
# In spec file
puts "Debug: #{variable.inspect}"
binding.pry # For interactive debugging
```

### 4. Check Code Coverage

// turbo
```bash
bundle exec rspec --format documentation
```

**View Coverage Report**:
```bash
open coverage/index.html
```

**Target**: 80%+ coverage on new code

### 5. Verify All Tests Pass

Before committing:
// turbo
```bash
bundle exec rspec --fail-fast
```

---

## Test Types

### Unit Tests (spec/models/, spec/services/)
- Test individual methods
- Mock external dependencies
- Fast execution (<5 sec)

### Request Tests (spec/requests/)
- Test API endpoints
- Full request/response cycle
- Database integration

### Integration Tests (spec/integration/)
- Test cross-component workflows
- External service integration
- Slower execution

---

## RSpec Configuration

**Spec Helper** (`spec/rails_helper.rb`):
- Database cleaner (reset between tests)
- FactoryBot for test data
- SimpleCov for coverage

**Format Options**:
- `--format progress`: Dots (fast)
- `--format documentation`: Full descriptions
- `--format json`: CI integration

---

## Common Issues

### Database State
**Symptom**: Random test failures
**Solution**: Ensure database_cleaner is configured

### Slow Tests
**Symptom**: Suite takes >1 minute
**Solution**: Mock external APIs, optimize factories

### Flaky Tests
**Symptom**: Tests pass/fail randomly
**Solution**: Fix timing issues, avoid sleep(), use proper waits

---

## Output Artifacts

- Test results (passed/failed)
- Coverage report (`coverage/index.html`)
- Failure details (if any)

---

## Verification

After running `/test`:
- [ ] All tests pass (0 failures)
- [ ] Coverage meets target (80%+)
- [ ] No flaky tests (run 3x to verify)
- [ ] Execution time acceptable (<30 sec for unit tests)
