# Agents List API - API Design

## Endpoint

### GET /letta/agents

List all agents for the current organization.

## Authentication

### Header
```
X-Organization-Key: <api_key>
```

### Behavior
- Returns 401 Unauthorized if header missing
- Returns 401 Unauthorized if API key invalid

## Request Parameters

### Query Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| page | integer | No | 1 | Page number for pagination |
| per | integer | No | 20 | Items per page (max 100) |
| name | string | No | - | Filter by agent name (partial match) |
| status | string | No | - | Filter by status (active/inactive) |

### Example Request
```bash
curl -X GET "https://api.example.com/letta/agents?page=1&per=20&name=support" \
  -H "X-Organization-Key: org_abc123"
```

## Response

### Success Response (200 OK)
```json
{
  "data": [
    {
      "id": "agent_123",
      "name": "Support Bot",
      "description": "Customer support agent",
      "system": "You are a helpful assistant...",
      "organization_id": "org_abc123",
      "created_at": "2026-01-28T00:00:00Z",
      "updated_at": "2026-01-28T00:00:00Z",
      "status": "active"
    }
  ],
  "pagination": {
    "current_page": 1,
    "total_pages": 5,
    "total_count": 100,
    "per_page": 20
  }
}
```

### Error Response (401 Unauthorized)
```json
{
  "error": "Unauthorized",
  "data": "Missing or invalid X-Organization-Key header"
}
```

### Error Response (400 Bad Request)
```json
{
  "error": "Bad Request",
  "data": { "per": ["must be less than or equal to 100"] }
}
```

## HTTP Status Codes
| Code | Description |
|------|-------------|
| 200 | Success - agents returned |
| 400 | Bad Request - invalid parameters |
| 401 | Unauthorized - missing/invalid API key |
| 500 | Internal Server Error |

## Filtering Examples

### By name (partial match)
```
GET /letta/agents?name=support
```
Returns agents with "support" in their name.

### By status
```
GET /letta/agents?status=inactive
```
Returns only inactive agents (is_deleted: true).

### Combined filters
```
GET /letta/agents?name=bot&status=active&page=1&per=10
```
Returns active agents with "bot" in name, first page, 10 per page.
