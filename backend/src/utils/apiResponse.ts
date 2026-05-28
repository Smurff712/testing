import { Response } from 'express';
import { ApiResponse, PaginationMeta } from '../types';

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message?: string,
  statusCode = 200
): void => {
  const response: ApiResponse<T> = {
    success: true,
    data,
    ...(message && { message }),
  };
  res.status(statusCode).json(response);
};

export const sendSuccessWithPagination = <T>(
  res: Response,
  data: T,
  meta: PaginationMeta,
  message?: string
): void => {
  const response: ApiResponse<T> = {
    success: true,
    data,
    meta,
    ...(message && { message }),
  };
  res.status(200).json(response);
};

export const sendError = (
  res: Response,
  message: string,
  statusCode = 500
): void => {
  const response: ApiResponse = {
    success: false,
    error: message,
  };
  res.status(statusCode).json(response);
};
