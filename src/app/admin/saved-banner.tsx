"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Check, X } from "lucide-react";

/**
 * Green "Changes saved" toast shown after a server action completes.
 *
 * It dismisses itself after 3.5s and also clears the `?saved=1` query
 * param from the URL so a refresh / re-render later doesn't replay
 * a stale "Saved" message. The user can also dismiss manually.
 *
 * Rendered only when the page's `?saved=1` param is present, so the
 * component starts visible and decays from there.
 */
export function SavedBanner() {
  const router = useRouter();
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(false);
      // Drop the ?saved=1 from the URL without adding a history entry,
      // so back-button doesn't ping-pong through the saved state.
      router.replace(pathname, { scroll: false });
    }, 3500);
    return () => clearTimeout(t);
  }, [router, pathname]);

  if (!visible) return null;
  return (
    <div className="mb-6 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-800 flex items-center gap-3">
      <Check className="h-4 w-4 shrink-0" />
      <span className="flex-1">Changes saved.</span>
      <button
        type="button"
        onClick={() => {
          setVisible(false);
          router.replace(pathname, { scroll: false });
        }}
        aria-label="Dismiss"
        className="text-green-700 hover:text-green-900"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
