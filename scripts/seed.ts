/**
 * Seed the database with:
 *  - One admin user (so the staff portal is usable from day one)
 *  - The mock applications / events / articles, so admin lists aren't empty
 *
 * Idempotent — re-running won't duplicate rows.
 *
 * Default admin: staff@polarisconsulting.uk / changeme123
 * Override via ADMIN_EMAIL / ADMIN_PASSWORD env vars.
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
import {
  mockApplications,
  mockAdminEvents,
  mockAdminArticles,
} from "../src/lib/data/admin-mock";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

async function main() {
  console.log("Seeding Polaris database…\n");

  // ─── Admin user ───────────────────────────────────────────────
  // The `email` column doubles as the login username.
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

  // ─── Applications ─────────────────────────────────────────────
  for (const a of mockApplications) {
    await prisma.application.upsert({
      where: { id: a.id },
      update: {},
      create: {
        id: a.id,
        firstName: a.firstName,
        lastName: a.lastName,
        email: a.email,
        phone: a.phone,
        nationality: a.nationality,
        city: a.city,
        degreeLevel: "Undergraduate",
        university: a.university,
        course: a.course,
        graduationYear: parseInt(a.graduationYear, 10) || null,
        targetSectors: a.targetSectors,
        programme: a.programme,
        notes: a.notes,
        source: a.source,
        privacyAccepted: true,
        marketingOptIn: false,
        status: a.status,
        assignedTo: a.assignedTo,
        createdAt: new Date(a.createdAt),
      },
    });
  }
  console.log(`  ✓ ${mockApplications.length} applications`);

  // ─── Events ───────────────────────────────────────────────────
  for (const e of mockAdminEvents) {
    await prisma.event.upsert({
      where: { id: e.id },
      update: {},
      create: {
        id: e.id,
        slug: e.slug,
        title: e.title,
        excerpt: e.excerpt,
        body: e.body,
        startsAt: new Date(e.startsAt),
        endsAt: new Date(e.endsAt),
        format: e.format === "HYBRID" ? "IN_PERSON" : e.format,
        location: e.location,
        sector: e.sector,
        registrationUrl: e.registrationUrl || null,
        published: e.published,
        publishedAt: e.published ? new Date(e.createdAt) : null,
        createdAt: new Date(e.createdAt),
      },
    });
  }
  console.log(`  ✓ ${mockAdminEvents.length} events`);

  // ─── Articles ─────────────────────────────────────────────────
  for (const a of mockAdminArticles) {
    await prisma.article.upsert({
      where: { id: a.id },
      update: {},
      create: {
        id: a.id,
        slug: a.slug,
        title: a.title,
        excerpt: a.excerpt,
        body: a.body,
        category: a.category,
        tags: a.tags,
        readMinutes: a.readMinutes,
        authorName: a.authorName,
        published: a.published,
        publishedAt: a.publishedAt ? new Date(a.publishedAt) : null,
        createdAt: new Date(a.createdAt),
      },
    });
  }
  console.log(`  ✓ ${mockAdminArticles.length} articles`);

  console.log("\nDone.");
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
