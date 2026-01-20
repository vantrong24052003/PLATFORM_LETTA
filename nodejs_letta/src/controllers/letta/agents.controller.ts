import { Request, Response, NextFunction } from 'express';
import { agentLettaService } from '@/services/letta/index.js';
import { renderSuccess, renderError } from '@/utils/response.helper.js';
import { AgentOptions } from '@/types/index.js';
import { HttpStatus } from '@/constants/http.constants.js';
import { AgentMessage } from '@/locales/index.js';

export const index = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const agents = await agentLettaService.listAgents();
    renderSuccess(res, { agents }, AgentMessage.LIST_RETRIEVED);
  } catch (error) {
    renderError(res, error);
  }
};

export const create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, system, model, embedding, tools, tool_rules, include_base_tool_rules, memory_blocks } = req.body as AgentOptions;
    if (!name) return renderError(res, { statusCode: HttpStatus.BAD_REQUEST, message: AgentMessage.MISSING_NAME } as any, HttpStatus.BAD_REQUEST);
    const agent = await agentLettaService.createAgent({ name, system, model, embedding, tools, tool_rules, include_base_tool_rules, memory_blocks });
    renderSuccess(res, { agent }, AgentMessage.CREATED, HttpStatus.CREATED);
  } catch (error) {
    renderError(res, error);
  }
};

export const show = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) return renderError(res, { statusCode: HttpStatus.BAD_REQUEST, message: AgentMessage.MISSING_AGENT_ID } as any, HttpStatus.BAD_REQUEST);
    const agent = await agentLettaService.getAgent(id);
    renderSuccess(res, { agent }, AgentMessage.RETRIEVED);
  } catch (error) {
    renderError(res, error);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    renderSuccess(res, {}, AgentMessage.UPDATE_NOT_IMPLEMENTED);
  } catch (error) {
    renderError(res, error);
  }
};

export const destroy = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    renderSuccess(res, {}, AgentMessage.DELETE_NOT_IMPLEMENTED);
  } catch (error) {
    renderError(res, error);
  }
};
