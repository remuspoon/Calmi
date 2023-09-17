import openAi from '@/services/openai'
import { NextApiRequest, NextApiResponse } from 'next'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const body = await req.json()
  const messages = body?.messages
  console.log(messages)
  try {
    const chatresponse = await openAi.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages
    })

    const response = chatresponse.choices[0].message
    console.log('r', response)

    return NextResponse.json({ response })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
