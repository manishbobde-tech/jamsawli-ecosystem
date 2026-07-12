# MandirOS Multi-Tenant SaaS Architecture

## Vision
Transform the single-temple Jamsawli site into **MandirOS** — a multi-tenant SaaS platform serving 300+ temples across India, targeting $1M ARR (₹8.3Cr/yr).

## Target Revenue Model
SaaS subscription tiers (from design session):

| Tier | Price | Key Differentiator | Target Temples |
|------|-------|--------------------|----------------|
| Basic | ₹2,500/mo | Temple page, donations, booking, dashboard | 200 |
| Pro | ₹5,000/mo | + Custom subdomain, WhatsApp, lower fees | 75 |
| Enterprise | ₹10,000/mo | + Custom domain, AI chatbot, SMS, API, account mgr | 25 |

Transaction fees: 5% Basic / 3% Pro / 1% Enterprise on donations+bookings.
Target: 300 temples avg ₹3,000/mo → ₹9L/mo subscriptions + transaction fees.

## Architecture: Three Workstreams

### Workstream 1: Tenant Infrastructure (Foundation)

**Goal:** Every request knows which temple/org it belongs to, from middleware through database.

**Components:**

1. **Tenant Middleware** (`src/middleware.ts`)
   - Detect tenant from: subdomain → path prefix → header (for API) → session
   - `subdomain.mandiros.com` → look up temple by subdomain
   - `mandiros.com/temple-slug` → extract from path
   - Attach `x-tenant-id`, `x-org-id`, `x-temple-slug` to request headers
   - Fast path: cache resolved temple in memory (LRU, 5min TTL)

2. **Tenant Context** (`src/lib/tenant-context.tsx`)
   - React context provider wrapping `<html>` in layout
   - Reads `x-tenant-*` headers at server, passes to client via `TenantProvider`
   - All components access current temple via `useTemple()` hook
   - Available: temple.id, temple.slug, temple.name, org.id, org.slug

3. **Session Fix** (`src/lib/auth.ts`)
   - Add `role`, `organizationId` to JWT token (from DB on sign-in)
   - Pass through to session callback
   - `useSession()` returns `user.role`, `user.organizationId`, `user.templeId` (if temple admin)

4. **Prisma Auto-Scoping** (optional safety net via `src/lib/prisma.ts` extension)
   - Not full RLS, but a helper: `prisma.withTemple(templeId)` returns a wrapped client that auto-adds `where: { templeId }` to every query on temple-scoped models
   - Used only where explicitly opted in

**Files created:**
- `src/middleware.ts`
- `src/lib/tenant-context.tsx`
- `src/hooks/useTemple.ts`
- `src/lib/prisma-scope.ts`

**Files modified:**
- `src/lib/auth.ts` — session enhancer
- `src/app/layout.tsx` — wrap with TenantProvider
- `src/lib/temple.ts` — remove hardcoded defaults, read from headers
- `.env.example` — add `NEXT_PUBLIC_DEFAULT_TENANT` (for local dev only)

### Workstream 2: Data Isolation (Critical Fixes)

**Goal:** Zero data leaks across tenants. Every query scoped by templeId or orgId.

**Files to fix (in order of severity):**

1. **Admin API routes** (8 files) — add session-based orgId filter
   - `api/admin/analytics/route.ts` — all aggregates filtered by `session.user.organizationId`
   - `api/admin/bookings/route.ts` — `where: { temple: { organizationId: session.user.organizationId } }`
   - `api/admin/donations/route.ts` — same pattern
   - `api/admin/subscriptions/route.ts` — `where: { temple: { organizationId: ... } }`
   - `api/admin/payouts/route.ts` — same
   - `api/admin/pricing/route.ts` — same
   - `api/admin/temples/route.ts` — `where: { organizationId: session.user.organizationId }`
   - `api/admin/applications/route.ts` — `where: { organizationId: ... }`

2. **Counter** — `api/counter/increment/route.ts` — accept templeSlug, scope counter name like `daily_visitors:{templeId}`

3. **Check-in** — `api/checkin/route.ts` — accept templeSlug, set `templeId` on Visit creation

4. **Gamification** — `lib/gamification.ts`:
   - `getLeaderboard(period, templeId?)` — filter by templeId
   - `updateStreak(userId, type, templeId?)` — scope streak to temple
   - `checkAndAwardBadges(userId, templeId?)` — scope badge checks
   - Add `templeId` to `leaderboard.findMany`, `userStreak.upsert`, `userBadge.create`

