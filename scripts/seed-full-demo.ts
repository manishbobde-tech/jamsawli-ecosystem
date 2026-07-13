/**
 * Full showcase mandir with realistic activity so every product surface
 * shows real value (money, bookings, campaigns, pilgrim, ops).
 *
 * Creates / updates:
 *   - /t/demo-full  (Trust Pro showcase — primary walkthrough target)
 *   - enriches /t/demo-pro with sample activity
 *   - staff: trustee@demo-full.local / clerk@demo-full.local
 *
 * Usage:
 *   npm run db:seed-full-demo
 */
import { PrismaClient, DonationStatus, BookingStatus } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

const SLUG = "demo-full"

function daysAgo(n: number, hour = 10) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  d.setHours(hour, 15 + (n % 40), 0, 0)
  return d
}

async function ensureOrg() {
  let org = await prisma.organization.findUnique({ where: { slug: "mandiros-demo" } })
  if (!org) {
    org = await prisma.organization.create({
      data: {
        name: "MandirOS Demo Trust",
        slug: "mandiros-demo",
        description: "Public sandbox for product demos",
        config: {
          trust: {
            trustLegalName: "MandirOS Demo Charitable Trust",
            trustLegalNameHi: "मंदिरOS डेमो चैरिटेबल ट्रस्ट",
            registrationNumber: "DEMO-REG-2024-88",
            eightyGNumber: "AAATM1234A/2024-25",
            panNumber: "AAATM1234A",
            address: "12 Temple Road, Demo Campus",
            city: "Bhopal",
            state: "Madhya Pradesh",
            pincode: "462001",
            authorizedSignatory: "Shri Ramesh Sharma (Trustee)",
            contactEmail: "trustees@demo-full.local",
          },
        },
      },
    })
  }
  return org
}

async function upsertStaff(orgId: string) {
  const password = await bcrypt.hash("Demo@Temple1", 10)
  const rows = [
    {
      email: "trustee@demo-full.local",
      phone: "9000000001",
      name: "Demo Full Trustee",
      role: "TRUSTEE" as const,
    },
    {
      email: "clerk@demo-full.local",
      phone: "9000000002",
      name: "Demo Counter Clerk",
      role: "ADMIN" as const,
    },
  ]
  const users = []
  for (const r of rows) {
    const existing = await prisma.user.findUnique({ where: { email: r.email } })
    const user = existing
      ? await prisma.user.update({
          where: { id: existing.id },
          data: {
            name: r.name,
            role: r.role,
            password,
            phone: r.phone,
            organizationId: orgId,
          },
        })
      : await prisma.user.create({
          data: {
            email: r.email,
            phone: r.phone,
            name: r.name,
            role: r.role,
            password,
            organizationId: orgId,
          },
        })
    await prisma.userOrganization.upsert({
      where: {
        userId_organizationId: { userId: user.id, organizationId: orgId },
      },
      create: {
        userId: user.id,
        organizationId: orgId,
        role: r.role,
      },
      update: { role: r.role },
    })
    users.push(user)
  }
  return users
}

