import { existsSync } from "node:fs";
import { config } from "dotenv";
import { defineConfig, env } from "prisma/config";

// Local: carrega .env.local (ou .env). Produção/CI: variáveis já vêm do ambiente.
if (existsSync(".env.local")) {
  config({ path: ".env.local" });
} else if (existsSync(".env")) {
  config({ path: ".env" });
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DIRECT_URL"),
  },
});
