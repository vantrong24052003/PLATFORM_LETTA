# Tool Approval Workflow - Reference

**Source**: Generic AI Agent Architecture Patterns  
**Purpose**: User approval mechanism for sensitive operations  
**Last Updated**: 2026-01-24

---

## Overview

Tool approval is a security pattern where AI agents request explicit user permission before executing sensitive operations. This prevents unauthorized actions and gives users transparency and control.

**Pattern Type**: Human-in-the-Loop (HITL)

---

## Workflow

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Agent decides to use tool                                │
├─────────────────────────────────────────────────────────────┤
│    Agent: "I need to delete user account #123"              │
│    Tool: delete_account(user_id="123")                      │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. System checks if tool requires approval                  │
├─────────────────────────────────────────────────────────────┤
│    Tool Registry: delete_account → requires_approval=true   │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Send approval request to user                            │
├─────────────────────────────────────────────────────────────┤
│    UI shows:                                                 │
│    ┌──────────────────────────────────────────┐            │
│    │ ⚠️ Approve action?                       │            │
│    │ Tool: delete_account                     │            │
│    │ User ID: 123                             │            │
│    │                                          │            │
│    │  [Approve ✓]    [Reject ✗]             │            │
│    └──────────────────────────────────────────┘            │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. User makes decision                                      │
├─────────────────────────────────────────────────────────────┤
│    Option A: User clicks "Approve" → Execute tool           │
│    Option B: User clicks "Reject" → Cancel action           │
│    Option C: Timeout (5 min) → Auto-reject                  │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. Execute or cancel                                        │
├─────────────────────────────────────────────────────────────┤
│    If approved: Tool executes, result returned to agent     │
│    If rejected: Agent receives rejection message            │
└─────────────────────────────────────────────────────────────┘
```

---

## HTTP API Pattern

### 1. Approval Request (Server → Client)

**Via SSE**:
```
event: approval_request
data: {
data:   "approval_id": "apr_123",
data:   "tool_name": "delete_account",
data:   "arguments": {"user_id": "123"},
data:   "description": "Permanently delete user account",
data:   "expires_at": "2026-01-24T12:05:00Z"
data: }
```

### 2. Approval Response (Client → Server)

**Approve**:
```http
POST /approvals/apr_123/approve
Content-Type: application/json

{
  "approved": true
}
```

**Response**:
```http
HTTP/1.1 200 OK

{
  "status": "approved",
  "executed_at": "2026-01-24T12:00:35Z"
}
```

**Reject**:
```http
POST /approvals/apr_123/reject
Content-Type: application/json

{
  "approved": false,
  "reason": "User has active subscription"
}
```

**Response**:
```http
HTTP/1.1 200 OK

{
  "status": "rejected",
  "reason": "User has active subscription"
}
```

---

## Tool Registry Format

Define which tools require approval:

```json
{
  "tools": [
    {
      "name": "search_database",
      "requires_approval": false,
      "description": "Search for records"
    },
    {
      "name": "delete_account",
      "requires_approval": true,
      "description": "Permanently delete user account",
      "danger_level": "high"
    },
    {
      "name": "send_email",
      "requires_approval": true,
      "description": "Send email on behalf of user",
      "danger_level": "medium"
    }
  ]
}
```

---

## State Management

### Approval States

```
pending → approved → executed
        → rejected
        → expired (timeout)
```

### Storage Pattern

**In-Memory** (Redis):
```
KEY: approval:apr_123
VALUE: {
  "tool_name": "delete_account",
  "arguments": {"user_id": "123"},
  "status": "pending",
  "created_at": "2026-01-24T12:00:00Z"
}
TTL: 300 seconds (5 minutes)
```

**Persistent** (Database):
```sql
CREATE TABLE tool_approvals (
  id VARCHAR PRIMARY KEY,
  tool_name VARCHAR NOT NULL,
  arguments JSON NOT NULL,
  status VARCHAR DEFAULT 'pending',
  approved_by VARCHAR,
  created_at TIMESTAMP,
  expires_at TIMESTAMP
);
```

---

## Timeout Behavior

**Default Timeout**: 5 minutes

**Auto-Rejection**:
- After timeout, approval status changes to `expired`
- Agent receives cancellation message
- User cannot approve after expiration

**Cleanup**:
- Expired approvals removed from storage
- Logged for audit trail

---

## Security Considerations

### 1. Authorization

**Verify Ownership**:
```http
POST /approvals/apr_123/approve
Authorization: Bearer user_token

