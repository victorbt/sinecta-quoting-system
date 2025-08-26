import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

export const corsMiddleware = () => {
  const origins = (process.env.ALLOWED_ORIGINS || '*').split(',').filter(Boolean);
  return cors({
    origin: (origin: any, cb: any) => {
      if (!origin || origins.includes(origin)) return cb(null, true);
      cb(new Error('Not allowed by CORS'));
    },
    credentials: true
  });
};

export const helmetMiddleware = () => helmet({ crossOriginResourcePolicy: { policy: 'same-site' } });

export const rateLimitMiddleware = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 60000),
  max: Number(process.env.RATE_LIMIT_MAX || 100),
  standardHeaders: true,
  legacyHeaders: false,
});
