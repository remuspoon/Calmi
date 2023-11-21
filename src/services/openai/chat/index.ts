import 'server-only'

import { chatCompletions } from '../'
import { isSuicidal } from '../helper'
import { TERMINATING_MESSAGE } from '@/lib/constants'
import INTRODUCTION from './stages/introduction'
import RAPPORT_BUILDING from './stages/rapportBuilding'
import AT_DISTORTION from './stages/atDistortion'
import AT_EXPLANATION from './stages/atExplanation'
import FIND_NEED from './stages/findNeed'
import CR_EXERCISE from './stages/crExercise'
import IDENTIFY_DISTORTION from './stages/identifyDistortion'
import EXPLAIN_LOOP from './stages/ExplainLoop'
import CLARIFY_SITUATION from './stages/ClarifySituation'

export type ChatCompletionMessageParam<
  T extends 'user' | 'assistant' | 'system'
> = {
  role: T
  content: string
  token?: T extends 'user' ? Exclude<TOKENS, 'END'> : Exclude<TOKENS, 'END'>
  subtoken?: number
}
export type TOKENS =
  | 'introduction'
  | 'END'
  | 'START'
  | 'rapportBuilding'
  | 'atDistortion'
  | 'atExplanation'
  | 'findNeed'
  | 'crExercise'
  | 'identifyDistortion'
  | 'ExplainLoop'
  | 'ClarifySituation'
export type RESPONSE_TYPE = {
  next?: (messages: ChatCompletionMessageParam<'user'>[] | string) =>
    | {
        token: Exclude<TOKENS, 'START'>
        subtoken?: number
        with?: string | string[]
      }
    | Promise<{
        token: Exclude<TOKENS, 'START'>
        subtoken?: number
        with?: string | string[]
      }>
  response: (
    messages: ChatCompletionMessageParam<'user'>[]
  ) => Promise<string | null | string[]>
}

const RESPONSES_v1: Record<
  Exclude<TOKENS, 'END' | 'START'>,
  RESPONSE_TYPE | RESPONSE_TYPE[]
> = {
  introduction: INTRODUCTION,
  rapportBuilding: RAPPORT_BUILDING,
  atDistortion: AT_DISTORTION,
  atExplanation: AT_EXPLANATION,
  findNeed: FIND_NEED,
  crExercise: CR_EXERCISE,
  identifyDistortion: IDENTIFY_DISTORTION,
  ExplainLoop: EXPLAIN_LOOP,
  ClarifySituation: CLARIFY_SITUATION
}

const getGptResponse = async (
  messages: ChatCompletionMessageParam<'user'>[]
) => {
  const currentMessage = messages.findLastIndex(
    (message) => message.role === 'user'
  )

  let currentToken = messages[currentMessage].token
  const currentSubtoken = messages[currentMessage].subtoken || 0

  messages[currentMessage] = {
    role: 'user',
    content: messages[currentMessage].content
  }
  if (!currentToken) {
    console.log('no token')
    return [TERMINATING_MESSAGE]
  }

  if (currentToken === 'START') {
    console.log('start')
    currentToken = 'introduction'
    let currentStage = RESPONSES_v1[currentToken]
    if (!Array.isArray(currentStage)) {
      currentStage = [currentStage]
    }
    let response = await currentStage[0].response(messages)

    if (!Array.isArray(response)) {
      response = [response!]
    }
    return { response, token: currentToken, subtoken: 0 }
  }

  let currentStage = RESPONSES_v1[currentToken]

  console.log(currentToken, currentSubtoken)

  if (!currentStage) {
    console.log('no stage')
    return [TERMINATING_MESSAGE]
  }

  if (!Array.isArray(currentStage)) {
    currentStage = [currentStage]
  }

  const next = currentStage[currentSubtoken].next

  let nextToken, nextsubtoken, endWith

  if (next) {
    console.log('next')
    const nextResponse = await next(messages)
    nextToken = nextResponse.token
    nextsubtoken = nextResponse.subtoken || 0
    endWith = nextResponse.with
  } else {
    console.log('no next')
    nextToken = currentToken
    nextsubtoken = currentSubtoken + 1
  }

  console.log(nextToken, nextsubtoken)

  if (nextToken === 'END') {
    if (endWith) {
      console.log('end with', endWith)
      return Array.isArray(endWith) ? endWith : [endWith]
    } else {
      console.log('end')
      return [TERMINATING_MESSAGE]
    }
  }

  let nextStage = RESPONSES_v1[nextToken]

  if (!Array.isArray(nextStage)) {
    nextStage = [nextStage]
  }

  let response = await nextStage[nextsubtoken].response(messages)

  if (!Array.isArray(response)) {
    response = [response!]
  }

  return { response, token: nextToken, subtoken: nextsubtoken }
}

export type GPTResponseType = Awaited<ReturnType<typeof getGptResponse>>

// Templates

//////// Static message
// async (messages) => new Promise((resolve,  reject)=>{
//      resolve({choices:[{message:{content:'Sorry'}}]} as any )
//    }),

