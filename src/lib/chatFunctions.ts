import { updateChat } from '@/services/firebase/firestore'
import {
  ChatCompletionMessageParam,
  GPTResponseType,
  TOKENS
} from '@/services/openai/chat'
import { summariseTheCause } from '@/services/openai/helper'

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
    const summary = await summariseTheCause(messages)
    await updateChat(userId, chatId, {
      completed: true,
      summary
    })
    return
  }
  if (!latestUserMessage) return

  const distortedThoughts =
    latestUserMessage.token === 'atDistortion' &&
    latestUserMessage.subtoken === 0

  const reframedThoughts =
    latestUserMessage.token === 'crExercise' && latestUserMessage.subtoken === 3

  if (distortedThoughts) {
    await updateChat(userId, chatId, {
      distortedThoughts: latestUserMessage.content
    })

    return
  }

  if (reframedThoughts) {
    await updateChat(userId, chatId, {
      reframedThoughts: latestUserMessage.content
    })

    return
  }
}