async function ensureTemple(orgId: string) {
  const end = new Date()
  end.setFullYear(end.getFullYear() + 2)

  let temple = await prisma.temple.findUnique({ where: { slug: SLUG } })
  const data = {
    name: "Shri Ram Darbar Showcase Mandir",
    nameHi: "श्री राम दरबार शोकेस मंदिर",
    description:
      "Full MandirOS product demo with sample donations, counter cash, sevas, campaigns, and pilgrim data. Trust Pro plan — every feature unlocked.",
    address: "Ram Path, Demo Nagar",
    city: "Bhopal",
    state: "Madhya Pradesh",
    pincode: "462001",
    phone: "0755-0000000",
    email: "office@demo-full.local",
    primaryColor: "#c2410c",
    secondaryColor: "#7f1d1d",
    subscriptionPlan: "TRUST_PRO",
    subscriptionStatus: "active",
    isPremium: true,
    isActive: true,
    featuredUntil: end,
    config: {
      trust: {
        trustLegalName: "Shri Ram Darbar Showcase Trust",
        eightyGNumber: "AAATM1234A/2024-25",
        panNumber: "AAATM1234A",
        registrationNumber: "MP/TRUST/DEMO/88",
        address: "Ram Path, Demo Nagar, Bhopal",
        authorizedSignatory: "Demo Trustee",
      },
      campaigns: [
        {
          id: "camp_bhandara",
          title: "Annadan Bhandara (Sawan)",
          titleHi: "अन्नदान भंडारा (सावन)",
          target: 500000,
          raised: 312400,
          description: "Feed 5,000 devotees during Sawan — public progress bar builds trust.",
        },
        {
          id: "camp_renovation",
          title: "Garbhagriha renovation",
          titleHi: "गर्भगृह जीर्णोद्धार",
          target: 2500000,
          raised: 890000,
          description: "Structural repair + marble flooring.",
        },
        {
          id: "camp_gaushala",
          title: "Gaushala feed drive",
          titleHi: "गौशाला चारा अभियान",
          target: 150000,
          raised: 97800,
        },
      ],
      notifications: {
        emails: ["trustee@demo-full.local"],
        slackWebhookUrl: "",
        autoSendEnabled: false,
      },
      branding: {
        tagline: "Digital trust demo — not a real temple collection",
      },
    },
  }

  if (!temple) {
    temple = await prisma.temple.create({
      data: { ...data, slug: SLUG, organizationId: orgId },
    })
  } else {
    temple = await prisma.temple.update({
      where: { id: temple.id },
      data: { ...data, organizationId: orgId },
    })
  }

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

  return temple
}

async function ensurePoojas(templeId: string) {
  const existing = await prisma.pooja.findMany({ where: { templeId } })
  if (existing.length >= 6) return existing

  const base = [
    { name: "Mangala Aarti", nameHi: "मंगला आरती", price: 101, duration: 30, maxPerSlot: 40 },
    { name: "Sandhya Aarti", nameHi: "संध्या आरती", price: 151, duration: 30, maxPerSlot: 40 },
    { name: "Ram Naam Path", nameHi: "राम नाम पाठ", price: 251, duration: 45, maxPerSlot: 25 },
    { name: "Sunderkand", nameHi: "सुंदरकांड", price: 501, duration: 90, maxPerSlot: 20 },
    { name: "Special Abhishek", nameHi: "विशेष अभिषेक", price: 1101, duration: 60, maxPerSlot: 12 },
    { name: "Annadan Seva", nameHi: "अन्नदान सेवा", price: 2501, duration: 120, maxPerSlot: 50 },
    { name: "Kalash Yatra", nameHi: "कलश यात्रा", price: 501, duration: 60, maxPerSlot: 30 },
    { name: "Vivah Sanskar (demo)", nameHi: "विवाह संस्कार", price: 11001, duration: 180, maxPerSlot: 2 },
  ]
  const created = []
  for (const p of base) {
    created.push(
      await prisma.pooja.create({
        data: {
          ...p,
          description: `${p.name} — demo seva with capacity for festival board`,
          descriptionHi: p.nameHi,
          templeId,
          isActive: true,
        },
      })
    )
  }
  return created
}

async function clearActivity(templeId: string) {
  // Re-seed clean sample activity (demo only)
  await prisma.booking.deleteMany({ where: { templeId } })
  await prisma.donation.deleteMany({ where: { templeId } })
  await prisma.cashEntry.deleteMany({ where: { templeId } })
  await prisma.visit.deleteMany({ where: { templeId } })
  await prisma.sosAlert.deleteMany({ where: { templeId } })
  await prisma.lostFoundItem.deleteMany({ where: { templeId } })
  await prisma.opsChecklistLog.deleteMany({ where: { templeId } })
}

