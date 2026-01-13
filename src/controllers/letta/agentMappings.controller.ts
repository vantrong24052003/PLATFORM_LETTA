import { Request, Response, NextFunction } from 'express';
import botService from '@/services/letta/bot.service.js';
import { renderSuccess, renderError } from '@/utils/response.helper.js';
import { HttpStatus } from '@/constants/http.constants.js';
import { AgentMappingMessage } from '@/locales/index.js';

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

