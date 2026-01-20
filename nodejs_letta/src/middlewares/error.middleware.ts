import { Request, Response, NextFunction } from 'express';
import { renderError } from '@/utils/response.helper.js';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction): void => {
  const statusCode = err.statusCode;
  renderError(res, err, statusCode);
};
