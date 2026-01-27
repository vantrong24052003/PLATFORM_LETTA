# RAG Sources - Overview

This document defines the implementation plan for Retrieval-Augmented Generation (RAG) data source management.

---

## 1. Overview

Enable organizations to upload and manage data sources (documents, URLs, knowledge bases) that Letta agents can reference during conversations using RAG. This allows agents to provide more accurate, context-aware responses based on organization-specific data.

**Status**: 🔴 **PLANNED**

---

## 2. Business Goals

1. **Knowledge Management**: Centralize organizational knowledge for AI agents
2. **Accurate Responses**: Agents reference actual data instead of hallucinating
3. **Easy Upload**: Simple UI for uploading documents
4. **Multi-Format Support**: PDF, TXT, DOCX, MD, URLs

---

## 3. Technical Goals

1. **Database Schema**: Tables for sources, documents, and chunks
2. **Document Processing**: Parse and chunk documents into embeddings
3. **Vector Storage**: Integrate with Letta's vector database
4. **API Endpoints**: CRUD operations for RAG sources
5. **Background Jobs**: Async document processing

---

## 4. Scope

### In Scope
- Document upload via API (PDF, TXT, DOCX, MD)
- Document parsing and chunking
- Embedding generation via Letta API
- Link sources to bot templates
- Multi-org isolation

### Out of Scope
- Web scraping (manual URL input only)
- Real-time document sync
- Custom embedding models
- Vector database management UI

---

## 5. Dependencies

**Infrastructure**:
- PostgreSQL (existing)
- Active Storage (Rails file uploads)
- Letta Engine with RAG support

**Previous Features**:
- Custom DB Integration (required)

---

## 6. Acceptance Criteria

- [ ] Users can upload documents via API
- [ ] Documents are parsed and chunked correctly
- [ ] Chunks are embedded and stored in Letta vector DB
- [ ] Agents can retrieve relevant context during conversations
- [ ] Supported file types: PDF, TXT, DOCX, MD
- [ ] Multi-org isolation is enforced
- [ ] Tests pass with 80%+ coverage

---

## Related

- [01-database-schema.md](./01-database-schema.md) - RAG tables
- [02-api-design.md](./02-api-design.md) - Source endpoints
- [03-implementation.md](./03-implementation.md) - Processing logic
- [04-testing.md](./04-testing.md) - Test coverage

- [09-rag-guide.md](../../../docs/letta/09-rag-guide.md) - RAG reference
