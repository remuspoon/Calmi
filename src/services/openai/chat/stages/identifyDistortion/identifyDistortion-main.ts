import { RESPONSE_TYPE } from '../..'
import { staticResponse, userAffirmed, lastbotanduser } from '../../../helper'
import { chatCompletions } from '../../..'

const IDENTIFY_DISTORTION: RESPONSE_TYPE | RESPONSE_TYPE[] = [
  {
    response: (messages) =>
      chatCompletions(
        messages,
        'In 4 sentences: Emotionally support the user. Give them positive affirmations by stating you are proud of them or by telling them they are strong. Finish by stating you are here for them. Dont use the words "understand" and "sound".'
       )
  },

  {
    response: async (messages) => {
      const gptResponse = (await chatCompletions(
        messages,
        'In less than 4 sentences, Ask the user: [Can you tell me some automatic thoughts they have during their situation?]. Then, Give some examples of automatic thoughts they might have. Finish by asking them to you some thoughts they have.'
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
        "Use 'I think... Because...' statements. In 5 sentences or less, suggest one cognitive distortion that applies to them based on their thoughts. Next, explain what this cognitive distortion is. Explain in detail how they are exhibiting this cognitive distortion. Explain how this cognitive distortion may be negatively affecting them. Finish by asking them if they think your judgement is correct."
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
        return { token: 'explainDistortion' }
      } else {
        return { token: 'clarifyDistortion' }
      }
    }
  }
]

export default IDENTIFY_DISTORTION
