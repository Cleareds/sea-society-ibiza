import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { defaultLocale, isLocale, locales } from "@/lib/i18n/config";

const ADMIN_COOKIE = "ssi-dev-admin";

function adminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

// Paths that should never be touched by locale routing
function isExcludedPath(pathname: string): boolean {
  return (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/admin") ||
    pathname === "/favicon.svg" ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname.startsWith("/images/") ||
    pathname.startsWith("/fonts/") ||
    pathname.startsWith("/og/")
  );
}

// Locale block — must run before admin routing so /admin/* falls through cleanly.
function handleLocale(request: NextRequest): NextResponse | null {
  const { pathname, search } = request.nextUrl;
  if (isExcludedPath(pathname)) return null;

  const firstSeg = pathname.split("/")[1] ?? "";

  // /en or /en/foo → redirect to /foo (canonical EN at the bare path)
  if (firstSeg === defaultLocale) {
    const rest = pathname.slice(`/${defaultLocale}`.length) || "/";
    const url = request.nextUrl.clone();
    url.pathname = rest;
    return NextResponse.redirect(url, 308);
  }

  // /nl/foo, /fr/foo, … — pass through (real route under [locale])
  if (isLocale(firstSeg)) return null;

  // Bare / or /foo with no locale prefix → rewrite (silently) to /en/foo
  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Admin gate (unchanged)
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login" || pathname === "/admin/auth/callback") {
      return NextResponse.next();
    }
    const { response, user } = await updateSession(request);
    if (user) {
      const allowed = adminEmails();
      if (allowed.length === 0 || allowed.includes((user.email ?? "").toLowerCase())) {
        return response;
      }
      return NextResponse.redirect(new URL("/admin/login?error=unauthorized", request.url));
    }
    if (
      process.env.NODE_ENV !== "production" &&
      request.cookies.get(ADMIN_COOKIE)?.value === "1"
    ) {
      return response;
    }
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  // 2. Locale handling for everything else
  const locResponse = handleLocale(request);
  if (locResponse) return locResponse;

  return NextResponse.next();
}

// Run on every request — locale logic needs the path. The internal filter in
// isExcludedPath() keeps next-internal + static paths free.
export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
