// lib/db.ts
import { PrismaClient } from "@prisma/client";
import { PrismaNeonHttp } from "@prisma/adapter-neon";
import { neon } from "@neondatabase/serverless";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is missing");
}

const sql = neon(connectionString);
const adapter = new PrismaNeonHttp(sql);

// In Prisma 7, the constructor expects the adapter here
export const prisma = new PrismaClient({ adapter });
