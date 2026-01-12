import { Request, Response, NextFunction } from 'express';
import lettaService from '@/services/letta/letta.service.js';
import { renderSuccess, renderError } from '@/utils/response.helper.js';

export const deleteBlock = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { blockId } = req.params;
    const result = await lettaService.deleteBlock(blockId);
    renderSuccess(res, result, 'Block deleted successfully');
  } catch (error) {
    renderError(res, error as Error);
  }
};
