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
  'START',
  'introduction',
  'rapportBuilding',
  'atExplanation',
  'atDistortion',
  'ExplainLoop',
  'crExercise',
  'identifyDistortion',
  'END'
]

export const calculateChatProgress = (token: TOKENS) => {
  if (!CHATSTAGES.includes(token)) return undefined
  if (token === 'END') return 100
  const index = CHATSTAGES.findIndex((stage) => stage === token)
  return ((index + 1) / CHATSTAGES.length) * 100
}
