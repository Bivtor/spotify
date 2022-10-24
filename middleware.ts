import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export const config = {
  matcher: '/',
}

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.JWT_SECRET });

  // 1) allow request if token exists
  // 2) is request for next-auth session and provider fetching ??
  if (token) {
    return NextResponse.next()
  }

  if (!token && req.url !== '/') {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}