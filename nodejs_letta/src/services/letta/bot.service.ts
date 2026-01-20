import { agentLettaService, sourceLettaService } from './index.js';
import { BotTemplate as BotTemplateModel, AgentMapping, KnowledgeBase } from '../../models/index.js';
import { BotCreateInput, BotTemplate } from '../../types/index.js';
import { Op } from '@sequelize/core';
import { Status } from '@/constants/status.constants.js';

class BotService {
  async createBot(input: BotCreateInput): Promise<BotTemplate> {
    const bot = await BotTemplateModel.create({
      id: input.id,
      name: input.name,
      greeting: input.greeting,
      system: input.system,
      llm_config: input.llm_config || {},
      tool_rules: input.tool_rules || [],
      theme_config: input.theme_config || {},
      organization_id: input.organization_id,
    });

    return bot.toJSON() as BotTemplate;
  }

  async getBot(id: string): Promise<BotTemplate | null> {
    const bot = await BotTemplateModel.findByPk(id);
    return bot ? (bot.toJSON() as BotTemplate) : null;
  }

  async listBots(organizationId?: string): Promise<BotTemplate[]> {
    const bots = await BotTemplateModel.findAll({
      where: organizationId ? { organization_id: organizationId } : {},
      order: [['created_at', 'DESC']],
    });

    return bots.map(bot => bot.toJSON() as BotTemplate);
  }

  async updateBot(id: string, updates: Partial<BotTemplate>): Promise<void> {
    const updateData: any = {};

    if (updates.name) updateData.name = updates.name;
    if (updates.greeting !== undefined) updateData.greeting = updates.greeting;
    if (updates.system !== undefined) updateData.system = updates.system;
    if (updates.llm_config !== undefined) updateData.llm_config = updates.llm_config;
    if (updates.tool_rules !== undefined) updateData.tool_rules = updates.tool_rules;
    if (updates.theme_config !== undefined) updateData.theme_config = updates.theme_config;
    if (updates.status) updateData.status = updates.status;
    if (updates.knowledge_base_ids !== undefined) updateData.knowledge_base_ids = updates.knowledge_base_ids;

    if (Object.keys(updateData).length === 0) return;

    await BotTemplateModel.update(updateData, {
      where: { id },
    });
  }

  async deleteBot(id: string): Promise<void> {
    await AgentMapping.destroy({
      where: { chatbot_id: id },
    });

    await BotTemplateModel.destroy({
      where: { id },
    });
  }

  async getOrCreateAgent(chatbotId: string, userId?: string): Promise<string> {
    const normalizedUserId = userId || null;
    const whereClause = {
      chatbot_id: chatbotId,
      user_id: normalizedUserId
    };

    const existingMapping = await AgentMapping.findOne({ where: whereClause });
    if (existingMapping) {
      await existingMapping.update({ last_used_at: new Date() });
      return existingMapping.agent_id;
    }

    const bot = await this.getBot(chatbotId);
    if (!bot) throw new Error(`Bot template not found: ${chatbotId}`);

    const llmConfig = typeof bot.llm_config === 'string' ? JSON.parse(bot.llm_config) : bot.llm_config || {};
    const toolRules = typeof bot.tool_rules === 'string' ? JSON.parse(bot.tool_rules) : bot.tool_rules || [];

      const agent = await agentLettaService.createAgent({
      name: `${bot.name} - ${normalizedUserId || 'anonymous'}`,
      system: bot.system,
      model: llmConfig.model || 'GLM-4.7',
      embedding: llmConfig.embedding,
      tools: llmConfig.tools || [],
      tool_rules: toolRules,
      include_base_tool_rules: false,
      memory_blocks: llmConfig.memory_blocks || [],
    });

    console.log("=====>>>>>>>>>> Bot knowledge_base_ids:", bot.knowledge_base_ids);
    if (bot.knowledge_base_ids && bot.knowledge_base_ids.length > 0) {
      console.log("=====>>>>>>>>>> Attaching knowledge bases to agent:", bot.knowledge_base_ids);
      const knowledgeBases = await KnowledgeBase.findAll({
        where: {
          id: { [Op.in]: bot.knowledge_base_ids },
          letta_source_id: { [Op.ne]: null },
          status: Status.SUCCESS,
        },
      });

      for (const kb of knowledgeBases) {
        try {
          await sourceLettaService.attachSourceToAgent(agent.id, kb.letta_source_id!);
        } catch (error) {
          console.error(`Failed to attach source ${kb.letta_source_id}:`, error);
        }
      }
    }

    const newMapping = await AgentMapping.create({
      chatbot_id: chatbotId,
      user_id: normalizedUserId,
      agent_id: agent.id,
    });

    return newMapping.agent_id;
  }
}

export default new BotService();
