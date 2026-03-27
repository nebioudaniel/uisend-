// lib/db.ts
process.env.TZ = "UTC"; // MUST BE FIRST to fix Neon/Prisma local timezone drift

import { PrismaNeonHttp } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";
import { neon } from "@neondatabase/serverless";

// Ensure DATABASE_URL is set
const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is not set! Please add it in Vercel Environment Variables.");

// Global object for Prisma to avoid multiple instances in development
const globalForPrisma = global as unknown as { prisma?: PrismaClient };

// Function to create Prisma client
function createPrisma(): PrismaClient {
  const sql = neon(connectionString); // Type-safe: string guaranteed
  // @ts-ignore: PrismaNeonHttp adapter typing
  const adapter = new PrismaNeonHttp(sql);
  return new PrismaClient({ adapter });
}

// Reuse the client in development to avoid "PrismaClient already exists" errors
export const prisma = globalForPrisma.prisma ?? createPrisma();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
