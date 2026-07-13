import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { PLATFORM_ROOTS } from "@/lib/tenant-path"

/**
 * Routing model:
 * - /                     → MandirOS platform (no tenant)
 * - /t/{slug}/...         → temple tenant (path)
 * - {slug}.host/...       → rewrite to /t/{slug}/...
 * - legacy /donate etc.   → redirect to default tenant or /temples
 */

const LEGACY_TENANT_PATHS = new Set([
  "donate",
  "book",
  "transparency",
  "checkin",
  "pilgrim",
])

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || ""
  const url = new URL(request.url)
  const pathParts = url.pathname.split("/").filter(Boolean)

  if (
    pathParts[0] === "api" ||
    pathParts[0] === "_next" ||
    pathParts[0] === "favicon.ico" ||
    pathParts[0] === "images"
  ) {
    return NextResponse.next()
  }

  // Embed / widget: chrome-less + optional ?temple=
  if (pathParts[0] === "embed") {
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set("x-embed-shell", "1")
    requestHeaders.set("x-shell", "embed")
    const qTemple = url.searchParams.get("temple")
    if (qTemple) requestHeaders.set("x-tenant-slug", qTemple)
    return NextResponse.next({ request: { headers: requestHeaders } })
  }

  // Receipts + certificates: chrome-less print view
  if (pathParts[0] === "receipt" || pathParts[0] === "certificate") {
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set("x-embed-shell", "1")
    requestHeaders.set("x-shell", "embed")
    const qTemple = url.searchParams.get("temple")
    if (qTemple) requestHeaders.set("x-tenant-slug", qTemple)
    return NextResponse.next({ request: { headers: requestHeaders } })
  }

  // --- Subdomain tenant: jamsawli.localhost:3000 → /t/jamsawli/...
  const hostNoPort = hostname.split(":")[0]
  const parts = hostNoPort.split(".")
  let subdomainSlug: string | null = null
  // e.g. jamsawli.mandiros.com OR jamsawli.localhost
  if (parts.length >= 2 && parts[0] !== "www" && parts[0] !== "localhost") {
    // skip vercel preview multi-level: jamsawli-ecosystem.vercel.app
    const isVercel = hostNoPort.includes("vercel.app")
    const isLocal = hostNoPort.endsWith("localhost") || hostNoPort === "127.0.0.1"
    if (isLocal && parts.length >= 2 && parts[0] !== "localhost") {
      subdomainSlug = parts[0]
    } else if (!isVercel && !isLocal && parts.length >= 3) {
      subdomainSlug = parts[0]
    }
  }

  if (subdomainSlug && !PLATFORM_ROOTS.has(subdomainSlug)) {
    // Already under /t/ — just tag headers
    if (pathParts[0] === "t" && pathParts[1]) {
      const requestHeaders = new Headers(request.headers)
      requestHeaders.set("x-tenant-slug", pathParts[1])
      requestHeaders.set("x-shell", "tenant")
      return NextResponse.next({ request: { headers: requestHeaders } })
    }
    const rest = url.pathname === "/" ? "" : url.pathname
    const rewriteUrl = new URL(`/t/${subdomainSlug}${rest}`, request.url)
    rewriteUrl.search = url.search
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set("x-tenant-slug", subdomainSlug)
    requestHeaders.set("x-shell", "tenant")
    return NextResponse.rewrite(rewriteUrl, {
      request: { headers: requestHeaders },
    })
  }

  // --- Path tenant: /t/{slug}/...
  if (pathParts[0] === "t" && pathParts[1]) {
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set("x-tenant-slug", pathParts[1])
    requestHeaders.set("x-shell", "tenant")
    return NextResponse.next({ request: { headers: requestHeaders } })
  }

  // --- Legacy bare temple paths → default tenant redirect
  if (pathParts[0] && LEGACY_TENANT_PATHS.has(pathParts[0])) {
    const defaultSlug =
      process.env.NEXT_PUBLIC_DEFAULT_TENANT || "jamsawli-hanuman"
    const dest = new URL(`/t/${defaultSlug}${url.pathname}`, request.url)
    dest.search = url.search
    return NextResponse.redirect(dest, 308)
  }

  // --- Legacy /demo-free style (slug as first segment that isn't platform)
  if (
    pathParts[0] &&
    !PLATFORM_ROOTS.has(pathParts[0]) &&
    pathParts[0] !== "t"
  ) {
    // Redirect old /{slug}/... to /t/{slug}/...
    const slug = pathParts[0]
    const rest = pathParts.slice(1).join("/")
    const dest = new URL(
      rest ? `/t/${slug}/${rest}` : `/t/${slug}`,
      request.url
    )
    dest.search = url.search
    return NextResponse.redirect(dest, 308)
  }

  // Platform shell
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set("x-shell", "platform")
  return NextResponse.next({ request: { headers: requestHeaders } })
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
