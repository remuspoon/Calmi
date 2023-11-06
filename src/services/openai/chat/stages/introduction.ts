import { TERMINATING_MESSAGE } from '@/lib/constants'
import { ChatCompletionMessageParam, RESPONSE_TYPE } from '..'
import { chatCompletions } from '../..'
import { isSuicidal } from '../../helper'

const INTRODUCTION: RESPONSE_TYPE | RESPONSE_TYPE[] = {
  response: (messages) =>
    chatCompletions(
      messages,
      'Ask the user to clarify on either the situation that is troubling them or their feelings.'
    ),
  next: async (messages) => {
    const suicidal = await isSuicidal(
      (messages as Array<ChatCompletionMessageParam<'user'>>).findLast(
        (m) => m.role === 'user'
      )?.content || ''
    )
    if (suicidal) {
      const reply =
        "I'm really sorry to hear that but I am unable to provide the help that you need. Please seek professional help or reach out to someone you trust for support."

      return { token: 'END', with: [reply, TERMINATING_MESSAGE] }
    } else {
      return { token: 'rapport-building' }
    }
  }
}

export default INTRODUCTION
