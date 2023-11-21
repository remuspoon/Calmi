import { rephrase } from '@/services/openai/helper'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const body = await req.json()
  const content = body?.content
  try {
    const reply = await rephrase(content)
    return NextResponse.json(reply)
  } catch (error: any) {
    console.log(error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
