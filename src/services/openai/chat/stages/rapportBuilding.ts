import { RESPONSE_TYPE } from '..'
import { chatCompletions } from '../..'
import { staticResponse, userAffirmed } from '../../helper'

const RAPPORT_BUILDING: RESPONSE_TYPE | RESPONSE_TYPE[] = [
  {
    response: staticResponse('1')
  },
  {
    response: (messages) => chatCompletions(messages, 'Just say HI')
  },
  {
    // response: staticResponse(['3', '4', '5']),
    response: async (messages) => {
      const gptResponse = (await chatCompletions(
        messages,
        'say Hello'
      )) as string
      const gptResponse2 = (await chatCompletions(
        messages,
        'say Goodbye'
      )) as string
      const res = staticResponse(['3', gptResponse, gptResponse2, '5'])()
      return res
    },
    next: async (messages) => {
      let lasteUserMessage = messages[messages.length - 1]
      if (typeof lasteUserMessage !== 'string') {
        lasteUserMessage = lasteUserMessage.content
      }
      const userUnderstood = await userAffirmed(lasteUserMessage)

      if (userUnderstood) {
        return { token: 'exercise' }
      } else {
        return { token: 'explanation' }
      }
    }
  },
  {
    response: (messages) => chatCompletions(messages, 'he understood')
  }
]

export default RAPPORT_BUILDING
