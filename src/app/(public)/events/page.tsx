import Link from "next/link";
import { Calendar, MapPin, Users, ArrowRight, Globe2 } from "lucide-react";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/page-hero";
import { prisma } from "@/lib/db";

export const metadata = { title: "Events" };

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

export default async function EventsPage() {
  // Show all published events whose end time hasn't passed.
  const events = await prisma.event.findMany({
    where: {
      published: true,
      endsAt: { gte: new Date() },
    },
    orderBy: { startsAt: "asc" },
    include: {
      _count: { select: { registrations: true } },
    },
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
          {events.length === 0 ? (
            <div className="bg-white border border-navy-100 rounded-2xl p-12 text-center">
              <p className="text-navy-600">
                No events on the calendar right now —{" "}
                <Link href="/join" className="underline">
                  join Polaris
                </Link>{" "}
                and we&apos;ll let you know as soon as the next one drops.
              </p>
            </div>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((e) => {
                const { date, time } = formatEventDateTime(e.startsAt, e.endsAt);
                const isOnline = e.format === "ONLINE";
                const spotsLeft =
                  e.capacity != null
                    ? Math.max(0, e.capacity - e._count.registrations)
                    : null;
                return (
                  <li key={e.id}>
                    <Link
                      href={`/events/${e.slug}`}
                      className="group flex flex-col h-full bg-white border border-navy-100 rounded-2xl p-7 hover:border-navy-900 hover:shadow-lg transition-all"
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
                        {spotsLeft != null && (
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-sand-500" />
                            {spotsLeft > 0
                              ? `${spotsLeft} spots left`
                              : "Fully booked"}
                          </div>
                        )}
                      </div>

                      <div className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-navy-900 group-hover:gap-2.5 transition-all">
                        Details <ArrowRight className="h-4 w-4" />
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
