/**
 * Server-side data access for jobs — now Prisma-backed.
 *
 * The page components are unchanged from the jobs.json days; we just swapped
 * the storage layer. Sync is driven by `runReedSync()` on a Vercel Cron
 * (daily) or via `npm run reed:sync` locally.
 */

import { prisma } from "@/lib/db";
import type { Prisma } from "@prisma/client";

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
  sectors?: string[];
  chineseOnly?: boolean;
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

export async function listJobs(filter: JobFilter = {}): Promise<{
  jobs: StoredJob[];
  total: number;
  fetchedAt: string;
}> {
  const where: Prisma.JobWhereInput = {
    isActive: true,
  };
  if (filter.sectors && filter.sectors.length > 0) {
    where.sectors = { hasSome: filter.sectors };
  }
  if (filter.chineseOnly) {
    where.isChineseSpeaking = true;
  }
  if (filter.search) {
    const q = filter.search.trim();
    where.OR = [
      { jobTitle: { contains: q, mode: "insensitive" } },
      { employerName: { contains: q, mode: "insensitive" } },
    ];
  }

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

export async function getJob(id: string): Promise<StoredJob | null> {
  const row = await prisma.job.findUnique({ where: { id } });
  return row ? toStoredJob(row) : null;
}

export async function countsByFilter(filter: { chineseOnly?: boolean } = {}): Promise<{
  perSectorCounts: Record<string, number>;
  total: number;
  chineseSpeakingCount: number;
  fetchedAt: string;
}> {
  const where: Prisma.JobWhereInput = {
    isActive: true,
  };
  if (filter.chineseOnly) where.isChineseSpeaking = true;

  const [rows, total, chineseSpeakingCount, latest] = await Promise.all([
    prisma.job.findMany({
      where,
      select: { sectors: true },
    }),
    prisma.job.count({ where }),
    prisma.job.count({ where: { isActive: true, isChineseSpeaking: true } }),
    prisma.jobSyncRun.findFirst({
      where: { ok: true },
      orderBy: { endedAt: "desc" },
      select: { endedAt: true },
    }),
  ]);

  const perSectorCounts: Record<string, number> = {};
  for (const r of rows) {
    for (const s of r.sectors) {
      perSectorCounts[s] = (perSectorCounts[s] ?? 0) + 1;
    }
  }
  return {
    perSectorCounts,
    total,
    chineseSpeakingCount,
    fetchedAt: latest?.endedAt?.toISOString() ?? new Date(0).toISOString(),
  };
}

export async function jobsMetadata() {
  const { total, fetchedAt, perSectorCounts } = await countsByFilter();
  return { total, fetchedAt, perSectorCounts };
}
