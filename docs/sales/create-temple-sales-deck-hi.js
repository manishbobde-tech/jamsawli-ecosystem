/**
 * MandirOS temple sales deck — Hindi (for trustees / board).
 * Run: node docs/sales/create-temple-sales-deck-hi.js
 */
const pptxgen = require("pptxgenjs")
const path = require("path")

const pres = new pptxgen()
pres.layout = "LAYOUT_16x9"
pres.author = "MandirOS"
pres.title = "MandirOS — मंदिरों का डिजिटल ट्रस्ट लेयर"
pres.subject = "मंदिर न्यासियों के लिए बिक्री प्रस्तुति"

// Sacred palette
const C = {
  maroon: "7F1D1D",
  saffron: "EA580C",
  saffronSoft: "F97316",
  cream: "FFF7ED",
  creamCard: "FFFFFF",
  stone: "57534E",
  stoneLight: "A8A29E",
  ink: "1C1917",
  green: "15803D",
  greenBg: "F0FDF4",
  border: "E7E5E4",
}

// Fonts that render Devanagari on most systems
const FH = "Nirmala UI" // Hindi UI font (Windows); falls back if missing
const FE = "Calibri"
const FT = "Georgia"

function addFooter(slide, page, total = 14) {
  slide.addText("MandirOS  ·  मंदिर न्यासियों के लिए गोपनीय", {
    x: 0.5,
    y: 5.28,
    w: 7.2,
    h: 0.25,
    fontSize: 10,
    fontFace: FH,
    color: C.stoneLight,
    margin: 0,
  })
  slide.addText(`${page} / ${total}`, {
    x: 8.5,
    y: 5.28,
    w: 1,
    h: 0.25,
    fontSize: 10,
    fontFace: FE,
    color: C.stoneLight,
    align: "right",
    margin: 0,
  })
}

function sectionBar(slide, label) {
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.5,
    y: 0.28,
    w: 2.6,
    h: 0.32,
    fill: { color: C.cream },
    line: { color: C.saffron, width: 1 },
    rectRadius: 0.08,
  })
  slide.addText(label, {
    x: 0.5,
    y: 0.28,
    w: 2.6,
    h: 0.32,
    fontSize: 11,
    fontFace: FH,
    color: C.saffron,
    bold: true,
    align: "center",
    valign: "middle",
    margin: 0,
  })
}

// 1. TITLE
{
  const s = pres.addSlide()
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 5.625, fill: { color: C.maroon },
  })
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 0.18, h: 5.625, fill: { color: C.saffron },
  })
  s.addText("MANDIROS", {
    x: 0.7, y: 1.15, w: 8.5, h: 0.35,
    fontSize: 14, fontFace: FE, color: C.saffronSoft,
    bold: true, charSpacing: 4, margin: 0,
  })
  s.addText("आपके मंदिर का\nडिजिटल ट्रस्ट लेयर", {
    x: 0.7, y: 1.6, w: 8.5, h: 1.5,
    fontSize: 36, fontFace: FH, color: "FFFFFF", bold: true, margin: 0,
  })
  s.addText(
    "काउंटर नकद, ऑनलाइन दान, पूजा बुकिंग — और सोमवार का जवाब:\nकितना आया?",
    {
      x: 0.7, y: 3.35, w: 8.2, h: 0.75,
      fontSize: 16, fontFace: FH, color: "FECACA", margin: 0,
    }
  )
  s.addText("मंदिर न्यासियों के लिए  ·  बोर्ड प्रस्तुति  ·  २०२६", {
    x: 0.7, y: 4.75, w: 8, h: 0.3,
    fontSize: 13, fontFace: FH, color: "FCA5A5", margin: 0,
  })
}

