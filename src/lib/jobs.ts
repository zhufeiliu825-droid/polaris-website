/**
 * Server-side data access for jobs — Prisma-backed.
 *
 * Sync writes to the Job table on a Vercel Cron schedule; reads here power
 * the public /opportunities page and the admin dashboard tile.
 */

import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/db";
import type { Prisma } from "@prisma/client";

/**
 * Job data changes once a day (the Reed cron). Cache all read paths under the
 * "jobs" tag so anonymous page views become zero-DB cache hits; the cron route
 * calls revalidateTag("jobs") after each sync to refresh.
 */
const JOBS_TAG = "jobs";
const DAY = 86400;
function cached<A extends unknown[], R>(
  fn: (...args: A) => Promise<R>,
  key: string
) {
  return unstable_cache(fn, [key], { tags: [JOBS_TAG], revalidate: DAY });
}

/**
 * The major UK cities we surface as their own filter chip. Anything not
 * matching one of these substrings buckets into "Other" in the city filter.
 */
export const MAJOR_CITIES = [
  "London",
  "Manchester",
  "Birmingham",
  "Bristol",
  "Edinburgh",
  "Leeds",
  "Liverpool",
  "Glasgow",
] as const;

export type MajorCity = (typeof MAJOR_CITIES)[number];

/** Sentinel used for the "anything not in MAJOR_CITIES" filter chip. */
export const OTHER_CITY = "Other";

export type StoredJob = {
  id: string;
  sectors: string[];
  isChineseSpeaking: boolean;
  jobTitle: string;
  employerName: string | null;
  locationName: string | null;
  minSalary: number | null;
  maxSalary: number | null;
  currency: string | null;
  expirationDate: string | null;
  postedAt: string | null;
  description: string;
  jobUrl: string;
  applications: number;
};

export type JobFilter = {
  /** Single-select sector. `undefined` = all sectors. */
  sector?: string;
  /** Single-select city. One of MAJOR_CITIES, OTHER_CITY, or undefined = all. */
  city?: string;
  search?: string;
  limit?: number;
  offset?: number;
};

function toStoredJob(j: {
  id: string;
  sectors: string[];
  isChineseSpeaking: boolean;
  jobTitle: string;
  employerName: string | null;
  locationName: string | null;
  minSalary: number | null;
  maxSalary: number | null;
  currency: string | null;
  expirationDate: Date | null;
  postedAt: Date | null;
  description: string;
  jobUrl: string | null;
  applications: number;
}): StoredJob {
  return {
    id: j.id,
    sectors: j.sectors,
    isChineseSpeaking: j.isChineseSpeaking,
    jobTitle: j.jobTitle,
    employerName: j.employerName,
    locationName: j.locationName,
    minSalary: j.minSalary,
    maxSalary: j.maxSalary,
    currency: j.currency,
    expirationDate: j.expirationDate?.toISOString() ?? null,
    postedAt: j.postedAt?.toISOString() ?? null,
    description: j.description,
    jobUrl: j.jobUrl ?? "",
    applications: j.applications,
  };
}

/**
 * Builds an extra Prisma where-clause object for a given city selection,
 * to be spread into the outer `where`. Returns null when no city filter.
 *
 * - Major city (e.g. "London") → substring match on locationName.
 * - "Other"                    → not-null AND not-substring-of-any-major-city.
 */
function cityClause(city: string | undefined): Prisma.JobWhereInput | null {
  if (!city) return null;
  if (city === OTHER_CITY) {
    return {
      AND: [
        { locationName: { not: null } },
        ...MAJOR_CITIES.map((c) => ({
          NOT: { locationName: { contains: c, mode: "insensitive" as const } },
        })),
      ],
    };
  }
  if ((MAJOR_CITIES as readonly string[]).includes(city)) {
    return { locationName: { contains: city, mode: "insensitive" } };
  }
  return null;
}

