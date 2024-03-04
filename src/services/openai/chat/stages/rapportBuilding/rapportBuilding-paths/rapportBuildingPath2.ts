import { RESPONSE_TYPE } from '../../..'
import { chatCompletions } from '../../../..'
import { lastbotanduser, staticResponse, userAffirmed } from '../../../../helper'


const RAPPORT_BUILDING_PATH_2: RESPONSE_TYPE | RESPONSE_TYPE[] = [

    {
        response: (messages) =>
          chatCompletions(
            messages,
            "In 3 sentences, get more information on the situation and ask them how the situation has been impacting them."
          )
      },
      
      {
        response: (messages) =>
          chatCompletions(
            messages,
            "In two sentences, say 'I guess you're feeling...' and then guess what they're feeling by suggesting other emotions they might feel. Finish by asking them if they think you're right'."
          )
      },
    
      {
        response: (messages) =>
          chatCompletions(
            messages,
            "In two sentences, state you support and validate their emotions and feelings. Don't use the word 'understand' and 'normal'"
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
            "In 3 sentence, tell them they're strong for dealing with the emotions they're feeling and you're proud of them for talking about this with you."
          )
      },
      
      {
        response: async (messages) => {
          const gptResponse = (await chatCompletions(
            messages,
          "Say 'So to summarise...' and then In 4 sentences: Summarise their situation and emotions by highlighting the key ideas and the problems they're facing. Finish by asking them if they think your summary is correct."
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

export default RAPPORT_BUILDING_PATH_2