// 2. REALITY
{
  const s = pres.addSlide()
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 5.625, fill: { color: C.cream },
  })
  sectionBar(s, "वास्तविकता")
  s.addText("बोर्ड असल में क्या पूछता है", {
    x: 0.5, y: 0.75, w: 9, h: 0.5,
    fontSize: 28, fontFace: FH, color: C.maroon, bold: true, margin: 0,
  })

  const pains = [
    { q: "कितना आया?", a: "नकद + UPI + ऑनलाइन अलग-अलग जगह। हर सोमवार Excel की लड़ाई।" },
    { q: "पैसे कहाँ गए?", a: "भक्त पूछते हैं। पारदर्शिता स्क्रीनशॉट है — सार्वजनिक बही नहीं।" },
    { q: "त्योहार का हंगामा?", a: "डबल बुकिंग, बिना गोत्र/संकल्प, लंबी कतार, नाराज़ परिवार।" },
    { q: "80G / CA तैयार?", a: "WhatsApp पर PAN। रसीदें अधूरी। Form 10BD दौड़।" },
  ]
  pains.forEach((p, i) => {
    const y = 1.4 + i * 0.85
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 0.5, y, w: 9, h: 0.75,
      fill: { color: C.creamCard },
      line: { color: C.border, width: 1 },
      rectRadius: 0.1,
    })
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 0.65, y: y + 0.15, w: 0.12, h: 0.45,
      fill: { color: C.saffron }, rectRadius: 0.04,
    })
    s.addText(p.q, {
      x: 1.0, y: y + 0.08, w: 8.2, h: 0.3,
      fontSize: 16, fontFace: FH, color: C.maroon, bold: true, margin: 0,
    })
    s.addText(p.a, {
      x: 1.0, y: y + 0.4, w: 8.2, h: 0.28,
      fontSize: 13, fontFace: FH, color: C.stone, margin: 0,
    })
  })
  addFooter(s, 2)
}

// 3. HONEST
{
  const s = pres.addSlide()
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 5.625, fill: { color: C.cream },
  })
  sectionBar(s, "ईमानदार बात")
  s.addText("हम “AI मंदिर” नहीं बेचते", {
    x: 0.5, y: 0.75, w: 9, h: 0.45,
    fontSize: 28, fontFace: FH, color: C.maroon, bold: true, margin: 0,
  })
  s.addText("बोर्ड शांति के लिए चेक लिखता है — फीचर लिस्ट के लिए नहीं।", {
    x: 0.5, y: 1.25, w: 9, h: 0.35,
    fontSize: 15, fontFace: FH, color: C.stone, italic: true, margin: 0,
  })

  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.5, y: 1.85, w: 4.35, h: 2.9,
    fill: { color: "FEF2F2" }, line: { color: "FECACA", width: 1 }, rectRadius: 0.12,
  })
  s.addText("नायक नहीं", {
    x: 0.75, y: 2.05, w: 3.9, h: 0.35,
    fontSize: 14, fontFace: FH, color: "B91C1C", bold: true, margin: 0,
  })
  s.addText(
    [
      { text: "चैटबॉट व्यक्तित्व को प्रोडक्ट बनाना", options: { bullet: true, breakLine: true } },
      { text: "भक्ति लीडरबोर्ड / गेमिफिकेशन", options: { bullet: true, breakLine: true } },
      { text: "१४ अधूरे मॉड्यूल", options: { bullet: true, breakLine: true } },
      { text: "“भारत का पहला AI मंदिर” दावे", options: { bullet: true, breakLine: true } },
      { text: "न्यासियों को SaaS jargon", options: { bullet: true } },
    ],
    { x: 0.75, y: 2.5, w: 3.9, h: 2.0, fontSize: 13, fontFace: FH, color: C.ink, margin: 0 }
  )

  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 5.15, y: 1.85, w: 4.35, h: 2.9,
    fill: { color: C.greenBg }, line: { color: "BBF7D0", width: 1 }, rectRadius: 0.12,
  })
  s.addText("आप इसके लिए भुगतान करेंगे", {
    x: 5.4, y: 2.05, w: 3.9, h: 0.35,
    fontSize: 14, fontFace: FH, color: C.green, bold: true, margin: 0,
  })
  s.addText(
    [
      { text: "बिना Excel के रोज “कितना आया”", options: { bullet: true, breakLine: true } },
      { text: "काउंटर रसीद ~१० सेकंड में", options: { bullet: true, breakLine: true } },
      { text: "त्योहार स्लॉट बिना डबल-बुकिंग", options: { bullet: true, breakLine: true } },
      { text: "सार्वजनिक पारदर्शिता जिस पर भरोसा हो", options: { bullet: true, breakLine: true } },
      { text: "80G ट्रेल्स जो CA इस्तेमाल कर सके", options: { bullet: true } },
    ],
    { x: 5.4, y: 2.5, w: 3.9, h: 2.0, fontSize: 13, fontFace: FH, color: C.ink, margin: 0 }
  )
  addFooter(s, 3)
}

