# Jamsawli Digital Ecosystem - Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the foundation of the Jamsawli Digital Ecosystem - a Next.js application with donation system, pooja booking, and admin dashboard.

**Architecture:** Multi-tenant PWA using Next.js 14+ with App Router, PostgreSQL with Prisma ORM, NextAuth.js for authentication, Razorpay for payments, and Tailwind CSS for styling. The architecture supports future expansion to MandirOS platform.

**Tech Stack:** Next.js 14+, TypeScript, PostgreSQL, Prisma, NextAuth.js, Tailwind CSS, shadcn/ui, Razorpay, Vercel

## Global Constraints

- Node.js 20+ required
- PostgreSQL 15+ required
- TypeScript strict mode enabled
- ESLint + Prettier for code formatting
- All components use shadcn/ui design system
- Hindi + English bilingual support
- Mobile-first responsive design
- PWA-ready architecture

---

## File Structure

```
jamsawli-ecosystem/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Seed data
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── layout.tsx         # Root layout with providers
│   │   ├── page.tsx           # Homepage
│   │   ├── globals.css        # Global styles
│   │   ├── (auth)/            # Auth routes
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── (dashboard)/       # Admin routes
│   │   │   ├── layout.tsx     # Dashboard layout
│   │   │   ├── page.tsx       # Dashboard home
│   │   │   ├── donations/page.tsx
│   │   │   └── bookings/page.tsx
│   │   ├── donate/
│   │   │   └── page.tsx       # Donation page
│   │   ├── book/
│   │   │   └── page.tsx       # Booking page
│   │   └── api/               # API routes
│   │       ├── auth/[...nextauth]/route.ts
│   │       ├── donations/route.ts
│   │       ├── bookings/route.ts
│   │       └── webhooks/razorpay/route.ts
│   ├── components/            # Reusable components
│   │   ├── ui/                # shadcn/ui components
│   │   ├── layout/            # Layout components
│   │   ├── donation/          # Donation components
│   │   ├── booking/           # Booking components
│   │   └── dashboard/         # Dashboard components
│   ├── lib/                   # Utility functions
│   │   ├── prisma.ts          # Prisma client
│   │   ├── auth.ts            # Auth configuration
│   │   ├── razorpay.ts        # Razorpay client
│   │   └── utils.ts           # General utilities
│   └── types/                 # TypeScript types
│       └── index.ts           # Type definitions
├── public/                    # Static assets
├── next.config.js             # Next.js config
├── tailwind.config.ts         # Tailwind config
├── tsconfig.json              # TypeScript config
└── package.json               # Dependencies
```

---

## Task 1: Project Setup & Configuration

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.js`
- Create: `tailwind.config.ts`
- Create: `postcss.config.js`
- Create: `.env.example`
- Create: `.gitignore`
- Create: `src/app/layout.tsx`
- Create: `src/app/page.tsx`
- Create: `src/app/globals.css`

**Interfaces:**
- Consumes: None (initial setup)
- Produces: Running Next.js dev server

- [ ] **Step 1: Initialize Next.js project**

```bash
npx create-next-app@latest jamsawli-ecosystem --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
cd jamsawli-ecosystem
```

- [ ] **Step 2: Install core dependencies**

```bash
npm install prisma @prisma/client next-auth @next-auth/prisma-adapter razorpay stripe swr zod react-hook-form @hookform/resolvers date-fns clsx tailwind-merge class-variance-authority lucide-react
npm install -D @types/node @types/react @types/react-dom
```

- [ ] **Step 3: Install shadcn/ui**

```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card form input label select toast dialog
```

- [ ] **Step 4: Configure environment variables**

Create `.env.example`:
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/jamsawli"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"

# OAuth Providers
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# Razorpay
RAZORPAY_KEY_ID=""
RAZORPAY_KEY_SECRET=""

# App
NEXT_PUBLIC_APP_NAME="Jamsawli Hanuman Lok"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

- [ ] **Step 5: Configure Tailwind with custom theme**

Update `tailwind.config.ts`:
```typescript
import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        saffron: {
          50: "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#f97316",
          600: "#ea580c",
          700: "#c2410c",
          800: "#9a3412",
          900: "#7c2d12",
        },
        sacred: {
          red: "#dc2626",
          gold: "#d97706",
          maroon: "#7f1d1d",
        },
      },
      fontFamily: {
        hindi: ["Noto Sans Devanagari", "sans-serif"],
      },
    },
  },
  plugins: [],
}
export default config
```

- [ ] **Step 6: Create root layout with providers**

```typescript
// src/app/layout.tsx
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Jamsawli Hanuman Lok - Where Faith Meets Innovation",
  description: "Digital ecosystem for Chamatkarik Shri Hanuman Mandir, Jamsawli",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="hi">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
```

- [ ] **Step 7: Create providers component**

```typescript
// src/components/providers.tsx
"use client"

import { SessionProvider } from "next-auth/react"
import { Toaster } from "@/components/ui/toaster"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <Toaster />
    </SessionProvider>
  )
}
```

- [ ] **Step 8: Create homepage**

```typescript
// src/app/page.tsx
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-saffron-50 to-white">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center">
        <div className="absolute inset-0 bg-sacred-maroon/10" />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-5xl md:text-7xl font-bold text-sacred-maroon mb-6">
            जामसावली हनुमान लोक
          </h1>
          <p className="text-2xl md:text-3xl text-gray-700 mb-8">
            जहाँ आस्था और नवीनता मिलते हैं
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/donate">
              <Button size="lg" className="bg-saffron-500 hover:bg-saffron-600">
                दान करें
              </Button>
            </Link>
            <Link href="/book">
              <Button size="lg" variant="outline">
                पूजा बुक करें
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-sacred-maroon">
            हमारी सेवाएं
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              title="लाइव दर्शन"
              description="24/7 मंदिर कैमरे से जुड़ें"
              icon="🎥"
            />
            <FeatureCard
              title="ऑनलाइन दान"
              description="सुरक्षित और पारदर्शी दान"
              icon="💰"
            />
            <FeatureCard
              title="पूजा बुकिंग"
              description="घर बैठे पूजा बुक करें"
              icon="🙏"
            />
          </div>
        </div>
      </section>
    </main>
  )
}

