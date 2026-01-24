---
description: Setup project dependencies and database
---

# /setup - Project Setup

Initialize the Rails project environment, install dependencies, and set up the database.

---

## Usage Examples

**Full Setup** (First Time):
```
/setup
```

**Setup After Pull** (Dependencies changed):
```
/setup --quick
```

**Reset Database** (Fresh start):
```
/setup --reset
```

---

## Prerequisites

Before running setup:
- [ ] Ruby 3.2.6 installed (`ruby -v`)
- [ ] PostgreSQL running (`pg_isready`)
- [ ] Bundler installed (`gem install bundler`)
- [ ] Node.js installed (for asset pipeline)

---

## Workflow Steps

### 1. Install Ruby Dependencies

// turbo
```bash
bundle install
```

**What this does**:
- Installs gems from `Gemfile`
- Updates `Gemfile.lock`
- Compiles native extensions (if any)

**Troubleshooting**:
- If `pg` gem fails: Install PostgreSQL dev headers
- If SSL errors: Update ca-certificates

### 2. Create Database

// turbo
```bash
rails db:create
```

**Creates**:
- Development database: `rails_letta_development`
- Test database: `rails_letta_test`

**Skip if**: Databases already exist

### 3. Run Migrations

// turbo
```bash
rails db:migrate
```

**What this does**:
- Creates tables (`letta_bot_templates`, `letta_agent_mappings`)
- Adds indexes
- Runs custom SQL (if any)

**Output**: Migration version number

### 4. Seed Development Data (Optional)

// turbo
```bash
rails db:seed
```

**What this does**:
- Creates sample bot templates
- Creates test organizations
- Populates lookup tables

**Skip for**: Production

### 5. Verify Setup

**Check Database**:
// turbo
```bash
rails db:version
```

Expected: Latest migration timestamp

**Check Tables**:
```bash
rails dbconsole
> \dt
```

Expected: See `letta_bot_templates`, `letta_agent_mappings`

**Check Environment**:
```bash
rails about
```

Expected:
- Ruby version: 3.2.6
- Rails version: 8.1.1
- Database adapter: PostgreSQL

### 6. Install Frontend Dependencies (If Applicable)

If `package.json` exists:
```bash
npm install
```

### 7. Setup Environment Variables

**Create `.env`** (if not exists):
```bash
cp .env.example .env
```

**Required Variables**:
```
PORT=4000
LETTA_API_URL=http://localhost:8283
UI_URL=http://localhost:5173
```

---

## Quick Setup (Existing Project)

For developers pulling latest changes:

```bash
# Update dependencies
bundle install

# Run new migrations only
rails db:migrate

# Verify
rails db:version
```

---

## Reset Database (Nuclear Option)

**Warning**: Deletes all data!

```bash
# Drop, create, migrate, seed
rails db:reset
```

**Or step-by-step**:
```bash
rails db:drop
rails db:create
rails db:migrate
rails db:seed
```

---

## Common Issues

### PostgreSQL Not Running
**Symptom**: `could not connect to server`
**Solution**:
```bash
# macOS
brew services start postgresql@14

# Linux
sudo systemctl start postgresql
```

### Database Already Exists
**Symptom**: `database "rails_letta_development" already exists`
**Solution**: Skip `db:create`, run `db:migrate` only

### Migration Failed
**Symptom**: Error during migration
**Solution**:
```bash
# Rollback last migration
rails db:rollback

# Fix migration file, run again
rails db:migrate
```

### Missing Gem
**Symptom**: `cannot load such file -- dotenv`
**Solution**:
```bash
bundle install
```

---

## Output Artifacts

After setup:
- ✅ Dependencies installed (`Gemfile.lock`)
- ✅ Database created
- ✅ Migrations run (`db/schema.rb` updated)
- ✅ Seed data loaded (optional)
- ✅ Environment configured (`.env`)

---

## Verification

After running `/setup`:
- [ ] `bundle exec rails about` shows correct versions
- [ ] `rails db:version` shows latest migration
- [ ] `rails console` opens without errors
- [ ] `bundle exec rspec` runs (even if 0 tests)
- [ ] Server starts: `rails server`

---

## Next Steps

After setup complete:
1. Start Rails server: `rails server`
2. Verify health endpoint: `curl http://localhost:4000/up`
3. Run tests: `bundle exec rspec`
4. Start building!
