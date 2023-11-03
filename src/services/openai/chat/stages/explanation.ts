import { RESPONSE_TYPE } from '..'
import { staticResponse, userAffirmed } from '../../helper'

const EXPLANATION: RESPONSE_TYPE | RESPONSE_TYPE[] = [
  {
    response: staticResponse('Are you sure?'),
    next: async (messages) => {
      let lasteUserMessage = messages[messages.length - 1]
      if (typeof lasteUserMessage !== 'string') {
        lasteUserMessage = lasteUserMessage.content
      }
      const userIsIndeedSure = await userAffirmed(lasteUserMessage)

      if (userIsIndeedSure) {
        return { token: 'exercise' }
      } else {
        return { token: 'explanation' }
      }
    }
  }
]

export default EXPLANATION
