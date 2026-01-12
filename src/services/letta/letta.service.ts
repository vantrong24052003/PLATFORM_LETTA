import Letta from '@letta-ai/letta-client';
import { config } from '@/config/letta.config.js';
import { AgentOptions } from '@/types/index.js';
import { randomUUID } from 'crypto';

enum MESSSAGE_ROLE { User = 'user', System = 'system' }
enum TOOL_TYPE { RequiresApproval = 'requires_approval' }

class LettaService {
  private client: Letta;

  constructor() {
    this.client = new Letta({
      apiKey: config.letta.apiKey,
      baseURL: config.letta.baseUrl,
      timeout: 600000
    });
  }

  async createAgent(options: AgentOptions): Promise<any> {
    const { name, system, model, embedding, tools, tool_rules, include_base_tool_rules, memory_blocks } = options;

    const final_tool_rules = tool_rules || [];

    if (tools && tools.length > 0) {
      tools.forEach(toolName => {
        const hasRule = final_tool_rules.some(r => r.tool_name === toolName && r.type === TOOL_TYPE.RequiresApproval);
        if (!hasRule) {
          final_tool_rules.push({
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
      tool_rules: final_tool_rules.length > 0 ? final_tool_rules : undefined,
      include_base_tool_rules: include_base_tool_rules !== undefined ? include_base_tool_rules : true
    });

    return agentState;
  }

  async getAgent(agentId: string): Promise<any> {
    return await this.client.agents.retrieve(agentId);
  }

  async listAgents(): Promise<any> {
    return await this.client.agents.list();
  }

  async sendMessage(agentId: string, params: any): Promise<any> {
    try {
      const payload: any = {};

      if (params.role) payload.role = params.role;
      if (params.message) payload.content = params.message;
      if (params.type) payload.type = params.type;
      if (params.approve !== undefined) payload.approve = params.approve;
      if (params.approval_request_id) payload.approval_request_id = params.approval_request_id;

      if (payload.content && !payload.role) {
        payload.role = MESSSAGE_ROLE.User;
      }

      const response = await this.client.agents.messages.create(agentId, { messages: [payload] });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async sendMessages(agentId: string, messages: any[]): Promise<any> {
    try {
      const response = await this.client.agents.messages.create(agentId, { messages });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async listMessages(agentId: string): Promise<any> {
    return await this.client.agents.messages.list(agentId);
  }

  async deleteBlock(blockId: string): Promise<any> {
    await this.client.blocks.delete(blockId);
    return { success: true, message: 'Block deleted' };
  }

  async upsertTool(options: any): Promise<any> {
    const toolData: any = {
      source_code: options.sourceCode || options.source_code,
    };

    if (options.description) toolData.description = options.description;

    const schema = options.jsonSchema || options.args_json_schema;
    if (schema && Object.keys(schema).length > 0) {
      toolData.args_json_schema = schema;
    }

    if (options.defaultRequiresApproval !== undefined) {
      toolData.default_requires_approval = options.defaultRequiresApproval;
    } else if (options.default_requires_approval !== undefined) {
      toolData.default_requires_approval = options.default_requires_approval;
    }

    return await this.client.tools.upsert(toolData);
  }

  async listTools(): Promise<any> {
    return await this.client.tools.list();
  }
}

export default new LettaService();
