"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/lib/i18n"
import { ArrowRight, ShieldCheck, Smartphone, Users, Building2 } from "lucide-react"

export default function CaseStudyPage() {
  const { locale } = useI18n()
  const hi = locale === "hi"

  return (
    <main className="min-h-screen bg-gradient-to-b from-saffron-50 to-white">
      <section className="max-w-4xl mx-auto px-4 py-16">
        <p className="text-saffron-600 font-semibold text-sm uppercase tracking-wide mb-2">
          Case study · Anchor temple
        </p>
        <h1 className="text-4xl md:text-5xl font-bold text-sacred-maroon leading-tight">
          {hi
            ? "जामसावली हनुमान लोक: आस्था को डिजिटल ट्रस्ट में बदलना"
            : "Jamsawli Hanuman Lok: turning faith into digital trust"}
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          {hi
            ? "छिंदवाड़ा (म.प्र.) का स्वयंभू हनुमान मंदिर — ग्रामीण तीर्थ, ३२ न्यासी, और ₹३६२ करोड़ विकास घोषणा। MandirOS का एंकर टेनेन्ट।"
            : "Swayambhu Hanuman temple in Chhindwara (MP) — rural pilgrimage, 32 trustees, and a ₹362 Cr development announcement. MandirOS’s anchor tenant."}
        </p>

        <div className="mt-10 grid sm:grid-cols-2 gap-4">
          {[
            {
              icon: ShieldCheck,
              t: hi ? "सार्वजनिक पारदर्शिता" : "Public transparency",
              d: hi
                ? "दान → श्रेणी → परियोजना — न्यास और भक्त एक पेज पर।"
                : "Donation → category → project — trustees and devotees on one page.",
            },
            {
              icon: Smartphone,
              t: hi ? "Bharat-first access" : "Bharat-first access",
              d: hi
                ? "फोन OTP, UPI, वॉइस, WhatsApp, अतिथि दान।"
                : "Phone OTP, UPI, voice, WhatsApp, guest donate.",
            },
            {
              icon: Users,
              t: hi ? "तीर्थयात्री सुरक्षा" : "Pilgrim safety",
              d: hi
                ? "SOS, खोया-पाया, भीड़ संकेत, QR चेक-इन।"
                : "SOS, lost & found, crowd signals, QR check-in.",
            },
            {
              icon: Building2,
              t: hi ? "SaaS प्लेटफ़ॉर्म" : "SaaS platform",
              d: hi
                ? "एक मंदिर से शुरू → MandirOS मल्टी-टेनेंट।"
                : "Start with one temple → MandirOS multi-tenant.",
            },
          ].map((x) => (
            <div key={x.t} className="bg-white border rounded-2xl p-5 shadow-sm">
              <x.icon className="h-6 w-6 text-saffron-600 mb-2" />
              <h2 className="font-semibold text-gray-900">{x.t}</h2>
              <p className="text-sm text-gray-600 mt-1">{x.d}</p>
            </div>
          ))}
        </div>

        <section className="mt-12 bg-white border rounded-2xl p-6 md:p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-sacred-maroon mb-4">
            {hi ? "समस्या → समाधान" : "Problem → solution"}
          </h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              {hi
                ? "अधिकांश मंदिर अभी भी स्प्रेडशीट + नकद हुंडी + अधूरी रसीदों पर चलते हैं। भक्त ऑनलाइन देना चाहते हैं, लेकिन 80G और पारदर्शिता का भरोसा नहीं मिलता।"
                : "Most temples still run on spreadsheets + cash hundi + incomplete receipts. Devotees want to give online, but lack trust around 80G and fund usage."}
            </p>
            <p>
              {hi
                ? "MandirOS जामसावली पर: अतिथि दान, 80G-रेडी रसीद, सार्वजनिक ट्रस्ट लेजर, दैनिक न्यासी ops (हुंडी + चेकलिस्ट), और embed विजेट।"
                : "On Jamsawli, MandirOS ships: guest donate, 80G-ready receipts, public trust ledger, daily trustee ops (hundi + checklist), and embed widgets."}
            </p>
          </div>
        </section>

        <section className="mt-8 rounded-2xl bg-sacred-maroon text-white p-6 md:p-8">
          <h2 className="text-xl font-bold mb-3">
            {hi ? "न्यासियों के लिए मेट्रिक्स (लक्ष्य)" : "Trustee metrics (targets)"}
          </h2>
          <ul className="space-y-2 text-white/90 text-sm md:text-base">
            <li>• 90 days: ₹10L+ online donations processed</li>
            <li>• 50%+ donations with PAN for 80G</li>
            <li>• Daily ops checklist completion rate &gt; 80%</li>
            <li>• Public transparency page as shareable proof for donors & govt</li>
          </ul>
          <p className="mt-4 text-sm text-white/70">
            {hi
              ? "वास्तविक आँकड़े live donation डेटा से अपडेट करें — यह टेम्पलेट है, काल्पनिक सफलता का दावा नहीं।"
              : "Replace with live metrics as data accumulates — this is a template, not fabricated success."}
          </p>
        </section>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/platform">
            <Button className="bg-saffron-500 hover:bg-saffron-600">
              {hi ? "MandirOS देखें" : "Explore MandirOS"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/admin/temples/new">
            <Button variant="outline">
              {hi ? "अपना मंदिर जोड़ें" : "List your temple"}
            </Button>
          </Link>
          <Link href="/t/jamsawli-hanuman/donate">
            <Button variant="ghost">{hi ? "जामसावली पर दान" : "Donate at Jamsawli"}</Button>
          </Link>
        </div>
      </section>
    </main>
  )
}
