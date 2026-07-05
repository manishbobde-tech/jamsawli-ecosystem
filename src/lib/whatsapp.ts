const WHATSAPP_API_URL = "https://graph.facebook.com/v17.0"
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID

export async function sendWhatsAppMessage(to: string, message: string) {
  try {
    const response = await fetch(
      `${WHATSAPP_API_URL}/${PHONE_NUMBER_ID}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${WHATSAPP_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to,
          type: "text",
          text: { body: message },
        }),
      }
    )

    return await response.json()
  } catch (error) {
    console.error("WhatsApp error:", error)
    throw error
  }
}

export async function sendDonationConfirmation(
  phone: string,
  amount: number,
  purpose: string
) {
  const message = `🙏 दान सफल!

आपका दान सफलतापूर्वक प्राप्त हो गया है।

राशि: ₹${amount}
उद्देश्य: ${purpose || "सामान्य दान"}

जामसावली हनुमान लोक की ओर से धन्यवाद।

🙏 जय श्री हनुमान!`

  return sendWhatsAppMessage(phone, message)
}

export async function sendBookingConfirmation(
  phone: string,
  poojaName: string,
  date: string,
  time: string
) {
  const message = `🙏 पूजा बुकिंग पुष्टि!

आपकी पूजा सफलतापूर्वक बुक हो गई है।

पूजा: ${poojaName}
तिथि: ${date}
समय: ${time}

कृपया निर्धारित समय पर मंदिर में उपस्थित हों।

🙏 जय श्री हनुमान!`

  return sendWhatsAppMessage(phone, message)
}
