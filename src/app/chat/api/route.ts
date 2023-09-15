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

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  // const { messages } = req?.body
  // console.log(messages)
  try {
    // const response = await openAi.completions.create({
    //   model: 'gpt-3.5-turbo',
    //   prompt: messages,
    //   max_tokens: 5
    // })

    return NextResponse.json({ response: 'hello' })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}
