import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { buildSystemPrompt } from '@/lib/system-prompt'
import { upsertSession } from '@/lib/supabase'
import { ConversationState, ChatMessage, AIResponse } from '@/types/conversation'

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GOOGLE_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'Missing GOOGLE_API_KEY environment variable' }, { status: 500 })
    }
    const genAI = new GoogleGenerativeAI(apiKey)
    const { messages, state }: { messages: ChatMessage[]; state: ConversationState } = await req.json()

    if (!messages || !state) {
      return NextResponse.json({ error: 'Missing messages or state' }, { status: 400 })
    }

    const systemPrompt = buildSystemPrompt(state)
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash', systemInstruction: systemPrompt })

    // Format messages for Gemini
    const contents = messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }))

    let result: any = null
    let retries = 3
    let delay = 1000
    while (retries > 0) {
      try {
        result = await model.generateContent({
          contents,
          generationConfig: {
            maxOutputTokens: 1000,
          }
        })
        break
      } catch (err: any) {
        retries--
        if (retries === 0) throw err
        console.warn(`Gemini API error, retrying in ${delay}ms... (${retries} retries left). Error:`, err.message || err)
        await new Promise(resolve => setTimeout(resolve, delay))
        delay *= 2
      }
    }

    if (!result || !result.response) {
      throw new Error('No response returned from Gemini API')
    }
    const rawText = result.response.text()

    let parsed: AIResponse
    try {
      // Find the first '{' and last '}' to handle potential text around JSON
      const firstBrace = rawText.indexOf('{')
      const lastBrace = rawText.lastIndexOf('}')
      if (firstBrace !== -1 && lastBrace !== -1) {
        const jsonStr = rawText.substring(firstBrace, lastBrace + 1)
        parsed = JSON.parse(jsonStr)
      } else {
        throw new Error('No JSON found')
      }
    } catch {
      parsed = { message: rawText, stateUpdate: {} }
    }

    // Merge stateUpdate onto current state and persist
    const updatedState: ConversationState = { ...state }
    const u = parsed.stateUpdate || {}
    Object.keys(u).forEach(k => {
      const key = k as keyof ConversationState
      const val = u[key]
      if (val !== undefined && val !== '') {
        ;(updatedState as unknown as Record<string, unknown>)[key] = val
      }
    })
    // always allow 0 for numeric fields
    if (u.intentConfidence !== undefined) updatedState.intentConfidence = u.intentConfidence as number
    if (u.diagnosisStage !== undefined) updatedState.diagnosisStage = u.diagnosisStage as number
    if (u.currentPhase !== undefined) updatedState.currentPhase = u.currentPhase as number

    const allMessages: ChatMessage[] = [
      ...messages,
      { role: 'assistant', content: parsed.message },
    ]

    await upsertSession({ session_id: state.sessionId, state: updatedState, messages: allMessages })

    return NextResponse.json({ message: parsed.message, state: updatedState })
  } catch (err: unknown) {
    console.error('[/api/chat]', err)
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
