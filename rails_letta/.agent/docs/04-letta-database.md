# Letta Database Schema (Verified 100%)

This document provides a COMPLETE reference for all **48 tables** in the live Letta Engine (PostgreSQL).

**Schema**: `letta`

---

## 1. CORE ENTITIES

### 1.1. agents
**The most critical table.** Stores the runtime state of AI agents.

| # | Column | Type | Description |
|---|---|---|---|
| 1 | `id` | varchar | Primary Key |
| 2 | `name` | varchar | |
| 3 | `system` | varchar | System Prompt |
| 4 | `agent_type` | varchar | |
| 5 | `llm_config` | json | |
| 6 | `embedding_config` | json | |
| 7 | `tool_rules` | json | |
| 8 | `organization_id` | varchar | |
| 9 | `project_id` | varchar | |
| 10 | `template_id` | varchar | |
| 11 | `base_template_id` | varchar | |
| 12 | `message_buffer_autoclear` | boolean | |
| 13 | `enable_sleeptime` | boolean | |
| 14 | `response_format` | json | |
| 15 | `timezone` | varchar | |
| 16 | `max_files_open` | integer | |
| 17 | `hidden` | boolean | |
| 18 | `entity_id` | varchar | |
| 19 | `deployment_id` | varchar | |
| 20 | `_vector_db_namespace` | varchar | |
| 21 | `last_stop_reason` | varchar | |
| 22 | `compaction_settings` | json | |
| 23 | `message_ids` | json | Legacy/Denormalized |
| 24 | `description` | varchar | |
| 25 | `per_file_view_window_char_limit` | integer | |
| 26 | `last_run_duration_ms` | integer | |
| 27 | `last_run_completion` | timestamp | |
| 28 | `created_at` | timestamp | |
| 29 | `updated_at` | timestamp | |
| 30 | `is_deleted` | boolean | |
| 31 | `_created_by_id` | varchar | |
| 32 | `_last_updated_by_id` | varchar | |

### 1.2. organizations
| # | Column | Type | Description |
|---|---|---|---|
| 1 | `id` | varchar | PK |
| 2 | `name` | varchar | |
| 3 | `privileged_tools` | boolean | |
| 4 | `created_at` | timestamp | |
| 5 | `updated_at` | timestamp | |
| 6 | `is_deleted` | boolean | |
| 7 | `_created_by_id` | varchar | |
| 8 | `_last_updated_by_id` | varchar | |

### 1.3. users
| # | Column | Type | Description |
|---|---|---|---|
| 1 | `id` | varchar | PK |
| 2 | `name` | varchar | |
| 3 | `organization_id` | varchar | |
| 4 | `created_at` | timestamp | |
| 5 | `updated_at` | timestamp | |
| 6 | `is_deleted` | boolean | |
| 7 | `_created_by_id` | varchar | |
| 8 | `_last_updated_by_id` | varchar | |

### 1.4. messages
| # | Column | Type | Description |
|---|---|---|---|
| 1 | `id` | varchar | PK |
| 2 | `role` | varchar | user/assistant/system/tool |
| 3 | `text` | varchar | |
| 4 | `content` | json | |
| 5 | `model` | varchar | |
| 6 | `name` | varchar | |
| 7 | `tool_calls` | json | |
| 8 | `tool_call_id` | varchar | |
| 9 | `tool_returns` | json | |
| 10 | `agent_id` | varchar | FK -> agents |
| 11 | `sequence_id` | integer | |
| 12 | `conversation_id` | varchar | |
| 13 | `run_id` | varchar | |
| 14 | `step_id` | varchar | |
| 15 | `group_id` | varchar | |
| 16 | `sender_id` | varchar | |
| 17 | `batch_item_id` | varchar | |
| 18 | `approval_request_id` | varchar | |
| 19 | `approve` | boolean | |
| 20 | `denial_reason` | varchar | |
| 21 | `approvals` | json | |
| 22 | `is_err` | boolean | |
| 23 | `created_at` | timestamp | |
| 24 | `is_deleted` | boolean | |

### 1.5. conversations
| # | Column | Type | Description |
|---|---|---|---|
| 1 | `id` | varchar | PK |
| 2 | `agent_id` | varchar | |
| 3 | `organization_id` | varchar | |
| 4 | `summary` | varchar | |
| 5 | `created_at` | timestamp | |
| 6 | `is_deleted` | boolean | |

