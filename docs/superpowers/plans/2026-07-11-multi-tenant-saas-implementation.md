# MandirOS Multi-Tenant SaaS Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform single-temple Jamsawli site into multi-tenant MandirOS with tenant infrastructure, data isolation, and ARR product features.

**Architecture:** Three parallel workstreams — W1 (tenant middleware/context/session), W2 (data isolation fixes), W3 (subscription billing + temple admin + branding + developer API). W1 + W2 run in parallel, W3 depends on W1.

**Tech Stack:** Next.js 14 App Router, Prisma ORM, Supabase (PostgreSQL), NextAuth.js, Razorpay, shadcn/ui

## Global Constraints
- Subdomain-based AND path-based tenant routing (both supported)
- SaaS subscription tiers: Basic ₹2,500/mo, Pro ₹5,000/mo, Enterprise ₹10,000/mo
- Transaction fees: 5% / 3% / 1% by tier
- Session must include: user.id, user.role, user.organizationId
- All default temple slugs must be removed — temple context comes from middleware/context
- Hindi + English bilingual UI
- Build must pass with `npm run build`

---

## File Structure

### Created Files
| File | Purpose |
|------|---------|
| `src/middleware.ts` | Tenant detection from subdomain/path/headers |
| `src/lib/tenant-context.tsx` | React context provider + useTemple hook |
| `src/hooks/useTemple.ts` | Typed hook for consuming tenant context |
| `src/lib/prisma-scope.ts` | Prisma wrapper for auto-scoping queries |
| `src/components/admin/role-gate.tsx` | Role-based access control component |
| `src/app/api/subscriptions/create/route.ts` | Create Razorpay subscription |
| `src/app/api/subscriptions/webhook/route.ts` | Handle subscription lifecycle |
| `src/app/api/admin/temples/[id]/admins/route.ts` | Temple admin management |
| `src/app/api/v1/...` | Public developer API routes |
| `src/app/api/docs/route.ts` | OpenAPI spec endpoint |

### Modified Files
| File | Change |
|------|--------|
| `src/lib/auth.ts` | Add role/orgId to JWT + session |
| `src/app/layout.tsx` | Wrap with TenantProvider |
| `src/lib/temple.ts` | Remove hardcoded defaults |
| `prisma/schema.prisma` | Add UserOrganization, templeId on gamification/pilgrim models |
| `src/app/api/admin/analytics/route.ts` | Add orgId filter |
| `src/app/api/admin/bookings/route.ts` | Add orgId filter |
| `src/app/api/admin/donations/route.ts` | Add orgId filter |
| `src/app/api/admin/subscriptions/route.ts` | Add orgId filter |
| `src/app/api/admin/payouts/route.ts` | Add orgId filter |
| `src/app/api/admin/pricing/route.ts` | Add orgId filter |
| `src/app/api/admin/temples/route.ts` | Add orgId filter |
| `src/app/api/admin/applications/route.ts` | Add orgId filter |
| `src/app/api/counter/increment/route.ts` | Accept templeSlug, scope counter |
| `src/app/api/checkin/route.ts` | Accept templeSlug, set templeId on Visit |
| `src/lib/gamification.ts` | Add templeId to leaderboard/streak/badge queries |
| `src/app/api/pilgrim/sos/route.ts` | Wire to DB with templeId |
| `src/app/api/pilgrim/lost-found/route.ts` | Wire to DB with templeId |
| All client components (pooja-list, fund-tracker, project-tracker, devotee-counter, donation-form, booking-form, booking-form) | Remove default templeSlug, read from TenantContext |

---

## Workstream 1: Tenant Infrastructure

### Task W1-1: Fix Session — Add role + organizationId to JWT

**Files:**
- Modify: `src/lib/auth.ts`

**Context:** The session currently passes only `user.id`. Admin UI never shows because `(session.user as any)?.role` is undefined. This must be fixed first.

- [ ] Read current `src/lib/auth.ts`

- [ ] Update `authorize` callback to query DB for user role and orgId

- [ ] Update `jwt` callback to include role + organizationId + templeId

- [ ] Update `session` callback to pass these to the client

