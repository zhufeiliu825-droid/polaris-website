"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Calendar,
  BookOpen,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { Logo } from "@/components/logo";

const nav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/applications", label: "Applications", icon: Users },
  { href: "/admin/events", label: "Events", icon: Calendar },
  { href: "/admin/advice", label: "Advice", icon: BookOpen },
];

export function AdminSidebar() {
  const pathname = usePathname() ?? "/admin";
  const [open, setOpen] = useState(false);

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll while the drawer is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      {/* Mobile top bar (hidden on desktop) */}
      <header className="md:hidden sticky top-0 z-30 flex items-center justify-between h-14 px-4 bg-navy-950 text-white">
        <Link href="/admin" className="inline-flex items-center">
          <Logo variant="white" height={24} />
        </Link>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          aria-expanded={open}
          className="-mr-2 inline-flex h-10 w-10 items-center justify-center rounded-lg hover:bg-white/10"
        >
          <Menu className="h-5 w-5" />
        </button>
      </header>

      {/* Desktop sidebar — fixed full-height rail */}
      <aside className="hidden md:flex fixed inset-y-0 left-0 z-30 w-60 flex-col bg-navy-950 text-white">
        <SidebarBody pathname={pathname} />
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden fixed inset-0 z-50">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="absolute inset-0 h-full w-full bg-navy-950/60 backdrop-blur-sm"
          />
          <aside className="absolute inset-y-0 left-0 flex w-64 max-w-[82%] flex-col bg-navy-950 text-white shadow-2xl animate-step-in">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="absolute right-3 top-4 inline-flex h-9 w-9 items-center justify-center rounded-lg text-navy-200 hover:bg-white/10"
            >
              <X className="h-5 w-5" />
            </button>
            <SidebarBody pathname={pathname} onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      )}
    </>
  );
}

function SidebarBody({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <>
      <div className="p-6 border-b border-white/10">
        <Link href="/admin" onClick={onNavigate} className="inline-flex">
          <Logo variant="white" height={28} />
        </Link>
        <p className="mt-3 text-[10px] uppercase tracking-widest text-sand-300 font-semibold">
          Staff portal
        </p>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {nav.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
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
          <div className="text-white text-sm font-medium">polarisadmin</div>
        </div>
        <Link
          href="/admin/login?signout=1"
          onClick={onNavigate}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-navy-200 hover:bg-white/5 hover:text-white"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </Link>
        <Link
          href="/"
          onClick={onNavigate}
          className="block px-3 py-2 text-xs text-navy-300 hover:text-white"
        >
          ← View public site
        </Link>
      </div>
    </>
  );
}
