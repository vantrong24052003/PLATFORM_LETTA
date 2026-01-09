import { Request, Response, NextFunction } from 'express';
import lettaService from '@/services/letta.service.js';
import { renderSuccess, renderError } from '@/utils/response.helper.js';
import { AgentOptions } from '@/types/index.js';

export const createAgent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, system, model, embedding, tools, tool_rules, include_base_tool_rules, memory_blocks } = req.body as AgentOptions;
    const agent = await lettaService.createAgent({ name, system, model, embedding, tools, tool_rules, include_base_tool_rules, memory_blocks });
    renderSuccess(res, { agent }, 'Agent created successfully', 201);
  } catch (error) {
    renderError(res, error as Error);
  }
};

export const getAgent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { agentId } = req.params;
    const agent = await lettaService.getAgent(agentId);
    renderSuccess(res, { agent }, 'Agent retrieved successfully');
  } catch (error) {
    renderError(res, error as Error);
  }
};

export const chatWithAgent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { agentId } = req.params;
    const { message, role } = req.body;
    console.log(`[DEBUG] chatWithAgent called. agentId: ${agentId}, message: ${message}, role: ${role}`);

    if (!message) {
      throw { statusCode: 400, message: 'Message content is required' };
    }

    const response = await lettaService.sendMessage(agentId, message, role);
    renderSuccess(res, { response }, 'Message sent successfully');
  } catch (error) {
    renderError(res, error as Error);
  }
};

export const deleteBlock = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { blockId } = req.params;
    const result = await lettaService.deleteBlock(blockId);
    renderSuccess(res, result, 'Block deleted successfully');
  } catch (error) {
    renderError(res, error as Error);
  }
};

export const createTool = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const tool = await lettaService.upsertTool(req.body);
    renderSuccess(res, { tool }, 'Tool registered successfully', 201);
  } catch (error) {
    renderError(res, error as Error);
  }
};

export const listTools = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const tools = await lettaService.listTools();
    renderSuccess(res, { tools }, 'Tools retrieved successfully');
  } catch (error) {
    renderError(res, error as Error);
  }
};