---

## 2. RAG & KNOWLEDGE

### 2.1. sources
| # | Column | Type | Description |
|---|---|---|---|
| 1 | `id` | varchar | PK |
| 2 | `name` | varchar | |
| 3 | `description` | varchar | |
| 4 | `instructions` | varchar | |
| 5 | `embedding_config` | json | |
| 6 | `vector_db_provider` | USER-DEFINED | e.g. pgvector |
| 7 | `metadata_` | json | |
| 8 | `organization_id` | varchar | |
| 9 | `created_at` | timestamp | |
| 10 | `updated_at` | timestamp | |
| 11 | `is_deleted` | boolean | |
| 12 | `_created_by_id` | varchar | |
| 13 | `_last_updated_by_id` | varchar | |

### 2.2. files
| # | Column | Type | Description |
|---|---|---|---|
| 1 | `id` | varchar | PK |
| 2 | `source_id` | varchar | FK |
| 3 | `file_name` | varchar | |
| 4 | `file_path` | varchar | |
| 5 | `file_type` | varchar | |
| 6 | `file_size` | integer | |
| 7 | `processing_status` | varchar | |
| 8 | `error_message` | varchar | |
| 9 | `total_chunks` | integer | |
| 10 | `chunks_embedded` | integer | |
| 11 | `organization_id` | varchar | |
| 12 | `created_at` | timestamp | |
| 13 | `is_deleted` | boolean | |

### 2.3. file_contents
| # | Column | Type | Description |
|---|---|---|---|
| 1 | `id` | varchar | PK |
| 2 | `file_id` | varchar | FK |
| 3 | `content` | varchar | |

### 2.4. source_passages
| # | Column | Type | Description |
|---|---|---|---|
| 1 | `id` | varchar | PK |
| 2 | `source_id` | varchar | |
| 3 | `file_id` | varchar | |
| 4 | `file_name` | varchar | |
| 5 | `text` | varchar | |
| 6 | `embedding` | vector | |
| 7 | `embedding_config` | json | |
| 8 | `metadata_` | json | |
| 9 | `tags` | json | |
| 10 | `organization_id` | varchar | |
| 11 | `created_at` | timestamp | |
| 12 | `is_deleted` | boolean | |

### 2.5. archives
| # | Column | Type | Description |
|---|---|---|---|
| 1 | `id` | varchar | PK |
| 2 | `name` | varchar | |
| 3 | `description` | varchar | |
| 4 | `organization_id` | varchar | |
| 5 | `created_at` | timestamp | |
| 6 | `is_deleted` | boolean | |

### 2.6. archival_passages
| # | Column | Type | Description |
|---|---|---|---|
| 1 | `id` | varchar | PK |
| 2 | `archive_id` | varchar | |
| 3 | `text` | varchar | |
| 4 | `embedding` | vector | |
| 5 | `embedding_config` | json | |
| 6 | `metadata_` | json | |
| 7 | `tags` | json | |
| 8 | `organization_id` | varchar | |
| 9 | `created_at` | timestamp | |
| 10 | `is_deleted` | boolean | |

---

## 3. MEMORY

### 3.1. block
| # | Column | Type | Description |
|---|---|---|---|
| 1 | `id` | varchar | PK |
| 2 | `label` | varchar | |
| 3 | `value` | varchar | |
| 4 | `limit` | integer | |
| 5 | `is_template` | boolean | |
| 6 | `template_name` | varchar | |
| 7 | `description` | varchar | |
| 8 | `organization_id` | varchar | |
| 9 | `read_only` | boolean | |
| 10 | `hidden` | boolean | |
| 11 | `version` | integer | |
| 12 | `created_at` | timestamp | |
| 13 | `is_deleted` | boolean | |

### 3.2. block_history
| # | Column | Type | Description |
|---|---|---|---|
| 1 | `id` | varchar | PK |
| 2 | `block_id` | varchar | |
| 3 | `value` | varchar | |
| 4 | `created_at` | timestamp | |

---

## 4. EXECUTION & JOBS

