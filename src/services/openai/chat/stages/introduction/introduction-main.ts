import { TERMINATING_MESSAGE } from '@/lib/constants'
import { ChatCompletionMessageParam, RESPONSE_TYPE } from '../..'
import { chatCompletions } from '../../..'
import { isSuicidal, staticResponse, lastbotanduser, ventOrAdvice } from '../../../helper'

const INTRODUCTION: RESPONSE_TYPE | RESPONSE_TYPE[] = [
  {
    response: (messages) =>
      chatCompletions(
        messages,
        "in 2 sentence, respond and ask them to clarify what's going on"
      )
  },

  {
    response: async (messages) => {
      const gptResponse = (await chatCompletions(
        messages,
      "In 3 sentences, tell them you feel sorry for them. Finish by asking them whether they would just like to vent about it or if they want to try a therapy exercise?"
      )) as string

      const res = staticResponse([gptResponse])()
      return res
    },

    next: async (messages) => {
      const params = lastbotanduser(messages as any)
      const userWantsToVent = await ventOrAdvice(params)

      if (userWantsToVent) {
        return { token: 'venting'}
      } else {
        return { token: 'rapportBuilding'}
      }
    }
  },
]

export default INTRODUCTION
