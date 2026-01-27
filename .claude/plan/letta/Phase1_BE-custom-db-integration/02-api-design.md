# Custom DB Integration - API Design

This document defines the RESTful API endpoints for managing Letta bot templates.

---

## 1. Endpoint Overview

| Method | Path | Description |
|--------|------|-------------|
| GET | `/letta/bot_templates` | List all bot templates |
| GET | `/letta/bot_templates/:id` | Get a specific bot template |
| POST | `/letta/bot_templates` | Create a new bot template |
| PATCH | `/letta/bot_templates/:id` | Update a bot template |
| DELETE | `/letta/bot_templates/:id` | Delete a bot template |

---

## 2. List Bot Templates

### GET /letta/bot_templates

**Description**: Get all bot templates for the current organization

**Query Parameters**:
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | integer | No | 1 | Page number |
| `per_page` | integer | No | 20 | Items per page (max: 100) |

**Response** (200 OK):
```json
{
  "data": [
    {
      "id": "uuid-123",
      "name": "Customer Support Bot",
      "greeting": "Hello! How can I help?",
      "status": "active",
      "system_prompt": "You are a helpful customer support agent...",
      "tools": ["search_order", "check_status"],
      "source_ids": [],
      "theme_config": {
        "primaryColor": "#3B82F6",
        "botAvatarUrl": "https://...",
        "bubbleIconUrl": "https://...",
        "footerText": "Powered by LeTTa"
      },
      "created_at": "2026-01-24T12:00:00Z",
      "updated_at": "2026-01-24T12:00:00Z"
    }
  ],
  "meta": {
    "current_page": 1,
    "total_pages": 3,
    "total_count": 45,
    "per_page": 20
  }
}
```

---

## 3. Get Bot Template

### GET /letta/bot_templates/:id

**Description**: Get a specific bot template by ID

**Response** (200 OK):
```json
{
  "data": {
    "id": "uuid-123",
    "name": "Customer Support Bot",
    "greeting": "Hello! How can I help?",
    "status": "active",
    "system_prompt": "You are a helpful...",
    "tools": ["search_order"],
    "source_ids": [],
    "theme_config": { ... },
    "created_at": "2026-01-24T12:00:00Z",
    "updated_at": "2026-01-24T12:00:00Z"
  }
}
```

**Errors**:
- 404 Not Found: Template doesn't exist or belongs to different org

---

## 4. Create Bot Template

### POST /letta/bot_templates

**Request Body**:
```json
{
  "bot_template": {
    "name": "Sales Assistant",
    "greeting": "Hi there! Need help with sales?",
    "system_prompt": "You are a sales expert...",
    "tools": ["search_product", "check_stock"],
    "source_ids": [],
    "theme_config": {
      "primaryColor": "#10B981",
      "botAvatarUrl": null,
      "bubbleIconUrl": null,
      "footerText": "Powered by LeTTa"
    }
  }
}
```

**Response** (201 Created):
```json
{
  "data": {
    "id": "uuid-456",
    "name": "Sales Assistant",
    ...
  }
}
```

**Errors** (422 Unprocessable Entity):
```json
{
  "error": {
    "code": "validation_failed",
    "message": "Validation failed",
    "details": {
      "name": ["can't be blank"],
      "system_prompt": ["can't be blank"]
    }
  }
}
```

---

## 5. Update Bot Template

### PATCH /letta/bot_templates/:id

**Request Body**: Same as Create (partial updates allowed)

**Response** (200 OK):
```json
{
  "data": { ... }
}
```

**Errors**:
- 404 Not Found
- 422 Unprocessable Entity

---

## 6. Delete Bot Template

### DELETE /letta/bot_templates/:id

**Response** (204 No Content): Empty body

**Errors**:
- 404 Not Found
- 422 Unprocessable Entity: Template has active agents

---

## 7. Authentication

All endpoints require authentication via session or token.

**Headers**:
```
Authorization: Bearer <token>
```

Organization is determined from the authenticated user's context.

---

## 8. Error Response Format

All errors follow this format:

```json
{
  "error": {
    "code": "error_code",
    "message": "Human-readable description",
    "details": { ... }
  }
}
```

**Common Error Codes**:
| Code | HTTP | Description |
|------|------|-------------|
| `record_not_found` | 404 | Resource not found |
| `validation_failed` | 422 | Invalid input data |
| `unauthorized` | 401 | Not authenticated |
| `forbidden` | 403 | Not authorized for this resource |
| `internal_server_error` | 500 | Server error |

---

## Related

- [00-overview.md](./00-overview.md) - Feature overview
- [03-implementation.md](./03-implementation.md) - Controller implementation
