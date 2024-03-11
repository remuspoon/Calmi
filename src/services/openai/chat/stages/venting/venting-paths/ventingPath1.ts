import { stringToPath } from 'sanity'
import { TERMINATING_MESSAGE } from '@/lib/constants'
import { RESPONSE_TYPE } from '../../..'
import { chatCompletions } from '../../../..'
import { lastbotanduser, staticResponse, userAffirmed, isNotQuestion } from '../../../../helper'


const VENTING_PATH_1: RESPONSE_TYPE | RESPONSE_TYPE[] = [
    {
        response: (messages) =>
          chatCompletions(
            messages,
            'In 4 sentences, offer some constructive advice to help the user. Do not suggest them to speak to other people or professional help or therapist.'
           )
      },
    
      {
        response: async (messages) => {
          const gptResponse = (await chatCompletions(
            messages,
            'In 4 sentences, respond in a way that is relevant and helpful and concluding.'
          )) as string
    
          const res = staticResponse([gptResponse])()
          return res
        },
    
        next: async (messages) => {
          const params = lastbotanduser(messages as any)
          const notQuestion = await isNotQuestion(params)
          const userAffirm = await userAffirmed(params)
    
          if (notQuestion && userAffirm) {
            return { token: 'ventingPath1', subtoken: 2}
          } else {
            return { token: 'ventingPath1', subtoken: 1}
          }
        }
      },

      {
        response: async (messages) => {
          const gptResponse = (await chatCompletions(
            messages,
            "In 5 sentences: Thank them for talking to you and trusting you. Remind them that they are strong and that they've got this. Tell them that if they feel like they need to talk again, you'll always be here to listen. Finsih by wishing them well. "
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
      }
]

export default VENTING_PATH_1
