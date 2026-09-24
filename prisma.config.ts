import 'dotenv/config';
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    // Las migraciones necesitan una sesión estable. La aplicación usa
    // DATABASE_URL (transaction pooler) desde schema.prisma en runtime.
    url: env("DIRECT_URL"),
  },
});
