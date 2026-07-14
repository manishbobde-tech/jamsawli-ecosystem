/**
 * MandirOS temple sales deck — for trustees / board meetings.
 * Run: node docs/sales/create-temple-sales-deck.js
 */
const pptxgen = require("pptxgenjs")
const path = require("path")

const pres = new pptxgen()
pres.layout = "LAYOUT_16x9"
pres.author = "MandirOS"
pres.title = "MandirOS — Digital Trust Layer for Temples"
pres.subject = "Temple sales presentation"

// Sacred palette (MandirOS brand)
const C = {
  maroon: "7F1D1D",
  maroonDeep: "5C1515",
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
  gold: "D97706",
}

function addFooter(slide, page, total = 14) {
  slide.addText("MandirOS  ·  Confidential for temple trustees", {
    x: 0.5,
    y: 5.28,
    w: 7,
    h: 0.25,
    fontSize: 10,
    fontFace: "Calibri",
    color: C.stoneLight,
    margin: 0,
  })
  slide.addText(`${page} / ${total}`, {
    x: 8.5,
    y: 5.28,
    w: 1,
    h: 0.25,
    fontSize: 10,
    fontFace: "Calibri",
    color: C.stoneLight,
    align: "right",
    margin: 0,
  })
}

function sectionBar(slide, label) {
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.5,
    y: 0.28,
    w: 2.4,
    h: 0.32,
    fill: { color: C.cream },
    line: { color: C.saffron, width: 1 },
    rectRadius: 0.08,
  })
  slide.addText(label, {
    x: 0.5,
    y: 0.28,
    w: 2.4,
    h: 0.32,
    fontSize: 11,
    fontFace: "Calibri",
    color: C.saffron,
    bold: true,
    align: "center",
    valign: "middle",
    margin: 0,
  })
}

// ═══════════════════════════════════════════════════
// 1. TITLE
// ═══════════════════════════════════════════════════
{
  const s = pres.addSlide()
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 5.625,
    fill: { color: C.maroon },
  })
  // saffron accent band
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 0.18, h: 5.625,
    fill: { color: C.saffron },
  })
  s.addText("MANDIROS", {
    x: 0.7, y: 1.3, w: 8.5, h: 0.4,
    fontSize: 14, fontFace: "Calibri", color: C.saffronSoft,
    bold: true, charSpacing: 4, margin: 0,
  })
  s.addText("The digital trust layer\nfor your temple", {
    x: 0.7, y: 1.85, w: 8.5, h: 1.5,
    fontSize: 40, fontFace: "Georgia", color: "FFFFFF",
    bold: true, margin: 0,
  })
  s.addText(
    "One place for counter cash, online donations, seva bookings,\nand a Monday answer to: kitna aaya?",
    {
      x: 0.7, y: 3.55, w: 8, h: 0.7,
      fontSize: 16, fontFace: "Calibri", color: "FECACA", margin: 0,
    }
  )
  s.addText("For temple trustees  ·  Board presentation  ·  2026", {
    x: 0.7, y: 4.8, w: 8, h: 0.3,
    fontSize: 12, fontFace: "Calibri", color: "FCA5A5", margin: 0,
  })
}

