export type TourAudience = "devotee" | "trustee" | "sales"

export interface TourStep {
  id: string
  title: string
  titleHi: string
  body: string
  bodyHi: string
  /** Optional route to highlight / navigate */
  href?: string
  cta?: string
  ctaHi?: string
  icon?: string
}

export const DEVOTEE_TOUR: TourStep[] = [
  {
    id: "welcome",
    title: "Welcome to MandirOS",
    titleHi: "MandirOS में आपका स्वागत है",
    body: "On a temple tenant (e.g. /t/jamsawli-hanuman) you get donate, book, transparency — donate, book sevas, see where money goes, and stay safe on your yatra.",
    bodyHi: "यह मंदिर का डिजिटल ट्रस्ट लेयर है — दान, पूजा बुकिंग, पारदर्शिता और सुरक्षित यात्रा।",
    icon: "🙏",
  },
  {
    id: "donate",
    title: "Donate with trust",
    titleHi: "भरोसे के साथ दान",
    body: "Pay via UPI/cards without mandatory login. Add PAN for 80G. Get a printable receipt after payment.",
    bodyHi: "बिना लॉगिन के UPI/कार्ड से दान। 80G के लिए PAN। भुगतान के बाद प्रिंट रसीद।",
    href: "/t/jamsawli-hanuman/donate",
    cta: "Open donate",
    ctaHi: "दान खोलें",
    icon: "💰",
  },
  {
    id: "book",
    title: "Book pooja from home",
    titleHi: "घर बैठे पूजा बुक करें",
    body: "Pick a seva, date and slot. Pay online. Avoid festival queue stress for your family.",
    bodyHi: "सेवा, तारीख और स्लॉट चुनें। ऑनलाइन भुगतान। परिवार के साथ आसान दर्शन।",
    href: "/t/jamsawli-hanuman/book",
    cta: "Book seva",
    ctaHi: "पूजा बुक करें",
    icon: "📅",
  },
  {
    id: "transparency",
    title: "See every rupee",
    titleHi: "हर रुपये का हिसाब",
    body: "Public fund totals and (on Pro) project milestones. Trust is the product.",
    bodyHi: "सार्वजनिक फंड और (Pro पर) परियोजना प्रगति। भरोसा ही उत्पाद है।",
    href: "/t/jamsawli-hanuman/transparency",
    cta: "Open ledger",
    ctaHi: "लेजर खोलें",
    icon: "🔍",
  },
  {
    id: "pilgrim",
    title: "On-site safety",
    titleHi: "मंदिर पर सुरक्षा",
    body: "SOS, lost & found, crowd awareness, and QR check-in when you arrive.",
    bodyHi: "SOS, खोया-पाया, भीड़ जानकारी, और आने पर QR चेक-इन।",
    href: "/t/jamsawli-hanuman/pilgrim",
    cta: "Pilgrim help",
    ctaHi: "तीर्थयात्री सेवा",
    icon: "🆘",
  },
  {
    id: "ai",
    title: "Ask Hanuman AI",
    titleHi: "हनुमान AI से पूछें",
    body: "Tap the chat bubble anytime for temple history, timings, and how to use MandirOS.",
    bodyHi: "चैट बबल से मंदिर इतिहास, समय और ऐप सहायता पूछें।",
    icon: "🤖",
  },
]

