// lib/db.ts
process.env.TZ = "UTC"; 

import { PrismaNeonHttp } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";
import { neon } from "@neondatabase/serverless";

// Global object for Prisma to avoid multiple instances in development
const globalForPrisma = global as unknown as { prisma?: PrismaClient };

// Function to create Prisma client
function createPrisma(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;

  // Validation inside the function ensures TypeScript knows it's a string on the next line
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set! Please add it in your Environment Variables.");
  }

  const sql = neon(connectionString); 
  
  // @ts-ignore: PrismaNeonHttp adapter typing often lags behind Prisma versions
  const adapter = new PrismaNeonHttp(sql);
  return new PrismaClient({ adapter });
}

// Reuse the client in development to avoid "PrismaClient already exists" errors
export const prisma = globalForPrisma.prisma ?? createPrisma();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
