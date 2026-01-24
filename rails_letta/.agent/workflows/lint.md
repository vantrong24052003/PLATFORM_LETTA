---
description: Run RuboCop auto-correct to fix code style
---

# /lint - Auto-fix Code Style

Automatically fix Ruby code style violations using RuboCop with safe auto-corrections.

---

## Usage Examples

**Basic Usage**:
```
/lint
```

**Check Specific Files**:
```
/lint app/controllers/
/lint app/services/letta/
```

**Strict Mode** (Fail on warnings):
```
/lint --strict
```

---

## Workflow Steps

### 1. Run RuboCop Auto-Correct

// turbo
```bash
bundle exec rubocop -A
```

**What this does**:
- Fixes formatting issues (spacing, indentation)
- Corrects simple style violations
- Updates outdated syntax
- Preserves code functionality

### 2. Review Auto-Fix Results

Check the output summary:
- ✅ Green: All offenses fixed
- ⚠️ Yellow: Some offenses remain (manual fix needed)
- ❌ Red: Syntax errors or critical issues

### 3. Handle Remaining Offenses

If unfixable offenses exist:
```bash
bundle exec rubocop --display-only-failed
```

**Common manual fixes**:
- Reduce method complexity (ABC size, cyclomatic)
- Shorten long lines (>120 chars)
- Simplify nested conditions

### 4. Verify Clean State

// turbo
```bash
bundle exec rubocop --format progress
```

Expected output:
```
Inspecting 50 files
..................................................

50 files inspected, no offenses detected
```

### 5. Commit Changes

If all offenses resolved:
```bash
git add -A
git commit -m "style: Run RuboCop auto-fix"
```

---

## Configuration

**RuboCop Config** (`.rubocop.yml`):
- Uses `rubocop-rails-omakase` preset
- Enforces strict Rails conventions
- Max line length: 120

**Excluded Files**:
- `db/schema.rb` (auto-generated)
- `bin/*` (system scripts)
- `node_modules/`, `tmp/`

---

## Common Issues

### Too Many Offenses
**Symptom**: 1000+ offenses to fix
**Solution**: Run `rubocop -A` multiple times, focus on critical files first

### Cop Disabled
**Symptom**: `# rubocop:disable` comments everywhere
**Solution**: Re-enable cops, fix properly instead of disabling

### Syntax Error
**Symptom**: RuboCop crashes with parse error
**Solution**: Fix syntax first, then run linter

---

## Output Artifacts

- Auto-corrected source files
- Git commit with style fixes
- Clean RuboCop report

---

## Verification

After running `/lint`:
- [ ] RuboCop shows 0 offenses
- [ ] Tests still pass (`bundle exec rspec`)
- [ ] Code functionality unchanged
- [ ] Git diff shows only style changes
