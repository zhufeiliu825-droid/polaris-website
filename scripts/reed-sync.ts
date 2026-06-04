/**
 * Production sync — pulls jobs from Reed and writes data/jobs.json.
 *
 * Two-stage fetch:
 *  1. Six industry searches (graduate-filtered). Each result is tagged with
 *     that sector. If a job is returned by multiple sectors (it often is —
 *     "Financial Risk Consultant" matches both Finance and Consulting), it
 *     keeps all of them in `sectors`.
 *  2. One Chinese-language catchall. Each result is auto-classified into one
 *     of the 6 sectors via {@link classifySectorFromText} and gets
 *     `isChineseSpeaking: true`.
 *
 * Run with:  npm run reed:sync
 */

import fs from "node:fs";
import path from "node:path";
import { reedSearchAll, cleanReedDescription, parseReedDate } from "../src/lib/reed";
import {
  reedSectors,
  chineseLanguageConfig,
  classifySectorFromText,
  type SectorKey,
} from "../src/lib/site";

const envFile = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envFile)) {
  for (const line of fs.readFileSync(envFile, "utf8").split("\n")) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
  }
}

const TARGET_PER_SECTOR = 100;
const CHINESE_TARGET = 200;

export type StoredJob = {
  id: string;
  sectors: SectorKey[]; // a job can belong to multiple sectors
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

export type StoredSnapshot = {
  fetchedAt: string;
  totalJobs: number;
  totalApiCalls: number;
  durationSeconds: number;
  perSectorCounts: Record<string, number>;
  chineseSpeakingCount: number;
  jobs: StoredJob[];
};

const CHINESE_REGEX = /\b(chinese|mandarin|cantonese)\b/i;

function makeStoredJob(
  j: Awaited<ReturnType<typeof reedSearchAll>>[number],
  sectors: SectorKey[],
  isChineseSpeaking: boolean
): StoredJob {
  return {
    id: String(j.jobId),
    sectors,
    isChineseSpeaking,
    jobTitle: j.jobTitle,
    employerName: j.employerName,
    locationName: j.locationName,
    minSalary: j.minimumSalary,
    maxSalary: j.maximumSalary,
    currency: j.currency,
    expirationDate: parseReedDate(j.expirationDate)?.toISOString() ?? null,
    postedAt: parseReedDate(j.date)?.toISOString() ?? null,
    description: cleanReedDescription(j.jobDescription),
    jobUrl: j.jobUrl,
    applications: j.applications,
  };
}

async function main() {
  console.log("Reed sync starting…\n");
  const byId = new Map<string, StoredJob>();
  let apiCalls = 0;
  const start = Date.now();

  // ─── Stage 1: 6 industry searches ──────────────────────────────
  for (const sector of reedSectors) {
    const t0 = Date.now();
    const results = await reedSearchAll(
      {
        keywords: sector.keywords,
        locationName: "london",
        graduate: sector.graduate,
        fullTime: true,
      },
      TARGET_PER_SECTOR
    );
    apiCalls += Math.ceil(results.length / 100) || 1;

    let chineseTagged = 0;
    let newCount = 0;
    let dupCount = 0;
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
        byId.set(id, makeStoredJob(j, [sector.key], isCh));
        newCount++;
      }
    }
    console.log(
      `  ${sector.key.padEnd(13)} ${String(results.length).padStart(3)} returned · ${newCount} new, ${dupCount} also-matched · ${chineseTagged} 中文 · ${((Date.now() - t0) / 1000).toFixed(1)}s`
    );
  }

  // ─── Stage 2: Chinese-speaking catchall ─────────────────────────
  const t0 = Date.now();
  const chineseResults = await reedSearchAll(
    {
      keywords: chineseLanguageConfig.keywords,
      locationName: "london",
      graduate: chineseLanguageConfig.graduate,
    },
    CHINESE_TARGET
  );
  apiCalls += Math.ceil(chineseResults.length / 100) || 1;

  let added = 0;
  let flagOnly = 0;
  for (const j of chineseResults) {
    const id = String(j.jobId);
    const description = cleanReedDescription(j.jobDescription);
    const existing = byId.get(id);
    if (existing) {
      if (!existing.isChineseSpeaking) {
        existing.isChineseSpeaking = true;
        flagOnly++;
      }
      continue;
    }
    const classified = classifySectorFromText(j.jobTitle + " " + description.slice(0, 200));
    byId.set(id, makeStoredJob(j, [classified], true));
    added++;
  }
  console.log(
    `  ${"Chinese".padEnd(13)} ${String(chineseResults.length).padStart(3)} returned · ${added} new, ${flagOnly} flag-only · ${((Date.now() - t0) / 1000).toFixed(1)}s`
  );

  // ─── Persist ────────────────────────────────────────────────────
  const jobs = [...byId.values()];
  const perSectorCounts: Record<string, number> = {};
  let chineseCount = 0;
  for (const j of jobs) {
    for (const s of j.sectors) {
      perSectorCounts[s] = (perSectorCounts[s] ?? 0) + 1;
    }
    if (j.isChineseSpeaking) chineseCount++;
  }

  const snapshot: StoredSnapshot = {
    fetchedAt: new Date().toISOString(),
    totalJobs: jobs.length,
    totalApiCalls: apiCalls,
    durationSeconds: (Date.now() - start) / 1000,
    perSectorCounts,
    chineseSpeakingCount: chineseCount,
    jobs,
  };

  const outDir = path.join(process.cwd(), "data");
  fs.mkdirSync(outDir, { recursive: true });
  const out = path.join(outDir, "jobs.json");
  fs.writeFileSync(out, JSON.stringify(snapshot, null, 2));

  console.log(
    `\n✓ ${snapshot.totalJobs} unique jobs · ${chineseCount} Chinese-speaking · ${apiCalls} API calls · ${snapshot.durationSeconds.toFixed(1)}s`
  );
  console.log(`  Per sector (with multi-match): ${JSON.stringify(perSectorCounts)}`);
  console.log(`  Wrote ${out}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