### 4.1. runs
| # | Column | Type | Description |
|---|---|---|---|
| 1 | `id` | varchar | PK |
| 2 | `status` | varchar | |
| 3 | `agent_id` | varchar | |
| 4 | `conversation_id` | varchar | |
| 5 | `organization_id` | varchar | |
| 6 | `total_duration_ns` | bigint | |
| 7 | `ttft_ns` | bigint | |
| 8 | `completed_at` | timestamp | |
| 9 | `created_at` | timestamp | |
| 10 | `is_deleted` | boolean | |

### 4.2. steps
| # | Column | Type | Description |
|---|---|---|---|
| 1 | `id` | varchar | PK |
| 2 | `run_id` | varchar | |
| 3 | `status` | USER-DEFINED | |
| 4 | `model` | varchar | |
| 5 | `prompt_tokens` | integer | |
| 6 | `completion_tokens` | integer | |
| 7 | `total_tokens` | integer | |
| 8 | `step_start_ns` | bigint | |
| 9 | `created_at` | timestamp | |
| 10 | `is_deleted` | boolean | |

### 4.3. jobs
| # | Column | Type | Description |
|---|---|---|---|
| 1 | `id` | varchar | PK |
| 2 | `job_type` | varchar | |
| 3 | `status` | varchar | |
| 4 | `user_id` | varchar | |
| 5 | `organization_id` | varchar | |
| 6 | `created_at` | timestamp | |
| 7 | `is_deleted` | boolean | |

### 4.4. llm_batch_job
| # | Column | Type | Description |
|---|---|---|---|
| 1 | `id` | varchar | PK |
| 2 | `letta_batch_job_id` | varchar | |
| 3 | `llm_provider` | varchar | |
| 4 | `status` | varchar | |
| 5 | `organization_id` | varchar | |
| 6 | `created_at` | timestamp | |

### 4.5. llm_batch_items
| # | Column | Type | Description |
|---|---|---|---|
| 1 | `id` | varchar | PK |
| 2 | `llm_batch_id` | varchar | |
| 3 | `agent_id` | varchar | |
| 4 | `request` | json | |
| 5 | `response` | json | |

---

## 5. TOOLS & MCP

### 5.1. tools
| # | Column | Type | Description |
|---|---|---|---|
| 1 | `id` | varchar | PK |
| 2 | `name` | varchar | |
| 3 | `description` | varchar | |
| 4 | `source_type` | varchar | |
| 5 | `source_code` | varchar | |
| 6 | `json_schema` | json | |
| 7 | `tags` | json | |
| 8 | `organization_id` | varchar | |
| 9 | `created_at` | timestamp | |
| 10 | `is_deleted` | boolean | |

### 5.2. mcp_server
| # | Column | Type | Description |
|---|---|---|---|
| 1 | `id` | varchar | PK |
| 2 | `server_name` | varchar | |
| 3 | `server_url` | varchar | |
| 4 | `organization_id` | varchar | |
| 5 | `created_at` | timestamp | |

### 5.3. mcp_tools
| # | Column | Type | Description |
|---|---|---|---|
| 1 | `id` | varchar | PK |
| 2 | `name` | varchar | |
| 3 | `json_schema` | json | |
| 4 | `organization_id` | varchar | |

### 5.4. mcp_oauth
| # | Column | Type | Description |
|---|---|---|---|
| 1 | `id` | varchar | PK |
| 2 | `server_id` | varchar | |
| 3 | `user_id` | varchar | |
| 4 | `organization_id` | varchar | |

---

## 6. CONFIGURATION

### 6.1. providers
| # | Column | Type | Description |
|---|---|---|---|
| 1 | `id` | varchar | PK |
| 2 | `name` | varchar | |
| 3 | `provider_type` | varchar | |
| 4 | `api_key` | varchar | |
| 5 | `organization_id` | varchar | |

### 6.2. provider_models
| # | Column | Type | Description |
|---|---|---|---|
| 1 | `id` | varchar | PK |
| 2 | `provider_id` | varchar | |
| 3 | `model_name` | varchar | |
| 4 | `organization_id` | varchar | |

### 6.3. sandbox_configs
| # | Column | Type | Description |
|---|---|---|---|
| 1 | `id` | varchar | PK |
| 2 | `type` | enum | |
| 3 | `config` | json | |
| 4 | `organization_id` | varchar | |

### 6.4. sandbox_environment_variables
| # | Column | Type | Description |
|---|---|---|---|
| 1 | `id` | varchar | PK |
| 2 | `sandbox_config_id` | varchar | |
| 3 | `key` | varchar | |
| 4 | `value` | varchar | |

