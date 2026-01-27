# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2026_01_24_150022) do
  create_schema "letta"

  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"
  enable_extension "vector"

  # Custom types defined in this database.
  # Note that some types may not work with other database engines. Be careful if changing database.
  create_enum "sandboxtype", ["E2B", "MODAL", "LOCAL"]
  create_enum "stepstatus", ["PENDING", "SUCCESS", "FAILED", "CANCELLED"]
  create_enum "stopreasontype", ["end_turn", "error", "invalid_tool_call", "max_steps", "no_tool_call", "tool_rule", "cancelled"]
  create_enum "vectordbprovider", ["NATIVE", "TPUF", "PINECONE"]

  create_table "agent_environment_variables", id: :string, force: :cascade do |t|
    t.string "_created_by_id"
    t.string "_last_updated_by_id"
    t.string "agent_id", null: false
    t.timestamptz "created_at", default: -> { "now()" }
    t.string "description"
    t.boolean "is_deleted", default: false, null: false
    t.string "key", null: false
    t.string "organization_id", null: false
    t.timestamptz "updated_at", default: -> { "now()" }
    t.string "value", null: false
    t.text "value_enc"
    t.index ["agent_id"], name: "idx_agent_environment_variables_agent_id"
    t.unique_constraint ["key", "agent_id"], name: "uix_key_agent"
  end

  create_table "agent_mappings", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "agent_id", null: false
    t.uuid "bot_template_id", null: false
    t.datetime "created_at", null: false
    t.string "organization_id", null: false
    t.datetime "updated_at", null: false
    t.string "user_id", null: false
    t.index ["agent_id"], name: "index_agent_mappings_on_agent_id", unique: true
    t.index ["bot_template_id"], name: "index_agent_mappings_on_bot_template_id"
    t.index ["organization_id", "bot_template_id", "user_id"], name: "idx_agent_mappings_org_template_user", unique: true
  end

  create_table "agents", id: :string, force: :cascade do |t|
    t.string "_created_by_id"
    t.string "_last_updated_by_id"
    t.string "_vector_db_namespace"
    t.string "agent_type"
    t.string "base_template_id"
    t.json "compaction_settings"
    t.timestamptz "created_at", default: -> { "now()" }
    t.string "deployment_id"
    t.string "description"
    t.json "embedding_config"
    t.boolean "enable_sleeptime"
    t.string "entity_id"
    t.boolean "hidden"
    t.boolean "is_deleted", default: false, null: false
    t.timestamptz "last_run_completion"
    t.integer "last_run_duration_ms"
    t.string "last_stop_reason"
    t.json "llm_config"
    t.integer "max_files_open"
    t.boolean "message_buffer_autoclear", null: false
    t.json "message_ids"
    t.json "metadata_"
    t.string "name"
    t.string "organization_id", null: false
    t.integer "per_file_view_window_char_limit"
    t.string "project_id"
    t.json "response_format"
    t.string "system"
    t.string "template_id"
    t.string "timezone"
    t.json "tool_rules"
    t.timestamptz "updated_at", default: -> { "now()" }
    t.index ["created_at", "id"], name: "ix_agents_created_at"
    t.index ["organization_id", "deployment_id"], name: "ix_agents_organization_id_deployment_id"
    t.index ["project_id"], name: "ix_agents_project_id"
  end

  create_table "agents_tags", id: false, force: :cascade do |t|
    t.string "agent_id", null: false
    t.string "tag", null: false
    t.index ["agent_id", "tag"], name: "ix_agents_tags_agent_id_tag"
    t.index ["tag", "agent_id"], name: "ix_agents_tags_tag_agent_id"
    t.unique_constraint ["agent_id", "tag"], name: "unique_agent_tag"
  end

  create_table "alembic_version", primary_key: "version_num", id: { type: :string, limit: 32 }, force: :cascade do |t|
  end

