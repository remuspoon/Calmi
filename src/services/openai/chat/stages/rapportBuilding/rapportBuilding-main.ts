import { stringToPath } from 'sanity'
import { RESPONSE_TYPE } from '../..'
import { chatCompletions } from '../../..'
import { lastbotanduser, staticResponse, userAffirmed } from '../../../helper'
import rapportBuildingPath from './rapportBuilding-utils'


const RAPPORT_BUILDING: RESPONSE_TYPE | RESPONSE_TYPE[] = [
  
  {
    response: async (messages) => {
      const gptResponse = (await chatCompletions(
        messages,
      "tell them you understand and then write a question that asks them to clarify their situation. Do not repeat questions asked before."
      )) as string

      const res = staticResponse([gptResponse])()
      return res
    },

    next: async () => {
        const path = rapportBuildingPath()
        return { token: path}
      }
    },
]

export default RAPPORT_BUILDING
