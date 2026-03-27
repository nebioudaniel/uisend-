import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // This is where the URL lives now for the CLI (migrations/introspection)
    url: env("DATABASE_URL"),
  },
});
