import Link from "next/link";
import { Calendar, MapPin, ArrowRight, Globe2 } from "lucide-react";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/page-hero";
import { prisma } from "@/lib/db";
import type { Prisma } from "@prisma/client";

export const metadata = { title: "Events" };

/**
 * Two independent filter axes:
 *   format = online | in-person   → narrows by event format
 *   when   = ongoing | past       → narrows by time
 *
 * Each is single-select; either or both can be active. No URL param =
 * "All" in that axis.
 */
const FORMAT_OPTIONS = [
  { key: "all", label: "All formats" },
  { key: "online", label: "Online" },
  { key: "in-person", label: "In person" },
] as const;
/**
 * Time chip — only Upcoming and Past. No "All" option because everything is
 * always one of the two; Upcoming is the default when no URL param is set.
 * (The URL key stays "upcoming"; the where-clause keys off it directly.)
 */
const WHEN_OPTIONS = [
  { key: "upcoming", label: "Upcoming" },
  { key: "past", label: "Past" },
] as const;

type FormatKey = (typeof FORMAT_OPTIONS)[number]["key"];
type WhenKey = (typeof WHEN_OPTIONS)[number]["key"];

function buildWhere(format: FormatKey, when: WhenKey, now: Date): Prisma.EventWhereInput {
  const where: Prisma.EventWhereInput = { published: true };
  if (format === "online") where.format = "ONLINE";
  if (format === "in-person") where.format = "IN_PERSON";
  if (when === "past") where.endsAt = { lt: now };
  else where.endsAt = { gte: now }; // "ongoing"
  return where;
}

function formatEventDateTime(starts: Date, ends: Date): { date: string; time: string } {
  const date = starts.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const timeFmt = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const time =
    starts.toDateString() === ends.toDateString()
      ? `${timeFmt.format(starts)}–${timeFmt.format(ends)}`
      : timeFmt.format(starts);
  return { date, time };
}

type Search = Promise<{ format?: string; when?: string }>;

export default async function EventsPage({ searchParams }: { searchParams: Search }) {
  const sp = await searchParams;
  const validFormats = new Set<string>(FORMAT_OPTIONS.map((o) => o.key));
  const validWhens = new Set<string>(WHEN_OPTIONS.map((o) => o.key));
  const activeFormat: FormatKey =
    sp.format && validFormats.has(sp.format) ? (sp.format as FormatKey) : "all";
  const activeWhen: WhenKey =
    sp.when && validWhens.has(sp.when) ? (sp.when as WhenKey) : "upcoming";

  const now = new Date();
  const where = buildWhere(activeFormat, activeWhen, now);

  // Past events sorted newest first; everything else soonest first.
  const orderBy: Prisma.EventOrderByWithRelationInput =
    activeWhen === "past" ? { startsAt: "desc" } : { startsAt: "asc" };

  const events = await prisma.event.findMany({ where, orderBy });

  /**
   * Builds the href for a chip in a given axis. Keeps the other axis's
   * active value intact. Defaults (format=all, when=ongoing) are encoded
   * as missing URL params so /events stays canonical.
   */
  const hrefFor = (axis: "format" | "when", key: string) => {
    const next = new URLSearchParams();
    const f = axis === "format" ? key : activeFormat;
    const w = axis === "when" ? key : activeWhen;
    if (f !== "all") next.set("format", f);
    if (w !== "upcoming") next.set("when", w);
    const s = next.toString();
    return s ? `/events?${s}` : "/events";
  };

  return (
    <>
      <PageHero
        eyebrow="Events"
        title="Meet recruiters, employers and ambitious graduates."
        subtitle="Workshops, networking events and career sessions designed to help you build connections that matter."
      />

      <section className="py-16 bg-paper">
        <Container>
          {/* FILTER CHIPS — two independent axes, Advice-page pill style */}
          <div className="space-y-2.5 mb-10 border-b border-navy-100 pb-6">
            <ChipRow
              label="Format"
              options={FORMAT_OPTIONS}
              activeKey={activeFormat}
              hrefFor={(k) => hrefFor("format", k)}
            />
            <ChipRow
              label="When"
              options={WHEN_OPTIONS}
              activeKey={activeWhen}
              hrefFor={(k) => hrefFor("when", k)}
            />
          </div>

          {events.length === 0 ? (
            <div className="bg-white border border-navy-100 rounded-2xl p-12 text-center">
              <p className="text-navy-600">
                {activeWhen === "past"
                  ? "No past events to show."
                  : "Nothing on the calendar right now — check back soon."}
              </p>
            </div>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((e) => {
                const { date, time } = formatEventDateTime(e.startsAt, e.endsAt);
                const isOnline = e.format === "ONLINE";
                const isPast = e.endsAt < now;
                return (
                  <li key={e.id}>
                    <Link
                      href={`/events/${e.slug}`}
                      className={
                        "group flex flex-col h-full bg-white border border-navy-100 rounded-2xl p-7 hover:border-navy-900 hover:shadow-lg transition-all " +
                        (isPast ? "opacity-75" : "")
                      }
                    >
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={
                            isOnline
                              ? "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-royal-500/10 text-royal-600 text-xs font-medium"
                              : "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sand-100 text-sand-700 text-xs font-medium"
                          }
                        >
                          {isOnline ? (
                            <Globe2 className="h-3.5 w-3.5" />
                          ) : (
                            <MapPin className="h-3.5 w-3.5" />
                          )}
                          {isOnline ? "Online" : "In person"}
                        </span>
                        {e.sector && (
                          <span className="text-xs uppercase tracking-widest text-navy-400 font-semibold">
                            {e.sector}
                          </span>
                        )}
                        {isPast && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-navy-100 text-navy-600 text-[10px] tracking-wider uppercase font-semibold">
                            Past
                          </span>
                        )}
                      </div>

                      <h3 className="mt-5 text-xl font-medium text-navy-950 tracking-tight group-hover:text-navy-700 leading-snug">
                        {e.title}
                      </h3>
                      <p className="mt-3 text-sm text-navy-600 leading-relaxed line-clamp-3">
                        {e.excerpt}
                      </p>

                      <div className="mt-6 pt-5 border-t border-navy-100 space-y-2 text-sm text-navy-700">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-sand-500" />
                          {date} · {time}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-sand-500" />
                          {e.location}
                        </div>
                      </div>

                      <div className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-navy-900 group-hover:gap-2.5 transition-all">
                        {isPast ? "View recap" : "Details"}{" "}
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </Container>
      </section>
    </>
  );
}

function ChipRow({
  label,
  options,
  activeKey,
  hrefFor,
}: {
  label: string;
  options: readonly { key: string; label: string }[];
  activeKey: string;
  hrefFor: (key: string) => string;
}) {
  return (
    <div className="flex items-baseline gap-x-3 gap-y-2 flex-wrap">
      <span className="text-xs uppercase tracking-widest text-navy-900 font-semibold w-14 shrink-0">
        {label}
      </span>
      <div className="flex gap-2 flex-wrap">
        {options.map((o) => {
          const isActive = o.key === activeKey;
          return (
            <Link
              key={o.key}
              href={hrefFor(o.key)}
              scroll={false}
              className={
                "h-9 px-4 inline-flex items-center rounded-full text-sm font-medium " +
                (isActive
                  ? "bg-navy-950 text-white"
                  : "text-navy-700 hover:bg-navy-50")
              }
            >
              {o.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