# Could not dump table "archival_passages" because of following StandardError
#   Unknown type 'vector(4096)' for column 'embedding'


  create_table "archives", id: :string, force: :cascade do |t|
    t.string "_created_by_id"
    t.string "_last_updated_by_id"
    t.string "_vector_db_namespace"
    t.timestamptz "created_at", default: -> { "now()" }
    t.string "description"
    t.json "embedding_config", null: false
    t.boolean "is_deleted", default: false, null: false
    t.json "metadata_"
    t.string "name", null: false
    t.string "organization_id", null: false
    t.timestamptz "updated_at", default: -> { "now()" }
    t.enum "vector_db_provider", null: false, enum_type: "vectordbprovider"
    t.index ["created_at", "id"], name: "ix_archives_created_at"
    t.index ["organization_id"], name: "ix_archives_organization_id"
  end

  create_table "archives_agents", primary_key: ["agent_id", "archive_id"], force: :cascade do |t|
    t.string "agent_id", null: false
    t.string "archive_id", null: false
    t.timestamptz "created_at", default: -> { "now()" }, null: false
    t.boolean "is_owner", null: false

    t.unique_constraint ["agent_id"], name: "unique_agent_archive"
  end

  create_table "block", id: :string, force: :cascade do |t|
    t.string "_created_by_id"
    t.string "_last_updated_by_id"
    t.string "base_template_id"
    t.timestamptz "created_at", default: -> { "now()" }
    t.string "current_history_entry_id"
    t.string "deployment_id"
    t.string "description"
    t.string "entity_id"
    t.boolean "hidden"
    t.boolean "is_deleted", default: false, null: false
    t.boolean "is_template", null: false
    t.string "label", null: false
    t.integer "limit", null: false
    t.json "metadata_"
    t.string "organization_id", null: false
    t.boolean "preserve_on_migration"
    t.string "project_id"
    t.boolean "read_only", null: false
    t.string "template_id"
    t.string "template_name"
    t.timestamptz "updated_at", default: -> { "now()" }
    t.string "value", null: false
    t.integer "version", default: 1, null: false
    t.index ["created_at", "label"], name: "created_at_label_idx"
    t.index ["current_history_entry_id"], name: "ix_block_current_history_entry_id"
    t.index ["hidden"], name: "ix_block_hidden"
    t.index ["is_template"], name: "ix_block_is_template"
    t.index ["organization_id", "deployment_id"], name: "ix_block_organization_id_deployment_id"
    t.index ["organization_id", "project_id", "is_template"], name: "ix_block_org_project_template"
    t.unique_constraint ["id", "label"], name: "unique_block_id_label"
  end

  create_table "block_history", id: :string, force: :cascade do |t|
    t.string "_created_by_id"
    t.string "_last_updated_by_id"
    t.string "actor_id"
    t.string "actor_type"
    t.string "block_id", null: false
    t.timestamptz "created_at", default: -> { "now()" }
    t.text "description"
    t.boolean "is_deleted", default: false, null: false
    t.string "label", null: false
    t.bigint "limit", null: false
    t.json "metadata_"
    t.string "organization_id", null: false
    t.integer "sequence_number", null: false
    t.timestamptz "updated_at", default: -> { "now()" }
    t.text "value", null: false
    t.index ["block_id", "sequence_number"], name: "ix_block_history_block_id_sequence", unique: true
  end

  create_table "blocks_agents", id: false, force: :cascade do |t|
    t.string "agent_id", null: false
    t.string "block_id", null: false
    t.string "block_label", null: false
    t.index ["block_id"], name: "ix_blocks_agents_block_id"
    t.index ["block_label", "agent_id"], name: "ix_blocks_agents_block_label_agent_id"
    t.unique_constraint ["agent_id", "block_id"], name: "unique_agent_block"
    t.unique_constraint ["agent_id", "block_label"], name: "unique_label_per_agent"
  end

  create_table "blocks_conversations", primary_key: ["conversation_id", "block_id", "block_label"], force: :cascade do |t|
    t.string "block_id", null: false
    t.string "block_label", null: false
    t.string "conversation_id", null: false
    t.index ["block_id"], name: "ix_blocks_conversations_block_id"
    t.unique_constraint ["conversation_id", "block_id"], name: "unique_conversation_block"
    t.unique_constraint ["conversation_id", "block_label"], name: "unique_label_per_conversation"
  end

  create_table "blocks_tags", primary_key: ["block_id", "tag"], force: :cascade do |t|
    t.string "_created_by_id"
    t.string "_last_updated_by_id"
    t.string "block_id", null: false
    t.timestamptz "created_at", default: -> { "now()" }
    t.boolean "is_deleted", default: false, null: false
    t.string "organization_id", null: false
    t.string "tag", null: false
    t.timestamptz "updated_at", default: -> { "now()" }
  end

  create_table "bot_templates", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "customer_domain"
    t.text "greeting"
    t.string "name", null: false
    t.string "organization_id", null: false
    t.jsonb "source_ids", default: []
    t.string "status", default: "active"
    t.text "system_prompt", null: false
    t.jsonb "theme_config", default: {}
    t.jsonb "tools", default: []
    t.datetime "updated_at", null: false
    t.index ["customer_domain"], name: "index_bot_templates_on_customer_domain"
    t.index ["organization_id"], name: "index_bot_templates_on_organization_id"
  end

  create_table "conversation_messages", id: :string, force: :cascade do |t|
    t.string "_created_by_id"
    t.string "_last_updated_by_id"
    t.string "agent_id", null: false
    t.string "conversation_id"
    t.timestamptz "created_at", default: -> { "now()" }
    t.boolean "in_context", null: false
    t.boolean "is_deleted", default: false, null: false
    t.string "message_id", null: false
    t.string "organization_id", null: false
    t.integer "position", null: false
    t.timestamptz "updated_at", default: -> { "now()" }
    t.index ["agent_id", "conversation_id"], name: "ix_conv_msg_agent_conversation"
    t.index ["agent_id"], name: "ix_conv_msg_agent_id"
    t.index ["conversation_id", "position"], name: "ix_conv_msg_conversation_position"
    t.index ["message_id"], name: "ix_conv_msg_message_id"
    t.unique_constraint ["conversation_id", "message_id"], name: "unique_conversation_message"
  end

  create_table "conversations", id: :string, force: :cascade do |t|
    t.string "_created_by_id"
    t.string "_last_updated_by_id"
    t.string "agent_id", null: false
    t.timestamptz "created_at", default: -> { "now()" }
    t.boolean "is_deleted", default: false, null: false
    t.string "organization_id", null: false
    t.string "summary"
    t.timestamptz "updated_at", default: -> { "now()" }
    t.index ["agent_id"], name: "ix_conversations_agent_id"
    t.index ["organization_id", "agent_id"], name: "ix_conversations_org_agent"
  end

  create_table "file_contents", primary_key: ["file_id", "id"], force: :cascade do |t|
    t.string "_created_by_id"
    t.string "_last_updated_by_id"
    t.timestamptz "created_at", default: -> { "now()" }
    t.string "file_id", null: false
    t.string "id", null: false
    t.boolean "is_deleted", default: false, null: false
    t.text "text", null: false
    t.timestamptz "updated_at", default: -> { "now()" }

    t.unique_constraint ["file_id"], name: "uq_file_contents_file_id"
  end

  create_table "files", id: :string, force: :cascade do |t|
    t.string "_created_by_id"
    t.string "_last_updated_by_id"
    t.integer "chunks_embedded"
    t.timestamptz "created_at", default: -> { "now()" }
    t.text "error_message"
    t.string "file_creation_date"
    t.string "file_last_modified_date"
    t.string "file_name"
    t.string "file_path"
    t.integer "file_size"
    t.string "file_type"
    t.boolean "is_deleted", default: false, null: false
    t.string "organization_id", null: false
    t.string "original_file_name"
    t.string "processing_status", null: false
    t.string "source_id", null: false
    t.integer "total_chunks"
    t.timestamptz "updated_at", default: -> { "now()" }
    t.index ["organization_id", "created_at"], name: "ix_files_org_created", order: { created_at: :desc }
    t.index ["processing_status"], name: "ix_files_processing_status"
    t.index ["source_id", "created_at"], name: "ix_files_source_created", order: { created_at: :desc }
  end

  create_table "files_agents", primary_key: ["id", "file_id", "agent_id"], force: :cascade do |t|
    t.string "_created_by_id"
    t.string "_last_updated_by_id"
    t.string "agent_id", null: false
    t.timestamptz "created_at", default: -> { "now()" }
    t.integer "end_line"
    t.string "file_id", null: false
    t.string "file_name", null: false
    t.string "id", null: false
    t.boolean "is_deleted", default: false, null: false
    t.boolean "is_open", null: false
    t.timestamptz "last_accessed_at", default: -> { "now()" }, null: false
    t.string "organization_id", null: false
    t.string "source_id", null: false
    t.integer "start_line"
    t.timestamptz "updated_at", default: -> { "now()" }
    t.text "visible_content"
    t.index ["agent_id", "file_name"], name: "ix_agent_filename"
    t.index ["file_id", "agent_id"], name: "ix_file_agent"
    t.unique_constraint ["agent_id", "file_name"], name: "uq_agent_filename"
    t.unique_constraint ["file_id", "agent_id"], name: "uq_file_agent"
  end

  create_table "groups", id: :string, force: :cascade do |t|
    t.string "_created_by_id"
    t.string "_last_updated_by_id"
    t.json "agent_ids", null: false
    t.string "base_template_id"
    t.timestamptz "created_at", default: -> { "now()" }
    t.string "deployment_id"
    t.string "description", null: false
    t.boolean "hidden"
    t.boolean "is_deleted", default: false, null: false
    t.string "last_processed_message_id"
    t.string "manager_agent_id"
    t.string "manager_type", null: false
    t.integer "max_message_buffer_length"
    t.integer "max_turns"
    t.integer "min_message_buffer_length"
    t.string "organization_id", null: false
    t.string "project_id"
    t.integer "sleeptime_agent_frequency"
    t.string "template_id"
    t.string "termination_token"
    t.integer "turns_counter"
    t.timestamptz "updated_at", default: -> { "now()" }
  end

  create_table "groups_agents", primary_key: ["group_id", "agent_id"], force: :cascade do |t|
    t.string "agent_id", null: false
    t.string "group_id", null: false
  end

  create_table "groups_blocks", primary_key: ["group_id", "block_id"], force: :cascade do |t|
    t.string "block_id", null: false
    t.string "group_id", null: false
  end

  create_table "identities", id: :string, force: :cascade do |t|
    t.string "_created_by_id"
    t.string "_last_updated_by_id"
    t.timestamptz "created_at", default: -> { "CURRENT_TIMESTAMP" }
    t.string "identifier_key", null: false
    t.string "identity_type", null: false
    t.boolean "is_deleted", default: false, null: false
    t.string "name", null: false
    t.string "organization_id", null: false
    t.string "project_id"
    t.json "properties", default: [], null: false
    t.timestamptz "updated_at", default: -> { "CURRENT_TIMESTAMP" }

    t.unique_constraint ["identifier_key", "project_id", "organization_id"], nulls_not_distinct: true, name: "unique_identifier_key_project_id_organization_id"
  end

  create_table "identities_agents", primary_key: ["identity_id", "agent_id"], force: :cascade do |t|
    t.string "agent_id", null: false
    t.string "identity_id", null: false
  end

  create_table "identities_blocks", primary_key: ["identity_id", "block_id"], force: :cascade do |t|
    t.string "block_id", null: false
    t.string "identity_id", null: false
  end

  create_table "jobs", id: :string, force: :cascade do |t|
    t.string "_created_by_id"
    t.string "_last_updated_by_id"
    t.boolean "background"
    t.string "callback_error"
    t.datetime "callback_sent_at", precision: nil
    t.integer "callback_status_code"
    t.string "callback_url"
    t.datetime "completed_at", precision: nil
    t.timestamptz "created_at", default: -> { "now()" }
    t.boolean "is_deleted", default: false, null: false
    t.string "job_type", null: false
    t.json "metadata_"
    t.string "organization_id"
    t.json "request_config"
    t.string "status", null: false
    t.string "stop_reason"
    t.bigint "total_duration_ns"
    t.bigint "ttft_ns"
    t.timestamptz "updated_at", default: -> { "now()" }
    t.string "user_id", null: false
    t.index ["user_id"], name: "ix_jobs_user_id"
  end

  create_table "llm_batch_items", id: :string, force: :cascade do |t|
    t.string "_created_by_id"
    t.string "_last_updated_by_id"
    t.string "agent_id", null: false
    t.json "batch_request_result"
    t.timestamptz "created_at", default: -> { "now()" }
    t.boolean "is_deleted", default: false, null: false
    t.string "llm_batch_id", null: false
    t.json "llm_config", null: false
    t.string "organization_id", null: false
    t.string "request_status", null: false
    t.json "step_state", null: false
    t.string "step_status", null: false
    t.timestamptz "updated_at", default: -> { "now()" }
    t.index ["agent_id"], name: "ix_llm_batch_items_agent_id"
    t.index ["llm_batch_id"], name: "ix_llm_batch_items_llm_batch_id"
    t.index ["request_status"], name: "ix_llm_batch_items_status"
  end

  create_table "llm_batch_job", id: :string, force: :cascade do |t|
    t.string "_created_by_id"
    t.string "_last_updated_by_id"
    t.json "create_batch_response", null: false
    t.timestamptz "created_at", default: -> { "now()" }
    t.boolean "is_deleted", default: false, null: false
    t.timestamptz "last_polled_at"
    t.json "latest_polling_response"
    t.string "letta_batch_job_id", null: false
    t.string "llm_provider", null: false
    t.string "organization_id", null: false
    t.string "status", null: false
    t.timestamptz "updated_at", default: -> { "now()" }
    t.index ["created_at"], name: "ix_llm_batch_job_created_at"
    t.index ["status"], name: "ix_llm_batch_job_status"
  end

  create_table "mcp_oauth", id: :string, force: :cascade do |t|
    t.string "_created_by_id"
    t.string "_last_updated_by_id"
    t.text "access_token"
    t.text "access_token_enc"
    t.text "authorization_code"
    t.text "authorization_code_enc"
    t.text "authorization_url"
    t.text "client_id"
    t.text "client_secret"
    t.text "client_secret_enc"
    t.timestamptz "created_at", null: false
    t.timestamptz "expires_at"
    t.boolean "is_deleted", default: false, null: false
    t.string "organization_id", null: false
    t.text "redirect_uri"
    t.text "refresh_token"
    t.text "refresh_token_enc"
    t.text "scope"
    t.string "server_id", limit: 255
    t.text "server_name", null: false
    t.text "server_url", null: false
    t.string "state", limit: 255, null: false
    t.string "status", limit: 20, null: false
    t.string "token_type", limit: 50, null: false
    t.timestamptz "updated_at", null: false
    t.string "user_id", null: false

    t.unique_constraint ["state"], name: "mcp_oauth_state_key"
  end

  create_table "mcp_server", id: :string, force: :cascade do |t|
    t.string "_created_by_id"
    t.string "_last_updated_by_id"
    t.timestamptz "created_at", default: -> { "now()" }
    t.json "custom_headers"
    t.text "custom_headers_enc"
    t.boolean "is_deleted", default: false, null: false
    t.json "metadata_"
    t.string "organization_id", null: false
    t.string "server_name", null: false
    t.string "server_type", null: false
    t.string "server_url"
    t.json "stdio_config"
    t.string "token"
    t.text "token_enc"
    t.timestamptz "updated_at", default: -> { "now()" }

    t.unique_constraint ["server_name", "organization_id"], name: "uix_name_organization_mcp_server"
  end

  create_table "mcp_tools", id: :string, force: :cascade do |t|
    t.string "_created_by_id"
    t.string "_last_updated_by_id"
    t.timestamptz "created_at", default: -> { "now()" }
    t.boolean "is_deleted", default: false, null: false
    t.string "mcp_server_id", null: false
    t.string "organization_id", null: false
    t.string "tool_id", null: false
    t.timestamptz "updated_at", default: -> { "now()" }
  end

  create_table "messages", id: :string, force: :cascade do |t|
    t.string "_created_by_id"
    t.string "_last_updated_by_id"
    t.string "agent_id", null: false
    t.string "approval_request_id"
    t.json "approvals"
    t.boolean "approve"
    t.string "batch_item_id"
    t.json "content"
    t.string "conversation_id"
    t.timestamptz "created_at"
    t.string "denial_reason"
    t.string "group_id"
    t.boolean "is_deleted", default: false, null: false
    t.boolean "is_err"
    t.string "model"
    t.string "name"
    t.string "organization_id", null: false
    t.string "otid"
    t.string "role", null: false
    t.string "run_id"
    t.string "sender_id"
    t.bigint "sequence_id", null: false
    t.string "step_id"
    t.string "text"
    t.string "tool_call_id"
    t.json "tool_calls", null: false
    t.json "tool_returns"
    t.timestamptz "updated_at", default: -> { "now()" }
    t.index ["agent_id", "created_at"], name: "ix_messages_agent_created_at"
    t.index ["agent_id", "sequence_id"], name: "ix_messages_agent_sequence"
    t.index ["conversation_id"], name: "ix_messages_conversation_id"
    t.index ["created_at", "id"], name: "ix_messages_created_at"
    t.index ["organization_id", "agent_id"], name: "ix_messages_org_agent"
    t.index ["run_id", "sequence_id"], name: "ix_messages_run_sequence"
    t.index ["step_id"], name: "idx_messages_step_id"
    t.unique_constraint ["sequence_id"], name: "uq_messages_sequence_id"
  end

  create_table "organizations", id: :string, force: :cascade do |t|
    t.string "_created_by_id"
    t.string "_last_updated_by_id"
    t.timestamptz "created_at"
    t.boolean "is_deleted", default: false, null: false
    t.string "name", null: false
    t.boolean "privileged_tools", null: false
    t.string "secret_key"
    t.timestamptz "updated_at", default: -> { "now()" }
  end

  create_table "passage_tags", id: :string, force: :cascade do |t|
    t.string "_created_by_id"
    t.string "_last_updated_by_id"
    t.string "archive_id", null: false
    t.timestamptz "created_at", default: -> { "now()" }
    t.boolean "is_deleted", default: false, null: false
    t.string "organization_id", null: false
    t.string "passage_id", null: false
    t.string "tag", null: false
    t.timestamptz "updated_at", default: -> { "now()" }
    t.index ["organization_id", "archive_id"], name: "ix_passage_tags_org_archive"
    t.index ["tag"], name: "ix_passage_tags_tag"
    t.unique_constraint ["passage_id", "tag"], name: "uq_passage_tag"
  end

  create_table "prompts", id: :string, force: :cascade do |t|
    t.string "_created_by_id"
    t.string "_last_updated_by_id"
    t.timestamptz "created_at", default: -> { "now()" }
    t.boolean "is_deleted", default: false, null: false
    t.string "project_id"
    t.string "prompt", null: false
    t.timestamptz "updated_at", default: -> { "now()" }
  end

  create_table "provider_models", id: :string, force: :cascade do |t|
    t.string "_created_by_id"
    t.string "_last_updated_by_id"
    t.timestamptz "created_at", default: -> { "now()" }
    t.string "display_name", null: false
    t.integer "embedding_dim"
    t.boolean "enabled", default: true, null: false
    t.string "handle", null: false
    t.boolean "is_deleted", default: false, null: false
    t.integer "max_context_window"
    t.string "model_endpoint_type", null: false
    t.string "model_type", null: false
    t.string "name", null: false
    t.string "organization_id"
    t.string "provider_id", null: false
    t.boolean "supports_token_streaming"
    t.boolean "supports_tool_calling"
    t.timestamptz "updated_at", default: -> { "now()" }
    t.index ["handle"], name: "ix_provider_models_handle"
    t.index ["model_type"], name: "ix_provider_models_model_type"
    t.index ["organization_id"], name: "ix_provider_models_organization_id"
    t.index ["provider_id"], name: "ix_provider_models_provider_id"
    t.unique_constraint ["handle", "organization_id", "model_type"], name: "unique_handle_per_org_and_type"
    t.unique_constraint ["name", "provider_id", "model_type"], name: "unique_model_per_provider_and_type"
  end

  create_table "provider_traces", id: :string, force: :cascade do |t|
    t.string "_created_by_id"
    t.string "_last_updated_by_id"
    t.string "agent_id"
    t.json "agent_tags"
    t.string "call_type"
    t.timestamptz "created_at", default: -> { "now()" }
    t.boolean "is_deleted", default: false, null: false
    t.string "organization_id", null: false
    t.json "request_json", null: false
    t.json "response_json", null: false
    t.string "run_id"
    t.string "source"
    t.string "step_id"
    t.timestamptz "updated_at", default: -> { "now()" }
    t.index ["step_id"], name: "ix_step_id"
  end

  create_table "providers", id: :string, force: :cascade do |t|
    t.string "_created_by_id"
    t.string "_last_updated_by_id"
    t.string "access_key"
    t.text "access_key_enc"
    t.string "api_key"
    t.text "api_key_enc"
    t.string "api_version"
    t.string "base_url"
    t.timestamptz "created_at", default: -> { "now()" }
    t.boolean "is_deleted", default: false, null: false
    t.string "name", null: false
    t.string "organization_id"
    t.string "provider_category"
    t.string "provider_type"
    t.string "region"
    t.timestamptz "updated_at", default: -> { "now()" }

    t.unique_constraint ["name", "organization_id"], name: "unique_name_organization_id"
  end

  create_table "run_metrics", id: :string, force: :cascade do |t|
    t.string "_created_by_id"
    t.string "_last_updated_by_id"
    t.string "agent_id", null: false
    t.string "base_template_id"
    t.timestamptz "created_at", default: -> { "now()" }
    t.string "deployment_id"
    t.boolean "is_deleted", default: false, null: false
    t.integer "num_steps"
    t.string "organization_id", null: false
    t.string "project_id"
    t.bigint "run_ns"
    t.bigint "run_start_ns"
    t.string "template_id"
    t.json "tools_used"
    t.timestamptz "updated_at", default: -> { "now()" }
  end

  create_table "runs", id: :string, force: :cascade do |t|
    t.string "_created_by_id"
    t.string "_last_updated_by_id"
    t.string "agent_id", null: false
    t.boolean "background"
    t.string "base_template_id"
    t.string "callback_error"
    t.datetime "callback_sent_at", precision: nil
    t.integer "callback_status_code"
    t.string "callback_url"
    t.datetime "completed_at", precision: nil
    t.string "conversation_id"
    t.timestamptz "created_at", default: -> { "now()" }
    t.string "deployment_id"
    t.boolean "is_deleted", default: false, null: false
    t.json "metadata_"
    t.string "organization_id", null: false
    t.string "project_id"
    t.json "request_config"
    t.string "status", null: false
    t.string "stop_reason"
    t.string "template_id"
    t.bigint "total_duration_ns"
    t.bigint "ttft_ns"
    t.timestamptz "updated_at", default: -> { "now()" }
    t.index ["agent_id"], name: "ix_runs_agent_id"
    t.index ["conversation_id"], name: "ix_runs_conversation_id"
    t.index ["created_at", "id"], name: "ix_runs_created_at"
    t.index ["organization_id"], name: "ix_runs_organization_id"
  end

  create_table "sandbox_configs", id: :string, force: :cascade do |t|
    t.string "_created_by_id"
    t.string "_last_updated_by_id"
    t.json "config", null: false
    t.timestamptz "created_at", default: -> { "now()" }
    t.boolean "is_deleted", default: false, null: false
    t.string "organization_id", null: false
    t.enum "type", null: false, enum_type: "sandboxtype"
    t.timestamptz "updated_at", default: -> { "now()" }

    t.unique_constraint ["type", "organization_id"], name: "uix_type_organization"
  end

  create_table "sandbox_environment_variables", id: :string, force: :cascade do |t|
    t.string "_created_by_id"
    t.string "_last_updated_by_id"
    t.timestamptz "created_at", default: -> { "now()" }
    t.string "description"
    t.boolean "is_deleted", default: false, null: false
    t.string "key", null: false
    t.string "organization_id", null: false
    t.string "sandbox_config_id", null: false
    t.timestamptz "updated_at", default: -> { "now()" }
    t.string "value", null: false
    t.text "value_enc"

    t.unique_constraint ["key", "sandbox_config_id"], name: "uix_key_sandbox_config"
  end

