# RAG Sources - Database Schema

This document defines the database schema for RAG data source management.

---

## 1. Schema Overview

Three tables to store:
1. **RAG Sources** - Collections of documents for a bot template
2. **RAG Documents** - Individual files or URLs
3. **RAG Chunks** - Processed text chunks for embedding

---

## 2. Table: `rag_sources`

**Purpose**: Group documents for a bot template.

| # | Column | Type | Constraints | Description |
|---|--------|------|-------------|-------------|
| 1 | `id` | uuid | PK | Primary key |
| 2 | `bot_template_id` | uuid | FK, Not Null | Link to bot template |
| 3 | `organization_id` | string | Not Null, Index | Multi-tenant isolation |
| 4 | `name` | string | Not Null | Source name |
| 5 | `description` | text | Nullable | Source description |
| 6 | `letta_source_id` | string | Nullable | Letta Engine source ID |
| 7 | `source_type` | string | | `file`, `url`, `text` |
| 8 | `total_chunks` | integer | Default 0 | Number of chunks |
| 9 | `total_tokens` | integer | Default 0 | Total tokens |
| 10 | `created_at` | timestamp | Not Null | Auto |
| 11 | `updated_at` | timestamp | Not Null | Auto |

---

## 3. Table: `rag_documents`

**Purpose**: Individual documents within a source.

| # | Column | Type | Constraints | Description |
|---|--------|------|-------------|-------------|
| 1 | `id` | uuid | PK | Primary key |
| 2 | `rag_source_id` | uuid | FK, Not Null | Parent source |
| 3 | `filename` | string | | Original filename |
| 4 | `content_type` | string | | MIME type |
| 5 | `url` | string | | URL (if source_type=url) |
| 6 | `file_size_bytes` | bigint | | File size |
| 7 | `status` | string | Default `'pending'` | `pending`, `processing`, `completed`, `failed` |
| 8 | `error_message` | text | | Error details if failed |
| 9 | `created_at` | timestamp | Not Null | Auto |
| 10 | `updated_at` | timestamp | Not Null | Auto |

---

## 4. Table: `rag_chunks`

**Purpose**: Text chunks for embedding.

| # | Column | Type | Constraints | Description |
|---|--------|------|-------------|-------------|
| 1 | `id` | uuid | PK | Primary key |
| 2 | `rag_document_id` | uuid | FK, Not Null | Parent document |
| 3 | `content` | text | Not Null | Chunk text |
| 4 | `chunk_index` | integer | | Order within document |
| 5 | `token_count` | integer | | Estimated tokens |
| 6 | `letta_chunk_id` | string | | Letta vector DB ID |
| 7 | `metadata` | jsonb | | Additional metadata |
| 8 | `created_at` | timestamp | Not Null | Auto |
| 9 | `updated_at` | timestamp | Not Null | Auto |

---

## 5. Migration

```ruby
class CreateRagTables < ActiveRecord::Migration[8.1]
  def change
    create_table :rag_sources, id: :uuid do |t|
      t.references :bot_template, type: :uuid, null: false, foreign_key: { to_table: :letta_bot_templates }
      t.string :organization_id, null: false, index: true
      t.string :name, null: false
      t.text :description
      t.string :letta_source_id
      t.string :source_type
      t.integer :total_chunks, default: 0
      t.integer :total_tokens, default: 0

      t.timestamps
    end

    create_table :rag_documents, id: :uuid do |t|
      t.references :rag_source, type: :uuid, null: false, foreign_key: { to_table: :rag_sources }
      t.string :filename
      t.string :content_type
      t.string :url
      t.bigint :file_size_bytes
      t.string :status, default: 'pending'
      t.text :error_message

      t.timestamps
    end

    create_table :rag_chunks, id: :uuid do |t|
      t.references :rag_document, type: :uuid, null: false, foreign_key: { to_table: :rag_documents }
      t.text :content, null: false
      t.integer :chunk_index
      t.integer :token_count
      t.string :letta_chunk_id
      t.jsonb :metadata

      t.timestamps
    end
  end
end
```

---

## Related

- [00-overview.md](./00-overview.md) - Feature overview
- [03-implementation.md](./03-implementation.md) - Model implementation
