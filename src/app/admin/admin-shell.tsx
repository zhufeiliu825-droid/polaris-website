"use client";

import { usePathname } from "next/navigation";
import { AdminSidebar } from "./admin-sidebar";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";
  // /admin/login renders standalone (no sidebar)
  if (pathname.startsWith("/admin/login")) {
    return <>{children}</>;
  }
  return (
    <div className="min-h-screen bg-navy-50">
      <AdminSidebar />
      {/* On desktop the sidebar is fixed at 240px, so pad the content to clear
          it. On mobile the sidebar collapses to a sticky top bar (in flow), so
          the content is full-width below it. */}
      <div className="md:pl-60 min-w-0">{children}</div>
    </div>
  );
}
