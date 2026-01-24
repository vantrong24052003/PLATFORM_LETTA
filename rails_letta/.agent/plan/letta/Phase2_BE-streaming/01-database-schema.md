# Streaming - Database Schema

**Feature**: Server-Sent Events for Real-Time Chat Streaming  
**Status**: 🔴 Not Started  
**Parent**: [00-overview.md](./00-overview.md)

---

## N/A

This feature does not require database changes.

Streaming is handled in-memory via ActionController::Live and does not require persistent storage.

---

## Rationale

- SSE connections are stateless and ephemeral
- Message content is already stored in Letta Engine
- No need to track active streams in database
- Connection state managed by Rails/Rack

---

## Future Consideration

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

But this is NOT required for Phase 1.
