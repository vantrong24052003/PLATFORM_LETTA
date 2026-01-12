export interface BotConfig {
  id: string;
  name: string;
  greeting: string;
  system: string;
  llm_config?: LLMConfig;
  tool_rules?: ToolRule[];
  theme_config?: ThemeConfig;
  organization_id: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface LLMConfig {
  model?: string;
  temperature?: number;
  embedding?: string;
  tools?: string[];
  include_base_tool_rules?: boolean;
  memory_blocks?: MemoryBlock[];
}

export interface ToolRule {
  type: string;
  tool_name?: string;
  children?: ToolRule[];
}

export interface ThemeConfig {
  primaryColor?: string;
  botAvatarUrl?: string;
  bubbleIconUrl?: string;
  footerText?: string;
}

export interface MemoryBlock {
  label: string;
  value: string;
}

export interface MessageResponse {
  messages: Message[];
  stop_reason?: {
    message_type: string;
    stop_reason: string;
  };
  usage?: UsageStats;
}

export interface Message {
  id: string;
  date: string;
  name: string | null;
  message_type: string;
  content?: string;
  reasoning?: string;
  otid?: string;
  sender_id?: string | null;
  step_id?: string;
  is_err?: boolean | null;
  seq_id?: number | null;
  run_id?: string;
  source?: string;
  signature?: string | null;
}

export interface UsageStats {
  message_type: string;
  completion_tokens: number;
  prompt_tokens: number;
  total_tokens: number;
  step_count: number;
  run_ids?: string[] | null;
  cached_input_tokens?: number;
  cache_write_tokens?: number;
  reasoning_tokens?: number;
}

export interface AgentResponse {
  agentId: string;
}

export interface ChatbotWidgetAPI {
  setAgent: (agentId: string) => void;
  createAgent: (userId?: string) => Promise<string>;
  getOrCreateAgent: (userId?: string) => Promise<string>;
  openChat: () => void;
  closeChat: () => void;
  sendMessage: (message: string) => Promise<void>;
  onBubbleClick: (callback: () => void | Promise<void>) => void;
}

export interface UIElements {
  closeBtn: HTMLElement;
  sendBtn: HTMLElement;
  inputElement: HTMLInputElement;
}

declare global {
  interface Window {
    ChatbotWidget: ChatbotWidgetAPI;
  }
}
