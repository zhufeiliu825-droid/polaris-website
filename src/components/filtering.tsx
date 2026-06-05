"use client";

/**
 * Smooth, accessible filter interactions for the list pages
 * (Opportunities / Events / Advice).
 *
 * Two layers of feedback, tuned to avoid flicker:
 *
 * 1. Per-pill spinner — the clicked pill shows a tiny spinner *immediately*
 *    on click (synchronous), so every click registers instantly regardless
 *    of server speed.
 *
 * 2. Results overlay — the results dim + an "Updating…" pill appears only
 *    if the navigation is actually slow:
 *      - delay-before-show (SHOW_DELAY): fast navigations (< ~140ms) never
 *        show the overlay at all → no jarring flash.
 *      - minimum-visible (MIN_VISIBLE): once shown, it stays long enough to
 *        read instead of blinking out.
 */

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useTransition,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const SHOW_DELAY = 140; // ms a transition must run before the overlay appears
const MIN_VISIBLE = 400; // ms the overlay stays once it has appeared

type Ctx = {
  overlay: boolean; // debounced "results are updating" state for the overlay
  pendingHref: string | null; // which pill was clicked (instant)
  navigate: (href: string) => void;
};

const FilterCtx = createContext<Ctx>({
  overlay: false,
  pendingHref: null,
  navigate: () => {},
});

export function FilteringProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const [overlay, setOverlay] = useState(false);
  const shownAt = useRef(0);

  // Debounce the overlay: show only after SHOW_DELAY, hide only after the
  // remaining MIN_VISIBLE has elapsed.
  useEffect(() => {
    let showTimer: ReturnType<typeof setTimeout> | undefined;
    let hideTimer: ReturnType<typeof setTimeout> | undefined;
    if (pending) {
      showTimer = setTimeout(() => {
        shownAt.current = Date.now();
        setOverlay(true);
      }, SHOW_DELAY);
    } else {
      // Transition finished. Clear the clicked-pill marker, and if the overlay
      // is currently visible keep it for the rest of its minimum duration.
      setPendingHref(null);
      setOverlay((isShown) => {
        if (!isShown) return false;
        const remaining = Math.max(0, MIN_VISIBLE - (Date.now() - shownAt.current));
        hideTimer = setTimeout(() => setOverlay(false), remaining);
        return true; // stay shown until hideTimer fires
      });
    }
    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [pending]);

  const navigate = (href: string) => {
    setPendingHref(href); // instant per-pill feedback
    startTransition(() => {
      router.push(href, { scroll: false });
    });
  };

  return (
    <FilterCtx.Provider value={{ overlay, pendingHref, navigate }}>
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
  const { pendingHref, navigate } = useContext(FilterCtx);
  const isLoading = pendingHref === href;
  return (
    <a
      href={href}
      aria-current={active ? "page" : undefined}
      aria-busy={isLoading || undefined}
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
      {isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin shrink-0" />}
    </a>
  );
}

/**
 * Wrap the results region. Dims + marks aria-busy while a filter navigation
 * is in flight (debounced), and shows a small inline spinner.
 */
export function FilterResults({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const { overlay } = useContext(FilterCtx);
  return (
    <div
      aria-busy={overlay}
      className={cn("relative transition-opacity duration-200", className)}
    >
      <div className={overlay ? "opacity-40 pointer-events-none" : undefined}>
        {children}
      </div>
      {overlay && (
        <div className="pointer-events-none absolute inset-x-0 top-2 flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-navy-950 text-white text-xs font-medium px-3 py-1.5 shadow-lg">
            <Loader2 className="h-3.5 w-3.5 animate-spin" /> Updating…
          </span>
        </div>
      )}
    </div>
  );
}
