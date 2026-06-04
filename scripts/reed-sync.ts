/**
 * Local Reed sync runner — just wraps `runReedSync()` from the lib so the
 * same logic powers both `npm run reed:sync` and the Vercel Cron API route.
 *
 * Loads .env.local manually because tsx doesn't read it automatically when
 * we're not in a Next.js context.
 */

import fs from "node:fs";
import path from "node:path";

const envFile = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envFile)) {
  for (const line of fs.readFileSync(envFile, "utf8").split("\n")) {
    const m = line.match(/^([A-Z0-9_]+)=(?:"(.*)"|(.*))$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = (m[2] ?? m[3] ?? "").trim();
  }
}

async function main() {
  // Dynamic import so the env vars above are set before db.ts loads.
  const { runReedSync } = await import("../src/lib/reed-sync");

  console.log("Reed sync starting…\n");
  const result = await runReedSync({ log: (m) => console.log(m) });

  console.log();
  if (result.ok) {
    console.log(
      `✓ ${result.totalUpserted} upserted · ${result.totalDeactivated} deactivated · ${result.chineseSpeakingCount} CN · ${result.apiCalls} API calls · ${result.durationSeconds.toFixed(1)}s`
    );
    console.log(`  Per sector: ${JSON.stringify(result.perSectorCounts)}`);
  } else {
    console.error("✗ Sync failed:", result.error);
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