```typescript
// In jwt callback — after the existing token logic
if (user) {
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    include: {
      organization: { select: { id: true, slug: true } },
      userOrganizations: {
        include: { organization: true },
        take: 1,
      },
    },
  })
  if (dbUser) {
    token.role = dbUser.role
    token.organizationId = dbUser.organizationId || dbUser.userOrganizations[0]?.organizationId
    token.orgSlug = dbUser.organization?.slug || dbUser.userOrganizations[0]?.organization.slug
  }
}

// In session callback
if (token) {
  session.user.id = token.sub as string
  session.user.role = token.role as string
  session.user.organizationId = token.organizationId as string
  ;(session.user as any).orgSlug = token.orgSlug as string
}
```

Need to extend the session type in `types/next-auth.d.ts`:

```typescript
import "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      role?: string
      organizationId?: string
    }
  }
}
```

- [ ] Run build to verify no TypeScript errors

- [ ] Commit: `git add src/lib/auth.ts types/next-auth.d.ts && git commit -m "fix(auth): add role and orgId to session"`

---

### Task W1-2: Prisma Schema Changes for Multi-Tenant

**Files:**
- Modify: `prisma/schema.prisma`

**Changes needed:**

1. Add UserOrganization join table (replaces single `User.organizationId`)
2. Add `templeId` to: `Leaderboard`, `UserStreak`, `UserBadge`, `SosAlert`, `LostFoundItem`
3. Add `organizationId` to `DailyWisdom`
4. Make `User.organizationId` optional

```prisma
// Add after User model (before Visit/other models)
model UserOrganization {
  id             String       @id @default(cuid())
  userId         String
  organizationId String
  role           String       @default("DEVOTEE") // DEVOTEE, TEMPLE_ADMIN, SUPER_ADMIN
  createdAt      DateTime     @default(now())

  user         User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)

  @@unique([userId, organizationId])
  @@index([userId])
  @@index([organizationId])
}
```

Change `User.organizationId` to optional:
```prisma
organizationId String?   // was String (required)
```

Add to `User` model:
```prisma
userOrganizations UserOrganization[]
```

Add `templeId` to gamification models:
```prisma
model Leaderboard {
  // ... existing fields
  templeId  String?
  temple    Temple?  @relation(fields: [templeId], references: [id])

  @@index([templeId])
}

model UserStreak {
  // ... existing fields
  templeId  String?
  temple    Temple?  @relation(fields: [templeId], references: [id])

  @@index([templeId])
}

model UserBadge {
  // ... existing fields
  templeId  String?
  temple    Temple?  @relation(fields: [templeId], references: [id])

  @@index([templeId])
}
```

Add `templeId` to pilgrim models:
```prisma
model SosAlert {
  // ... existing fields  
  templeId  String
  temple    Temple  @relation(fields: [templeId], references: [id])

  @@index([templeId])
  @@index([status])
}

model LostFoundItem {
  // ... existing fields
  templeId  String
  temple    Temple  @relation(fields: [templeId], references: [id])

  @@index([templeId])
}
```

Add `organizationId` to `DailyWisdom`:
```prisma
model DailyWisdom {
  // ... existing fields
  organizationId String?
  organization   Organization? @relation(fields: [organizationId], references: [id])
}
```

Add subscription plan fields to Temple:
```prisma
model Temple {
  // ... existing fields
  subscriptionPlan String @default("basic") // basic, pro, enterprise
  subscriptionStatus String @default("active") // active, inactive, past_due, cancelled
  subscriptionEndDate DateTime?
  // ... rest of existing fields
}
```

- [ ] Run `npx prisma migrate dev --name multi-tenant-schema` to create migration
- [ ] Run `npx prisma generate` to regenerate client
- [ ] Commit: `git add prisma/ && git commit -m "feat(schema): multi-tenant schema with UserOrganization join table"`

---

### Task W1-3: Tenant Middleware

**Files:**
- Create: `src/middleware.ts`

**Context:** Detect tenant from subdomain OR path prefix. Attach to request headers. Cache resolved tenants in memory (LRU, 5min TTL).

