---
name: 05-database-migration
description: "Safe database schema migration practices"
---

# Skill: Database Migration

## Purpose
This skill provides guidelines for safely changing database schemas in production environments without downtime.

## When to Use
- Adding new tables/columns
- Modifying existing schemas
- Data migrations
- Index optimization

---

## Guidelines

### 1. Migration Safety Principles

**Zero Downtime**:
- Never lock tables in production
- Use backward-compatible changes
- Deploy in multiple steps if needed

**Reversibility**:
- Always include rollback logic
- Test rollback before deploying
- Keep data intact during rollback

**Idempotency**:
- Safe to run multiple times
- Check existence before creating
- Use conditional logic

### 2. Safe Schema Changes

**✅ Safe Operations** (No downtime):
- Add new table
- Add new column (with default or nullable)
- Add index concurrently
- Create new views

**⚠️ Risky Operations** (Potential downtime):
- Rename column
- Change column type
- Add NOT NULL constraint
- Remove column

**❌ Dangerous Operations** (Avoid):
- Drop table with data
- Rename table actively used
- Change primary key
- Remove index without adding new one

### 3. Adding Columns

**Safe Pattern**:
```sql
-- Step 1: Add as nullable
ALTER TABLE users ADD COLUMN phone VARCHAR(20);

-- Step 2: Backfill data (if needed)
UPDATE users SET phone = default_value WHERE phone IS NULL;

-- Step 3: Add constraint (later)
ALTER TABLE users ALTER COLUMN phone SET NOT NULL;
```

**Avoid**:
```sql
-- Risky: Adding NOT NULL immediately
ALTER TABLE users ADD COLUMN phone VARCHAR(20) NOT NULL;
```

### 4. Removing Columns

**Multi-Step Process**:
```
Step 1: Stop writing to column (code deploy)
Step 2: Wait (ensure no old code running)
Step 3: Remove column from schema (migration)
Step 4: (Optional) Keep data backed up
```

**Timeline**:
- Week 1: Ignore column in code
- Week 2: Remove column from DB

### 5. Renaming Columns

**Avoid Direct Rename** (Causes downtime)

**Safe Pattern**:
```
Step 1: Add new column
Step 2: Write to both columns
Step 3: Backfill old data to new column
Step 4: Read from new column
Step 5: Stop writing to old column
Step 6: Remove old column
```

### 6. Changing Column Types

**Small Changes** (Safe):
- Increase VARCHAR length
- Change INT to BIGINT (PostgreSQL)

**Large Changes** (Risky):
- Use multi-step approach
- Create new column
- Migrate data
- Switch over

**Example**:
```sql
-- Instead of ALTER COLUMN type
ALTER TABLE users ADD COLUMN email_new TEXT;
UPDATE users SET email_new = email;
-- (Later) Drop old column
```

### 7. Adding Indexes

**Use Concurrent Index Creation**:
```sql
-- PostgreSQL
CREATE INDEX CONCURRENTLY idx_users_email ON users(email);

-- MySQL
CREATE INDEX idx_users_email ON users(email) ALGORITHM=INPLACE, LOCK=NONE;
```

**Strategy**:
- Create indexes during low-traffic periods
- Monitor index creation progress
- Test query performance before/after

### 8. Data Migrations

**Separate Schema and Data**:
- Schema migration first
- Data migration separately
- Use batching for large datasets

**Batching Pattern**:
```sql
-- Instead of UPDATE all rows
UPDATE users SET new_field = computed_value;

-- Use batches
UPDATE users 
SET new_field = computed_value 
WHERE id BETWEEN 1 AND 1000;
-- Repeat for next batch
```

### 9. Migration Naming

**Descriptive Names**:
- Include timestamp
- Describe action
- Mention table

**Examples**:
- `20250124_add_phone_to_users`
- `20250124_create_bot_templates`
- `20250124_index_agent_mappings_on_org`

### 10. Testing Migrations

**Pre-Deployment**:
- [ ] Test on copy of production data
- [ ] Verify migration runs successfully
- [ ] Test rollback works
- [ ] Check performance impact
- [ ] Verify application still works

**Post-Deployment**:
- [ ] Monitor error rates
- [ ] Check query performance
- [ ] Verify data integrity
- [ ] Monitor database metrics

---

## Migration Checklist

### Planning
- [ ] Identify schema change needed
- [ ] Choose safe migration strategy
- [ ] Plan multi-step approach if needed
- [ ] Estimate data volume impact

### Writing Migration
- [ ] Use framework migration tools
- [ ] Include up and down methods
- [ ] Add indexes concurrently
- [ ] Use transactions where appropriate

### Testing
- [ ] Test on development database
- [ ] Test on production-like dataset
- [ ] Verify rollback works
- [ ] Check application compatibility

### Deployment
- [ ] Run during low-traffic period
- [ ] Monitor migration progress
- [ ] Have rollback plan ready
- [ ] Verify success

---

## Common Patterns

### Add Column with Default
```sql
-- Safe
ALTER TABLE users 
ADD COLUMN status VARCHAR(20) DEFAULT 'active';
```

### Remove Column (Two-Step)
```sql
-- Step 1: Mark as ignored in code (deploy)
-- Step 2: Remove from DB
ALTER TABLE users DROP COLUMN old_field;
```

### Change Column Type (Three-Step)
```sql
-- Step 1: Add new column
ALTER TABLE users ADD COLUMN age_new INTEGER;

-- Step 2: Backfill
UPDATE users SET age_new = CAST(age AS INTEGER);

-- Step 3: Switch (later)
ALTER TABLE users DROP COLUMN age;
ALTER TABLE users RENAME COLUMN age_new TO age;
```

---

## Checklist for AI Agent

When creating migrations:
- [ ] Choose safe operation type
- [ ] Use backward-compatible approach
- [ ] Include rollback logic
- [ ] Add indexes concurrently
- [ ] Batch large data changes
- [ ] Test on production-like data
- [ ] Document multi-step process
- [ ] Plan deployment timing