### 6.5. agent_environment_variables
| # | Column | Type | Description |
|---|---|---|---|
| 1 | `id` | varchar | PK |
| 2 | `agent_id` | varchar | |
| 3 | `key` | varchar | |
| 4 | `value` | varchar | |

---

## 7. JUNCTION TABLES

### 7.1. agents_tags
| # | Column | Type | Description |
|---|---|---|---|
| 1 | `agent_id` | varchar | PK |
| 2 | `tag` | varchar | PK |

### 7.2. archives_agents
| # | Column | Type | Description |
|---|---|---|---|
| 1 | `archive_id` | varchar | PK |
| 2 | `agent_id` | varchar | PK |

### 7.3. blocks_agents
| # | Column | Type | Description |
|---|---|---|---|
| 1 | `block_id` | varchar | PK |
| 2 | `agent_id` | varchar | PK |

### 7.4. blocks_conversations
| # | Column | Type | Description |
|---|---|---|---|
| 1 | `block_id` | varchar | PK |
| 2 | `conversation_id` | varchar | PK |

### 7.5. blocks_tags
| # | Column | Type | Description |
|---|---|---|---|
| 1 | `block_id` | varchar | PK |
| 2 | `tag` | varchar | PK |

### 7.6. files_agents
| # | Column | Type | Description |
|---|---|---|---|
| 1 | `file_id` | varchar | PK |
| 2 | `agent_id` | varchar | PK |

### 7.7. groups_agents
| # | Column | Type | Description |
|---|---|---|---|
| 1 | `group_id` | varchar | PK |
| 2 | `agent_id` | varchar | PK |

### 7.8. groups_blocks
| # | Column | Type | Description |
|---|---|---|---|
| 1 | `group_id` | varchar | PK |
| 2 | `block_id` | varchar | PK |

### 7.9. identities_agents
| # | Column | Type | Description |
|---|---|---|---|
| 1 | `identity_id` | varchar | PK |
| 2 | `agent_id` | varchar | PK |

### 7.10. identities_blocks
| # | Column | Type | Description |
|---|---|---|---|
| 1 | `identity_id` | varchar | PK |
| 2 | `block_id` | varchar | PK |

### 7.11. passage_tags
| # | Column | Type | Description |
|---|---|---|---|
| 1 | `passage_id` | varchar | PK |
| 2 | `tag` | varchar | PK |

### 7.12. sources_agents
| # | Column | Type | Description |
|---|---|---|---|
| 1 | `source_id` | varchar | PK |
| 2 | `agent_id` | varchar | PK |

### 7.13. tools_agents
| # | Column | Type | Description |
|---|---|---|---|
| 1 | `tool_id` | varchar | PK |
| 2 | `agent_id` | varchar | PK |

---

## 8. OTHER

### 8.1. identities
| # | Column | Type | Description |
|---|---|---|---|
| 1 | `id` | varchar | PK |
| 2 | `identifier_key` | varchar | |
| 3 | `name` | varchar | |
| 4 | `identity_type` | varchar | |
| 5 | `properties` | json | |
| 6 | `organization_id` | varchar | |

### 8.2. groups
| # | Column | Type | Description |
|---|---|---|---|
| 1 | `id` | varchar | PK |
| 2 | `description` | varchar | |
| 3 | `agent_ids` | json | |
| 4 | `organization_id` | varchar | |

### 8.3. prompts
| # | Column | Type | Description |
|---|---|---|---|
| 1 | `id` | varchar | PK |
| 2 | `prompt` | varchar | |

### 8.4. run_metrics
| # | Column | Type | Description |
|---|---|---|---|
| 1 | `id` | varchar | PK |
| 2 | `agent_id` | varchar | |

### 8.5. step_metrics
| # | Column | Type | Description |
|---|---|---|---|
| 1 | `id` | varchar | PK |
| 2 | `run_id` | varchar | |
| 3 | `agent_id` | varchar | |

### 8.6. provider_traces
| # | Column | Type | Description |
|---|---|---|---|
| 1 | `id` | varchar | PK |
| 2 | `organization_id` | varchar | |

### 8.7. alembic_version
| # | Column | Type | Description |
|---|---|---|---|
| 1 | `version_num` | varchar | Migration Version |
