import { Response } from 'express';
import { ApiResponse } from '@/types/index.js';
import { HttpStatus } from '@/constants/http.constants.js';

export const renderSuccess = <T>(res: Response, data: T, message: string, statusCode: number = HttpStatus.OK): void => {
  const response: ApiResponse<T> = { message, data };
  res.status(statusCode).json(response);
};

export const renderError = (res: Response, error: any, statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR): void => {
  const status = error.statusCode || error.status || statusCode;
  const errorMessage = error.message || error.error || String(error);
  const response: ApiResponse = {
    error: errorMessage,
    stack: error.stack ?? undefined,
  };
  res.status(status).json(response);
};
