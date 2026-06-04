import Link from "next/link";
import { Search, MapPin, Calendar, Building2, ArrowRight, Briefcase, Languages, Check } from "lucide-react";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/page-hero";
import { listJobs, countsByFilter } from "@/lib/jobs";
import { reedSectors, chineseLanguageConfig } from "@/lib/site";

export const metadata = { title: "Opportunities" };

const PAGE_SIZE = 25;

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
  sector?: string | string[];
  language?: string | string[];
  q?: string;
  page?: string;
}>;

export default async function OpportunitiesPage({
  searchParams,
}: {
  searchParams: SearchParamsP;
}) {
  const sp = await searchParams;
  const selectedSectors = sp.sector
    ? Array.isArray(sp.sector)
      ? sp.sector
      : [sp.sector]
    : [];
  const selectedLanguages = sp.language
    ? Array.isArray(sp.language)
      ? sp.language
      : [sp.language]
    : [];
  const chineseOnly = selectedLanguages.includes(chineseLanguageConfig.key);
  const q = (sp.q ?? "").trim();
  const page = Math.max(1, Number(sp.page ?? "1") || 1);

  const [{ jobs, total, fetchedAt }, counts] = await Promise.all([
    listJobs({
      sectors: selectedSectors.length ? selectedSectors : undefined,
      chineseOnly,
      search: q || undefined,
      limit: PAGE_SIZE,
      offset: (page - 1) * PAGE_SIZE,
    }),
    // Sector counts reflect the active language filter.
    countsByFilter({ chineseOnly }),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const buildHref = (overrides: {
    sector?: string[];
    language?: string[];
    q?: string;
    page?: number;
  }) => {
    const next = new URLSearchParams();
    const sectors = overrides.sector ?? selectedSectors;
    sectors.forEach((s) => next.append("sector", s));
    const languages = overrides.language ?? selectedLanguages;
    languages.forEach((l) => next.append("language", l));
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
        title="Graduate jobs, internships and schemes — handpicked."
        subtitle={`A curated feed of ${fmtCount(counts.total)} live opportunities. Refreshed from Reed and partner employers.`}
      />

      <section className="bg-paper py-12">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-10">
            {/* FILTERS */}
            <aside className="space-y-7 lg:sticky lg:top-24 self-start">
              <form action="/opportunities" method="get">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-navy-400" />
                  <input
                    name="q"
                    type="search"
                    defaultValue={q}
                    placeholder="Search title or employer…"
                    className="w-full h-11 pl-9 pr-4 rounded-full border border-navy-200 text-sm focus:outline-none focus:border-navy-900"
                  />
                </div>
                {selectedSectors.map((s) => (
                  <input key={s} type="hidden" name="sector" value={s} />
                ))}
                {selectedLanguages.map((l) => (
                  <input key={l} type="hidden" name="language" value={l} />
                ))}
              </form>

              <FilterGroup title="Sector">
                <SidebarRow
                  href={buildHref({ sector: [], page: 1 })}
                  active={selectedSectors.length === 0}
                  label="All sectors"
                  count={fmtCount(counts.total)}
                />
                {reedSectors.map((s) => {
                  const isSelected = selectedSectors.includes(s.key);
                  const nextSectors = isSelected
                    ? selectedSectors.filter((x) => x !== s.key)
                    : [...selectedSectors, s.key];
                  const sectorCount = counts.perSectorCounts[s.key] ?? 0;
                  return (
                    <SidebarRow
                      key={s.key}
                      href={buildHref({ sector: nextSectors, page: 1 })}
                      active={isSelected}
                      label={s.label}
                      count={fmtCount(sectorCount)}
                    />
                  );
                })}
                {(counts.perSectorCounts["Other"] ?? 0) > 0 && chineseOnly && (
                  <SidebarRow
                    href={buildHref({
                      sector: selectedSectors.includes("Other")
                        ? selectedSectors.filter((x) => x !== "Other")
                        : [...selectedSectors, "Other"],
                      page: 1,
                    })}
                    active={selectedSectors.includes("Other")}
                    label="Other"
                    count={fmtCount(counts.perSectorCounts["Other"] ?? 0)}
                  />
                )}
              </FilterGroup>

              <FilterGroup title="Language">
                <ToggleRow
                  href={buildHref({
                    language: chineseOnly ? [] : [chineseLanguageConfig.key],
                    page: 1,
                  })}
                  active={chineseOnly}
                  label="Chinese-speaking only"
                  count={fmtCount(counts.chineseSpeakingCount)}
                />
              </FilterGroup>

              {(selectedSectors.length > 0 || chineseOnly || q) && (
                <Link
                  href="/opportunities"
                  className="text-xs text-navy-600 hover:text-navy-900 underline underline-offset-4"
                >
                  Clear all filters
                </Link>
              )}

              {fetchedAt && (
                <p className="text-xs text-navy-500 pt-4 border-t border-navy-100">
                  Last refreshed{" "}
                  {new Date(fetchedAt).toLocaleString("en-GB", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
              )}
            </aside>

            {/* RESULTS */}
            <div>
              <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                <p className="text-sm text-navy-600">
                  <strong className="text-navy-950">{fmtCount(total)}</strong> opportunit
                  {total === 1 ? "y" : "ies"}
                  {selectedSectors.length > 0 && (
                    <>
                      {" "}
                      in{" "}
                      <strong className="text-navy-950">
                        {selectedSectors.join(", ")}
                      </strong>
                    </>
                  )}
                  {chineseOnly && (
                    <>
                      {" "}
                      ·{" "}
                      <strong className="text-navy-950">Chinese-speaking</strong>
                    </>
                  )}
                  {q && (
                    <>
                      {" "}
                      matching <strong className="text-navy-950">“{q}”</strong>
                    </>
                  )}
                </p>
              </div>

              {jobs.length === 0 ? (
                <div className="bg-white border border-navy-100 rounded-2xl p-12 text-center">
                  <p className="text-navy-600">
                    No opportunities matched. Try clearing some filters or
                    searching differently.
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
                                {job.isChineseSpeaking && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-royal-500/10 text-royal-600 text-[10px] tracking-wider">
                                    <Languages className="h-3 w-3" /> Chinese-speaking
                                  </span>
                                )}
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
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs uppercase tracking-widest text-navy-900 font-semibold mb-3">
        {title}
      </h3>
      <ul className="space-y-0.5">{children}</ul>
    </div>
  );
}

function SidebarRow({
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
    <li>
      <Link
        href={href}
        className={
          "flex items-center justify-between gap-2 py-1.5 text-sm rounded-md px-2 -mx-2 " +
          (active
            ? "bg-navy-950 text-white font-medium"
            : "text-navy-700 hover:bg-navy-50")
        }
      >
        <span>{label}</span>
        <span className={"text-xs " + (active ? "text-sand-300" : "text-navy-500")}>
          {count}
        </span>
      </Link>
    </li>
  );
}

function ToggleRow({
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
    <li>
      <Link
        href={href}
        className={
          "flex items-center gap-3 py-2 text-sm rounded-md px-2 -mx-2 " +
          (active
            ? "bg-navy-950 text-white font-medium"
            : "text-navy-700 hover:bg-navy-50")
        }
      >
        <span
          className={
            "h-4 w-4 rounded border flex items-center justify-center shrink-0 " +
            (active
              ? "bg-sand-300 border-sand-300 text-navy-950"
              : "bg-white border-navy-300")
          }
        >
          {active && <Check className="h-3 w-3" strokeWidth={3} />}
        </span>
        <span className="flex-1">{label}</span>
        <span className={"text-xs " + (active ? "text-sand-300" : "text-navy-500")}>
          {count}
        </span>
      </Link>
    </li>
  );
}
