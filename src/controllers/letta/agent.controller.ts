import { Request, Response, NextFunction } from 'express';
import lettaService from '@/services/letta/letta.service.js';
import { renderSuccess, renderError } from '@/utils/response.helper.js';
import { AgentOptions } from '@/types/index.js';
import { HttpStatus } from '@/constants/http.constants.js';

export const createAgent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, system, model, embedding, tools, tool_rules, include_base_tool_rules, memory_blocks } = req.body as AgentOptions;
    const agent = await lettaService.createAgent({ name, system, model, embedding, tools, tool_rules, include_base_tool_rules, memory_blocks });
    renderSuccess(res, { agent }, 'Agent created successfully', HttpStatus.CREATED);
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
    const params = req.body;
    console.log(`[DEBUG] chatWithAgent called. agentId: ${agentId}, params: ${JSON.stringify(params)}`);

    if (!params.message && !params.messages && !params.approve) {
      throw { statusCode: HttpStatus.BAD_REQUEST, message: 'Message content or approval is required' };
    }

    let response;
    if (params.messages) {
      response = await lettaService.sendMessages(agentId, params.messages);
    } else {
      response = await lettaService.sendMessage(agentId, params);
    }

    renderSuccess(res, { response }, 'Message sent successfully');
  } catch (error) {
    renderError(res, error as Error);
  }
};
