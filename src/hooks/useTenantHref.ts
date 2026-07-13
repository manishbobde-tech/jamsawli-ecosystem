"use client"

import { useOptionalTemple } from "@/hooks/useTemple"
import { tenantPath } from "@/lib/tenant-path"
import { DEFAULT_TENANT_SLUG } from "@/lib/tenant-client"

/** Build hrefs scoped to current temple tenant when available. */
export function useTenantHref() {
  const temple = useOptionalTemple()
  const slug = temple?.templeSlug

  return (path: string = "/") => {
    if (slug) return tenantPath(slug, path)
    // Fallback only when already on platform without tenant context
    return path.startsWith("/t/") || path.startsWith("http")
      ? path
      : path
  }
}

export function useTenantSlug(fallback = DEFAULT_TENANT_SLUG) {
  const temple = useOptionalTemple()
  return temple?.templeSlug || fallback
}
