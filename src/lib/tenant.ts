import { headers } from "next/headers"
import { prisma } from "./prisma"

/** Default only for local single-tenant dev; never hardcode in components. */
export function getDefaultTempleSlug(): string {
  return process.env.NEXT_PUBLIC_DEFAULT_TENANT || "jamsawli-hanuman"
}

export async function getTempleSlugFromHeaders(): Promise<string | null> {
  try {
    const h = headers()
    return h.get("x-tenant-slug")
  } catch {
    return null
  }
}

export async function resolveTenantSlug(
  explicit?: string | null
): Promise<string> {
  if (explicit) return explicit
  const fromHeader = await getTempleSlugFromHeaders()
  if (fromHeader) return fromHeader
  return getDefaultTempleSlug()
}

export async function getActiveTempleBySlug(slug: string) {
  return prisma.temple.findFirst({
    where: { slug, isActive: true },
    include: { organization: true },
  })
}

export async function requireTemple(slug?: string | null) {
  const resolved = await resolveTenantSlug(slug)
  const temple = await getActiveTempleBySlug(resolved)
  if (!temple) {
    throw new Error(`Temple not found: ${resolved}`)
  }
  return temple
}
