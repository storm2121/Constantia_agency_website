import { z } from 'zod'

const schema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  message: z.string().min(10).max(2000),
  honeypot: z.string().max(0).optional(), // bot trap
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const data = schema.parse(body)

    if (data.honeypot) {
      return Response.json({ success: true }) // silently reject bots
    }

    // Log to console for now (Firebase write can be added later)
    console.log('New contact submission:', {
      name: data.name,
      email: data.email,
      timestamp: new Date().toISOString(),
    })

    return Response.json({ success: true })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return Response.json({ error: 'Invalid form data' }, { status: 400 })
    }
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}
