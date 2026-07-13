import { prisma } from "./prisma"
import { getDefaultTempleSlug } from "./tenant"

export async function resolveTemple(templeSlug?: string | null) {
  const slug = templeSlug || getDefaultTempleSlug()
  const temple = await prisma.temple.findFirst({
    where: { slug, isActive: true },
    include: { organization: true },
  })

  if (!temple) {
    throw new Error(`Temple not found: ${slug}`)
  }

  return temple
}

export async function resolveOrganization(orgSlug: string) {
  const org = await prisma.organization.findUnique({
    where: { slug: orgSlug },
  })

  if (!org) {
    throw new Error(`Organization not found: ${orgSlug}`)
  }

  return org
}
