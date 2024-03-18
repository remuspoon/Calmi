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
      "In 3 sentences, state you would like to know a bit more about the situation. Ask them to tell you more about it."
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
