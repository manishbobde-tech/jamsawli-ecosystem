"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/lib/i18n"
import {
  IndianRupee,
  CalendarClock,
  FileText,
  ShieldCheck,
  Clock,
  CheckCircle2,
  ArrowRight,
} from "lucide-react"

export default function ForTrusteesPage() {
  const { locale } = useI18n()
  const hi = locale === "hi"

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-saffron-50">
      <section className="max-w-4xl mx-auto px-4 pt-16 pb-10">
        <p className="text-saffron-600 font-semibold text-sm uppercase tracking-wide mb-2">
          {hi ? "न्यासी बोर्ड के लिए" : "For temple trustee boards"}
        </p>
        <h1 className="text-4xl md:text-5xl font-bold text-sacred-maroon leading-tight">
          {hi
            ? "मंदिर सॉफ्टवेयर पर पैसा क्यों खर्च करें?"
            : "Why spend money on temple software?"}
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          {hi
            ? "ईमानदार जवाब: AI चैटबॉट के लिए नहीं। पैसों का हिसाब, त्योहार की कतार, और CA के लिए साफ़ रसीदों के लिए।"
            : "Honest answer: not for an AI chatbot. For rupee control, festival queues, and clean receipts your CA will accept."}
        </p>
      </section>

      <section className="max-w-4xl mx-auto px-4 pb-12 grid md:grid-cols-2 gap-4">
        {[
          {
            icon: IndianRupee,
            t: hi ? "रोज़ का 'कितना आया?'" : "Daily “kitna aaya?”",
            d: hi
              ? "काउंटर + ऑनलाइन + पूजा एक जगह। सोमवार को WhatsApp रिपोर्ट।"
              : "Counter + online + poojas in one place. Monday WhatsApp-ready report.",
          },
          {
            icon: CalendarClock,
            t: hi ? "त्योहार पर स्लॉट भरा तो रोकें" : "Festival slots that don’t double-book",
            d: hi
              ? "गोत्र + संकल्प + क्षमता। पंडा/क्लर्क को कागज़ की भीड़ कम।"
              : "Gotra + sankalp + capacity. Less paper chaos for clerks.",
          },
          {
            icon: FileText,
            t: hi ? "80G रसीद + 10BD निर्यात" : "80G receipts + 10BD export",
            d: hi
              ? "ट्रस्ट पंजीकरण नंबर सेट करें — रसीद प्रिंट, CA को CSV।"
              : "Set trust registration once — print receipts, CSV for your CA.",
          },
          {
            icon: ShieldCheck,
            t: hi ? "सार्वजनिक पारदर्शिता" : "Public transparency",
            d: hi
              ? "सरकारी अनुदान / बड़े दानदाता पूछें तो जवाब तैयार।"
              : "When govt grants or big donors ask — the ledger is ready.",
          },
        ].map((x) => (
          <div key={x.t} className="bg-white border rounded-2xl p-5 shadow-sm">
            <x.icon className="h-6 w-6 text-saffron-600 mb-2" />
            <h2 className="font-semibold text-gray-900">{x.t}</h2>
            <p className="text-sm text-gray-600 mt-1">{x.d}</p>
          </div>
        ))}
      </section>

      <section className="bg-sacred-maroon text-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Clock className="h-6 w-6" />
            {hi ? "ROI — साधारण हिसाब" : "ROI — simple math"}
          </h2>
          <ul className="space-y-3 text-white/90">
            <li className="flex gap-2">
              <CheckCircle2 className="h-5 w-5 text-saffron-300 shrink-0" />
              {hi
                ? "Growth ₹2,499/महीना ≈ ₹83/दिन — एक क्लर्क के 1 घंटे से कम।"
                : "Growth ₹2,499/mo ≈ ₹83/day — less than one clerk-hour."}
            </li>
            <li className="flex gap-2">
              <CheckCircle2 className="h-5 w-5 text-saffron-300 shrink-0" />
              {hi
                ? "अगर ऑनलाइन दान सिर्फ ₹50,000/महीना बढ़े — सॉफ्टवेयर खुद चुकता।"
                : "If online donations rise even ₹50,000/mo — software pays for itself."}
            </li>
            <li className="flex gap-2">
              <CheckCircle2 className="h-5 w-5 text-saffron-300 shrink-0" />
              {hi
                ? "एक ऑडिट / 80G गड़बड़ी का तनाव — ₹2,499 से कहीं महँगा।"
                : "One bad audit / missing 80G trail costs far more than ₹2,499."}
            </li>
          </ul>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-sacred-maroon mb-4">
          {hi ? "क्या न खरीदें" : "What not to buy us for"}
        </h2>
        <p className="text-gray-600 mb-4">
          {hi
            ? "हम दावा नहीं करते कि हम सबसे गहरा accounting ERP हैं। Tally/Busy/compliance ERP अलग काम करते हैं। MandirOS = भक्त भुगतान + काउंटर आदत + ट्रस्ट/पारदर्शिता।"
            : "We do not claim to replace the deepest accounting ERP. Tally/Busy and compliance ERPs do different jobs. MandirOS = devotee payments + counter habit + trust/transparency."}
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/demo">
            <Button className="bg-saffron-500 hover:bg-saffron-600 gap-1">
              {hi ? "Free vs Pro देखें" : "See Free vs Pro"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/dashboard/money-desk">
            <Button variant="outline">{hi ? "मनी डेस्क" : "Money desk"}</Button>
          </Link>
          <Link href="/admin/temples/new">
            <Button variant="ghost">{hi ? "आवेदन" : "Apply"}</Button>
          </Link>
        </div>
      </section>
    </main>
  )
}
