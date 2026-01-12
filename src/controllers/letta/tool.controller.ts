import { Request, Response, NextFunction } from 'express';
import lettaService from '@/services/letta/letta.service.js';
import { renderSuccess, renderError } from '@/utils/response.helper.js';
import { HttpStatus } from '@/constants/http.constants.js';

export const createTool = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const tool = await lettaService.upsertTool(req.body);
    renderSuccess(res, { tool }, 'Tool registered successfully', HttpStatus.CREATED);
  } catch (error) {
    renderError(res, error as Error);
  }
};
