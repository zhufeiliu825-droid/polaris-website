/**
 * Smoke test for the Reed sync. Pulls up to 100 jobs per configured sector,
 * writes the results to /tmp/jobs-snapshot.json so we can eyeball the data
 * shape without needing a database yet.
 *
 * Run with:  npx tsx scripts/test-reed-sync.ts
 */

import fs from "node:fs";
import path from "node:path";
import { reedSearchAll, cleanReedDescription, parseReedDate } from "../src/lib/reed";
import { reedSectors } from "../src/lib/site";

// Load .env.local manually (tsx doesn't do this by default for plain scripts).
const envFile = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envFile)) {
  for (const line of fs.readFileSync(envFile, "utf8").split("\n")) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
  }
}

const TARGET_PER_SECTOR = 100;

async function main() {
  console.log("Reed sync smoke test — pulling up to", TARGET_PER_SECTOR, "jobs per sector\n");

  const all: Record<string, unknown[]> = {};
  let totalApiCalls = 0;
  const start = Date.now();

  for (const sector of reedSectors) {
    const t0 = Date.now();
    console.log(`→ ${sector.key} (kw="${sector.keywords}")`);

    const results = await reedSearchAll(
      {
        keywords: sector.keywords,
        permanent: true,
        fullTime: true,
      },
      TARGET_PER_SECTOR
    );

    const calls = Math.ceil(results.length / 100) || 1;
    totalApiCalls += calls;

    const mapped = results.map((j) => ({
      id: String(j.jobId),
      sector: sector.key,
      jobTitle: j.jobTitle,
      employerName: j.employerName,
      locationName: j.locationName,
      minSalary: j.minimumSalary,
      maxSalary: j.maximumSalary,
      currency: j.currency,
      expirationDate: parseReedDate(j.expirationDate),
      postedAt: parseReedDate(j.date),
      description: cleanReedDescription(j.jobDescription),
      jobUrl: j.jobUrl,
      applications: j.applications,
    }));

    all[sector.key] = mapped;
    console.log(
      `  ✓ ${results.length} jobs in ${((Date.now() - t0) / 1000).toFixed(1)}s (${calls} API call${calls > 1 ? "s" : ""})`
    );
  }

  const summary = {
    fetchedAt: new Date().toISOString(),
    totalJobs: Object.values(all).reduce((n, arr) => n + arr.length, 0),
    totalApiCalls,
    durationSeconds: (Date.now() - start) / 1000,
    perSectorCounts: Object.fromEntries(
      Object.entries(all).map(([k, v]) => [k, v.length])
    ),
    jobs: all,
  };

  const outPath = "/tmp/jobs-snapshot.json";
  fs.writeFileSync(outPath, JSON.stringify(summary, null, 2));

  console.log("\n──────────────────────────────────────────");
  console.log("Total jobs:    ", summary.totalJobs);
  console.log("API calls:     ", summary.totalApiCalls);
  console.log("Duration:      ", summary.durationSeconds.toFixed(1) + "s");
  console.log("Per sector:    ", summary.perSectorCounts);
  console.log("Wrote snapshot:", outPath);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
