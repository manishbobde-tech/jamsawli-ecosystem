/**
 * MandirOS SaaS plan catalog — single source of truth for pricing & feature gates.
 * Who pays more unlocks more advanced capabilities.
 */

export type PlanId = "FREE" | "GROWTH" | "TRUST_PRO"

export type FeatureKey =
  | "donate"
  | "book"
  | "basic_transparency"
  | "checkin"
  | "unlimited_poojas"
  | "custom_branding"
  | "whatsapp"
  | "analytics"
  | "embed_widgets"
  | "daily_ops"
  | "gamification"
  | "ai_chatbot"
  | "voice_assistant"
  | "advanced_transparency"
  | "eighty_g_receipts"
  | "form_10bd"
  | "developer_api"
  | "pilgrim_sos"
  | "lost_found"
  | "crowd_heatmap"
  | "remove_branding"
  | "priority_support"
  | "premium_listing"
  | "money_desk"
  | "weekly_report"
  | "slot_capacity"
  | "qr_posters"
  | "festival_board"
  | "seva_certificate"
  | "donation_campaigns"

export interface PlanDefinition {
  id: PlanId
  name: string
  nameHi: string
  priceInr: number
  priceLabel: string
  tagline: string
  taglineHi: string
  /** Platform fee on donations/bookings as fraction e.g. 0.02 = 2% */
  transactionFeeRate: number
  maxPoojas: number | null // null = unlimited
  features: FeatureKey[]
  highlight?: boolean
  razorpayEnvKey?: string
}

export const PLANS: Record<PlanId, PlanDefinition> = {
  FREE: {
    id: "FREE",
    name: "Free",
    nameHi: "मुफ़्त",
    priceInr: 0,
    priceLabel: "₹0",
    tagline: "Start accepting digital donations",
    taglineHi: "डिजिटल दान शुरू करें",
    transactionFeeRate: 0.025,
    maxPoojas: 3,
    // Free = habit: online money in + basic counter so they open MandirOS daily
    features: [
      "donate",
      "book",
      "basic_transparency",
      "checkin",
      "eighty_g_receipts",
      "analytics",
      "money_desk",
      "weekly_report",
      "qr_posters",
      "seva_certificate",
    ],
  },
  GROWTH: {
    id: "GROWTH",
    name: "Growth",
    nameHi: "ग्रोथ",
    priceInr: 2499,
    priceLabel: "₹2,499",
    tagline: "Festival capacity + daily money ops",
    taglineHi: "त्योहार क्षमता + दैनिक धन संचालन",
    transactionFeeRate: 0.02,
    maxPoojas: null,
    highlight: true,
    razorpayEnvKey: "RAZORPAY_GROWTH_PLAN_ID",
    features: [
      "donate",
      "book",
      "basic_transparency",
      "checkin",
      "eighty_g_receipts",
      "analytics",
      "money_desk",
      "weekly_report",
      "unlimited_poojas",
      "slot_capacity",
      "custom_branding",
      "whatsapp",
      "embed_widgets",
      "daily_ops",
      "gamification",
      "pilgrim_sos",
      "lost_found",
      "crowd_heatmap",
      "premium_listing",
      "qr_posters",
      "seva_certificate",
      "festival_board",
      "donation_campaigns",
    ],
  },
  TRUST_PRO: {
    id: "TRUST_PRO",
    name: "Trust Pro",
    nameHi: "ट्रस्ट प्रो",
    priceInr: 7999,
    priceLabel: "₹7,999",
    tagline: "CA-ready compliance + full trust ledger",
    taglineHi: "CA-तैयार अनुपालन + पूर्ण ट्रस्ट लेजर",
    transactionFeeRate: 0.01,
    maxPoojas: null,
    razorpayEnvKey: "RAZORPAY_TRUST_PRO_PLAN_ID",
    features: [
      "donate",
      "book",
      "basic_transparency",
      "checkin",
      "eighty_g_receipts",
      "analytics",
      "money_desk",
      "weekly_report",
      "unlimited_poojas",
      "slot_capacity",
      "custom_branding",
      "whatsapp",
      "embed_widgets",
      "daily_ops",
      "gamification",
      "pilgrim_sos",
      "lost_found",
      "crowd_heatmap",
      "premium_listing",
      "ai_chatbot",
      "voice_assistant",
      "advanced_transparency",
      "form_10bd",
      "developer_api",
      "remove_branding",
      "priority_support",
      "qr_posters",
      "seva_certificate",
      "festival_board",
      "donation_campaigns",
    ],
  },
}

/** Normalize legacy / messy plan strings from DB */
export function normalizePlanId(raw?: string | null): PlanId {
  const p = (raw || "FREE").toUpperCase().replace(/[\s-]/g, "_").trim()
  if (
    p === "TRUST_PRO" ||
    p === "TRUSTPRO" ||
    p === "PREMIUM" ||
    p === "ENTERPRISE" ||
    p === "PRO"
  ) {
    return "TRUST_PRO"
  }
  if (p === "GROWTH" || p === "BASIC") return "GROWTH"
  return "FREE"
}

export function planHasFeature(planId: PlanId | string, feature: FeatureKey): boolean {
  const id = normalizePlanId(planId)
  return PLANS[id].features.includes(feature)
}

