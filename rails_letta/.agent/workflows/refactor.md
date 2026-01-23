---
description: Refactor Rails Letta codebase
---

# Refactor Workflow

## Steps

1. Ensure tests pass before refactoring
```bash
bundle exec rspec
```

2. Run RuboCop auto-correct
// turbo
```bash
bundle exec rubocop -a
```

3. Read the refactor skill for guidelines
```
View .agent/skills/06-refactor/SKILL.md
```

4. Apply refactoring changes following the skill checklist

5. Run tests after refactoring
```bash
bundle exec rspec
```

6. Run RuboCop again to verify
// turbo
```bash
bundle exec rubocop
```
