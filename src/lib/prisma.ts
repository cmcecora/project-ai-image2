import { PrismaClient } from '../generated/prisma';

// PrismaClient is attached to the `global` object in development to prevent
// exhausting the database connection limit by creating multiple instances
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV === 'development') {
  global.prisma = prisma;
}