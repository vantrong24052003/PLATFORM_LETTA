# Streaming API - Database Schema

This document defines the database schema for streaming functionality.

---

## 1. Schema Overview

**No database changes required.**

Streaming is handled in-memory via `ActionController::Live` and does not require persistent storage.

---

## 2. Rationale

- SSE connections are stateless and ephemeral
- Message content is already stored in Letta Engine
- No need to track active streams in database
- Connection state managed by Rails/Rack

---

## 3. Future Consideration

If we need to track streaming metrics (e.g., stream duration, disconnect rate), we could add:

```ruby
# Potential future table (NOT IN SCOPE)
create_table :letta_stream_metrics do |t|
  t.references :organization
  t.string :agent_id
  t.integer :duration_ms
  t.boolean :completed
  t.timestamps
end
```

**This is NOT required for Phase 2.**

---

## Related

- [00-overview.md](./00-overview.md) - Feature overview
- [03-implementation.md](./03-implementation.md) - In-memory streaming implementation
