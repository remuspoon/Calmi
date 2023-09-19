import { ChatCompletionMessageParam } from '@/components/Chat'

export const sendMessage = async (messages: ChatCompletionMessageParam[]) => {
  try {
    const response = await fetch('/chat/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ messages })
    })

    const reply = await response.json()

    return reply.response as ChatCompletionMessageParam
  } catch (error) {
    console.log(error)
  }
}
