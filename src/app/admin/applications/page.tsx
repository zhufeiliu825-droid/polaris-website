import Link from "next/link";
import { Search, Download, Filter, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/db";
import { StatusPill } from "../page";
import type { ApplicationStatus, Prisma } from "@prisma/client";

export const metadata = { title: "Admin · Applications" };

const STATUS_TABS = ["All", "NEW", "CONTACTED", "IN_PROGRESS", "WON", "LOST"] as const;

export default async function AdminApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const sp = await searchParams;
  const status = sp.status ?? "All";
  const q = (sp.q ?? "").trim();

  const where: Prisma.ApplicationWhereInput = {};
  if (status !== "All") where.status = status as ApplicationStatus;
  if (q) {
    where.OR = [
      { firstName: { contains: q, mode: "insensitive" } },
      { lastName: { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
      { university: { contains: q, mode: "insensitive" } },
      { course: { contains: q, mode: "insensitive" } },
    ];
  }

  const [rows, counts] = await Promise.all([
    prisma.application.findMany({
      where,
      orderBy: { createdAt: "desc" },
    }),
    prisma.application.groupBy({
      by: ["status"],
      _count: { _all: true },
    }),
  ]);

  const countByStatus: Record<string, number> = { All: 0 };
  for (const c of counts) {
    countByStatus[c.status] = c._count._all;
    countByStatus.All += c._count._all;
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
      <div className="flex items-baseline justify-between mb-8 flex-wrap gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-sand-700 font-semibold">
            Applications
          </p>
          <h1 className="mt-2 text-3xl font-light tracking-tight text-navy-950">
            All form submissions
          </h1>
        </div>
        <a
          href={
            "/admin/applications/export" +
            (() => {
              const p = new URLSearchParams();
              if (status !== "All") p.set("status", status);
              if (q) p.set("q", q);
              const s = p.toString();
              return s ? `?${s}` : "";
            })()
          }
          className="inline-flex items-center gap-2 h-10 px-4 rounded-full border border-navy-200 bg-white text-sm font-medium hover:bg-navy-50"
        >
          <Download className="h-4 w-4" /> Export CSV
        </a>
      </div>

      <form action="/admin/applications" className="flex gap-3 mb-6 flex-wrap">
        <div className="relative flex-1 min-w-[260px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-navy-400" />
          <input
            type="search"
            name="q"
            defaultValue={sp.q ?? ""}
            placeholder="Search name, email, university or course…"
            className="w-full h-10 pl-9 pr-4 rounded-full border border-navy-200 text-sm field-focus focus:outline-none focus:border-navy-900 bg-white"
          />
        </div>
        {status !== "All" && (
          <input type="hidden" name="status" value={status} />
        )}
      </form>

      <div className="flex items-center gap-2 mb-6 flex-wrap">
        <Filter className="h-3.5 w-3.5 text-navy-500" />
        {STATUS_TABS.map((t) => {
          const href =
            t === "All"
              ? "/admin/applications" + (q ? `?q=${encodeURIComponent(q)}` : "")
              : `/admin/applications?status=${t}` +
                (q ? `&q=${encodeURIComponent(q)}` : "");
          const active = status === t;
          return (
            <Link
              key={t}
              href={href}
              className={
                "h-8 inline-flex items-center gap-1.5 px-3 rounded-full text-xs font-medium tracking-wide transition-colors " +
                (active
                  ? "bg-navy-950 text-white"
                  : "bg-white border border-navy-200 text-navy-700 hover:bg-navy-50")
              }
            >
              <span>{t.replace("_", " ")}</span>
              <span className={active ? "text-sand-300" : "text-navy-500"}>
                {countByStatus[t] ?? 0}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Mobile: stacked cards — a 6-column table can't fit a phone, so on
          small screens each application renders as a tap-through card. */}
      <div className="md:hidden space-y-3">
        {rows.length === 0 ? (
          <div className="bg-white rounded-2xl border border-navy-100 px-5 py-10 text-center text-sm text-navy-500">
            No applications match.
          </div>
        ) : (
          rows.map((a) => (
            <Link
              key={a.id}
              href={`/admin/applications/${a.id}`}
              className="block bg-white rounded-2xl border border-navy-100 p-4 active:bg-navy-50"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium text-navy-950 truncate">
                    {a.firstName} {a.lastName}
                  </p>
                  <p className="text-xs text-navy-500 truncate">{a.email}</p>
                </div>
                <StatusPill status={a.status} />
              </div>
              {(a.university || a.course) && (
                <div className="mt-3 text-sm text-navy-700">
                  {a.university && <div className="truncate">{a.university}</div>}
                  {a.course && (
                    <div className="text-xs text-navy-500 truncate">{a.course}</div>
                  )}
                </div>
              )}
              {a.targetSectors.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {a.targetSectors.map((s) => (
                    <span
                      key={s}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-navy-100 text-navy-700"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              )}
              <div className="mt-3 flex items-center justify-between gap-3 text-xs text-navy-500">
                <span className="truncate">{a.programme ?? "—"}</span>
                <span className="shrink-0">
                  {a.createdAt.toLocaleDateString("en-GB", { dateStyle: "medium" })}
                </span>
              </div>
            </Link>
          ))
        )}
      </div>

      {/* Desktop: full table */}
      <div className="hidden md:block bg-white rounded-2xl border border-navy-100 overflow-x-auto">
        <table className="w-full min-w-[820px] text-sm">
          <thead className="bg-navy-50 text-xs uppercase tracking-widest text-navy-700">
            <tr>
              <th className="text-left font-semibold px-5 py-3">Name</th>
              <th className="text-left font-semibold px-5 py-3">Education</th>
              <th className="text-left font-semibold px-5 py-3">Sectors</th>
              <th className="text-left font-semibold px-5 py-3">Programme</th>
              <th className="text-left font-semibold px-5 py-3">Status</th>
              <th className="text-left font-semibold px-5 py-3">Received</th>
              <th className="w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-navy-100">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-12 text-center text-navy-500">
                  No applications match.
                </td>
              </tr>
            ) : (
              rows.map((a) => (
                <tr key={a.id} className="hover:bg-navy-50/60 transition-colors">
                  <td className="px-5 py-4">
                    <Link href={`/admin/applications/${a.id}`} className="block">
                      <div className="font-medium text-navy-950">
                        {a.firstName} {a.lastName}
                      </div>
                      <div className="text-xs text-navy-500">{a.email}</div>
                    </Link>
                  </td>
                  <td className="px-5 py-4 text-navy-700">
                    <div>{a.university}</div>
                    <div className="text-xs text-navy-500">{a.course}</div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-1">
                      {a.targetSectors.map((s) => (
                        <span
                          key={s}
                          className="text-[10px] px-2 py-0.5 rounded-full bg-navy-100 text-navy-700"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-navy-700">
                    <div className="text-sm">{a.programme ?? "—"}</div>
                    {a.assignedTo && (
                      <div className="text-xs text-navy-500">
                        Owner: {a.assignedTo.split("@")[0]}
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <StatusPill status={a.status} />
                  </td>
                  <td className="px-5 py-4 text-xs text-navy-500">
                    {a.createdAt.toLocaleString("en-GB", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </td>
                  <td className="px-5 py-4 text-navy-400">
                    <Link
                      href={`/admin/applications/${a.id}`}
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
    </div>
  );
}
