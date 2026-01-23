---
name: 03-refactor-frontend
description: "Phase 3: Connect FE Admin UI to Rails Backend"
---

# Refactor Frontend Skill

## Overview
This skill guides you through **Phase 3**: Updating the `ui_mgpt` (React Admin) to communicate with the Rails APIs.

## How It Works

### Step 1: Update API Client
**File**: `ui_mgpt/src/utils/storage.ts` (or equivalent API service file)
- [ ] Point endpoints to `/api/letta/bots`.
- [ ] Ensure request payloads match Rails check (`snake_case` vs `camelCase`). Rails usually expects `snake_case` params, but returns JSON.

### Step 2: Testing
- [ ] Test that creating a Bot in UI creates a record in the `letta_bot_templates` table in Postgres.

## Best Practices
- **Snake Case**: Be careful with JSON case conversion. Rails prefers snake_case params.
