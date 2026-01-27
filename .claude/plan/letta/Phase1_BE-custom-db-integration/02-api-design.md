# Custom DB Integration - API Design

**Feature**: Custom Database Schema for Letta Bot Templates  
**Status**: 🔴 Not Started  
**Parent**: [00-overview.md](./00-overview.md)

---

## Overview

This document defines the RESTful API endpoints for managing Letta bot templates.

---

## Endpoints

### 1. List Bot Templates
```
GET /letta/bot_templates
```

**Description**: Get all bot templates for the current organization

**Query Parameters**:
- `page` (integer, optional): Page number (default: 1)
- `per_page` (integer, optional): Items per page (default: 20, max: 100)

**Response** (200 OK):
```json
{
  "data": [
    {
      "id": 1,
      "name": "Customer Support Bot",
      "description": "Handles customer inquiries",
      "system_prompt": "You are a helpful customer support agent...",
      "human_name": "User",
      "persona_name": "Assistant",
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

### 2. Get Bot Template
```
GET /letta/bot_templates/:id
```

**Description**: Get a specific bot template by ID

**Response** (200 OK):
```json
{
  "data": {
    "id": 1,
    "name": "Customer Support Bot",
    "description": "Handles customer inquiries",
    "system_prompt": "You are a helpful...",
    "human_name": "User",
    "persona_name": "Assistant",
    "theme_config": { ... },
    "created_at": "2026-01-24T12:00:00Z",
    "updated_at": "2026-01-24T12:00:00Z"
  }
}
```

**Errors**:
- 404 Not Found: Template doesn't exist or belongs to different org

---

### 3. Create Bot Template
```
POST /letta/bot_templates
```

**Request Body**:
```json
{
  "bot_template": {
    "name": "Sales Assistant",
    "description": "Helps with sales inquiries",
    "system_prompt": "You are a sales expert...",
    "human_name": "Customer",
    "persona_name": "Sales Assistant",
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
    "id": 2,
    "name": "Sales Assistant",
    ...
  }
}
```

**Errors**:
- 422 Unprocessable Entity: Validation failed
  ```json
  {
    "errors": {
      "name": ["can't be blank"],
      "system_prompt": ["can't be blank"]
    }
  }
  ```

---

### 4. Update Bot Template
```
PATCH/PUT /letta/bot_templates/:id
```

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

### 5. Delete Bot Template
```
DELETE /letta/bot_templates/:id
```

**Response** (204 No Content): Empty body

**Errors**:
- 404 Not Found
- 422 Unprocessable Entity: Template has active agents

---

## Authentication

All endpoints require authentication via session or token (TBD).

**Headers**:
```
Authorization: Bearer <token>
```

Organization is determined from the authenticated user's context.

---

## Error Response Format

All errors follow this format:

```json
{
  "error": {
    "code": "record_not_found",
    "message": "Bot template not found",
    "details": { ... }
  }
}
```

**Common Error Codes**:
- `record_not_found` (404)
- `validation_failed` (422)
- `unauthorized` (401)
- `forbidden` (403)
- `internal_server_error` (500)

---

## Rate Limiting

N/A - Not implemented in Phase 1

---

## Versioning

API version is included in URL path: `/letta/...`

Future versions will use: `/v2/letta/...`

---

## Testing Checklist

- [ ] GET /letta/bot_templates returns 200 with array
- [ ] GET /letta/bot_templates/:id returns 200 with single object
- [ ] GET /letta/bot_templates/:invalid_id returns 404
- [ ] POST /letta/bot_templates with valid data returns 201
- [ ] POST /letta/bot_templates with invalid data returns 422
- [ ] PATCH /letta/bot_templates/:id updates record
- [ ] DELETE /letta/bot_templates/:id removes record
- [ ] Multi-org isolation: User A cannot access User B's templates
