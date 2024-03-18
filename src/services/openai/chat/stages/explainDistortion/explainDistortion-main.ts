import { RESPONSE_TYPE } from '../..'
import { staticResponse, userAffirmed, lastbotanduser, elaborateOrGuidance, isNotQuestion } from '../../../helper'
import { chatCompletions } from '../../..'

const EXPLAIN_DISTORTION: RESPONSE_TYPE | RESPONSE_TYPE[] = [
  {
    response: async (messages) => {
      const gptResponse = (await chatCompletions(
        messages,
        "In 2 sentences, ask them if they would like you to elaborate on how they show the cognitive distortion, or if they would like some guidance to challenge this cognitive distortion."
      )) as string

      const res = staticResponse([
        gptResponse
      ])()
      return res
    },

    next: async (messages) => {
      const params = lastbotanduser(messages as any)
      const wantElaborate = await elaborateOrGuidance(params)

      if (wantElaborate) {
        return { token: 'explainDistortion', subtoken: 1}
      } else {
        return { token: 'reframeExercise' }
      }
    }
  },

    {
        response: async (messages) => {
        const gptResponse = (await chatCompletions(
            messages,
            "Use 'I think... Because...' statements. In 3 sentences, elaborate in detail how they are exhibiting the cognitive distortion, and finish by stating how and why this cognitive distortion is not a healthy way to think. Do not ask any questions."
        )) as string

        const gptResponse2 = (await chatCompletions(
          messages,
          "In 1 sentence, only ask them if they would like to explore some ways to challenge this cognitive distortion."
      )) as string
    
        const res = staticResponse([
            gptResponse, 
            gptResponse2
        ])()
        return res
        },
    
        next: async (messages) => {
            const params = lastbotanduser(messages as any)
            const userAffirm = await userAffirmed(params)
      
            if (userAffirm) {
              return { token: 'reframeExercise'}
            } else {
              return { token: 'explainDistortion', subtoken: 2}
            }
          }
    },

    {
        response: async (messages) => {
        const gptResponse = (await chatCompletions(
            messages,
            "In 2 sentences, respond in a helpful way and ask them what they don't understand or don't agree with."
        )) as string
    
        return gptResponse
        },
    },

    {
        response: async (messages) => {
        const gptResponse = (await chatCompletions(
            messages,
            "In less than 3 sentences, respond in a way that is relevant and helpful and concluding. Finish by asking them if they understand and would like to explore some ways to challenge this cognitive distortion."
        )) as string
    
        const res = staticResponse([
            gptResponse
        ])()
        return res
        },
    
        next: async (messages) => {
            const params = lastbotanduser(messages as any)
            const notQuestion = await isNotQuestion(params)
            const userAffirm = await userAffirmed(params)
      
            if (notQuestion && userAffirm) {
              return { token: 'reframeExercise'}
            } else {
              return { token: 'explainDistortion', subtoken: 2}
            }
          }
    },

]

export default EXPLAIN_DISTORTION
