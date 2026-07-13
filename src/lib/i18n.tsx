"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"

export type Locale = "hi" | "en"

type Dictionary = Record<string, { hi: string; en: string }>

const dict: Dictionary = {
  brand: { hi: "जामसावली हनुमान लोक", en: "Jamsawli Hanuman Lok" },
  tagline: {
    hi: "जहाँ आस्था और नवीनता मिलते हैं",
    en: "Where faith meets innovation",
  },
  donate: { hi: "दान करें", en: "Donate" },
  book: { hi: "पूजा बुक करें", en: "Book Pooja" },
  pilgrim: { hi: "तीर्थयात्री सेवा", en: "Pilgrim Help" },
  checkin: { hi: "चेक-इन", en: "Check-in" },
  transparency: { hi: "पारदर्शिता", en: "Transparency" },
  temples: { hi: "मंदिर", en: "Temples" },
  platform: { hi: "MandirOS", en: "MandirOS" },
  pricing: { hi: "मूल्य", en: "Pricing" },
  login: { hi: "लॉगिन", en: "Login" },
  logout: { hi: "लॉगआउट", en: "Logout" },
  dashboard: { hi: "डैशबोर्ड", en: "Dashboard" },
  admin: { hi: "एडमिन", en: "Admin" },
  registerTemple: { hi: "मंदिर जोड़ें", en: "List Temple" },
  menu: { hi: "मेनू", en: "Menu" },
  close: { hi: "बंद करें", en: "Close" },
  caseStudy: { hi: "केस स्टडी", en: "Case study" },
  features: { hi: "सुविधाएँ", en: "Features" },
  demo: { hi: "डेमो", en: "Demo" },
  forTrustees: { hi: "न्यासियों के लिए", en: "For trustees" },
}

interface I18nContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: keyof typeof dict) => string
  toggleLocale: () => void
}

const I18nContext = createContext<I18nContextValue | null>(null)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("hi")

  useEffect(() => {
    const saved = window.localStorage.getItem("mandiros-locale") as Locale | null
    if (saved === "hi" || saved === "en") setLocaleState(saved)
  }, [])

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    window.localStorage.setItem("mandiros-locale", next)
    document.documentElement.lang = next
  }, [])

  const toggleLocale = useCallback(() => {
    setLocale(locale === "hi" ? "en" : "hi")
  }, [locale, setLocale])

  const t = useCallback(
    (key: keyof typeof dict) => dict[key]?.[locale] ?? key,
    [locale]
  )

  const value = useMemo(
    () => ({ locale, setLocale, t, toggleLocale }),
    [locale, setLocale, t, toggleLocale]
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error("useI18n must be used within I18nProvider")
  return ctx
}

/** Safe helper for non-provider trees */
export function translate(locale: Locale, key: keyof typeof dict) {
  return dict[key]?.[locale] ?? key
}
