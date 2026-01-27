# Agents List API - Overview

**Feature**: GET /letta/agents - List agents for current organization
**Status**: 🔄 IN PROGRESS

## Overview
Create a RESTful API endpoint to list all agents scoped to the current organization. The agents will be fetched from the local PostgreSQL database (agent_mappings and agents tables) and returned with pagination support.

## Business Goals
1. Enable UI to display agents created through our platform
2. Provide organization-isolated agent listing for security
3. Support paginated results for performance
4. Enable basic filtering for user search

## Technical Goals
1. Follow Service Object pattern (`Letta::Agents::List`)
2. Use Kaminari for pagination
3. Implement organization scoping via API Key header
4. Return consistent JSON response format
5. Achieve 100% test coverage

## Acceptance Criteria
- [ ] GET /letta/agents returns list of agents
- [ ] Results are scoped to current organization
- [ ] Pagination works with `page` and `per` params
- [ ] Basic filters work (name search, status filter)
- [ ] Returns 401 if no API Key provided
- [ ] Returns 401 if invalid API Key provided
- [ ] Model tests cover associations and validations
- [ ] Service tests cover business logic and edge cases
- [ ] Controller tests cover request/response and auth
- [ ] 100% test coverage achieved

## Constraints
- Must use organization scoping for all queries
- Must follow Service Object pattern
- Must have `frozen_string_literal: true` at file top
- Must return `{ success: true/false, data/error: ... }` from services
- No migrations needed (use existing tables)
