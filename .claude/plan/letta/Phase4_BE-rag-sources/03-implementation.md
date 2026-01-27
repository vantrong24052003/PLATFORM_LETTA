# RAG Sources - Implementation

This document defines the code implementation for RAG source management.

---

## 1. Document Processing Flow

```
Upload → Save to ActiveStorage → Background Job → Extract Text → Chunk → Embed → Store
```

**Flow Sequence**:
1. User uploads document via UI
2. Rails saves file to ActiveStorage
3. Background Job `RagSourceProcessJob` starts
4. Service extracts text from document
5. Service splits text into chunks (512 tokens each)
6. For each chunk: Send to Letta API for embedding
7. Store in Letta vector DB
8. Save chunk record in Rails DB
9. Update source status to "completed"

---

## 2. Models

### RagSource

**Location**: `app/models/rag_source.rb`

```ruby
# frozen_string_literal: true

class RagSource < ApplicationRecord
  belongs_to :bot_template, class_name: 'Letta::BotTemplate'
  has_many :rag_documents, dependent: :destroy

  validates :name, :organization_id, presence: true
  validates :source_type, inclusion: { in: %w[file url text] }
end
```

---

## 3. Service Objects

### Letta::RagSources::Upload

**Location**: `app/services/letta/rag_sources/upload.rb`

```ruby
# frozen_string_literal: true

module Letta
  module RagSources
    class Upload < ApplicationService
      def call
        # 1. Save file to ActiveStorage
        # 2. Create RagSource record
        # 3. Enqueue RagSourceProcessJob
        { success: true, data: rag_source }
      end
    end
  end
end
```

### Letta::RagSources::ProcessDocument

**Location**: `app/services/letta/rag_sources/process_document.rb`

```ruby
# frozen_string_literal: true

module Letta
  module RagSources
    class ProcessDocument < ApplicationService
      def call
        # 1. Extract text from document (PDF, DOCX, TXT, MD)
        # 2. Split into chunks (512 tokens)
        # 3. For each chunk: Call Letta API for embedding
        # 4. Store chunks in Letta vector DB
        # 5. Save chunk records in Rails DB
      end
    end
  end
end
```

---

## Related

- [00-overview.md](./00-overview.md) - Feature overview
- [01-database-schema.md](./01-database-schema.md) - Database schema
