import { openai } from '@ai-sdk/openai'
import { streamText } from 'ai'
import { z } from 'zod'
import { SYSTEM_PROMPT } from '@/lib/chatbot-system'

// In-memory rate limiting store
const rateLimitStore = new Map<string, { count: number; resetAt: number }>()

const messageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string(),
})

const bodySchema = z.object({
  messages: z
    .array(messageSchema)
    .min(1)
    .max(50)
    .refine((msgs) => msgs[msgs.length - 1].role === 'user', {
      message: 'Last message must be from user',
    }),
})

function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  const realIp = request.headers.get('x-real-ip')
  if (realIp) {
    return realIp.trim()
  }
  return 'unknown'
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitStore.get(ip)

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + 60 * 60 * 1000 })
    return true
  }

  if (entry.count >= 20) {
    return false
  }

  entry.count += 1
  return true
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request)

    if (!checkRateLimit(ip)) {
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      )
    }

    let body: unknown
    try {
      body = await request.json()
    } catch {
      return new Response(
        JSON.stringify({ error: 'Invalid JSON body.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const parsed = bodySchema.safeParse(body)
    if (!parsed.success) {
      return new Response(
        JSON.stringify({ error: 'Invalid request.', details: parsed.error.issues }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const { messages } = parsed.data

    const result = streamText({
      model: openai('gpt-4o-mini'),
      system: SYSTEM_PROMPT,
      messages,
    })

    return result.toTextStreamResponse()
  } catch (err) {
    console.error('[chat/route] Error:', err)
    return new Response(
      JSON.stringify({ error: 'Internal server error.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
