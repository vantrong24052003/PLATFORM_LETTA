# RAG Sources - Testing

This document defines the testing strategy for RAG source management.

**Coverage Goal**: 80%+

---

## 1. Coverage Goals

| Component | Target Coverage |
|-----------|-----------------|
| Models | 95%+ |
| Controllers | 90%+ |
| Services | 90%+ |
| Jobs | 90%+ |
| Overall | 80%+ |

---

## 2. Model Specs

```ruby
RSpec.describe RagSource, type: :model do
  it { should belong_to(:bot_template) }
  it { should have_many(:rag_documents) }
  it { should validate_presence_of(:name) }
  it { should validate_inclusion_of(:source_type).in_array(%w[file url text]) }
end
```

---

## 3. Request Specs

```ruby
RSpec.describe 'RAG Sources', type: :request do
  describe 'POST /letta/bot_templates/:id/rag_sources' do
    it 'uploads document and creates source' do
      post letta.bot_template_rag_sources_path(bot_template), params: {
        rag_source: { name: 'Test', source_type: 'file', file: base64_file }
      }

      expect(response).to have_http_status(:accepted)
    end
  end

  describe 'GET /letta/bot_templates/:id/rag_sources' do
    it 'returns list of sources' do
      get letta.bot_template_rag_sources_path(bot_template)

      expect(response).to have_http_status(:ok)
    end
  end
end
```

---

## 4. Service Specs

```ruby
RSpec.describe Letta::RagSources::ProcessDocument do
  describe '#call' do
    it 'extracts text and creates chunks' do
      # Test text extraction
    end

    it 'calls Letta API for embeddings' do
      # Test Letta API integration
    end
  end
end
```

---

## Related

- [00-overview.md](./00-overview.md) - Feature overview
- [03-implementation.md](./03-implementation.md) - Implementation code
