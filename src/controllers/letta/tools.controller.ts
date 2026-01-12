import { Request, Response, NextFunction } from 'express';
import { toolLettaService } from '@/services/letta/index.js';
import { renderSuccess, renderError } from '@/utils/response.helper.js';
import { HttpStatus } from '@/constants/http.constants.js';
import { ToolMessage } from '@/locales/index.js';

export const index = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await toolLettaService.listTools();
    let tools = result;
    if (!Array.isArray(result)) {
      tools = result?.data || result?.items || result?.tools || [];
    }
    renderSuccess(res, { tools }, ToolMessage.RETRIEVED);
  } catch (error) {
    renderError(res, error);
  }
};

export const create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, description, sourceCode } = req.body;
    if (!name || !description || !sourceCode) {
      return renderError(res, { statusCode: HttpStatus.BAD_REQUEST, message: ToolMessage.MISSING_REQUIRED_FIELDS } as any, HttpStatus.BAD_REQUEST);
    }
    const tool = await toolLettaService.upsertTool(req.body);
    renderSuccess(res, { tool }, ToolMessage.CREATED, HttpStatus.CREATED);
  } catch (error) {
    renderError(res, error);
  }
};

export const show = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    renderSuccess(res, {}, ToolMessage.SHOW_NOT_IMPLEMENTED);
  } catch (error) {
    renderError(res, error);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    renderSuccess(res, {}, ToolMessage.UPDATE_NOT_IMPLEMENTED);
  } catch (error) {
    renderError(res, error);
  }
};

export const destroy = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    renderSuccess(res, {}, ToolMessage.DELETE_NOT_IMPLEMENTED);
  } catch (error) {
    renderError(res, error);
  }
};