// ═══════════════════════════════════════════════════
// 2. THE REAL QUESTION
// ═══════════════════════════════════════════════════
{
  const s = pres.addSlide()
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 5.625, fill: { color: C.cream },
  })
  sectionBar(s, "THE REALITY")
  s.addText("What your board actually asks", {
    x: 0.5, y: 0.75, w: 9, h: 0.55,
    fontSize: 32, fontFace: "Georgia", color: C.maroon, bold: true, margin: 0,
  })

  const pains = [
    { q: "Kitna aaya?", a: "Cash + UPI + online in different places. Excel wars every Monday." },
    { q: "Paise kahan gaye?", a: "Devotees ask. Transparency is screenshots — not a public ledger." },
    { q: "Festival chaos?", a: "Double-booked sevas, no gotra/sankalp, long queues, angry families." },
    { q: "80G / CA ready?", a: "PAN on WhatsApp. Receipts inconsistent. Form 10BD is a scramble." },
  ]
  pains.forEach((p, i) => {
    const y = 1.5 + i * 0.85
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 0.5, y, w: 9, h: 0.75,
      fill: { color: C.creamCard },
      line: { color: C.border, width: 1 },
      rectRadius: 0.1,
      shadow: { type: "outer", color: "000000", blur: 4, opacity: 0.06, offset: 1 },
    })
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 0.65, y: y + 0.15, w: 0.12, h: 0.45,
      fill: { color: C.saffron }, rectRadius: 0.04,
    })
    s.addText(p.q, {
      x: 1.0, y: y + 0.1, w: 8.2, h: 0.3,
      fontSize: 16, fontFace: "Georgia", color: C.maroon, bold: true, margin: 0,
    })
    s.addText(p.a, {
      x: 1.0, y: y + 0.4, w: 8.2, h: 0.28,
      fontSize: 13, fontFace: "Calibri", color: C.stone, margin: 0,
    })
  })
  addFooter(s, 2)
}

// ═══════════════════════════════════════════════════
// 3. WHAT YOU WON'T BUY
// ═══════════════════════════════════════════════════
{
  const s = pres.addSlide()
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 5.625, fill: { color: C.cream },
  })
  sectionBar(s, "HONEST POSITIONING")
  s.addText("We do not sell “AI temples”", {
    x: 0.5, y: 0.75, w: 9, h: 0.5,
    fontSize: 30, fontFace: "Georgia", color: C.maroon, bold: true, margin: 0,
  })
  s.addText(
    "Boards write cheques for calm — not for feature lists.",
    {
      x: 0.5, y: 1.3, w: 9, h: 0.35,
      fontSize: 16, fontFace: "Calibri", color: C.stone, italic: true, margin: 0,
    }
  )

  // Two columns
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.5, y: 1.9, w: 4.35, h: 2.9,
    fill: { color: "FEF2F2" }, line: { color: "FECACA", width: 1 }, rectRadius: 0.12,
  })
  s.addText("NOT the hero product", {
    x: 0.75, y: 2.1, w: 3.9, h: 0.35,
    fontSize: 14, fontFace: "Calibri", color: "B91C1C", bold: true, margin: 0,
  })
  s.addText(
    [
      { text: "Chatbot personality as the pitch", options: { bullet: true, breakLine: true } },
      { text: "Devotion leaderboards / gamified bhakti", options: { bullet: true, breakLine: true } },
      { text: "14 half-built modules", options: { bullet: true, breakLine: true } },
      { text: "“India’s first AI mandir” claims", options: { bullet: true, breakLine: true } },
      { text: "SaaS jargon (MRR, NRR) for trustees", options: { bullet: true } },
    ],
    { x: 0.75, y: 2.55, w: 3.9, h: 2.0, fontSize: 13, fontFace: "Calibri", color: C.ink, margin: 0 }
  )

  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 5.15, y: 1.9, w: 4.35, h: 2.9,
    fill: { color: C.greenBg }, line: { color: "BBF7D0", width: 1 }, rectRadius: 0.12,
  })
  s.addText("What you will pay for", {
    x: 5.4, y: 2.1, w: 3.9, h: 0.35,
    fontSize: 14, fontFace: "Calibri", color: C.green, bold: true, margin: 0,
  })
  s.addText(
    [
      { text: "Daily “kitna aaya” without Excel", options: { bullet: true, breakLine: true } },
      { text: "Counter receipt in ~10 seconds", options: { bullet: true, breakLine: true } },
      { text: "Festival slots that don’t double-book", options: { bullet: true, breakLine: true } },
      { text: "Public fund transparency devotees trust", options: { bullet: true, breakLine: true } },
      { text: "80G trail your CA can work with", options: { bullet: true } },
    ],
    { x: 5.4, y: 2.55, w: 3.9, h: 2.0, fontSize: 13, fontFace: "Calibri", color: C.ink, margin: 0 }
  )
  addFooter(s, 3)
}

