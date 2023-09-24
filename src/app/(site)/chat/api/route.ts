import openAi from '@/services/openai'
import getGptResponse from '@/services/openai/chat'
import { NextApiRequest, NextApiResponse } from 'next'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const body = await req.json()
  const messages = body?.messages
  try {
    const chatresponse = await getGptResponse(messages)

    return NextResponse.json({ chatresponse })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
