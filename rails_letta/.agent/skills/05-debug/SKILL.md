---
name: Debug Rails Application
description: Phase 5: Debug and troubleshoot Rails Letta application issues
---

# Debug Rails Application

Systematic debugging workflow for `rails_letta` issues.

## Prerequisites
- Rails server running (`rails server`)
- Access to `rails console`
- Letta server accessible

---

## Debugging Checklist

### 1. Check Service Health
- [ ] Rails server running: `curl http://localhost:3000/up`
- [ ] Letta server running: `curl http://localhost:8283/v1/health`
- [ ] Database connected: `rails dbconsole`

### 2. Check Logs
- [ ] Rails logs: `tail -f log/development.log`
- [ ] Filter errors: `grep -i error log/development.log`
- [ ] Check request/response cycle

### 3. Debug API Issues
- [ ] Test endpoint with curl
- [ ] Check controller params: add `Rails.logger.debug params.inspect`
- [ ] Check service response
- [ ] Verify Letta API connection

### 4. Debug Database Issues
- [ ] Check migrations: `rails db:migrate:status`
- [ ] Verify table exists: `rails dbconsole` → `\dt`
- [ ] Check records: `Model.count` in console

### 5. Debug Letta Integration
- [ ] Test Letta connection: `Integration::Letta::Util::HttpClient.get(path: '/v1/health')`
- [ ] Verify agent exists: Check agent_id in Letta
- [ ] Check message flow

---

## Common Issues

### 1. Connection Refused
**Symptom**: `Connection refused - localhost:8283`
**Fix**: Start Letta server: `docker-compose up -d`

### 2. 404 Not Found
**Symptom**: Route not found
**Fix**: Check `rails routes | grep <endpoint>`

### 3. 500 Internal Error
**Symptom**: Server error
**Fix**: Check `log/development.log` for stack trace

### 4. Agent Not Found
**Symptom**: Letta returns 404 for agent
**Fix**: Verify agent_id exists, check agent_mappings table

---

## Debug Commands

```bash
# Check routes
rails routes | grep letta

# Rails console
rails console

# Check specific model
Letta::BotTemplate.first

# Test HTTP client
Integration::Letta::Util::HttpClient.get(path: '/v1/health')

# Check logs
tail -100 log/development.log
```

---

## Verification
- [ ] Issue identified
- [ ] Root cause found
- [ ] Fix applied
- [ ] Tests pass
