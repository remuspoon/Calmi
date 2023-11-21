import { RESPONSE_TYPE } from '..'
import { chatCompletions } from '../..'
import { lastbotanduser, userAffirmed } from '../../helper'

const IDENTIFY_DISTORTION: RESPONSE_TYPE | RESPONSE_TYPE[] = [
  {
    response: (messages) =>
      chatCompletions(
        messages,
        'In two sentences or less, ask the user to elaborate on why they disagree.'
      )
  },

  {
    response: (messages) =>
      chatCompletions(
        messages,
        'In 5 sentences or less, suggest another cognitive distortion that applies to the user based on their responses. Next, explain how the user is showing this cognitive distortion. Finish by asking the user if they think your judgement is correct.'
      ),

    next: async (messages) => {
      const params = lastbotanduser(messages as any)
      const userAffirm = await userAffirmed(params)

      if (userAffirm) {
        return { token: 'crExercise' }
      } else {
        return { token: 'identifyDistortion' }
      }
    }
  }
]

export default IDENTIFY_DISTORTION
