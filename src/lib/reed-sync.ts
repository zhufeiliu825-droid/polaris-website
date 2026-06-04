/**
 * Reed → Postgres sync. Callable from both the CLI script
 * (`scripts/reed-sync.ts`) and the Vercel Cron API route.
 *
 * Pipeline:
 *   1. 6 sector searches (permanent + graduate-filtered). Each result is
 *      tagged with its sector. Multi-matching jobs accumulate sectors.
 *   2. Each result is scanned for "chinese / mandarin / cantonese" in the
 *      title or description. Matches get `isChineseSpeaking: true` — no
 *      separate Reed query, we just classify what we already pulled.
 *   3. Postcode-only locations are enriched via /jobs/{id} for a proper
 *      city name.
 *
 * Then upserts every fetched job into the Job table, and marks Jobs that
 * weren't returned this run as inactive (cheap soft-delete — they keep
 * surfacing in admin views but disappear from the public list).
 */

import { prisma } from "@/lib/db";
import {
  reedSearchAll,
  reedDetails,
  cleanReedDescription,
  parseReedDate,
} from "@/lib/reed";
import { reedSectors, type SectorKey } from "@/lib/site";

export type SyncResult = {
  ok: boolean;
  startedAt: string;
  endedAt: string;
  durationSeconds: number;
  totalFetched: number;
  totalUpserted: number;
  totalDeactivated: number;
  apiCalls: number;
  perSectorCounts: Record<string, number>;
  chineseSpeakingCount: number;
  error?: string;
};

const CHINESE_REGEX = /\b(chinese|mandarin|cantonese)\b/i;

const TARGET_PER_SECTOR = 200;

/**
 * Inactive jobs (last seen more than this many days ago) get hard-deleted
 * at the end of every sync. Keeps the DB from growing forever while still
 * giving stale jobs a grace window to come back as active before we lose
 * them permanently.
 */
const INACTIVE_CLEANUP_DAYS = 7;

type StagedJob = {
  id: string;
  jobTitle: string;
  employerId: number | null;
  employerName: string | null;
  employerProfileId: number | null;
  description: string;
  locationName: string | null;
  minSalary: number | null;
  maxSalary: number | null;
  currency: string | null;
  sectors: string[];
  isChineseSpeaking: boolean;
  postedAt: Date | null;
  expirationDate: Date | null;
  jobUrl: string | null;
  externalUrl: string | null;
  applications: number;
};

