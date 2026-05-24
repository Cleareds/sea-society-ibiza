import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { defaultLocale, isLocale } from "@/lib/i18n/config";

const ADMIN_COOKIE = "ssi-dev-admin";

function adminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
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

  // 1. Admin gate (unchanged)
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

// Run on every request — locale logic needs the path. The internal filter in
// isExcludedPath() keeps next-internal + static paths free.
export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
