import { TERMINATING_MESSAGE } from '@/lib/constants'
import { RESPONSE_TYPE } from '..'
import { chatCompletions } from '../..'
import { staticResponse, userAffirmed } from '../../helper'

const CR_EXERCISE: RESPONSE_TYPE | RESPONSE_TYPE[] = [
  {
    response: (messages) =>
      chatCompletions(
        messages,
        "Based on the user's automatic thoughts, ask the user one question that challenges their cognitive distortion."
      )
  },

  {
    response: (messages) =>
      chatCompletions(
        messages,
        'Respond to the user in less than two sentences. Afterwards, build upon the argument by asking another question that challenges the cognitive distortion.'
      )
  },

  {
    response: (messages) =>
      chatCompletions(
        messages,
        'Respond to the user in less than two sentences. Afterwards, build upon the argument by asking another question that challenges the cognitive distortion.'
      )
  },

  /// Separate Below into different file ///

  {
    response: async (messages) => {
      const gptResponse = (await chatCompletions(
        messages,
        "Fill in this statement: [As we can see, your thought that {insert user's automatic thought} is distorted.]"
      )) as string

      const res = staticResponse([
        gptResponse,
        'Based on your answers above, I want you to create a new thought or an alternative response to your situation that allows you to move forward and achieve your ideal outcome.',
        "For example, an alternate response to a thought such as 'I cannot commit to a goal I set.' Can be something like:",
        "'Just because I've struggled with some goals in the past doesn't mean I can't commit or succeed in the future. Everyone has setbacks. I can learn from my past experiences, adjust my approach, and keep trying.'",
        'Your new response should recognize past difficulties but also emphasizes growth, learning, and the potential for future success. Now you try!'
      ])()
      return res
    }
  },

  {
    response: async (messages) => {
      const gptResponse = (await chatCompletions(
        messages,
        "Fill in:[When we started out you were feeling {insert user feeling} because of your thought: {insert user's automatic thought}. You realised that it was not helping and replaced it with a new thought: {insert user's alternate response}."
      )) as string

      const res = staticResponse([
        gptResponse,

        'You challenged your thought based on a clearer perspective, and craft a balanced, realistic alternative response. Now, whenever the negative thought arises, go to "My Journal" and remind yourself of this alternative response. Over time, this practice will not only shift your thinking patterns but also positively influence your emotions and actions, leading to healthier responses to situations.',

        'Rethinking stuff sounds simple but is really difficult to do. You should feel proud of yourself for completing this exercise! Thank you for chatting with me and have wonderful day!',
        TERMINATING_MESSAGE
      ])()
      return res
    },
    next: async (messages) => {
      return { token: 'END' }
    }
  }
]

export default CR_EXERCISE
