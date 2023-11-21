import { summariseTheCause } from '@/services/openai/helper'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const body = await req?.json()
  const messages = body?.messages
  try {
    const summary = await summariseTheCause(messages) // array
    return NextResponse.json(summary)
  } catch (error: any) {
    console.log(error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
