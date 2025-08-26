import pino from 'pino';
import pinoHttp from 'pino-http';
import { randomUUID } from 'crypto';

export const logger = pino({ level: process.env.LOG_LEVEL || 'info' });
export const httpLogger = pinoHttp({
  logger,
  genReqId: (req) => req.headers['x-request-id'] as string || randomUUID(),
  customProps: (req) => ({ userId: (req as any).user?.sub }),
});
