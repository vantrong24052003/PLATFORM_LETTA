-- =====================================================
-- Migration: Tạo 2 Bảng Bot
-- =====================================================
-- Run: cat create_bot_tables.sql | docker exec -i letta_server psql -U letta -d letta

-- =====================================================
-- Bảng 1: bot_templates
-- =====================================================
-- Lưu config bot để tái sử dụng khi tạo agents
-- Map từ: FE AIAssistant + Letta agents structure

CREATE TABLE letta.bot_templates (
  -- IDs
  id                VARCHAR PRIMARY KEY,              -- FE: AIAssistant.id
  organization_id   VARCHAR NOT NULL,                 -- Letta: agents.organization_id

  -- Basic Info (từ FE)
  name              VARCHAR NOT NULL,                 -- FE: AIAssistant.name
  greeting          TEXT NOT NULL,                    -- FE: AIAssistant.greeting
  status            VARCHAR DEFAULT 'active',         -- FE: AIAssistant.status

  -- Agent Config (pass vào Letta API)
  system            VARCHAR NOT NULL,                 -- FE: AIAssistant.systemPrompt
  llm_config        JSON,                             -- Letta: agents.llm_config (model, temperature, ...)
  tool_rules        JSON DEFAULT '[]'::json,          -- Letta: agents.tool_rules

  -- UI Theme (cho widget)
  theme_config      JSON,                             -- FE: {primaryColor, botAvatarUrl, bubbleIconUrl, footerText}

  -- Timestamps
  created_at        TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at        TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_bot_templates_org ON letta.bot_templates(organization_id);
CREATE INDEX idx_bot_templates_status ON letta.bot_templates(status);

-- =====================================================
-- Bảng 2: agent_mappings
-- =====================================================
-- Map (chatbot + user) → agent trong letta.agents
-- FK: bot_templates ONLY (KHÔNG FK tới letta.agents)

CREATE TABLE letta.agent_mappings (
  id            SERIAL PRIMARY KEY,
  chatbot_id    VARCHAR NOT NULL,                     -- FK to bot_templates.id
  user_id       VARCHAR,                              -- Customer user ID (NULL = anonymous)
  agent_id      VARCHAR NOT NULL,                     -- Reference to letta.agents.id (NO FK)
  created_at    TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_used_at  TIMESTAMP WITH TIME ZONE DEFAULT now(),

  -- FK chỉ tới bot_templates
  CONSTRAINT fk_chatbot FOREIGN KEY (chatbot_id) REFERENCES letta.bot_templates(id) ON DELETE CASCADE,

  -- Unique: 1 user chỉ có 1 agent per bot
  CONSTRAINT unique_chatbot_user UNIQUE (chatbot_id, user_id)
);

CREATE INDEX idx_mappings_chatbot_user ON letta.agent_mappings(chatbot_id, user_id);
CREATE INDEX idx_mappings_agent ON letta.agent_mappings(agent_id);

-- =====================================================
-- Triggers: Auto-update timestamps
-- =====================================================

CREATE FUNCTION letta.update_bot_templates_ts()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_bot_templates_updated
BEFORE UPDATE ON letta.bot_templates
FOR EACH ROW EXECUTE FUNCTION letta.update_bot_templates_ts();

CREATE FUNCTION letta.update_agent_mappings_ts()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_used_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_agent_mappings_used
BEFORE UPDATE ON letta.agent_mappings
FOR EACH ROW EXECUTE FUNCTION letta.update_agent_mappings_ts();

-- =====================================================
-- Sample Data
-- =====================================================

INSERT INTO letta.bot_templates (
  id, name, greeting, system,
  llm_config, theme_config, organization_id
) VALUES (
  'bot_sample',
  'Sample Bot',
  'Hello! How can I help?',
  'You are a helpful assistant.',
  '{"model": "GLM-4.7", "temperature": 0.7}'::json,
  '{"primaryColor": "#1677ff"}'::json,
  'org-00000000-0000-4000-8000-000000000000'
) ON CONFLICT (id) DO NOTHING;
