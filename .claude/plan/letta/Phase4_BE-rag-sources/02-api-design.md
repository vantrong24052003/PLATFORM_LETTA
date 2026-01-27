# RAG Sources - API Design

This document defines the RESTful API endpoints for RAG source management.

---

## 1. Endpoint Overview

| Method | Path | Description |
|--------|------|-------------|
| POST | `/letta/bot_templates/:id/rag_sources` | Upload document to source |
| GET | `/letta/bot_templates/:id/rag_sources` | List sources |
| GET | `/letta/rag_sources/:id` | Get source details |
| DELETE | `/letta/rag_sources/:id` | Delete source |
| GET | `/letta/rag_sources/:id/documents` | List documents in source |

---

## 2. Upload Document

### POST /letta/bot_templates/:id/rag_sources

**Description**: Upload a document to a bot template's RAG source

**Request Body**:
```json
{
  "rag_source": {
    "name": "Product Manual",
    "source_type": "file",
    "file": "<base64_encoded_content>",
    "filename": "manual.pdf"
  }
}
```

**Response** (202 Accepted):
```json
{
  "data": {
    "id": "source-uuid",
    "name": "Product Manual",
    "status": "processing",
    "total_chunks": 0
  }
}
```

---

## 3. List Sources

### GET /letta/bot_templates/:id/rag_sources

**Response** (200 OK):
```json
{
  "data": [
    {
      "id": "source-uuid",
      "name": "Product Manual",
      "total_chunks": 45,
      "total_tokens": 12500,
      "created_at": "2026-01-24T12:00:00Z"
    }
  ]
}
```

---

## 4. Delete Source

### DELETE /letta/rag_sources/:id

**Response** (204 No Content)

---

## Related

- [00-overview.md](./00-overview.md) - Feature overview
- [03-implementation.md](./03-implementation.md) - Controller implementation