async function seedMoney(templeId: string, clerkId: string, prefix = "DEMO-FULL") {
  const purposes = [
    "General",
    "Annadan",
    "Bhandara",
    "Construction",
    "Gaushala",
    "Festival",
    "Prasad",
  ]
  const donors = [
    { name: "Anita Verma", phone: "9811111101", pan: "ABCDE1234F" },
    { name: "Suresh Patel", phone: "9811111102", pan: "BCDEF2345G" },
    { name: "Meera Joshi", phone: "9811111103", pan: null },
    { name: "Rajesh Kumar", phone: "9811111104", pan: "CDEFG3456H" },
    { name: "Priya Nair", phone: "9811111105", pan: "DEFGH4567I" },
    { name: "Vikram Singh", phone: "9811111106", pan: null },
    { name: "Sunita Devi", phone: "9811111107", pan: "EFGHI5678J" },
    { name: "Amit Gupta", phone: "9811111108", pan: "FGHIJ6789K" },
  ]
  const amounts = [101, 251, 501, 1101, 2100, 5001, 11000, 501, 751, 1501]

  const stamp = Date.now().toString(36)
  let receipt = 1001
  for (let i = 0; i < 24; i++) {
    const donor = donors[i % donors.length]
    const amount = amounts[i % amounts.length]
    const want80G = Boolean(donor.pan) && amount >= 500
    await prisma.donation.create({
      data: {
        amount,
        purpose: purposes[i % purposes.length],
        status: DonationStatus.COMPLETED,
        donorName: donor.name,
        donorPhone: donor.phone,
        donorEmail: `${donor.name.split(" ")[0].toLowerCase()}@example.com`,
        panNumber: want80G ? donor.pan : null,
        want80G,
        receiptNumber: `${prefix}-${stamp}-R${receipt++}`,
        paymentId: `pay_${prefix}_${stamp}_${i}`,
        orderId: `order_${prefix}_${stamp}_${i}`,
        templeId,
        createdAt: daysAgo(i % 7, 9 + (i % 8)),
      },
    })
  }

  // Counter / hundi cash — the Monday board story
  const cashRows = [
    { type: "HUNDI", amount: 8450, note: "Morning hundi open", day: 0 },
    { type: "COUNTER", amount: 2100, note: "UPI at counter — cash logged", day: 0 },
    { type: "PRASAD", amount: 3200, note: "Prasad counter", day: 1 },
    { type: "HUNDI", amount: 12040, note: "Evening count", day: 1 },
    { type: "COUNTER", amount: 501, note: "Walk-in donation receipt", day: 2 },
    { type: "HUNDI", amount: 6780, note: "Midweek hundi", day: 3 },
    { type: "OTHER", amount: 1500, note: "Special box — Kalash", day: 4 },
    { type: "HUNDI", amount: 15200, note: "Saturday rush", day: 5 },
    { type: "COUNTER", amount: 3300, note: "Festival prep counter", day: 6 },
  ]
  for (const c of cashRows) {
    await prisma.cashEntry.create({
      data: {
        type: c.type,
        amount: c.amount,
        note: c.note,
        templeId,
        recordedById: clerkId,
        collectedAt: daysAgo(c.day, 18),
      },
    })
  }
}

async function seedBookings(templeId: string, poojas: { id: string; price: unknown; name: string }[]) {
  const slots = ["06:00-07:00", "07:00-08:00", "09:00-10:00", "17:00-18:00", "18:00-19:00"]
  const devotees = [
    { name: "Lakshmi Iyer", gotra: "Bharadwaj", sankalp: "Putra sukh", phone: "9820000001" },
    { name: "Harish Mehta", gotra: "Kashyap", sankalp: "Griha shanti", phone: "9820000002" },
    { name: "Kavita Rao", gotra: "Vashishtha", sankalp: "Vivah", phone: "9820000003" },
    { name: "Deepak Shah", gotra: "Atri", sankalp: "Rojgar", phone: "9820000004" },
    { name: "Nisha Agarwal", gotra: "Gautam", sankalp: "Swasthya", phone: "9820000005" },
  ]

  for (let i = 0; i < 18; i++) {
    const pooja = poojas[i % poojas.length]
    const d = devotees[i % devotees.length]
    const dayOffset = i % 6
    const date = daysAgo(-dayOffset) // upcoming + recent
    if (dayOffset > 0) date.setDate(new Date().getDate() + dayOffset)

    await prisma.booking.create({
      data: {
        date,
        time: slots[i % slots.length],
        status: i % 7 === 0 ? BookingStatus.PENDING : BookingStatus.CONFIRMED,
        totalAmount: Number(pooja.price),
        devoteeName: d.name,
        gotra: d.gotra,
        sankalp: d.sankalp,
        phone: d.phone,
        templeId,
        poojaId: pooja.id,
        createdAt: daysAgo(i % 5, 11),
      },
    })
  }
}

