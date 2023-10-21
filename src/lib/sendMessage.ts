import {
  ChatCompletionMessageParam,
  GPTResponseType,
  TOKENS
} from '@/services/openai/chat'

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

    const reply = (await response.json()) as GPTResponseType

    let res, currentToken: Exclude<TOKENS, 'START'>, currentSubToken: number
    if (!Array.isArray(reply)) {
      res = reply.response
      currentToken = reply.currentToken
      currentSubToken = reply.currentSubToken
    } else {
      res = reply
    }

    return res.map((r) => ({
      role: 'assistant' as 'system' | 'user' | 'assistant',
      content: r,
      currentToken: currentToken,
      currentSubToken: currentSubToken
    }))
  } catch (error) {
    console.log(error)
  }
}
