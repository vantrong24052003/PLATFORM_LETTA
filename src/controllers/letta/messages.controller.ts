import { Request, Response, NextFunction } from 'express';
import { agentLettaService } from '@/services/letta/index.js';
import { renderSuccess, renderError } from '@/utils/response.helper.js';
import { HttpStatus } from '@/constants/http.constants.js';
import { AgentMessage, MessageMessage } from '@/locales/index.js';

export const index = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { agentId } = req.query;
    if (!agentId) return renderError(res, { statusCode: HttpStatus.BAD_REQUEST, message: AgentMessage.MISSING_AGENT_ID } as any, HttpStatus.BAD_REQUEST);
    const messages = await agentLettaService.listMessages(agentId as string);
    renderSuccess(res, { messages }, MessageMessage.LIST_RETRIEVED);
  } catch (error) {
    renderError(res, error);
  }
};

export const create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { agentId, message, messages } = req.body;
    if (!agentId) return renderError(res, { statusCode: HttpStatus.BAD_REQUEST, message: AgentMessage.MISSING_AGENT_ID } as any, HttpStatus.BAD_REQUEST);
    if (!message && !messages) {
      return renderError(res, { statusCode: HttpStatus.BAD_REQUEST, message: AgentMessage.MISSING_MESSAGE } as any, HttpStatus.BAD_REQUEST);
    }
    let response;
    if (messages) {
      response = await agentLettaService.sendMessages(agentId, messages);
    } else {
      response = await agentLettaService.sendMessage(agentId, { message });
    }
    renderSuccess(res, { response }, MessageMessage.CREATED, HttpStatus.CREATED);
  } catch (error) {
    renderError(res, error);
  }
};

export const show = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    renderSuccess(res, {}, MessageMessage.SHOW_NOT_IMPLEMENTED);
  } catch (error) {
    renderError(res, error);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    renderSuccess(res, {}, MessageMessage.UPDATE_NOT_IMPLEMENTED);
  } catch (error) {
    renderError(res, error);
  }
};

export const destroy = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    renderSuccess(res, {}, MessageMessage.DELETE_NOT_IMPLEMENTED);
  } catch (error) {
    renderError(res, error);
  }
};
