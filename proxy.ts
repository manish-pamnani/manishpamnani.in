import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const BLOG_PREFIX = "/blogs";

function hasFileExtension(pathname: string): boolean {
  const lastSegment = pathname.split("/").pop() ?? "";
  return lastSegment.includes(".");
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith(BLOG_PREFIX) || hasFileExtension(pathname)) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();

  if (pathname === BLOG_PREFIX || pathname === `${BLOG_PREFIX}/`) {
    url.pathname = `${BLOG_PREFIX}/index.html`;
    return NextResponse.rewrite(url);
  }

  const base = pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
  url.pathname = `${base}/index.html`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/blogs", "/blogs/:path*"],
};
