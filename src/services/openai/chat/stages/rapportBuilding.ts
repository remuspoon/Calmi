import { RESPONSE_TYPE } from '..'
import { staticResponse } from '../../helper'

const RAPPORT_BUILDING: RESPONSE_TYPE | RESPONSE_TYPE[] = [
  {
    response: staticResponse('1')
  },
  {
    response: staticResponse('2')
  },
  {
    response: staticResponse(['3', '4', '5']),
    next: () => ({ token: 'rapport-building', subtoken: 1 })
  }
]

export default RAPPORT_BUILDING