// ═══════════════════════════════════════════════════
// 4. SOLUTION
// ═══════════════════════════════════════════════════
{
  const s = pres.addSlide()
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 5.625, fill: { color: C.cream },
  })
  sectionBar(s, "THE PRODUCT")
  s.addText("MandirOS in one line", {
    x: 0.5, y: 0.75, w: 9, h: 0.45,
    fontSize: 30, fontFace: "Georgia", color: C.maroon, bold: true, margin: 0,
  })
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.5, y: 1.4, w: 9, h: 1.15,
    fill: { color: C.maroon }, rectRadius: 0.12,
  })
  s.addText(
    "Your temple’s digital trust layer — every rupee visible,\nevery seva booked with sankalp, every Monday total ready.",
    {
      x: 0.8, y: 1.55, w: 8.4, h: 0.85,
      fontSize: 18, fontFace: "Georgia", color: "FFFFFF", align: "center", valign: "middle", margin: 0,
    }
  )

  const pillars = [
    { t: "Money", d: "Counter desk + online + weekly board report" },
    { t: "Seva", d: "Gotra, sankalp, slots, certificates" },
    { t: "Trust", d: "Public ledger + 80G-ready receipts" },
    { t: "Ops", d: "QR posters, festivals, pilgrim safety" },
  ]
  pillars.forEach((p, i) => {
    const x = 0.5 + i * 2.35
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x, y: 2.9, w: 2.2, h: 1.85,
      fill: { color: C.creamCard },
      line: { color: C.border, width: 1 },
      rectRadius: 0.12,
    })
    s.addShape(pres.shapes.OVAL, {
      x: x + 0.8, y: 3.1, w: 0.55, h: 0.55,
      fill: { color: C.saffron },
    })
    s.addText(String(i + 1), {
      x: x + 0.8, y: 3.1, w: 0.55, h: 0.55,
      fontSize: 16, fontFace: "Georgia", color: "FFFFFF", bold: true,
      align: "center", valign: "middle", margin: 0,
    })
    s.addText(p.t, {
      x: x + 0.1, y: 3.8, w: 2.0, h: 0.35,
      fontSize: 16, fontFace: "Georgia", color: C.maroon, bold: true, align: "center", margin: 0,
    })
    s.addText(p.d, {
      x: x + 0.12, y: 4.2, w: 1.96, h: 0.45,
      fontSize: 11, fontFace: "Calibri", color: C.stone, align: "center", margin: 0,
    })
  })
  addFooter(s, 4)
}

// ═══════════════════════════════════════════════════
// 5. MONEY DESK HERO
// ═══════════════════════════════════════════════════
{
  const s = pres.addSlide()
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 5.625, fill: { color: C.cream },
  })
  sectionBar(s, "CORE HABIT")
  s.addText("Counter Money Desk", {
    x: 0.5, y: 0.75, w: 6, h: 0.5,
    fontSize: 32, fontFace: "Georgia", color: C.maroon, bold: true, margin: 0,
  })
  s.addText("The reason a clerk opens MandirOS every day", {
    x: 0.5, y: 1.25, w: 6, h: 0.35,
    fontSize: 15, fontFace: "Calibri", color: C.stone, italic: true, margin: 0,
  })

  // Big stat
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 6.6, y: 0.7, w: 2.9, h: 1.5,
    fill: { color: C.saffron }, rectRadius: 0.12,
  })
  s.addText("~10 sec", {
    x: 6.6, y: 0.9, w: 2.9, h: 0.7,
    fontSize: 36, fontFace: "Georgia", color: "FFFFFF", bold: true, align: "center", margin: 0,
  })
  s.addText("cash → print receipt", {
    x: 6.7, y: 1.65, w: 2.7, h: 0.35,
    fontSize: 12, fontFace: "Calibri", color: "FFEDD5", align: "center", margin: 0,
  })

  const steps = [
    { n: "1", t: "Amount + mode", d: "Cash, counter UPI, or card" },
    { n: "2", t: "Optional 80G", d: "Name + PAN when needed" },
    { n: "3", t: "Record", d: "Creates real donation receipt" },
    { n: "4", t: "Print / share", d: "Devotee walks away happy" },
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
      fontSize: 28, fontFace: "Georgia", color: C.saffron, bold: true, align: "center", margin: 0,
    })
    s.addText(st.t, {
      x: x + 0.1, y: 3.2, w: 2.0, h: 0.4,
      fontSize: 15, fontFace: "Calibri", color: C.maroon, bold: true, align: "center", margin: 0,
    })
    s.addText(st.d, {
      x: x + 0.12, y: 3.7, w: 1.96, h: 0.6,
      fontSize: 12, fontFace: "Calibri", color: C.stone, align: "center", margin: 0,
    })
  })
  addFooter(s, 5)
}

