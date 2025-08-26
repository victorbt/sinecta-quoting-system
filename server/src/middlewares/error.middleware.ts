import { Request, Response, NextFunction } from 'express';
import { AppError } from '../database/prisma/error';
import { ApiError } from '../errors/api.error'
import { ValidateError } from '@tsoa/runtime';
import { logger } from '../transport/logger';

export function errorMiddleware(err: any, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ValidateError) {
    return res.status(422).json({ code: 'VALIDATION_ERROR', message: 'Validation Failed', details: err.fields });
  }
  if (err instanceof AppError) {
    if (err.status >= 500) logger.error({ err }, 'AppError');
    return res.status(err.status).json(err.toJSON());
  }
  if (err instanceof ApiError) {
    if (err.statusCode >= 500) logger.error({ err }, 'AppError');
    return res.status(err.statusCode).json({ code: err.statusCode == 401 ? 'AUTH_ERROR' : 'APP_ERROR', message: err.message });
  }
  logger.error({ err }, 'UnhandledError');
  return res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Internal Server Error' });
}
