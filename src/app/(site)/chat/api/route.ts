import openAi from '@/services/openai'
import getGptResponse from '@/services/openai/chat'
import { NextApiRequest, NextApiResponse } from 'next'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const body = await req.json()
  const messages = body?.messages
  try {
    // const chatresponse = await openAi.chat.completions.create({
    //   model: 'gpt-3.5-turbo',
    //   messages: messages,
    //   max_tokens: 150,
    //   temperature: 0.7
    // })

    // const reply = chatresponse.choices[0].message

    // return NextResponse.json({ reply })

    const reply = await getGptResponse(messages)

    console.log('reply', reply)
    return NextResponse.json({ reply })
  } catch (error: any) {
    console.log(error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
