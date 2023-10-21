import { RESPONSE_TYPE } from '..'
import { staticResponse } from '../../helper'

const REPORT_BUILDING: RESPONSE_TYPE | RESPONSE_TYPE[] = [
  {
    response: staticResponse('1')
  },
  {
    response: staticResponse('2')
  },
  {
    response: staticResponse(['3', '4', '5']),
    next: () => ({ token: 'report-building', subtoken: 1 })
  }
]

export default REPORT_BUILDING
