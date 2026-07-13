import { prisma } from "./prisma"

export async function resolveTemple(templeSlug: string) {
  const temple = await prisma.temple.findFirst({
    where: { slug: templeSlug },
    include: { organization: true },
  })

  if (!temple) {
    throw new Error(`Temple not found: ${templeSlug}`)
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
