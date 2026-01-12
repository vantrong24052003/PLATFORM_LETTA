import { Request, Response, NextFunction } from 'express';
import botService from '@/services/letta/bot.service.js';
import { renderSuccess, renderError } from '@/utils/response.helper.js';
import { HttpStatus } from '@/constants/http.constants.js';
import { AgentMappingMessage } from '@/locales/index.js';

export const index = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    renderSuccess(res, {}, AgentMappingMessage.LIST_NOT_IMPLEMENTED);
  } catch (error) {
    renderError(res, error);
  }
};

export const create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { chatbot_id, user_id } = req.body;
    if (!chatbot_id) return renderError(res, { statusCode: HttpStatus.BAD_REQUEST, message: AgentMappingMessage.MISSING_CHATBOT_ID } as any, HttpStatus.BAD_REQUEST);
    const agentId = await botService.getOrCreateAgent(chatbot_id, user_id);
    renderSuccess(res, { agentId }, AgentMappingMessage.CREATED, HttpStatus.CREATED);
  } catch (error) {
    renderError(res, error);
  }
};

export const show = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { userId } = req.query;
    if (!id) return renderError(res, { statusCode: HttpStatus.BAD_REQUEST, message: AgentMappingMessage.MISSING_CHATBOT_ID } as any, HttpStatus.BAD_REQUEST);
    const agentId = await botService.getAgentByUser(id, userId as string);
    if (!agentId) return renderError(res, { statusCode: HttpStatus.NOT_FOUND, message: AgentMappingMessage.NOT_FOUND } as any, HttpStatus.NOT_FOUND);
    renderSuccess(res, { agentId }, AgentMappingMessage.RETRIEVED);
  } catch (error) {
    renderError(res, error);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    renderSuccess(res, {}, AgentMappingMessage.UPDATE_NOT_IMPLEMENTED);
  } catch (error) {
    renderError(res, error);
  }
};

export const destroy = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    renderSuccess(res, {}, AgentMappingMessage.DELETE_NOT_IMPLEMENTED);
  } catch (error) {
    renderError(res, error);
  }
};
