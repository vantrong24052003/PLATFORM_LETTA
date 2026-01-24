# RAG Sources - Integration

**Feature**: Retrieval-Augmented Generation (RAG) data source management  
**Status**: 🔴 Not Started  
**Parent**: [../00-implementation-plan.md](../00-implementation-plan.md)

---

## Overview

Enable organizations to upload and manage data sources (documents, URLs, knowledge bases) that Letta agents can reference during conversations using RAG.

---

## Goals

1. **Data Source Management**: CRUD operations for RAG sources
2. **Document Processing**: Upload, parse, and chunk documents
3. **Vector Storage**: Integrate with Letta's vector database
4. **Agent Association**: Link RAG sources to specific bot templates
5. **Search & Retrieval**: Enable agents to query relevant context

---

## Tasks

### Task 1: Database Schema
- [ ] Create `letta_rag_sources` table
- [ ] Create `letta_rag_documents` table (individual files/URLs)
- [ ] Create `letta_rag_chunks` table (processed text chunks)
- [ ] Add foreign keys and indexes

### Task 2: File Upload & Processing
- [ ] Service: `Letta::RagSourceUploadService`
- [ ] Support file types: PDF, TXT, DOCX, MD
- [ ] Parse documents into text
- [ ] Split text into semantic chunks (max 512 tokens)
- [ ] Generate embeddings via Letta API

### Task 3: API Endpoints
- [ ] `POST /letta/bot_templates/:id/rag_sources` (Create)
- [ ] `GET /letta/bot_templates/:id/rag_sources` (List)
- [ ] `DELETE /letta/rag_sources/:id` (Delete)
- [ ] `GET /letta/rag_sources/:id/documents` (List documents)

### Task 4: Letta Integration
- [ ] Create Letta "source" via API
- [ ] Upload chunks to Letta vector DB
- [ ] Associate source with agent on creation
- [ ] Test retrieval during conversation

### Task 5: Frontend (ui_mgpt)
- [ ] RAG Sources tab in bot template editor
- [ ] File upload component
- [ ] URL input for web scraping
- [ ] Display source list with stats

### Task 6: Testing
- [ ] Request specs for RAG endpoints
- [ ] Service specs for document processing
- [ ] Integration test: Upload doc → Create agent → Query context
- [ ] Test supported file formats

---

## Database Schema

### `letta_rag_sources`
```ruby
create_table :letta_rag_sources do |t|
  t.references :bot_template, null: false, foreign_key: { to_table: :letta_bot_templates }
  t.references :organization, null: false
  t.string :name, null: false
  t.text :description
  t.string :letta_source_id # ID from Letta Engine
  t.string :source_type # file, url, text
  t.integer :total_chunks, default: 0
  t.integer :total_tokens, default: 0
  t.timestamps
end
```

### `letta_rag_documents`
```ruby
create_table :letta_rag_documents do |t|
  t.references :rag_source, null: false, foreign_key: { to_table: :letta_rag_sources }
  t.string :filename
  t.string :content_type
  t.string :url # if source_type = url
  t.text :raw_content
  t.bigint :file_size_bytes
  t.string :status # pending, processing, completed, failed
  t.text :error_message
  t.timestamps
end
```

### `letta_rag_chunks`
```ruby
create_table :letta_rag_chunks do |t|
  t.references :rag_document, null: false, foreign_key: { to_table: :letta_rag_documents }
  t.text :content, null: false
  t.integer :chunk_index
  t.integer :token_count
  t.string :letta_chunk_id # ID from Letta vector DB
  t.jsonb :metadata
  t.timestamps
end
```

---

## Document Processing Flow

```
1. User uploads PDF via ui_mgpt
2. Rails saves file to ActiveStorage
3. Background Job: `RagSourceProcessJob`
4. Service extracts text from PDF
5. Service splits text into chunks (512 tokens each)
6. For each chunk:
   a. Send to Letta API for embedding
   b. Store embedding in Letta vector DB
   c. Save chunk record in Rails DB
7. Update rag_source status to "completed"
8. Send notification to frontend
```

---

## Acceptance Criteria

- [ ] Users can upload documents via UI
- [ ] Documents are parsed and chunked correctly
- [ ] Chunks are embedded and stored in Letta vector DB
- [ ] Agents can retrieve relevant context during conversations
- [ ] All file types (PDF, TXT, DOCX, MD) are supported
- [ ] Tests pass with 80%+ coverage

---

## Example Usage

**Admin UI**:
```
1. Go to Bot Template "Customer Support Bot"
2. Click "RAG Sources" tab
3. Upload "product_manual.pdf"
4. Wait for processing (progress bar)
5. See "product_manual.pdf - 45 chunks, 12,500 tokens"
```

**Chat**:
```
User: "How do I reset my password?"
Agent: [Queries RAG source] "According to the product manual,
        you can reset your password by clicking..."
```

---

## References

- [Letta RAG API Docs](http://localhost:8283/docs#rag)
- [ActiveStorage Guide](https://edgeguides.rubyonrails.org/active_storage_overview.html)
- Skill: `05-database-migration` (Schema design)
- Skill: `07-research` (Document parsing libraries)