// ═══════════════════════════════════════════════════
// 6. WEEKLY REPORT
// ═══════════════════════════════════════════════════
{
  const s = pres.addSlide()
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 5.625, fill: { color: C.cream },
  })
  sectionBar(s, "BOARD MEETING")
  s.addText("Weekly trustee report", {
    x: 0.5, y: 0.75, w: 9, h: 0.5,
    fontSize: 32, fontFace: "Georgia", color: C.maroon, bold: true, margin: 0,
  })
  s.addText("Monday message without Excel", {
    x: 0.5, y: 1.25, w: 9, h: 0.3,
    fontSize: 15, fontFace: "Calibri", color: C.stone, italic: true, margin: 0,
  })

  // Mock report card
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.5, y: 1.75, w: 5.5, h: 3.0,
    fill: { color: C.creamCard },
    line: { color: C.border, width: 1 },
    rectRadius: 0.12,
  })
  s.addText("THIS WEEK — sample", {
    x: 0.75, y: 1.95, w: 5, h: 0.3,
    fontSize: 11, fontFace: "Calibri", color: C.stoneLight, bold: true, margin: 0,
  })
  s.addText("Online  ·  Counter  ·  Poojas  ·  Total", {
    x: 0.75, y: 2.35, w: 5, h: 0.3,
    fontSize: 13, fontFace: "Calibri", color: C.stone, margin: 0,
  })
  s.addText("₹1,24,500", {
    x: 0.75, y: 2.75, w: 5, h: 0.7,
    fontSize: 40, fontFace: "Georgia", color: C.maroon, bold: true, margin: 0,
  })
  s.addText(
    "Hindi + English one-liner · WhatsApp share · Print · Email / Slack auto-send",
    {
      x: 0.75, y: 3.6, w: 5, h: 0.7,
      fontSize: 13, fontFace: "Calibri", color: C.stone, margin: 0,
    }
  )

  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 6.3, y: 1.75, w: 3.2, h: 3.0,
    fill: { color: C.maroon }, rectRadius: 0.12,
  })
  s.addText("Why boards care", {
    x: 6.5, y: 2.0, w: 2.8, h: 0.4,
    fontSize: 14, fontFace: "Calibri", color: C.saffronSoft, bold: true, margin: 0,
  })
  s.addText(
    [
      { text: "No more “send Excel”", options: { bullet: true, breakLine: true } },
      { text: "Online + hundi together", options: { bullet: true, breakLine: true } },
      { text: "Ready before meeting", options: { bullet: true, breakLine: true } },
      { text: "Same story every week", options: { bullet: true } },
    ],
    {
      x: 6.5, y: 2.55, w: 2.8, h: 1.9,
      fontSize: 14, fontFace: "Calibri", color: "FFFFFF", margin: 0,
    }
  )
  addFooter(s, 6)
}

