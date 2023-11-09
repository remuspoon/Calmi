import {
  ChatCompletionMessageParam,
  GPTResponseType,
  TOKENS
} from '@/services/openai/chat'

export const getbotReply = async (
  messages: ChatCompletionMessageParam<'user' | 'assistant' | 'system'>[]
) => {
  messages = messages.filter((m) => m?.role)

  try {
    const response = await fetch('/chat/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ messages })
    })

    const reply = (await response.json()) as GPTResponseType

    let res, token: Exclude<TOKENS, 'START'>, subtoken: number
    if (!Array.isArray(reply)) {
      res = reply.response
      token = reply.token
      subtoken = reply.subtoken
    } else {
      res = reply
    }

    return res.map(
      (r) =>
        ({
          role: 'assistant',
          content: r,
          token: token,
          subtoken: subtoken
        } as ChatCompletionMessageParam<'assistant'>)
    )
  } catch (error) {
    console.log(error)
  }
}
