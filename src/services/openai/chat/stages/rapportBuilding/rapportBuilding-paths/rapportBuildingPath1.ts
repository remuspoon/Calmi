import { RESPONSE_TYPE } from '../../..'
import { chatCompletions } from '../../../..'
import { lastbotanduser, staticResponse, userAffirmed } from '../../../../helper'


const RAPPORT_BUILDING_PATH_1: RESPONSE_TYPE | RESPONSE_TYPE[] = [

    {
    response: (messages) =>
      chatCompletions(
        messages,
        "tell them you understand and then write a question that asks them to clarify their situation. Do not repeat questions asked before."
      )
  },
  
  {
    response: (messages) =>
      chatCompletions(
        messages,
        "Remind them that its okay to feel a range of emotions. Tell them they should acknowledge their feelings and it's okay to feel the way they feel. Ask them to tell you what emotions they're feeling."
      )
  },

  {
    response: (messages) =>
      chatCompletions(
        messages,
        "in one sentence, only write a question that asks them how their emotions have been impacting them"
      )
  },

  {
    response: (messages) =>
      chatCompletions(
        messages,
        "In 2 sentence, tell them why it's okay that they feel the way they feel."
      )
  },

  {
    response: (messages) =>
      chatCompletions(
        messages,
        "in one sentence, only write a question that asks them how they have been dealing with the emotions they're feeling."
      )
  },

  {
    response: (messages) =>
      chatCompletions(
        messages,
        "Respond to the user, then tell them you understand what they're going through and ask them one question to gather more information on the user's situation. Do not repeat questions asked before."
      )
  },
  

  {
    response: async (messages) => {
      const gptResponse = (await chatCompletions(
        messages,
      "In 5 sentences: Tell them you understand them and you're here for them. Summarise their situation and emotions by highlighting the key ideas and the problems they're facing. Finish by asking them if they think your judgement is correct."
      )) as string

      const res = staticResponse([gptResponse])()
      return res
    },

    next: async (messages) => {
      const params = lastbotanduser(messages as any)
      const userAffirm = await userAffirmed(params)

      if (userAffirm) {
        return { token: 'identifyDistortion'}
      } else {
        return { token: 'clarification' }
      }
    }
  },
]

export default RAPPORT_BUILDING_PATH_1