function FeatureCard({
  title,
  description,
  icon,
}: {
  title: string
  description: string
  icon: string
}) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg text-center hover:shadow-xl transition-shadow">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}
```

- [ ] **Step 9: Run dev server to verify**

```bash
npm run dev
```

Expected: App runs at http://localhost:3000 with homepage visible

- [ ] **Step 10: Commit initial setup**

```bash
git add .
git commit -m "feat: initial Next.js project setup with Tailwind and shadcn/ui"
```

---

## Task 2: Database Schema & Prisma Setup

**Files:**
- Create: `prisma/schema.prisma`
- Create: `src/lib/prisma.ts`
- Create: `prisma/seed.ts`

**Interfaces:**
- Consumes: Task 1 (project setup)
- Produces: Database client, schema, seed data

- [ ] **Step 1: Initialize Prisma**

```bash
npx prisma init
```

- [ ] **Step 2: Create database schema**

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Multi-tenant: Organization (Temple Trust)
model Organization {
  id            String    @id @default(cuid())
  name          String
  slug          String    @unique
  description   String?
  logo          String?
  config        Json?     // Theme, settings, etc.
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  temples       Temple[]
  users         User[]
}

// Temple (can have multiple per organization)
model Temple {
  id            String    @id @default(cuid())
  name          String
  slug          String    @unique
  description   String?
  address       String?
  city          String?
  state         String?
  pincode       String?
  phone         String?
  email         String?
  website       String?
  logo          String?
  images        String[]
  config        Json?     // Temple-specific settings
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  organizationId String
  organization   Organization @relation(fields: [organizationId], references: [id])

  poojas        Pooja[]
  bookings      Booking[]
  events        Event[]
}

// Users (Devotees, Admins, Trustees)
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  phone         String?   @unique
  emailVerified DateTime?
  image         String?
  role          UserRole  @default(DEVOTEE)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  accounts      Account[]
  sessions      Session[]
  donations     Donation[]
  bookings      Booking[]

  organizationId String
  organization   Organization @relation(fields: [organizationId], references: [id])
}

enum UserRole {
  DEVOTEE
  ADMIN
  TRUSTEE
  SUPER_ADMIN
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

// Poojas (Rituals available for booking)
model Pooja {
  id            String    @id @default(cuid())
  name          String
  nameHi        String    // Hindi name
  description   String?
  descriptionHi String?
  duration      Int       // Duration in minutes
  price         Decimal   @db.Decimal(10, 2)
  isActive      Boolean   @default(true)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  templeId      String
  temple        Temple    @relation(fields: [templeId], references: [id])

  bookings      Booking[]
}

// Bookings (Pooja reservations)
model Booking {
  id            String    @id @default(cuid())
  date          DateTime  // Pooja date
  time          String    // Time slot (e.g., "06:00-07:00")
  status        BookingStatus @default(PENDING)
  totalAmount   Decimal   @db.Decimal(10, 2)
  paymentId     String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  userId        String
  user          User      @relation(fields: [userId], references: [id])

  poojaId       String
  pooja         Pooja     @relation(fields: [poojaId], references: [id])

  templeId      String
  temple        Temple    @relation(fields: [templeId], references: [id])
}

enum BookingStatus {
  PENDING
  CONFIRMED
  COMPLETED
  CANCELLED
}

// Donations
model Donation {
  id            String    @id @default(cuid())
  amount        Decimal   @db.Decimal(10, 2)
  currency      String    @default("INR")
  purpose       String?   // Specific purpose of donation
  paymentId     String?   // Razorpay payment ID
  orderId       String?   // Razorpay order ID
  status        DonationStatus @default(PENDING)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  userId        String
  user          User      @relation(fields: [userId], references: [id])
}

enum DonationStatus {
  PENDING
  COMPLETED
  FAILED
  REFUNDED
}

// Events (Festivals, Aartis, etc.)
model Event {
  id            String    @id @default(cuid())
  title         String
  titleHi       String?
  description   String?
  descriptionHi String?
  startDate     DateTime
  endDate       DateTime?
  location      String?
  imageUrl      String?
  isRecurring   Boolean   @default(false)
  recurrenceRule String?  // iCal RRULE format
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  templeId      String
  temple        Temple    @relation(fields: [templeId], references: [id])
}
```

- [ ] **Step 3: Create Prisma client singleton**

```typescript
// src/lib/prisma.ts
import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
```

- [ ] **Step 4: Create seed script**

```typescript
// prisma/seed.ts
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
```

- [ ] **Step 5: Run database migration**

```bash
npx prisma migrate dev --name init
```

- [ ] **Step 6: Seed the database**

```bash
npx prisma db seed
```

- [ ] **Step 7: Verify with Prisma Studio**

```bash
npx prisma studio
```

Expected: Database tables created with seed data visible

- [ ] **Step 8: Commit database setup**

```bash
git add prisma/
git commit -m "feat: add Prisma schema with multi-tenant models and seed data"
```

---

## Task 3: Authentication System

**Files:**
- Create: `src/lib/auth.ts`
- Create: `src/app/api/auth/[...nextauth]/route.ts`
- Create: `src/components/auth/login-form.tsx`
- Create: `src/app/(auth)/login/page.tsx`
- Create: `src/app/(auth)/register/page.tsx`
- Create: `src/components/auth/register-form.tsx`

**Interfaces:**
- Consumes: Task 2 (database schema)
- Produces: Authenticated sessions, login/register pages

- [ ] **Step 1: Configure NextAuth**

```typescript
// src/lib/auth.ts
import { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "./prisma"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        phone: { label: "Phone", type: "tel" },
      },
      async authorize(credentials) {
        if (!credentials?.email && !credentials?.phone) {
          throw new Error("Email or phone required")
        }

        let user
        if (credentials.email) {
          user = await prisma.user.findUnique({
            where: { email: credentials.email },
          })
        } else {
          user = await prisma.user.findUnique({
            where: { phone: credentials.phone },
          })
        }

        if (!user) {
          throw new Error("User not found")
        }

        // For phone login, we verify via OTP (simplified for MVP)
        // In production, implement proper OTP verification
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
}
```

- [ ] **Step 2: Create NextAuth route**

```typescript
// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
```

- [ ] **Step 3: Create login form component**

```typescript
// src/components/auth/login-form.tsx
"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"

export function LoginForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [method, setMethod] = useState<"email" | "phone">("email")

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const identifier = method === "email" 
      ? formData.get("email") as string
      : formData.get("phone") as string

    try {
      const result = await signIn("credentials", {
        [method]: identifier,
        redirect: false,
      })

      if (result?.error) {
        toast({
          title: "त्रुटि",
          description: "लॉगिन में समस्या हुई। कृपया पुनः प्रयास करें।",
          variant: "destructive",
        })
      } else {
        router.push("/dashboard")
        router.refresh()
      }
    } catch (error) {
      toast({
        title: "त्रुटि",
        description: "कुछ गलत हो गया।",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl text-sacred-maroon">लॉगिन करें</CardTitle>
        <CardDescription>अपने खाते में साइन इन करें</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-6">
          <Button
            type="button"
            variant={method === "email" ? "default" : "outline"}
            onClick={() => setMethod("email")}
            className="flex-1"
          >
            ईमेल
          </Button>
          <Button
            type="button"
            variant={method === "phone" ? "default" : "outline"}
            onClick={() => setMethod("phone")}
            className="flex-1"
          >
            फोन
          </Button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          {method === "email" ? (
            <div className="space-y-2">
              <Label htmlFor="email">ईमेल</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="your@email.com"
                required
              />
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="phone">फोन नंबर</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+91 98765 43210"
                required
              />
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "लॉगिन हो रहा है..." : "लॉगिन करें"}
          </Button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">या</span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full mt-4"
            onClick={() => signIn("google")}
          >
            Google से लॉगिन करें
          </Button>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          खाता नहीं है?{" "}
          <a href="/register" className="text-saffron-600 hover:underline">
            रजिस्टर करें
          </a>
        </p>
      </CardContent>
    </Card>
  )
}
```

