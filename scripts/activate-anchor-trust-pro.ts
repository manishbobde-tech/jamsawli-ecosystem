/**
 * One-shot: ensure Jamsawli (or DEFAULT_TENANT) is on TRUST_PRO for full product demos.
 * Run: npx ts-node --compiler-options '{"module":"CommonJS"}' scripts/activate-anchor-trust-pro.ts
 */
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  const slug = process.env.NEXT_PUBLIC_DEFAULT_TENANT || "jamsawli-hanuman"
  const temple = await prisma.temple.findFirst({ where: { slug } })
  if (!temple) {
    console.error("Temple not found:", slug)
    process.exit(1)
  }

  const end = new Date()
  end.setFullYear(end.getFullYear() + 1)

  await prisma.templeSubscription.upsert({
    where: { templeId: temple.id },
    create: {
      templeId: temple.id,
      plan: "TRUST_PRO",
      status: "ACTIVE",
      platformFee: 7999,
      startDate: new Date(),
      endDate: end,
    },
    update: {
      plan: "TRUST_PRO",
      status: "ACTIVE",
      platformFee: 7999,
      endDate: end,
    },
  })

  await prisma.temple.update({
    where: { id: temple.id },
    data: {
      subscriptionPlan: "TRUST_PRO",
      subscriptionStatus: "active",
      isPremium: true,
      subscriptionEndDate: end,
    },
  })

  console.log("✓", slug, "activated on TRUST_PRO")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
