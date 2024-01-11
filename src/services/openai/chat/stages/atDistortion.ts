import { RESPONSE_TYPE } from '..'
import { staticResponse, userAffirmed, lastbotanduser } from '../../helper'
import { chatCompletions } from '../..'

const EXERCISE: RESPONSE_TYPE | RESPONSE_TYPE[] = [
  {
    response: async (messages) => {
      const gptResponse = (await chatCompletions(
        messages,
        'In less than 4 sentences, Ask the user: [What are some automatic thoughts they have during their situation?]. Then, Give some examples of automatic thoughts they might have. Finish by asking them to you some thoughts they have.'
      )) as string

      const res = staticResponse([
        gptResponse,
      ])()
      return res
    }
  },

  {
    response: async (messages) => {
      const gptResponse = (await chatCompletions(
        messages,
        "In 2 sentences, empathize with the user's automatic thoughts and situation. And then ask them: [In an ideal world, how would you want the situation to be?] "
      )) as string

      const res = staticResponse([
        gptResponse
      ])()
      return res
    }
  },

  {
    response: async (messages) => {
      const gptResponse = (await chatCompletions(
        messages,
        "In 5 sentences or less, suggest one cognitive distortion that applies to the user based on their thoughts. Next, explain what cognitive distortion is. State that this cognitive distortion might be preventing user's ideal situation from happening. Then, explain how the user is showing this cognitive distortion. Finish by asking the user if they think your judgement is correct."
      )) as string

      const res = staticResponse([
        gptResponse
      ])()
      return res
    },

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

export default EXERCISE