```typescript
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"

const tenantCache = new Map<string, { templeId: string; orgId: string; slug: string }>()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || ""
  const url = new URL(request.url)
  const pathParts = url.pathname.split("/").filter(Boolean)

  // Skip for API routes, static files, Next.js internals
  if (
    pathParts[0] === "api" ||
    pathParts[0] === "_next" ||
    pathParts[0] === "favicon.ico" ||
    pathParts[0] === "images"
  ) {
    return NextResponse.next()
  }

  let templeSlug: string | null = null

  // 1. Subdomain detection: templename.mandiros.com
  const parts = hostname.split(".")
  if (parts.length >= 3 && parts[0] !== "www") {
    templeSlug = parts[0]
  }

  // 2. Path detection: mandiros.com/temple-slug/...
  if (!templeSlug && pathParts.length >= 1) {
    // Check if first path segment is a known temple slug
    const potentialSlug = pathParts[0]
    if (potentialSlug !== "admin" && potentialSlug !== "donate" && potentialSlug !== "book") {
      // Verify it's a real temple (cache check)
      const cached = tenantCache.get(potentialSlug)
      if (cached || await isValidTemple(potentialSlug)) {
        templeSlug = potentialSlug
      }
    }
  }

  if (templeSlug) {
    // Resolve and cache tenant info
    let tenant = tenantCache.get(templeSlug)
    if (!tenant) {
      const temple = await prisma.temple.findFirst({
        where: { slug: templeSlug },
        select: { id: true, organizationId: true, slug: true },
      })
      if (temple) {
        tenant = { templeId: temple.id, orgId: temple.organizationId, slug: temple.slug }
        tenantCache.set(templeSlug, tenant)
        setTimeout(() => tenantCache.delete(templeSlug), CACHE_TTL)
      }
    }

    if (tenant) {
      const requestHeaders = new Headers(request.headers)
      requestHeaders.set("x-tenant-id", tenant.templeId)
      requestHeaders.set("x-org-id", tenant.orgId)
      requestHeaders.set("x-temple-slug", tenant.slug)

      // If path-based, rewrite to remove slug prefix for internal routing
      let rewritePath = url.pathname
      if (pathParts[0] === templeSlug) {
        rewritePath = "/" + pathParts.slice(1).join("/") || "/"
      }

      return NextResponse.rewrite(new URL(rewritePath, request.url), {
        request: { headers: requestHeaders },
      })
    }
  }

  return NextResponse.next()
}

async function isValidTemple(slug: string): Promise<boolean> {
  const count = await prisma.temple.count({ where: { slug } })
  return count > 0
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
```

- [ ] Create `src/middleware.ts` with the above content
- [ ] Commit: `git add src/middleware.ts && git commit -m "feat(tenant): add tenant detection middleware"`

---

### Task W1-4: Tenant Context Provider + useTemple Hook

**Files:**
- Create: `src/lib/tenant-context.tsx`
- Create: `src/hooks/useTemple.ts`

**Context:** Client-side React context that surfaces the current temple. Reads `x-tenant-*` cookies/headers set by middleware.

```typescript
// src/lib/tenant-context.tsx
"use client"

import { createContext, useContext, ReactNode } from "react"

export interface TempleContextType {
  templeId: string
  templeSlug: string
  templeName: string
  templeNameHi: string
  organizationId: string
  organizationName: string
}

const TempleContext = createContext<TempleContextType | null>(null)

interface TenantProviderProps {
  children: ReactNode
  temple: TempleContextType | null
}

export function TenantProvider({ children, temple }: TenantProviderProps) {
  return (
    <TempleContext.Provider value={temple}>
      {children}
    </TempleContext.Provider>
  )
}

export { TempleContext }
```

```typescript
// src/hooks/useTemple.ts
"use client"

import { useContext } from "react"
import { TempleContext, TempleContextType } from "@/lib/tenant-context"

export function useTemple(): TempleContextType {
  const context = useContext(TempleContext)
  if (!context) {
    throw new Error("useTemple must be used within a TenantProvider")
  }
  return context
}

export function useOptionalTemple(): TempleContextType | null {
  return useContext(TempleContext)
}
```

- [ ] Create both files
- [ ] Commit: `git add src/lib/tenant-context.tsx src/hooks/useTemple.ts && git commit -m "feat(tenant): add tenant context provider and useTemple hook"`

