import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || ""
  const url = new URL(request.url)
  const pathParts = url.pathname.split("/").filter(Boolean)

  // Skip API routes, static files, Next.js internals
  if (
    pathParts[0] === "api" ||
    pathParts[0] === "_next" ||
    pathParts[0] === "favicon.ico" ||
    pathParts[0] === "images"
  ) {
    return NextResponse.next()
  }

  let templeSlug: string | null = null

  // 1. Subdomain detection: templename.mandiros.com
  const parts = hostname.split(".")
  if (parts.length >= 3 && parts[0] !== "www") {
    templeSlug = parts[0]
  }

  // 2. Path detection: mandiros.com/temple-slug/...
  if (!templeSlug && pathParts.length >= 1) {
    const potentialSlug = pathParts[0]
    // Skip known app routes
    const appRoutes = new Set([
      "admin", "donate", "book", "login", "register",
      "dashboard", "transparency", "checkin", "pilgrim",
    ])
    if (!appRoutes.has(potentialSlug)) {
      templeSlug = potentialSlug
    }
  }

  if (templeSlug) {
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set("x-tenant-slug", templeSlug)

    // Rewrite path to remove slug prefix (for path-based routing)
    let rewritePath = url.pathname
    if (pathParts[0] === templeSlug) {
      rewritePath = "/" + pathParts.slice(1).join("/") || "/"
    }

    return NextResponse.rewrite(new URL(rewritePath, request.url), {
      request: { headers: requestHeaders },
    })
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
