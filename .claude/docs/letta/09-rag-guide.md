# RAG (Retrieval-Augmented Generation) - Reference

**Source**: Academic papers, industry best practices  
**Purpose**: Enhance AI with external knowledge retrieval  
**Last Updated**: 2026-01-24

---

## Overview

Retrieval-Augmented Generation (RAG) is a technique that combines information retrieval with language generation. Instead of relying solely on training data, AI agents search external knowledge bases to provide accurate, up-to-date, and verifiable answers.

**Original Paper**: [Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks](https://arxiv.org/abs/2005.11401) (Lewis et al., 2020)

---

## How RAG Works

```
┌─────────────────────────────────────────────────────────────┐
│ INDEXING PHASE (One-time setup)                             │
└─────────────────────────────────────────────────────────────┘

Document Upload → Text Extraction → Chunking → Embedding → Vector DB
                                                                │
Example:                                                        │
"product_manual.pdf" → "Returns allowed within 30 days" → [0.12, 0.45, ...] → Stored


┌─────────────────────────────────────────────────────────────┐
│ RETRIEVAL PHASE (Runtime)                                   │
└─────────────────────────────────────────────────────────────┘

User Question → Embed Query → Search Vector DB → Retrieve Top-K Chunks
     │                            (Similarity)           │
     ▼                                                   ▼
"What is the      →  [0.15, 0.43, ...]  →  1. "Returns allowed within 30 days" (score: 0.95)
 refund policy?"                           2. "Keep your receipt" (score: 0.88)
                                           3. "Contact support" (score: 0.82)
                                                   │
                                                   ▼
                                        Inject into AI Context
                                                   │
                                                   ▼
                                        Generate Answer with Sources
```

---

## Key Components

### 1. Text Processing

**Chunking Strategies**:

**Fixed Size**:
```
Chunk 1: chars 0-500
Chunk 2: chars 450-950 (50 char overlap)
Chunk 3: chars 900-1400
```

**Sentence-Based**:
```
Chunk 1: "First sentence. Second sentence."
Chunk 2: "Third sentence. Fourth sentence."
```

**Semantic**:
```
Chunk 1: Entire paragraph about refunds
Chunk 2: Entire paragraph about shipping
```

**Best Practice**: 500-1000 characters with 50-100 character overlap

---

### 2. Embeddings

**Purpose**: Convert text to numerical vectors for similarity search

**Example**:
```
Text: "refund policy"
Embedding: [0.12, -0.45, 0.78, ..., 0.34]  (1536 dimensions)

Text: "return policy"
Embedding: [0.15, -0.42, 0.75, ..., 0.31]  (similar to above)

Cosine Similarity: 0.95 (very similar)
```

**Common Models**:
- OpenAI `text-embedding-ada-002` (1536 dims)
- Sentence Transformers `all-MiniLM-L6-v2` (384 dims)
- Cohere `embed-english-v3.0` (1024 dims)

---

### 3. Vector Databases

**Purpose**: Fast similarity search over millions of vectors

**Popular Options**:
- **Chroma**: Open-source, Python-native
- **Pinecone**: Cloud-hosted, scalable
- **Qdrant**: Self-hosted, Rust-based
- **Weaviate**: GraphQL API
- **pgvector**: PostgreSQL extension

**Search Algorithm**: Approximate Nearest Neighbor (ANN)
- HNSW (Hierarchical Navigable Small World)
- IVF (Inverted File Index)
- ScaNN (Scalable Nearest Neighbors)

---

### 4. Retrieval Methods

**Similarity Metrics**:

**Cosine Similarity**:
```
similarity = (A · B) / (||A|| × ||B||)
Range: [-1, 1] (1 = identical, -1 = opposite)
```

**Euclidean Distance**:
```
distance = √(Σ(Ai - Bi)²)
Range: [0, ∞] (0 = identical, higher = more different)
```

**Dot Product**:
```
similarity = Σ(Ai × Bi)
Range: (-∞, ∞)
```

**Most Common**: Cosine similarity

---

## HTTP API Pattern

### 1. Upload Document

```http
POST /api/rag/sources
Content-Type: multipart/form-data

file: product_manual.pdf
name: Product Manual
description: Official product documentation
```

**Response**:
```json
{
  "source_id": "src_abc123",
  "status": "processing",
  "filename": "product_manual.pdf",
  "size_bytes": 1048576
}
```

### 2. Check Processing Status

```http
GET /api/rag/sources/src_abc123
```

**Response**:
```json
{
  "source_id": "src_abc123",
  "status": "completed",
  "total_chunks": 145,
  "total_tokens": 32500,
  "processed_at": "2026-01-24T12:05:00Z"
}
```

### 3. Search (Optional, for testing)

```http
POST /api/rag/sources/src_abc123/search
Content-Type: application/json

{
  "query": "What is the refund policy?",
  "top_k": 5
}
```

**Response**:
```json
{
  "results": [
    {
      "chunk_id": "chunk_1",
      "text": "Returns allowed within 30 days with receipt.",
      "score": 0.95,
      "metadata": {
        "page": 12,
        "section": "Refunds"
      }
    },
    {
      "chunk_id": "chunk_2",
      "text": "Damaged items eligible for full refund.",
      "score": 0.88,
      "metadata": {
        "page": 12,
        "section": "Refunds"
      }
    }
  ]
}
```

---

## File Format Support

### Supported Formats

| Format | Extension | Library (Python) | Library (Ruby) |
|--------|-----------|------------------|----------------|
| PDF | `.pdf` | PyPDF2, pdfplumber | pdf-reader |
| Word | `.docx` | python-docx | docx |
| Text | `.txt` | Built-in | Built-in |
| Markdown | `.md` | markdown | redcarpet |
| HTML | `.html` | BeautifulSoup | Nokogiri |
| CSV | `.csv` | pandas | CSV |
| JSON | `.json` | json | json |

### Text Extraction Example (HTTP)

**cURL**:
```bash
# Upload PDF
curl -X POST http://localhost:4000/api/rag/sources \
  -F "file=@manual.pdf" \
  -F "name=Product Manual"

# Response
{
  "source_id": "src_123",
  "status": "processing"
}

# Check status
curl http://localhost:4000/api/rag/sources/src_123

# Response
{
  "status": "completed",
  "total_chunks": 145
}
```

---

## Metadata Filtering

**Purpose**: Filter chunks by metadata before similarity search

**Example Metadata**:
```json
{
  "text": "Returns allowed within 30 days",
  "metadata": {
    "source": "product_manual.pdf",
    "page": 12,
    "section": "Refunds",
    "last_updated": "2026-01-01",
    "language": "en",
    "category": "policy"
  }
}
```

**Filtered Search**:
```http
POST /api/rag/search
Content-Type: application/json

{
  "query": "refund policy",
  "filters": {
    "category": "policy",
    "language": "en",
    "last_updated_after": "2025-01-01"
  },
  "top_k": 5
}
```

---

## Performance Optimization

### 1. Chunking

**Trade-offs**:
- **Small chunks** (< 200 chars): More precise, but lose context
- **Large chunks** (> 2000 chars): More context, but less precise

**Recommendation**: 500-1000 chars

### 2. Top-K Selection

**Trade-offs**:
- **Low K** (1-3): Fast, but may miss relevant info
- **High K** (10-20): More context, but noise

**Recommendation**: 3-5 for most use cases

### 3. Caching

**Cache Embeddings**:
```
Query: "refund policy"
Embedding (cached): [0.12, 0.45, ...]
TTL: 1 hour
```

**Cache Results**:
```
Query: "refund policy"
Results (cached): [chunk_1, chunk_2, ...]
TTL: 10 minutes
```

---

## Security Considerations

### 1. Multi-Tenancy

**Ensure Isolation**:
```
User A searches → Only retrieves chunks from User A's documents
User B searches → Only retrieves chunks from User B's documents
```

**Implementation**:
- Store `organization_id` or `user_id` in chunk metadata
- Filter by ownership before search

### 2. Access Control

```http
GET /api/rag/sources/src_123
Authorization: Bearer user_token

# Server validates:
# - Token is valid
# - User owns src_123
```

### 3. Content Sanitization

- Strip sensitive data (SSN, credit cards) before indexing
- Redact PII if required
- Apply content policies

---

## Common Pitfalls

### 1. Poor Chunk Boundaries

❌ **Bad** (mid-sentence):
```
Chunk 1: "Our refund policy allows returns within 30"
Chunk 2: "days if you have a receipt. Contact support"
```

✅ **Good** (complete thoughts):
```
Chunk 1: "Our refund policy allows returns within 30 days if you have a receipt."
Chunk 2: "Contact support for damaged items."
```

### 2. Ignoring Metadata

❌ **Bad**:
```
Just store text, no metadata
```

✅ **Good**:
```
Store source, page, section, date
```

### 3. No Overlap

❌ **Bad** (adjacent chunks):
```
Chunk 1: chars 0-500
Chunk 2: chars 500-1000  (context lost at boundary)
```

✅ **Good** (overlapping):
```
Chunk 1: chars 0-500
Chunk 2: chars 450-950  (50 char overlap)
```

---

## Evaluation Metrics

### Retrieval Quality

**Precision@K**:
```
Precision@5 = (Relevant chunks in top 5) / 5
```

**Recall@K**:
```
Recall@5 = (Relevant chunks in top 5) / (Total relevant chunks)
```

**MRR (Mean Reciprocal Rank)**:
```
MRR = 1 / (Rank of first relevant chunk)
```

### End-to-End Quality

**Answer Accuracy**: Human evaluation  
**Source Attribution**: % of answers with correct sources  
**Latency**: Time from query to answer

---

## References

- [RAG Paper (Lewis et al., 2020)](https://arxiv.org/abs/2005.11401)
- [LangChain RAG Guide](https://python.langchain.com/docs/use_cases/question_answering/)
- [OpenAI Embeddings Guide](https://platform.openai.com/docs/guides/embeddings)
- [Chroma Documentation](https://docs.trychroma.com/)
- [Pinecone Learning Center](https://www.pinecone.io/learn/)