async function seedVisits(templeId: string, userId: string) {
  for (let i = 0; i < 40; i++) {
    await prisma.visit.create({
      data: {
        templeId,
        userId,
        checkInTime: daysAgo(i % 7, 6 + (i % 10)),
      },
    })
  }
}

async function seedPilgrim(templeId: string, userId: string) {
  await prisma.sosAlert.create({
    data: {
      templeId,
      userId,
      type: "MEDICAL",
      location: "Main queue near entrance",
      message: "Demo SOS — elderly devotee needs water / first aid",
      status: "ACTIVE",
    },
  })
  await prisma.lostFoundItem.createMany({
    data: [
      {
        templeId,
        userId,
        type: "LOST",
        description: "Blue cloth bag with puja thali",
        location: "Parking A",
        contactInfo: "9000000099",
        status: "OPEN",
      },
      {
        templeId,
        userId,
        type: "FOUND",
        description: "Child's water bottle (red)",
        location: "Near shoe stand",
        contactInfo: "Office counter",
        status: "OPEN",
      },
    ],
  })
}

async function seedOps(templeId: string) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  await prisma.opsChecklistLog.create({
    data: {
      templeId,
      date: today,
      completed: true,
      notes: "Demo day — all morning checks done",
      items: {
        openAarti: true,
        countHundi: true,
        postReport: true,
        cleanPrasad: true,
        checkCCTV: true,
      },
    },
  })
}

/** Light activity on demo-pro (Free vs Pro hub) */
async function lightSeedPro() {
  const pro = await prisma.temple.findUnique({ where: { slug: "demo-pro" } })
  if (!pro) return
  const donationCount = await prisma.donation.count({ where: { templeId: pro.id } })
  if (donationCount > 0) return

  const poojas = await prisma.pooja.findMany({ where: { templeId: pro.id } })
  for (let i = 0; i < 8; i++) {
    await prisma.donation.create({
      data: {
        amount: [501, 1101, 2100][i % 3],
        purpose: ["General", "Annadan", "Construction"][i % 3],
        status: DonationStatus.COMPLETED,
        donorName: `Pro Demo Donor ${i + 1}`,
        templeId: pro.id,
        receiptNumber: `DEMO-PRO-R${2000 + i}`,
        createdAt: daysAgo(i, 12),
      },
    })
  }
  for (let i = 0; i < 4; i++) {
    await prisma.cashEntry.create({
      data: {
        type: "HUNDI",
        amount: 3000 + i * 500,
        note: "Pro demo hundi",
        templeId: pro.id,
        collectedAt: daysAgo(i, 17),
      },
    })
  }
  if (poojas[0]) {
    for (let i = 0; i < 5; i++) {
      const d = new Date()
      d.setDate(d.getDate() + i)
      await prisma.booking.create({
        data: {
          date: d,
          time: "07:00-08:00",
          status: BookingStatus.CONFIRMED,
          totalAmount: Number(poojas[0].price),
          devoteeName: `Booker ${i + 1}`,
          gotra: "Kashyap",
          sankalp: "Demo",
          phone: `983000000${i}`,
          templeId: pro.id,
          poojaId: poojas[0].id,
        },
      })
    }
  }
}

/**
 * Dashboard pages use NEXT_PUBLIC_DEFAULT_TENANT (usually jamsawli-hanuman).
 * Mirror showcase activity onto the anchor so Money desk / Report show numbers after login.
 */
