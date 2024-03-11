import { stringToPath } from 'sanity'
import { TERMINATING_MESSAGE } from '@/lib/constants'
import { RESPONSE_TYPE } from '../../..'
import { chatCompletions } from '../../../..'
import { lastbotanduser, staticResponse, userAffirmed, isNotQuestion } from '../../../../helper'


const VENTING_PATH_2: RESPONSE_TYPE | RESPONSE_TYPE[] = [
  {
    response: (messages) =>
      chatCompletions(
        messages,
        'In 2 sentences, respond and tell them you are here to support them emotionally. '
      )
  },

  {
    response: (messages) =>
      chatCompletions(
        messages,
        'In 4 sentences, respond and emotionally support the user. Say how you might feel in their situation and Acknowledge how difficult the situation is. Dont use the words "understand" and "sound"'
      )
  },

  {
    response: (messages) =>
      chatCompletions(
        messages,
        'In 3 sentences, respond in a way that is relevant, supports their emotions, and helpful. Do not offer any suggestions. Dont use the words "understand" and "sound"'
      )
  },

  {
    response: async (messages) => {
      const gptResponse = (await chatCompletions(
        messages,
      "In 4 sentences, respond in a concluding manner that is helpful, supports their emotions. Tell them that you're really proud of them and that they are strong. Do not offer any suggestions. Finish by asking them if they have anything else they want to ask."
      )) as string

      const res = staticResponse([gptResponse])()
      return res
    },

    next: async (messages) => {
      const params = lastbotanduser(messages as any)
      const userAffirm = await userAffirmed(params)
      const notQuestion = await isNotQuestion(params)

      if (!userAffirm && notQuestion) {
        return { token: 'ventingPath2', subtoken: 4}
      } else {
        return { token: 'ventingPath2', subtoken: 2}
      }
    }
  },

  {
    response: async (messages) => {
      const gptResponse = (await chatCompletions(
        messages,
        "In 5 sentences: Thank them for talking to you and trusting you. Remind them that they are strong and that they've got this. Tell them that if they feel like they need to talk again, you'll always be here to listen. Finsih by wishing them well."
      )) as string

      const res = staticResponse([
        gptResponse,
        TERMINATING_MESSAGE
      ])()
      return res
    },
    next: async (messages) => {
      return { token: 'END' }
    }
  },
]

export default VENTING_PATH_2