//////// Text Davinci
// async (messages: ChatCompletionMessageParam[]) =>{
//   const user = messages.findLast(m=>m.role==='user')?.content
//     const rephrased = await openai.completions.create({
//       model:'text-davinci-002',
//       prompt: `rephrase this statement : ${user}`,
//       temperature:0.7,
//       max_tokens : 200
//     })
//     return {choices:[{message:{content:rephrased}}]}
//   },

//////// Normal GPT
// (messages: ChatCompletionMessageParam[]) =>
//     chatCompletions(
//       messages,
//       "say 'Great job identifying the strongest automatic thought for us to look at. Remember, our thoughts are not always helpful, so let's work together to rethink this thought into something more constructive!'"```
//     ),

/////// Multi Responses
// async (messages: ChatCompletionMessageParam[]) =>
// new Promise(async (resolve,  reject)=>{
//   const gptResponse = await chatCompletions(
//     messages,
//     "Empathize with user feelings"
//   )
//
//   const gptREsponse2 = await chatCompletions(
//     messages,
//     "Empathize with user feelings"
//   )
//   const dv = async (messages: ChatCompletionMessageParam[]) =>{
//     const user = messages.findLast(m=>m.role==='user')?.content
//       const rephrased = await openai.completions.create({
//         model:'text-davinci-002',
//         prompt: `rephrase this statement : ${user}`,
//         temperature:0.7,
//         max_tokens : 200
//       })
//       return {choices:[{message:{content:rephrased}}]}
//     },

//     const dvResponse  = await dv(messages)

//   resolve([sendStaticReply('Please describe to me your emotions.'),gptResponse,sendStaticReply(TERMINATING_MESSAGE),gptREsponse2,dvResponse] as any )
//    }),

///////Terminating message
// async (messages: ChatCompletionMessageParam[]) => new Promise((resolve,  reject)=>{
//   resolve({choices:[{message:{content: TERMINATING_MESSAGE}}]} as any )
// }),

const sendStaticReply = (content: string) =>
  new Promise((resolve, reject) => {
    resolve(content)
  })

// const getGptResponse = async (messages: ChatCompletionMessageParam[]) => {
//   const currentMessage = messages
//     .filter((m) => m.role === 'user')
//     .findLastIndex((message) => message.role === 'user')

//   if (!RESPONSES[currentMessage]) {
//     return sendStaticReply(TERMINATING_MESSAGE)
//   }
//   let response = await RESPONSES[currentMessage](messages)

//   if (!Array.isArray(response)) {
//     response = [response]
//   }

//   return response
// }

//////////////////// BUILD RAPPORT PHASE

// const RESPONSES = [
//   (messages) =>
//     chatCompletions(
//       messages,
//       'Ask the user to clarify on either the situation that is troubling them or their feelings.'
//     ),

//   async (messages) => {
//     const suicidal = await isSuicidal(
//       messages.findLast((m) => m.role === 'user')?.content || ''
//     )
//     if (suicidal) {
//       return chatCompletions(
//         messages,
//         "just say I'm really sorry to hear that but I am unable to provide the help that you need. Please seek professional help or reach out to someone you trust for support."
//       )
//     } else {
//       return chatCompletions(
//         messages,
//         "In 4 sentences or less, Empathize with the user's feelings and situation. Do not offer solutions. Afterwards, ask one question to gather more information on the user's situation.'"
//       )
//     }
//   },

//   (messages) =>
//     chatCompletions(
//       messages,
//       'In 3 sentences, encourage the user to elaborate on their situation or feelings with one open-ended question. Do not repeat questions asked before.'
//     ),
//   (messages) =>
//     chatCompletions(
//       messages,
//       "In 2 sentences, ask one question to gather more information on the user's situation. Do not repeat questions asked before."
//     ),

//   async (messages) =>
//     new Promise(async (resolve, reject) => {
//       const gptResponse2 = await chatCompletions(
//         messages,
//         "In second person perspective, summarise the user's situation and feelings by highlighting the key ideas and the problems they're facing. Finish by asking the user if they think your judgement is correct."
//       )

//       resolve([
//         sendStaticReply('I think I understand your situation now.'),
//         gptResponse2
//       ] as any)
//     }),

//   (messages) =>
//     chatCompletions(
//       messages,
//       "In less than 3 sentences, ask the user if they want to try a 'Cognitive Restructuring' exercise to help their feelings and situation."
//     ),

//   ////////////// COGNITIVE RESTRUCTURING EXERCISE BEGIN

//   async (messages) =>
//     new Promise(async (resolve, reject) => {
//       const gptResponse = await chatCompletions(
//         messages,
//         "say this exactly: 'Great! In this exercise, we are going to identify your distorted 'Automatic thoughts'; and rethink them into something more constructive.'"
//       )

//       resolve([
//         sendStaticReply(
//           "Great! In this exercise, we are going to identify your distorted 'Automatic thoughts'; and rethink them into something more constructive."
//         ),

