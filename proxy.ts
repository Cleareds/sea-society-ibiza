import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { defaultLocale, isLocale } from "@/lib/i18n/config";

const ADMIN_COOKIE = "ssi-dev-admin";
const PREVIEW_COOKIE = "ssi-preview";

function adminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

function bypassIps(): string[] {
  return (process.env.MAINTENANCE_BYPASS_IPS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function clientIp(request: NextRequest): string | null {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]?.trim() ?? null;
  return request.headers.get("x-real-ip");
}

// Static-asset extensions we never want touched by locale routing —
// catches /icon-192.png, /favicon.ico, /manifest.webmanifest, etc.
// without needing to enumerate every individual path.
const STATIC_EXT_RE =
  /\.(?:png|jpg|jpeg|webp|avif|svg|ico|gif|woff2?|ttf|otf|eot|css|js|map|mp4|webm|json|webmanifest|txt|xml|pdf)$/i;

// Paths that should never be touched by locale routing
function isExcludedPath(pathname: string): boolean {
  return (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/admin") ||
    pathname === "/maintenance" ||
    pathname.startsWith("/images/") ||
    pathname.startsWith("/brand/") ||
    pathname.startsWith("/fonts/") ||
    pathname.startsWith("/og/") ||
    STATIC_EXT_RE.test(pathname)
  );
}

function resolveLocale(pathname: string): string {
  const seg = pathname.split("/")[1] ?? "";
  return isLocale(seg) ? seg : defaultLocale;
}

/**
 * Lightweight, defence-in-depth security headers. CSP intentionally omitted —
 * we use inline JSON-LD + Next.js inline scripts that would require a nonce
 * pipeline, out of scope for the launch.
 */
function setSecurityHeaders(res: NextResponse): NextResponse {
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set("X-Frame-Options", "SAMEORIGIN");
  res.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  return res;
}

/**
 * Maintenance / coming-soon gate. Active when MAINTENANCE_MODE=true.
 * Three bypass paths:
 *   1. URL contains `?preview=<MAINTENANCE_BYPASS_TOKEN>` — sets a cookie
 *      and redirects to the same URL without the query.
 *   2. The `ssi-preview` cookie matches MAINTENANCE_BYPASS_TOKEN.
 *   3. The client IP appears in MAINTENANCE_BYPASS_IPS.
 *
 * /admin/*, /api/*, /_next/*, static assets and /maintenance itself
 * always pass through.
 */
function handleMaintenance(request: NextRequest): NextResponse | null {
  if (process.env.MAINTENANCE_MODE !== "true") return null;

  const { pathname, searchParams } = request.nextUrl;

  if (
    pathname === "/maintenance" ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/admin") ||
    STATIC_EXT_RE.test(pathname) ||
    pathname.startsWith("/images/") ||
    pathname.startsWith("/brand/") ||
    pathname.startsWith("/fonts/") ||
    pathname.startsWith("/og/")
  ) {
    return null;
  }

  const token = process.env.MAINTENANCE_BYPASS_TOKEN ?? "";

  // 1. Query-string bypass — set cookie, drop the param, redirect clean
  const queryToken = searchParams.get("preview");
  if (token && queryToken === token) {
    const clean = request.nextUrl.clone();
    clean.searchParams.delete("preview");
    const response = NextResponse.redirect(clean, 307);
    response.cookies.set(PREVIEW_COOKIE, token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
    return setSecurityHeaders(response);
  }

  // 2. Cookie bypass
  if (token && request.cookies.get(PREVIEW_COOKIE)?.value === token) return null;

  // 3. IP allowlist
  const ips = bypassIps();
  if (ips.length > 0) {
    const ip = clientIp(request);
    if (ip && ips.includes(ip)) return null;
  }

  // Otherwise: rewrite to the coming-soon page with 503 status
  const url = request.nextUrl.clone();
  url.pathname = "/maintenance";
  url.search = "";
  const response = NextResponse.rewrite(url, { status: 503 });
  // Caches must never serve a stale maintenance copy after the gate flips
  response.headers.set("Cache-Control", "no-store, must-revalidate");
  response.headers.set("Retry-After", "3600");
  return setSecurityHeaders(response);
}

// Locale block — must run before admin routing so /admin/* falls through cleanly.
function handleLocale(request: NextRequest): NextResponse | null {
  const { pathname } = request.nextUrl;
  if (isExcludedPath(pathname)) return null;

  const firstSeg = pathname.split("/")[1] ?? "";

  // /en or /en/foo → redirect to /foo (canonical EN at the bare path)
  if (firstSeg === defaultLocale) {
    const rest = pathname.slice(`/${defaultLocale}`.length) || "/";
    const url = request.nextUrl.clone();
    url.pathname = rest;
    return setSecurityHeaders(NextResponse.redirect(url, 308));
  }

  // /nl/foo, /fr/foo, … — pass through (real route under [locale])
  if (isLocale(firstSeg)) {
    const res = NextResponse.next();
    res.headers.set("x-locale", firstSeg);
    return setSecurityHeaders(res);
  }

  // Bare / or /foo with no locale prefix → rewrite (silently) to /en/foo
  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
  const res = NextResponse.rewrite(url);
  res.headers.set("x-locale", defaultLocale);
  return setSecurityHeaders(res);
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 0. Maintenance gate — must be first so it covers locale + admin routing.
  const maintenance = handleMaintenance(request);
  if (maintenance) return maintenance;

  // 1. Admin gate
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login" || pathname === "/admin/auth/callback") {
      return setSecurityHeaders(NextResponse.next());
    }
    const { response, user } = await updateSession(request);
    if (user) {
      const allowed = adminEmails();
      if (allowed.length === 0 || allowed.includes((user.email ?? "").toLowerCase())) {
        return setSecurityHeaders(response);
      }
      return setSecurityHeaders(
        NextResponse.redirect(new URL("/admin/login?error=unauthorized", request.url)),
      );
    }
    if (
      process.env.NODE_ENV !== "production" &&
      request.cookies.get(ADMIN_COOKIE)?.value === "1"
    ) {
      return setSecurityHeaders(response);
    }
    return setSecurityHeaders(NextResponse.redirect(new URL("/admin/login", request.url)));
  }

  // 2. Locale handling for everything else
  const locResponse = handleLocale(request);
  if (locResponse) return locResponse;

  const passthrough = NextResponse.next();
  passthrough.headers.set("x-locale", resolveLocale(pathname));
  return setSecurityHeaders(passthrough);
}

// Run on every request — locale + maintenance logic needs the path. The
// internal filter in isExcludedPath() keeps next-internal + static paths free.
export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