// 4. PRODUCT
{
  const s = pres.addSlide()
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 5.625, fill: { color: C.cream },
  })
  sectionBar(s, "उत्पाद")
  s.addText("MandirOS एक वाक्य में", {
    x: 0.5, y: 0.75, w: 9, h: 0.4,
    fontSize: 28, fontFace: FH, color: C.maroon, bold: true, margin: 0,
  })
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.5, y: 1.35, w: 9, h: 1.15,
    fill: { color: C.maroon }, rectRadius: 0.12,
  })
  s.addText(
    "आपके मंदिर का डिजिटल ट्रस्ट लेयर — हर रुपया दिखे,\nहर सेवा संकल्प के साथ, हर सोमवार कुल तैयार।",
    {
      x: 0.8, y: 1.5, w: 8.4, h: 0.85,
      fontSize: 17, fontFace: FH, color: "FFFFFF", align: "center", valign: "middle", margin: 0,
    }
  )

  const pillars = [
    { t: "पैसा", d: "काउंटर डेस्क + ऑनलाइन + साप्ताहिक बोर्ड रिपोर्ट" },
    { t: "सेवा", d: "गोत्र, संकल्प, स्लॉट, प्रमाणपत्र" },
    { t: "विश्वास", d: "सार्वजनिक बही + 80G रसीदें" },
    { t: "संचालन", d: "QR पोस्टर, त्योहार, तीर्थयात्री सुरक्षा" },
  ]
  pillars.forEach((p, i) => {
    const x = 0.5 + i * 2.35
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x, y: 2.85, w: 2.2, h: 1.9,
      fill: { color: C.creamCard },
      line: { color: C.border, width: 1 },
      rectRadius: 0.12,
    })
    s.addShape(pres.shapes.OVAL, {
      x: x + 0.8, y: 3.05, w: 0.55, h: 0.55,
      fill: { color: C.saffron },
    })
    s.addText(String(i + 1), {
      x: x + 0.8, y: 3.05, w: 0.55, h: 0.55,
      fontSize: 16, fontFace: FE, color: "FFFFFF", bold: true,
      align: "center", valign: "middle", margin: 0,
    })
    s.addText(p.t, {
      x: x + 0.1, y: 3.75, w: 2.0, h: 0.35,
      fontSize: 16, fontFace: FH, color: C.maroon, bold: true, align: "center", margin: 0,
    })
    s.addText(p.d, {
      x: x + 0.12, y: 4.15, w: 1.96, h: 0.5,
      fontSize: 11, fontFace: FH, color: C.stone, align: "center", margin: 0,
    })
  })
  addFooter(s, 4)
}

// 5. MONEY DESK
{
  const s = pres.addSlide()
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 5.625, fill: { color: C.cream },
  })
  sectionBar(s, "मुख्य आदत")
  s.addText("काउंटर मनी डेस्क", {
    x: 0.5, y: 0.75, w: 6, h: 0.45,
    fontSize: 30, fontFace: FH, color: C.maroon, bold: true, margin: 0,
  })
  s.addText("क्लर्क हर दिन MandirOS इसलिए खोलता है", {
    x: 0.5, y: 1.25, w: 6, h: 0.35,
    fontSize: 14, fontFace: FH, color: C.stone, italic: true, margin: 0,
  })

  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 6.6, y: 0.7, w: 2.9, h: 1.5,
    fill: { color: C.saffron }, rectRadius: 0.12,
  })
  s.addText("~१० सेकंड", {
    x: 6.6, y: 0.9, w: 2.9, h: 0.65,
    fontSize: 28, fontFace: FH, color: "FFFFFF", bold: true, align: "center", margin: 0,
  })
  s.addText("नकद → प्रिंट रसीद", {
    x: 6.7, y: 1.65, w: 2.7, h: 0.35,
    fontSize: 12, fontFace: FH, color: "FFEDD5", align: "center", margin: 0,
  })

  const steps = [
    { n: "1", t: "राशि + तरीका", d: "नकद, काउंटर UPI, कार्ड" },
    { n: "2", t: "वैकल्पिक 80G", d: "ज़रूरत पर नाम + PAN" },
    { n: "3", t: "दर्ज करें", d: "असली दान रसीद बनती है" },
    { n: "4", t: "प्रिंट / साझा", d: "भक्त संतुष्ट लौटता है" },
  ]
  steps.forEach((st, i) => {
    const x = 0.5 + i * 2.35
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x, y: 2.5, w: 2.2, h: 2.15,
      fill: { color: C.creamCard },
      line: { color: C.border, width: 1 },
      rectRadius: 0.1,
    })
    s.addText(st.n, {
      x, y: 2.65, w: 2.2, h: 0.45,
      fontSize: 28, fontFace: FE, color: C.saffron, bold: true, align: "center", margin: 0,
    })
    s.addText(st.t, {
      x: x + 0.1, y: 3.2, w: 2.0, h: 0.4,
      fontSize: 14, fontFace: FH, color: C.maroon, bold: true, align: "center", margin: 0,
    })
    s.addText(st.d, {
      x: x + 0.12, y: 3.7, w: 1.96, h: 0.6,
      fontSize: 12, fontFace: FH, color: C.stone, align: "center", margin: 0,
    })
  })
  addFooter(s, 5)
}

