-- =====================================================
-- Migration: Initial Custom Tables
-- =====================================================
-- Run: cat 001_init_custom_tables.sql | docker exec -i letta_server psql -U letta -d letta

-- =====================================================
-- Table 1: bot_templates
-- =====================================================
-- Purpose: Store bot configs to reuse when creating agents
-- Maps: FE AIAssistant + Letta agents structure

CREATE TABLE IF NOT EXISTS letta.bot_templates (
  -- IDs
  id                VARCHAR PRIMARY KEY,              -- FE: AIAssistant.id
  organization_id   VARCHAR NOT NULL,                 -- Multi-tenant support

  -- Basic Info (from FE)
  name              VARCHAR NOT NULL,                 -- FE: AIAssistant.name
  greeting          TEXT NOT NULL,                    -- FE: AIAssistant.greeting
  status            VARCHAR DEFAULT 'active',         -- FE: AIAssistant.status

  -- Agent Config (pass to Letta API)
  system            VARCHAR NOT NULL,                 -- FE: AIAssistant.systemPrompt
  llm_config        JSONB,                            -- Letta: agents.llm_config (model, temperature, ...)
  tool_rules        JSONB DEFAULT '[]'::jsonb,        -- Letta: agents.tool_rules
  knowledge_base_ids VARCHAR[] DEFAULT '{}',          -- Array of KB IDs

  -- UI Theme (for widget)
  theme_config      JSONB,                            -- FE: {primaryColor, botAvatarUrl, bubbleIconUrl, footerText}

  -- Timestamps
  created_at        TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at        TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_bot_templates_org ON letta.bot_templates(organization_id);
CREATE INDEX IF NOT EXISTS idx_bot_templates_status ON letta.bot_templates(status);
CREATE INDEX IF NOT EXISTS idx_bot_templates_kb_ids ON letta.bot_templates USING GIN(knowledge_base_ids);

-- =====================================================
-- Table 2: agent_mappings
-- =====================================================
-- Purpose: Map (chatbot + user) → agent in letta.agents
-- FK: bot_templates ONLY (NO FK to letta.agents)

CREATE TABLE IF NOT EXISTS letta.agent_mappings (
  id            SERIAL PRIMARY KEY,
  chatbot_id    VARCHAR NOT NULL,                     -- FK to bot_templates.id
  user_id       VARCHAR,                              -- Customer user ID (empty string = anonymous)
  agent_id      VARCHAR NOT NULL,                     -- Reference to letta.agents.id (NO FK)
  created_at    TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_used_at  TIMESTAMP WITH TIME ZONE DEFAULT now(),

  -- FK only to bot_templates
  CONSTRAINT fk_chatbot FOREIGN KEY (chatbot_id) REFERENCES letta.bot_templates(id) ON DELETE CASCADE,

  -- Unique: 1 user only has 1 agent per bot
  CONSTRAINT unique_chatbot_user UNIQUE (chatbot_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_mappings_chatbot_user ON letta.agent_mappings(chatbot_id, user_id);
CREATE INDEX IF NOT EXISTS idx_mappings_agent ON letta.agent_mappings(agent_id);

-- =====================================================
-- Table 3: knowledge_bases
-- =====================================================
-- Purpose: Manage reusable knowledge bases, link with letta.sources

CREATE TABLE IF NOT EXISTS letta.knowledge_bases (
  id                VARCHAR PRIMARY KEY,
  name              VARCHAR NOT NULL,
  description       TEXT,
  content           TEXT NOT NULL,
  letta_source_id   VARCHAR,                          -- Link to letta.sources.id
  status            VARCHAR DEFAULT 'processing',     -- processing/success/failed
  organization_id   VARCHAR NOT NULL DEFAULT 'org-00000000-0000-4000-8000-000000000000',
  created_at        TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at        TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_knowledge_bases_org ON letta.knowledge_bases(organization_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_bases_status ON letta.knowledge_bases(status);
CREATE INDEX IF NOT EXISTS idx_knowledge_bases_letta_source ON letta.knowledge_bases(letta_source_id);

-- =====================================================
-- Triggers: Auto-update timestamps
-- =====================================================

-- Trigger for bot_templates
CREATE OR REPLACE FUNCTION letta.update_bot_templates_ts()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_bot_templates_updated ON letta.bot_templates;
CREATE TRIGGER trg_bot_templates_updated
BEFORE UPDATE ON letta.bot_templates
FOR EACH ROW EXECUTE FUNCTION letta.update_bot_templates_ts();

-- Trigger for agent_mappings
CREATE OR REPLACE FUNCTION letta.update_agent_mappings_ts()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_used_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_agent_mappings_used ON letta.agent_mappings;
CREATE TRIGGER trg_agent_mappings_used
BEFORE UPDATE ON letta.agent_mappings
FOR EACH ROW EXECUTE FUNCTION letta.update_agent_mappings_ts();

-- Trigger for knowledge_bases
CREATE OR REPLACE FUNCTION letta.update_knowledge_bases_ts()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_knowledge_bases_updated ON letta.knowledge_bases;
CREATE TRIGGER trg_knowledge_bases_updated
BEFORE UPDATE ON letta.knowledge_bases
FOR EACH ROW EXECUTE FUNCTION letta.update_knowledge_bases_ts();
