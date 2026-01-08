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
    this.client = new Letta({ apiKey: config.letta.apiKey });
  }

  async createAgent(options: AgentOptions): Promise<any> {
    const { name, system, model, embedding, tools, memory_blocks } = options;

    const agentState = await this.client.agents.create({
      name: `${name} ${randomUUID()}`,
      system: system,
      model: model || 'anthropic/claude-sonnet-4-5-20250929',
      embedding: embedding || 'openai/text-embedding-3-small',
      memory_blocks: memory_blocks,
      tools: tools,
    });

    return agentState;
  }

  async getAgent(agentId: string): Promise<any> {
    return await this.client.agents.retrieve(agentId);
  }

  async sendMessage(agentId: string, message: string, role: MessageRole = MessageRole.User): Promise<any> {
    console.log(`[DEBUG] Service sendMessage. agentId: ${agentId}, role: ${role}`);
    try {
      const response = await this.client.agents.messages.create(agentId, {
        messages: [
          {
            role,
            content: message,
          },
        ],
      });
      return response;
    } catch (error) {
      console.error('[DEBUG] helper sendMessage error:', error);
      throw error;
    }
  }

  async deleteBlock(blockId: string): Promise<any> {
    await this.client.blocks.delete(blockId);
    return { success: true, message: 'Block deleted' };
  }
}

export default new LettaService();
