/**
 * Read accessors for editorial content (articles + events).
 *
 * NOTE: deliberately NOT wrapped in unstable_cache. These tables are tiny
 * (a few dozen rows, simple indexed queries), so the caching upside is
 * marginal — and unstable_cache JSON-serialises its return value, which turns
 * Prisma `Date` fields into strings on a cache hit and breaks every
 * `.toLocaleDateString()` / date comparison downstream. Keeping them as plain
 * Prisma reads returns real Date objects and stays correct. (The heavy
 * /opportunities path IS cached in lib/jobs.ts, where the data is already
 * mapped to ISO strings and so is serialization-safe.)
 */

import { prisma } from "@/lib/db";

// ── Articles ──────────────────────────────────────────────────────────────
export function getPublishedArticles() {
  return prisma.article.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
  });
}

export function getArticleBySlug(slug: string) {
  return prisma.article.findUnique({ where: { slug } });
}

// ── Events ────────────────────────────────────────────────────────────────
export function getPublishedEvents() {
  return prisma.event.findMany({
    where: { published: true },
    orderBy: { startsAt: "asc" },
  });
}

export function getEventBySlug(slug: string) {
  return prisma.event.findUnique({ where: { slug } });
}
