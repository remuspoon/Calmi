import { stringToPath } from 'sanity'
import { RESPONSE_TYPE } from '../..'
import { chatCompletions } from '../../..'
import { lastbotanduser, staticResponse, userAffirmed, } from '../../../helper'


const VENTING: RESPONSE_TYPE | RESPONSE_TYPE[] = [
  {
    response: (messages) =>
      chatCompletions(
        messages,
        'Tell them this is a safe space to open up. Tell them you are ready to listen to them when they are ready to tell you.'
      )
  },

  {
    response: (messages) =>
      chatCompletions(
        messages,
        'In 2 sentences, Try to get a better understanding of their situation. Dont use the words "understand" and "sound".'
       )
  },

  {
    response: (messages) =>
      chatCompletions(
        messages,
        'In 3 sentences, Ask some questions to understand the background of the situation. If relevant, get to know who is involved in the situation and the nature of the relationships. Dont use the words "understand" and "sound".'
       )
  },

  {
    response: (messages) =>
      chatCompletions(
        messages,
        'In 2 sentences ask for more relevant detailed information about the situation. Dont use the words "understand" and "sound". '
       )
  },

  {
    response: (messages) =>
      chatCompletions(
        messages,
        'In 3 sentneces, Respond and then ask them how they are feeling about the issue. Dont use the words "understand" and "sound". '
       )
  },

  {
    response: (messages) =>
      chatCompletions(
        messages,
        'In 2 sentences, Respond and ask them what emotions are coming up for them. Dont use the words "understand" and "sound". '
       )
  },

  {
    response: (messages) =>
      chatCompletions(
        messages,
        'In 3 sentences, Empathsize with them by telling them how you would also feel similar in the situation. Use statements like "If I was in your position I would also feel...". Dont use the words "understand" and "sound".'
      )
  },

  {
    response: (messages) =>
      chatCompletions(
        messages,
        'In 1 sentence, Ask them how they are coping with it. Dont use the words "understand" and "sound".'
       )
  },

  {
    response: (messages) =>
      chatCompletions(
        messages,
        'In 2 sentences, Respond and Ask them what is the hardest part for them to deal with. Dont use the words "understand" and "sound".'
       )
  },

  {
    response: (messages) =>
      chatCompletions(
        messages,
        'In 4 sentences: Emotionally support the user. Give them positive affirmations by stating you are proud of them or by telling them they are strong. Dont use the words "understand" and "sound".'
       )
  },


  {
    response: async (messages) => {
      const gptResponse = (await chatCompletions(
        messages,
      "In 4 sentences, respond to them in a way that helps them with their situation, and then ask them whether they would like some advice "
      )) as string

      const res = staticResponse([gptResponse])()
      return res
    },

    next: async (messages) => {
      const params = lastbotanduser(messages as any)
      const userAffirm = await userAffirmed(params)

      if (userAffirm) {
        return { token: 'ventingPath1'}
      } else {
        return { token: 'ventingPath2'}
      }
    }
  },
]

export default VENTING
