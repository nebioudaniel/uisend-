// lib/db.ts
process.env.TZ = "UTC"; 

import { PrismaNeonHttp } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";
import { neon } from "@neondatabase/serverless";

const globalForPrisma = global as unknown as { prisma?: PrismaClient };

function createPrisma(): PrismaClient {
  // Use a unique name like 'dbUrl' to avoid shadowing the 'neon' import
  const dbUrl = process.env.DATABASE_URL;

  if (!dbUrl || typeof dbUrl !== 'string') {
    throw new Error("DATABASE_URL is missing or not a string. Check Vercel Environment Variables.");
  }

  // Pass the string, not the function
  const sql = neon(dbUrl.trim()); 
  // @ts-ignore
  const adapter = new PrismaNeonHttp(sql);
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrisma();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
