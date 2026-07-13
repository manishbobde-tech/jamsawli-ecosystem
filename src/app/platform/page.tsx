"use client"

import Link from "next/link"
import {
  Building2,
  ShieldCheck,
  IndianRupee,
  CalendarHeart,
  MessageCircle,
  Code2,
  ArrowRight,
  CheckCircle2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/lib/i18n"

export default function PlatformPage() {
  const { locale } = useI18n()
  const hi = locale === "hi"

  const pillars = [
    {
      icon: IndianRupee,
      title: hi ? "दान + 80G तैयार" : "Donations + 80G-ready",
      body: hi
        ? "UPI/कार्ड, उद्देश्य टैग, रसीद, न्यासी सुलह — भरोसे के साथ राजस्व।"
        : "UPI/cards, purpose tags, receipts, trustee reconciliation — revenue with trust.",
    },
    {
      icon: CalendarHeart,
      title: hi ? "पूजा / सेवा बुकिंग" : "Pooja / seva booking",
      body: hi
        ? "स्लॉट, भुगतान, पुष्टि — त्योहार की भीड़ को डिजिटल कतार में बदलें।"
        : "Slots, payments, confirmations — turn festival chaos into a digital queue.",
    },
    {
      icon: ShieldCheck,
      title: hi ? "सार्वजनिक ट्रस्ट लेजर" : "Public trust ledger",
      body: hi
        ? "हर रुपये की कहानी सार्वजनिक — न्यासी, भक्त और सरकार सब एक पेज पर।"
        : "Every rupee’s story is public — trustees, devotees and donors on one page.",
    },
    {
      icon: MessageCircle,
      title: hi ? "WhatsApp + वॉइस" : "WhatsApp + voice",
      body: hi
        ? "जहाँ भारत पहले से है — चैट और आवाज़ से बुकिंग/जानकारी।"
        : "Meet Bharat where it already is — chat and voice for booking/info.",
    },
    {
      icon: Building2,
      title: hi ? "मल्टी-मंदिर SaaS" : "Multi-temple SaaS",
      body: hi
        ? "संगठन → मंदिर → ब्रांडिंग · सबडोमेन · भूमिकाएँ · पेआउट।"
        : "Org → temple → branding · subdomain · roles · payouts.",
    },
    {
      icon: Code2,
      title: hi ? "API + विजेट" : "API + widgets",
      body: hi
        ? "अपनी मौजूदा वेबसाइट पर दान/बुकिंग एम्बेड करें — कोड कम, राजस्व जल्दी।"
        : "Embed donate/book on your existing site — low code, faster revenue.",
    },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-saffron-50">
      <section className="max-w-6xl mx-auto px-4 pt-16 pb-12">
        <p className="text-saffron-600 font-semibold tracking-wide text-sm uppercase mb-3">
          MandirOS
        </p>
        <h1 className="text-4xl md:text-6xl font-bold text-sacred-maroon max-w-3xl leading-tight">
          {hi
            ? "मंदिर के पैसे का रोज़ाना हिसाब — जो बोर्ड चुकाए"
            : "Daily rupee control temples will actually pay for"}
        </h1>
        <p className="mt-5 text-lg md:text-xl text-gray-600 max-w-2xl">
          {hi
            ? "काउंटर मनी डेस्क · 80G रसीद · त्योहार स्लॉट · साप्ताहिक न्यासी रिपोर्ट · सार्वजनिक पारदर्शिता। AI बोनस है — पैसे का नियंत्रण उत्पाद है।"
            : "Counter money desk · 80G receipts · festival slots · weekly trustee report · public transparency. AI is a bonus — money control is the product."}
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 flex-wrap">
          <Link href="/demo">
            <Button size="lg" className="bg-saffron-500 hover:bg-saffron-600">
              {hi ? "Free vs Pro आज़माएँ" : "Try Free vs Pro"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/admin/temples/new">
            <Button size="lg" variant="outline">
              {hi ? "अपना मंदिर जोड़ें" : "List your temple"}
            </Button>
          </Link>
          <Link href="/pricing">
            <Button size="lg" variant="ghost">
              {hi ? "मूल्य देखें" : "See pricing"}
            </Button>
          </Link>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-3 gap-5">
          {pillars.map((p) => (
            <div
              key={p.title}
              className="rounded-2xl bg-white border border-saffron-100 p-6 shadow-sm"
            >
              <p.icon className="h-7 w-7 text-saffron-600 mb-3" />
              <h3 className="text-lg font-semibold text-gray-900">{p.title}</h3>
              <p className="mt-2 text-gray-600 text-sm leading-relaxed">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-sacred-maroon text-white py-16 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10">
          <div>
            <h2 className="text-3xl font-bold">
              {hi ? "प्रतिस्पर्धा से अलग क्यों?" : "Why this is different"}
            </h2>
            <p className="mt-3 text-white/85">
              {hi
                ? "बाजार में काउंटर बिलिंग, Tally और 80G ERP हैं। MandirOS का फोकस: भक्त अनुभव + सार्वजनिक ट्रस्ट + आसान SaaS ऑनबोर्डिंग।"
                : "The market has counter billing, Tally, and 80G ERPs. MandirOS focuses on devotee experience + public trust + simple SaaS onboarding."}
            </p>
          </div>
          <ul className="space-y-3">
            {(hi
              ? [
                  "एंकर प्रूफ: जामसावली हनुमान लोक (लाइव केस स्टडी)",
                  "सार्वजनिक फंड ट्रांसपेरेंसी — ERP में शायद ही प्रमुख",
                  "तीर्थयात्री सुरक्षा (SOS, भीड़, खोया-पाया)",
                  "वॉइस / WhatsApp / लो-बैंडविड्थ फर्स्ट",
                  "मल्टी-टेनेंट: सबडोमेन, थीम, पेआउट, API",
                ]
              : [
                  "Anchor proof: Jamsawli Hanuman Lok (live case study)",
                  "Public fund transparency — rarely a flagship in ERPs",
                  "Pilgrim safety (SOS, crowd, lost & found)",
                  "Voice / WhatsApp / low-bandwidth first",
                  "Multi-tenant: subdomain, theme, payouts, API",
                ]
            ).map((item) => (
              <li key={item} className="flex gap-2 items-start">
                <CheckCircle2 className="h-5 w-5 text-saffron-300 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold text-sacred-maroon">
          {hi ? "३० दिनों में ऑनबोर्ड" : "Onboard in 30 days"}
        </h2>
        <p className="mt-3 text-gray-600 max-w-xl mx-auto">
          {hi
            ? "आवेदन → सत्यापन → ब्रांडिंग → दान/पूजा लाइव → न्यासी प्रशिक्षण।"
            : "Apply → verify → brand → go live on donate/book → train trustees."}
        </p>
        <div className="mt-8 flex justify-center gap-3 flex-wrap">
          <Link href="/admin/temples/new">
            <Button size="lg" className="bg-saffron-500 hover:bg-saffron-600">
              {hi ? "अभी आवेदन करें" : "Apply now"}
            </Button>
          </Link>
          <Link href="/pricing">
            <Button size="lg" variant="outline">
              {hi ? "प्लान तुलना" : "Compare plans"}
            </Button>
          </Link>
        </div>
      </section>
    </main>
  )
}