---

### Task W1-5: Layout Wrapper — Feed Tenant to Client

**Files:**
- Modify: `src/app/layout.tsx`

**Context:** The root layout must detect the tenant server-side (from headers placed by middleware) and pass it to TenantProvider.

```typescript
import { headers } from "next/headers"
import { prisma } from "@/lib/prisma"
import { TenantProvider } from "@/lib/tenant-context"
// ... existing imports

// Make layout async to fetch tenant data
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const headersList = headers()
  const templeId = headersList.get("x-tenant-id")
  const templeSlug = headersList.get("x-temple-slug")

  // Resolve temple info
  let templeData = null
  if (templeId) {
    const temple = await prisma.temple.findUnique({
      where: { id: templeId },
      select: {
        id: true,
        slug: true,
        name: true,
        nameHi: true,
        organizationId: true,
        organization: { select: { name: true } },
      },
    })
    if (temple) {
      templeData = {
        templeId: temple.id,
        templeSlug: temple.slug,
        templeName: temple.name,
        templeNameHi: temple.nameHi || temple.name,
        organizationId: temple.organizationId,
        organizationName: temple.organization.name,
      }
    }
  }

  return (
    <html lang="hi" suppressHydrationWarning>
      <body className={inter.className}>
        <TenantProvider temple={templeData}>
          {/* existing layout content */}
        </TenantProvider>
      </body>
    </html>
  )
}
```

- [ ] Update `src/app/layout.tsx` with tenant-aware wrapper
- [ ] Build and verify no TypeScript errors
- [ ] Commit: `git add src/app/layout.tsx && git commit -m "feat(tenant): wire tenant context into layout"`

---

## Workstream 2: Data Isolation

### Task W2-1: Admin API Routes — Add OrgId Filtering

**Files:**
- Modify: `src/app/api/admin/analytics/route.ts`
- Modify: `src/app/api/admin/bookings/route.ts`
- Modify: `src/app/api/admin/donations/route.ts`
- Modify: `src/app/api/admin/subscriptions/route.ts`
- Modify: `src/app/api/admin/payouts/route.ts`
- Modify: `src/app/api/admin/pricing/route.ts`
- Modify: `src/app/api/admin/temples/route.ts`
- Modify: `src/app/api/admin/applications/route.ts`

**Pattern for every admin route:**

Before:
```typescript
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user) return unauthorized

  const data = await prisma.donation.findMany() // NO FILTER — GLOBAL DATA LEAK
}
```

After:
```typescript
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user) return unauthorized

  const orgId = (session.user as any).organizationId
  if (!orgId) {
    return NextResponse.json({ message: "No organization" }, { status: 403 })
  }

  const data = await prisma.donation.findMany({
    where: {
      temple: { organizationId: orgId }  // SCOPED TO ORG
    }
  })
}
```

**Specific where clauses for each route:**

- **analytics:** `temple: { organizationId: orgId }` on all aggregate queries
- **bookings:** `temple: { organizationId: orgId }`
- **donations:** `temple: { organizationId: orgId }`
- **subscriptions:** `temple: { organizationId: orgId }`
- **payouts:** `temple: { organizationId: orgId }` (Payout has templeId field)
- **pricing:** `temple: { organizationId: orgId }` (CommissionConfig has templeId)
- **temples:** `organizationId: orgId`
- **applications:** `organizationId: orgId`

- [ ] Read each admin route file
- [ ] Apply the orgId filter pattern to all 8 files
- [ ] Build and verify
- [ ] Commit: `git add src/app/api/admin/ && git commit -m "fix(admin): scope admin API queries to user's organization"`

---

### Task W2-2: Fix Counter — Per-Temple Scoping

**Files:**
- Modify: `src/app/api/counter/increment/route.ts`

**Context:** The GET route was already fixed in a previous session. The increment route still uses the global counter.

