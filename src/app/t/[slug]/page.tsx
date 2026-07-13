"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import {
  Heart,
  CalendarHeart,
  ShieldCheck,
  Users,
  Smartphone,
  Eye,
  MapPin,
  Sparkles,
  ArrowRight,
  Building2,
  Compass,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { DevoteeCounter } from "@/components/counter/devotee-counter"
import { DailyWisdom } from "@/components/notifications/daily-wisdom"
import { useI18n } from "@/lib/i18n"
import { startProductTour } from "@/components/tour/product-tour"
import { useOptionalTemple } from "@/hooks/useTemple"
import { tenantPath } from "@/lib/tenant-path"
import { DEFAULT_TENANT_SLUG } from "@/lib/tenant-client"

export default function Home() {
  const { locale } = useI18n()
  const hi = locale === "hi"
  const temple = useOptionalTemple()
  const slug = temple?.templeSlug || DEFAULT_TENANT_SLUG
  const tp = (path: string) => tenantPath(slug, path)
  const isJamsawli = slug === "jamsawli-hanuman"
  const isDemo = slug.startsWith("demo-")
  const displayName =
    (hi ? temple?.templeNameHi : temple?.templeName) ||
    temple?.templeName ||
    (hi ? "मंदिर" : "Temple")
  const orgName = temple?.organizationName || "Temple Trust"
  const locationLine = isJamsawli
    ? hi
      ? "चमत्कारिक श्री हनुमान मंदिर · छिंदवाड़ा, म.प्र."
      : "Chamatkarik Shri Hanuman Mandir · Chhindwara, MP"
    : isDemo
      ? hi
        ? `${orgName} · MandirOS लाइव डेमो`
        : `${orgName} · MandirOS live demo`
      : hi
        ? `${orgName} · Powered by MandirOS`
        : `${orgName} · Powered by MandirOS`

  return (
    <main className="gradient-hero">
      {/* Hero — mobile-first */}
      <section className="relative overflow-hidden">
        <div className="page-container pt-10 pb-12 sm:pt-16 sm:pb-20 md:pt-20 md:pb-28">
          {isDemo && (
            <div className="mb-4 rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-2 text-xs sm:text-sm text-indigo-900">
              {hi
                ? "डेमो मंदिर — सैंपल दान/बुकिंग से भरा। असली पैसे यहाँ एकत्र नहीं होते।"
                : "Demo temple — seeded sample donations & bookings. No real money is collected here."}
            </div>
          )}
          <div className="chip mb-5 sm:mb-6">
            <Sparkles className="h-3.5 w-3.5 text-saffron-500" />
            <span className="truncate max-w-[85vw]">{locationLine}</span>
          </div>

          <h1 className="font-hindi text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-sacred-maroon tracking-tight max-w-4xl leading-[1.12] text-balance">
            {displayName}
          </h1>
          <p className="mt-4 text-lg sm:text-xl md:text-2xl text-gray-700 max-w-2xl text-balance leading-snug">
            {hi
              ? "जहाँ आस्था सुरक्षित है, दान पारदर्शी है, और हर भक्त को मार्गदर्शन मिलता है।"
              : "Where faith is protected, every rupee is transparent, and every devotee is guided."}
          </p>
          <p className="mt-3 text-sm sm:text-base text-gray-500 max-w-xl leading-relaxed">
            {isJamsawli
              ? hi
                ? "स्वयंभू हनुमान · जाम-सर्प संगम · ३२ न्यासी · ₹३६२ करोड़ विकास की सार्वजनिक पारदर्शिता"
                : "Swayambhu Hanuman · Jam–Sarpa confluence · 32 trustees · Public transparency for ₹362 Cr development"
              : hi
                ? "दान · पूजा बुकिंग · पारदर्शिता · मनी डेस्क — इस टेनेन्ट पर लाइव।"
                : "Donate · seva booking · transparency · money desk — live on this tenant."}
          </p>

          {/* Primary CTAs — full width stacked on phone */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap gap-3 max-w-2xl">
            <Link href={tp("/donate")} className="sm:col-span-1">
              <Button
                size="lg"
                className="w-full h-14 text-base btn-primary-glow rounded-2xl"
              >
                <Heart className="mr-2 h-5 w-5" />
                {hi ? "दान करें" : "Donate"}
              </Button>
            </Link>
            <Link href={tp("/book")} className="sm:col-span-1">
              <Button
                size="lg"
                variant="outline"
                className="w-full h-14 text-base rounded-2xl border-2 border-sacred-maroon/15 bg-white/80"
              >
                <CalendarHeart className="mr-2 h-5 w-5" />
                {hi ? "पूजा बुक करें" : "Book pooja"}
              </Button>
            </Link>
            <Link href={tp("/transparency")} className="sm:col-span-2 lg:col-auto">
              <Button
                size="lg"
                variant="ghost"
                className="w-full lg:w-auto h-12 text-sacred-maroon"
              >
                <Eye className="mr-2 h-5 w-5" />
                {hi ? "पारदर्शिता देखें" : "See transparency"}
              </Button>
            </Link>
            <Button
              size="lg"
              variant="ghost"
              className="w-full sm:w-auto h-12"
              onClick={() => startProductTour("devotee")}
            >
              <Compass className="mr-2 h-5 w-5" />
              {hi ? "ऐप टूर" : "Tour"}
            </Button>
          </div>

          {/* Trust chips — horizontal scroll on mobile */}
          <div className="mt-8 flex gap-2 overflow-x-auto scrollbar-none pb-1 -mx-1 px-1 sm:grid sm:grid-cols-2 md:grid-cols-4 sm:overflow-visible">
            {[
              {
                icon: ShieldCheck,
                label: hi ? "सार्वजनिक पारदर्शिता" : "Public transparency",
              },
              {
                icon: Smartphone,
                label: hi ? "UPI · कार्ड · नेट बैंकिंग" : "UPI · Cards · Net banking",
              },
              {
                icon: Users,
                label: hi ? "तीर्थयात्री सुरक्षा" : "Pilgrim safety",
              },
              {
                icon: MapPin,
                label: hi ? "ग्रामीण · वॉइस · WhatsApp" : "Rural · Voice · WhatsApp",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex min-w-[70%] sm:min-w-0 items-center gap-2.5 rounded-2xl bg-white/90 border border-saffron-100 px-3.5 py-3 shadow-soft shrink-0"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-saffron-50 text-saffron-600 shrink-0">
                  <item.icon className="h-4 w-4" />
                </div>
                <span className="text-xs sm:text-sm text-gray-700 font-medium leading-snug">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live strip */}
      <section className="page-container -mt-2 sm:-mt-4 relative z-10 pb-10">
        <div className="grid gap-3 md:grid-cols-2">
          <div className="surface-elevated p-3 sm:p-4">
            <DevoteeCounter />
          </div>
          <div className="surface-elevated p-3 sm:p-4 flex items-center">
            <DailyWisdom />
          </div>
        </div>
      </section>

      {/* Core jobs */}
      <section className="page-container py-12 sm:py-16">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="section-title">
            {hi ? "एक मंच · तीन मुख्य कार्य" : "One platform · Three jobs"}
          </h2>
          <p className="mt-3 text-gray-600 max-w-xl mx-auto text-sm sm:text-base">
            {hi
              ? "फ़ीचर का ढेर नहीं — भक्त और न्यासी दोनों के लिए स्पष्ट अनुभव।"
              : "Not a feature dump — clear jobs for devotees and trustees."}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <JobCard
            href={tp("/donate")}
            icon={<Heart className="h-6 w-6" />}
            title={hi ? "विश्वास के साथ दान" : "Donate with trust"}
            body={hi
              ? "सुरक्षित भुगतान, उद्देश्य चुनें, हर रुपये का उपयोग देखें।"
              : "Secure pay, choose purpose, see where every rupee goes."}
            cta={hi ? "अभी दान करें" : "Donate now"}
          />
          <JobCard
            href={tp("/book")}
            icon={<CalendarHeart className="h-6 w-6" />}
            title={hi ? "घर बैठे पूजा" : "Book pooja"}
            body={hi
              ? "गोत्र, संकल्प, स्लॉट — त्योहार की कतार कम।"
              : "Gotra, sankalp, slots — less festival queue stress."}
            cta={hi ? "सेवा देखें" : "View sevas"}
          />
          <JobCard
            href={tp("/transparency")}
            icon={<ShieldCheck className="h-6 w-6" />}
            title={hi ? "पूर्ण पारदर्शिता" : "Radical transparency"}
            body={hi
              ? "सार्वजनिक बही · परियोजना प्रगति · ट्रस्ट लेयर।"
              : "Public ledger · project progress · trust layer."}
            cta={hi ? "लेजर खोलें" : "Open ledger"}
            className="sm:col-span-2 lg:col-span-1"
          />
        </div>
      </section>

      {/* Promise band */}
      <section className="bg-sacred-maroon text-white py-12 sm:py-16 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 md:gap-10 items-center">
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-balance">
              {hi ? "यह सिर्फ वेबसाइट नहीं है" : "This is not just a website"}
            </h2>
            <p className="mt-4 text-white/85 text-base sm:text-lg leading-relaxed">
              {hi
                ? "दान, बुकिंग, काउंटर मनी डेस्क और सार्वजनिक जवाबदेही — ग्रामीण भारत के लिए वॉइस, WhatsApp और मोबाइल-फर्स्ट।"
                : "Donate, book, counter money desk and public accountability — mobile-first for rural Bharat."}
            </p>
            <ul className="mt-6 space-y-3 text-white/90 text-sm sm:text-base">
              {(hi
                ? [
                    "हर दान → श्रेणी → परियोजना",
                    "काउंटर रसीद ~10 सेकंड",
                    "साप्ताहिक न्यासी रिपोर्ट",
                    "SOS · खोया-पाया · QR चेक-इन",
                  ]
                : [
                    "Every donation → category → project",
                    "Counter receipt in ~10 seconds",
                    "Weekly trustee money report",
                    "SOS · lost & found · QR check-in",
                  ]
              ).map((line) => (
                <li key={line} className="flex gap-2">
                  <span className="text-saffron-300 shrink-0">✓</span>
                  {line}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-white/15 bg-white/10 p-5 sm:p-6 backdrop-blur">
            <p className="text-xs uppercase tracking-wider text-saffron-200 font-semibold mb-2">
              {hi ? "हमारी प्रतिज्ञा" : "Our promise"}
            </p>
            <p className="text-xl sm:text-2xl font-semibold leading-snug">
              {hi
                ? "जो दावा करते हैं, वही उत्पादन में दिखाते हैं।"
                : "We only claim what ships in production."}
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {isJamsawli ? (
                <>
                  <Stat label={hi ? "न्यासी" : "Trustees"} value="32" />
                  <Stat label={hi ? "विकास" : "Dev. outlay"} value="₹362Cr" />
                  <Stat label={hi ? "स्थान" : "Location"} value={hi ? "छिंदवाड़ा" : "Chhindwara"} />
                  <Stat label={hi ? "विरासत" : "Heritage"} value="100+" />
                </>
              ) : (
                <>
                  <Stat label={hi ? "प्लान" : "Plan"} value={isDemo ? "Pro demo" : "Live"} />
                  <Stat label={hi ? "दान" : "Donate"} value="UPI+" />
                  <Stat label={hi ? "पारदर्शिता" : "Ledger"} value="Public" />
                  <Stat label={hi ? "प्लेटफ़ॉर्म" : "Platform"} value="MandirOS" />
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Pilgrim cards */}
      <section className="page-container py-12 sm:py-16">
        <h2 className="section-title text-center mb-8">
          {hi ? "मंदिर पहुँचने पर" : "When you arrive"}
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Link
            href={tp("/pilgrim")}
            className="group surface-elevated p-5 sm:p-6 hover:border-saffron-300 transition-all active:scale-[0.99]"
          >
            <Users className="h-8 w-8 text-saffron-600 mb-3" />
            <h3 className="text-lg sm:text-xl font-semibold">
              {hi ? "स्मार्ट तीर्थयात्री सेवा" : "Smart pilgrim services"}
            </h3>
            <p className="mt-2 text-sm sm:text-base text-gray-600">
              {hi
                ? "SOS, खोया-पाया, भीड़ — परिवार के साथ सुरक्षित।"
                : "SOS, lost & found, crowd — safer family yatra."}
            </p>
            <span className="mt-4 inline-flex items-center text-saffron-700 font-medium text-sm">
              {hi ? "सहायता" : "Open help"}{" "}
              <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </Link>
          <Link
            href={tp("/checkin")}
            className="group surface-elevated p-5 sm:p-6 hover:border-saffron-300 transition-all active:scale-[0.99]"
          >
            <Smartphone className="h-8 w-8 text-saffron-600 mb-3" />
            <h3 className="text-lg sm:text-xl font-semibold">
              {hi ? "QR दर्शन चेक-इन" : "QR darshan check-in"}
            </h3>
            <p className="mt-2 text-sm sm:text-base text-gray-600">
              {hi
                ? "स्कैन करें, उपस्थिति दर्ज करें।"
                : "Scan and record your visit."}
            </p>
            <span className="mt-4 inline-flex items-center text-saffron-700 font-medium text-sm">
              {hi ? "चेक-इन" : "Check in"}{" "}
              <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </Link>
        </div>
      </section>

      {/* MandirOS CTA */}
      <section className="page-container pb-8 sm:pb-12">
        <div className="rounded-3xl bg-gradient-to-br from-saffron-500 via-saffron-600 to-sacred-maroon p-6 sm:p-10 text-white shadow-glow">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 text-sm font-medium text-white/90 mb-2">
                <Building2 className="h-4 w-4" />
                MandirOS
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-balance">
                {hi
                  ? "क्या आपका मंदिर भी डिजिटल ट्रस्ट चाहता है?"
                  : "Does your temple want this too?"}
              </h2>
              <p className="mt-2 text-white/90 text-sm sm:text-base">
                {hi
                  ? "Free vs Pro आज़माएँ — बिना सेल्स कॉल के।"
                  : "Try Free vs Pro — no sales call required."}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Link href="/demo">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-white text-sacred-maroon hover:bg-saffron-50 h-12 rounded-xl"
                >
                  {hi ? "लाइव डेमो" : "Live demo"}
                </Button>
              </Link>
              <Link href="/">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-white/40 text-white hover:bg-white/10 h-12 rounded-xl"
                >
                  {hi ? "न्यासियों के लिए" : "For trustees"}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final */}
      <section className="page-container pb-10 sm:pb-16 text-center">
        <h2 className="text-xl sm:text-2xl font-bold text-sacred-maroon">
          {isJamsawli
            ? hi
              ? "जय श्री हनुमान"
              : "Jai Shri Hanuman"
            : hi
              ? "जय श्री राम · जय हनुमान"
              : "Jai Shri Ram · Jai Hanuman"}
        </h2>
        <p className="mt-2 text-gray-600 text-sm mb-5">
          {hi ? "दान · पूजा · पारदर्शिता" : "Donate · book · transparency"}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
          <Link href={tp("/donate")} className="flex-1">
            <Button size="lg" className="w-full h-12 btn-primary-glow rounded-xl">
              {hi ? "दान करें" : "Donate"}
            </Button>
          </Link>
          <Link href="/register" className="flex-1">
            <Button size="lg" variant="outline" className="w-full h-12 rounded-xl">
              {hi ? "खाता बनाएँ" : "Create account"}
            </Button>
          </Link>
        </div>
      </section>
    </main>
  )
}

function JobCard({
  href,
  icon,
  title,
  body,
  cta,
  className = "",
}: {
  href: string
  icon: ReactNode
  title: string
  body: string
  cta: string
  className?: string
}) {
  return (
    <Link
      href={href}
      className={`group block surface-elevated p-5 sm:p-6 hover:border-saffron-300 active:scale-[0.99] transition-all ${className}`}
    >
      <div className="h-12 w-12 rounded-2xl bg-saffron-50 text-saffron-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
        {icon}
      </div>
      <h3 className="text-lg sm:text-xl font-semibold text-gray-900">{title}</h3>
      <p className="mt-2 text-sm sm:text-base text-gray-600 leading-relaxed">{body}</p>
      <span className="mt-4 inline-flex items-center text-saffron-700 font-medium text-sm">
        {cta}{" "}
        <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
      </span>
    </Link>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/10 px-3 py-3 sm:px-4">
      <div className="text-xl sm:text-2xl font-bold">{value}</div>
      <div className="text-[10px] sm:text-xs text-white/70 mt-0.5">{label}</div>
    </div>
  )
}
