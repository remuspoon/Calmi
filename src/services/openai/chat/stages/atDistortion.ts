import { RESPONSE_TYPE } from '..'
import { staticResponse, userAffirmed, lastbotanduser } from '../../helper'
import { chatCompletions } from '../..'

const EXERCISE: RESPONSE_TYPE | RESPONSE_TYPE[] = [
  {
    response: async (messages) =>
      chatCompletions(
        messages,
        "Emotionally support the user. State that you're here for them and you want to help them"
      )
  },

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
        "In 5 sentences or less, suggest one cognitive distortion that applies to them based on their thoughts. Next, explain what this cognitive distortion is. Explain in detail how they are exhibiting this cognitive distortion. Explain how this cognitive distortion may be negatively affecting them. Finish by asking them if they think your judgement is correct."
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
