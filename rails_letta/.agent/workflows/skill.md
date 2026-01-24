---
description: Execute a specific skill (01-10) with full verification
---

# /skill - Execute Project Skill

Run a specific skill from the skill library with systematic execution and verification.

---

## Usage Examples

**Execute Skill by Number**:
```
/skill 01
/skill 05
/skill 09
```

**Execute with Context**:
```
/skill 08 --context="Building user API"
/skill 09 --target="add phone column to users"
```

**List Available Skills**:
```
/skill --list
```

---

## Available Skills

| # | Name | Purpose | Path |
|---|------|---------|------|
| `01` | Debug Application | Web app debugging methodology | `skills/01-debug-application/` |
| `02` | Refactor Code | Code quality improvement patterns | `skills/02-refactor-code/` |
| `03` | Write Tests | Test-driven development practices | `skills/03-write-tests/` |
| `04` | API Design | RESTful API design principles | `skills/04-api-design/` |
| `05` | Database Migration | Safe schema change practices | `skills/05-database-migration/` |
| `06` | Code Review | Review best practices | `skills/06-code-review/` |
| `07` | Research | Research methodology for new tech | `skills/07-research/` |

---

## Workflow Steps

### 1. Read Skill File

**Load Skill**:
```
View .agent/skills/0X-skill-name/SKILL.md
```

**Understand**:
- Purpose and when to use
- Guidelines and principles
- Checklist items

### 2. Gather Context (If Needed)

Some skills require additional info:

**Skill 01 (Setup Backend)**:
- Project structure
- Database choice
- Multi-tenancy requirements

**Skill 09 (Database Migration)**:
- What schema change needed?
- Data volume estimate
- Downtime tolerance

### 3. Execute Skill Checklist

Follow the skill checklist **line by line**:

**Example (Skill 07 - Write Tests)**:
```
✅ Identify what to test
✅ Write failing test first (TDD)
✅ Implement code to pass test
✅ Refactor while keeping tests green
✅ Add edge case tests
✅ Verify coverage meets target
```

### 4. Verification Phase

After completing skill steps:

**Run Linter**:
// turbo
```bash
bundle exec rubocop -A
```

**Run Tests**:
// turbo
```bash
bundle exec rspec
```

**Skill-Specific Checks**:
- Skill 08 (API): Test endpoints with curl
- Skill 09 (Migration): Check `rails db:migrate:status`
- Skill 04 (Integration): Run E2E scenarios

### 5. Report Results

**Success Report**:
```
✅ Skill 05 (Debug Application) completed
✅ Issue identified: N+1 query in AgentsController
✅ Fix applied: Added .includes(:bot_template)
✅ Tests passing (50 examples, 0 failures)
✅ No RuboCop offenses
```

**Failure Report**:
```
⚠️ Skill 07 (Write Tests) - Issues Found:
❌ Coverage below 80% (current: 65%)
❌ 2 flaky tests detected
→ Recommendation: Fix identified issues before proceeding
```

---

## Skill Execution Matrix

### Development Skills (Build)
- **01**: Initial backend setup
- **02**: Widget development
- **03**: Frontend API integration

### Quality Skills (Improve)
- **06**: Code refactoring
- **07**: Writing tests
- **08**: API design
- **10**: Code review

### Operations Skills (Maintain)
- **04**: Integration testing
- **05**: Debugging
- **09**: Database migrations

---

## Advanced Usage

### Chain Skills
Execute multiple skills in sequence:

### Example 1: Execute Skill 05 (Database Migration)

```bash
# USER runs:
/skill 05

# AI Agent:
# 1. Views .agent/plan/letta/custom-db-integration/01-database-schema.md
# 2. Reads .agent/skills/05-database-migration/SKILL.md
# 3. Executes migration creation with safe practices
# 4. Runs scripts from skills/05-database-migration/scripts/
# 5. Validates migration follows best practices
# 6. Marks task complete in plan/letta/custom-db-integration/00-overview.md
```

### Example 2: Execute Skill 03 (Write Tests)

```bash
# USER runs:
/skill 03

# AI Agent:
# 1. Views current implementation files
# 2. Reads .agent/skills/03-write-tests/SKILL.md
# 3. Generates RSpec tests following TDD practices
# 4. Ensures 80%+ coverage
# 5. Runs bundle exec rspec to verify
```

### Skill with Plan
Combine skill with plan for guided execution:
```
# 1. Read plan
View .agent/plan/letta/custom-db-integration/00-overview.md

# 2. Execute corresponding skill
/skill 05

# 3. Follow plan checklist
```

---

## Common Skill Combinations

**New Feature Development**:
1. `/skill 04` (Design API)
2. `/skill 05` (Database migration)
3. `/skill 03` (Write tests)
4. `/skill 06` (Code review)
4. `/skill 10` (Review code)

**Bug Fix**:
1. `/skill 05` (Debug issue)
2. `/skill 07` (Write failing test)
3. Fix code
4. `/skill 04` (Integration test)

**Performance Optimization**:
1. `/skill 05` (Identify bottleneck)
2. `/skill 09` (Add database index)
3. `/skill 07` (Benchmark tests)
4. `/skill 04` (Verify improvement)

---

## Output Artifacts

After skill execution:
- Completed checklist items
- Code changes (if applicable)
- Test results
- Verification report
- Recommendations (if any)

---

## Verification

After running `/skill XX`:
- [ ] All skill checklist items completed
- [ ] Tests pass (`bundle exec rspec`)
- [ ] Linter clean (`bundle exec rubocop`)
- [ ] Skill-specific validation done
- [ ] Results reported to user
