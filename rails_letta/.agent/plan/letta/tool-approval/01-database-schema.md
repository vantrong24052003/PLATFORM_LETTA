# Tool Approval - Workflow Implementation

**Feature**: User approval for Letta agent tool execution  
**Status**: 🔴 Not Started  
**Parent**: [../00-implementation-plan.md](../00-implementation-plan.md)

---

## Overview

Implement a workflow where Letta agents can request user approval before executing sensitive tools (e.g., database writes, external API calls, file operations).

---

## Goals

1. **Tool Registry**: Define which tools require approval
2. **Approval Flow**: Implement request/approve/reject cycle
3. **Widget UI**: Add approval interface to chat widget
4. **Backend Logic**: Handle approval state management

---

## Tasks

### Task 1: Tool Registry & Configuration
- [ ] Create `letta_tools` table (schema)
- [ ] Add `requires_approval` boolean column
- [ ] Seed common tools (search, calculate, etc.)
- [ ] Create `Tool` model with validations

### Task 2: Approval Request Flow
- [ ] Detect tool approval requests from Letta
- [ ] Store pending approvals in DB (`letta_tool_approvals` table)
- [ ] Create API endpoint: `POST /letta/agents/:id/tools/approve`
- [ ] Implement timeout mechanism (auto-reject after 5 minutes)

### Task 3: Widget UI Components
- [ ] Design approval modal/card UI
- [ ] Show tool name, description, parameters
- [ ] Add "Approve" / "Reject" buttons
- [ ] Display approval status in chat

### Task 4: Backend State Management
- [ ] Service: `Letta::ToolApprovalService`
- [ ] Handle approve action (send to Letta)
- [ ] Handle reject action (send to Letta)
- [ ] Clean up expired approvals (background job)

### Task 5: Testing
- [ ] Request specs for approval endpoints
- [ ] Service specs for approval logic
- [ ] E2E test: Trigger tool → Approve → Verify execution
- [ ] E2E test: Trigger tool → Reject → Verify cancellation

---

## Database Schema

### `letta_tools`
```ruby
create_table :letta_tools do |t|
  t.string :name, null: false
  t.text :description
  t.boolean :requires_approval, default: false
  t.jsonb :schema
  t.timestamps
end
```

### `letta_tool_approvals`
```ruby
create_table :letta_tool_approvals do |t|
  t.references :organization, null: false
  t.string :agent_id, null: false
  t.string :message_id, null: false
  t.string :tool_call_id, null: false
  t.string :tool_name, null: false
  t.jsonb :arguments
  t.string :status, default: 'pending' # pending, approved, rejected, expired
  t.datetime :expires_at
  t.timestamps
end
```

---

## Approval Flow Sequence

```
1. User sends message: "Create a new database entry"
2. Letta → Rails: Tool approval request
   {
     "type": "tool_approval_request",
     "tool_call_id": "call_abc123",
     "tool_name": "create_record",
     "arguments": {"table": "users", "data": {...}}
   }
3. Rails stores approval request (status: pending)
4. Rails → Widget: SSE event with approval request
5. Widget displays approval UI to user
6. User clicks "Approve"
7. Widget → Rails: POST /letta/agents/:id/tools/approve
8. Rails → Letta: Send approval
9. Letta executes tool
10. Letta → Rails: Tool result
11. Rails → Widget: Display result
```

---

## Widget UI Mock

```
┌─────────────────────────────────┐
│ 🤖 Agent wants to use a tool    │
├─────────────────────────────────┤
│ Tool: create_record             │
│ Description: Create a database  │
│   entry in the users table      │
│                                 │
│ Arguments:                      │
│   table: "users"                │
│   data: { name: "John" }        │
│                                 │
│  [Approve ✓]    [Reject ✗]     │
└─────────────────────────────────┘
```

---

## Acceptance Criteria

- [ ] Tools can be marked as requiring approval
- [ ] Approval requests are stored and expire after timeout
- [ ] Widget displays approval UI correctly
- [ ] Approved tools execute successfully
- [ ] Rejected tools are cancelled
- [ ] All tests pass (80%+ coverage)

---

## References

- [Letta Tool Approval Docs](http://localhost:8283/docs#tool-approval)
- Skill: `04-api-design` (RESTful principles)
- Skill: `05-database-migration` (Safe schema changes)
