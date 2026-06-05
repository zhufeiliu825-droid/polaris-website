/**
 * Vercel Cron endpoint — pulls jobs from Reed into Postgres.
 *
 * Schedule is configured in vercel.json. Vercel automatically calls this
 * with `Authorization: Bearer <CRON_SECRET>` when CRON_SECRET is set in
 * the project env vars; we reject anything else to prevent random callers
 * from triggering a Reed scrape (which costs API quota).
 *
 * Manual trigger:
 *   curl -H "Authorization: Bearer $CRON_SECRET" \
 *        https://polarisconsulting.uk/api/cron/reed-sync
 */

import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { runReedSync } from "@/lib/reed-sync";

// Reed can return ~500 jobs across all sectors → a few hundred upserts.
// Default serverless timeout (10s) won't cut it; bump to 5 min.
export const maxDuration = 300;
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const expected = process.env.CRON_SECRET;
  if (expected) {
    const auth = req.headers.get("authorization") ?? "";
    if (auth !== `Bearer ${expected}`) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
  }

  const result = await runReedSync({
    log: (m) => console.log("[cron]", m),
  });

  // Bust the cached opportunities reads so the fresh feed is served immediately.
  if (result.ok) revalidateTag("jobs", "max");

  return NextResponse.json(result, {
    status: result.ok ? 200 : 500,
  });
}
