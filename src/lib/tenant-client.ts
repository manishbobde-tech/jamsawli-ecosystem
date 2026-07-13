/** Client-safe default tenant (must be NEXT_PUBLIC_*). Prefer TenantContext when available. */
export const DEFAULT_TENANT_SLUG =
  process.env.NEXT_PUBLIC_DEFAULT_TENANT || "jamsawli-hanuman"
