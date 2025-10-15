import { PrismaClient } from '../generated/prisma';

// PrismaClient is attached to the `global` object in development to prevent
// exhausting the database connection limit by creating multiple instances
declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV === 'development') {
  global.prisma = prisma;
}

// Ensure Prisma connects on first use
prisma.$connect().catch((error) => {
  console.error('Failed to connect to database:', error);
});