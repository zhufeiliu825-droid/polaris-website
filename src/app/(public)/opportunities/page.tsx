import Link from "next/link";
import {
  Search,
  MapPin,
  Calendar,
  Building2,
  ArrowRight,
  Briefcase,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/page-hero";
import { FilteringProvider, FilterPill, FilterResults } from "@/components/filtering";
import {
  listJobs,
  filterCounts,
  MAJOR_CITIES,
  OTHER_CITY,
} from "@/lib/jobs";
import { reedSectors } from "@/lib/site";

export const metadata = {
  title: "Opportunities",
  description:
    "A curated, daily-refreshed feed of graduate jobs, internships and schemes across Finance, Consulting, Engineering, Law and more — filter by sector and UK city.",
  alternates: { canonical: "/opportunities" },
};

const PAGE_SIZE = 25;
const ALL_SECTORS_LABEL = "All sectors";
const ALL_CITIES_LABEL = "All UK";

function fmtCount(n: number): string {
  return n >= 99 ? "99+" : String(n);
}

function formatSalary(min: number | null, max: number | null, currency: string | null) {
  if (!min && !max) return null;
  const fmt = (n: number) =>
    new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: currency ?? "GBP",
      maximumFractionDigits: 0,
    }).format(n);
  if (min && max && min !== max) return `${fmt(min)} – ${fmt(max)}`;
  return fmt(max ?? min ?? 0);
}

function formatPostedAgo(iso: string | null) {
  if (!iso) return null;
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 14) return `${days} days ago`;
  if (days < 60) return `${Math.round(days / 7)} weeks ago`;
  return `${Math.round(days / 30)} months ago`;
}

type SearchParamsP = Promise<{
  sector?: string;
  city?: string;
  q?: string;
  page?: string;
}>;

