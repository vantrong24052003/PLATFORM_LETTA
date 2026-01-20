export interface AgentOptions {
  name?: string;
  system?: string;
  model?: string;
  embedding?: string;
  tools?: string[];
  tool_rules?: any[];
  include_base_tool_rules?: boolean;
  memory_blocks?: Array<{ label: string; value: string }>;
}

export interface ToolOptions {
  name: string;
  description: string;
  sourceCode: string;
  jsonSchema?: any;
  defaultRequiresApproval?: boolean;
}

export interface ApiResponse<T = any> {
  message?: string;
  data?: T;
  error?: string;
  stack?: string;
}

export interface BotTemplate {
  id: string;
  name: string;
  greeting: string;
  system: string;
  llm_config?: any;
  tool_rules?: any[];
  theme_config?: any;
  knowledge_base_ids?: string[];
  organization_id: string;
  status: string;
  created_at: Date;
  updated_at: Date;
}

export interface AgentMapping {
  id: number;
  chatbot_id: string;
  user_id: string | null;
  agent_id: string;
  created_at: Date;
  last_used_at: Date;
}

export interface BotCreateInput {
  id: string;
  name: string;
  greeting: string;
  system: string;
  llm_config?: any;
  tool_rules?: any[];
  theme_config?: any;
  organization_id: string;
}
