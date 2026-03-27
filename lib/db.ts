process.env.TZ = "UTC"; // MUST BE FIRST

import { PrismaNeonHttp } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";
import { neon } from "@neondatabase/serverless";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is not set!");

const globalForPrisma = global as unknown as { prisma: PrismaClient };

function createPrisma() {
  const sql = neon(connectionString);
  // @ts-ignore
  const adapter = new PrismaNeonHttp(sql);
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrisma();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