# Server validates:
# - Token belongs to user who initiated chat
# - Approval belongs to that user's session
```

### 2. Audit Trail

**Log All Decisions**:
```json
{
  "approval_id": "apr_123",
  "user_id": "user_456",
  "tool_name": "delete_account",
  "status": "approved",
  "timestamp": "2026-01-24T12:00:35Z",
  "ip_address": "192.168.1.1"
}
```

### 3. Rate Limiting

**Prevent Abuse**:
- Max 10 pending approvals per user
- Max 100 approval requests per hour
- Block suspicious patterns

---

## UI Examples

### Modal Dialog

```
┌─────────────────────────────────────────┐
│ ⚠️ Action Requires Approval             │
├─────────────────────────────────────────┤
│                                         │
│ The AI wants to:                        │
│ Delete user account #123                │
│                                         │
│ ⚠️ This action cannot be undone        │
│                                         │
│ Do you want to approve this?            │
│                                         │
│  [Cancel]              [Approve ✓]     │
│                                         │
│ Expires in: 4:32                        │
└─────────────────────────────────────────┘
```

### Inline Card (Chat)

```
┌─────────────────────────────────────────┐
│ 🤖 Assistant                            │
├─────────────────────────────────────────┤
│ I can delete that account for you.      │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ 🔐 Approval Required                │ │
│ │                                     │ │
│ │ Tool: delete_account                │ │
│ │ User ID: 123                        │ │
│ │                                     │ │
│ │  [Reject]        [Approve]         │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

---

## Testing with cURL

```bash
# Simulate approval request (from server)
curl -N -H "Accept: text/event-stream" \
  http://localhost:4000/stream

# Output:
# event: approval_request
# data: {"approval_id":"apr_123","tool_name":"delete_account"}

# Approve
curl -X POST http://localhost:4000/approvals/apr_123/approve \
  -H "Content-Type: application/json" \
  -d '{"approved":true}'

# Reject
curl -X POST http://localhost:4000/approvals/apr_123/reject \
  -H "Content-Type: application/json" \
  -d '{"approved":false,"reason":"User changed mind"}'
```

---

## Best Practices

### 1. Clear Descriptions

❌ Bad:
```
Tool: update_record
Args: {id:123, val:"deleted"}
```

✅ Good:
```
Action: Delete order #123
Impact: Order will be permanently removed
Cannot be undone
```

### 2. Expire Quickly

- Don't let approvals linger
- 5 minutes is reasonable
- Show countdown timer

### 3. Log Everything

- Who approved/rejected
- When
- What arguments
- Execution result

---

## Common Patterns

### Pattern 1: Synchronous (Blocking)

Client sends request → Server blocks → Wait for approval → Return result

**Pros**: Simple  
**Cons**: Timeout issues, poor UX

### Pattern 2: Asynchronous (Polling)

Client sends request → Server returns `pending` → Client polls → Eventually gets result

**Pros**: No timeout  
**Cons**: High latency, server load

### Pattern 3: Asynchronous (SSE)

Client sends request → Server streams events → Approval request event → User approves → Execution result event

**Pros**: Real-time, efficient  
**Cons**: Requires SSE support

---

## References

- [Human-in-the-Loop AI](https://en.wikipedia.org/wiki/Human-in-the-loop)
- [OAuth 2.0 Device Authorization](https://oauth.net/2/device-flow/) (similar pattern)
- [SSE Specification](https://html.spec.whatwg.org/multipage/server-sent-events.html)
