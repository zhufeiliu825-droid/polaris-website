import { AdminShell } from "./admin-shell";

/**
 * The staff portal must never be prerendered or cached.
 *
 * Pages that read the DB via Prisma but touch no request-time API (the
 * dashboard, and the advice/events lists) were being statically prerendered —
 * so their data AND anything time-based (e.g. the "2h ago" stamps, which call
 * Date.now() at render) got frozen into the HTML and only refreshed when a
 * revalidatePath() happened to fire. That's how the dashboard ended up showing
 * a 17-day-old application as "0m ago".
 *
 * This is authenticated, per-request, always-live data, so force dynamic
 * rendering for the whole /admin subtree.
 */
export const dynamic = "force-dynamic";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminShell>{children}</AdminShell>;
}
