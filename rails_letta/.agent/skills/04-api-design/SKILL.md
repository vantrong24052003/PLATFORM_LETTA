---
name: 04-api-design
description: "RESTful API design principles and best practices"
---

# Skill: API Design

## Purpose
This skill provides guidelines for designing clean, consistent RESTful APIs that are easy to use and maintain.

## When to Use
- Building new API endpoints
- Refactoring existing APIs
- Designing microservices
- Creating public-facing APIs

---

## Guidelines

### 1. RESTful Principles

**Resource-Based URLs**:
- Use nouns, not verbs
- Plural for collections
- Nested for relationships

**Examples**:
- ✅ `GET /users` (list users)
- ✅ `POST /users` (create user)
- ✅ `GET /users/123` (get specific user)
- ❌ `GET /getUsers` (verb-based)
- ❌ `POST /createUser` (RPC-style)

### 2. HTTP Methods

**Standard CRUD Mapping**:
- `GET` - Read (safe, idempotent)
- `POST` - Create
- `PUT` - Update (full replace)
- `PATCH` - Update (partial)
- `DELETE` - Delete (idempotent)

**Idempotency**:
- GET, PUT, DELETE should be idempotent
- Calling multiple times = same result
- POST is NOT idempotent

### 3. Status Codes

**Success (2xx)**:
- `200 OK` - Standard success
- `201 Created` - Resource created (POST)
- `204 No Content` - Success with no body (DELETE)

**Client Errors (4xx)**:
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Authenticated but no permission
- `404 Not Found` - Resource doesn't exist
- `422 Unprocessable Entity` - Validation failed

**Server Errors (5xx)**:
- `500 Internal Server Error` - Generic error
- `502 Bad Gateway` - Upstream service failure
- `503 Service Unavailable` - Temporary unavailable

### 4. Request/Response Format

**JSON Standard**:
- Use consistent casing (camelCase or snake_case)
- Include metadata (pagination, timestamps)
- Wrap data in envelope (optional)

**Request Body**:
```json
{
  "user": {
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Response Body**:
```json
{
  "data": {
    "id": "123",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2025-01-24T10:00:00Z"
  }
}
```

### 5. Error Handling

**Consistent Error Format**:
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email format",
    "details": [
      {
        "field": "email",
        "issue": "Must be valid email"
      }
    ]
  }
}
```

**Error Response Guidelines**:
- Always include meaningful message
- Provide error code for programmatic handling
- Include field-level details for validation errors
- Don't expose internal errors to users

### 6. Pagination

**Query Parameters**:
- `page` and `limit` (offset-based)
- `cursor` (cursor-based for large datasets)

**Response Metadata**:
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

### 7. Filtering & Sorting

**Query Parameters**:
- Filtering: `?status=active&role=admin`
- Sorting: `?sort=created_at&order=desc`
- Search: `?q=search+term`

**Keep Simple**:
- Use standard query params
- Document supported filters
- Validate filter values

### 8. Versioning

**URL Versioning** (Recommended):
- `/v1/users`
- `/v2/users`

**Header Versioning** (Alternative):
- `Accept: application/vnd.api+json; version=1`

**When to Version**:
- Breaking changes
- Different data structures
- Removed fields

### 9. Authentication & Authorization

**Authentication Methods**:
- Bearer Token (JWT)
- API Key
- OAuth 2.0

**Headers**:
```
Authorization: Bearer <token>
X-API-Key: <key>
```

**Authorization**:
- Check permissions after authentication
- Return 403 Forbidden if not allowed
- Scope by organization/tenant

### 10. Rate Limiting

**Headers**:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1643034000
```

**Response**:
- Status: `429 Too Many Requests`
- Include retry-after header

---

## API Design Checklist

### Planning
- [ ] Define resources and relationships
- [ ] Choose URL structure
- [ ] Plan authentication strategy
- [ ] Design error responses

### Implementation
- [ ] Use appropriate HTTP methods
- [ ] Return correct status codes
- [ ] Consistent request/response format
- [ ] Include pagination for lists
- [ ] Add filtering/sorting support

### Quality
- [ ] API is self-documented
- [ ] Error messages are helpful
- [ ] Responses are consistent
- [ ] Performance is acceptable
- [ ] Security is enforced

---

## Common Patterns

### Nested Resources
```
GET /users/123/posts
POST /users/123/posts
GET /posts/456
```

### Bulk Operations
```
POST /users/bulk-create
DELETE /users/bulk-delete
```

### Actions (Non-CRUD)
```
POST /users/123/activate
POST /orders/456/cancel
```

---

## Checklist for AI Agent

When designing APIs:
- [ ] Use RESTful conventions
- [ ] Choose appropriate HTTP methods
- [ ] Return correct status codes
- [ ] Design consistent JSON structure
- [ ] Plan error handling
- [ ] Add pagination for collections
- [ ] Consider versioning strategy
- [ ] Document API endpoints