5. **Pilgrim services** — `api/pilgrim/sos/route.ts` and `api/pilgrim/lost-found/route.ts` — wire to DB with templeId

6. **Prisma schema changes:**
   - Add `UserOrganization` join table (userId + organizationId + role)
   - Make `User.organizationId` nullable
   - Add `templeId` to: `Leaderboard`, `UserStreak`, `UserBadge`, `SosAlert`, `LostFoundItem`
   - Add `organizationId` to: `DailyWisdom` (or make per-temple)
   - Run migration

7. **Frontend defaults** — Remove all `= "jamsawli-hanuman"` defaults from components. Replace with reading from TenantContext. Default behavior: redirect to tenant selection if no temple detected.

### Workstream 3: ARR Product Features

**Goal:** Convert the platform from free to paid, enabling recurring subscription revenue.

**Components:**

1. **Razorpay Subscriptions API** (`api/subscriptions/`)
   - `POST /api/subscriptions/create` — creates Razorpay subscription link for temple
   - `POST /api/subscriptions/webhook` — handles `subscription.activated`, `subscription.charged`, `subscription.cancelled`
   - `GET /api/subscriptions/status` — check if temple's subscription is active
   - Model: `TempleSubscription` already exists with `templeId`, `plan`, `status`, `startDate`, `endDate`

2. **Temple Admin Roles** (`api/admin/temples/[id]/admins/`)
   - Temple admin can manage: poojas, events, pricing, dashboard
   - Super admin manages: temples, applications, platform settings
   - Role middleware: `requireRole('TEMPLE_ADMIN')`, `requireRole('SUPER_ADMIN')`

3. **Per-Temple Branding**
   - Temple model gains: `logoUrl`, `primaryColor`, `secondaryColor`, `headerTemplate` (JSON config)
   - TenantContext exposes theme overrides
   - Layout reads theme from tenant context, applies CSS variables dynamically
   - Per-temple SEO metadata from Temple model

4. **Widget System** (embed on temple's own website)
   - `<script src="https://mandiros.com/widget.js" data-temple="slug">` — embeddable donation/booking widget
   - CORS headers on API for allowed domains
   - Lightweight iframe or JS SDK

5. **Developer API**
   - API key model: `ApiKey { id, templeId, name, key, scopes, createdAt, lastUsedAt }`
   - Key generation: `crypto.randomBytes(32).toString('hex')`
   - Rate limiting: 100 req/min per key
   - Middleware: `authenticateApiKey` for public API routes
   - `GET /api/v1/temple` — public temple data
   - `GET /api/v1/poojas`
   - `POST /api/v1/donations`
   - OpenAPI spec at `/api/docs`

## Implementation Order (within each workstream)

### W1 (Tenant Infrastructure)
1. Session fix (auth.ts) — unblocks admin UI immediately
2. Tenant middleware (middleware.ts) — tenant detection
3. Tenant context + useTemple hook — client-side awareness
4. Layout wrapper — TenantProvider
5. Prisma scoping helper

### W2 (Data Isolation)
1. Admin API routes — biggest security risk first
2. Counter + check-in — functional correctness
3. Gamification — tenant leaderboards
4. Pilgrim SOS/LostFound — wire to DB
5. Schema changes (UserOrganization, templeId on gamification models)
6. Remove all default slugs

### W3 (ARR Features)
1. Subscription billing (Razorpay integration) — unlocks revenue
2. Temple admin roles — enables self-service
3. Per-temple branding — makes each temple look distinct
4. Developer API — enables ecosystem
5. Widget system — distribution channel

## Success Criteria
- A new temple can onboard end-to-end and get a working page with their branding via subdomain/path
- Temple admin sees ONLY their temple's data in admin panel
- Super admin sees ALL temples' data
- User can visit multiple temples with one account
- Temple can pay subscription via Razorpay, service degrades if unpaid
- Developer can make API calls with API key
- Build passes, no regression on Jamsawli temple

## Non-Goals (future)
- Mobile apps (PWA is sufficient for now)
- On-premise deployment (cloud only)
- Multi-language beyond Hindi/English
- Real-time streaming (architectural foundation only)