- [ ] **Step 4: Create login page**

```typescript
// src/app/(auth)/login/page.tsx
import { LoginForm } from "@/components/auth/login-form"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-saffron-50 to-white p-4">
      <LoginForm />
    </div>
  )
}
```

- [ ] **Step 5: Create register form**

```typescript
// src/components/auth/register-form.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"

export function RegisterForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        toast({
          title: "सफल",
          description: "खाता बन गया। अब लॉगिन करें।",
        })
        router.push("/login")
      } else {
        const error = await response.json()
        toast({
          title: "त्रुटि",
          description: error.message || "रजिस्ट्रेशन में समस्या हुई।",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "त्रुटि",
        description: "कुछ गलत हो गया।",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl text-sacred-maroon">रजिस्टर करें</CardTitle>
        <CardDescription>नया खाता बनाएं</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">नाम</Label>
            <Input
              id="name"
              name="name"
              placeholder="आपका नाम"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">ईमेल</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="your@email.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">फोन नंबर</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="+91 98765 43210"
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "रजिस्टर हो रहा है..." : "रजिस्टर करें"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          पहले से खाता है?{" "}
          <a href="/login" className="text-saffron-600 hover:underline">
            लॉगिन करें
          </a>
        </p>
      </CardContent>
    </Card>
  )
}
```

- [ ] **Step 6: Create register page**

```typescript
// src/app/(auth)/register/page.tsx
import { RegisterForm } from "@/components/auth/register-form"

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-saffron-50 to-white p-4">
      <RegisterForm />
    </div>
  )
}
```

- [ ] **Step 7: Create register API route**

```typescript
// src/app/api/auth/register/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, phone } = body

    // Check if user exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { phone },
        ],
      },
    })

    if (existingUser) {
      return NextResponse.json(
        { message: "यह ईमेल या फोन पहले से रजिस्टर्ड है" },
        { status: 400 }
      )
    }

    // Get Jamsawli organization
    const org = await prisma.organization.findUnique({
      where: { slug: "jamsawli" },
    })

    if (!org) {
      return NextResponse.json(
        { message: "संगठन नहीं मिला" },
        { status: 500 }
      )
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        organizationId: org.id,
      },
    })

    return NextResponse.json(
      { message: "खाता सफलतापूर्वक बनाया गया", userId: user.id },
      { status: 201 }
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { message: "रजिस्ट्रेशन में त्रुटि" },
      { status: 500 }
    )
  }
}
```

- [ ] **Step 8: Test authentication flow**

```bash
npm run dev
```

Test:
1. Visit http://localhost:3000/register
2. Create account with email/phone
3. Visit http://localhost:3000/login
4. Login with created credentials
5. Verify redirect to dashboard

- [ ] **Step 9: Commit authentication system**

```bash
git add src/app/api/auth/ src/components/auth/ src/app/\(auth\)/ src/lib/auth.ts
git commit -m "feat: add authentication with NextAuth (email, phone, Google)"
```

---

## Task 4: Donation System

**Files:**
- Create: `src/app/donate/page.tsx`
- Create: `src/components/donation/donation-form.tsx`
- Create: `src/app/api/donations/route.ts`
- Create: `src/app/api/webhooks/razorpay/route.ts`
- Create: `src/lib/razorpay.ts`

**Interfaces:**
- Consumes: Task 3 (authentication), Task 2 (database schema)
- Produces: Donation processing, payment integration

- [ ] **Step 1: Install Razorpay SDK**

```bash
npm install razorpay
```

- [ ] **Step 2: Create Razorpay client**

```typescript
// src/lib/razorpay.ts
import Razorpay from "razorpay"

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(price)
}
```

- [ ] **Step 3: Create donation form**

```typescript
// src/components/donation/donation-form.tsx
"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/components/ui/use-toast"

const presetAmounts = [101, 201, 501, 1001, 2001, 5001]

export function DonationForm() {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [amount, setAmount] = useState<number>(101)
  const [customAmount, setCustomAmount] = useState("")
  const [purpose, setPurpose] = useState("")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)

    const donationAmount = customAmount ? parseInt(customAmount) : amount

    try {
      // Create order on server
      const response = await fetch("/api/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: donationAmount,
          purpose,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Order creation failed")
      }

      // Initialize Razorpay payment
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: "INR",
        name: "जामसावली हनुमान लोक",
        description: "दान - " + (purpose || "सामान्य दान"),
        order_id: data.order.id,
        handler: async function (response: any) {
          // Verify payment on server
          const verifyResponse = await fetch("/api/donations/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          })

          if (verifyResponse.ok) {
            toast({
              title: "🙏 दान सफल",
              description: "आपके दान के लिए धन्यवाद!",
            })
          }
        },
        prefill: {
          name: session?.user?.name || "",
          email: session?.user?.email || "",
        },
        theme: {
          color: "#f97316",
        },
      }

      const rzp = new (window as any).Razorpay(options)
      rzp.open()
    } catch (error) {
      toast({
        title: "त्रुटि",
        description: "दान प्रक्रिया में समस्या हुई।",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl text-sacred-maroon">🙏 दान करें</CardTitle>
        <CardDescription>अपनी भक्ति के साथ दान दें</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <Label>राशि चुनें</Label>
            <div className="grid grid-cols-3 gap-2">
              {presetAmounts.map((preset) => (
                <Button
                  key={preset}
                  type="button"
                  variant={amount === preset && !customAmount ? "default" : "outline"}
                  onClick={() => {
                    setAmount(preset)
                    setCustomAmount("")
                  }}
                  className={amount === preset && !customAmount ? "bg-saffron-500 hover:bg-saffron-600" : ""}
                >
                  ₹{preset}
                </Button>
              ))}
            </div>
            <div className="space-y-2">
              <Label htmlFor="customAmount">कस्टम राशि</Label>
              <Input
                id="customAmount"
                type="number"
                placeholder="अन्य राशि दर्ज करें"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                min="1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="purpose">दान का उद्देश्य (वैकल्पिक)</Label>
            <Input
              id="purpose"
              placeholder="जैसे: मंदिर निर्माण, भंडारा"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full bg-saffron-500 hover:bg-saffron-600" disabled={isLoading}>
            {isLoading ? "प्रसंस्करण..." : `₹${customAmount || amount} दान करें`}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
```

