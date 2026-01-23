---
description: Run RSpec test suite
---

# /test - Run Tests

// turbo
1. Run the full RSpec test suite:
```bash
bundle exec rspec
```

2. If tests fail, analyze the output and suggest fixes.

3. Optionally run specific tests:
```bash
bundle exec rspec spec/services/
bundle exec rspec spec/controllers/
bundle exec rspec spec/models/
```
