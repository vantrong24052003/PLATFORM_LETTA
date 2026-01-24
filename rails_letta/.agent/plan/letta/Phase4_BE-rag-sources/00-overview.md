# RAG Sources - Overview

**Feature**: Retrieval-Augmented Generation (RAG) Data Source Management  
**Status**: 🔴 Not Started  
**Parent**: [../00-implementation-plan.md](../00-implementation-plan.md)

---

## Overview

Enable organizations to upload and manage data sources (documents, URLs, knowledge bases) that Letta agents can reference during conversations using RAG. This allows agents to provide more accurate, context-aware responses based on organization-specific data.

---

## Business Goals

1. **Knowledge Management**: Centralize organizational knowledge for AI agents
2. **Accurate Responses**: Agents reference actual data instead of hallucinating
3. **Easy Upload**: Simple UI for uploading documents
4. **Multi-Format Support**: PDF, TXT, DOCX, MD, URLs

---

## Technical Goals

1. **Database Schema**: Tables for sources, documents, and chunks
2. **Document Processing**: Parse and chunk documents into embeddings
3. **Vector Storage**: Integrate with Letta's vector database
4. **API Endpoints**: CRUD operations for RAG sources
5. **Background Jobs**: Async document processing

---

## Dependencies

**Infrastructure**:
- PostgreSQL (existing)
- Active Storage (Rails file uploads)
- Letta Engine with RAG support

**Previous Features**:
- Custom DB Integration (required)

---

## Out of Scope

- Web scraping (manual URL input only)
- Real-time document sync
- Custom embedding models
- Vector database management UI

---

## Acceptance Criteria

- [ ] Users can upload documents via UI
- [ ] Documents are parsed and chunked correctly
- [ ] Chunks are embedded and stored in Letta vector DB
- [ ] Agents can retrieve relevant context during conversations
- [ ] Supported file types: PDF, TXT, DOCX, MD
- [ ] Multi-org isolation is enforced
- [ ] Tests pass with 80%+ coverage

---

## Timeline Estimate

**Duration**: 5-7 days

**Breakdown**:
- Day 1-2: Database schema & Active Storage setup
- Day 3-4: Document parsing & chunking service
- Day 5: Letta vector DB integration
- Day 6: API endpoints
- Day 7: Testing & bug fixes

---

## Tasks

See individual task files:
- [01-database-schema.md](./01-database-schema.md) - Tables for RAG sources
- [02-api-design.md](./02-api-design.md) - API endpoints
- [03-implementation.md](./03-implementation.md) - Processing & service logic
- [04-testing.md](./04-testing.md) - Testing strategy

---

## References

- [Letta RAG API Docs](http://localhost:8283/docs#rag)
- [ActiveStorage Guide](https://edgeguides.rubyonrails.org/active_storage_overview.html)
- Skill: [../../../skills/07-research/](../../../skills/07-research/) (Document parsing libraries)
