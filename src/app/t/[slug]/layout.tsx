import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  try {
    const temple = await prisma.temple.findFirst({
      where: { slug: params.slug, isActive: true },
      select: { name: true, nameHi: true, description: true },
    })
    if (!temple) {
      return { title: "Temple not found" }
    }
    const title = temple.nameHi || temple.name
    return {
      title,
      description:
        temple.description ||
        `${title} on MandirOS — donate, book sevas, transparency.`,
    }
  } catch {
    return { title: "Temple" }
  }
}

export default function TenantLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
