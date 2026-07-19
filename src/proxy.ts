import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "./lib/auth";

export async function proxy(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/jobs/add/:path*",
    "/jobs/manage/:path*",
    "/ai-assistant/:path*",
    "/dashboard/:path*",
    "/profile/:path*",
  ],
};
