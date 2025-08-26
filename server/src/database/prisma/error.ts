import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export class AppError extends Error {
  constructor(public status: number, public code: string, message: string, public meta?: any) { super(message); }
  toJSON() { return { code: this.code, message: this.message }; }
}
export class DomainError extends AppError { constructor(code: string, message: string, meta?: any){ super(422, code, message, meta);} }
export class AuthError extends AppError { constructor(code: string, message: string){ super(401, code, message);} }
export class ForbiddenError extends AppError { constructor(code: string, message: string){ super(403, code, message);} }

export const mapPrismaError = (e: unknown): never => {
  if (e instanceof PrismaClientKnownRequestError) {
    switch (e.code) {
      case 'P2002': throw new DomainError('UNIQUE_VIOLATION', 'Unique constraint violation', e.meta);
      case 'P2025': throw new DomainError('NOT_FOUND', 'Record not found', e.meta);
      default: throw new AppError(500, 'PRISMA_ERROR', `Prisma error ${e.code}`, e.meta);
    }
  }
  if (e instanceof AppError) throw e;
  if (e instanceof Error) throw new AppError(500, 'INTERNAL_ERROR', e.message);
  throw new AppError(500, 'UNKNOWN', 'Unknown error');
};
