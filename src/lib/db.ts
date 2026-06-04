/**
 * Singleton Prisma client.
 *
 * Prisma 7 requires a driver adapter — we use `@prisma/adapter-pg` so all
 * queries go through `node-postgres`. The connection string is read from
 * `DATABASE_URL` (the pooler URL in production, the direct URL locally).
 *
 * In dev we cache the client on `globalThis` so HMR doesn't open a new
 * connection pool on every reload.
 */

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set. Check .env.local");
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

const adapter = new PrismaPg({ connectionString });

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
