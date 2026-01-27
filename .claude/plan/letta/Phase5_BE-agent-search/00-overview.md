# Agent Search - Overview

**Feature**: Agent Search & Listing
**Status**: 🟡 **PLANNED**
**Parent**: [../00-implementation-plan.md](../00-implementation-plan.md)

---

## 1. Overview

Implement search and listing functionality for Agents within an organization. Users can find agents by name, description, and filter by creation date.

---

## 2. Business Goals

1. **Discoverability**: Users can easily find agents they created.
2. **Organization Scope**: Each organization sees only their own agents.
3. **Performance**: Paginated results to handle large agent lists.
4. **Flexibility**: Simple keyword search + date filters.

---

## 3. Technical Goals

### A. Query Letta API
- Agents are stored in **Letta Engine**, not our DB.
- Use Letta API endpoint: `GET /api/agents` (or equivalent)
- Cache results locally if needed (future enhancement).

### B. Organization Isolation
- Filter results by `organization_id` using `AgentMapping` table.
- Never expose agents from other organizations.

### C. Pagination
- Use Kaminari gem (already in project).
- Default: 20 per page.
- Max: 100 per page (configurable).

---

## 4. User Flow

```
User → Dashboard → Agent List
                ↓
         [Search Input] [Filter by Date]
                ↓
         Paginated Agent Cards
                ↓
         Click Agent → View Details (show)
```

---

## 5. Sequence Diagram

```mermaid
sequenceDiagram
    participant User as End User
    participant Widget as Chat Widget
    participant Rails as LeTTa Platform (Our BE)
    participant Letta as LeTTa Engine

    User->>Widget: "Show my agents"
    Widget->>Rails: GET /letta/agents?org_id=XXX&page=1
    Rails->>Rails: Get agent IDs from AgentMapping (org scoped)
    Rails->>Letta: Fetch agents by IDs
    Letta-->>Rails: Agent data
    Rails-->>Widget: Paginated agent list
```

---

## 6. Acceptance Criteria

### Must Have ✅
- [ ] GET `/letta/agents` returns paginated list
- [ ] Results scoped to `organization_id`
- [ ] Search by `name` (partial match, case-insensitive)
- [ ] Search by `description` (partial match, case-insensitive)
- [ ] Filter by `created_at` date range (from/to)
- [ ] Pagination: default 20, max 100 per page
- [ ] GET `/letta/agents/:id` returns single agent details
- [ ] 404 if agent not found or not in organization

### Nice to Have 💡
- [ ] Sort by name, created_at
- [ ] Filter by tool types
- [ ] Response caching (Redis)

---

## 7. Dependencies

| Dependency | Type | Status |
|------------|------|--------|
| Letta API: List Agents endpoint | External | 🔴 Need to verify |
| Kaminari gem | Internal | ✅ Installed |
| AgentMapping table | Internal | ✅ Exists |
| ApplicationController | Internal | ✅ Exists |

---

## 8. Out of Scope

- Full-text search (use PostgreSQL full-text or ElasticSearch later)
- Agent creation/update/delete (already implemented)
- Agent analytics/stats
- Cross-organization search (admin only - future)
