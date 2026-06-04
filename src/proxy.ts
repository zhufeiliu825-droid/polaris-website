/**
 * Auth gate for the admin portal (formerly middleware.ts).
 *
 * Next.js 16 renamed `middleware.ts` → `proxy.ts` and `export middleware`
 * → `export proxy`. Functionally identical: the matcher in `config` decides
 * which requests this runs on.
 *
 * Any request to /admin/* (except /admin/login) requires a valid signed
 * session cookie. Verification is HMAC-only — no DB call — so it's cheap.
 */

import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin/login")) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
    const session = verifySessionToken(token);
    if (!session) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
  // `runtime` is not configurable in proxy.ts — Next 16 always runs proxy on
  // Node.js, which is exactly what we need for node:crypto + bcrypt.
};
