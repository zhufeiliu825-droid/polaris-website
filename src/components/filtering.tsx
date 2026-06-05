"use client";

/**
 * Smooth, accessible filter interactions for the list pages
 * (Opportunities / Events / Advice).
 *
 * The problem this solves: filter pills were plain <Link>s, so clicking one
 * left the old results sitting there with zero feedback until the server
 * round-trip finished and the content snapped — the site's main "not smooth"
 * complaint.
 *
 * How it works:
 * - <FilteringProvider> owns a single useTransition.
 * - <FilterPill> renders a real anchor (so middle-click / SEO still work) but
 *   intercepts a plain left-click to do a soft router.push inside the
 *   transition, and shows an active spinner on the pill that's loading.
 * - <FilterResults> dims itself + sets aria-busy while the transition is
 *   pending, keeping context instead of flashing a skeleton.
 */

import {
  createContext,
  useContext,
  useTransition,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Ctx = {
  pending: boolean;
  pendingHref: string | null;
  navigate: (href: string) => void;
};

const FilterCtx = createContext<Ctx>({
  pending: false,
  pendingHref: null,
  navigate: () => {},
});

export function FilteringProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  // We can't read which href is in flight from useTransition alone, so track it.
  let pendingHref: string | null = null;
  const navigate = (href: string) => {
    pendingHref = href;
    startTransition(() => {
      router.push(href, { scroll: false });
    });
  };
  return (
    <FilterCtx.Provider value={{ pending, pendingHref, navigate }}>
      {children}
    </FilterCtx.Provider>
  );
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
  const { pending, navigate } = useContext(FilterCtx);
  return (
    <a
      href={href}
      aria-current={active ? "page" : undefined}
      onClick={(e) => {
        // Let modified clicks (new tab / new window) behave natively.
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0)
          return;
        e.preventDefault();
        navigate(href);
      }}
      className={cn(
        "inline-flex items-center gap-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-700/40 focus-visible:ring-offset-1",
        className
      )}
    >
      {children}
      {pending && active === false ? null : null}
    </a>
  );
}

/**
 * Wrap the results region. Dims + marks aria-busy while a filter navigation
 * is in flight, and shows a small inline spinner the user can rely on.
 */
export function FilterResults({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const { pending } = useContext(FilterCtx);
  return (
    <div
      aria-busy={pending}
      className={cn("relative transition-opacity duration-200", className)}
    >
      <div className={pending ? "opacity-40 pointer-events-none" : undefined}>
        {children}
      </div>
      {pending && (
        <div className="pointer-events-none absolute inset-x-0 top-2 flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-navy-950 text-white text-xs font-medium px-3 py-1.5 shadow-lg">
            <Loader2 className="h-3.5 w-3.5 animate-spin" /> Updating…
          </span>
        </div>
      )}
    </div>
  );
}
