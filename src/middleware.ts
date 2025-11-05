import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const pathname = req.nextUrl.pathname;

  const isAuthPage =
    pathname.startsWith("/login") || pathname.startsWith("/register");

  const isDashboardPage = pathname.startsWith("/dashboard");

  // 1️⃣ Si estamos en login/register y ya hay token → redirigir a dashboard
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // 2️⃣ Si estamos en dashboard y NO hay token → redirigir a /
  if (isDashboardPage && !token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // 3️⃣ Cualquier otra ruta → deja pasar
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};
