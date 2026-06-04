import Link from "next/link";
import { Users, Calendar, BookOpen, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/db";

export const metadata = { title: "Admin · Dashboard" };

export default async function AdminHomePage() {
  const [
    apps,
    newApps,
    events,
    publishedEvents,
    articles,
    publishedArticles,
    recent,
  ] = await Promise.all([
    prisma.application.count(),
    prisma.application.count({ where: { status: "NEW" } }),
    prisma.event.count(),
    prisma.event.count({ where: { published: true } }),
    prisma.article.count(),
    prisma.article.count({ where: { published: true } }),
    prisma.application.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  const tiles = [
    {
      href: "/admin/applications",
      icon: Users,
      title: "Applications",
      count: String(apps),
      sub: `${newApps} new · awaiting first contact`,
      accent: newApps > 0 ? "text-sand-700" : "text-navy-400",
    },
    {
      href: "/admin/events",
      icon: Calendar,
      title: "Events",
      count: String(events),
      sub: `${publishedEvents} published · ${events - publishedEvents} draft`,
      accent: "text-navy-400",
    },
    {
      href: "/admin/advice",
      icon: BookOpen,
      title: "Advice articles",
      count: String(articles),
      sub: `${publishedArticles} published · ${articles - publishedArticles} draft`,
      accent: "text-navy-400",
    },
  ];

  return (
    <div className="px-8 py-10">
      <div className="flex items-baseline justify-between mb-10">
        <div>
          <p className="text-xs uppercase tracking-widest text-sand-700 font-semibold">
            Admin
          </p>
          <h1 className="mt-2 text-3xl font-light tracking-tight text-navy-950">
            Welcome back.
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {tiles.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className="group bg-white rounded-2xl p-6 border border-navy-100 hover:border-navy-900 hover:shadow-md transition-all flex flex-col"
          >
            <div className="flex items-center justify-between">
              <div className="h-11 w-11 rounded-xl bg-navy-50 text-navy-900 flex items-center justify-center">
                <t.icon className="h-5 w-5" />
              </div>
              <span className="text-3xl font-light text-navy-950">{t.count}</span>
            </div>
            <h3 className="mt-5 text-lg font-medium text-navy-950 tracking-tight">
              {t.title}
            </h3>
            <p className={"mt-1 text-xs " + t.accent}>{t.sub}</p>
            <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-navy-900 group-hover:gap-2.5 transition-all">
              Open <ArrowRight className="h-4 w-4" />
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-10 bg-white rounded-2xl border border-navy-100">
        <div className="p-6 border-b border-navy-100 flex items-center justify-between">
          <h2 className="font-medium text-navy-950 text-lg">
            Recent applications
          </h2>
          <Link
            href="/admin/applications"
            className="text-sm text-navy-600 hover:text-navy-950 inline-flex items-center gap-1"
          >
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        {recent.length === 0 ? (
          <p className="px-6 py-8 text-sm text-navy-500">
            No applications yet — they&apos;ll appear here as people submit the
            form.
          </p>
        ) : (
          <ul className="divide-y divide-navy-100">
            {recent.map((a) => (
              <li key={a.id}>
                <Link
                  href={`/admin/applications/${a.id}`}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-navy-50 transition-colors"
                >
                  <div className="h-10 w-10 rounded-full bg-navy-100 text-navy-700 flex items-center justify-center font-medium text-sm shrink-0">
                    {a.firstName[0]}
                    {a.lastName[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-navy-950">
                      {a.firstName} {a.lastName}
                    </p>
                    <p className="text-sm text-navy-600 truncate">
                      {a.university} · {a.course} · {a.targetSectors.join(", ")}
                    </p>
                  </div>
                  <StatusPill status={a.status} />
                  <span className="text-xs text-navy-500 w-24 text-right shrink-0">
                    {timeAgo(a.createdAt)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    NEW: "bg-sand-100 text-sand-800",
    CONTACTED: "bg-royal-500/10 text-royal-600",
    IN_PROGRESS: "bg-navy-100 text-navy-800",
    WON: "bg-emerald-100 text-emerald-800",
    LOST: "bg-navy-50 text-navy-500",
  };
  return (
    <span
      className={
        "text-[10px] uppercase tracking-widest font-semibold px-2.5 py-1 rounded-full " +
        (map[status] ?? "bg-navy-100 text-navy-700")
      }
    >
      {status.replace("_", " ")}
    </span>
  );
}

function timeAgo(date: Date) {
  const mins = Math.floor((Date.now() - date.getTime()) / 60_000);
  if (mins < 60) return `${mins}m ago`;
  if (mins < 60 * 24) return `${Math.floor(mins / 60)}h ago`;
  return `${Math.floor(mins / 60 / 24)}d ago`;
}