- [ ] **Step 4: Create donation page**

```typescript
// src/app/donate/page.tsx
import { DonationForm } from "@/components/donation/donation-form"

export default function DonatePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-saffron-50 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-sacred-maroon mb-8">
          दान करें
        </h1>
        <p className="text-center text-gray-600 mb-8">
          आपका दान मंदिर के विकास और सेवा कार्यों में सहायक है
        </p>
        <DonationForm />
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Create donation API route**

```typescript
// src/app/api/donations/route.ts
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { razorpay } from "@/lib/razorpay"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { message: "कृपया लॉगिन करें" },
        { status: 401 }
      )
    }

    const { amount, purpose } = await req.json()

    if (!amount || amount < 1) {
      return NextResponse.json(
        { message: "अमान्य राशि" },
        { status: 400 }
      )
    }

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: amount * 100, // Razorpay uses paise
      currency: "INR",
      receipt: `donation_${Date.now()}`,
    })

    // Create donation record
    const donation = await prisma.donation.create({
      data: {
        amount,
        purpose: purpose || "सामान्य दान",
        orderId: order.id,
        userId: session.user.id,
      },
    })

    return NextResponse.json({ order, donationId: donation.id })
  } catch (error) {
    console.error("Donation error:", error)
    return NextResponse.json(
      { message: "दान प्रक्रिया में त्रुटि" },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { message: "कृपया लॉगिन करें" },
        { status: 401 }
      )
    }

    const donations = await prisma.donation.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 10,
    })

    return NextResponse.json({ donations })
  } catch (error) {
    return NextResponse.json(
      { message: "दान लोड करने में त्रुटि" },
      { status: 500 }
    )
  }
}
```

- [ ] **Step 6: Create Razorpay webhook handler**

```typescript
// src/app/api/webhooks/razorpay/route.ts
import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { prisma } from "@/lib/prisma"
import crypto from "crypto"

export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get("x-razorpay-signature")!

  // Verify webhook signature
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(body)
    .digest("hex")

  if (signature !== expectedSignature) {
    return NextResponse.json(
      { message: "Invalid signature" },
      { status: 400 }
    )
  }

  const event = JSON.parse(body)

  if (event.event === "payment.captured") {
    const payment = event.payload.payment.entity

    await prisma.donation.updateMany({
      where: { orderId: payment.order_id },
      data: {
        paymentId: payment.id,
        status: "COMPLETED",
      },
    })
  }

  return NextResponse.json({ received: true })
}
```

- [ ] **Step 7: Test donation flow**

```bash
npm run dev
```

Test:
1. Visit http://localhost:3000/donate
2. Select amount and purpose
3. Complete payment with Razorpay test credentials
4. Verify donation recorded in database

- [ ] **Step 8: Commit donation system**

```bash
git add src/app/donate/ src/components/donation/ src/app/api/donations/ src/app/api/webhooks/ src/lib/razorpay.ts
git commit -m "feat: add donation system with Razorpay integration"
```

---

## Task 5: Pooja Booking System

**Files:**
- Create: `src/app/book/page.tsx`
- Create: `src/components/booking/booking-form.tsx`
- Create: `src/components/booking/pooja-list.tsx`
- Create: `src/app/api/bookings/route.ts`

**Interfaces:**
- Consumes: Task 3 (authentication), Task 2 (database schema)
- Produces: Pooja booking with payment

- [ ] **Step 1: Create pooja list component**

```typescript
// src/components/booking/pooja-list.tsx
"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/razorpay"

interface Pooja {
  id: string
  name: string
  nameHi: string
  description: string | null
  descriptionHi: string | null
  duration: number
  price: any
}

interface PoojaListProps {
  onSelect: (pooja: Pooja) => void
  selectedPooja: Pooja | null
}

