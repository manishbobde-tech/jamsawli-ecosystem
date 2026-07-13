import { NextResponse } from "next/server"
import { getOpenAI, HANUMAN_SYSTEM_PROMPT, localTempleAnswer } from "@/lib/openai"
import { assertFeature, featureDeniedPayload } from "@/lib/entitlements"
import { getDefaultTempleSlug } from "@/lib/tenant"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const messages = body.messages as Array<{ role: string; content: string }>
    const templeSlug = body.templeSlug || getDefaultTempleSlug()

    const gate = await assertFeature(templeSlug, "ai_chatbot")
    if (!gate.ok) {
      // Soft degrade: still answer from local knowledge so Free/Growth get value
      const lastUser = [...(messages || [])]
        .reverse()
        .find((m) => m.role === "user")?.content
      if (lastUser) {
        return NextResponse.json({
          message:
            localTempleAnswer(lastUser) +
            `\n\n—\n💡 Full AI Hanuman Assistant unlocks on ${gate.requiredPlan === "TRUST_PRO" ? "Trust Pro" : gate.requiredPlan}. Upgrade: /dashboard/billing`,
          mode: "local",
          upgrade: featureDeniedPayload(
            gate.requiredPlan,
            gate.entitlements?.planId
          ),
        })
      }
      return NextResponse.json(
        {
          message: "AI chatbot requires Trust Pro plan.",
          ...featureDeniedPayload(gate.requiredPlan, gate.entitlements?.planId),
        },
        { status: 402 }
      )
    }

    const lastUser = [...(messages || [])]
      .reverse()
      .find((m) => m.role === "user")?.content

    const openai = getOpenAI()
    if (!openai) {
      return NextResponse.json({
        message: lastUser
          ? localTempleAnswer(lastUser)
          : "🙏 जय श्री हनुमान! Ask me about the temple, donations, or poojas.",
        mode: "local",
      })
    }

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        { role: "system", content: HANUMAN_SYSTEM_PROMPT },
        ...(messages || []).map((m) => ({
          role: m.role as "user" | "assistant" | "system",
          content: m.content,
        })),
      ],
      max_tokens: 500,
      temperature: 0.7,
    })

    return NextResponse.json({
      message: completion.choices[0]?.message?.content || localTempleAnswer(lastUser || ""),
      mode: "openai",
    })
  } catch (error) {
    console.error("Chat error:", error)
    return NextResponse.json(
      {
        message:
          "🙏 Service is briefly unavailable. Please use Donate, Book, or Transparency pages, or try again.",
        mode: "error",
      },
      { status: 200 }
    )
  }
}
