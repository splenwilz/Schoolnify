import { NextRequest, NextResponse } from "next/server";

const MAIN_DOMAIN = "schoolnify.com";

/**
 * Extract the school subdomain slug from the hostname.
 *
 * Dev:  springfield-high.localhost:3001 → "springfield-high"
 * Prod: springfield-high.schoolnify.com → "springfield-high"
 * No subdomain: localhost:3001 / schoolnify.com → null
 */
function getSubdomainSlug(hostname: string): string | null {
  const host = hostname.split(":")[0];

  // Dev: {slug}.localhost
  if (host.endsWith(".localhost")) {
    const slug = host.replace(".localhost", "") || null;
    if (slug === "www") return null;
    return slug;
  }

  // Prod: {slug}.schoolnify.com
  if (host.endsWith(`.${MAIN_DOMAIN}`)) {
    const slug = host.replace(`.${MAIN_DOMAIN}`, "");
    if (slug === "www" || !slug) return null;
    return slug;
  }

  return null;
}

export function proxy(request: NextRequest) {
  const hostname = request.headers.get("host") ?? "";
  const slug = getSubdomainSlug(hostname);

  // No subdomain — main site, pass through
  if (!slug) return NextResponse.next();

  const { pathname } = request.nextUrl;

  // API routes — pass through so Next.js rewrites can proxy to backend
  if (pathname.startsWith("/api/")) {
    const response = NextResponse.next();
    response.headers.set("x-school-slug", slug);
    return response;
  }

  // Auth routes — pass through without rewriting (shared across main site & subdomains)
  if (pathname === "/signin" || pathname === "/signup" || pathname.startsWith("/verify-email")) {
    const response = NextResponse.next();
    response.headers.set("x-school-slug", slug);
    return response;
  }

  // Already on /school-admin — pass through
  if (pathname.startsWith("/school-admin")) {
    const response = NextResponse.next();
    response.headers.set("x-school-slug", slug);
    return response;
  }

  // Rewrite to /school-admin/*
  const url = request.nextUrl.clone();
  url.pathname = `/school-admin${pathname === "/" ? "" : pathname}`;

  const response = NextResponse.rewrite(url);
  response.headers.set("x-school-slug", slug);
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
