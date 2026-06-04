/**
 * Server-side data access for jobs.
 *
 * Reads from data/jobs.json (refreshed via `npm run reed:sync`). When the
 * Postgres-backed sync is wired, swap this for Prisma — the page components
 * don't need to change.
 */

import fs from "node:fs";
import path from "node:path";
import type { StoredJob, StoredSnapshot } from "../../scripts/reed-sync";

let cache: { mtimeMs: number; snapshot: StoredSnapshot } | null = null;

function loadSnapshot(): StoredSnapshot {
  const file = path.join(process.cwd(), "data", "jobs.json");
  if (!fs.existsSync(file)) {
    return {
      fetchedAt: new Date(0).toISOString(),
      totalJobs: 0,
      totalApiCalls: 0,
      durationSeconds: 0,
      perSectorCounts: {},
      chineseSpeakingCount: 0,
      jobs: [],
    };
  }
  const stat = fs.statSync(file);
  if (!cache || cache.mtimeMs !== stat.mtimeMs) {
    const raw = fs.readFileSync(file, "utf8");
    cache = { mtimeMs: stat.mtimeMs, snapshot: JSON.parse(raw) };
  }
  return cache.snapshot;
}

export type JobFilter = {
  sectors?: string[]; // filter to these sectors
  chineseOnly?: boolean; // filter to Chinese-speaking only
  search?: string;
  limit?: number;
  offset?: number;
};

export function listJobs(filter: JobFilter = {}): {
  jobs: StoredJob[];
  total: number;
  fetchedAt: string;
} {
  const snap = loadSnapshot();
  let filtered = snap.jobs;

  if (filter.sectors && filter.sectors.length > 0) {
    const allow = new Set(filter.sectors);
    filtered = filtered.filter((j) => j.sectors.some((s) => allow.has(s)));
  }
  if (filter.chineseOnly) {
    filtered = filtered.filter((j) => j.isChineseSpeaking);
  }
  if (filter.search) {
    const q = filter.search.toLowerCase().trim();
    filtered = filtered.filter(
      (j) =>
        j.jobTitle.toLowerCase().includes(q) ||
        (j.employerName ?? "").toLowerCase().includes(q)
    );
  }
  filtered = [...filtered].sort((a, b) => {
    const da = a.postedAt ? new Date(a.postedAt).getTime() : 0;
    const db = b.postedAt ? new Date(b.postedAt).getTime() : 0;
    return db - da;
  });

  const total = filtered.length;
  const offset = filter.offset ?? 0;
  const limit = filter.limit ?? 30;
  const jobs = filtered.slice(offset, offset + limit);
  return { jobs, total, fetchedAt: snap.fetchedAt };
}

export function getJob(id: string): StoredJob | null {
  const snap = loadSnapshot();
  return snap.jobs.find((j) => j.id === id) ?? null;
}

/**
 * Returns counts considering the active language filter — so that when
 * "Chinese-speaking only" is on, sector counts show the Chinese subset.
 */
export function countsByFilter(filter: { chineseOnly?: boolean } = {}): {
  perSectorCounts: Record<string, number>;
  total: number;
  chineseSpeakingCount: number;
  fetchedAt: string;
} {
  const snap = loadSnapshot();
  const pool = filter.chineseOnly
    ? snap.jobs.filter((j) => j.isChineseSpeaking)
    : snap.jobs;
  const perSectorCounts: Record<string, number> = {};
  for (const j of pool) {
    for (const s of j.sectors) {
      perSectorCounts[s] = (perSectorCounts[s] ?? 0) + 1;
    }
  }
  return {
    perSectorCounts,
    total: pool.length,
    chineseSpeakingCount: snap.chineseSpeakingCount,
    fetchedAt: snap.fetchedAt,
  };
}

/** Convenience for the admin dashboard tile — same as countsByFilter() with no args. */
export function jobsMetadata() {
  const { total, fetchedAt, perSectorCounts } = countsByFilter();
  return { total, fetchedAt, perSectorCounts };
}

export type { StoredJob };
