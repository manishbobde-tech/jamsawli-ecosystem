import { NextResponse } from "next/server"
import { sendWhatsAppMessage } from "@/lib/whatsapp"

export async function GET(req: Request) {
  const url = new URL(req.url)
  const mode = url.searchParams.get("hub.mode")
  const token = url.searchParams.get("hub.verify_token")
  const challenge = url.searchParams.get("hub.challenge")

  if (mode === "subscribe" && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return new Response(challenge, { status: 200 })
  }

  return new Response("Forbidden", { status: 403 })
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    if (body.object === "whatsapp_business_account") {
      const entry = body.entry?.[0]
      const changes = entry?.changes?.[0]
      const messages = changes?.value?.messages

      if (messages?.[0]) {
        const message = messages[0]
        const from = message.from
        const text = message.text?.body?.toLowerCase()

        let response = ""

        if (text?.includes("hi") || text?.includes("नमस्ते")) {
          response = `🙏 नमस्ते!

जामसावली हनुमान लोक में आपका स्वागत है।

आप हमें निम्नलिखित सेवाओं के लिए संदेश भेज सकते हैं:

1. दान करने के लिए: "दान"
2. पूजा बुक करने के लिए: "बुकिंग"
3. मंदिर की जानकारी के लिए: "जानकारी"

आपकी क्या सहायता कर सकते हैं?`
        } else if (text?.includes("दान") || text?.includes("donate")) {
          response = `💰 दान करने के लिए:

कृपया नीचे दिए गए लिंक पर क्लिक करें:
${process.env.NEXT_PUBLIC_APP_URL}/donate

🙏 आपके दान के लिए धन्यवाद!`
        } else if (text?.includes("बुकिंग") || text?.includes("booking")) {
          response = `📅 पूजा बुक करने के लिए:

कृपया नीचे दिए गए लिंक पर क्लिक करें:
${process.env.NEXT_PUBLIC_APP_URL}/book

🙏 जय श्री हनुमान!`
        } else if (text?.includes("जानकारी") || text?.includes("info")) {
          response = `🏛️ जामसावली हनुमान मंदिर

पता: ग्राम सावली, छिंदवाड़ा, मध्य प्रदेश
फोन: +91 94221 82393
वेबसाइट: ${process.env.NEXT_PUBLIC_APP_URL}

⏰ दर्शन समय:
प्रातः काल: 5:00 AM - 12:00 PM
सायं काल: 4:00 PM - 8:00 PM

🙏 जय श्री हनुमान!`
        } else {
          response = `क्षमा करें, हम आपका संदेश समझ नहीं पाए।

कृपया निम्नलिखित विकल्पों में से चुनें:
1. "दान" - दान करने के लिए
2. "बुकिंग" - पूजा बुक करने के लिए
3. "जानकारी" - मंदिर की जानकारी के लिए`
        }

        await sendWhatsAppMessage(from, response)
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("WhatsApp webhook error:", error)
    return NextResponse.json(
      { message: "Webhook processing failed" },
      { status: 500 }
    )
  }
}
