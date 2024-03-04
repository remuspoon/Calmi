import { RESPONSE_TYPE } from '../..'
import { chatCompletions } from '../../..'
import { lastbotanduser, userAffirmed } from '../../../helper'

const CLARIFY_DISTORTION: RESPONSE_TYPE | RESPONSE_TYPE[] = [
  {
    response: (messages) =>
      chatCompletions(
        messages,
        'In 3 sentences, respond to the user and ask the user to elaborate on why they disagree.'
      )
  },

  {
    response: (messages) =>
      chatCompletions(
        messages,
        "In 5 sentences or less, suggest to them how they are showing a cognitive distortion based on their responses. Next, explain in detail how this cognitive distortion applies to them and why its affecting them negatively. Finish by asking them if they think your judgement is correct."
      ),

    next: async (messages) => {
      const params = lastbotanduser(messages as any)
      const userAffirm = await userAffirmed(params)

      if (userAffirm) {
        return { token: 'reframeExercise' }
      } else {
        return { token: 'clarifyDistortion' }
      }
    }
  }
]

export default CLARIFY_DISTORTION
