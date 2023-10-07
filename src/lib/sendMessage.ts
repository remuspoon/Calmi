import { ChatCompletionMessageParam } from '@/components/Chat'

export const getbotReply = async (messages: ChatCompletionMessageParam[]) => {
  messages = messages
    .filter((m) => m?.role)
    .map((m) => ({
      role: m.role,
      content: m.content
    }))
  try {
    const response = await fetch('/chat/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ messages })
    })

    let reply = await response.json()
    reply = reply.reply
    // return {
    //   role: 'assistant',
    //   content: reply.reply
    // } as ChatCompletionMessageParam

    reply = reply.map((re:any)=>({role: 'assistant',
      content: re}  as ChatCompletionMessageParam))

    console.log(reply)
    return reply
  } catch (error) {
    console.log(error)
  }
}
