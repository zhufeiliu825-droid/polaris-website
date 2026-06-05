import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";

const BASE = "https://polarisconsulting.uk";

export const revalidate = 86400; // refresh the sitemap daily

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/opportunities",
    "/events",
    "/advice",
    "/services",
    "/contact",
    "/join",
    "/privacy",
  ].map((p) => ({
    url: `${BASE}${p}`,
    lastModified: new Date(),
    changeFrequency: p === "/opportunities" ? "daily" : "weekly",
    priority: p === "" ? 1 : 0.7,
  }));

  // Published articles + events. Wrapped so a DB hiccup at build/ISR time
  // still produces a valid sitemap of the static routes.
  let dynamic: MetadataRoute.Sitemap = [];
  try {
    const [articles, events] = await Promise.all([
      prisma.article.findMany({
        where: { published: true },
        select: { slug: true, updatedAt: true },
      }),
      prisma.event.findMany({
        where: { published: true },
        select: { slug: true, updatedAt: true },
      }),
    ]);
    dynamic = [
      ...articles.map((a) => ({
        url: `${BASE}/advice/${a.slug}`,
        lastModified: a.updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
      ...events.map((e) => ({
        url: `${BASE}/events/${e.slug}`,
        lastModified: e.updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.5,
      })),
    ];
  } catch {
    // fall back to static routes only
  }

  return [...staticRoutes, ...dynamic];
}
