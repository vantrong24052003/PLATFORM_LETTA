# Tool Forwarding Hub - API Design

**Status**: ✅ **COMPLETED** (Outbound API Implemented)
**Convention**: Server-to-Server Contract

---

## 1. Outbound Interface (Rails -> Customer Backend)

The "Bidirectional Hub" outbound request specification. This is an internal execution contract and is invisible to the end user.

### 1.1. Tool Execution Forwarding
`POST https://{customer_domain}/letta/tools/execute`

**Request Headers**:
- `X-Letta-Signature`: HMAC SHA-256 signature calculated from the request body using a shared secret.
- `X-Organization-ID`: Source identifier for the tenant.
- `Content-Type`: `application/json`

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

**Expected Response (200 OK)**:
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

## 2. Error Protocol

| Failure Type | Handling Strategy |
| :--- | :--- |
| **Network Timeout** | Rails terminates the wait after 10 seconds and returns a "System Error" to the Letta Engine. |
| **Invalid Signature** | Customer Backend should return 401 Unauthorized. Rails reports "Access Denied" to the Letta Engine. |
| **Malformed Response** | If the Customer Backend returns non-JSON data, Rails treats it as a Generic Failure. |

---

## 3. Configuration Interface (Admin)

### 3.1. Register Customer Domain
`PATCH /letta/bot_templates/:id`

**Request Body**:
```json
{
  "bot_template": {
    "customer_domain": "api.letta-client.vn"
  }
}
```

**Outcome**: This value is persisted to the `bot_templates` table and used during the "Forwarding" step of the runtime orchestration.