export function PoojaList({ onSelect, selectedPooja }: PoojaListProps) {
  const [poojas, setPoojas] = useState<Pooja[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchPoojas()
  }, [])

  async function fetchPoojas() {
    try {
      const response = await fetch("/api/poojas")
      const data = await response.json()
      setPoojas(data.poojas)
    } catch (error) {
      console.error("Failed to fetch poojas:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <div className="text-center py-8">लोड हो रहा है...</div>
  }

  return (
    <div className="grid gap-4">
      {poojas.map((pooja) => (
        <Card
          key={pooja.id}
          className={`cursor-pointer transition-all ${
            selectedPooja?.id === pooja.id
              ? "ring-2 ring-saffron-500"
              : "hover:shadow-lg"
          }`}
          onClick={() => onSelect(pooja)}
        >
          <CardHeader>
            <CardTitle className="text-lg">{pooja.nameHi || pooja.name}</CardTitle>
            <CardDescription>
              {pooja.duration} मिनट | {formatPrice(Number(pooja.price))}
            </CardDescription>
          </CardHeader>
          {pooja.descriptionHi && (
            <CardContent>
              <p className="text-sm text-gray-600">{pooja.descriptionHi}</p>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Create booking form**

```typescript
// src/components/booking/booking-form.tsx
"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { PoojaList } from "./pooja-list"
import { formatPrice } from "@/lib/razorpay"
import { addDays, format } from "date-fns"

interface Pooja {
  id: string
  name: string
  nameHi: string
  duration: number
  price: any
}

const timeSlots = [
  "05:00-06:00",
  "06:00-07:00",
  "07:00-08:00",
  "08:00-09:00",
  "09:00-10:00",
  "16:00-17:00",
  "17:00-18:00",
  "18:00-19:00",
  "19:00-20:00",
]

export function BookingForm() {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedPooja, setSelectedPooja] = useState<Pooja | null>(null)
  const [selectedDate, setSelectedDate] = useState(format(addDays(new Date(), 1), "yyyy-MM-dd"))
  const [selectedTime, setSelectedTime] = useState("")

  const minDate = format(addDays(new Date(), 1), "yyyy-MM-dd")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)

    if (!selectedPooja || !selectedTime) {
      toast({
        title: "त्रुटि",
        description: "कृपया पूजा और समय चुनें",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    try {
      // Create booking order
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          poojaId: selectedPooja.id,
          date: selectedDate,
          time: selectedTime,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Booking failed")
      }

      // Initialize payment
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: "INR",
        name: "जामसावली हनुमान लोक",
        description: `पूजा बुकिंग - ${selectedPooja.nameHi || selectedPooja.name}`,
        order_id: data.order.id,
        handler: async function (response: any) {
          toast({
            title: "🙏 बुकिंग सफल",
            description: "आपकी पूजा बुक हो गई है!",
          })
        },
        prefill: {
          name: session?.user?.name || "",
          email: session?.user?.email || "",
        },
        theme: {
          color: "#f97316",
        },
      }

      const rzp = new (window as any).Razorpay(options)
      rzp.open()
    } catch (error) {
      toast({
        title: "त्रुटि",
        description: "बुकिंग प्रक्रिया में समस्या हुई।",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-sacred-maroon">पूजा चुनें</CardTitle>
        </CardHeader>
        <CardContent>
          <PoojaList onSelect={setSelectedPooja} selectedPooja={selectedPooja} />
        </CardContent>
      </Card>

      {selectedPooja && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-sacred-maroon">तिथि और समय</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="date">तिथि</Label>
                <Input
                  id="date"
                  type="date"
                  value={selectedDate}
                  min={minDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>समय चुनें</Label>
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.map((slot) => (
                    <Button
                      key={slot}
                      type="button"
                      variant={selectedTime === slot ? "default" : "outline"}
                      onClick={() => setSelectedTime(slot)}
                      className={selectedTime === slot ? "bg-saffron-500 hover:bg-saffron-600" : ""}
                    >
                      {slot}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-saffron-50 rounded-lg">
                <p className="font-semibold">चयनित पूजा: {selectedPooja.nameHi || selectedPooja.name}</p>
                <p className="text-sm text-gray-600">
                  तिथि: {format(new Date(selectedDate), "dd MMMM yyyy", { locale: undefined as any })}
                </p>
                <p className="text-sm text-gray-600">समय: {selectedTime}</p>
                <p className="text-lg font-bold text-sacred-maroon mt-2">
                  कुल राशि: {formatPrice(Number(selectedPooja.price))}
                </p>
              </div>

              <Button type="submit" className="w-full bg-saffron-500 hover:bg-saffron-600" disabled={isLoading}>
                {isLoading ? "बुक हो रहा है..." : "बुकिंग करें"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
```

- [ ] **Step 3: Create poojas API route**

```typescript
// src/app/api/poojas/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const org = await prisma.organization.findUnique({
      where: { slug: "jamsawli" },
    })

    if (!org) {
      return NextResponse.json(
        { message: "Organization not found" },
        { status: 404 }
      )
    }

    const temple = await prisma.temple.findFirst({
      where: { organizationId: org.id },
    })

    if (!temple) {
      return NextResponse.json(
        { message: "Temple not found" },
        { status: 404 }
      )
    }

    const poojas = await prisma.pooja.findMany({
      where: {
        templeId: temple.id,
        isActive: true,
      },
      orderBy: { price: "asc" },
    })

    return NextResponse.json({ poojas })
  } catch (error) {
    console.error("Fetch poojas error:", error)
    return NextResponse.json(
      { message: "Failed to fetch poojas" },
      { status: 500 }
    )
  }
}
```

- [ ] **Step 4: Create bookings API route**

```typescript
// src/app/api/bookings/route.ts
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { razorpay } from "@/lib/razorpay"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { message: "कृपया लॉगिन करें" },
        { status: 401 }
      )
    }

    const { poojaId, date, time } = await req.json()

    // Get pooja details
    const pooja = await prisma.pooja.findUnique({
      where: { id: poojaId },
      include: { temple: true },
    })

    if (!pooja) {
      return NextResponse.json(
        { message: "पूजा नहीं मिली" },
        { status: 404 }
      )
    }

    // Check if slot is available
    const existingBooking = await prisma.booking.findFirst({
      where: {
        poojaId,
        date: new Date(date),
        time,
        status: { not: "CANCELLED" },
      },
    })

    if (existingBooking) {
      return NextResponse.json(
        { message: "यह समय पहले से बुक है" },
        { status: 400 }
      )
    }

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: Number(pooja.price) * 100,
      currency: "INR",
      receipt: `booking_${Date.now()}`,
    })

    // Create booking record
    const booking = await prisma.booking.create({
      data: {
        date: new Date(date),
        time,
        totalAmount: pooja.price,
        orderId: order.id,
        userId: session.user.id,
        poojaId,
        templeId: pooja.templeId,
      },
    })

    return NextResponse.json({ order, bookingId: booking.id })
  } catch (error) {
    console.error("Booking error:", error)
    return NextResponse.json(
      { message: "बुकिंग प्रक्रिया में त्रुटि" },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { message: "कृपया लॉगिन करें" },
        { status: 401 }
      )
    }

    const bookings = await prisma.booking.findMany({
      where: { userId: session.user.id },
      include: { pooja: true },
      orderBy: { date: "desc" },
      take: 10,
    })

    return NextResponse.json({ bookings })
  } catch (error) {
    return NextResponse.json(
      { message: "बुकिंग लोड करने में त्रुटि" },
      { status: 500 }
    )
  }
}
```

- [ ] **Step 5: Create booking page**

```typescript
// src/app/book/page.tsx
import { BookingForm } from "@/components/booking/booking-form"

export default function BookPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-saffron-50 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-sacred-maroon mb-8">
          पूजा बुक करें
        </h1>
        <p className="text-center text-gray-600 mb-8">
          अपनी पसंद की पूजा बुक करें और घर बैठे प्रसाद प्राप्त करें
        </p>
        <BookingForm />
      </div>
    </div>
  )
}
```

- [ ] **Step 6: Test booking flow**

```bash
npm run dev
```

Test:
1. Visit http://localhost:3000/book
2. Select a pooja
3. Choose date and time slot
4. Complete booking with payment
5. Verify booking in database

- [ ] **Step 7: Commit booking system**

```bash
git add src/app/book/ src/components/booking/ src/app/api/bookings/ src/app/api/poojas/
git commit -m "feat: add pooja booking system with payment integration"
```

---

## Task 6: Admin Dashboard

**Files:**
- Create: `src/app/(dashboard)/layout.tsx`
- Create: `src/app/(dashboard)/page.tsx`
- Create: `src/app/(dashboard)/donations/page.tsx`
- Create: `src/app/(dashboard)/bookings/page.tsx`
- Create: `src/components/dashboard/stats-card.tsx`
- Create: `src/components/dashboard/donations-table.tsx`
- Create: `src/components/dashboard/bookings-table.tsx`

**Interfaces:**
- Consumes: Task 3 (authentication), Task 4 (donations), Task 5 (bookings)
- Produces: Admin dashboard with statistics and management

- [ ] **Step 1: Create dashboard layout**

```typescript
// src/app/(dashboard)/layout.tsx
"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const navItems = [
  { href: "/dashboard", label: "डैशबोर्ड" },
  { href: "/dashboard/donations", label: "दान" },
  { href: "/dashboard/bookings", label: "बुकिंग" },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const router = useRouter()

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center">लोड हो रहा है...</div>
  }

  if (!session) {
    router.push("/login")
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="text-xl font-bold text-sacred-maroon">
            जामसावली एडमिन
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{session.user?.name || session.user?.email}</span>
            <Link href="/">
              <Button variant="outline" size="sm">होमपेज</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="w-64">
            <nav className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block px-4 py-2 rounded-lg hover:bg-saffron-50 text-gray-700 hover:text-sacred-maroon"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create stats card component**

```typescript
// src/components/dashboard/stats-card.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface StatsCardProps {
  title: string
  value: string | number
  description?: string
  icon?: string
}

export function StatsCard({ title, value, description, icon }: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <span className="text-2xl">{icon}</span>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  )
}
```

- [ ] **Step 3: Create donations table**

```typescript
// src/components/dashboard/donations-table.tsx
"use client"

import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/razorpay"
import { format } from "date-fns"

interface Donation {
  id: string
  amount: any
  purpose: string | null
  status: string
  createdAt: string
  user: {
    name: string | null
    email: string | null
  }
}

export function DonationsTable() {
  const [donations, setDonations] = useState<Donation[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchDonations()
  }, [])

  async function fetchDonations() {
    try {
      const response = await fetch("/api/admin/donations")
      const data = await response.json()
      setDonations(data.donations)
    } catch (error) {
      console.error("Failed to fetch donations:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <div className="text-center py-8">लोड हो रहा है...</div>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>दाता</TableHead>
          <TableHead>राशि</TableHead>
          <TableHead>उद्देश्य</TableHead>
          <TableHead>स्थिति</TableHead>
          <TableHead>तिथि</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {donations.map((donation) => (
          <TableRow key={donation.id}>
            <TableCell>
              <div>
                <div className="font-medium">{donation.user.name || "अज्ञात"}</div>
                <div className="text-sm text-gray-500">{donation.user.email}</div>
              </div>
            </TableCell>
            <TableCell className="font-medium">{formatPrice(Number(donation.amount))}</TableCell>
            <TableCell>{donation.purpose || "सामान्य दान"}</TableCell>
            <TableCell>
              <Badge variant={donation.status === "COMPLETED" ? "default" : "secondary"}>
                {donation.status === "COMPLETED" ? "सफल" : "लंबित"}
              </Badge>
            </TableCell>
            <TableCell>{format(new Date(donation.createdAt), "dd MMM yyyy")}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
```

- [ ] **Step 4: Create bookings table**

```typescript
// src/components/dashboard/bookings-table.tsx
"use client"

import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/razorpay"
import { format } from "date-fns"

interface Booking {
  id: string
  date: string
  time: string
  status: string
  totalAmount: any
  pooja: {
    nameHi: string | null
    name: string
  }
  user: {
    name: string | null
    email: string | null
  }
}

export function BookingsTable() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchBookings()
  }, [])

  async function fetchBookings() {
    try {
      const response = await fetch("/api/admin/bookings")
      const data = await response.json()
      setBookings(data.bookings)
    } catch (error) {
      console.error("Failed to fetch bookings:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <div className="text-center py-8">लोड हो रहा है...</div>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>भक्त</TableHead>
          <TableHead>पूजा</TableHead>
          <TableHead>तिथि</TableHead>
          <TableHead>समय</TableHead>
          <TableHead>राशि</TableHead>
          <TableHead>स्थिति</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {bookings.map((booking) => (
          <TableRow key={booking.id}>
            <TableCell>
              <div>
                <div className="font-medium">{booking.user.name || "अज्ञात"}</div>
                <div className="text-sm text-gray-500">{booking.user.email}</div>
              </div>
            </TableCell>
            <TableCell>{booking.pooja.nameHi || booking.pooja.name}</TableCell>
            <TableCell>{format(new Date(booking.date), "dd MMM yyyy")}</TableCell>
            <TableCell>{booking.time}</TableCell>
            <TableCell className="font-medium">{formatPrice(Number(booking.totalAmount))}</TableCell>
            <TableCell>
              <Badge variant={booking.status === "CONFIRMED" ? "default" : "secondary"}>
                {booking.status === "CONFIRMED" ? "पुष्ट" : "लंबित"}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
```

- [ ] **Step 5: Create dashboard home page**

```typescript
// src/app/(dashboard)/page.tsx
import { StatsCard } from "@/components/dashboard/stats-card"

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-sacred-maroon">डैशबोर्ड</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="कुल दान"
          value="₹2,45,000"
          description="इस महीने"
          icon="💰"
        />
        <StatsCard
          title="बुकिंग"
          value="127"
          description="इस महीने"
          icon="📅"
        />
        <StatsCard
          title="पंजीकृत भक्त"
          value="1,234"
          description="कुल"
          icon="👥"
        />
        <StatsCard
          title="आज के दर्शन"
          value="2,847"
          description="अभी तक"
          icon="🎥"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h2 className="text-xl font-semibold mb-4">हाल का दान</h2>
          {/* DonationsTable will be added */}
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">हाल की बुकिंग</h2>
          {/* BookingsTable will be added */}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 6: Create admin API routes**

```typescript
// src/app/api/admin/donations/route.ts
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (!user || (user.role !== "ADMIN" && user.role !== "TRUSTEE" && user.role !== "SUPER_ADMIN")) {
      return NextResponse.json(
        { message: "Forbidden" },
        { status: 403 }
      )
    }

    const donations = await prisma.donation.findMany({
      include: { user: { select: { name: true, email: true } } },
      orderBy: { createdAt: "desc" },
      take: 50,
    })

    return NextResponse.json({ donations })
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch donations" },
      { status: 500 }
    )
  }
}
```

```typescript
// src/app/api/admin/bookings/route.ts
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (!user || (user.role !== "ADMIN" && user.role !== "TRUSTEE" && user.role !== "SUPER_ADMIN")) {
      return NextResponse.json(
        { message: "Forbidden" },
        { status: 403 }
      )
    }

    const bookings = await prisma.booking.findMany({
      include: {
        pooja: { select: { name: true, nameHi: true } },
        user: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    })

    return NextResponse.json({ bookings })
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch bookings" },
      { status: 500 }
    )
  }
}
```

- [ ] **Step 7: Test dashboard**

```bash
npm run dev
```

Test:
1. Login as admin user
2. Visit http://localhost:3000/dashboard
3. Verify stats display
4. Check donations and bookings tables

- [ ] **Step 8: Commit dashboard**

```bash
git add src/app/\(dashboard\)/ src/components/dashboard/ src/app/api/admin/
git commit -m "feat: add admin dashboard with stats and management tables"
```

---

## Task 7: Live Devotee Counter (Innovation Feature)

**Files:**
- Create: `src/components/counter/devotee-counter.tsx`
- Create: `src/app/api/counter/route.ts`
- Create: `src/app/api/counter/increment/route.ts`

**Interfaces:**
- Consumes: Task 2 (database schema)
- Produces: Real-time devotee counter

- [ ] **Step 1: Add counter to schema**

Update `prisma/schema.prisma`:
```prisma
model Counter {
  id            String    @id @default(cuid())
  name          String    @unique
  value         Int       @default(0)
  lastUpdated   DateTime  @updatedAt
}
```

Run migration:
```bash
npx prisma migrate dev --name add-counter
```

- [ ] **Step 2: Create counter API**

```typescript
// src/app/api/counter/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    let counter = await prisma.counter.findUnique({
      where: { name: "daily_visitors" },
    })

    if (!counter) {
      counter = await prisma.counter.create({
        data: {
          name: "daily_visitors",
          value: 0,
        },
      })
    }

    return NextResponse.json({
      count: counter.value,
      lastUpdated: counter.lastUpdated,
    })
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch counter" },
      { status: 500 }
    )
  }
}
```

- [ ] **Step 3: Create increment API**

```typescript
// src/app/api/counter/increment/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST() {
  try {
    const counter = await prisma.counter.upsert({
      where: { name: "daily_visitors" },
      update: { value: { increment: 1 } },
      create: {
        name: "daily_visitors",
        value: 1,
      },
    })

    return NextResponse.json({
      count: counter.value,
      lastUpdated: counter.lastUpdated,
    })
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to increment counter" },
      { status: 500 }
    )
  }
}
```

- [ ] **Step 4: Create counter component**

```typescript
// src/components/counter/devotee-counter.tsx
"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function DevoteeCounter() {
  const [count, setCount] = useState(0)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  useEffect(() => {
    fetchCount()
    // Poll every 30 seconds
    const interval = setInterval(fetchCount, 30000)
    return () => clearInterval(interval)
  }, [])

  async function fetchCount() {
    try {
      const response = await fetch("/api/counter")
      const data = await response.json()
      setCount(data.count)
      setLastUpdated(new Date(data.lastUpdated))
    } catch (error) {
      console.error("Failed to fetch counter:", error)
    }
  }

  return (
    <Card className="bg-gradient-to-br from-saffron-500 to-sacred-red text-white">
      <CardHeader className="text-center">
        <CardTitle className="text-lg">🔴 लाइव भक्त काउंटर</CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <div className="text-5xl font-bold mb-2">{count.toLocaleString("hi-IN")}</div>
        <p className="text-sm opacity-90">आज के भक्त</p>
        {lastUpdated && (
          <p className="text-xs opacity-70 mt-2">
            अंतिम अपडेट: {lastUpdated.toLocaleTimeString("hi-IN")}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
```

- [ ] **Step 5: Add counter to homepage**

Update `src/app/page.tsx` to include the counter:
```typescript
import { DevoteeCounter } from "@/components/counter/devotee-counter"

// Add to homepage in the hero section or features section
```

- [ ] **Step 6: Test counter**

```bash
npm run dev
```

Test:
1. Visit homepage, verify counter displays
2. Call increment API
3. Verify counter updates

- [ ] **Step 7: Commit counter feature**

```bash
git add src/components/counter/ src/app/api/counter/
git commit -m "feat: add live devotee counter feature"
```

---

## Task 8: WhatsApp Bot Integration

**Files:**
- Create: `src/app/api/whatsapp/route.ts`
- Create: `src/lib/whatsapp.ts`

**Interfaces:**
- Consumes: Task 4 (donations), Task 5 (bookings)
- Produces: WhatsApp bot for devotee interaction

- [ ] **Step 1: Create WhatsApp client**

```typescript
// src/lib/whatsapp.ts
const WHATSAPP_API_URL = "https://graph.facebook.com/v17.0"
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID

export async function sendWhatsAppMessage(to: string, message: string) {
  try {
    const response = await fetch(
      `${WHATSAPP_API_URL}/${PHONE_NUMBER_ID}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${WHATSAPP_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to,
          type: "text",
          text: { body: message },
        }),
      }
    )

    return await response.json()
  } catch (error) {
    console.error("WhatsApp error:", error)
    throw error
  }
}

export async function sendDonationConfirmation(
  phone: string,
  amount: number,
  purpose: string
) {
  const message = `🙏 दान सफल!

आपका दान सफलतापूर्वक प्राप्त हो गया है।

राशि: ₹${amount}
उद्देश्य: ${purpose || "सामान्य दान"}

जामसावली हनुमान लोक की ओर से धन्यवाद।

🙏 जय श्री हनुमान!`

  return sendWhatsAppMessage(phone, message)
}

export async function sendBookingConfirmation(
  phone: string,
  poojaName: string,
  date: string,
  time: string
) {
  const message = `🙏 पूजा बुकिंग पुष्टि!

आपकी पूजा सफलतापूर्वक बुक हो गई है।

पूजा: ${poojaName}
तिथि: ${date}
समय: ${time}

कृपया निर्धारित समय पर मंदिर में उपस्थित हों।

🙏 जय श्री हनुमान!`

  return sendWhatsAppMessage(phone, message)
}
```

- [ ] **Step 2: Create WhatsApp webhook**

```typescript
// src/app/api/whatsapp/route.ts
import { NextResponse } from "next/server"
import { sendWhatsAppMessage } from "@/lib/whatsapp"

// Webhook verification
export async function GET(req: Request) {
  const url = new URL(req.url)
  const mode = url.searchParams.get("hub.mode")
  const token = url.searchParams.get("hub.verify_token")
  const challenge = url.searchParams.get("hub.challenge")

  if (mode === "subscribe" && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return new Response(challenge, { status: 200 })
  }

  return new Response("Forbidden", { status: 403 })
}

// Handle incoming messages
export async function POST(req: Request) {
  try {
    const body = await req.json()

    if (body.object === "whatsapp_business_account") {
      const entry = body.entry?.[0]
      const changes = entry?.changes?.[0]
      const messages = changes?.value?.messages

      if (messages?.[0]) {
        const message = messages[0]
        const from = message.from
        const text = message.text?.body?.toLowerCase()

        // Simple bot responses
        let response = ""

        if (text?.includes("hi") || text?.includes("नमस्ते")) {
          response = `🙏 नमस्ते!

जामसावली हनुमान लोक में आपका स्वागत है।

आप हमें निम्नलिखित सेवाओं के लिए संदेश भेज सकते हैं:

1. दान करने के लिए: "दान"
2. पूजा बुक करने के लिए: "बुकिंग"
3. मंदिर की जानकारी के लिए: "जानकारी"

आपकी क्या सहायता कर सकते हैं?`
        } else if (text?.includes("दान") || text?.includes("donate")) {
          response = `💰 दान करने के लिए:

कृपया नीचे दिए गए लिंक पर क्लिक करें:
${process.env.NEXT_PUBLIC_APP_URL}/donate

🙏 आपके दान के लिए धन्यवाद!`
        } else if (text?.includes("बुकिंग") || text?.includes("booking")) {
          response = `📅 पूजा बुक करने के लिए:

कृपया नीचे दिए गए लिंक पर क्लिक करें:
${process.env.NEXT_PUBLIC_APP_URL}/book

🙏 जय श्री हनुमान!`
        } else if (text?.includes("जानकारी") || text?.includes("info")) {
          response = `🏛️ जामसावली हनुमान मंदिर

पता: ग्राम सावली, छिंदवाड़ा, मध्य प्रदेश
फोन: +91 94221 82393
वेबसाइट: ${process.env.NEXT_PUBLIC_APP_URL}

⏰ दर्शन समय:
प्रातः काल: 5:00 AM - 12:00 PM
सायं काल: 4:00 PM - 8:00 PM

🙏 जय श्री हनुमान!`
        } else {
          response = `क्षमा करें, हम आपका संदेश समझ नहीं पाए।

कृपया निम्नलिखित विकल्पों में से चुनें:
1. "दान" - दान करने के लिए
2. "बुकिंग" - पूजा बुक करने के लिए
3. "जानकारी" - मंदिर की जानकारी के लिए`
        }

        await sendWhatsAppMessage(from, response)
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("WhatsApp webhook error:", error)
    return NextResponse.json(
      { message: "Webhook processing failed" },
      { status: 500 }
    )
  }
}
```

- [ ] **Step 3: Add environment variables**

Add to `.env.example`:
```env
# WhatsApp Business API
WHATSAPP_TOKEN=""
WHATSAPP_PHONE_NUMBER_ID=""
WHATSAPP_VERIFY_TOKEN=""
```

- [ ] **Step 4: Test WhatsApp bot**

1. Set up WhatsApp Business API account
2. Configure webhook URL
3. Send test messages

- [ ] **Step 5: Commit WhatsApp integration**

```bash
git add src/app/api/whatsapp/ src/lib/whatsapp.ts
git commit -m "feat: add WhatsApp bot for devotee interaction"
```

---

## Task 9: Final Integration & Testing

**Files:**
- Modify: Various files for integration
- Create: `src/app/layout.tsx` (update)

**Interfaces:**
- Consumes: All previous tasks
- Produces: Integrated, tested application

- [ ] **Step 1: Update root layout with all providers**

```typescript
// src/app/layout.tsx
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "जामसावली हनुमान लोक - Where Faith Meets Innovation",
  description: "चमत्कारिक श्री हनुमान मंदिर का डिजिटल पारिस्थितिकी तंत्र",
  keywords: ["jamsawli", "hanuman", "mandir", "temple", "donation", "booking"],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="hi">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
```

- [ ] **Step 2: Create navigation component**

```typescript
// src/components/layout/navbar.tsx
"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"

export function Navbar() {
  const { data: session } = useSession()

  return (
    <nav className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-sacred-maroon">
          🕉️ जामसावली हनुमान लोक
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link href="/donate" className="text-gray-700 hover:text-saffron-600">
            दान करें
          </Link>
          <Link href="/book" className="text-gray-700 hover:text-saffron-600">
            पूजा बुक करें
          </Link>
          {session ? (
            <>
              <Link href="/dashboard" className="text-gray-700 hover:text-saffron-600">
                डैशबोर्ड
              </Link>
              <Button variant="outline" onClick={() => signOut()}>
                लॉगआउट
              </Button>
            </>
          ) : (
            <Link href="/login">
              <Button className="bg-saffron-500 hover:bg-saffron-600">
                लॉगिन
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
```

- [ ] **Step 3: Add Navbar to layout**

Update `src/app/layout.tsx`:
```typescript
import { Navbar } from "@/components/layout/navbar"

// In body:
<body className={inter.className}>
  <Providers>
    <Navbar />
    {children}
  </Providers>
</body>
```

- [ ] **Step 4: Run full test suite**

```bash
npm run build
npm run start
```

Test all flows:
1. Homepage loads correctly
2. Navigation works
3. Registration flow
4. Login flow
5. Donation flow
6. Booking flow
7. Dashboard access
8. Counter updates
9. WhatsApp bot responds

- [ ] **Step 5: Create README with setup instructions**

```markdown
# जामसावली हनुमान लोक - Digital Ecosystem

## Quick Start

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment: `cp .env.example .env`
4. Run database migration: `npx prisma migrate dev`
5. Seed database: `npx prisma db seed`
6. Start dev server: `npm run dev`

## Features

- 🙏 Pooja Booking System
- 💰 Secure Donation Processing
- 📊 Admin Dashboard
- 🔴 Live Devotee Counter
- 📲 WhatsApp Bot Integration
- 🌐 Bilingual (Hindi/English)

## Tech Stack

- Next.js 14+ with App Router
- TypeScript
- PostgreSQL with Prisma
- NextAuth.js
- Razorpay Payments
- Tailwind CSS + shadcn/ui

## Environment Variables

See `.env.example` for required configuration.

## Deployment

Deploy to Vercel:
```bash
npm i -g vercel
vercel
```

## License

Private - Chamatkarik Shri Hanuman Mandir Sansthan
```

- [ ] **Step 6: Final commit**

```bash
git add .
git commit -m "feat: complete Phase 1 MVP with all core features"
```

---

## Summary

This implementation plan covers:

1. ✅ Project setup with Next.js, TypeScript, Tailwind
2. ✅ PostgreSQL database with Prisma ORM
3. ✅ Multi-tenant data model
4. ✅ Authentication system (Email, Phone, Google)
5. ✅ Donation system with Razorpay
6. ✅ Pooja booking system
7. ✅ Admin dashboard
8. ✅ Live devotee counter
9. ✅ WhatsApp bot integration
10. ✅ Bilingual support (Hindi/English)

**Next Steps After Phase 1:**
- Deploy to production
- Set up monitoring
- Begin Phase 2 (Live Darshan, Prasad Delivery, AI Chatbot)
