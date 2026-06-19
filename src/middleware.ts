import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "./auth.config";
import { ROLES } from "@/lib/constants";

const { auth } = NextAuth(authConfig);

/**
 * Route protection (edge runtime — JWT only, no DB):
 *  - /admin/**      → admin role only
 *  - /dashboard/**  → any authenticated user
 *  - /learn/**      → any authenticated user (lesson access checked server-side)
 */
export default auth((req) => {
  const { nextUrl } = req;
  const session = req.auth;
  const isLoggedIn = !!session?.user;
  const role = session?.user?.role;
  const path = nextUrl.pathname;

  const isAdminArea = path.startsWith("/admin");
  const isProtected =
    isAdminArea ||
    path.startsWith("/dashboard") ||
    path.startsWith("/learn");

  if (isProtected && !isLoggedIn) {
    const login = new URL("/login", nextUrl);
    login.searchParams.set("callbackUrl", path + nextUrl.search);
    return NextResponse.redirect(login);
  }

  if (isAdminArea && role !== ROLES.ADMIN) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/learn/:path*"],
};