export function getPlan(planId?: string | null): PlanDefinition {
  return PLANS[normalizePlanId(planId)]
}

export function comparePlans(a: PlanId, b: PlanId): number {
  const order: PlanId[] = ["FREE", "GROWTH", "TRUST_PRO"]
  return order.indexOf(a) - order.indexOf(b)
}

export function minPlanForFeature(feature: FeatureKey): PlanId {
  if (PLANS.FREE.features.includes(feature)) return "FREE"
  if (PLANS.GROWTH.features.includes(feature)) return "GROWTH"
  return "TRUST_PRO"
}

export const FEATURE_LABELS: Record<
  FeatureKey,
  { en: string; hi: string; description: string }
> = {
  donate: {
    en: "Online donations",
    hi: "ऑनलाइन दान",
    description: "UPI, cards, guest donate",
  },
  book: {
    en: "Pooja booking",
    hi: "पूजा बुकिंग",
    description: "Paid seva slots",
  },
  basic_transparency: {
    en: "Public fund totals",
    hi: "सार्वजनिक फंड",
    description: "Donation totals visible to devotees",
  },
  checkin: {
    en: "QR check-in",
    hi: "QR चेक-इन",
    description: "Darshan visit tracking",
  },
  unlimited_poojas: {
    en: "Unlimited sevas",
    hi: "असीमित सेवा",
    description: "No limit on pooja catalogue",
  },
  custom_branding: {
    en: "Custom branding",
    hi: "कस्टम ब्रांडिंग",
    description: "Colors, logo, temple theme",
  },
  whatsapp: {
    en: "WhatsApp bot",
    hi: "WhatsApp बॉट",
    description: "Booking & info via WhatsApp",
  },
  analytics: {
    en: "Analytics dashboard",
    hi: "एनालिटिक्स",
    description: "Revenue, bookings, devotees",
  },
  embed_widgets: {
    en: "Website widgets",
    hi: "वेबसाइट विजेट",
    description: "Embed donate/book on your site",
  },
  daily_ops: {
    en: "Daily ops + hundi",
    hi: "दैनिक संचालन + हुंडी",
    description: "Trustee checklist & cash log",
  },
  gamification: {
    en: "Badges & streaks",
    hi: "बैज और स्ट्रीक",
    description: "Devotee engagement",
  },
  ai_chatbot: {
    en: "AI Hanuman assistant",
    hi: "AI हनुमान सहायक",
    description: "Temple-trained chatbot",
  },
  voice_assistant: {
    en: "Voice navigation",
    hi: "वॉइस नेविगेशन",
    description: "Hands-free temple app",
  },
  advanced_transparency: {
    en: "Full trust ledger",
    hi: "पूर्ण ट्रस्ट लेजर",
    description: "Categories + project milestones",
  },
  eighty_g_receipts: {
    en: "80G receipts",
    hi: "80G रसीद",
    description: "PAN + printable certificates",
  },
  form_10bd: {
    en: "Form 10BD export",
    hi: "फॉर्म 10BD",
    description: "IT compliance CSV",
  },
  developer_api: {
    en: "Developer API",
    hi: "डेवलपर API",
    description: "API keys for integrations",
  },
  pilgrim_sos: {
    en: "Emergency SOS",
    hi: "आपातकालीन SOS",
    description: "On-site safety alerts",
  },
  lost_found: {
    en: "Lost & found",
    hi: "खोया-पाया",
    description: "Pilgrim item recovery",
  },
  crowd_heatmap: {
    en: "Crowd awareness",
    hi: "भीड़ जानकारी",
    description: "Live area density signals",
  },
  remove_branding: {
    en: "White-label option",
    hi: "व्हाइट-लेबल",
    description: "Hide MandirOS badge",
  },
  priority_support: {
    en: "Priority support",
    hi: "प्राथमिकता सहायता",
    description: "Faster trustee support",
  },
  premium_listing: {
    en: "Featured directory",
    hi: "फीचर्ड लिस्टिंग",
    description: "Top placement in temple directory",
  },
  money_desk: {
    en: "Counter money desk",
    hi: "काउंटर मनी डेस्क",
    description: "Cash/UPI counter receipt in seconds — daily habit for clerks",
  },
  weekly_report: {
    en: "Weekly trustee report",
    hi: "साप्ताहिक न्यासी रिपोर्ट",
    description: "Printable ‘kitna aaya’ summary for the board",
  },
  slot_capacity: {
    en: "Festival slot capacity",
    hi: "त्योहार स्लॉट क्षमता",
    description: "Max bookings per slot — no double-book chaos",
  },
  qr_posters: {
    en: "QR posters",
    hi: "QR पोस्टर",
    description: "Print gate posters for donate & check-in",
  },
  festival_board: {
    en: "Festival capacity board",
    hi: "त्योहार क्षमता बोर्ड",
    description: "Live fill rates for today's seva slots",
  },
  seva_certificate: {
    en: "Seva certificates",
    hi: "सेवा प्रमाणपत्र",
    description: "Printable keepsake after booking",
  },
  donation_campaigns: {
    en: "Donation campaigns",
    hi: "दान अभियान",
    description: "Public goals for bhandara / construction drives",
  },
}
