# Agent Search - API Design

This document defines the RESTful API endpoints for agent search.

---

## 1. Endpoint Overview

| Method | Path | Description |
|--------|------|-------------|
| GET | `/letta/agents` | List agents with search & filters |
| GET | `/letta/agents/:id` | Get single agent details |

---

## 2. List Agents

### GET /letta/agents

**Query Parameters**:
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `keyword` | string | - | Search in name + description |
| `from_date` | date | - | Filter created_at from |
| `to_date` | date | - | Filter created_at to |
| `page` | integer | 1 | Page number |
| `per_page` | integer | 20 | Items per page (max 100) |
| `sort_by` | string | created_at | Field to sort |
| `sort_order` | string | desc | asc or desc |

**Response** (200 OK):
```json
{
  "data": [
    {
      "id": "agent-uuid-123",
      "name": "Customer Support Bot",
      "description": "Handles inquiries",
      "created_at": "2025-01-15T10:30:00Z",
      "tools": ["websearch", "memory_insert"]
    }
  ],
  "meta": {
    "current_page": 1,
    "total_pages": 5,
    "total_count": 98,
    "per_page": 20
  }
}
```

---

## 3. Get Agent

### GET /letta/agents/:id

**Response** (200 OK):
```json
{
  "data": {
    "id": "agent-uuid-123",
    "name": "Customer Support Bot",
    "system": "You are helpful...",
    "llm_config": { "model": "GLM-4.7" },
    "tools": ["websearch"]
  }
}
```

**Errors**: 404 Not Found, 403 Forbidden (wrong org)

---

## Related

- [00-overview.md](./00-overview.md) - Feature overview
- [03-implementation.md](./03-implementation.md) - Controller implementation