// ═══════════════════════════════════════════════════
// 7. TRANSPARENCY + 80G
// ═══════════════════════════════════════════════════
{
  const s = pres.addSlide()
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 5.625, fill: { color: C.cream },
  })
  sectionBar(s, "TRUST LAYER")
  s.addText("Transparency devotees can open", {
    x: 0.5, y: 0.75, w: 9, h: 0.5,
    fontSize: 28, fontFace: "Georgia", color: C.maroon, bold: true, margin: 0,
  })

  const cards = [
    { t: "Public fund ledger", d: "Totals by purpose — construction, bhandara, general. Share a URL, not a PDF chain." },
    { t: "Donation campaigns", d: "Progress bars for drives. Social proof for big asks." },
    { t: "80G-ready receipts", d: "Name, PAN, receipt number. CA-friendly trail — not tax advice." },
    { t: "Form 10BD export", d: "Trust Pro: CSV for FY workflows. Your CA validates registration." },
  ]
  cards.forEach((c, i) => {
    const col = i % 2
    const row = Math.floor(i / 2)
    const x = 0.5 + col * 4.7
    const y = 1.5 + row * 1.55
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x, y, w: 4.45, h: 1.4,
      fill: { color: C.creamCard },
      line: { color: C.border, width: 1 },
      rectRadius: 0.1,
    })
    s.addText(c.t, {
      x: x + 0.25, y: y + 0.2, w: 4.0, h: 0.35,
      fontSize: 16, fontFace: "Georgia", color: C.maroon, bold: true, margin: 0,
    })
    s.addText(c.d, {
      x: x + 0.25, y: y + 0.6, w: 4.0, h: 0.65,
      fontSize: 13, fontFace: "Calibri", color: C.stone, margin: 0,
    })
  })
  addFooter(s, 7)
}

// ═══════════════════════════════════════════════════
// 8. SEVA + FESTIVAL
// ═══════════════════════════════════════════════════
{
  const s = pres.addSlide()
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 5.625, fill: { color: C.cream },
  })
  sectionBar(s, "FESTIVAL READY")
  s.addText("Seva booking that priests can use", {
    x: 0.5, y: 0.75, w: 9, h: 0.5,
    fontSize: 28, fontFace: "Georgia", color: C.maroon, bold: true, margin: 0,
  })

  const items = [
    { t: "Gotra + sankalp", d: "Not just payment — temple-grade devotee data" },
    { t: "Slot capacity", d: "Growth+: hard limits so you don’t overbook" },
    { t: "Festival board", d: "See which slots fill first; plan pujaris" },
    { t: "Certificate", d: "Printable / shareable after confirm" },
    { t: "QR posters", d: "Gate → donate / book / check-in, zero design cost" },
    { t: "Pilgrim safety", d: "SOS, lost & found on busy days (Growth+)" },
  ]
  items.forEach((it, i) => {
    const col = i % 3
    const row = Math.floor(i / 3)
    const x = 0.5 + col * 3.1
    const y = 1.5 + row * 1.65
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
      fontSize: 14, fontFace: "Georgia", color: C.saffron, bold: true,
      align: "center", valign: "middle", margin: 0,
    })
    s.addText(it.t, {
      x: x + 0.85, y: y + 0.3, w: 1.9, h: 0.4,
      fontSize: 14, fontFace: "Calibri", color: C.maroon, bold: true, margin: 0,
    })
    s.addText(it.d, {
      x: x + 0.2, y: y + 0.85, w: 2.55, h: 0.45,
      fontSize: 12, fontFace: "Calibri", color: C.stone, margin: 0,
    })
  })
  addFooter(s, 8)
}