// 6. WEEKLY REPORT
{
  const s = pres.addSlide()
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 5.625, fill: { color: C.cream },
  })
  sectionBar(s, "बोर्ड मीटिंग")
  s.addText("साप्ताहिक न्यासी रिपोर्ट", {
    x: 0.5, y: 0.75, w: 9, h: 0.45,
    fontSize: 28, fontFace: FH, color: C.maroon, bold: true, margin: 0,
  })
  s.addText("बिना Excel के सोमवार का संदेश", {
    x: 0.5, y: 1.25, w: 9, h: 0.3,
    fontSize: 14, fontFace: FH, color: C.stone, italic: true, margin: 0,
  })

  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.5, y: 1.75, w: 5.5, h: 3.0,
    fill: { color: C.creamCard },
    line: { color: C.border, width: 1 },
    rectRadius: 0.12,
  })
  s.addText("इस सप्ताह — उदाहरण", {
    x: 0.75, y: 1.95, w: 5, h: 0.3,
    fontSize: 12, fontFace: FH, color: C.stoneLight, bold: true, margin: 0,
  })
  s.addText("ऑनलाइन  ·  काउंटर  ·  पूजा  ·  कुल", {
    x: 0.75, y: 2.35, w: 5, h: 0.3,
    fontSize: 13, fontFace: FH, color: C.stone, margin: 0,
  })
  s.addText("₹1,24,500", {
    x: 0.75, y: 2.75, w: 5, h: 0.7,
    fontSize: 40, fontFace: FE, color: C.maroon, bold: true, margin: 0,
  })
  s.addText(
    "हिंदी + अंग्रेज़ी एक पंक्ति · WhatsApp · प्रिंट · ईमेल / Slack ऑटो-सेंड",
    {
      x: 0.75, y: 3.6, w: 5, h: 0.7,
      fontSize: 13, fontFace: FH, color: C.stone, margin: 0,
    }
  )

  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 6.3, y: 1.75, w: 3.2, h: 3.0,
    fill: { color: C.maroon }, rectRadius: 0.12,
  })
  s.addText("बोर्ड क्यों चाहेगा", {
    x: 6.5, y: 2.0, w: 2.8, h: 0.4,
    fontSize: 14, fontFace: FH, color: C.saffronSoft, bold: true, margin: 0,
  })
  s.addText(
    [
      { text: "“Excel भेजो” खत्म", options: { bullet: true, breakLine: true } },
      { text: "ऑनलाइन + हुंडी एक साथ", options: { bullet: true, breakLine: true } },
      { text: "मीटिंग से पहले तैयार", options: { bullet: true, breakLine: true } },
      { text: "हर हफ्ते एक ही कहानी", options: { bullet: true } },
    ],
    {
      x: 6.5, y: 2.55, w: 2.8, h: 1.9,
      fontSize: 14, fontFace: FH, color: "FFFFFF", margin: 0,
    }
  )
  addFooter(s, 6)
}

