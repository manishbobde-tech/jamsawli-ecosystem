import OpenAI from "openai"

let _openai: OpenAI | null = null

export function getOpenAI(): OpenAI | null {
  if (!process.env.OPENAI_API_KEY) return null
  if (!_openai) {
    _openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  }
  return _openai
}

export const HANUMAN_SYSTEM_PROMPT = `You are Hanuman AI Assistant, a friendly and knowledgeable guide for Chamatkarik Shree Hanuman Mandir, Jamsawli.

About the Temple:
- Located at the confluence of Jam and Sarpa rivers in Chhindwara, MP
- Famous for Swayambhu (self-manifested) reclining Hanuman idol
- The idol is under a vast Peepal tree
- Over 100 years old, mentioned in revenue records
- Legend: Lord Hanuman rested here while carrying Sanjeevani mountain
- Managed by 32-trustee board
- ₹362 crore development by MP Government

Services on MandirOS:
- Online donations (UPI/cards) with optional 80G receipt
- Pooja / seva booking
- Public fund transparency ledger
- Pilgrim SOS, lost & found, QR check-in
- Daily wisdom from Hanuman Chalisa

Timings (typical):
- Mangala Aarti (dawn)
- Sandhya Aarti (dusk)
- Special poojas on Tuesdays and Saturdays

Always respond in a warm, spiritual tone. Use Hindi greetings like "Jai Shri Hanuman" when appropriate. Be helpful and guide devotees. Respond in the same language as the user (Hindi or English). If asked about features not listed, direct them to Donate, Book, Transparency, or Pilgrim pages.`

/** Offline-friendly knowledge answers when OpenAI is unavailable */
export function localTempleAnswer(userMessage: string): string {
  const q = userMessage.toLowerCase()

  if (/donate|दान|donation|80g|receipt/.test(q)) {
    return "🙏 जय श्री हनुमान! You can donate securely at /donate — UPI, cards, and net banking. Tick 80G if you need a tax receipt (PAN required). After payment you get a printable receipt. Every rupee can be tracked on the Transparency page."
  }
  if (/book|पूजा|pooja|seva|aarti|आरती/.test(q)) {
    return "🙏 You can book poojas at /book — choose a seva, date, and time slot, then pay online. Mangala Aarti, Sandhya Aarti, Hanuman Chalisa Path, Sunderkand, and Special Pooja are typically available. Tuesday and Saturday are especially auspicious."
  }
  if (/where|location|address|कहाँ|address|chhindwara|sawli/.test(q)) {
    return "🙏 Chamatkarik Shri Hanuman Mandir is at Village Sawli (Jamsawli), Saunsar area, Chhindwara district, Madhya Pradesh — at the confluence of the Jam and Sarpa rivers. The Swayambhu reclining Hanuman rests under a great Peepal tree."
  }
  if (/history|legend|कहानी|swayambhu|sanjeevani/.test(q)) {
    return "🙏 Legend holds that Lord Hanuman rested here while carrying the Sanjeevani mountain. The reclining Swayambhu idol is over a century old in revenue records and is managed by a 32-trustee sansthan (Hanuman Lok). A major development project of ₹362 crore has been announced by the MP government."
  }
  if (/sos|emergency|lost|crowd|pilgrim|तीर्थ/.test(q)) {
    return "🙏 On-site help is on /pilgrim — Emergency SOS, Lost & Found, and crowd awareness. Use QR check-in at /checkin when you arrive for darshan tracking."
  }
  if (/transparency|fund|पैसे|where.*money|पारदर्शिता/.test(q)) {
    return "🙏 Open /transparency to see donation totals, categories, and project progress. Trust is the product — every devotee can verify fund flow."
  }
  if (/timing|time|खुला|darshan|दर्शन/.test(q)) {
    return "🙏 Typical rhythm: Mangala Aarti at dawn and Sandhya Aarti at dusk. Special observances on Tuesdays and Saturdays. For exact festival timings, contact the temple office or ask a trustee on site."
  }

  return "🙏 जय श्री हनुमान! I can help with temple history, donations, pooja booking, transparency, and pilgrim services. Try asking: “How do I donate with 80G?”, “Book a pooja”, or “Where is the temple?”. For the full app: Donate · Book · Transparency · Pilgrim."
}
