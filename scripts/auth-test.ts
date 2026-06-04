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
import { createSessionToken } from "../src/lib/auth";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

async function main() {
  const email = "staff@polarisconsulting.uk";
  const password = "changeme123";
  const user = await prisma.adminUser.findUnique({ where: { email } });
  if (!user) throw new Error("admin user not found");

  const ok = await bcrypt.compare(password, user.passwordHash);
  console.log("bcrypt.compare:", ok);

  const token = createSessionToken(user.id);
  console.log("session token:", token);
  await prisma.$disconnect();
}
main().catch((e) => { console.error(e); process.exit(1); });
