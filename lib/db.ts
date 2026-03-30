// lib/db.ts
import { PrismaClient } from "@prisma/client";
import { PrismaNeonHttp } from "@prisma/adapter-neon";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) { // if we had connection erro mae it req dfor the sencd 
  
  throw new Error("DATABASE_URL is missing from environment variables.");
}

// PrismaNeonHttp requires 2 arguments: connectionString and options object
const adapter = new PrismaNeonHttp(connectionString, {});

const globalForPrisma = global as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
