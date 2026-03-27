// lib/db.ts
process.env.TZ = "UTC"; 

import { PrismaNeonHttp } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";
import { neon } from "@neondatabase/serverless";

const globalForPrisma = global as unknown as { prisma?: PrismaClient };

function createPrisma(): PrismaClient {
  // 1. Get the string and trim any accidental whitespace/quotes
  const rawUrl = process.env.DATABASE_URL;
  
  if (!rawUrl) {
    throw new Error("DATABASE_URL is missing! Add it to your environment variables.");
  }

  // Clean the URL string (removes whitespace and surrounding quotes if they leaked in)
  const url = rawUrl.trim().replace(/^["']|["']$/g, "");

  // 2. Initialize the Neon connection
  const sql = neon(url); 
  
  // @ts-ignore
  const adapter = new PrismaNeonHttp(sql);
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrisma();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
