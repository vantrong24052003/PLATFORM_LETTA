import { Response } from 'express';
import { ApiResponse } from '@/types/index.js';

export const renderSuccess = <T>(res: Response, data: T, message: string, statusCode: number = 200): void => {
  const response: ApiResponse<T> = { message, data };
  res.status(statusCode).json(response);
};

export const renderError = (res: Response, error: any, statusCode: number = 500): void => {
  const status = error.statusCode || error.status || statusCode;
  const response: ApiResponse = {
    error: error.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
  };
  res.status(status).json(response);
};
