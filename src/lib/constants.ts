import { TOKENS } from '@/services/openai/chat'

export const TERMINATING_MESSAGE = 'End'

// export const CHATSTAGES:{
//   name:TOKENS,
//   thread:number
// }[] = [
//   {
//     name: 'introduction',
//     thread: 1
//   },
//   {
//     name: 'rapportBuilding',
//     thread: 5
//   },
//   {
//     name:'atExplanation',
//     thread:1
//   }
// ]

const CHATSTAGES: TOKENS[] = [
  'introduction',
  'rapportBuilding',
  'rapportBuildingPath1',
  'rapportBuildingPath2',
  'rapportBuildingPath3',
  'reframeExercise',
  'identifyDistortion',
  'clarifyDistortion',
  'clarification',
  'END',
  'START',
]

export const calculateChatProgress = (token: TOKENS) => {
  if (!CHATSTAGES.includes(token)) return undefined
  if (token === 'END') return 100
  const index = CHATSTAGES.findIndex((stage) => stage === token)
  return ((index + 1) / CHATSTAGES.length) * 100
}
