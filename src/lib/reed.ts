/**
 * Reed Jobseeker API client.
 *
 * Docs: https://www.reed.co.uk/developers/Jobseeker
 *
 * Auth: HTTP Basic. Username = API key, password = empty.
 * Rate limits: not published. We rate-limit ourselves with a small delay
 * between requests during sync.
 */

const REED_API_BASE = "https://www.reed.co.uk/api/1.0";

type ReedSearchParams = {
  keywords?: string;
  locationName?: string;
  distanceFromLocation?: number;
  permanent?: boolean;
  contract?: boolean;
  temp?: boolean;
  partTime?: boolean;
  fullTime?: boolean;
  graduate?: boolean;
  postedByRecruitmentAgency?: boolean;
  postedByDirectEmployer?: boolean;
  minimumSalary?: number;
  maximumSalary?: number;
  resultsToTake?: number; // max 100
  resultsToSkip?: number;
};

/** A single job item as returned by Reed's /search endpoint. */
export type ReedSearchJob = {
  jobId: number;
  employerId: number | null;
  employerName: string | null;
  employerProfileId: number | null;
  employerProfileName: string | null;
  jobTitle: string;
  locationName: string | null;
  minimumSalary: number | null;
  maximumSalary: number | null;
  currency: string | null;
  expirationDate: string | null; // "dd/MM/yyyy"
  date: string | null; // "dd/MM/yyyy" — when posted
  jobDescription: string; // truncated excerpt
  applications: number;
  jobUrl: string; // reed.co.uk page
};

export type ReedSearchResponse = {
  results: ReedSearchJob[];
  ambiguousLocations: unknown[];
  totalResults: number;
};

/** Reed /jobs/{id} returns more — including externalUrl & contractType. */
export type ReedJobDetails = {
  jobId: number;
  employerId: number;
  employerName: string;
  jobTitle: string;
  locationName: string;
  minimumSalary: number;
  maximumSalary: number;
  currency: string;
  contractType: string; // "Permanent" | "Contract" | "Temporary"
  jobType: string; // "FullTime" | "PartTime"
  expirationDate: string;
  externalUrl: string | null;
  jobUrl: string;
  jobDescription: string;
  yearlyMinimumSalary: number | null;
  yearlyMaximumSalary: number | null;
  salaryType: string | null;
};

function basicAuthHeader(): string {
  const key = process.env.REED_API_KEY;
  if (!key) throw new Error("REED_API_KEY is not set");
  return "Basic " + Buffer.from(`${key}:`).toString("base64");
}

function buildQuery(params: ReedSearchParams): string {
  const usp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null || v === "") continue;
    usp.set(k, String(v));
  }
  return usp.toString();
}

export async function reedSearch(
  params: ReedSearchParams
): Promise<ReedSearchResponse> {
  const url = `${REED_API_BASE}/search?${buildQuery(params)}`;
  const res = await fetch(url, {
    headers: { Authorization: basicAuthHeader() },
    cache: "no-store",
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(
      `Reed /search failed: ${res.status} ${res.statusText} :: ${body.slice(0, 200)}`
    );
  }
  return (await res.json()) as ReedSearchResponse;
}

export async function reedDetails(jobId: number | string): Promise<ReedJobDetails> {
  const url = `${REED_API_BASE}/jobs/${jobId}`;
  const res = await fetch(url, {
    headers: { Authorization: basicAuthHeader() },
    cache: "no-store",
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(
      `Reed /jobs/${jobId} failed: ${res.status} ${res.statusText} :: ${body.slice(0, 200)}`
    );
  }
  return (await res.json()) as ReedJobDetails;
}

/**
 * Page through search results until either:
 *  - we have `limit` results, or
 *  - Reed has no more.
 *
 * Reed caps a single request at 100; we make multiple requests with a small
 * delay between them.
 */
export async function reedSearchAll(
  baseParams: Omit<ReedSearchParams, "resultsToTake" | "resultsToSkip">,
  limit: number,
  delayMs = 200
): Promise<ReedSearchJob[]> {
  const out: ReedSearchJob[] = [];
  let skip = 0;
  const pageSize = Math.min(100, limit);
  while (out.length < limit) {
    const remaining = limit - out.length;
    const take = Math.min(pageSize, remaining);
    const page = await reedSearch({
      ...baseParams,
      resultsToTake: take,
      resultsToSkip: skip,
    });
    out.push(...page.results);
    if (page.results.length < take) break; // no more
    skip += take;
    if (skip < page.totalResults && out.length < limit) {
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
  return out;
}

/** Parses Reed's "dd/MM/yyyy" date strings. Returns null on bad input. */
export function parseReedDate(s: string | null | undefined): Date | null {
  if (!s) return null;
  const [d, m, y] = s.split("/").map((n) => Number(n));
  if (!d || !m || !y) return null;
  return new Date(Date.UTC(y, m - 1, d));
}

/** Strips Reed's HTML entities and trailing "..." from search excerpts. */
export function cleanReedDescription(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}
