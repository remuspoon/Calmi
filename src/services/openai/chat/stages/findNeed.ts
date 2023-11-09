import { RESPONSE_TYPE } from '..'
import { chatCompletions } from '../..'
import { staticResponse, userAffirmed } from '../../helper'


const FIND_NEED: RESPONSE_TYPE | RESPONSE_TYPE[] = [
  {response: (messages) => chatCompletions(messages, "In 3 sentences, respond to the user in a conversational manner."),

  next: async (messages) => {
    return {token : "findNeed"}},
  }
  ]
  
  export default FIND_NEED