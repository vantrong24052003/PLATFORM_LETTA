---
description: Debug Rails Letta application issues
---

# Debug Workflow

// turbo-all

## Steps

1. Check service health
```bash
curl http://localhost:3000/up
```

2. Check Letta server health
```bash
curl http://localhost:8283/v1/health
```

3. Check recent logs for errors
```bash
tail -50 log/development.log | grep -i error
```

4. Read the debug skill for detailed checklist
```
View .agent/skills/05-debug/SKILL.md
```

5. If issue found, apply fix and verify with tests
```bash
bundle exec rspec
```