// 7. TRUST
{
  const s = pres.addSlide()
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 5.625, fill: { color: C.cream },
  })
  sectionBar(s, "ट्रस्ट लेयर")
  s.addText("पारदर्शिता जो भक्त खोल सकें", {
    x: 0.5, y: 0.75, w: 9, h: 0.45,
    fontSize: 26, fontFace: FH, color: C.maroon, bold: true, margin: 0,
  })

  const cards = [
    { t: "सार्वजनिक फंड बही", d: "उद्देश्य के अनुसार कुल — निर्माण, भंडारा, सामान्य। PDF श्रृंखला नहीं, URL।" },
    { t: "दान अभियान", d: "लक्ष्य के मुकाबले प्रगति बार। बड़े अनुरोधों के लिए सामाजिक प्रमाण।" },
    { t: "80G-तैयार रसीदें", d: "नाम, PAN, रसीद संख्या। CA-अनुकूल ट्रेल्स — कर सलाह नहीं।" },
    { t: "Form 10BD निर्यात", d: "Trust Pro: वित्तीय वर्ष CSV। पंजीकरण CA सत्यापित करता है।" },
  ]
  cards.forEach((c, i) => {
    const col = i % 2
    const row = Math.floor(i / 2)
    const x = 0.5 + col * 4.7
    const y = 1.45 + row * 1.55
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x, y, w: 4.45, h: 1.4,
      fill: { color: C.creamCard },
      line: { color: C.border, width: 1 },
      rectRadius: 0.1,
    })
    s.addText(c.t, {
      x: x + 0.25, y: y + 0.2, w: 4.0, h: 0.35,
      fontSize: 15, fontFace: FH, color: C.maroon, bold: true, margin: 0,
    })
    s.addText(c.d, {
      x: x + 0.25, y: y + 0.6, w: 4.0, h: 0.65,
      fontSize: 13, fontFace: FH, color: C.stone, margin: 0,
    })
  })
  addFooter(s, 7)
}

// 8. FESTIVAL
{
  const s = pres.addSlide()
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 5.625, fill: { color: C.cream },
  })
  sectionBar(s, "त्योहार के लिए")
  s.addText("पूजा बुकिंग जो पुजारी इस्तेमाल करें", {
    x: 0.5, y: 0.75, w: 9, h: 0.45,
    fontSize: 26, fontFace: FH, color: C.maroon, bold: true, margin: 0,
  })

  const items = [
    { t: "गोत्र + संकल्प", d: "सिर्फ भुगतान नहीं — मंदिर-स्तर का भक्त डेटा" },
    { t: "स्लॉट क्षमता", d: "Growth+: सीमा ताकि ओवरबुक न हो" },
    { t: "त्योहार बोर्ड", d: "कौन सा स्लॉट भर रहा है; पुजारी योजना" },
    { t: "प्रमाणपत्र", d: "पुष्टि के बाद प्रिंट / साझा" },
    { t: "QR पोस्टर", d: "गेट → दान / बुक / चेक-इन, बिना डिज़ाइन खर्च" },
    { t: "तीर्थयात्री सुरक्षा", d: "SOS, खोया-पाया (Growth+)" },
  ]
  items.forEach((it, i) => {
    const col = i % 3
    const row = Math.floor(i / 3)
    const x = 0.5 + col * 3.1
    const y = 1.45 + row * 1.65
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x, y, w: 2.95, h: 1.45,
      fill: { color: C.creamCard },
      line: { color: C.border, width: 1 },
      rectRadius: 0.1,
    })
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: x + 0.2, y: y + 0.25, w: 0.5, h: 0.5,
      fill: { color: "FFEDD5" }, rectRadius: 0.08,
    })
    s.addText(String(i + 1), {
      x: x + 0.2, y: y + 0.25, w: 0.5, h: 0.5,
      fontSize: 14, fontFace: FE, color: C.saffron, bold: true,
      align: "center", valign: "middle", margin: 0,
    })
    s.addText(it.t, {
      x: x + 0.85, y: y + 0.28, w: 1.9, h: 0.4,
      fontSize: 13, fontFace: FH, color: C.maroon, bold: true, margin: 0,
    })
    s.addText(it.d, {
      x: x + 0.2, y: y + 0.85, w: 2.55, h: 0.45,
      fontSize: 12, fontFace: FH, color: C.stone, margin: 0,
    })
  })
  addFooter(s, 8)
}

