import { prisma } from "./prisma"

const DEFAULT_TEMPLE_SLUG = "jamsawli-hanuman"
const DEFAULT_ORG_SLUG = "jamsawli"

export async function resolveTemple(templeSlug?: string | null) {
  const slug = templeSlug || DEFAULT_TEMPLE_SLUG

  const temple = await prisma.temple.findFirst({
    where: { slug },
    include: { organization: true },
  })

  if (!temple) {
    throw new Error(`Temple not found: ${slug}`)
  }

  return temple
}

export async function resolveOrganization(orgSlug?: string | null) {
  const slug = orgSlug || DEFAULT_ORG_SLUG

  const org = await prisma.organization.findUnique({
    where: { slug },
  })

  if (!org) {
    throw new Error(`Organization not found: ${slug}`)
  }

  return org
}