# Could not dump table "source_passages" because of following StandardError
#   Unknown type 'vector(4096)' for column 'embedding'


  create_table "sources", id: :string, force: :cascade do |t|
    t.string "_created_by_id"
    t.string "_last_updated_by_id"
    t.timestamptz "created_at", default: -> { "now()" }
    t.string "description"
    t.json "embedding_config", null: false
    t.string "instructions"
    t.boolean "is_deleted", default: false, null: false
    t.json "metadata_"
    t.string "name", null: false
    t.string "organization_id", null: false
    t.timestamptz "updated_at", default: -> { "now()" }
    t.enum "vector_db_provider", null: false, enum_type: "vectordbprovider"
    t.index ["created_at", "id"], name: "source_created_at_id_idx"
    t.unique_constraint ["name", "organization_id"], name: "uq_source_name_organization"
  end

  create_table "sources_agents", primary_key: ["agent_id", "source_id"], force: :cascade do |t|
    t.string "agent_id", null: false
    t.string "source_id", null: false
    t.index ["source_id"], name: "ix_sources_agents_source_id"
  end

  create_table "step_metrics", id: :string, force: :cascade do |t|
    t.string "_created_by_id"
    t.string "_last_updated_by_id"
    t.string "agent_id", null: false
    t.string "base_template_id"
    t.timestamptz "created_at", default: -> { "now()" }
    t.boolean "is_deleted", default: false, null: false
    t.bigint "llm_request_ns"
    t.bigint "llm_request_start_ns"
    t.string "organization_id"
    t.string "project_id"
    t.string "provider_id"
    t.string "run_id"
    t.bigint "step_ns"
    t.bigint "step_start_ns"
    t.string "template_id"
    t.bigint "tool_execution_ns"
    t.timestamptz "updated_at", default: -> { "now()" }
    t.index ["run_id"], name: "ix_step_metrics_run_id"
  end

  create_table "steps", id: :string, force: :cascade do |t|
    t.string "_created_by_id"
    t.string "_last_updated_by_id"
    t.string "agent_id"
    t.integer "completion_tokens", default: 0, null: false
    t.json "completion_tokens_details"
    t.integer "context_window_limit"
    t.timestamptz "created_at", default: -> { "now()" }
    t.json "error_data"
    t.string "error_type"
    t.string "feedback"
    t.boolean "is_deleted", default: false, null: false
    t.string "model"
    t.string "model_endpoint"
    t.string "organization_id"
    t.string "origin"
    t.string "project_id"
    t.integer "prompt_tokens", default: 0, null: false
    t.json "prompt_tokens_details"
    t.string "provider_category"
    t.string "provider_id"
    t.string "provider_name"
    t.string "request_id"
    t.string "run_id"
    t.enum "status", enum_type: "stepstatus"
    t.string "stop_reason"
    t.json "tags"
    t.string "tid"
    t.integer "total_tokens", default: 0, null: false
    t.string "trace_id"
    t.timestamptz "updated_at", default: -> { "now()" }
    t.index ["run_id"], name: "ix_steps_run_id"
  end

  create_table "tools", id: :string, force: :cascade do |t|
    t.string "_created_by_id"
    t.string "_last_updated_by_id"
    t.json "args_json_schema"
    t.timestamptz "created_at", default: -> { "now()" }
    t.boolean "default_requires_approval"
    t.string "description"
    t.boolean "enable_parallel_execution"
    t.boolean "is_deleted", default: false, null: false
    t.json "json_schema"
    t.json "metadata_"
    t.string "name", null: false
    t.json "npm_requirements"
    t.string "organization_id", null: false
    t.json "pip_requirements"
    t.string "project_id"
    t.integer "return_char_limit"
    t.string "source_code"
    t.string "source_type", null: false
    t.json "tags", null: false
    t.string "tool_type", null: false
    t.timestamptz "updated_at", default: -> { "now()" }
    t.index ["created_at", "name"], name: "ix_tools_created_at_name"
    t.index ["organization_id", "name"], name: "ix_tools_organization_id_name"
    t.index ["organization_id"], name: "ix_tools_organization_id"
    t.unique_constraint ["name", "organization_id"], name: "uix_name_organization"
    t.unique_constraint ["organization_id", "project_id", "name"], nulls_not_distinct: true, name: "uix_organization_project_name"
  end

  create_table "tools_agents", id: false, force: :cascade do |t|
    t.string "agent_id", null: false
    t.string "tool_id", null: false
    t.index ["tool_id"], name: "ix_tools_agents_tool_id"
    t.unique_constraint ["agent_id", "tool_id"], name: "unique_agent_tool"
  end

  create_table "users", id: :string, force: :cascade do |t|
    t.string "_created_by_id"
    t.string "_last_updated_by_id"
    t.timestamptz "created_at"
    t.boolean "is_deleted", default: false, null: false
    t.string "name", null: false
    t.string "organization_id", null: false
    t.timestamptz "updated_at", default: -> { "now()" }
  end

  add_foreign_key "agent_environment_variables", "agents", name: "agent_environment_variables_agent_id_fkey", on_delete: :cascade
  add_foreign_key "agent_environment_variables", "organizations", name: "agent_environment_variables_organization_id_fkey"
  add_foreign_key "agent_mappings", "bot_templates"
  add_foreign_key "agents", "organizations", name: "agents_organization_id_fkey"
  add_foreign_key "agents_tags", "agents", name: "agents_tags_agent_id_fkey"
  add_foreign_key "archival_passages", "archives", name: "agent_passages_archive_id_fkey", on_delete: :cascade
  add_foreign_key "archival_passages", "organizations", name: "agent_passages_organization_id_fkey"
  add_foreign_key "archives", "organizations", name: "archives_organization_id_fkey"
  add_foreign_key "archives_agents", "agents", name: "archives_agents_agent_id_fkey", on_delete: :cascade
  add_foreign_key "archives_agents", "archives", name: "archives_agents_archive_id_fkey", on_delete: :cascade
  add_foreign_key "block", "block_history", column: "current_history_entry_id", name: "fk_block_current_history_entry"
  add_foreign_key "block", "organizations", name: "block_organization_id_fkey"
  add_foreign_key "block_history", "block", name: "block_history_block_id_fkey", on_delete: :cascade
  add_foreign_key "block_history", "organizations", name: "block_history_organization_id_fkey"
  add_foreign_key "blocks_agents", "agents", name: "blocks_agents_agent_id_fkey", on_delete: :cascade
  add_foreign_key "blocks_agents", "block", column: ["block_id", "block_label"], primary_key: ["id", "label"], name: "fk_block_id_label", on_update: :cascade, on_delete: :cascade, deferrable: :immediate
  add_foreign_key "blocks_conversations", "block", name: "blocks_conversations_block_id_fkey", on_delete: :cascade
  add_foreign_key "blocks_conversations", "conversations", name: "blocks_conversations_conversation_id_fkey", on_delete: :cascade
  add_foreign_key "blocks_tags", "block", name: "blocks_tags_block_id_fkey"
  add_foreign_key "blocks_tags", "organizations", name: "blocks_tags_organization_id_fkey"
  add_foreign_key "conversation_messages", "agents", name: "conversation_messages_agent_id_fkey", on_delete: :cascade
  add_foreign_key "conversation_messages", "conversations", name: "conversation_messages_conversation_id_fkey", on_delete: :cascade
  add_foreign_key "conversation_messages", "messages", name: "conversation_messages_message_id_fkey", on_delete: :cascade
  add_foreign_key "conversation_messages", "organizations", name: "conversation_messages_organization_id_fkey"
  add_foreign_key "conversations", "agents", name: "conversations_agent_id_fkey", on_delete: :cascade
  add_foreign_key "conversations", "organizations", name: "conversations_organization_id_fkey"
  add_foreign_key "file_contents", "files", name: "file_contents_file_id_fkey", on_delete: :cascade
  add_foreign_key "files", "organizations", name: "files_organization_id_fkey"
  add_foreign_key "files", "sources", name: "files_source_id_fkey", on_delete: :cascade
  add_foreign_key "files_agents", "agents", name: "files_agents_agent_id_fkey", on_delete: :cascade
  add_foreign_key "files_agents", "files", name: "files_agents_file_id_fkey", on_delete: :cascade
  add_foreign_key "files_agents", "organizations", name: "files_agents_organization_id_fkey"
  add_foreign_key "files_agents", "sources", name: "files_agents_source_id_fkey", on_delete: :cascade
  add_foreign_key "groups", "agents", column: "manager_agent_id", name: "groups_manager_agent_id_fkey", on_delete: :restrict
  add_foreign_key "groups", "organizations", name: "groups_organization_id_fkey"
  add_foreign_key "groups_agents", "agents", name: "groups_agents_agent_id_fkey", on_delete: :cascade
  add_foreign_key "groups_agents", "groups", name: "groups_agents_group_id_fkey", on_delete: :cascade
  add_foreign_key "groups_blocks", "block", name: "groups_blocks_block_id_fkey", on_delete: :cascade
  add_foreign_key "groups_blocks", "groups", name: "groups_blocks_group_id_fkey", on_delete: :cascade
  add_foreign_key "identities", "organizations", name: "identities_organization_id_fkey"
  add_foreign_key "identities_agents", "agents", name: "identities_agents_agent_id_fkey", on_delete: :cascade
  add_foreign_key "identities_agents", "identities", name: "identities_agents_identity_id_fkey", on_delete: :cascade
  add_foreign_key "identities_blocks", "block", name: "identities_blocks_block_id_fkey", on_delete: :cascade
  add_foreign_key "identities_blocks", "identities", name: "identities_blocks_identity_id_fkey", on_delete: :cascade
  add_foreign_key "jobs", "organizations", name: "fk_jobs_organization_id"
  add_foreign_key "jobs", "users", name: "jobs_user_id_fkey"
  add_foreign_key "llm_batch_items", "agents", name: "llm_batch_items_agent_id_fkey", on_delete: :cascade
  add_foreign_key "llm_batch_items", "llm_batch_job", column: "llm_batch_id", name: "llm_batch_items_llm_batch_id_fkey", on_delete: :cascade
  add_foreign_key "llm_batch_items", "organizations", name: "llm_batch_items_organization_id_fkey"
  add_foreign_key "llm_batch_job", "jobs", column: "letta_batch_job_id", name: "llm_batch_job_letta_batch_job_id_fkey", on_delete: :cascade
  add_foreign_key "llm_batch_job", "organizations", name: "llm_batch_job_organization_id_fkey"
  add_foreign_key "mcp_oauth", "mcp_server", column: "server_id", name: "mcp_oauth_server_id_fkey", on_delete: :cascade
  add_foreign_key "mcp_oauth", "organizations", name: "mcp_oauth_organization_id_fkey"
  add_foreign_key "mcp_oauth", "users", name: "mcp_oauth_user_id_fkey"
  add_foreign_key "mcp_server", "organizations", name: "mcp_server_organization_id_fkey"
  add_foreign_key "mcp_tools", "organizations", name: "mcp_tools_organization_id_fkey"
  add_foreign_key "messages", "agents", name: "messages_agent_id_fkey", on_delete: :cascade
  add_foreign_key "messages", "conversations", name: "messages_conversation_id_fkey", on_delete: :nullify
  add_foreign_key "messages", "organizations", name: "messages_organization_id_fkey"
  add_foreign_key "messages", "runs", name: "fk_messages_run_id", on_delete: :nullify
  add_foreign_key "messages", "steps", name: "fk_messages_step_id", on_delete: :nullify
  add_foreign_key "passage_tags", "archival_passages", column: "passage_id", name: "passage_tags_passage_id_fkey", on_delete: :cascade
  add_foreign_key "passage_tags", "archives", name: "passage_tags_archive_id_fkey", on_delete: :cascade
  add_foreign_key "passage_tags", "organizations", name: "passage_tags_organization_id_fkey"
  add_foreign_key "provider_models", "organizations", name: "provider_models_organization_id_fkey", on_delete: :cascade
  add_foreign_key "provider_models", "providers", name: "provider_models_provider_id_fkey", on_delete: :cascade
  add_foreign_key "provider_traces", "organizations", name: "provider_traces_organization_id_fkey"
  add_foreign_key "providers", "organizations", name: "providers_organization_id_fkey"
  add_foreign_key "run_metrics", "agents", name: "run_metrics_agent_id_fkey", on_delete: :cascade
  add_foreign_key "run_metrics", "organizations", name: "run_metrics_organization_id_fkey"
  add_foreign_key "run_metrics", "runs", column: "id", name: "run_metrics_id_fkey", on_delete: :cascade
  add_foreign_key "runs", "agents", name: "runs_agent_id_fkey"
  add_foreign_key "runs", "conversations", name: "runs_conversation_id_fkey", on_delete: :nullify
  add_foreign_key "runs", "organizations", name: "runs_organization_id_fkey"
  add_foreign_key "sandbox_configs", "organizations", name: "sandbox_configs_organization_id_fkey"
  add_foreign_key "sandbox_environment_variables", "organizations", name: "sandbox_environment_variables_organization_id_fkey"
  add_foreign_key "sandbox_environment_variables", "sandbox_configs", name: "sandbox_environment_variables_sandbox_config_id_fkey"
  add_foreign_key "source_passages", "files", name: "source_passages_file_id_fkey", on_delete: :cascade
  add_foreign_key "source_passages", "organizations", name: "source_passages_organization_id_fkey"
  add_foreign_key "source_passages", "sources", name: "source_passages_source_id_fkey", on_delete: :cascade
  add_foreign_key "sources", "organizations", name: "sources_organization_id_fkey"
  add_foreign_key "sources_agents", "agents", name: "sources_agents_agent_id_fkey", on_delete: :cascade
  add_foreign_key "sources_agents", "sources", name: "sources_agents_source_id_fkey", on_delete: :cascade
  add_foreign_key "step_metrics", "agents", name: "step_metrics_agent_id_fkey", on_delete: :cascade
  add_foreign_key "step_metrics", "organizations", name: "step_metrics_organization_id_fkey", on_delete: :restrict
  add_foreign_key "step_metrics", "providers", name: "step_metrics_provider_id_fkey", on_delete: :restrict
  add_foreign_key "step_metrics", "runs", name: "fk_step_metrics_run_id", on_delete: :nullify
  add_foreign_key "step_metrics", "steps", column: "id", name: "step_metrics_id_fkey", on_delete: :cascade
  add_foreign_key "steps", "organizations", name: "fk_steps_provider_id", on_delete: :restrict
  add_foreign_key "steps", "providers", name: "fk_steps_organization_id", on_delete: :restrict
  add_foreign_key "steps", "runs", name: "fk_steps_run_id", on_delete: :nullify
  add_foreign_key "tools", "organizations", name: "tools_organization_id_fkey"
  add_foreign_key "tools_agents", "agents", name: "tools_agents_agent_id_fkey", on_delete: :cascade
  add_foreign_key "tools_agents", "tools", name: "tools_agents_tool_id_fkey", on_delete: :cascade
  add_foreign_key "users", "organizations", name: "users_organization_id_fkey"
end