async function seedAnchorForDashboard(clerkId: string, trusteeId: string) {
  const anchor = await prisma.temple.findUnique({
    where: { slug: "jamsawli-hanuman" },
  })
  if (!anchor) {
    console.warn("  (skip anchor seed — jamsawli-hanuman not found)")
    return
  }

  const end = new Date()
  end.setFullYear(end.getFullYear() + 2)
  await prisma.temple.update({
    where: { id: anchor.id },
    data: {
      subscriptionPlan: "TRUST_PRO",
      subscriptionStatus: "active",
      isPremium: true,
    },
  })
  await prisma.templeSubscription.upsert({
    where: { templeId: anchor.id },
    create: {
      templeId: anchor.id,
      plan: "TRUST_PRO",
      status: "ACTIVE",
      platformFee: 7999,
      startDate: new Date(),
      endDate: end,
    },
    update: { plan: "TRUST_PRO", status: "ACTIVE", platformFee: 7999, endDate: end },
  })

  const donationCount = await prisma.donation.count({ where: { templeId: anchor.id } })
  if (donationCount > 5) {
    console.log("  Anchor already has activity — leaving existing donations")
    return
  }

  let poojas = await prisma.pooja.findMany({ where: { templeId: anchor.id } })
  if (poojas.length === 0) {
    poojas = await ensurePoojas(anchor.id)
  }

  await seedMoney(anchor.id, clerkId, "JAMSAWLI")
  await seedBookings(anchor.id, poojas)
  await seedVisits(anchor.id, trusteeId)
  await seedOps(anchor.id)

  // Campaigns on anchor for transparency / campaign admin
  const prev =
    anchor.config && typeof anchor.config === "object"
      ? (anchor.config as Record<string, unknown>)
      : {}
  await prisma.temple.update({
    where: { id: anchor.id },
    data: {
      config: {
        ...prev,
        campaigns: [
          {
            id: "camp_j_bhandara",
            title: "Jamsawli Annadan",
            titleHi: "जामसावली अन्नदान",
            target: 300000,
            raised: 142500,
          },
        ],
        notifications: {
          emails: ["trustee@jamsawli.local"],
          autoSendEnabled: false,
        },
      },
    },
  })
}

async function main() {
  const org = await ensureOrg()
  const staff = await upsertStaff(org.id)
  const clerk = staff.find((u) => u.role === "ADMIN") || staff[0]
  const trustee = staff.find((u) => u.role === "TRUSTEE") || staff[0]

  const temple = await ensureTemple(org.id)
  const poojas = await ensurePoojas(temple.id)

  await clearActivity(temple.id)
  await seedMoney(temple.id, clerk.id)
  await seedBookings(temple.id, poojas)
  await seedVisits(temple.id, trustee.id)
  await seedPilgrim(temple.id, trustee.id)
  await seedOps(temple.id)
  await lightSeedPro()
  await seedAnchorForDashboard(clerk.id, trustee.id)

  // Ensure classic seed-staff accounts exist too (jamsawli org)
  try {
    // re-use password for jamsawli staff if present
    const jOrg = await prisma.organization.findFirst({ where: { slug: "jamsawli" } })
    if (jOrg) {
      for (const email of ["trustee@jamsawli.local", "clerk@jamsawli.local", "admin@mandiros.local"]) {
        const u = await prisma.user.findUnique({ where: { email } })
        if (u && !u.organizationId) {
          await prisma.user.update({
            where: { id: u.id },
            data: { organizationId: jOrg.id },
          })
        }
      }
    }
  } catch {
    /* optional */
  }

  const summary = {
    donations: await prisma.donation.count({ where: { templeId: temple.id } }),
    cash: await prisma.cashEntry.count({ where: { templeId: temple.id } }),
    bookings: await prisma.booking.count({ where: { templeId: temple.id } }),
    visits: await prisma.visit.count({ where: { templeId: temple.id } }),
    poojas: poojas.length,
  }

  console.log("✓ Full showcase mandir ready")
  console.log("")
  console.log(`  Temple:  ${temple.name}`)
  console.log(`  Public:  /t/${SLUG}`)
  console.log(`  Donate:  /t/${SLUG}/donate`)
  console.log(`  Book:    /t/${SLUG}/book`)
  console.log(`  Trust:   /t/${SLUG}/transparency`)
  console.log(`  Pilgrim: /t/${SLUG}/pilgrim`)
  console.log(`  Walkthrough: /demo/walkthrough`)
  console.log("")
  console.log("  Sample data:", summary)
  console.log("")
  console.log("  Login (staff console — dashboard uses default tenant jamsawli-hanuman, also seeded):")
  console.log("    trustee@demo-full.local  /  Demo@Temple1")
  console.log("    clerk@demo-full.local    /  Demo@Temple1")
  console.log("    trustee@jamsawli.local   /  Temple@Trustee1  (if seed-staff was run)")
  console.log("  Then open /dashboard → money desk, weekly report, festival, trust…")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