```typescript
// Current (broken):
await prisma.counter.upsert({
  where: { name: "daily_visitors" },
  update: { value: { increment: 1 } },
  create: { name: "daily_visitors", value: 1 },
})

// Fixed:
const { searchParams } = new URL(req.url)
const templeSlug = searchParams.get("templeSlug") || "jamsawli-hanuman"
const temple = await resolveTemple(templeSlug)
const counterName = `daily_visitors:${temple.id}`

await prisma.counter.upsert({
  where: { name: counterName },
  update: { value: { increment: 1 } },
  create: { name: counterName, value: 1 },
})
```

- [ ] Read `src/app/api/counter/increment/route.ts`
- [ ] Apply the per-temple scoping change
- [ ] Commit

---

### Task W2-3: Fix Check-In — Pass TempleId on Visit

**Files:**
- Modify: `src/app/api/checkin/route.ts`

**Changes:**
1. Accept `templeSlug` from request body (alongside userId)
2. Resolve temple from slug
3. Pass `templeId` to Visit creation
4. Scope counter increment to temple

```typescript
// In the POST handler:
const { userId, templeSlug } = await req.json()
const temple = await resolveTemple(templeSlug)

const visit = await prisma.visit.create({
  data: {
    userId,
    templeId: temple.id,
    checkInTime: new Date(),
  },
})

// Also fix the counter increment call to use temple slug
```

- [ ] Read and modify `src/app/api/checkin/route.ts`
- [ ] Commit

---

### Task W2-4: Fix Gamification — Add TempleId

**Files:**
- Modify: `src/lib/gamification.ts`

**Changes:**
- `getLeaderboard(period, templeId?)` — add `templeId` to `where` clause
- `updateStreak(userId, type, templeId?)` — add `templeId` to streak upsert
- `checkAndAwardBadges(userId, templeId?)` — scope badge awarding

```typescript
// getLeaderboard — add templeId filter
export async function getLeaderboard(period: string, limit: number = 10, templeId?: string) {
  return prisma.leaderboard.findMany({
    where: {
      period,
      ...(templeId ? { templeId } : {}),
    },
    orderBy: { points: "desc" },
    take: limit,
    include: {
      user: { select: { name: true, image: true } },
    },
  })
}

// updateStreak — scope to temple
export async function updateStreak(userId: string, type: string, templeId?: string) {
  const today = new Date()
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate())

  const existing = await prisma.userStreak.findFirst({
    where: {
      userId,
      type,
      ...(templeId ? { templeId } : {}),
    },
  })

  if (existing) {
    const yesterday = new Date(startOfDay)
    yesterday.setDate(yesterday.getDate() - 1)
    const lastUpdated = new Date(existing.lastUpdated)

    if (lastUpdated >= startOfDay) return existing // already updated today

    const isConsecutive = lastUpdated >= yesterday
    return prisma.userStreak.update({
      where: { id: existing.id },
      data: {
        currentStreak: isConsecutive ? { increment: 1 } : 1,
        longestStreak: isConsecutive ? Math.max(existing.longestStreak, existing.currentStreak + 1) : Math.max(existing.longestStreak, 1),
        lastUpdated: new Date(),
      },
    })
  }

  return prisma.userStreak.create({
    data: { userId, type, currentStreak: 1, longestStreak: 1, templeId },
  })
}
```

- [ ] Read `src/lib/gamification.ts`
- [ ] Apply scoping changes
- [ ] Commit

---

### Task W2-5: Fix Pilgrim Services — Wire to DB

**Files:**
- Modify: `src/app/api/pilgrim/sos/route.ts`
- Modify: `src/app/api/pilgrim/lost-found/route.ts`

**SOS:**
```typescript
import { prisma } from "@/lib/prisma"
import { resolveTemple } from "@/lib/temple"

export async function POST(req: Request) {
  try {
    const { userId, templeSlug, type, location, message } = await req.json()
    const temple = await resolveTemple(templeSlug)

    const alert = await prisma.sosAlert.create({
      data: {
        userId,
        templeId: temple.id,
        type: type || "MEDICAL",
        location: location || "",
        message: message || "",
        status: "ACTIVE",
      },
    })

    return NextResponse.json({ success: true, alertId: alert.id })
  } catch (error) {
    return NextResponse.json({ message: "SOS failed" }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const templeSlug = searchParams.get("templeSlug")
    const temple = await resolveTemple(templeSlug)

    const alerts = await prisma.sosAlert.findMany({
      where: {
        templeId: temple.id,
        status: "ACTIVE",
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    })

    return NextResponse.json({ alerts })
  } catch (error) {
    return NextResponse.json({ message: "Failed" }, { status: 500 })
  }
}
```

