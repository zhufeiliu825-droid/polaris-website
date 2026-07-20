"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";

/**
 * Live job search. Types-as-you-search: keystrokes are debounced ~300ms and
 * pushed into the URL (?q=), which re-renders the server list — no Enter
 * needed. Enter still works (flushes immediately), and without JS the plain
 * GET form submits as before. A ✕ button clears the query in one tap.
 */
export function JobSearch({
  initialQuery,
  sector,
  city,
}: {
  initialQuery: string;
  sector?: string;
  city?: string;
}) {
  const router = useRouter();
  const [value, setValue] = useState(initialQuery);
  const inputRef = useRef<HTMLInputElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // IME (e.g. Chinese pinyin) composition: don't fire half-composed searches.
  const composing = useRef(false);
  // Mirror of `value` for the document-level click listener below.
  const valueRef = useRef(value);
  valueRef.current = value;

  // If the URL's q changes from elsewhere ("Clear all filters"), sync the box —
  // but never clobber what the user is actively typing.
  useEffect(() => {
    if (document.activeElement !== inputRef.current) setValue(initialQuery);
  }, [initialQuery]);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    []
  );

  // The sector/city pills and pagination links are server-rendered, so their
  // hrefs carry the q that existed at render time. If the user types and then
  // clicks one inside the debounce window, that stale href would drop the
  // fresh query. Intercept list-page link clicks and merge the CURRENT input
  // value in. ("Clear all filters" opts out via data-clear-filters.)
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      )
        return;
      const a = (e.target as Element).closest?.("a");
      if (!a) return;
      if (a.hasAttribute("data-clear-filters")) {
        // Clear-all wipes the query too — empty the box regardless of focus
        // and let the link navigate normally.
        if (timer.current) clearTimeout(timer.current);
        setValue("");
        return;
      }
      const url = new URL(a.getAttribute("href") ?? "", location.origin);
      if (url.origin !== location.origin || url.pathname !== "/opportunities")
        return;
      const qq = valueRef.current.trim();
      if ((url.searchParams.get("q") ?? "") === qq) return; // already in sync
      e.preventDefault();
      if (timer.current) clearTimeout(timer.current);
      if (qq) url.searchParams.set("q", qq);
      else url.searchParams.delete("q");
      router.push(
        url.pathname + (url.search || "") + url.hash,
        url.hash ? undefined : { scroll: false }
      );
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [router]);

  const navigate = (q: string) => {
    const p = new URLSearchParams();
    if (sector) p.set("sector", sector);
    if (city) p.set("city", city);
    const qq = q.trim();
    if (qq) p.set("q", qq);
    const s = p.toString();
    router.replace(s ? `/opportunities?${s}` : "/opportunities", {
      scroll: false,
    });
  };

  const schedule = (q: string) => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => navigate(q), 300);
  };

  const flush = (q: string) => {
    if (timer.current) clearTimeout(timer.current);
    navigate(q);
  };

  return (
    <form
      action="/opportunities"
      method="get"
      className="max-w-md"
      onSubmit={(e) => {
        e.preventDefault();
        flush(value);
      }}
    >
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-navy-400" />
        <input
          ref={inputRef}
          name="q"
          type="search"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (!composing.current) schedule(e.target.value);
          }}
          onCompositionStart={() => {
            composing.current = true;
          }}
          onCompositionEnd={(e) => {
            composing.current = false;
            schedule(e.currentTarget.value);
          }}
          aria-label="Search opportunities by title or employer"
          placeholder="Search title or employer…"
          autoComplete="off"
          className="w-full h-11 pl-9 pr-10 rounded-full border border-navy-200 text-sm field-focus focus:outline-none focus:border-navy-900 [&::-webkit-search-cancel-button]:hidden"
        />
        {value && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => {
              setValue("");
              flush("");
              inputRef.current?.focus();
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 inline-flex items-center justify-center rounded-full text-navy-400 hover:text-navy-900 hover:bg-navy-50"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      {sector && <input type="hidden" name="sector" value={sector} />}
      {city && <input type="hidden" name="city" value={city} />}
    </form>
  );
}