export const TRUSTEE_TOUR: TourStep[] = [
  {
    id: "dashboard",
    title: "Live temple dashboard",
    titleHi: "लाइव डैशबोर्ड",
    body: "Real donations, bookings, check-ins and cash — not fake demo numbers.",
    bodyHi: "वास्तविक दान, बुकिंग, चेक-इन और नकद — नकली आँकड़े नहीं।",
    href: "/dashboard",
    icon: "📊",
  },
  {
    id: "money-desk",
    title: "Counter money desk",
    titleHi: "काउंटर मनी डेस्क",
    body: "This is why temples pay. Cash/UPI counter receipt in ~10 seconds. Open every day.",
    bodyHi: "इसीलिए मंदिर पैसे देते हैं। ~10 सेकंड में काउंटर रसीद। रोज़ खोलें।",
    href: "/dashboard/money-desk",
    cta: "Open money desk",
    ctaHi: "मनी डेस्क",
    icon: "💰",
  },
  {
    id: "report",
    title: "Weekly trustee report",
    titleHi: "साप्ताहिक न्यासी रिपोर्ट",
    body: "One page: kitna aaya online + counter + poojas. Share on WhatsApp Mondays.",
    bodyHi: "एक पेज: ऑनलाइन + काउंटर + पूजा। सोमवार WhatsApp।",
    href: "/dashboard/report",
    cta: "Open report",
    ctaHi: "रिपोर्ट",
    icon: "📋",
  },
  {
    id: "ops",
    title: "Daily ops + hundi",
    titleHi: "दैनिक ops + हुंडी",
    body: "Checklist for aarti, reconcile online gifts, log hundi cash (Growth+).",
    bodyHi: "आरती चेकलिस्ट, ऑनलाइन मिलाप, हुंडी लॉग (Growth+)।",
    href: "/dashboard/ops",
    cta: "Open ops",
    ctaHi: "ops खोलें",
    icon: "✅",
  },
  {
    id: "trust",
    title: "80G & Form 10BD",
    titleHi: "80G और फॉर्म 10BD",
    body: "Configure trust registration and export donations for your CA (Trust Pro).",
    bodyHi: "ट्रस्ट पंजीकरण सेट करें और CA के लिए CSV निर्यात (Trust Pro)।",
    href: "/dashboard/trust",
    icon: "📄",
  },
  {
    id: "widgets",
    title: "Embed on your website",
    titleHi: "अपनी साइट पर एम्बेड",
    body: "Keep your existing site. Drop donate/book widgets in minutes (Growth+).",
    bodyHi: "पुरानी वेबसाइट रखें। मिनटों में दान/बुकिंग विजेट (Growth+)।",
    href: "/dashboard/widgets",
    icon: "🧩",
  },
  {
    id: "billing",
    title: "Plans that unlock power",
    titleHi: "प्लान से ताकत खुलती है",
    body: "Free → useful. Growth → run the mandir. Trust Pro → AI, API, full compliance.",
    bodyHi: "Free → उपयोगी। Growth → मंदिर चलाएँ। Trust Pro → AI, API, पूर्ण अनुपालन।",
    href: "/dashboard/billing",
    cta: "Compare plans",
    ctaHi: "प्लान देखें",
    icon: "⚡",
  },
]

export const SALES_TOUR: TourStep[] = [
  {
    id: "compare",
    title: "Feel Free vs Pro",
    titleHi: "Free बनाम Pro महसूस करें",
    body: "No sales call needed. Switch between a Free temple and a Trust Pro temple side by side.",
    bodyHi: "बिना सेल्स कॉल के Free और Trust Pro मंदिर साथ-साथ आज़माएँ।",
    href: "/demo",
    cta: "Open demo",
    ctaHi: "डेमो खोलें",
    icon: "🧪",
  },
  {
    id: "pricing",
    title: "Transparent pricing",
    titleHi: "पारदर्शी मूल्य",
    body: "₹0 · ₹2,499 · ₹7,999 with clear feature unlocks and transaction fees.",
    bodyHi: "₹0 · ₹2,499 · ₹7,999 — स्पष्ट सुविधाएँ और लेनदेन शुल्क।",
    href: "/pricing",
    icon: "🏷️",
  },
  {
    id: "apply",
    title: "List your temple",
    titleHi: "अपना मंदिर जोड़ें",
    body: "Self-serve application. Go live with donate + book, then upgrade when ready.",
    bodyHi: "स्वयं आवेदन। दान + बुकिंग से शुरू, फिर अपग्रेड।",
    href: "/admin/temples/new",
    cta: "Apply now",
    ctaHi: "अभी आवेदन",
    icon: "🛕",
  },
]
