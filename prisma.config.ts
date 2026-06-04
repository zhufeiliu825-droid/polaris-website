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
  // Migrations need the direct (non-pooled) connection. Prisma 7 reads
  // DIRECT_URL automatically when present — we don't need to forward it
  // here, and the `datasource.directUrl` field isn't part of the public
  // type. Runtime uses the pooled DATABASE_URL via PrismaPg adapter.
  datasource: {
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL,
  },
});
