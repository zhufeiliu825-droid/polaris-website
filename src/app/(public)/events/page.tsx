import Link from "next/link";
import { Calendar, MapPin, Users, ArrowRight, Globe2 } from "lucide-react";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/page-hero";
import { prisma } from "@/lib/db";
import type { Prisma } from "@prisma/client";

export const metadata = { title: "Events" };

/**
 * The five chip values the public Events page exposes. "All" is the default
 * (no URL param) and shows everything published.
 *
 *  - all        → no time/format filter
 *  - online     → format = ONLINE
 *  - in-person  → format = IN_PERSON
 *  - ongoing    → endsAt >= now (upcoming + currently running)
 *  - past       → endsAt < now
 */
const FILTERS = [
  { key: "all", label: "All" },
  { key: "online", label: "Online" },
  { key: "in-person", label: "In person" },
  { key: "ongoing", label: "Ongoing" },
  { key: "past", label: "Past" },
] as const;

type FilterKey = (typeof FILTERS)[number]["key"];

function whereForFilter(f: FilterKey, now: Date): Prisma.EventWhereInput {
  const base: Prisma.EventWhereInput = { published: true };
  switch (f) {
    case "online":
      return { ...base, format: "ONLINE" };
    case "in-person":
      return { ...base, format: "IN_PERSON" };
    case "ongoing":
      return { ...base, endsAt: { gte: now } };
    case "past":
      return { ...base, endsAt: { lt: now } };
    default:
      return base;
  }
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

type Search = Promise<{ filter?: string }>;

export default async function EventsPage({ searchParams }: { searchParams: Search }) {
  const sp = await searchParams;
  const validKeys = new Set<string>(FILTERS.map((f) => f.key));
  const activeKey: FilterKey =
    sp.filter && validKeys.has(sp.filter) ? (sp.filter as FilterKey) : "all";

  const now = new Date();
  const where = whereForFilter(activeKey, now);

  // Past events are most recent first; everything else is soonest-first.
  const orderBy: Prisma.EventOrderByWithRelationInput =
    activeKey === "past" ? { startsAt: "desc" } : { startsAt: "asc" };

  const events = await prisma.event.findMany({
    where,
    orderBy,
    include: { _count: { select: { registrations: true } } },
  });

  return (
    <>
      <PageHero
        eyebrow="Events"
        title="Workshops, talks and panels — live with industry insiders."
        subtitle="Online webinars and in-person events at our London office. All free for Polaris members."
      />

      <section className="py-16 bg-paper">
        <Container>
          {/* FILTER CHIPS */}
          <div className="flex gap-3 flex-wrap mb-10">
            {FILTERS.map((f) => {
              const isActive = f.key === activeKey;
              const href = f.key === "all" ? "/events" : `/events?filter=${f.key}`;
              return (
                <Link
                  key={f.key}
                  href={href}
                  scroll={false}
                  className={
                    isActive
                      ? "h-10 px-5 inline-flex items-center rounded-full bg-sand-100 text-navy-950 text-sm font-medium"
                      : "h-10 px-5 inline-flex items-center rounded-full bg-white border border-navy-200 text-sm font-medium text-navy-700 hover:bg-navy-50"
                  }
                >
                  {f.label}
                </Link>
              );
            })}
          </div>

          {events.length === 0 ? (
            <div className="bg-white border border-navy-100 rounded-2xl p-12 text-center">
              <p className="text-navy-600">
                {activeKey === "past"
                  ? "No past events to show."
                  : activeKey === "ongoing"
                    ? "Nothing on the calendar right now — check back soon."
                    : "No events match this filter."}
              </p>
            </div>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((e) => {
                const { date, time } = formatEventDateTime(e.startsAt, e.endsAt);
                const isOnline = e.format === "ONLINE";
                const isPast = e.endsAt < now;
                const spotsLeft =
                  e.capacity != null
                    ? Math.max(0, e.capacity - e._count.registrations)
                    : null;
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
                          {isOnline
                            ? "Online"
                            : e.format === "HYBRID"
                              ? "Hybrid"
                              : "In person"}
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
                        {spotsLeft != null && !isPast && (
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-sand-500" />
                            {spotsLeft > 0
                              ? `${spotsLeft} spots left`
                              : "Fully booked"}
                          </div>
                        )}
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
