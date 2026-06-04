import fs from "node:fs";
import path from "node:path";

const envFile = path.join(process.cwd(), ".env.local");
for (const line of fs.readFileSync(envFile, "utf8").split("\n")) {
  const m = line.match(/^([A-Z0-9_]+)=(?:"(.*)"|(.*))$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = (m[2] ?? m[3] ?? "").trim();
}

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

async function main() {
  const [apps, events, articles, jobs, admins, contacts, syncs, evRegs] =
    await Promise.all([
      prisma.application.count(),
      prisma.event.count(),
      prisma.article.count(),
      prisma.job.count(),
      prisma.adminUser.count(),
      prisma.contactMessage.count(),
      prisma.jobSyncRun.count(),
      prisma.eventRegistration.count(),
    ]);
  console.log({
    applications: apps,
    events,
    articles,
    jobs,
    adminUsers: admins,
    contactMessages: contacts,
    jobSyncRuns: syncs,
    eventRegistrations: evRegs,
  });
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
