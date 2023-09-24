import openAi from '@/services/openai'
import getGptResponse from '@/services/openai/chat'
import { NextApiRequest, NextApiResponse } from 'next'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const body = await req.json()
  const messages = body?.messages
  try {
    const reply = await getGptResponse(messages)

    return NextResponse.json({ reply })
  } catch (error: any) {
    console.log(error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
