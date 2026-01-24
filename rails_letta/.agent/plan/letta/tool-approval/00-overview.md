# Tool Approval - Overview

**Feature**: User Approval Workflow for Letta Agent Tool Execution  
**Status**: 🔴 Not Started  
**Parent**: [../00-implementation-plan.md](../00-implementation-plan.md)

---

## Overview

Implement a secure workflow where Letta agents must request user approval before executing sensitive tools (e.g., database writes, external API calls, file operations). This provides users with transparency and control over agent actions.

---

## Business Goals

1. **Security**: Prevent unauthorized or unintended tool executions
2. **Transparency**: Users see exactly what the agent wants to do
3. **Control**: Users can approve or reject tool calls
4. **Audit Trail**: Track all approval decisions

---

## Technical Goals

1. **Tool Registry**: Define which tools require approval (`letta_tools` table)
2. **Approval Storage**: Store pending approvals (`letta_tool_approvals` table)
3. **Approval API**: Expose endpoints for approve/reject actions
4. **Widget UI**: Display approval requests to users
5. **Timeout Mechanism**: Auto-reject approvals after 5 minutes

---

## Dependencies

**Infrastructure**:
- PostgreSQL (existing)
- Letta Engine with tool approval support

**Previous Features**:
- Custom DB Integration (required)
- Streaming (optional, enhances UX)

---

## Out of Scope

- Custom tool development (use Letta's built-in tools)
- Multi-step approval workflows
- Role-based approval (all users can approve their own tools)
- Tool execution history/replay

---

## Acceptance Criteria

- [ ] Tools can be marked as `requires_approval`
- [ ] Approval requests are stored in database
- [ ] Widget displays approval UI correctly
- [ ] Approved tools execute successfully
- [ ] Rejected tools are cancelled
- [ ] Expired approvals are auto-rejected
- [ ] Multi-org isolation is enforced
- [ ] Tests pass with 80%+ coverage

---

## Timeline Estimate

**Duration**: 3-4 days

**Breakdown**:
- Day 1: Database schema & migrations
- Day 2: API endpoints & approval logic
- Day 3: Widget UI integration
- Day 4: Testing & timeout mechanism

---

## Tasks

See individual task files:
- [01-database-schema.md](./01-database-schema.md) - Tables for tools & approvals
- [02-api-design.md](./02-api-design.md) - Approval API endpoints
- [03-implementation.md](./03-implementation.md) - Service & controller logic
- [04-testing.md](./04-testing.md) - Testing strategy

---

## References

- [Letta Tool Approval Docs](http://localhost:8283/docs#tool-approval)
- Skill: [../../../skills/04-api-design/](../../../skills/04-api-design/)
- Skill: [../../../skills/05-database-migration/](../../../skills/05-database-migration/)
