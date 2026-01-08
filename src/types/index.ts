export interface AgentOptions {
  name?: string;
  system?: string;
  model?: string;
  embedding?: string;
  tools?: string[];
  memory_blocks?: Array<{ label: string; value: string }>;
}

export interface ApiResponse<T = any> {
  message?: string;
  data?: T;
  error?: string;
  stack?: string;
}
