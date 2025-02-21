import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/firebase";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token");
  const isAuthRoute = req.nextUrl.pathname.startsWith("/auth");

  if (!token && !isAuthRoute) {
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};