**LostFound:**
```typescript
import { prisma } from "@/lib/prisma"
import { resolveTemple } from "@/lib/temple"

export async function POST(req: Request) {
  try {
    const { userId, templeSlug, type, description, location, contact } = await req.json()
    const temple = await resolveTemple(templeSlug)

    const item = await prisma.lostFoundItem.create({
      data: {
        userId,
        templeId: temple.id,
        type: type || "LOST",
        description,
        location,
        contactInfo: contact,
        status: "OPEN",
      },
    })

    return NextResponse.json({ success: true, itemId: item.id })
  } catch (error) {
    return NextResponse.json({ message: "Failed" }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const templeSlug = searchParams.get("templeSlug")
    const temple = await resolveTemple(templeSlug)

    const items = await prisma.lostFoundItem.findMany({
      where: { templeId: temple.id },
      orderBy: { createdAt: "desc" },
      take: 50,
    })

    return NextResponse.json({ items })
  } catch (error) {
    return NextResponse.json({ message: "Failed" }, { status: 500 })
  }
}
```

- [ ] Read and modify both files
- [ ] Commit

---

### Task W2-6: Remove All Default Temple Slugs from Components

**Files to modify (every client component with a default):**
- `src/components/booking/pooja-list.tsx` — remove `= "jamsawli-hanuman"` default
- `src/components/booking/booking-form.tsx` — remove `= "jamsawli-hanuman"` default
- `src/components/transparency/fund-tracker.tsx` — remove `= "jamsawli-hanuman"` default
- `src/components/transparency/project-tracker.tsx` — remove `= "jamsawli-hanuman"` default
- `src/components/counter/devotee-counter.tsx` — remove `= "jamsawli-hanuman"` default
- `src/components/donation/donation-form.tsx` — remove `= "jamsawli-hanuman"` from any fallback
- `src/lib/temple.ts` — remove `DEFAULT_TEMPLE_SLUG` and `DEFAULT_ORG_SLUG` constants

**Pattern change for each component:**

Before:
```typescript
export function Component({ templeSlug = "jamsawli-hanuman" }: { templeSlug?: string }) {
```

After:
```typescript
export function Component({ templeSlug }: { templeSlug: string }) {
  // templeSlug is now required — must be passed or from context
```

Pages that render these components must now pass templeSlug from the TenantProvider:
```typescript
import { useTemple } from "@/hooks/useTemple"

// Inside component:
const { templeSlug } = useTemple()
// Then pass to child components
```

- [ ] Update `src/lib/temple.ts` — remove defaults, make slug required
- [ ] Update all 6 client components — make templeSlug required
- [ ] Update all pages that render these components to use `useTemple()`
- [ ] Build and verify
- [ ] Commit

---

## Workstream 3: ARR Product Features

### Task W3-1: Subscription Billing Integration

**Files:**
- Create: `src/app/api/subscriptions/create/route.ts`
- Create: `src/app/api/subscriptions/webhook/route.ts`
- Modify: `src/app/api/admin/pricing/route.ts` (already scoped in W2-1)

**Create subscription (called when temple admin selects a plan):**
```typescript
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { razorpay } from "@/lib/razorpay"

const PLAN_PRICES: Record<string, number> = {
  basic: 250000,    // ₹2,500 × 100 (paise)
  pro: 500000,      // ₹5,000 × 100
  enterprise: 1000000, // ₹10,000 × 100
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== "SUPER_ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 })
    }

    const { templeId, plan } = await req.json()
    if (!PLAN_PRICES[plan]) {
      return NextResponse.json({ message: "Invalid plan" }, { status: 400 })
    }

    const temple = await prisma.temple.findUnique({
      where: { id: templeId },
    })
    if (!temple) {
      return NextResponse.json({ message: "Temple not found" }, { status: 404 })
    }

    // Create Razorpay subscription
    const subscription = await razorpay.subscriptions.create({
      plan_id: process.env[`RAZORPAY_${plan.toUpperCase()}_PLAN_ID`] || "",
      total_count: 12,
      customer_notify: 1,
      notes: {
        templeId,
        organizationId: temple.organizationId,
      },
    })

    // Store in DB
    const templeSub = await prisma.templeSubscription.create({
      data: {
        templeId,
        plan,
        status: "PENDING",
        startDate: new Date(),
        subscriptionId: subscription.id,
      },
    })

    return NextResponse.json({
      subscriptionId: subscription.id,
      shortUrl: subscription.short_url,
      templeSubId: templeSub.id,
    })
  } catch (error) {
    console.error("Subscription creation error:", error)
    return NextResponse.json({ message: "Failed" }, { status: 500 })
  }
}
```