export async function runReedSync(options: { log?: (msg: string) => void } = {}): Promise<SyncResult> {
  const log = options.log ?? ((m) => console.log(m));
  const startedAt = new Date();
  const t0 = Date.now();
  const byId = new Map<string, StagedJob>();
  let apiCalls = 0;

  try {
    // ─── Stage 1: 6 sector searches ──────────────────────────────
    for (const sector of reedSectors) {
      const sectorStart = Date.now();
      const results = await reedSearchAll(
        {
          keywords: sector.keywords,
          // UK-wide (no locationName). Permanent + graduate-friendly
          // only — drops contract/temp + the random non-grad listings
          // (cleaners, drivers, etc.) that polluted earlier runs.
          permanent: true,
          graduate: true,
        },
        TARGET_PER_SECTOR
      );
      apiCalls += Math.ceil(results.length / 100) || 1;

      let newCount = 0;
      let dupCount = 0;
      let chineseTagged = 0;
      for (const j of results) {
        const id = String(j.jobId);
        const description = cleanReedDescription(j.jobDescription);
        const isCh = CHINESE_REGEX.test(j.jobTitle) || CHINESE_REGEX.test(description);
        if (isCh) chineseTagged++;
        const existing = byId.get(id);
        if (existing) {
          if (!existing.sectors.includes(sector.key)) existing.sectors.push(sector.key);
          if (isCh) existing.isChineseSpeaking = true;
          dupCount++;
        } else {
          byId.set(id, stage(j, [sector.key], isCh, description));
          newCount++;
        }
      }
      log(
        `  ${sector.key.padEnd(13)} ${String(results.length).padStart(3)} returned · ${newCount} new, ${dupCount} also-matched · ${chineseTagged} CN · ${((Date.now() - sectorStart) / 1000).toFixed(1)}s`
      );
    }

    // (Chinese-speaking flag is applied inline during stage 1 — see
    // the CHINESE_REGEX check in the sector loop.)

    // ─── Stage 2: enrich location for postcode-only entries ─────
    // Reed's /search returns a raw postcode for the `locationName`
    // (e.g. "HP27DN") whenever the employer typed one. /jobs/{id}
    // returns the proper area name ("Hemel Hempstead Industrial
    // Estate"). We fetch details only for the postcode-shaped
    // entries to keep API calls manageable.
    const POSTCODE_ONLY = /^[A-Z]{1,2}\d[A-Z0-9]?\s?\d[A-Z]{2}$/i;
    const needsEnrich = [...byId.values()].filter(
      (j) => !j.locationName || POSTCODE_ONLY.test(j.locationName.trim())
    );
    if (needsEnrich.length > 0) {
      const enrichStart = Date.now();
      const CONCURRENCY = 10;
      let enriched = 0;
      for (let i = 0; i < needsEnrich.length; i += CONCURRENCY) {
        const batch = needsEnrich.slice(i, i + CONCURRENCY);
        await Promise.all(
          batch.map(async (j) => {
            try {
              const d = await reedDetails(j.id);
              apiCalls++;
              if (d.locationName) {
                j.locationName = d.locationName;
                enriched++;
              }
              // Bonus fields the details endpoint gives us "for free":
              if (d.externalUrl) j.externalUrl = d.externalUrl;
            } catch {
              // Per-job error — keep the postcode rather than fail the sync.
            }
          })
        );
      }
      log(
        `  ${"Locations".padEnd(13)} ${String(needsEnrich.length).padStart(3)} fetched · ${enriched} resolved · ${((Date.now() - enrichStart) / 1000).toFixed(1)}s`
      );
    }

    // ─── Persist ────────────────────────────────────────────────
    const jobs = [...byId.values()];
    const now = new Date();

    // Upsert one row at a time. We could batch, but 500-ish rows finishes
    // well within Vercel's serverless timeout and the simpler code wins.
    let upserted = 0;
    for (const j of jobs) {
      await prisma.job.upsert({
        where: { id: j.id },
        create: {
          id: j.id,
          jobTitle: j.jobTitle,
          employerId: j.employerId,
          employerName: j.employerName,
          employerProfileId: j.employerProfileId,
          description: j.description,
          locationName: j.locationName,
          minSalary: j.minSalary,
          maxSalary: j.maxSalary,
          currency: j.currency,
          sectors: j.sectors,
          isChineseSpeaking: j.isChineseSpeaking,
          postedAt: j.postedAt,
          expirationDate: j.expirationDate,
          jobUrl: j.jobUrl,
          externalUrl: j.externalUrl,
          applications: j.applications,
          isActive: true,
          firstSeenAt: now,
          lastSeenAt: now,
        },
        update: {
          jobTitle: j.jobTitle,
          employerName: j.employerName,
          description: j.description,
          locationName: j.locationName,
          minSalary: j.minSalary,
          maxSalary: j.maxSalary,
          currency: j.currency,
          sectors: j.sectors,
          isChineseSpeaking: j.isChineseSpeaking,
          postedAt: j.postedAt,
          expirationDate: j.expirationDate,
          jobUrl: j.jobUrl,
          applications: j.applications,
          isActive: true,
          lastSeenAt: now,
        },
      });
      upserted++;
    }

    // Mark jobs we didn't see this run as inactive.
    const seenIds = Array.from(byId.keys());
    const deactivated = await prisma.job.updateMany({
      where: {
        isActive: true,
        id: { notIn: seenIds.length ? seenIds : ["__never__"] },
      },
      data: { isActive: false },
    });

    // Hard-delete jobs that have been inactive long enough. Reed jobs that
    // come back into the top-200 within the grace window will re-upsert
    // (refreshing isActive=true); anything beyond INACTIVE_CLEANUP_DAYS is
    // safe to drop.
    const cutoff = new Date(Date.now() - INACTIVE_CLEANUP_DAYS * 86_400_000);
    const purged = await prisma.job.deleteMany({
      where: {
        isActive: false,
        lastSeenAt: { lt: cutoff },
      },
    });
    if (purged.count > 0) {
      log(`  ${"Cleanup".padEnd(13)} ${String(purged.count).padStart(3)} purged · stale > ${INACTIVE_CLEANUP_DAYS}d`);
    }

    // ─── Compute metrics ────────────────────────────────────────
    const perSectorCounts: Record<string, number> = {};
    let chineseCount = 0;
    for (const j of jobs) {
      for (const s of j.sectors) {
        perSectorCounts[s] = (perSectorCounts[s] ?? 0) + 1;
      }
      if (j.isChineseSpeaking) chineseCount++;
    }

    const endedAt = new Date();
    const result: SyncResult = {
      ok: true,
      startedAt: startedAt.toISOString(),
      endedAt: endedAt.toISOString(),
      durationSeconds: (Date.now() - t0) / 1000,
      totalFetched: jobs.length,
      totalUpserted: upserted,
      totalDeactivated: deactivated.count,
      apiCalls,
      perSectorCounts,
      chineseSpeakingCount: chineseCount,
    };

    // Log the run.
    await prisma.jobSyncRun.create({
      data: {
        startedAt,
        endedAt,
        ok: true,
        sectorsRun: reedSectors.map((s) => s.key),
        jobsFetched: result.totalFetched,
        jobsAdded: 0, // we'd need pre/post counts to split out; skipping for now
        jobsUpdated: result.totalUpserted,
        jobsExpired: result.totalDeactivated,
        apiCalls: result.apiCalls,
      },
    });

    return result;
  } catch (e) {
    const error = e instanceof Error ? e.message + "\n" + (e.stack ?? "") : String(e);
    const endedAt = new Date();
    await prisma.jobSyncRun.create({
      data: {
        startedAt,
        endedAt,
        ok: false,
        sectorsRun: reedSectors.map((s) => s.key),
        apiCalls,
        errorLog: error,
      },
    });
    return {
      ok: false,
      startedAt: startedAt.toISOString(),
      endedAt: endedAt.toISOString(),
      durationSeconds: (Date.now() - t0) / 1000,
      totalFetched: byId.size,
      totalUpserted: 0,
      totalDeactivated: 0,
      apiCalls,
      perSectorCounts: {},
      chineseSpeakingCount: 0,
      error,
    };
  }
}

function stage(
  j: Awaited<ReturnType<typeof reedSearchAll>>[number],
  sectors: SectorKey[],
  isChineseSpeaking: boolean,
  description: string
): StagedJob {
  return {
    id: String(j.jobId),
    jobTitle: j.jobTitle,
    employerId: j.employerId,
    employerName: j.employerName,
    employerProfileId: j.employerProfileId,
    description,
    locationName: j.locationName,
    minSalary: j.minimumSalary,
    maxSalary: j.maximumSalary,
    currency: j.currency,
    sectors,
    isChineseSpeaking,
    postedAt: parseReedDate(j.date),
    expirationDate: parseReedDate(j.expirationDate),
    jobUrl: j.jobUrl,
    externalUrl: null,
    applications: j.applications,
  };
}
