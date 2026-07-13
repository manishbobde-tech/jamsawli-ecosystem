/**
 * Canonical tenant URL helpers.
 * Platform lives at / ; temples live at /t/{slug}/...
 * Subdomains rewrite into the same /t/{slug} tree via middleware.
 */

export function tenantBase(slug: string): string {
  if (!slug) return "/temples"
  return `/t/${slug}`
}

export function tenantPath(slug: string, path: string = ""): string {
  const base = tenantBase(slug)
  if (!path || path === "/") return base
  const normalized = path.startsWith("/") ? path : `/${path}`
  return `${base}${normalized}`
}

/** Known platform (non-tenant) first path segments */
export const PLATFORM_ROOTS = new Set([
  "api",
  "_next",
  "t",
  "admin",
  "dashboard",
  "login",
  "register",
  "platform",
  "pricing",
  "temples",
  "embed",
  "receipt",
  "case-study",
  "features",
  "demo",
  "for-trustees",
  "help",
  "certificate",
  "favicon.ico",
  "images",
  "widget.js",
  "icon.svg",
  "icon-192.png",
  "icon-512.png",
  "manifest.json",
  "sw.js",
])
