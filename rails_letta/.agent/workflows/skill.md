---
description: Execute a specific skill (01-06) with full re-test
---

# /skill - Execute Project Skill

## Usage
Specify which skill to run: `/skill 01`, `/skill 02`, `/skill 03`, `/skill 04`, `/skill 05`, `/skill 06`

---

## Available Skills

| Skill | Name | Path |
|-------|------|------|
| `01` | Setup Backend | `.agent/skills/01-setup-backend/SKILL.md` |
| `02` | Build Widget | `.agent/skills/02-build-widget/SKILL.md` |
| `03` | Refactor Frontend | `.agent/skills/03-refactor-frontend/SKILL.md` |
| `04` | Integration Test | `.agent/skills/04-integration-test/SKILL.md` |
| `05` | Debug | `.agent/skills/05-debug/SKILL.md` |
| `06` | Refactor | `.agent/skills/06-refactor/SKILL.md` |

---

## Workflow Steps

1. **Read the SKILL.md file** for the specified skill number.

2. **Follow the checklist line by line** as documented in the skill.

3. **After completing all steps**, run verification:

// turbo
```bash
bundle exec rubocop -A
```

// turbo
```bash
bundle exec rspec
```

4. **Report results** to the user with:
   - Completed tasks
   - Test results
   - Any issues found

---

## Example

User: `/skill 01`

→ Agent reads `.agent/skills/01-setup-backend/SKILL.md`
→ Agent follows all checklist items
→ Agent runs lint + test
→ Agent reports completion
