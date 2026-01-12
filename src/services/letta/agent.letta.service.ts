import { AgentOptions } from '@/types/index.js';
import { randomUUID } from 'crypto';
import { config } from '@/config/letta.config.js';
import { BaseLettaService } from './base.letta.service.js';

enum MESSAGE_ROLE { User = 'user', System = 'system' }
enum TOOL_TYPE { RequiresApproval = 'requires_approval' }

class AgentLettaService extends BaseLettaService {
  async createAgent(options: AgentOptions): Promise<any> {
    try {
      const { name, system, model, embedding, tools, tool_rules = [], include_base_tool_rules, memory_blocks } = options;

    if (tools && tools.length > 0) {
      tools.forEach(toolName => {
        const hasRule = tool_rules.some(r => r.tool_name === toolName && r.type === TOOL_TYPE.RequiresApproval);
        if (!hasRule) {
          tool_rules.push({
            type: TOOL_TYPE.RequiresApproval,
            tool_name: toolName
          });
        }
      });
    }

    const agentState = await this.client.agents.create({
      name: `${name} ${randomUUID()}`,
      system: system,
      llm_config: {
        model: 'GLM-4.7',
        model_endpoint_type: 'openai',
        model_endpoint: config.letta.openaiApiBase,
        context_window: 128000
      },
      embedding_config: {
        embedding_model: 'text-embedding-3-small',
        embedding_endpoint_type: 'openai',
        embedding_endpoint: config.letta.openaiApiBase,
        embedding_dim: 1536
      },
      memory_blocks: memory_blocks,
      tools: tools,
      tool_rules: tool_rules.length > 0 ? tool_rules : undefined,
      include_base_tool_rules: include_base_tool_rules ?? true
    });

    return agentState;
    } catch (error) {
      console.error('[AgentLettaService] Failed to create agent:', error);
      throw new Error(`Failed to create agent: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async getAgent(agentId: string): Promise<any> {
    return await this.client.agents.retrieve(agentId);
  }

  async listAgents(): Promise<any> {
    return await this.client.agents.list();
  }

  async sendMessage(agentId: string, params: any): Promise<any> {
    const payload: any = {};

    if (params.role) payload.role = params.role;
    if (params.message) payload.content = params.message;
    if (params.type) payload.type = params.type;
    if (params.approve !== undefined) payload.approve = params.approve;
    if (params.approval_request_id) payload.approval_request_id = params.approval_request_id;

    if (payload.content && !payload.role) {
      payload.role = MESSAGE_ROLE.User;
    }

    const response = await this.client.agents.messages.create(agentId, { messages: [payload] });
    return response;
  }

  async sendMessages(agentId: string, messages: any[]): Promise<any> {
    const response = await this.client.agents.messages.create(agentId, { messages });
    return response;
  }

  async listMessages(agentId: string): Promise<any> {
    return await this.client.agents.messages.list(agentId);
  }
}

export default new AgentLettaService();
