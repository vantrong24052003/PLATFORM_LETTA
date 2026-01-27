# Agent Search - API Design

**Status**: 🟡 **DESIGNED**
**Convention**: RESTful + JSON

---

## 1. Endpoints

### 1.1. List Agents

```
GET /letta/agents
```

**Query Parameters**:

| Param | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `organization_id` | integer | ✅ Yes | - | Current organization ID |
| `keyword` | string | No | - | Search in name + description |
| `from_date` | date | No | - | Filter created_at (ISO 8601) |
| `to_date` | date | No | - | Filter created_at (ISO 8601) |
| `page` | integer | No | 1 | Page number |
| `per_page` | integer | No | 20 | Items per page (max 100) |
| `sort_by` | string | No | created_at | Field to sort: name, created_at |
| `sort_order` | string | No | desc | Direction: asc, desc |

**Response 200**:
```json
{
  "success": true,
  "data": [
    {
      "id": "agent-uuid-123",
      "name": "Customer Support Bot",
      "description": "Handles customer inquiries",
      "system": "You are a helpful assistant...",
      "created_at": "2025-01-15T10:30:00Z",
      "updated_at": "2025-01-20T14:22:00Z",
      "tools": ["websearch", "memory_insert"],
      "tool_rules": []
    }
  ],
  "pagination": {
    "current_page": 1,
    "total_pages": 5,
    "total_count": 98,
    "per_page": 20
  }
}
```

**Response 400** (Invalid params):
```json
{
  "success": false,
  "error": "Validation failed",
  "details": {
    "per_page": ["must be less than or equal to 100"]
  }
}
```

**Response 401** (Unauthorized):
```json
{
  "success": false,
  "error": "Unauthorized"
}
```

---

### 1.2. Show Agent

```
GET /letta/agents/:id
```

**Path Parameters**:

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | ✅ Yes | Agent UUID (Letta agent ID) |

**Query Parameters**:

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `organization_id` | integer | ✅ Yes | For scoping validation |

**Response 200**:
```json
{
  "success": true,
  "data": {
    "id": "agent-uuid-123",
    "name": "Customer Support Bot",
    "description": "Handles customer inquiries",
    "system": "You are a helpful assistant...",
    "llm_config": {
      "model": "GLM-4.7",
      "model_endpoint_type": "openai",
      "context_window": 128000
    },
    "embedding_config": {
      "embedding_model": "text-embedding-3-small",
      "embedding_dim": 1536
    },
    "tools": ["websearch", "memory_insert"],
    "tool_rules": [],
    "memory_blocks": [],
    "include_base_tool_rules": false,
    "created_at": "2025-01-15T10:30:00Z",
    "updated_at": "2025-01-20T14:22:00Z"
  }
}
```

**Response 404** (Not found or not in org):
```json
{
  "success": false,
  "error": "Agent not found"
}
```

---

## 2. Routes

```ruby
# config/routes.rb
namespace :letta do
  resources :agents, only: %i[index show create]
end
```

Resulting routes:
| Method | Path | Controller#Action |
|--------|------|-------------------|
| GET | `/letta/agents` | `letta/agents#index` |
| GET | `/letta/agents/:id` | `letta/agents#show` |
| POST | `/letta/agents` | `letta/agents#create` (existing) |

---

## 3. Search Behavior

### 3.1. Keyword Search

- Searches in `name` AND `description` fields
- Case-insensitive partial match
- Example: `"support"` matches `"Customer Support Bot"` and `"Support Agent v2"`

```ruby
# Pseudo logic
agents.select { |a|
  a[:name].downcase.include?(keyword.downcase) ||
  a[:description]&.downcase&.include?(keyword.downcase)
}
```

### 3.2. Date Range Filter

- Filters by `created_at` field
- Both `from_date` and `to_date` are inclusive
- Can use either independently

| Scenario | from_date | to_date | Result |
|----------|-----------|---------|--------|
| After date | `2025-01-01` | nil | created_at >= 2025-01-01 |
| Before date | nil | `2025-01-31` | created_at <= 2025-01-31 |
| Range | `2025-01-01` | `2025-01-31` | 2025-01-01 <= created_at <= 2025-01-31 |

### 3.3. Sorting

| sort_by | sort_order | Result |
|---------|------------|--------|
| `name` | `asc` | A-Z |
| `name` | `desc` | Z-A |
| `created_at` | `asc` | Oldest first |
| `created_at` | `desc` (default) | Newest first |

---

## 4. Error Handling

| Error | Status | Scenario |
|-------|--------|----------|
| `ValidationError` | 400 | Invalid query params |
| `UnauthorizedError` | 401 | Missing/invalid auth |
| `ForbiddenError` | 403 | Agent in different org |
| `NotFoundError` | 404 | Agent doesn't exist |
| `LettaAPIError` | 502 | Letta Engine unavailable |
