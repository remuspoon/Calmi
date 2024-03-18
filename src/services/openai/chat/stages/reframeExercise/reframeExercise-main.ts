import { TERMINATING_MESSAGE } from '@/lib/constants'
import { RESPONSE_TYPE } from '../..'
import { chatCompletions } from '../../..'
import { staticResponse, userAffirmed, lastbotanduser, isNotQuestion } from '../../../helper'

const REFRAME_EXERCISE: RESPONSE_TYPE | RESPONSE_TYPE[] = [
  {
    response: (messages) =>
      chatCompletions(
        messages,
        "In 3 sentences, explain that we are going to explore the evidences that support and challenge their cognitive distortions, finish by asking them what evidences supports their cognitive distortion."
      )
  },

  {
    response: (messages) =>
      chatCompletions(
        messages,
        "In 3 sentences, respond to them and ask them to what evidences may challenge their cognitive distortions."
      )
  },

  {
    response: async (messages) => {
      const gptResponse = (await chatCompletions(
        messages,
        'In 3 sentences, Respond to them, and then acknowledging both the for and against evidence, offer a more balanced way they can interpret their situation. Finish by asking them if they would like some practical steps to help them achieve this balanced interpretation.'
      )) as string

      const res = staticResponse([gptResponse])()
      return res
    },

    next: async (messages) => {
      const params = lastbotanduser(messages as any)
      const notQuestion = await isNotQuestion(params)
      const userAffirm = await userAffirmed(params)

      if (notQuestion && userAffirm) {
        return { token: 'reframeExercise', subtoken: 3}
      } else {
        return { token: 'reframeExercise', subtoken: 4}
      }
    }
  },

  {
    response: (messages) =>
      chatCompletions(
        messages,
        "In 4 sentences, respond to them and give them on specific method with examples on how to achieve the balanced interpretation you suggested."
      )
  },

  {
    response: async (messages) => {
      const gptResponse = (await chatCompletions(
        messages,
        'In 3 sentences, respond with a statement that is relevant and helpful. Do not suggest them to speak to other people or professional help or therapist. Do not repeat the things said before. If appropriate, you should elaborate/reinforce your ideas or encourage them by telling them that they are strong and you are proud of them.'
      )) as string

      const res = staticResponse([gptResponse])()
      return res
    },

    next: async (messages) => {
      const params = lastbotanduser(messages as any)
      const notQuestion = await isNotQuestion(params)
      const userAffirm = await userAffirmed(params)

      if (notQuestion && userAffirm) {
        return { token: 'reframeExercise', subtoken: 5}
      } else {
        return { token: 'reframeExercise', subtoken: 4}
      }
    }
  },

  /// Separate Below into different file ///

  {
    response: async (messages) => {
      const gptResponse = (await chatCompletions(
        messages,
        "Respond to them. Within four sentences, based on what was discussed, tell them 'I want you to come up with a statement which will help them come up with a better mindset'. Then, state an example of a statement or goal that will challenge their cognitive distortion and help them achieve their ideal outcomes."
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
        "In 3 sentences, explain and state how they can use the new statement or goal to help and remind themselves to adopt a more balanced mindset when the negative thought arises, and how it will shift their thinking patterns over time. Finish by Telling them you're really proud of them for completing this exercise."
      )) as string

      const gptResponse2 = (await chatCompletions(
        messages,
        "In 1 sentence, only ask them if they would like you to elaborate on how to use the new statement or goal to help them to adopt a more balanced mindset."
      )) as string
      const res = staticResponse([gptResponse, gptResponse2])()
      return res
    },

    next: async (messages) => {
      const params = lastbotanduser(messages as any)
      const userAffirm = await userAffirmed(params)

      if (userAffirm) {
        return { token: 'reframeExercise', subtoken: 7}
      } else {
        return { token: 'reframeExercise', subtoken: 8}
      }
    }
  },

  {
    response: async (messages) => {
      const gptResponse = (await chatCompletions(
        messages,
        'In 3 sentences, elaborate how they should use the new thought to promote positive changes with a conclusive tone. Do not suggest them to speak to other people or professional help or therapist. Do not repeat the things said before.'
      )) as string

      const res = staticResponse([gptResponse])()
      return res
    },

    next: async (messages) => {
      const params = lastbotanduser(messages as any)
      const notQuestion = await isNotQuestion(params)
      const userAffirm = await userAffirmed(params)

      if (notQuestion && userAffirm) {
        return { token: 'reframeExercise', subtoken: 8}
      } else {
        return { token: 'reframeExercise', subtoken: 7}
      }
    }
  },

  {
    response: async (messages) => {
      const gptResponse = (await chatCompletions(
        messages,
        "In 3 sentences, congratulate them for finishing the exercise. state that you are really really proud of them, acknowledge that it takes a lot of courage to open up and remind them that they are strong and capable of overcoming their problems."
      )) as string

      const res = staticResponse([
        gptResponse,

        'I have recorded your progress in the "My Journal" tab. You can access it anytime to review your progress and reflect on your journey.',

        'Thank you for chatting with me and have a wonderful day!',

        TERMINATING_MESSAGE
      ])()
      return res
    },
    next: async (messages) => {
      return { token: 'END' }
    }
  }
]

export default REFRAME_EXERCISE
