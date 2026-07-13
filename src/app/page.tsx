"use client"

import Link from "next/link"
import {
  ArrowRight,
  Building2,
  ShieldCheck,
  IndianRupee,
  CalendarHeart,
  LayoutDashboard,
  Sparkles,
  FlaskConical,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/lib/i18n"
import { DEFAULT_TENANT_SLUG } from "@/lib/tenant-client"
import { tenantPath } from "@/lib/tenant-path"
import { startProductTour } from "@/components/tour/product-tour"

export default function MandirOSHomePage() {
  const { locale } = useI18n()
  const hi = locale === "hi"
  const jamsawli = tenantPath(DEFAULT_TENANT_SLUG)

  return (
    <main className="gradient-hero">
      {/* Hero */}
      <section className="page-container pt-12 sm:pt-20 pb-14 sm:pb-24">
        <div className="chip mb-5">
          <Sparkles className="h-3.5 w-3.5 text-saffron-500" />
          {hi ? "भारत के मंदिरों के लिए SaaS" : "SaaS for temples across India"}
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight max-w-3xl text-balance leading-[1.08]">
          <span className="text-sacred-maroon">Mandir</span>
          <span className="text-saffron-600">OS</span>
          <span className="block mt-2 text-2xl sm:text-3xl md:text-4xl font-semibold text-stone-700">
            {hi
              ? "मंदिरों का डिजिटल ट्रस्ट लेयर"
              : "The digital trust layer for temples"}
          </span>
        </h1>

        <p className="mt-5 text-base sm:text-xl text-stone-600 max-w-2xl leading-relaxed">
          {hi
            ? "हर मंदिर अपना टेनेंट — दान, पूजा बुकिंग, काउंटर मनी डेस्क, साप्ताहिक रिपोर्ट, सार्वजनिक पारदर्शिता। जामसावली हमारा एंकर मंदिर है।"
            : "Every temple is a tenant — donations, seva booking, counter money desk, weekly reports, public transparency. Jamsawli is our anchor temple, not the whole product."}
        </p>

        <div className="mt-8 flex flex-col sm:flex-row flex-wrap gap-3 max-w-xl">
          <Link href="/admin/temples/new">
            <Button size="lg" className="w-full sm:w-auto h-14 rounded-2xl gap-2">
              <Building2 className="h-5 w-5" />
              {hi ? "अपना मंदिर जोड़ें" : "Add your temple"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/demo">
            <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 rounded-2xl gap-2">
              <FlaskConical className="h-5 w-5" />
              {hi ? "Free vs Pro डेमो" : "Free vs Pro demo"}
            </Button>
          </Link>
          <Link href={jamsawli}>
            <Button size="lg" variant="ghost" className="w-full sm:w-auto h-12 text-sacred-maroon">
              {hi ? "जामसावली टेनेन्ट खोलें →" : "Open Jamsawli tenant →"}
            </Button>
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl">
          {[
            { n: "3", l: hi ? "प्लान" : "Plans" },
            { n: "10s", l: hi ? "काउंटर रसीद" : "Counter receipt" },
            { n: "80G", l: hi ? "रसीद तैयार" : "Receipt ready" },
            { n: "1", l: hi ? "एंकर मंदिर" : "Anchor temple" },
          ].map((s) => (
            <div key={s.l} className="surface-elevated p-4 text-center">
              <div className="text-2xl font-bold text-sacred-maroon">{s.n}</div>
              <div className="text-xs text-stone-500 mt-0.5">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How multi-tenant works */}
      <section className="page-container pb-16">
        <h2 className="section-title mb-3">
          {hi ? "प्लेटफ़ॉर्म → टेनेन्ट" : "Platform → Tenant"}
        </h2>
        <p className="text-stone-600 max-w-2xl mb-8">
          {hi
            ? "MandirOS मुख्य साइट है। हर मंदिर /t/your-slug पर अपना पूरा अनुभव पाता है — या subdomain पर।"
            : "MandirOS is the main site. Each temple gets a full experience at /t/your-slug — or on a subdomain."}
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="surface-elevated p-6 border-l-4 border-l-saffron-500">
            <p className="text-xs font-bold uppercase tracking-wide text-saffron-600 mb-2">
              Platform
            </p>
            <code className="text-sm font-mono text-stone-800">mandiros.com</code>
            <ul className="mt-4 space-y-2 text-sm text-stone-600">
              <li>· Pricing, features, demo</li>
              <li>· Temple directory & onboarding</li>
              <li>· Super-admin & billing</li>
            </ul>
          </div>
          <div className="surface-elevated p-6 border-l-4 border-l-sacred-maroon">
            <p className="text-xs font-bold uppercase tracking-wide text-sacred-maroon mb-2">
              Tenant example
            </p>
            <code className="text-sm font-mono text-stone-800 break-all">
              mandiros.com/t/jamsawli-hanuman
            </code>
            <ul className="mt-4 space-y-2 text-sm text-stone-600">
              <li>· Donate, book, transparency</li>
              <li>· Pilgrim services & check-in</li>
              <li>· Temple branding & plan features</li>
            </ul>
            <Link
              href={jamsawli}
              className="inline-flex items-center mt-4 text-saffron-700 font-semibold text-sm hover:underline"
            >
              {hi ? "जामसावली खोलें" : "Open Jamsawli"} <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Product pillars */}
      <section className="bg-white border-y border-stone-100 py-14 sm:py-16">
        <div className="page-container">
          <h2 className="section-title text-center mb-10">
            {hi ? "मंदिर क्यों भुगतान करते हैं" : "Why temples pay"}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                icon: IndianRupee,
                t: hi ? "मनी डेस्क" : "Money desk",
                d: hi ? "काउंटर रसीद ~10 सेकंड" : "Counter receipt in ~10s",
              },
              {
                icon: CalendarHeart,
                t: hi ? "पूजा + क्षमता" : "Seva + capacity",
                d: hi ? "गोत्र, संकल्प, स्लॉट" : "Gotra, sankalp, slots",
              },
              {
                icon: ShieldCheck,
                t: hi ? "पारदर्शिता" : "Transparency",
                d: hi ? "सार्वजनिक फंड लेजर" : "Public fund ledger",
              },
              {
                icon: LayoutDashboard,
                t: hi ? "साप्ताहिक रिपोर्ट" : "Weekly report",
                d: hi ? "न्यासियों के लिए kitna aaya" : "Board-ready kitna aaya",
              },
            ].map((x) => (
              <div key={x.t} className="surface-card p-5">
                <x.icon className="h-6 w-6 text-saffron-600 mb-3" />
                <h3 className="font-semibold text-stone-900">{x.t}</h3>
                <p className="text-sm text-stone-500 mt-1">{x.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Anchor callout */}
      <section className="page-container py-14 sm:py-20">
        <div className="rounded-3xl bg-gradient-to-br from-sacred-maroon to-saffron-700 text-white p-6 sm:p-10 shadow-float">
          <p className="text-xs font-semibold uppercase tracking-wider text-saffron-200 mb-2">
            Anchor tenant
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold">
            {hi ? "जामसावली हनुमान लोक" : "Jamsawli Hanuman Lok"}
          </h2>
          <p className="mt-2 text-white/85 max-w-xl text-sm sm:text-base">
            {hi
              ? "छिंदवाड़ा का स्वयंभू हनुमान मंदिर — live tenant with full MandirOS features. यह प्लेटफ़ॉर्म नहीं; एक उदाहरण है।"
              : "Swayambhu Hanuman temple in Chhindwara — a live tenant with full MandirOS features. This is an example, not the platform itself."}
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Link href={jamsawli}>
              <Button size="lg" className="w-full sm:w-auto bg-white text-sacred-maroon hover:bg-saffron-50">
                {hi ? "टेनेन्ट साइट खोलें" : "Open tenant site"}
              </Button>
            </Link>
            <Link href="/case-study">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-white/40 text-white hover:bg-white/10">
                {hi ? "केस स्टडी" : "Case study"}
              </Button>
            </Link>
            <Button
              size="lg"
              variant="ghost"
              className="w-full sm:w-auto text-white hover:bg-white/10"
              onClick={() => startProductTour("sales")}
            >
              {hi ? "सेल्स टूर" : "Sales tour"}
            </Button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="page-container pb-16 text-center">
        <h2 className="text-xl sm:text-2xl font-bold text-sacred-maroon">
          {hi ? "आज ही अपना मंदिर ऑनबोर्ड करें" : "Onboard your temple today"}
        </h2>
        <p className="mt-2 text-stone-500 text-sm mb-6">
          Free plan → Growth → Trust Pro · Features unlock by tier
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
          <Link href="/admin/temples/new" className="flex-1">
            <Button size="lg" className="w-full h-12 rounded-xl">
              {hi ? "आवेदन" : "Apply"}
            </Button>
          </Link>
          <Link href="/pricing" className="flex-1">
            <Button size="lg" variant="outline" className="w-full h-12 rounded-xl">
              {hi ? "मूल्य" : "Pricing"}
            </Button>
          </Link>
        </div>
      </section>
    </main>
  )
}