// 9. DAY IN LIFE
{
  const s = pres.addSlide()
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 5.625, fill: { color: C.cream },
  })
  sectionBar(s, "संचालन")
  s.addText("MandirOS पर एक दिन", {
    x: 0.5, y: 0.75, w: 9, h: 0.4,
    fontSize: 28, fontFace: FH, color: C.maroon, bold: true, margin: 0,
  })

  const day = [
    { t: "06:30", title: "क्लर्क", d: "मनी डेस्क खुला — पहली हुंडी / काउंटर एंट्री" },
    { t: "09:00", title: "भक्त", d: "QR पोस्टर → गोत्र-संकल्प के साथ सेवा बुक" },
    { t: "12:00", title: "ऑनलाइन", d: "UPI दान + वैकल्पिक 80G रसीद" },
    { t: "18:00", title: "क्लर्क", d: "शाम की नकद प्रविष्टि — दिन का कुल" },
    { t: "सोम", title: "न्यासी", d: "साप्ताहिक रिपोर्ट → बोर्ड WhatsApp" },
  ]
  day.forEach((d, i) => {
    const y = 1.35 + i * 0.7
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 0.5, y, w: 1.3, h: 0.55,
      fill: { color: i === 4 ? C.maroon : C.saffron }, rectRadius: 0.08,
    })
    s.addText(d.t, {
      x: 0.5, y, w: 1.3, h: 0.55,
      fontSize: 13, fontFace: FH, color: "FFFFFF", bold: true,
      align: "center", valign: "middle", margin: 0,
    })
    s.addText(d.title, {
      x: 2.0, y, w: 1.5, h: 0.55,
      fontSize: 14, fontFace: FH, color: C.maroon, bold: true, valign: "middle", margin: 0,
    })
    s.addText(d.d, {
      x: 3.5, y, w: 5.8, h: 0.55,
      fontSize: 14, fontFace: FH, color: C.stone, valign: "middle", margin: 0,
    })
  })
  addFooter(s, 9)
}

// 10. LIVE
{
  const s = pres.addSlide()
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 5.625, fill: { color: C.cream },
  })
  sectionBar(s, "लाइव देखें")
  s.addText("हमारी बात न मानें — खोलकर देखें", {
    x: 0.5, y: 0.75, w: 9, h: 0.45,
    fontSize: 26, fontFace: FH, color: C.maroon, bold: true, margin: 0,
  })

  const links = [
    { t: "प्लेटफ़ॉर्म", u: "jamsawli-ecosystem.vercel.app", d: "MandirOS होम · मूल्य · सुविधाएँ" },
    { t: "एंकर मंदिर", u: "/t/jamsawli-hanuman", d: "लाइव टेनेन्ट: दान · बुक · पारदर्शिता" },
    { t: "Free बनाम Pro", u: "/demo", d: "अपग्रेड महसूस करें — वही स्क्रीन, अलग ताकत" },
    { t: "७-दिन पायलट", u: "/dashboard/pilot", d: "क्लर्क चेकलिस्ट — ब्रोशर नहीं, आदत" },
  ]
  links.forEach((l, i) => {
    const y = 1.4 + i * 0.85
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 0.5, y, w: 9, h: 0.75,
      fill: { color: C.creamCard },
      line: { color: C.border, width: 1 },
      rectRadius: 0.1,
    })
    s.addText(l.t, {
      x: 0.75, y: y + 0.1, w: 2.3, h: 0.55,
      fontSize: 14, fontFace: FH, color: C.saffron, bold: true, valign: "middle", margin: 0,
    })
    s.addText(l.u, {
      x: 3.1, y: y + 0.08, w: 6.1, h: 0.3,
      fontSize: 13, fontFace: "Consolas", color: C.maroon, margin: 0,
    })
    s.addText(l.d, {
      x: 3.1, y: y + 0.38, w: 6.1, h: 0.28,
      fontSize: 12, fontFace: FH, color: C.stone, margin: 0,
    })
  })
  addFooter(s, 10)
}

