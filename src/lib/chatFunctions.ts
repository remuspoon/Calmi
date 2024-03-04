import { updateChat } from '@/services/firebase/firestore'
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

export const postprocess = async (
  userId: string,
  chatId: string,
  latestUserMessage?: ChatCompletionMessageParam<'user'>,
  end = false,
  messages?: ChatCompletionMessageParam<'user' | 'assistant' | 'system'>[]
) => {
  if (end && messages) {
    let summary = await fetch('/chat/api/summary', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ messages })
    })

    summary = await summary.json()
    await updateChat(userId, chatId, {
      completed: true,
      summary: summary
    })
    return
  }
  if (!latestUserMessage) return

  const distortedThoughts =
    latestUserMessage.token === 'identifyDistortion' &&
    latestUserMessage.subtoken === 1

  const reframedThoughts =
    latestUserMessage.token === 'reframeExercise' && latestUserMessage.subtoken === 5

  if (distortedThoughts) {
    let gptRephrased = await fetch('/chat/api/reframedThought', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ content: latestUserMessage.content })
    })

    gptRephrased = await gptRephrased.json()

    await updateChat(userId, chatId, {
      distortedThoughts: gptRephrased // latestUserMessage.content
    })

    return
  }

  if (reframedThoughts) {
    let gptReframed = await fetch('/chat/api/reframedThought', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ content: latestUserMessage.content })
    })

    gptReframed = await gptReframed.json()

    await updateChat(userId, chatId, {
      reframedThoughts: gptReframed // latestUserMessage.content
    })

    return
  }
}
