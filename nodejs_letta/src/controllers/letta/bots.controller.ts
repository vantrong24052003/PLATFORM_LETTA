import { Request, Response, NextFunction } from 'express';
import botService from '@/services/letta/bot.service.js';
import { renderSuccess, renderError } from '@/utils/response.helper.js';
import { HttpStatus } from '@/constants/http.constants.js';
import { BotMessage } from '@/locales/index.js';

export const index = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { organizationId } = req.query;
    const bots = await botService.listBots(organizationId as string);
    renderSuccess(res, { bots }, BotMessage.LIST_RETRIEVED);
  } catch (error) {
    renderError(res, error);
  }
};

export const create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id, name, greeting, system, organization_id } = req.body;
    if (!id || !name || !greeting || !system || !organization_id) {
      return renderError(res, { statusCode: HttpStatus.BAD_REQUEST, message: BotMessage.MISSING_REQUIRED_FIELDS } as any, HttpStatus.BAD_REQUEST);
    }
    const bot = await botService.createBot(req.body);
    renderSuccess(res, { bot }, BotMessage.CREATED, HttpStatus.CREATED);
  } catch (error) {
    renderError(res, error);
  }
};

export const show = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) return renderError(res, { statusCode: HttpStatus.BAD_REQUEST, message: BotMessage.MISSING_ID } as any, HttpStatus.BAD_REQUEST);
    const bot = await botService.getBot(id);
    if (!bot) return renderError(res, { statusCode: HttpStatus.NOT_FOUND, message: BotMessage.NOT_FOUND } as any, HttpStatus.NOT_FOUND);
    renderSuccess(res, { bot }, BotMessage.RETRIEVED);
  } catch (error) {
    renderError(res, error);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) return renderError(res, { statusCode: HttpStatus.BAD_REQUEST, message: BotMessage.MISSING_ID } as any, HttpStatus.BAD_REQUEST);
    await botService.updateBot(id, req.body);
    renderSuccess(res, {}, BotMessage.UPDATED);
  } catch (error) {
    renderError(res, error);
  }
};

export const destroy = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) return renderError(res, { statusCode: HttpStatus.BAD_REQUEST, message: BotMessage.MISSING_ID } as any, HttpStatus.BAD_REQUEST);
    await botService.deleteBot(id);
    renderSuccess(res, {}, BotMessage.DELETED);
  } catch (error) {
    renderError(res, error);
  }
};
