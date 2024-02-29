import { TERMINATING_MESSAGE } from '@/lib/constants'
import { RESPONSE_TYPE } from '..'
import { chatCompletions } from '../..'
import { staticResponse, userAffirmed, lastbotanduser, isNotQuestion } from '../../helper'

const CR_EXERCISE: RESPONSE_TYPE | RESPONSE_TYPE[] = [
  {
    response: (messages) =>
      chatCompletions(
        messages,
        "Based on the response, ask them one question that challenges their cognitive distortion."
      )
  },

  {
    response: (messages) =>
      chatCompletions(
        messages,
        'Respond to them in less than four sentences. State how the cognitive distortion negatively impacts them.'
      )
  },

  {
    response: (messages) =>
      chatCompletions(
        messages,
        'Respond to them in less than four sentences. Build upon the argument and Suggest things they can do to challenge their cognitive distortion.'
      )
  },

  {
    response: (messages) =>
      chatCompletions(
        messages,
        'Respond to them in less than four sentences. Build upon the arguement and Ask them how they think challenging their cognitive distortion will positively impact them.'
      )
  },

  {
    response: async (messages) => {
      const gptResponse = (await chatCompletions(
        messages,
      "Respond to them in less than four sentences. Build upon the argument and state how the cognitive distortion negatively impacts them."
      )) as string

      const res = staticResponse([gptResponse])()
      return res
    },

    next: async (messages) => {
      const params = lastbotanduser(messages as any)
      const notQuestion = await isNotQuestion(params)
      const userAffirm = await userAffirmed(params)

      if (notQuestion && userAffirm) {
        return { token: 'crExercise', subtoken: 5}
      } else {
        return { token: 'crExercise', subtoken: 2}
      }
    }
  },

  /// Separate Below into different file ///

  {
    response: async (messages) => {
      const gptResponse = (await chatCompletions(
        messages,
        "Respond to the user. Within five sentences, tell the user 'I want you to write a statement or a goal that will help you achieve your ideal outcomes.' Then, give the user an example of a statement or goal that will challenge their cognitive distortion and help them achieve their ideal outcomes."
      )) as string

      const res = staticResponse([
        gptResponse
        // ,
        // 'Based on your answers above, I want you to create a new thought or an alternative response to your situation that allows you to move forward and achieve your ideal outcome.',
        // "For example, an alternate response to a thought such as 'I cannot commit to a goal I set.' Can be something like:",
        // "'Just because I've struggled with some goals in the past doesn't mean I can't commit or succeed in the future. Everyone has setbacks. I can learn from my past experiences, adjust my approach, and keep trying.'",
        // 'Your new response should recognize past difficulties but also emphasizes growth, learning, and the potential for future success. Now you try!'
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

        'Rethinking stuff sounds simple but is really difficult to do. You should feel proud of yourself for completing this exercise! Thank you for chatting with me and have a wonderful day!',

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
