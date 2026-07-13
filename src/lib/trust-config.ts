export interface TrustComplianceConfig {
  trustLegalName: string
  trustLegalNameHi?: string
  registrationNumber?: string
  eightyGNumber?: string
  eightyGValidFrom?: string
  eightyGValidTo?: string
  panNumber?: string
  address?: string
  city?: string
  state?: string
  pincode?: string
  authorizedSignatory?: string
  contactEmail?: string
  contactPhone?: string
}

const DEFAULT_JAMSAWLI: TrustComplianceConfig = {
  trustLegalName: "Chamatkarik Shri Hanuman Mandir Sansthan (Hanuman Lok)",
  trustLegalNameHi: "चमत्कारिक श्री हनुमान मंदिर संस्थान",
  registrationNumber: "PENDING-CONFIGURE",
  eightyGNumber: "PENDING-CONFIGURE",
  panNumber: "PENDING",
  address: "Village Sawli, Saunsar",
  city: "Chhindwara",
  state: "Madhya Pradesh",
  pincode: "480337",
  authorizedSignatory: "Authorized Trustee",
  contactEmail: "office@jamsawlihanumanmandir.com",
  contactPhone: "+91 94221 82393",
}

export function parseTrustConfig(
  orgConfig: unknown,
  templeConfig?: unknown
): TrustComplianceConfig {
  const org =
    orgConfig && typeof orgConfig === "object"
      ? (orgConfig as Record<string, unknown>)
      : {}
  const temple =
    templeConfig && typeof templeConfig === "object"
      ? (templeConfig as Record<string, unknown>)
      : {}

  const trust = {
    ...(typeof org.trust === "object" && org.trust ? org.trust : {}),
    ...(typeof temple.trust === "object" && temple.trust ? temple.trust : {}),
  } as Partial<TrustComplianceConfig>

  return {
    ...DEFAULT_JAMSAWLI,
    ...trust,
  }
}

export function isEightyGReady(config: TrustComplianceConfig): boolean {
  return Boolean(
    config.eightyGNumber &&
      config.eightyGNumber !== "PENDING-CONFIGURE" &&
      config.panNumber &&
      config.panNumber !== "PENDING" &&
      config.registrationNumber &&
      config.registrationNumber !== "PENDING-CONFIGURE"
  )
}
