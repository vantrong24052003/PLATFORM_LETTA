---
name: 01-debug-application
description: "Generic debugging methodology for web applications"
---

# Skill: Debug Web Application

## Purpose
This skill provides a systematic approach to debugging backend web applications, regardless of framework or language.

## When to Use
- API returning unexpected responses
- Database connection issues
- External service integration failures
- Performance problems

---

## Guidelines

### 1. Establish Service Health

**Check All Components**:
- Backend server (API)
- Database
- External services/APIs
- Message queues (if applicable)

**Health Check Pattern**:
- Use dedicated health endpoints (e.g., `/health`, `/up`)
- Test database connectivity
- Verify external service accessibility

### 2. Log Analysis

**Structured Approach**:
1. Locate log files (e.g., `log/`, `logs/`, stdout)
2. Filter by severity (ERROR, WARN)
3. Look for stack traces
4. Identify patterns (repeated errors)

**What to Look For**:
- Request/response cycle
- SQL queries (N+1, slow queries)
- External API calls (timeouts, failures)
- Exception stack traces

### 3. API Debugging

**Isolation Strategy**:
1. Test endpoint directly (curl, Postman)
2. Verify request format (headers, body)
3. Check response status code
4. Inspect response payload

**Common Issues**:
- Route not found (404) → Check routing config
- Validation error (422) → Check params
- Server error (500) → Check logs for exception

### 4. Database Debugging

**Verification Steps**:
- Check migrations status
- Verify table exists
- Test query manually (SQL console)
- Check data integrity

**Common Issues**:
- Connection refused → Database not running
- Table doesn't exist → Migration not run
- Constraint violation → Data integrity issue

### 5. External Service Integration

**Debugging Pattern**:
1. Test service directly (bypass app)
2. Verify credentials/API keys
3. Check network connectivity
4. Review rate limits/quotas

**Error Handling**:
- Timeout → Increase timeout, check network
- 401/403 → Verify authentication
- 429 → Rate limit hit, implement backoff

---

## Debugging Checklist

### Initial Diagnosis
- [ ] Reproduce the issue consistently
- [ ] Check recent changes (git log)
- [ ] Review error logs
- [ ] Verify environment variables

### Deep Investigation
- [ ] Test components in isolation
- [ ] Add debug logging
- [ ] Use debugger/breakpoints
- [ ] Check database state

### Validation
- [ ] Issue identified
- [ ] Root cause understood
- [ ] Fix applied
- [ ] Tests added to prevent regression

---

## Common Patterns

### Connection Refused
**Symptom**: Service unreachable
**Diagnosis**: Check if service is running, verify port/host
**Fix**: Start service, correct configuration

### Unexpected Response
**Symptom**: API returns wrong data/format
**Diagnosis**: Log request params, check controller logic
**Fix**: Correct logic, add validation

### Slow Performance
**Symptom**: Requests take too long
**Diagnosis**: Check logs for slow queries, enable profiling
**Fix**: Optimize queries, add caching

---

## Checklist for AI Agent

When debugging:
- [ ] Check service health first
- [ ] Analyze logs systematically
- [ ] Isolate the failing component
- [ ] Test fix in isolation
- [ ] Verify fix resolves issue
- [ ] Add test to prevent regression
