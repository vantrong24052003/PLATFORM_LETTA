import Letta from '@letta-ai/letta-client';
import { config } from '@/config/letta.config.js';
import { AgentOptions } from '@/types/index.js';
import { randomUUID } from 'crypto';

export enum MessageRole {
  User = 'user',
  System = 'system',
}

class LettaService {
  private client: Letta;

  constructor() {
    this.client = new Letta({ apiKey: config.letta.apiKey, timeout: 600000 });
  }

  async createAgent(options: AgentOptions): Promise<any> {
    const { name, system, model, embedding, tools, tool_rules, include_base_tool_rules, memory_blocks } = options;

    const final_tool_rules = tool_rules || [];

    // Force HITL for query_local_db to ensure Project 2 can intercept it
    if (tools && tools.includes('query_local_db')) {
      const hasRule = final_tool_rules.some(r => r.tool_name === 'query_local_db' && r.type === 'requires_approval');
      if (!hasRule) {
        final_tool_rules.push({
          type: 'requires_approval',
          tool_name: 'query_local_db'
        });
      }
    }

    const agentState = await this.client.agents.create({
      name: `${name} ${randomUUID()}`,
      system: system,
      model: model || 'anthropic/claude-sonnet-4-5-20250929',
      embedding: embedding || 'openai/text-embedding-3-small',
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

  async sendMessage(agentId: string, params: any): Promise<any> {
    try {
      // Construct message payload dynamically
      const payload: any = {};

      if (params.role) payload.role = params.role;
      if (params.message) payload.content = params.message;
      if (params.type) payload.type = params.type;
      if (params.approve !== undefined) payload.approve = params.approve;
      if (params.approval_request_id) payload.approval_request_id = params.approval_request_id;

      // Default to user role if only message is provided and no role
      if (payload.content && !payload.role) {
        payload.role = 'user';
      }

      console.log(`[DEBUG] Calling Letta SDK create with payload: ${JSON.stringify({ messages: [payload] })}`);
      const response = await this.client.agents.messages.create(agentId, { messages: [payload] });
      return response;
    } catch (error) {
      console.error('[DEBUG] helper sendMessage error:', error);
      throw error;
    }
  }

  async sendMessages(agentId: string, messages: any[]): Promise<any> {
    try {
      const response = await this.client.agents.messages.create(agentId, { messages });
      return response;
    } catch (error) {
      console.error('[DEBUG] helper sendMessages error:', error);
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

    console.log('[DEBUG] upsertTool payload:', JSON.stringify(toolData, null, 2));
    return await this.client.tools.upsert(toolData);
  }

  async listTools(): Promise<any> {
    return await this.client.tools.list();
  }
}

export default new LettaService();
