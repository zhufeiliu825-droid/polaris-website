/**
 * Filter UI helpers for the list pages (Opportunities / Events / Advice).
 *
 * Deliberately minimal and JS-free: a filter pill is just a Next <Link> with
 * scroll={false} (so changing a filter doesn't jump back to the hero). Next's
 * built-in navigation transition keeps the current results on screen until the
 * new ones are ready — an instant-feeling swap with no spinner or dimming,
 * which tested better than the custom loading overlay.
 *
 * FilteringProvider / FilterResults are passthroughs, kept so the pages don't
 * need restructuring if we ever reintroduce shared filter state.
 */

import Link from "next/link";
import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function FilteringProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export function FilterPill({
  href,
  active,
  className,
  children,
}: {
  href: string;
  active: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      scroll={false}
      aria-current={active ? "page" : undefined}
      className={cn(
        "inline-flex items-center gap-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-700/40 focus-visible:ring-offset-1",
        className
      )}
    >
      {children}
    </Link>
  );
}

export function FilterResults({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}