// 11. PRICING
{
  const s = pres.addSlide()
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 5.625, fill: { color: C.cream },
  })
  sectionBar(s, "सरल मूल्य")
  s.addText("मुफ़्त शुरू करें। जरूरत पड़ने पर भुगतान करें।", {
    x: 0.5, y: 0.7, w: 9, h: 0.4,
    fontSize: 22, fontFace: FH, color: C.maroon, bold: true, margin: 0,
  })

  const plans = [
    {
      name: "मुफ़्त",
      price: "₹0",
      fee: "2.5% लेनदेन",
      tag: "आदत",
      items: ["ऑनलाइन दान", "मनी डेस्क", "साप्ताहिक रिपोर्ट", "80G रसीदें", "QR पोस्टर"],
      hi: false,
    },
    {
      name: "ग्रोथ",
      price: "₹2,499",
      fee: "2.0% लेनदेन",
      tag: "सबसे लोकप्रिय",
      items: ["Free की सभी सुविधाएँ", "त्योहार क्षमता", "अभियान", "तीर्थयात्री सुरक्षा", "विजेट / एम्बेड"],
      hi: true,
    },
    {
      name: "ट्रस्ट प्रो",
      price: "₹7,999",
      fee: "1.0% लेनदेन",
      tag: "CA / ऑडिट",
      items: ["Growth की सभी सुविधाएँ", "Form 10BD निर्यात", "पूर्ण ट्रस्ट लेजर", "डेवलपर API", "प्राथमिकता सहायता"],
      hi: false,
    },
  ]
  plans.forEach((p, i) => {
    const x = 0.45 + i * 3.15
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x, y: 1.25, w: 3.0, h: 3.6,
      fill: { color: p.hi ? C.maroon : C.creamCard },
      line: { color: p.hi ? C.maroon : C.border, width: 1 },
      rectRadius: 0.12,
    })
    s.addText(p.tag, {
      x, y: 1.4, w: 3.0, h: 0.28,
      fontSize: 11, fontFace: FH,
      color: p.hi ? C.saffronSoft : C.saffron,
      bold: true, align: "center", margin: 0,
    })
    s.addText(p.name, {
      x, y: 1.7, w: 3.0, h: 0.35,
      fontSize: 20, fontFace: FH,
      color: p.hi ? "FFFFFF" : C.maroon,
      bold: true, align: "center", margin: 0,
    })
    s.addText(p.price, {
      x, y: 2.1, w: 3.0, h: 0.45,
      fontSize: 28, fontFace: FE,
      color: p.hi ? "FFFFFF" : C.saffron,
      bold: true, align: "center", margin: 0,
    })
    s.addText(p.fee + " · /माह", {
      x, y: 2.55, w: 3.0, h: 0.25,
      fontSize: 11, fontFace: FH,
      color: p.hi ? "FECACA" : C.stoneLight,
      align: "center", margin: 0,
    })
    s.addText(
      p.items.map((it, idx) => ({
        text: it,
        options: { bullet: true, breakLine: idx < p.items.length - 1 },
      })),
      {
        x: x + 0.25, y: 3.0, w: 2.5, h: 1.6,
        fontSize: 12, fontFace: FH,
        color: p.hi ? "FFFFFF" : C.ink,
        margin: 0,
      }
    )
  })
  addFooter(s, 11)
}

// 12. ROI
{
  const s = pres.addSlide()
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 5.625, fill: { color: C.cream },
  })
  sectionBar(s, "क्यों भुगतान")
  s.addText("₹2,499 / माह बोर्ड को क्या देता है", {
    x: 0.5, y: 0.75, w: 9, h: 0.4,
    fontSize: 24, fontFace: FH, color: C.maroon, bold: true, margin: 0,
  })

  const rois = [
    { n: "समय", d: "हर हफ्ते Excel + WhatsApp का पीछा कम" },
    { n: "शांति", d: "मीटिंग से पहले सोमवार का कुल तैयार" },
    { n: "विश्वास", d: "भक्त पूछें तो सार्वजनिक पेज" },
    { n: "त्योहार", d: "भीड़ के दिन क्षमता नियंत्रण" },
    { n: "क्लर्क आदत", d: "रोज खुले — साल में एक बार नहीं" },
    { n: "अपग्रेड पथ", d: "मुफ़्त शुरू; जरूरत पर भुगतान" },
  ]
  rois.forEach((r, i) => {
    const col = i % 3
    const row = Math.floor(i / 3)
    const x = 0.5 + col * 3.1
    const y = 1.4 + row * 1.7
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x, y, w: 2.95, h: 1.5,
      fill: { color: C.creamCard },
      line: { color: C.border, width: 1 },
      rectRadius: 0.1,
    })
    s.addText(r.n, {
      x: x + 0.2, y: y + 0.25, w: 2.55, h: 0.4,
      fontSize: 18, fontFace: FH, color: C.saffron, bold: true, margin: 0,
    })
    s.addText(r.d, {
      x: x + 0.2, y: y + 0.75, w: 2.55, h: 0.55,
      fontSize: 13, fontFace: FH, color: C.stone, margin: 0,
    })
  })
  addFooter(s, 12)
}

