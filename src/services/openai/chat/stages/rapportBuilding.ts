import { RESPONSE_TYPE } from '..'
import { chatCompletions } from '../..'
import { lastbotanduser, staticResponse, userAffirmed } from '../../helper'

// const RAPPORT_BUILDING: RESPONSE_TYPE | RESPONSE_TYPE[] = [
//   {response: staticResponse('1')},

//   {response: (messages) => chatCompletions(messages, 'Just say HI')},

//   {// response: staticResponse(['3', '4', '5']),
//     response: async (messages) => {
//       const gptResponse = (await chatCompletions(
//         messages,
//         'say Hello'
//       )) as string
//       const gptResponse2 = (await chatCompletions(
//         messages,
//         'say Goodbye'
//       )) as string
//       const res = staticResponse(['3', gptResponse, gptResponse2, '5'])()
//       return res
//     },

//     next: async (messages) => {
//       let lasteUserMessage = messages[messages.length - 1]
//       if (typeof lasteUserMessage !== 'string') {
//         lasteUserMessage = lasteUserMessage.content
//       }
//       const userUnderstood = await userAffirmed(lasteUserMessage)

//       if (userUnderstood) {
//         return { token: 'exercise' }
//       } else {
//         return { token: 'explanation' }
//       }
//     }
//   },
// ]

const RAPPORT_BUILDING: RESPONSE_TYPE | RESPONSE_TYPE[] = [
  {
    response: (messages) =>
      chatCompletions(
        messages,
        "In 4 sentences or less, Empathize with the user's feelings and situation without repeating it word for word. Do not offer solutions. Afterwards, ask one question to gather more information on the user's situation."
      )
  },

  {
    response: (messages) =>
      chatCompletions(
        messages,
        "In 2 sentences, ask one question to gather more information on the user's situation. Do not repeat questions asked before."
      )
  },

  {
    response: async (messages) => {
      const gptResponse = (await chatCompletions(
        messages,
        "In second person perspective, summarise the user's situation and feelings by highlighting the key ideas and the problems they're facing. Finish by asking the user if they think your judgement is correct."
      )) as string

      const res = staticResponse(['I think I understand now.', gptResponse])()
      return res
    },

    next: async (messages) => {
      const params = lastbotanduser(messages as any)
      const userAffirm = await userAffirmed(params)

      if (userAffirm) {
        return { token: 'rapportBuilding', subtoken: 3 }
      } else {
        return { token: 'ClarifySituation' }
      }
    }
  },

  {
    response: async (messages) => {
      const gptResponse = (await chatCompletions(
        messages,
        "In less than 3 sentences, ask the user if they want to try a 'Cognitive Restructuring' exercise to help their feelings and situation."
      )) as string
      const res = staticResponse([gptResponse])()
      return res
    },

    next: async (messages) => {
      const params = lastbotanduser(messages as any)
      const userAffirm = await userAffirmed(params)

      if (userAffirm) {
        return { token: 'rapportBuilding', subtoken: 4 }
      } else {
        return { token: 'findNeed' }
      }
    }
  },

  {
    response: staticResponse(
      "Great! In this exercise, we are going to identify your distorted 'Automatic thoughts'; and rethink them into something more constructive. Do you know what is an Automatic Thought in CBT?"
    ),
    next: async (messages) => {
      const params = lastbotanduser(messages as any)
      const userAffirm = await userAffirmed(params)

      if (userAffirm) {
        return { token: 'atDistortion' }
      } else {
        return { token: 'atExplanation' }
      }
    }
  }
]

export default RAPPORT_BUILDING