//         sendStaticReply(
//           "In CBT, Automatic thoughts are those quick, almost reflex-like thoughts that come to us without us really trying. They're like knee-jerk reactions, but in our minds. These thoughts aren't always true or helpful. Sometimes they're way off base or just too negative."
//         ),

//         sendStaticReply(
//           "For example, imagine you're walking down the street, and you see someone you know. You wave at them, but they don't wave back. Instantly, a thought pops into your head: 'Did I do something wrong? Why are they mad at me?' That immediate thought? That's what we call an 'automatic thought'."
//         ),

//         sendStaticReply(
//           "We want to try catch these sneaky thoughts, question them (like, 'Maybe that person didn't see me?'), and come up with better, more balanced thoughts. This way, instead of feeling hurt or worried, we might just think, 'Maybe they were distracted. I'll check in with them later.'"
//         ),

//         sendStaticReply('Understood? Can we move on?')
//       ] as any)
//     }),
//   ////
//   // Create 'Understanding' loop in here
//   ////
//   async (messages) =>
//     new Promise(async (resolve, reject) => {
//       const gptResponse = await chatCompletions(
//         messages,
//         'Fill in this statement:[Tell me, what are some automatic thoughts when you experienced {user situation}?'
//       )
//       resolve([
//         sendStaticReply(
//           "Great! Let's begin! Remember, don't rush this exercise and take your time. The more you think, the better the outcome this exercise will be."
//         ),
//         gptResponse,
//         sendStaticReply(
//           'I want you to list out as many reasons why this might make you feel upset.'
//         )
//       ] as any)
//     }),

//   async (messages) =>
//     new Promise(async (resolve, reject) => {
//       const gptResponse = await chatCompletions(
//         messages,
//         "In 2 sentences, empathize with the user's automatic thoughts and situation."
//       )
//       resolve([
//         gptResponse,
//         sendStaticReply(
//           'In an ideal world, how would you want the situation to be?'
//         )
//       ] as any)
//     }),

//   async (messages) =>
//     new Promise(async (resolve, reject) => {
//       const gptResponse = await chatCompletions(
//         messages,
//         "In 5 sentences or less, suggest one cognitive distortion that applies to the user based on their automatic thoughts. Next, explain what the cognitive distortion is. State that this cognitive distortion might be preventing user's ideal situation from happening. Then, explain how the user is showing this cognitive distortion. Finish by asking the user if they think your judgement is correct"
//       )
//       resolve([
//         sendStaticReply(
//           "I think I've identified a cognitive distortion in your automatic thoughts."
//         ),
//         sendStaticReply(
//           'A cognitive distortion is a biased or irrational way of thinking that can lead to inaccurate perceptions, false beliefs, or negative emotions. These distortions often reinforce negative thought patterns.'
//         ),
//         gptResponse
//       ] as any)
//     }),

//   (messages) =>
//     chatCompletions(
//       messages,
//       "Based on the user's automatic thoughts, ask the user one question that challenges their cognitive distortion."
//     ),

//   (messages) =>
//     chatCompletions(
//       messages,
//       'Respond to the user in less than two sentences. Afterwards, build upon the argument by asking another question that challenges the cognitive distortion.'
//     ),

//   async (messages) =>
//     new Promise(async (resolve, reject) => {
//       const gptResponse = await chatCompletions(
//         messages,
//         "Fill in this statement: [As we can see, your thought that {insert user's automatic thought} is distorted.]"
//       )
//       resolve([
//         gptResponse,
//         sendStaticReply(
//           'Based on your answers above, I want you to create a new thought or an alternative response to your situation that allows you to move forward and achieve your ideal outcome.'
//         ),
//         sendStaticReply(
//           "For example, an alternate response to a thought such as 'I cannot commit to a goal I set.' Can be something like: "
//         ),
//         sendStaticReply(
//           "'Just because I've struggled with some goals in the past doesn't mean I can't commit or succeed in the future. Everyone has setbacks. I can learn from my past experiences, adjust my approach, and keep trying.'"
//         ),
//         sendStaticReply(
//           'Your new response should recognize past difficulties but also emphasizes growth, learning, and the potential for future success. Now you try!'
//         )
//       ] as any)
//     }),

//   async (messages) =>
//     new Promise(async (resolve, reject) => {
//       const gptResponse = await chatCompletions(
//         messages,
//         "Fill in:[Well done {username}! When we started out you were feeling {insert user feeling} because of your thought: {insert user's automatic thought}.You realised that it was not helping and replaced it with a new thought: {insert user's alternate response}."
//       )
//       resolve([
//         gptResponse,

//         sendStaticReply(
//           'You challenge your thought based on a clearer perspective, and craft a balanced, realistic alternative response. Now, whenever the negative thought arises, try to replace it with this new thought. Over time, this practice will not only shift your thinking patterns but also positively influence your emotions and actions, leading to healthier responses to situations.'
//         ),

//         sendStaticReply(
//           'Rethinking stuff sounds simple but is really difficult to do. You should feel proud of yourself for completing this exercise! Thank you for chatting with me and have wonderful day!'
//         )
//       ] as any)
//     })
// ]

export default getGptResponse