// ═══════════════════════════════════════════════════
// 9. A DAY IN THE LIFE
// ═══════════════════════════════════════════════════
{
  const s = pres.addSlide()
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 5.625, fill: { color: C.cream },
  })
  sectionBar(s, "OPERATIONS")
  s.addText("One day on MandirOS", {
    x: 0.5, y: 0.75, w: 9, h: 0.45,
    fontSize: 30, fontFace: "Georgia", color: C.maroon, bold: true, margin: 0,
  })

  const day = [
    { t: "06:30", title: "Clerk", d: "Money desk open — first hundi / counter entry" },
    { t: "09:00", title: "Devotee", d: "QR poster → book seva with gotra & sankalp" },
    { t: "12:00", title: "Online", d: "UPI donation + optional 80G receipt" },
    { t: "18:00", title: "Clerk", d: "Evening cash log — total for the day" },
    { t: "Mon", title: "Trustee", d: "Weekly report → WhatsApp to board" },
  ]
  day.forEach((d, i) => {
    const y = 1.4 + i * 0.7
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 0.5, y, w: 1.3, h: 0.55,
      fill: { color: i === 4 ? C.maroon : C.saffron }, rectRadius: 0.08,
    })
    s.addText(d.t, {
      x: 0.5, y, w: 1.3, h: 0.55,
      fontSize: 13, fontFace: "Calibri", color: "FFFFFF", bold: true,
      align: "center", valign: "middle", margin: 0,
    })
    s.addText(d.title, {
      x: 2.0, y, w: 1.5, h: 0.55,
      fontSize: 14, fontFace: "Calibri", color: C.maroon, bold: true, valign: "middle", margin: 0,
    })
    s.addText(d.d, {
      x: 3.5, y, w: 5.8, h: 0.55,
      fontSize: 14, fontFace: "Calibri", color: C.stone, valign: "middle", margin: 0,
    })
  })
  addFooter(s, 9)
}

// ═══════════════════════════════════════════════════
// 10. LIVE PROOF
// ═══════════════════════════════════════════════════
{
  const s = pres.addSlide()
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 5.625, fill: { color: C.cream },
  })
  sectionBar(s, "SEE IT LIVE")
  s.addText("Don’t take our word — open it", {
    x: 0.5, y: 0.75, w: 9, h: 0.5,
    fontSize: 28, fontFace: "Georgia", color: C.maroon, bold: true, margin: 0,
  })

  const links = [
    { t: "Platform", u: "jamsawli-ecosystem.vercel.app", d: "MandirOS home · pricing · features" },
    { t: "Anchor temple", u: "/t/jamsawli-hanuman", d: "Live tenant: donate · book · transparency" },
    { t: "Free vs Pro", u: "/demo", d: "Feel the upgrade — same screens, different power" },
    { t: "7-day pilot", u: "/dashboard/pilot", d: "Clerk checklist — real habit, not a brochure" },
  ]
  links.forEach((l, i) => {
    const y = 1.45 + i * 0.85
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 0.5, y, w: 9, h: 0.75,
      fill: { color: C.creamCard },
      line: { color: C.border, width: 1 },
      rectRadius: 0.1,
    })
    s.addText(l.t, {
      x: 0.75, y: y + 0.1, w: 2.2, h: 0.55,
      fontSize: 15, fontFace: "Calibri", color: C.saffron, bold: true, valign: "middle", margin: 0,
    })
    s.addText(l.u, {
      x: 3.0, y: y + 0.08, w: 6.2, h: 0.3,
      fontSize: 13, fontFace: "Consolas", color: C.maroon, margin: 0,
    })
    s.addText(l.d, {
      x: 3.0, y: y + 0.38, w: 6.2, h: 0.28,
      fontSize: 12, fontFace: "Calibri", color: C.stone, margin: 0,
    })
  })
  addFooter(s, 10)
}

