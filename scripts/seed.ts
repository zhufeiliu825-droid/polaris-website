/**
 * Bootstrap the database with the initial admin user, so the staff portal is
 * usable from day one. Idempotent — re-running won't duplicate the row.
 *
 * Default admin: polarisadmin / 12345678  (override via ADMIN_EMAIL / ADMIN_PASSWORD).
 * The `email` column doubles as the login username.
 *
 * Editorial content (articles + events) is seeded separately and is NOT
 * touched here — see `scripts/seed-content.ts` (npm run seed:content). This
 * script deliberately does NOT insert any sample applications/events/articles,
 * so it's safe to run against the live database without polluting real data.
 *
 * Run with:  npm run seed
 */

import fs from "node:fs";
import path from "node:path";

const envFile = path.join(process.cwd(), ".env.local");
for (const line of fs.readFileSync(envFile, "utf8").split("\n")) {
  const m = line.match(/^([A-Z0-9_]+)=(?:"(.*)"|(.*))$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = (m[2] ?? m[3] ?? "").trim();
}

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

async function main() {
  console.log("Seeding Polaris admin user…\n");

  const adminEmail = process.env.ADMIN_EMAIL ?? "polarisadmin";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "12345678";
  const hash = await bcrypt.hash(adminPassword, 10);
  const admin = await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: "Polaris Admin",
      passwordHash: hash,
      role: "OWNER",
      active: true,
    },
  });
  console.log(`  ✓ admin user: ${admin.email}  (password: ${adminPassword})`);

  console.log("\nDone.");
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
