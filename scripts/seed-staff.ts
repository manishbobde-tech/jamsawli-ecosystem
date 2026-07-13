/**
 * Seed MandirOS platform super-admin + sample temple trustee for local/demo.
 *
 * npx ts-node --compiler-options '{"module":"CommonJS"}' scripts/seed-staff.ts
 */
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function upsertUser(data: {
  email: string
  phone?: string
  name: string
  role: "SUPER_ADMIN" | "TRUSTEE" | "ADMIN" | "DEVOTEE"
  password: string
  organizationId?: string | null
}) {
  const password = await bcrypt.hash(data.password, 10)
  const existing = await prisma.user.findUnique({ where: { email: data.email } })
  if (existing) {
    return prisma.user.update({
      where: { id: existing.id },
      data: {
        name: data.name,
        role: data.role,
        password,
        phone: data.phone,
        organizationId: data.organizationId ?? existing.organizationId,
      },
    })
  }
  return prisma.user.create({
    data: {
      email: data.email,
      phone: data.phone,
      name: data.name,
      role: data.role,
      password,
      organizationId: data.organizationId,
    },
  })
}

async function main() {
  const org =
    (await prisma.organization.findFirst({ where: { slug: "jamsawli" } })) ||
    (await prisma.organization.findFirst())

  if (!org) {
    console.error("No organization found. Run prisma db seed first.")
    process.exit(1)
  }

  const superAdmin = await upsertUser({
    email: "admin@mandiros.local",
    phone: "9999999999",
    name: "MandirOS Super Admin",
    role: "SUPER_ADMIN",
    password: "MandirOS@Admin1",
    organizationId: org.id,
  })

  const trustee = await upsertUser({
    email: "trustee@jamsawli.local",
    phone: "9888888888",
    name: "Jamsawli Trustee",
    role: "TRUSTEE",
    password: "Temple@Trustee1",
    organizationId: org.id,
  })

  const clerk = await upsertUser({
    email: "clerk@jamsawli.local",
    phone: "9777777777",
    name: "Counter Clerk",
    role: "ADMIN",
    password: "Temple@Clerk1",
    organizationId: org.id,
  })

  for (const u of [trustee, clerk]) {
    await prisma.userOrganization.upsert({
      where: {
        userId_organizationId: { userId: u.id, organizationId: org.id },
      },
      create: {
        userId: u.id,
        organizationId: org.id,
        role: u.role,
      },
      update: { role: u.role },
    })
  }

  console.log("✓ Staff seeded")
  console.log("")
  console.log("  SUPER_ADMIN  admin@mandiros.local     / 9999999999  pw: MandirOS@Admin1")
  console.log("  TRUSTEE      trustee@jamsawli.local   / 9888888888  pw: Temple@Trustee1")
  console.log("  CLERK        clerk@jamsawli.local     / 9777777777  pw: Temple@Clerk1")
  console.log("")
  console.log("  Login: /login  (email+password or phone OTP in dev)")
  console.log("  Change passwords in production immediately.")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
