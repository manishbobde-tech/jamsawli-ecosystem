# Roles & Permissions — MandirOS

## 1. Platform roles (`User.role`)

| Role | Scope | Typical person |
|------|-------|----------------|
| `DEVOTEE` | Own donations/bookings | App user |
| `ADMIN` | One org’s temples (temple admin) | Temple manager |
| `TRUSTEE` | Org oversight, reports, trust config | Board member |
| `SUPER_ADMIN` | All tenants, applications, platform | MandirOS employee |

Org membership also via `UserOrganization` / `User.organizationId`.

## 2. Capability matrix

| Capability | Devotee | Clerk* | Temple Admin | Trustee | Super Admin |
|------------|:-------:|:------:|:------------:|:-------:|:-----------:|
| Donate / book (public) | ✓ | ✓ | ✓ | ✓ | ✓ |
| Money desk | | ✓ | ✓ | ✓ | ✓ |
| Daily ops checklist | | ✓ | ✓ | ✓ | ✓ |
| Weekly report | | view | ✓ | ✓ | ✓ |
| 80G trust settings | | | ✓ | ✓ | ✓ |
| Form 10BD export | | | plan | plan | ✓ |
| Team invite / roles | | | ✓ | ✓ | ✓ |
| Widgets / API keys | | | plan | plan | ✓ |
| Billing / plan change | | | ✓ | ✓ | ✓ |
| Approve temple applications | | | | | ✓ |
| Cross-tenant analytics | | | | | ✓ |

\*Clerk = temple staff with ADMIN role limited by training; product may use ADMIN for both manager and clerk until finer roles ship.

## 3. Plan gates (separate from roles)

Even Super Admin UX for a temple respects **plan entitlements** for product features (AI, 10BD, etc.) unless operating platform tools.

Source of truth: `src/lib/plans.ts` + `src/lib/entitlements.ts`.

## 4. Security rules

1. Never give SUPER_ADMIN to temple staff.  
2. Temple ADMIN only for their `organizationId`.  
3. API keys only Trust Pro; rotate on staff exit.  
4. Support staff accessing production: log reason; minimize PAN exposure.  
5. Offboard: disable user, rotate keys, remove org membership same day.  

## 5. How to grant access (ops)

### MandirOS employee → Super Admin
```
# Via seed script or DB (founder only)
role = SUPER_ADMIN
```

### Temple trustee / admin
Use **Dashboard → Team** (`/dashboard/team`) or API `POST /api/admin/team`.

### Counter clerk
Create user, set `ADMIN` or `TRUSTEE` carefully; train on [COUNTER_CLERK_GUIDE](../guides/COUNTER_CLERK_GUIDE.md) only.

## 6. Audit expectations

Paying temples should know:

- Who has dashboard access  
- Who can issue 80G  
- Who can change billing  

List maintained in Team page + optional spreadsheet for boards.
