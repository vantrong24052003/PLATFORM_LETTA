# Tool Approval - Testing Strategy
 
 **Feature**: Verification of approval lifecycle  
 **Status**: 🔴 Not Started  
 
 ---
 
 ## 1. Unit Tests (RSpec)
 
 ### Model: `ToolApproval`
 - [ ] Validates `organization_id`, `agent_id`, `tool_call_id`.
 - [ ] Uniqueness of `tool_call_id`.
 - [ ] State transitions (pending → approved).
 
 ### Service: `Letta::StreamingMessages::Create`
 - [ ] Mock Letta stream with `approval_request_message`.
 - [ ] Verify `ToolApproval` record is created.
 - [ ] Verify event is yielded to the caller.
 
 ### Service: `Letta::Approvals::Execute`
 - [ ] Verify it sends correct JSON payload to Letta (`type: "approval"`).
 - [ ] Verify it handles expired approvals (raises error).
 - [ ] Verify it handles missing approvals (raises error).
 
 ---
 
 ## 2. Request Tests
 
 ### `POST /letta/approvals/:id/approve`
 - [ ] Success: Returns 200 and initiates stream.
 - [ ] Failure: 403 (Wrong Organization-ID).
 - [ ] Failure: 422 (Already processed).
 
 ---
 
 ## 3. E2E Tests (Playwright)
 - [ ] User triggers a tool requiring approval.
 - [ ] Widget displays the approval card.
 - [ ] User clicks "Approve".
 - [ ] Widget displays the tool execution result and agent continues.
 - [ ] User clicks "Reject".
 - [ ] Agent acknowledges the rejection and stops.