// ═══════════════════════════════════════════════════
// 11. PRICING
// ═══════════════════════════════════════════════════
{
  const s = pres.addSlide()
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 5.625, fill: { color: C.cream },
  })
  sectionBar(s, "SIMPLE PRICING")
  s.addText("Start free. Pay when you need ops & compliance.", {
    x: 0.5, y: 0.7, w: 9, h: 0.4,
    fontSize: 24, fontFace: "Georgia", color: C.maroon, bold: true, margin: 0,
  })

  const plans = [
    {
      name: "Free",
      price: "₹0",
      fee: "2.5% txn",
      tag: "Habit",
      items: ["Online donate", "Money desk", "Weekly report", "80G receipts", "QR posters"],
      hi: false,
    },
    {
      name: "Growth",
      price: "₹2,499",
      fee: "2.0% txn",
      tag: "Most popular",
      items: ["Everything in Free", "Festival capacity", "Campaigns", "Pilgrim safety", "Widgets / embed"],
      hi: true,
    },
    {
      name: "Trust Pro",
      price: "₹7,999",
      fee: "1.0% txn",
      tag: "CA / audit",
      items: ["Everything in Growth", "Form 10BD export", "Full trust ledger", "Developer API", "Priority support"],
      hi: false,
    },
  ]
  plans.forEach((p, i) => {
    const x = 0.45 + i * 3.15
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x, y: 1.3, w: 3.0, h: 3.55,
      fill: { color: p.hi ? C.maroon : C.creamCard },
      line: { color: p.hi ? C.maroon : C.border, width: 1 },
      rectRadius: 0.12,
    })
    s.addText(p.tag, {
      x, y: 1.45, w: 3.0, h: 0.28,
      fontSize: 11, fontFace: "Calibri",
      color: p.hi ? C.saffronSoft : C.saffron,
      bold: true, align: "center", margin: 0,
    })
    s.addText(p.name, {
      x, y: 1.75, w: 3.0, h: 0.35,
      fontSize: 20, fontFace: "Georgia",
      color: p.hi ? "FFFFFF" : C.maroon,
      bold: true, align: "center", margin: 0,
    })
    s.addText(p.price, {
      x, y: 2.15, w: 3.0, h: 0.45,
      fontSize: 28, fontFace: "Georgia",
      color: p.hi ? "FFFFFF" : C.saffron,
      bold: true, align: "center", margin: 0,
    })
    s.addText(p.fee + " · /month", {
      x, y: 2.6, w: 3.0, h: 0.25,
      fontSize: 11, fontFace: "Calibri",
      color: p.hi ? "FECACA" : C.stoneLight,
      align: "center", margin: 0,
    })
    s.addText(
      p.items.map((it, idx) => ({
        text: it,
        options: { bullet: true, breakLine: idx < p.items.length - 1 },
      })),
      {
        x: x + 0.25, y: 3.05, w: 2.5, h: 1.55,
        fontSize: 12, fontFace: "Calibri",
        color: p.hi ? "FFFFFF" : C.ink,
        margin: 0,
      }
    )
  })
  addFooter(s, 11)
}

// ═══════════════════════════════════════════════════
// 12. ROI
// ═══════════════════════════════════════════════════
{
  const s = pres.addSlide()
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 5.625, fill: { color: C.cream },
  })
  sectionBar(s, "WHY PAY")
  s.addText("What ₹2,499 / month buys a board", {
    x: 0.5, y: 0.75, w: 9, h: 0.45,
    fontSize: 28, fontFace: "Georgia", color: C.maroon, bold: true, margin: 0,
  })

  const rois = [
    { n: "Hours", d: "Less Excel + WhatsApp chasing every week" },
    { n: "Calm", d: "Monday total ready before the meeting starts" },
    { n: "Trust", d: "Public page when devotees ask hard questions" },
    { n: "Festivals", d: "Capacity control when crowds peak" },
    { n: "Clerk habit", d: "Software that opens every day — not once a year" },
    { n: "Upgrade path", d: "Start Free; pay only when ops need more" },
  ]
  rois.forEach((r, i) => {
    const col = i % 3
    const row = Math.floor(i / 3)
    const x = 0.5 + col * 3.1
    const y = 1.45 + row * 1.7
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x, y, w: 2.95, h: 1.5,
      fill: { color: C.creamCard },
      line: { color: C.border, width: 1 },
      rectRadius: 0.1,
    })
    s.addText(r.n, {
      x: x + 0.2, y: y + 0.25, w: 2.55, h: 0.4,
      fontSize: 18, fontFace: "Georgia", color: C.saffron, bold: true, margin: 0,
    })
    s.addText(r.d, {
      x: x + 0.2, y: y + 0.75, w: 2.55, h: 0.55,
      fontSize: 13, fontFace: "Calibri", color: C.stone, margin: 0,
    })
  })
  addFooter(s, 12)
}

