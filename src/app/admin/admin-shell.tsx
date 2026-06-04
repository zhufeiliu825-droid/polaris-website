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
    <div className="min-h-screen bg-navy-50 flex">
      <AdminSidebar />
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
