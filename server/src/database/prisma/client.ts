import { PrismaClient } from '../../generated/prisma/edge';
export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query','warn','error'] : ['error'],
});
