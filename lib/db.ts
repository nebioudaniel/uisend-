// lib/db.ts
process.env.TZ = "UTC"; 

import { PrismaNeonHttp } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";
import { neon } from "@neondatabase/serverless";

const globalForPrisma = global as unknown as { prisma?: PrismaClient };

function createPrisma(): PrismaClient {
  // Use a unique variable name to avoid naming collisions with 'neon'
  const connectionString = process.env.DATABASE_URL;

  // CRITICAL: Ensure it is a string and not the neon function itself
  if (!connectionString || typeof connectionString !== "string") {
    console.error("❌ DATABASE_URL is missing or invalid type:", typeof connectionString);
    throw new Error("DATABASE_URL is not configured correctly in Vercel.");
  }

  // Clean the string to remove any hidden characters or quotes
  const sanitizedUrl = connectionString.trim().replace(/^["']|["']$/g, "");

  try {
    const sql = neon(sanitizedUrl); 
    // @ts-ignore
    const adapter = new PrismaNeonHttp(sql);
    return new PrismaClient({ adapter });
  } catch (error) {
    console.error("❌ Failed to initialize Neon:", error);
    throw error;
  }
}

export const prisma = globalForPrisma.prisma ?? createPrisma();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
