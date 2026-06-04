"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Calendar, BookOpen, LogOut } from "lucide-react";
import { Logo } from "@/components/logo";

const nav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/applications", label: "Applications", icon: Users },
  { href: "/admin/events", label: "Events", icon: Calendar },
  { href: "/admin/advice", label: "Advice", icon: BookOpen },
];

export function AdminSidebar() {
  const pathname = usePathname() ?? "/admin";

  return (
    <aside className="w-60 bg-navy-950 text-white flex flex-col shrink-0 sticky top-0 h-screen">
      <div className="p-6 border-b border-white/10">
        <Link href="/admin" className="inline-flex">
          <Logo variant="white" height={28} />
        </Link>
        <p className="mt-3 text-[10px] uppercase tracking-widest text-sand-300 font-semibold">
          Staff portal
        </p>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {nav.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors " +
                (active
                  ? "bg-white/10 text-white"
                  : "text-navy-200 hover:bg-white/5 hover:text-white")
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-white/10 space-y-2">
        <div className="px-3 py-2 text-xs text-navy-300">
          Signed in as
          <div className="text-white text-sm font-medium">staff@polaris</div>
        </div>
        <Link
          href="/admin/login?signout=1"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-navy-200 hover:bg-white/5 hover:text-white"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </Link>
        <Link
          href="/"
          className="block px-3 py-2 text-xs text-navy-300 hover:text-white"
        >
          ← View public site
        </Link>
      </div>
    </aside>
  );
}
