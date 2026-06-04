import Link from "next/link";
import { Calendar, MapPin, Users, ArrowRight, Globe2 } from "lucide-react";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/page-hero";
import { mockEvents } from "@/lib/data/mock";

export const metadata = { title: "Events" };

export default function EventsPage() {
  return (
    <>
      <PageHero
        eyebrow="Events"
        title="Workshops, talks and panels — live with industry insiders."
        subtitle="Online webinars and in-person events at our London office. All free for Polaris members."
      />

      <section className="py-16 bg-paper">
        <Container>
          <div className="flex gap-3 flex-wrap mb-10">
            {["All", "Online", "In person", "This month"].map((t, i) => (
              <button
                key={t}
                className={
                  i === 0
                    ? "h-10 px-5 rounded-full bg-navy-950 text-white text-sm font-medium"
                    : "h-10 px-5 rounded-full bg-white border border-navy-200 text-sm font-medium text-navy-700 hover:bg-navy-50"
                }
              >
                {t}
              </button>
            ))}
          </div>

          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockEvents.map((e) => (
              <li key={e.id}>
                <Link
                  href={`/events/${e.id}`}
                  className="group flex flex-col h-full bg-white border border-navy-100 rounded-2xl p-7 hover:border-navy-900 hover:shadow-lg transition-all"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={
                        e.format === "Online"
                          ? "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-royal-500/10 text-royal-600 text-xs font-medium"
                          : "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sand-100 text-sand-700 text-xs font-medium"
                      }
                    >
                      {e.format === "Online" ? (
                        <Globe2 className="h-3.5 w-3.5" />
                      ) : (
                        <MapPin className="h-3.5 w-3.5" />
                      )}
                      {e.format}
                    </span>
                    <span className="text-xs uppercase tracking-widest text-navy-400 font-semibold">
                      {e.sector}
                    </span>
                  </div>

                  <h3 className="mt-5 text-xl font-medium text-navy-950 tracking-tight group-hover:text-navy-700 leading-snug">
                    {e.title}
                  </h3>
                  <p className="mt-3 text-sm text-navy-600 leading-relaxed line-clamp-3">
                    {e.description}
                  </p>

                  <div className="mt-6 pt-5 border-t border-navy-100 space-y-2 text-sm text-navy-700">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-sand-500" />
                      {e.date} · {e.time}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-sand-500" />
                      {e.location}
                    </div>
                    {e.spotsLeft !== undefined && (
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-sand-500" />
                        {e.spotsLeft} spots left
                      </div>
                    )}
                  </div>

                  <div className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-navy-900 group-hover:gap-2.5 transition-all">
                    Register <ArrowRight className="h-4 w-4" />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </>
  );
}
