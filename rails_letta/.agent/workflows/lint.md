---
description: Run RuboCop auto-correct to fix code style
---

# /lint - Auto-fix Code Style

// turbo
1. Run RuboCop with auto-correct:
```bash
bundle exec rubocop -A
```

2. If there are errors that can't be auto-fixed, show them to the user.

3. Commit the changes if all offenses are resolved.