export default async function OpportunitiesPage({
  searchParams,
}: {
  searchParams: SearchParamsP;
}) {
  const sp = await searchParams;

  // Single-select sector + city.
  const validSectorKeys = new Set(reedSectors.map((s) => s.key as string));
  const sector =
    typeof sp.sector === "string" && validSectorKeys.has(sp.sector)
      ? sp.sector
      : undefined;

  const validCityKeys = new Set<string>([...MAJOR_CITIES, OTHER_CITY]);
  const city =
    typeof sp.city === "string" && validCityKeys.has(sp.city)
      ? sp.city
      : undefined;

  const q = (sp.q ?? "").trim();
  const page = Math.max(1, Number(sp.page ?? "1") || 1);

  const [{ jobs, total, fetchedAt }, counts] = await Promise.all([
    listJobs({
      sector,
      city,
      search: q || undefined,
      limit: PAGE_SIZE,
      offset: (page - 1) * PAGE_SIZE,
    }),
    filterCounts({ sector, city }),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const allSectorsCount = Object.values(counts.perSectorCounts).reduce(
    (a, b) => a + b,
    0
  );
  const allCitiesCount =
    Object.values(counts.perCityCounts).reduce((a, b) => a + b, 0) +
    counts.otherCityCount;

  const buildHref = (overrides: {
    sector?: string | null; // null clears
    city?: string | null;
    q?: string;
    page?: number;
  }) => {
    const next = new URLSearchParams();
    const nextSector =
      overrides.sector === null
        ? undefined
        : overrides.sector !== undefined
          ? overrides.sector
          : sector;
    if (nextSector) next.set("sector", nextSector);
    const nextCity =
      overrides.city === null
        ? undefined
        : overrides.city !== undefined
          ? overrides.city
          : city;
    if (nextCity) next.set("city", nextCity);
    const qq = overrides.q ?? q;
    if (qq) next.set("q", qq);
    const pp = overrides.page ?? 1;
    if (pp > 1) next.set("page", String(pp));
    const s = next.toString();
    return s ? `/opportunities?${s}` : "/opportunities";
  };

  return (
    <>
      <PageHero
        eyebrow="Opportunities"
        title="Find graduate jobs, internships and opportunities that actually fit you."
        subtitle="Curated opportunities for ambitious students and graduates — career opportunities across the UK."
      />

      <section className="bg-paper py-12">
        <Container>
          <FilteringProvider>
          {/* SEARCH + FILTERS — top bar, matching the Advice page style */}
          <div className="border-b border-navy-100 pb-6 mb-8 space-y-5">
            <form action="/opportunities" method="get" className="max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-navy-400" />
                <input
                  name="q"
                  type="search"
                  defaultValue={q}
                  aria-label="Search opportunities by title or employer"
                  placeholder="Search title or employer…"
                  className="w-full h-11 pl-9 pr-4 rounded-full border border-navy-200 text-sm field-focus focus:outline-none focus:border-navy-900"
                />
              </div>
              {sector && <input type="hidden" name="sector" value={sector} />}
              {city && <input type="hidden" name="city" value={city} />}
            </form>

            <PillRow label="Sector">
              <Pill
                href={buildHref({ sector: null, page: 1 })}
                active={!sector}
                label={ALL_SECTORS_LABEL}
                count={fmtCount(allSectorsCount || counts.total)}
              />
              {reedSectors.map((s) => (
                <Pill
                  key={s.key}
                  href={buildHref({ sector: s.key, page: 1 })}
                  active={sector === s.key}
                  label={s.label}
                  count={fmtCount(counts.perSectorCounts[s.key] ?? 0)}
                />
              ))}
            </PillRow>

            <PillRow label="City">
              <Pill
                href={buildHref({ city: null, page: 1 })}
                active={!city}
                label={ALL_CITIES_LABEL}
                count={fmtCount(allCitiesCount)}
              />
              {MAJOR_CITIES.map((c) => (
                <Pill
                  key={c}
                  href={buildHref({ city: c, page: 1 })}
                  active={city === c}
                  label={c}
                  count={fmtCount(counts.perCityCounts[c] ?? 0)}
                />
              ))}
              <Pill
                href={buildHref({ city: OTHER_CITY, page: 1 })}
                active={city === OTHER_CITY}
                label="Other"
                count={fmtCount(counts.otherCityCount)}
              />
            </PillRow>
          </div>

          <FilterResults>
          {/* RESULT META */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <p className="text-sm text-navy-600">
              <strong className="text-navy-950">{fmtCount(total)}</strong>{" "}
              opportunit{total === 1 ? "y" : "ies"}
              {sector && (
                <>
                  {" "}
                  in <strong className="text-navy-950">{sector}</strong>
                </>
              )}
              {city && (
                <>
                  {" "}
                  ·{" "}
                  <strong className="text-navy-950">
                    {city === OTHER_CITY ? "Other UK cities" : city}
                  </strong>
                </>
              )}
              {q && (
                <>
                  {" "}
                  matching <strong className="text-navy-950">&ldquo;{q}&rdquo;</strong>
                </>
              )}
            </p>
            {(sector || city || q) && (
              <Link
                href="/opportunities"
                scroll={false}
                className="text-xs text-navy-600 hover:text-navy-900 underline underline-offset-4"
              >
                Clear all filters
              </Link>
            )}
          </div>

          {/* RESULTS */}
          {jobs.length === 0 ? (
            <div className="bg-white border border-navy-100 rounded-2xl p-12 text-center">
              <p className="text-navy-600">
                No opportunities matched. Try clearing some filters or searching
                differently.
              </p>
            </div>
          ) : (
            <ul className="space-y-4">
              {jobs.map((job) => {
                const postedAgo = formatPostedAgo(job.postedAt);
                const salary = formatSalary(
                  job.minSalary,
                  job.maxSalary,
                  job.currency
                );
                return (
                  <li key={job.id}>
                    <Link
                      href={`/opportunities/${job.id}`}
                      className="group block bg-white border border-navy-100 rounded-2xl p-6 hover:border-navy-900 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-sand-700 font-semibold flex-wrap">
                            <span>{job.sectors.join(" · ")}</span>
                            {postedAgo === "Today" && (
                              <span className="ml-1 px-2 py-0.5 text-[10px] tracking-wider rounded-full bg-navy-950 text-white">
                                NEW
                              </span>
                            )}
                          </div>
                          <h3 className="mt-2 text-xl md:text-2xl font-medium text-navy-950 tracking-tight group-hover:text-navy-700">
                            {job.jobTitle}
                          </h3>
                          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-navy-600">
                            {job.employerName && (
                              <span className="inline-flex items-center gap-1.5">
                                <Building2 className="h-4 w-4" />
                                {job.employerName}
                              </span>
                            )}
                            {job.locationName && (
                              <span className="inline-flex items-center gap-1.5">
                                <MapPin className="h-4 w-4" />
                                {job.locationName}
                              </span>
                            )}
                            {postedAgo && (
                              <span className="inline-flex items-center gap-1.5">
                                <Calendar className="h-4 w-4" />
                                {postedAgo}
                              </span>
                            )}
                            {salary && (
                              <span className="inline-flex items-center gap-1.5">
                                <Briefcase className="h-4 w-4" />
                                {salary}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="shrink-0 self-center inline-flex items-center gap-1 text-sm font-medium text-navy-900 opacity-0 group-hover:opacity-100 transition-opacity">
                          View <ArrowRight className="h-4 w-4" />
                        </div>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}

          {totalPages > 1 && (
            <div className="mt-10 flex justify-center items-center gap-2">
              {page > 1 && (
                <Link
                  href={buildHref({ page: page - 1 })}
                  className="px-4 h-10 inline-flex items-center rounded-full border border-navy-200 text-sm font-medium hover:bg-navy-50"
                >
                  ← Previous
                </Link>
              )}
              <span className="px-4 text-sm text-navy-600">
                Page {page} of {totalPages}
              </span>
              {page < totalPages && (
                <Link
                  href={buildHref({ page: page + 1 })}
                  className="px-4 h-10 inline-flex items-center rounded-full border border-navy-200 text-sm font-medium hover:bg-navy-50"
                >
                  Next →
                </Link>
              )}
            </div>
          )}

          <p className="mt-8 text-xs text-navy-400 text-center">
            {fetchedAt && (
              <>
                Last refreshed{" "}
                {new Date(fetchedAt).toLocaleString("en-GB", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}{" "}
                ·{" "}
              </>
            )}
            Jobs powered by{" "}
            <a
              href="https://www.reed.co.uk/"
              target="_blank"
              rel="noopener"
              className="underline hover:text-navy-700"
            >
              Reed.co.uk
            </a>
          </p>
          </FilterResults>
          </FilteringProvider>
        </Container>
      </section>
    </>
  );
}

function PillRow({ label, children }: { label: string; children: React.ReactNode }) {
  // Grid (not flex-wrap) keeps the label column a fixed width so the pills
  // always start at the same x and the label never gets pushed onto its own
  // line, regardless of how many pills the row has.
  return (
    <div className="grid grid-cols-[4.5rem_1fr] gap-x-3 items-start">
      <span className="text-xs uppercase tracking-widest text-navy-900 font-semibold h-9 inline-flex items-center">
        {label}
      </span>
      <div className="flex gap-2 flex-wrap">{children}</div>
    </div>
  );
}

function Pill({
  href,
  active,
  label,
  count,
}: {
  href: string;
  active: boolean;
  label: string;
  count: string;
}) {
  return (
    <FilterPill
      href={href}
      active={active}
      className={
        "h-9 px-4 rounded-full text-sm font-medium " +
        (active
          ? "bg-navy-950 text-white"
          : "text-navy-700 hover:bg-navy-50")
      }
    >
      {label}
      <span className={"text-xs " + (active ? "text-white/55" : "text-navy-400")}>
        {count}
      </span>
    </FilterPill>
  );
}
