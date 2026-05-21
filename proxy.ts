import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const ADMIN_COOKIE = "ssi-dev-admin";

function adminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!pathname.startsWith("/admin")) return NextResponse.next();
  if (pathname === "/admin/login" || pathname === "/admin/auth/callback") {
    return NextResponse.next();
  }

  const { response, user } = await updateSession(request);

  // Supabase path: require authenticated admin email
  if (user) {
    const allowed = adminEmails();
    if (allowed.length === 0 || allowed.includes((user.email ?? "").toLowerCase())) {
      return response;
    }
    return NextResponse.redirect(new URL("/admin/login?error=unauthorized", request.url));
  }

  // Dev mock fallback when Supabase is not configured
  if (
    process.env.NODE_ENV !== "production" &&
    request.cookies.get(ADMIN_COOKIE)?.value === "1"
  ) {
    return response;
  }

  return NextResponse.redirect(new URL("/admin/login", request.url));
}

export const config = {
  matcher: ["/admin/:path*"],
};
