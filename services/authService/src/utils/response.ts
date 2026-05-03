import { Response } from 'express';
import { ApiResponse } from '../types';

export function sendSuccess<T>(
  res: Response,
  message: string,
  data?: T,
  statusCode = 200
): Response {
  const body: ApiResponse<T> = { success: true, message, data };
  return res.status(statusCode).json(body);
}

export function sendError(
  res: Response,
  message: string,
  statusCode = 400,
  errors?: Record<string, string>[]
): Response {
  const body: ApiResponse = { success: false, message, errors };
  return res.status(statusCode).json(body);
}
