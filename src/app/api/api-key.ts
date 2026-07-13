import { prisma } from "@/lib/prisma"

export async function authenticateApiKey(req: Request) {
  const apiKey = req.headers.get("x-api-key")
  if (!apiKey) {
    return { error: "API key required", status: 401 }
  }

  const key = await prisma.apiKey.findUnique({
    where: { key: apiKey },
    include: { temple: true },
  })

  if (!key || !key.isActive) {
    return { error: "Invalid API key", status: 401 }
  }

  await prisma.apiKey.update({
    where: { id: key.id },
    data: { lastUsedAt: new Date() },
  })

  return { templeId: key.templeId, temple: key.temple }
}
