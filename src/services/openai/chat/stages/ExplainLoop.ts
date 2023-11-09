import { RESPONSE_TYPE } from '..'
import { chatCompletions } from '../..'
import { lastbotanduser, staticResponse, userAffirmed } from '../../helper'


const EXPLAIN_LOOP: RESPONSE_TYPE | RESPONSE_TYPE[] = [
    {response: (messages) => chatCompletions(messages, "In one sentence, ask the user what they don't understand.")},

    {response: (messages) => chatCompletions(messages, "In 4 sentences, explain to the user based on their response. Finish by asking them if they understand what an automatic thought is."),

    next: async (messages) => {

        const params = lastbotanduser(messages as any)
        const userAffirm = await userAffirmed(params)
  
        if (userAffirm) {
          return { token: 'atDistortion' }
        } else {
          return { token: 'ExplainLoop' }
        }
      }},
  ]
  
  export default EXPLAIN_LOOP