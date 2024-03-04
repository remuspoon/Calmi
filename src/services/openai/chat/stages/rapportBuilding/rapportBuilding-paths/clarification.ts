import { RESPONSE_TYPE } from '../../..'
import { chatCompletions } from '../../../..'
import { lastbotanduser, staticResponse, userAffirmed } from '../../../../helper'


const CLARIFY_SITUATION: RESPONSE_TYPE | RESPONSE_TYPE[] = [
    {response: (messages) => chatCompletions(messages, "Ask the user for details on why they disagree.")},

    {response: async (messages) => {
        const gptResponse = (await chatCompletions(
          messages,
          "In second person perspective, summarise the user's situation and feelings by highlighting the key ideas and the problems they're facing. Finish by asking the user if they think your judgement is correct."
        )) as string
  
        const res = staticResponse([gptResponse])()
        return res
      }, 
  
      next: async (messages) => {
        // let lasteUserMessage = messages[messages.length - 1]
        // if (typeof lasteUserMessage !== 'string') {
        //   lasteUserMessage = lasteUserMessage.content
        // }
        const params = lastbotanduser(messages as any)
        const userAffirm = await userAffirmed(params)
  
        if (userAffirm) {
          return { token: 'rapportBuilding', subtoken: 3}
        } else {
          return { token: 'clarification' }
        }
      }
    },
  ]
  
  export default CLARIFY_SITUATION