**Webhook handler:**
```typescript
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import crypto from "crypto"

export async function POST(req: Request) {
  try {
    const body = await req.text()
    const signature = req.headers.get("x-razorpay-signature")

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(body)
      .digest("hex")

    if (expectedSignature !== signature) {
      return NextResponse.json({ message: "Invalid signature" }, { status: 400 })
    }

    const event = JSON.parse(body)

    switch (event.event) {
      case "subscription.activated":
        await prisma.templeSubscription.updateMany({
          where: { subscriptionId: event.payload.subscription.id },
          data: { status: "ACTIVE" },
        })
        await prisma.temple.updateMany({
          where: {
            templeSubscriptions: {
              some: { subscriptionId: event.payload.subscription.id },
            },
          },
          data: {
            subscriptionStatus: "active",
            subscriptionEndDate: new Date(event.payload.subscription.end_at * 1000),
          },
        })
        break

      case "subscription.charged":
        // Payment received — could trigger notifications
        break

      case "subscription.cancelled":
        await prisma.templeSubscription.updateMany({
          where: { subscriptionId: event.payload.subscription.id },
          data: { status: "CANCELLED" },
        })
        await prisma.temple.updateMany({
          where: {
            templeSubscriptions: {
              some: { subscriptionId: event.payload.subscription.id },
            },
          },
          data: { subscriptionStatus: "cancelled" },
        })
        break
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ message: "Error" }, { status: 500 })
  }
}
```

- [ ] Create both route files
- [ ] Commit: `git add src/app/api/subscriptions/ && git commit -m "feat(billing): add Razorpay subscription creation and webhook"`

---

### Task W3-2: Temple Admin Roles

**Files:**
- Create: `src/components/admin/role-gate.tsx`
- Create: `src/app/api/admin/temples/[id]/admins/route.ts`

**Role gate component:**
```typescript
"use client"

import { useSession } from "next-auth/react"
import { ReactNode } from "react"

interface RoleGateProps {
  children: ReactNode
  fallback?: ReactNode
  allowedRoles: string[]
}

export function RoleGate({ children, fallback = null, allowedRoles }: RoleGateProps) {
  const { data: session } = useSession()
  const role = (session?.user as any)?.role

  if (allowedRoles.includes(role)) {
    return <>{children}</>
  }

  return <>{fallback}</>
}
```

**Temple admin management API:**
```typescript
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET — list admins for a temple
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

    const admins = await prisma.userOrganization.findMany({
      where: {
        organization: { temples: { some: { id: params.id } } },
        role: { in: ["TEMPLE_ADMIN", "SUPER_ADMIN"] },
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    })

    return NextResponse.json({ admins })
  } catch (error) {
    return NextResponse.json({ message: "Failed" }, { status: 500 })
  }
}

// POST — add an admin to temple's org
export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== "SUPER_ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 })
    }

    const { userId } = await req.json()
    const temple = await prisma.temple.findUnique({
      where: { id: params.id },
      select: { organizationId: true },
    })
    if (!temple) return NextResponse.json({ message: "Not found" }, { status: 404 })

    const membership = await prisma.userOrganization.upsert({
      where: {
        userId_organizationId: {
          userId,
          organizationId: temple.organizationId,
        },
      },
      update: { role: "TEMPLE_ADMIN" },
      create: {
        userId,
        organizationId: temple.organizationId,
        role: "TEMPLE_ADMIN",
      },
    })

    return NextResponse.json({ success: true, membership })
  } catch (error) {
    return NextResponse.json({ message: "Failed" }, { status: 500 })
  }
}
```