// 13. PILOT
{
  const s = pres.addSlide()
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 5.625, fill: { color: C.cream },
  })
  sectionBar(s, "बिना जोखिम")
  s.addText("७-दिन पायलट — एक मंदिर", {
    x: 0.5, y: 0.75, w: 9, h: 0.4,
    fontSize: 28, fontFace: FH, color: C.maroon, bold: true, margin: 0,
  })
  s.addText("आदत साबित करें, फिर Growth की बात करें।", {
    x: 0.5, y: 1.2, w: 9, h: 0.3,
    fontSize: 14, fontFace: FH, color: C.stone, italic: true, margin: 0,
  })

  const days = [
    "दिन १–२  ·  सिर्फ मनी डेस्क (नकद / काउंटर UPI)",
    "दिन ३  ·  ऑनलाइन दान (Razorpay लाइव होने पर)",
    "दिन ४  ·  गोत्र के साथ एक सेवा बुकिंग",
    "दिन ५  ·  साप्ताहिक रिपोर्ट WhatsApp / प्रिंट",
    "दिन ६  ·  पारदर्शिता URL एक न्यासी को",
    "दिन ७  ·  बोर्ड: Free रहें / Growth / रोकें",
  ]
  days.forEach((d, i) => {
    const y = 1.65 + i * 0.48
    s.addShape(pres.shapes.OVAL, {
      x: 0.55, y: y + 0.08, w: 0.28, h: 0.28,
      fill: { color: C.saffron },
    })
    s.addText(String(i + 1), {
      x: 0.55, y: y + 0.08, w: 0.28, h: 0.28,
      fontSize: 11, fontFace: FE, color: "FFFFFF", bold: true,
      align: "center", valign: "middle", margin: 0,
    })
    s.addText(d, {
      x: 1.05, y, w: 8.3, h: 0.4,
      fontSize: 14, fontFace: FH, color: C.ink, valign: "middle", margin: 0,
    })
  })
  addFooter(s, 13)
}

// 14. CLOSE
{
  const s = pres.addSlide()
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 5.625, fill: { color: C.maroon },
  })
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 0.18, h: 5.625, fill: { color: C.saffron },
  })
  s.addText("अगला कदम", {
    x: 0.7, y: 1.05, w: 8.5, h: 0.35,
    fontSize: 14, fontFace: FH, color: C.saffronSoft, bold: true, margin: 0,
  })
  s.addText("अपने क्लर्क को एक सप्ताह\nमनी डेस्क आज़माने दें।", {
    x: 0.7, y: 1.55, w: 8.5, h: 1.25,
    fontSize: 30, fontFace: FH, color: "FFFFFF", bold: true, margin: 0,
  })
  s.addText(
    "अगर वे रोज नहीं खोलते — भुगतान न करें।\nअगर खोलते हैं — आपका ट्रस्ट लेयर मिल गया।",
    {
      x: 0.7, y: 3.05, w: 8.5, h: 0.75,
      fontSize: 16, fontFace: FH, color: "FECACA", margin: 0,
    }
  )
  s.addText("jamsawli-ecosystem.vercel.app   ·   /demo   ·   /for-trustees", {
    x: 0.7, y: 4.15, w: 8.5, h: 0.35,
    fontSize: 14, fontFace: FE, color: "FFFFFF", margin: 0,
  })
  s.addText("जय श्री हनुमान  ·  MandirOS", {
    x: 0.7, y: 4.8, w: 8.5, h: 0.3,
    fontSize: 14, fontFace: FH, color: "FCA5A5", margin: 0,
  })
}

const out = path.join(__dirname, "MandirOS-Temple-Sales-Deck-HI.pptx")
pres.writeFile({ fileName: out }).then(() => {
  console.log("Wrote", out)
})
