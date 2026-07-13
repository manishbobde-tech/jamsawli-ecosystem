import { getOpenAI, HANUMAN_SYSTEM_PROMPT, localTempleAnswer } from "@/lib/openai"
import { assertFeature } from "@/lib/entitlements"
import { getDefaultTempleSlug } from "@/lib/tenant"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const messages = body.messages as Array<{ role: string; content: string }>
    const templeSlug = body.templeSlug || getDefaultTempleSlug()
    const lastUser = [...(messages || [])]
      .reverse()
      .find((m) => m.role === "user")?.content

    const gate = await assertFeature(templeSlug, "ai_chatbot")
    const openai = getOpenAI()

    if (!gate.ok || !openai) {
      const text = lastUser
        ? localTempleAnswer(lastUser) +
          (!gate.ok
            ? "\n\n💡 Full streaming AI unlocks on Trust Pro — /dashboard/billing"
            : "")
        : "🙏 जय श्री हनुमान!"
      return new Response(text, {
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      })
    }

    const stream = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      stream: true,
      messages: [
        { role: "system", content: HANUMAN_SYSTEM_PROMPT },
        ...(messages || []).map((m) => ({
          role: m.role as "user" | "assistant" | "system",
          content: m.content,
        })),
      ],
      max_tokens: 500,
    })

    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content || ""
            if (text) controller.enqueue(encoder.encode(text))
          }
        } catch (e) {
          console.error(e)
        } finally {
          controller.close()
        }
      },
    })

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    })
  } catch (error) {
    console.error("Stream chat error:", error)
    return new Response("🙏 Service temporarily unavailable.", {
      status: 200,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    })
  }
}