function buildWhere(filter: JobFilter): Prisma.JobWhereInput {
  const where: Prisma.JobWhereInput = { isActive: true };
  if (filter.sector) where.sectors = { has: filter.sector };
  const loc = cityClause(filter.city);
  if (loc) Object.assign(where, loc);
  if (filter.search) {
    const q = filter.search.trim();
    where.OR = [
      { jobTitle: { contains: q, mode: "insensitive" } },
      { employerName: { contains: q, mode: "insensitive" } },
    ];
  }
  return where;
}

async function listJobsUncached(filter: JobFilter = {}): Promise<{
  jobs: StoredJob[];
  total: number;
  fetchedAt: string;
}> {
  const where = buildWhere(filter);
  const [rows, total, latest] = await Promise.all([
    prisma.job.findMany({
      where,
      orderBy: [{ postedAt: "desc" }, { lastSeenAt: "desc" }],
      take: filter.limit ?? 30,
      skip: filter.offset ?? 0,
    }),
    prisma.job.count({ where }),
    prisma.jobSyncRun.findFirst({
      where: { ok: true },
      orderBy: { endedAt: "desc" },
      select: { endedAt: true },
    }),
  ]);

  return {
    jobs: rows.map(toStoredJob),
    total,
    fetchedAt: latest?.endedAt?.toISOString() ?? new Date(0).toISOString(),
  };
}

async function getJobUncached(id: string): Promise<StoredJob | null> {
  const row = await prisma.job.findUnique({ where: { id } });
  return row ? toStoredJob(row) : null;
}

/**
 * All counts needed by the filter sidebar.
 *
 * Each per-sector count is computed under the active city filter, and each
 * per-city count under the active sector filter — so the user can see exactly
 * how many results they'd get for any single change.
 */
async function filterCountsUncached(filter: {
  sector?: string;
  city?: string;
}): Promise<{
  total: number;
  perSectorCounts: Record<string, number>;
  perCityCounts: Record<string, number>;
  otherCityCount: number;
  fetchedAt: string;
}> {
  // Total under both active filters.
  const totalWhere = buildWhere({ sector: filter.sector, city: filter.city });

  // Per-sector counts: hold the city filter, vary the sector. Use groupBy
  // on `sectors` (unnested) so multi-sector jobs are counted once per sector.
  const sectorWhere = buildWhere({ city: filter.city });
  const sectorRows = await prisma.job.findMany({
    where: sectorWhere,
    select: { sectors: true },
  });
  const perSectorCounts: Record<string, number> = {};
  for (const r of sectorRows) {
    for (const s of r.sectors) {
      perSectorCounts[s] = (perSectorCounts[s] ?? 0) + 1;
    }
  }

  // Per-city counts: hold the sector filter, vary the city. Issue one count
  // query per major city + one for "Other".
  const cityWhere = buildWhere({ sector: filter.sector });
  const [cityCountPairs, otherCityCount, totalUnderActive, latest] = await Promise.all([
    Promise.all(
      MAJOR_CITIES.map(async (c) => {
        const n = await prisma.job.count({
          where: {
            ...cityWhere,
            locationName: { contains: c, mode: "insensitive" },
          },
        });
        return [c, n] as const;
      })
    ),
    prisma.job.count({
      where: { ...cityWhere, ...cityClause(OTHER_CITY) },
    }),
    prisma.job.count({ where: totalWhere }),
    prisma.jobSyncRun.findFirst({
      where: { ok: true },
      orderBy: { endedAt: "desc" },
      select: { endedAt: true },
    }),
  ]);

  const perCityCounts: Record<string, number> = Object.fromEntries(cityCountPairs);

  return {
    total: totalUnderActive,
    perSectorCounts,
    perCityCounts,
    otherCityCount,
    fetchedAt: latest?.endedAt?.toISOString() ?? new Date(0).toISOString(),
  };
}

// ── Cached public read paths (tag "jobs", revalidated daily by the cron) ──
export const listJobs = cached(listJobsUncached, "jobs-list");
export const getJob = cached(getJobUncached, "jobs-detail");
export const filterCounts = cached(filterCountsUncached, "jobs-counts");
