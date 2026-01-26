---
description: Debug Rails Letta application issues
---

# /debug - Application Debugging

Systematic debugging workflow for identifying and resolving Rails application issues.

---

## Usage Examples

**Quick Health Check**:
```
/debug
```

**Debug Specific Component**:
```
/debug api
/debug database
/debug letta-integration
```

**Debug with Logs**:
```
/debug --logs
```

---

## Required Information

| Field | Required | Example |
|-------|----------|---------|
| **Issue Description** | Recommended | "API returns 500 on POST /users" |
| **Component** | Optional | `api`, `database`, `letta` |
| **Error Message** | Optional | Full error from logs |

---

## Workflow Steps

### 1. Check Service Health

**Rails Server**:
// turbo
```bash
curl http://localhost:4000/up
```

Expected: `200 OK`

**Letta Engine**:
// turbo
```bash
curl http://localhost:8283/v1/health
```

Expected: `{"status": "healthy"}`

**Database**:
// turbo
```bash
rails db:version
```

Expected: Current migration version

### 2. Analyze Recent Logs

**Check Errors**:
// turbo
```bash
tail -100 log/development.log | grep -i error
```

**Full Recent Activity**:
```bash
tail -50 log/development.log
```

**What to Look For**:
- Exception class (e.g., `ActiveRecord::RecordNotFound`)
- Stack trace (line numbers)
- Request params (what triggered error)
- SQL queries (N+1, slow queries)

### 3. Component-Specific Checks

**API Issues**:
```bash
# Test endpoint directly
curl -X POST http://localhost:4000/letta/bot_templates \
  -H "Content-Type: application/json" \
  -d '{"bot_template": {"name": "Test"}}'
```

**Database Issues**:
```bash
# Check migrations
rails db:migrate:status

# Check specific table
rails dbconsole
> SELECT * FROM letta_bot_templates LIMIT 1;
```

**Letta Integration Issues**:
```bash
# Test Letta connection
curl http://localhost:8283/v1/agents
```

### 4. Interactive Debugging

**Rails Console**:
```bash
rails console
```

**Check Data**:
```ruby
# In console
Letta::BotTemplate.count
Letta::BotTemplate.last
Letta::AgentMapping.find_by(customer_user_id: 'test')
```

**Test Service**:
```ruby
# In console
service = Letta::AgentService.new(
  bot_id: 'abc', 
  user_id: 'test', 
  org_id: 'org1'
)
service.get_or_create_agent
```

### 5. Add Debug Logging

If issue is unclear, add temporary logging:

```ruby
# In controller/service
Rails.logger.debug "Params: #{params.inspect}"
Rails.logger.debug "Result: #{result.inspect}"
```

Then reproduce issue and check logs.

### 6. Review Skill for Deep Debugging

For systematic approach:
```
View .agent/skills/05-debug-application/SKILL.md
```

---

## Common Issues Checklist

### API Returns 500
- [ ] Check logs for exception
- [ ] Verify params format
- [ ] Test in Rails console
- [ ] Check database constraints

### Database Connection Failed
- [ ] Postgres running? (`pg_isready`)
- [ ] Check `database.yml`
- [ ] Verify credentials
- [ ] Run migrations

### Letta Engine Unreachable
- [ ] Check Letta server running
- [ ] Verify `ENV['LETTA_API_URL']`
- [ ] Test connection with curl
- [ ] Check network/firewall

### Agent Not Found
- [ ] Check `letta_agent_mappings` table
- [ ] Verify `letta_agent_id` exists in Letta
- [ ] Check organization_id matches

---

## Debugging Tools

**Log Analysis**:
```bash
# Filter by keyword
grep "AgentService" log/development.log

# Follow live logs
tail -f log/development.log
```

**Database Inspection**:
```bash
# PostgreSQL CLI
rails dbconsole

# List tables
\dt

# Describe table
\d letta_bot_templates
```

**Network Debugging**:
```bash
# Test HTTP endpoint
curl -v http://localhost:4000/letta/bot_templates

# Check port listening
lsof -i :4000
```

---

## Output Artifacts

- Issue identified (root cause)
- Fix applied (if deterministic)
- Debug logs (saved for reference)
- Updated tests (regression prevention)

---

## Verification

After debugging:
- [ ] Root cause identified
- [ ] Fix applied and tested
- [ ] Logs clean (no errors)
- [ ] Tests pass
- [ ] Issue documented (if needed)
