import { RESPONSE_TYPE } from '../../..'
import { chatCompletions } from '../../../..'
import { lastbotanduser, staticResponse, userAffirmed } from '../../../../helper'


const RAPPORT_BUILDING_PATH_3: RESPONSE_TYPE | RESPONSE_TYPE[] = [

    {
        response: (messages) =>
          chatCompletions(
            messages,
            "in three sentences, Ask them a question that gathers more information on their situation."
          )
      },
      
      {
        response: (messages) =>
          chatCompletions(
            messages,
            "in three sentences, Give them positive affirmations and state that this is a safe space for them to open up and talk."
          )
      },
    
      {
        response: (messages) =>
          chatCompletions(
            messages,
            "In 2 sentences, Ask them about the emotions they're feeling"
          )
      },

    {
        response: (messages) =>
          chatCompletions(
            messages,
            "in 2 sentences, ask them how these emotions are affecting them and how are they dealing with these emotions"
          )
      },

      {
        response: (messages) =>
          chatCompletions(
            messages,
            "in 3 sentences, Give them a positive affirmation and ask them if there's anything else they would like to add to the situation."
          )
      },
      
      {
        response: async (messages) => {
          const gptResponse = (await chatCompletions(
            messages,
          "Say 'So to summarise...' and then In 4 sentences: Summarise their situation and emotions by highlighting the key ideas and the problems they're facing. Finish by asking them if they think your summary is correct."
          )) as string
    
          const res = staticResponse([gptResponse])()
          return res
        },
    
        next: async (messages) => {
          const params = lastbotanduser(messages as any)
          const userAffirm = await userAffirmed(params)
    
          if (userAffirm) {
            return { token: 'identifyDistortion'}
          } else {
            return { token: 'clarification' }
          }
        }
      },
    ]

export default RAPPORT_BUILDING_PATH_3
