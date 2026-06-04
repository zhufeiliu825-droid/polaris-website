import path from "node:path";
import fs from "node:fs";
import { defineConfig } from "prisma/config";

// Manually load .env.local — Prisma 7 doesn't read it by default.
const envFile = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envFile)) {
  for (const line of fs.readFileSync(envFile, "utf8").split("\n")) {
    const m = line.match(/^([A-Z0-9_]+)=(?:"(.*)"|(.*))$/);
    if (m && !process.env[m[1]]) {
      process.env[m[1]] = (m[2] ?? m[3] ?? "").trim();
    }
  }
}

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  migrations: {
    path: path.join("prisma", "migrations"),
  },
  datasource: {
    url: process.env.DATABASE_URL,
    directUrl: process.env.DIRECT_URL,
  },
});
