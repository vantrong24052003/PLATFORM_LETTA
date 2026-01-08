import { Response } from 'express';
import { ApiResponse } from '@/types/index.js';

export const renderSuccess = <T>(res: Response, data: T, message: string, statusCode: number = 200): void => {
  const response: ApiResponse<T> = { message, data };
  res.status(statusCode).json(response);
};

export const renderError = (res: Response, error: Error, statusCode: number = 500): void => {
  const response: ApiResponse = {
    error: error.message,
    stack: error.stack,
  };
  res.status(statusCode).json(response);
};