// ═══════════════════════════════════════════════════
// 13. 7-DAY PILOT
// ═══════════════════════════════════════════════════
{
  const s = pres.addSlide()
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 5.625, fill: { color: C.cream },
  })
  sectionBar(s, "NO RISK START")
  s.addText("7-day pilot — one temple", {
    x: 0.5, y: 0.75, w: 9, h: 0.45,
    fontSize: 30, fontFace: "Georgia", color: C.maroon, bold: true, margin: 0,
  })
  s.addText("Prove the habit before you discuss Growth.", {
    x: 0.5, y: 1.25, w: 9, h: 0.3,
    fontSize: 15, fontFace: "Calibri", color: C.stone, italic: true, margin: 0,
  })

  const days = [
    "Day 1–2  ·  Money desk only (cash / counter UPI)",
    "Day 3  ·  Online donate path (when Razorpay live)",
    "Day 4  ·  One seva booking with gotra",
    "Day 5  ·  Weekly report to WhatsApp / print",
    "Day 6  ·  Transparency URL to a trustee",
    "Day 7  ·  Board: Free stay / Growth / pause",
  ]
  days.forEach((d, i) => {
    const y = 1.7 + i * 0.48
    s.addShape(pres.shapes.OVAL, {
      x: 0.55, y: y + 0.08, w: 0.28, h: 0.28,
      fill: { color: C.saffron },
    })
    s.addText(String(i + 1), {
      x: 0.55, y: y + 0.08, w: 0.28, h: 0.28,
      fontSize: 11, fontFace: "Calibri", color: "FFFFFF", bold: true,
      align: "center", valign: "middle", margin: 0,
    })
    s.addText(d, {
      x: 1.05, y, w: 8.3, h: 0.4,
      fontSize: 15, fontFace: "Calibri", color: C.ink, valign: "middle", margin: 0,
    })
  })
  addFooter(s, 13)
}

// ═══════════════════════════════════════════════════
// 14. CLOSE
// ═══════════════════════════════════════════════════
{
  const s = pres.addSlide()
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 5.625,
    fill: { color: C.maroon },
  })
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 0.18, h: 5.625,
    fill: { color: C.saffron },
  })
  s.addText("NEXT STEP", {
    x: 0.7, y: 1.1, w: 8.5, h: 0.35,
    fontSize: 13, fontFace: "Calibri", color: C.saffronSoft, bold: true, charSpacing: 3, margin: 0,
  })
  s.addText("Let your clerk try money desk\nfor one week.", {
    x: 0.7, y: 1.6, w: 8.5, h: 1.3,
    fontSize: 34, fontFace: "Georgia", color: "FFFFFF", bold: true, margin: 0,
  })
  s.addText(
    "If they don’t open it daily — don’t pay.\nIf they do — you’ve found your trust layer.",
    {
      x: 0.7, y: 3.15, w: 8.5, h: 0.7,
      fontSize: 16, fontFace: "Calibri", color: "FECACA", margin: 0,
    }
  )
  s.addText("jamsawli-ecosystem.vercel.app   ·   /demo   ·   /for-trustees", {
    x: 0.7, y: 4.2, w: 8.5, h: 0.35,
    fontSize: 14, fontFace: "Calibri", color: "FFFFFF", margin: 0,
  })
  s.addText("जय श्री हनुमान  ·  MandirOS", {
    x: 0.7, y: 4.85, w: 8.5, h: 0.3,
    fontSize: 13, fontFace: "Calibri", color: "FCA5A5", margin: 0,
  })
}

const out = path.join(__dirname, "MandirOS-Temple-Sales-Deck.pptx")
pres.writeFile({ fileName: out }).then(() => {
  console.log("Wrote", out)
})
