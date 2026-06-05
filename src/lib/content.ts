/**
 * Cached read accessors for editorial content (articles + events).
 *
 * Both are admin-edited and low-volume, so we cache the FULL published set
 * under a tag and do any filtering (category, featured, upcoming/past) in JS
 * at request time. This keeps the cache key stable — crucially, the events'
 * upcoming-vs-past split depends on `now`, which must NOT be part of a cache
 * key. Admin create/update/delete actions call revalidateTag to refresh.
 */

import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/db";

const DAY = 86400;
export const ARTICLES_TAG = "articles";
export const EVENTS_TAG = "events";

// ── Articles ──────────────────────────────────────────────────────────────
export const getPublishedArticles = unstable_cache(
  async () =>
    prisma.article.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
    }),
  ["articles-published"],
  { tags: [ARTICLES_TAG], revalidate: DAY }
);

export const getArticleBySlug = unstable_cache(
  async (slug: string) => prisma.article.findUnique({ where: { slug } }),
  ["article-by-slug"],
  { tags: [ARTICLES_TAG], revalidate: DAY }
);

// ── Events ────────────────────────────────────────────────────────────────
export const getPublishedEvents = unstable_cache(
  async () =>
    prisma.event.findMany({
      where: { published: true },
      orderBy: { startsAt: "asc" },
    }),
  ["events-published"],
  { tags: [EVENTS_TAG], revalidate: DAY }
);

export const getEventBySlug = unstable_cache(
  async (slug: string) => prisma.event.findUnique({ where: { slug } }),
  ["event-by-slug"],
  { tags: [EVENTS_TAG], revalidate: DAY }
);
