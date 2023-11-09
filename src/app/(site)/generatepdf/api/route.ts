import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const body = await req.json()

  try {
    return NextResponse.json({ reply: '' })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
