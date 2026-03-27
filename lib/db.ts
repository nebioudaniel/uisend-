process.env.TZ = "UTC"; // MUST BE FIRST to fix Neon/Prisma local timezone drift

import { PrismaNeonHttp } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";
import { neon } from "@neondatabase/serverless";

// Use PrismaNeonHttp - simpler, no WebSocket/Pool complexity
const DB_URL = "postgresql://neondb_owner:npg_bshMw63irGkf@ep-bold-butterfly-amk57fna-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

function createPrisma() {
  const connectionString = process.env.DATABASE_URL || DB_URL;
  const sql = neon(connectionString);
  // @ts-ignore
  const adapter = new PrismaNeonHttp(sql);
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrisma();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

