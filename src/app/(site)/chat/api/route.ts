import getGptResponse from '@/services/openai/chat'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const body = await req.json()
  const messages = body?.messages
  console.log(messages)
  try {
    const reply = await getGptResponse(messages) // array
    console.log(reply)
    return NextResponse.json(reply)
  } catch (error: any) {
    console.log(error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
