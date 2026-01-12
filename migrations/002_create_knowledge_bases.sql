-- Run: cat 002_create_knowledge_bases.sql | docker exec -i letta_server psql -U letta -d letta

CREATE TABLE letta.knowledge_bases (
  id                VARCHAR PRIMARY KEY,
  name              VARCHAR NOT NULL,
  description       TEXT,
  content           TEXT NOT NULL,
  letta_source_id   VARCHAR,
  status            VARCHAR DEFAULT 'processing',
  organization_id   VARCHAR NOT NULL DEFAULT 'org-00000000-0000-4000-8000-000000000000',
  created_at        TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at        TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_knowledge_bases_org ON letta.knowledge_bases(organization_id);
CREATE INDEX idx_knowledge_bases_status ON letta.knowledge_bases(status);
CREATE INDEX idx_knowledge_bases_letta_source ON letta.knowledge_bases(letta_source_id);

CREATE FUNCTION letta.update_knowledge_bases_ts()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_knowledge_bases_updated
BEFORE UPDATE ON letta.knowledge_bases
FOR EACH ROW EXECUTE FUNCTION letta.update_knowledge_bases_ts();

ALTER TABLE letta.bot_templates 
ADD COLUMN IF NOT EXISTS knowledge_base_ids VARCHAR[] DEFAULT '{}';

CREATE INDEX IF NOT EXISTS idx_bot_templates_kb_ids ON letta.bot_templates USING GIN(knowledge_base_ids);

INSERT INTO letta.knowledge_bases (
  id, name, description, content, status, organization_id
) VALUES (
  'kb_sample',
  'Sample Knowledge Base',
  'Example FAQ for testing',
  'Q: What are your working hours?\nA: We work from 9 AM to 6 PM, Monday to Friday.\n\nQ: Where is your office?\nA: 123 Nguyen Hue St, District 1, Ho Chi Minh City.',
  'success',
  'org-00000000-0000-4000-8000-000000000000'
) ON CONFLICT (id) DO NOTHING;
