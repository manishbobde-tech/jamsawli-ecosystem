/**
 * Creates demo-free (FREE) and demo-pro (TRUST_PRO) temples for public comparison.
 * Safe to re-run (upserts by slug).
 *
 * npx ts-node --compiler-options '{"module":"CommonJS"}' scripts/seed-demo-temples.ts
 */
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function ensureOrg() {
  let org = await prisma.organization.findUnique({ where: { slug: "mandiros-demo" } })
  if (!org) {
    org = await prisma.organization.create({
      data: {
        name: "MandirOS Demo Trust",
        slug: "mandiros-demo",
        description: "Public sandbox for Free vs Pro product demos",
        config: {
          trust: {
            trustLegalName: "MandirOS Demo Trust",
            trustLegalNameHi: "MandirOS डेमो ट्रस्ट",
            registrationNumber: "DEMO-REG-001",
            eightyGNumber: "DEMO-80G-001",
            panNumber: "ABCDE1234F",
            address: "Demo Campus",
            city: "Bhopal",
            state: "Madhya Pradesh",
            pincode: "462001",
            authorizedSignatory: "Demo Trustee",
            contactEmail: "demo@mandiros.app",
          },
        },
      },
    })
  }
  return org
}

async function ensureTemple(opts: {
  orgId: string
  slug: string
  name: string
  nameHi: string
  plan: "FREE" | "TRUST_PRO"
  description: string
  primaryColor: string
}) {
  const existing = await prisma.temple.findUnique({ where: { slug: opts.slug } })
  const end = new Date()
  end.setFullYear(end.getFullYear() + 2)

  const temple =
    existing ||
    (await prisma.temple.create({
      data: {
        name: opts.name,
        nameHi: opts.nameHi,
        slug: opts.slug,
        description: opts.description,
        address: "Demo Street",
        city: "Bhopal",
        state: "Madhya Pradesh",
        pincode: "462001",
        organizationId: opts.orgId,
        subscriptionPlan: opts.plan,
        subscriptionStatus: "active",
        isPremium: opts.plan !== "FREE",
        isActive: true,
        primaryColor: opts.primaryColor,
        secondaryColor: "#7f1d1d",
      },
    }))

  if (existing) {
    await prisma.temple.update({
      where: { id: existing.id },
      data: {
        subscriptionPlan: opts.plan,
        subscriptionStatus: "active",
        isPremium: opts.plan !== "FREE",
        isActive: true,
        description: opts.description,
      },
    })
  }

  await prisma.templeSubscription.upsert({
    where: { templeId: temple.id },
    create: {
      templeId: temple.id,
      plan: opts.plan,
      status: "ACTIVE",
      platformFee: opts.plan === "FREE" ? 0 : 7999,
      startDate: new Date(),
      endDate: end,
    },
    update: {
      plan: opts.plan,
      status: "ACTIVE",
      platformFee: opts.plan === "FREE" ? 0 : 7999,
      endDate: end,
    },
  })

  const poojaCount = await prisma.pooja.count({ where: { templeId: temple.id } })
  if (poojaCount === 0) {
    const base = [
      { name: "Mangala Aarti", nameHi: "मंगला आरती", price: 101, duration: 30 },
      { name: "Sandhya Aarti", nameHi: "संध्या आरती", price: 101, duration: 30 },
      { name: "Hanuman Chalisa", nameHi: "हनुमान चालीसा", price: 201, duration: 45 },
      { name: "Sunderkand Path", nameHi: "सुंदरकांड", price: 501, duration: 90 },
      { name: "Special Abhishek", nameHi: "विशेष अभिषेक", price: 1001, duration: 60 },
      { name: "Annadan Seva", nameHi: "अन्नदान सेवा", price: 2501, duration: 120 },
    ]
    // Free temple still seeds 6; catalogue API truncates to plan max
    for (const p of base) {
      await prisma.pooja.create({
        data: {
          ...p,
          description: `Demo seva — ${p.name}`,
          descriptionHi: p.nameHi,
          templeId: temple.id,
          isActive: true,
        },
      })
    }
  }

  return temple
}

async function main() {
  const org = await ensureOrg()

  const free = await ensureTemple({
    orgId: org.id,
    slug: "demo-free",
    name: "Shri Demo Free Mandir",
    nameHi: "श्री डेमो फ्री मंदिर",
    plan: "FREE",
    description:
      "Public Free-plan sandbox. Donate & book work; advanced pilgrim/AI/ops features locked.",
    primaryColor: "#64748b",
  })

  const pro = await ensureTemple({
    orgId: org.id,
    slug: "demo-pro",
    name: "Shri Demo Trust Pro Mandir",
    nameHi: "श्री डेमो ट्रस्ट प्रो मंदिर",
    plan: "TRUST_PRO",
    description:
      "Public Trust Pro sandbox. Full AI, transparency, pilgrim safety, ops — everything unlocked.",
    primaryColor: "#ea580c",
  })

  // Sample campaigns on Pro demo
  await prisma.temple.update({
    where: { id: pro.id },
    data: {
      config: {
        campaigns: [
          {
            id: "camp_bhandara",
            title: "Annadan Bhandara",
            titleHi: "अन्नदान भंडारा",
            target: 500000,
            raised: 125000,
            description: "Demo campaign for public progress bar",
          },
          {
            id: "camp_build",
            title: "Temple hall renovation",
            titleHi: "भवन जीर्णोद्धार",
            target: 2000000,
            raised: 450000,
          },
        ],
      },
    },
  })

  console.log("✓ Demo temples ready:")
  console.log("  FREE  → /t/demo-free  (", free.id, ")")
  console.log("  PRO   → /t/demo-pro   (", pro.id, ")")
  console.log("  Hub   → /demo")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
