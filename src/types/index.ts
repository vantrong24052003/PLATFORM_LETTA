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