- [ ] Create `role-gate.tsx`
- [ ] Create `admins/route.ts` (create directory `src/app/api/admin/temples/[id]/admins/`)
- [ ] Commit

---

### Task W3-3: Per-Temple Branding

**Files:**
- Modify: `src/app/layout.tsx` — dynamic SEO metadata from tenant context
- Modify: Any theme/color system to support per-temple overrides

**Dynamic SEO:**
```typescript
// In layout.tsx — generateMetadata
export async function generateMetadata() {
  const headersList = headers()
  const templeId = headersList.get("x-tenant-id")

  if (templeId) {
    const temple = await prisma.temple.findUnique({
      where: { id: templeId },
      select: { name: true, nameHi: true, description: true },
    })
    if (temple) {
      return {
        title: `${temple.nameHi || temple.name} - MandirOS`,
        description: temple.description || "Digital temple ecosystem",
      }
    }
  }

  return {
    title: "MandirOS - Multi-Temple Digital Ecosystem",
    description: "Digital platform for temples across India",
  }
}
```

**CSS variable theming:**
```typescript
// In layout.tsx, add to <html> style or className
const themeStyles = temple?.primaryColor
  ? {
      "--theme-primary": temple.primaryColor,
      "--theme-secondary": temple.secondaryColor || temple.primaryColor,
    } as React.CSSProperties
  : {}
```

- [ ] Update layout.tsx with dynamic SEO
- [ ] Add CSS variable theming support
- [ ] Commit

---

### Task W3-4: Developer API + Widget System

**Files:**
- Create: `src/app/api/v1/temple/route.ts`
- Create: `src/app/api/v1/poojas/route.ts`
- Create: `src/app/api/v1/donations/route.ts`
- Create: `src/app/api/api-key.ts` (middleware helper)

**API key middleware:**
```typescript
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

  // Update last used
  await prisma.apiKey.update({
    where: { id: key.id },
    data: { lastUsedAt: new Date() },
  })

  return { templeId: key.templeId, temple: key.temple }
}
```

**V1 routes pattern:**
```typescript
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { authenticateApiKey } from "../../api-key"

export async function GET(req: Request) {
  const auth = await authenticateApiKey(req)
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  const poojas = await prisma.pooja.findMany({
    where: { templeId: auth.templeId, isActive: true },
  })

  return NextResponse.json({ poojas })
}
```

- [ ] Create `src/app/api/api-key.ts`
- [ ] Create v1 routes
- [ ] Add CORS headers
- [ ] Commit

---

### Task W3-5: API Key Model + Admin UI

**Files:**
- Modify: `prisma/schema.prisma` (add ApiKey model)
- Create: `src/app/api/admin/api-keys/route.ts`
- Modify: `src/app/admin/page.tsx` (add API keys section)

**Prisma model:**
```prisma
model ApiKey {
  id          String   @id @default(cuid())
  templeId    String
  temple      Temple   @relation(fields: [templeId], references: [id], onDelete: Cascade)
  name        String
  key         String   @unique
  scopes      String   @default("read") // read, write, read_write
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  lastUsedAt  DateTime?

  @@index([templeId])
  @@index([key])
}
```

- [ ] Add model to schema, run migration
- [ ] Create API keys admin route
- [ ] Commit

---

## Execution Plan

**Recommended order (parallel where possible):**

1. **W1-1 + W1-2** (Session fix + Schema changes) — these are independent, can run in parallel
2. **W1-3 + W1-4 + W1-5** (Middleware + Context + Layout) — sequential, each depends on previous
3. **W2-1 through W2-6** — all independent of each other, can run in parallel after schema migration
4. **W3-1 through W3-5** — depend on W1 being complete

**Parallel dispatch strategy:**
- Subagent A: W1-1 + W1-2 (schema + session)
- Subagent B: W2-1 (admin API scoping — 8 files)
- Subagent C: W2-2 + W2-3 + W2-5 (counter, checkin, pilgrim)
- After schema migrates: W2-4 + W2-6
- After W1 completes: W3-1 through W3-5
