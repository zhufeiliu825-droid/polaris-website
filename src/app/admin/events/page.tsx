import Link from "next/link";
import { Plus, Calendar, MapPin, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/db";

export const metadata = { title: "Admin · Events" };

export default async function AdminEventsPage() {
  const events = await prisma.event.findMany({
    orderBy: { startsAt: "desc" },
  });
  const upcoming = events.filter((e) => e.startsAt > new Date()).length;

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
      <div className="flex items-baseline justify-between mb-8 flex-wrap gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-sand-700 font-semibold">
            Events
          </p>
          <h1 className="mt-2 text-3xl font-light tracking-tight text-navy-950">
            Workshops, talks and panels
          </h1>
        </div>
        <Link
          href="/admin/events/new"
          className="inline-flex items-center gap-2 h-10 px-5 rounded-full bg-navy-950 text-white text-sm font-medium hover:bg-navy-800"
        >
          <Plus className="h-4 w-4" /> Create event
        </Link>
      </div>

      {/* Mobile: stacked cards (the table doesn't fit a phone) */}
      <div className="md:hidden space-y-3">
        {events.length === 0 ? (
          <div className="bg-white rounded-2xl border border-navy-100 px-5 py-10 text-center text-sm text-navy-500">
            No events yet —{" "}
            <Link href="/admin/events/new" className="underline">
              create your first one
            </Link>
            .
          </div>
        ) : (
          events.map((e) => (
            <Link
              key={e.id}
              href={`/admin/events/${e.id}`}
              className="block bg-white rounded-2xl border border-navy-100 p-4 active:bg-navy-50"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="font-medium text-navy-950">{e.title}</p>
                <PublishedPill published={e.published} />
              </div>
              <p className="mt-1 text-xs text-navy-500 line-clamp-2">{e.excerpt}</p>
              <div className="mt-3 flex items-center gap-x-4 gap-y-1 flex-wrap text-xs text-navy-600">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-sand-500" />
                  {e.startsAt.toLocaleString("en-GB", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-sand-500" />
                  {e.format === "ONLINE" ? "Online" : "In person"}
                </span>
              </div>
            </Link>
          ))
        )}
      </div>

      {/* Desktop: full table */}
      <div className="hidden md:block bg-white rounded-2xl border border-navy-100 overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="bg-navy-50 text-xs uppercase tracking-widest text-navy-700">
            <tr>
              <th className="text-left font-semibold px-5 py-3">Event</th>
              <th className="text-left font-semibold px-5 py-3">When</th>
              <th className="text-left font-semibold px-5 py-3">Format</th>
              <th className="text-left font-semibold px-5 py-3">Status</th>
              <th className="w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-navy-100">
            {events.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center text-navy-500">
                  No events yet —{" "}
                  <Link href="/admin/events/new" className="underline">
                    create your first one
                  </Link>
                  .
                </td>
              </tr>
            ) : (
              events.map((e) => (
                <tr key={e.id} className="hover:bg-navy-50/60 transition-colors">
                  <td className="px-5 py-4">
                    <Link href={`/admin/events/${e.id}`} className="block">
                      <p className="font-medium text-navy-950">{e.title}</p>
                      <p className="text-xs text-navy-500 truncate max-w-md">
                        {e.excerpt}
                      </p>
                    </Link>
                  </td>
                  <td className="px-5 py-4 text-navy-700 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-sand-500" />
                      {e.startsAt.toLocaleString("en-GB", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="inline-flex items-center gap-1.5 text-xs">
                      <MapPin className="h-3.5 w-3.5 text-sand-500" />
                      <span className="text-navy-700">
                        {e.format === "ONLINE" ? "Online" : "In person"}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <PublishedPill published={e.published} />
                  </td>
                  <td className="px-5 py-4 text-navy-400">
                    <Link
                      href={`/admin/events/${e.id}`}
                      className="inline-flex items-center"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {events.length > 0 && (
        <p className="mt-4 text-sm text-navy-600">
          {upcoming} upcoming · {events.length - upcoming} past
        </p>
      )}
    </div>
  );
}

export function PublishedPill({ published }: { published: boolean }) {
  return published ? (
    <span className="text-[10px] uppercase tracking-widest font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
      Published
    </span>
  ) : (
    <span className="text-[10px] uppercase tracking-widest font-semibold px-2.5 py-1 rounded-full bg-navy-100 text-navy-700">
      Draft
    </span>
  );
}
