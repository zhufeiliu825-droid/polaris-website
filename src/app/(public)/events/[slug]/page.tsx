import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, MapPin, Users, Globe2, Tag } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Markdown } from "@/components/markdown";
import { prisma } from "@/lib/db";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const e = await prisma.event.findUnique({ where: { slug } });
  if (!e || !e.published) return { title: "Event not found" };
  return { title: e.title, description: e.excerpt };
}

export default async function EventDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const e = await prisma.event.findUnique({
    where: { slug },
    include: { _count: { select: { registrations: true } } },
  });
  if (!e || !e.published) notFound();

  const isOnline = e.format === "ONLINE";
  const isPast = e.endsAt < new Date();
  const dateLong = e.startsAt.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const timeFmt = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const time = `${timeFmt.format(e.startsAt)}–${timeFmt.format(e.endsAt)}`;
  const spotsLeft =
    e.capacity != null ? Math.max(0, e.capacity - e._count.registrations) : null;

  return (
    <article className="bg-paper">
      <header className="bg-navy-950 text-white py-16 md:py-20">
        <Container>
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-sm text-navy-200 hover:text-white mb-6"
          >
            <ArrowLeft className="h-4 w-4" /> All events
          </Link>
          <div className="flex items-center gap-2 flex-wrap mb-5">
            <span
              className={
                isOnline
                  ? "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-royal-500/20 text-royal-100 text-xs font-medium"
                  : "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sand-100 text-sand-700 text-xs font-medium"
              }
            >
              {isOnline ? <Globe2 className="h-3.5 w-3.5" /> : <MapPin className="h-3.5 w-3.5" />}
              {isOnline ? "Online" : e.format === "HYBRID" ? "Hybrid" : "In person"}
            </span>
            {e.sector && (
              <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-sand-300 font-semibold">
                <Tag className="h-3 w-3" />
                {e.sector}
              </span>
            )}
          </div>
          <h1 className="text-3xl md:text-5xl font-light tracking-tight leading-tight max-w-3xl">
            {e.title}
          </h1>
          <p className="mt-5 text-lg text-navy-100 max-w-2xl">{e.excerpt}</p>
        </Container>
      </header>

      <section className="py-12 md:py-16">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10">
            <div>
              <Markdown
                markdown={e.body}
                className="prose-polaris text-navy-800"
              />
            </div>

            <aside className="lg:sticky lg:top-6 self-start space-y-4">
              <div className="bg-white border border-navy-100 rounded-2xl p-6 space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-sand-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-navy-950">{dateLong}</p>
                    <p className="text-navy-600">{time}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-sand-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-navy-950">
                      {isOnline ? "Online" : "In person"}
                    </p>
                    <p className="text-navy-600">{e.location}</p>
                  </div>
                </div>
                {spotsLeft != null && !isPast && (
                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-sand-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-navy-950">
                        {spotsLeft > 0
                          ? `${spotsLeft} of ${e.capacity} spots left`
                          : "Fully booked"}
                      </p>
                    </div>
                  </div>
                )}
                {/* Past events: surface a small "This event has ended" note
                    instead of a now-pointless registration CTA. */}
                {isPast ? (
                  <div className="pt-2 text-sm text-navy-500 text-center bg-navy-50 rounded-lg py-3">
                    This event has ended.
                  </div>
                ) : (
                  <div className="pt-2">
                    {e.registrationUrl ? (
                      <a
                        href={e.registrationUrl}
                        target="_blank"
                        rel="noopener"
                        className="w-full inline-flex items-center justify-center gap-2 h-11 px-5 rounded-full bg-navy-950 text-white text-sm font-medium hover:bg-navy-800"
                      >
                        Register
                      </a>
                    ) : (
                      <Link
                        href="/contact"
                        className="w-full inline-flex items-center justify-center gap-2 h-11 px-5 rounded-full bg-navy-950 text-white text-sm font-medium hover:bg-navy-800"
                      >
                        Register interest
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </aside>
          </div>
        </Container>
      </section>
    </article>
  );
}
