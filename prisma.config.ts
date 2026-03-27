import path from "path";
import { defineConfig } from "prisma/config";

export default defineConfig({
  // Keep the schema path so Prisma knows where your models are
  schema: path.join("prisma", "schema.prisma"),
  
  // Remove the datasource.url here or set it to an empty string
  // because we are injecting the connection via the Neon Adapter in lib/db.ts
  datasource: {
    url: process.env.DATABASE_URL!, 
  },
});
