# Tool Approval - API Design

This document defines the API endpoints for tool approval workflow.

---

## 1. Endpoint Overview

| Method | Path | Description | Status |
|--------|------|-------------|--------|
| POST | `/letta/approvals/:id/approve` | Approve tool execution | 🟡 Pending |
| POST | `/letta/approvals/:id/deny` | Deny tool execution | 🟡 Pending |

---

## 2. Outbound Interface (Rails → Customer Backend)

**Status**: ✅ **COMPLETED** (Outbound API Implemented)

### POST https://{customer_domain}/letta/tools/execute

**Request Headers**:
```
X-Letta-Signature: HMAC SHA-256 signature
X-Organization-ID: Source tenant identifier
Content-Type: application/json
```

**Payload**:
```json
{
  "tool_name": "query_inventory",
  "arguments": {
    "product_sku": "SKU-990",
    "warehouse_id": "VN-01"
  },
  "context": {
    "agent_id": "agent-xyz-777",
    "user_id": "customer-id-888"
  }
}
```

**Response** (200 OK):
```json
{
  "status": "success",
  "data": {
    "stock_level": 45,
    "next_restock": "2026-02-01"
  }
}
```

---

## 3. Approve Tool

### POST /letta/approvals/:id/approve

**Description**: Approve a tool execution request and resume stream

**Response** (200 OK):
```json
{
  "data": {
    "id": "approval-uuid",
    "status": "approved",
    "resolved_at": "2026-01-24T12:00:00Z"
  }
}
```

**Errors**:
- 403 Forbidden: Wrong organization
- 422 Unprocessable Entity: Already processed

---

## 4. Deny Tool

### POST /letta/approvals/:id/deny

**Request Body**:
```json
{
  "reason": "User does not have permission"
}
```

**Response** (200 OK):
```json
{
  "data": {
    "id": "approval-uuid",
    "status": "denied",
    "reason": "User does not have permission",
    "resolved_at": "2026-01-24T12:00:00Z"
  }
}
```

---

## 5. Error Protocol

| Failure Type | Handling Strategy |
|--------------|-------------------|
| Network Timeout | Terminate after 10s, return "System Error" |
| Invalid Signature | Customer returns 401, report "Access Denied" |
| Malformed Response | Treat as Generic Failure |

---

## Related

- [00-overview.md](./00-overview.md) - Feature overview
- [03-implementation.md](./03-implementation.md) - Controller implementation
