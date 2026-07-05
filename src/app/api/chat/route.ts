import { NextResponse } from "next/server"
import { getOpenAI, HANUMAN_SYSTEM_PROMPT } from "@/lib/openai"

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()
    const openai = getOpenAI()

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: HANUMAN_SYSTEM_PROMPT },
        ...messages,
      ],
      max_tokens: 500,
      temperature: 0.7,
    })

    return NextResponse.json({
      message: completion.choices[0].message.content,
    })
  } catch (error) {
    console.error("Chat error:", error)
    return NextResponse.json(
      { error: "Chat service temporarily unavailable" },
      { status: 500 }
    )
  }
}
