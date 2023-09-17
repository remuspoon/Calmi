import { ChatCompletionMessageParam } from '@/app/(site)/chat/[chatID]/page'

export const sendMessage = async (messages: ChatCompletionMessageParam[]) => {
  console.log(messages)
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
