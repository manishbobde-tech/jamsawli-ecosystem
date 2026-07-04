import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  // Create Organization (Jamsawli Trust)
  const org = await prisma.organization.create({
    data: {
      name: "चमत्कारिक श्री हनुमान मंदिर संस्थान",
      slug: "jamsawli",
      description: "Chamatkarik Shri Hanuman Mandir Sansthan (Hanuman Lok), Jamsawli",
    },
  })

  // Create Temple
  const temple = await prisma.temple.create({
    data: {
      name: "चमत्कारिक श्री हनुमान मंदिर",
      slug: "jamsawli-hanuman",
      description: "Swayambhu Hanuman idol at Jam-Sarpa river confluence",
      address: "Village Sawli, Saunsar",
      city: "Chhindwara",
      state: "Madhya Pradesh",
      pincode: "480337",
      phone: "+91 94221 82393",
      email: "office@jamsawlihanumanmandir.com",
      organizationId: org.id,
    },
  })

  // Create Poojas
  const poojas = [
    {
      name: "Mangala Aarti",
      nameHi: "मंगला आरती",
      description: "Early morning aarti at dawn",
      descriptionHi: "भोर में होने वाली आरती",
      duration: 30,
      price: 101,
      templeId: temple.id,
    },
    {
      name: "Sandhya Aarti",
      nameHi: "संध्या आरती",
      description: "Evening aarti at dusk",
      descriptionHi: "संध्या के समय होने वाली आरती",
      duration: 30,
      price: 101,
      templeId: temple.id,
    },
    {
      name: "Hanuman Chalisa Path",
      nameHi: "हनुमान चालीसा पाठ",
      description: "Recitation of Hanuman Chalisa",
      descriptionHi: "हनुमान चालीसा का पाठ",
      duration: 45,
      price: 201,
      templeId: temple.id,
    },
    {
      name: "Sunderkand Path",
      nameHi: "सुंदरकांड पाठ",
      description: "Recitation of Sunderkand",
      descriptionHi: "सुंदरकांड का पाठ",
      duration: 90,
      price: 501,
      templeId: temple.id,
    },
    {
      name: "Special Pooja",
      nameHi: "विशेष पूजा",
      description: "Special worship ceremony",
      descriptionHi: "विशेष पूजा अनुष्ठान",
      duration: 60,
      price: 1001,
      templeId: temple.id,
    },
  ]

  for (const pooja of poojas) {
    await prisma.pooja.create({ data: pooja })
  }

  // Create Events
  const events = [
    {
      title: "Hanuman Jayanti",
      titleHi: "हनुमान जयंती",
      description: "Birth anniversary of Lord Hanuman",
      descriptionHi: "भगवान हनुमान की जयंती",
      startDate: new Date("2026-04-01"),
      endDate: new Date("2026-04-01"),
      templeId: temple.id,
    },
    {
      title: "Mangalwar Special",
      titleHi: "मंगलवार विशेष",
      description: "Special Tuesday worship",
      descriptionHi: "विशेष मंगलवार पूजा",
      startDate: new Date("2026-01-01"),
      isRecurring: true,
      recurrenceRule: "FREQ=WEEKLY;BYDAY=TU",
      templeId: temple.id,
    },
  ]

  for (const event of events) {
    await prisma.event.create({ data: event })
  }

  console.log("Seed data created successfully!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
