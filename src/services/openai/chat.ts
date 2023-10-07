import { ChatCompletionMessageParam } from '@/components/Chat'
import { chatCompletions } from '.'
import { isSuicidal } from './helper'
import { TERMINATING_MESSAGE } from '@/lib/constants'

// Templates

//////// Static message
// async (messages: ChatCompletionMessageParam[]) => new Promise((resolve,  reject)=>{
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

const sendStaticReply = (content:string)=> {return {choices:[{message:{content:content}}]}}

const getGptResponse = async (messages: ChatCompletionMessageParam[]) => {
  const currentMessage = messages
    .filter((m) => m.role === 'user')
    .findLastIndex((message) => message.role === 'user')
  let response = await RESPONSES[currentMessage](messages)

  // return (response as any).choices[0].message.content

  if(!Array.isArray(response)){
    response= [response]
  }

  return (response as any).map((res:any)=>res.choices[0].message.content)
}

const RESPONSES = [
  (messages: ChatCompletionMessageParam[]) =>
  chatCompletions(
    messages,
    "Ask the user to clarify on either the situation that is troubling them or their feelings."
  ),

  async (messages: ChatCompletionMessageParam[]) => {
    const suicidal = await isSuicidal(
      messages.findLast((m) => m.role === 'user')?.content || ''
    )
    if (suicidal) {
      return chatCompletions(
        messages,
        "just say I'm really sorry to hear that but I am unable to provide the help that you need. Please seek professional help or reach out to someone you trust for support."
      )
    } else {
      return chatCompletions(
        messages,
        "In 3 sentences, empathize with the user's feelings and situation. Do not offer solutions. Afterwards, ask one question to gather more information on the user's situation.'")
    }
  },
  
  (messages: ChatCompletionMessageParam[]) =>
    chatCompletions(
      messages,
      "In 4 sentences, empathize with the user. Then, encourage the user to elaborate on their situation and feelings with an open-ended question. Do not repeat questions asked before."
    ),
    (messages: ChatCompletionMessageParam[]) =>
    chatCompletions(
      messages,
      "In 3 sentences, verbalize the user's emotions in second person perspective. Afterwards, ask one question to gather more information on the user's situation. Do not repeat questions asked before."
    ),

    async (messages: ChatCompletionMessageParam[]) =>
    new Promise(async (resolve,  reject)=>{
    
      const gptResponse = await chatCompletions(
        messages,
        "In 2 sentences, empathize with the client's emotional and cognitive frame of reference."
      )

      const gptResponse2 = await chatCompletions(
        messages,
        "In second person perspective, summarise the user's situation and feelings by highlighting the key ideas and the problems they're facing. Afterwards, ask the user if they think your judgement is correct."
      )
    
      resolve([gptResponse,gptResponse2] as any )
       }),

    (messages: ChatCompletionMessageParam[]) =>
    chatCompletions(
      messages,
      "Based on the whole conversation, summarise the user's feelings and situation. Afterwards, ask them if they want to try a 'Cognitive Restructuring' exercise to help."
    ),
/////////////////////////

  (messages: ChatCompletionMessageParam[]) =>
    chatCompletions(
      messages,
      "Summarise into the user's thoughts into absolute statements in second person perspective. Each statement must not be longer than 100 characters. Present it in a numbered list like this:[So it seems like these are your your reasons: {Insert numbered list}. Is that correct?]"
    ),

  async (messages: ChatCompletionMessageParam[]) => new Promise((resolve,  reject)=>{
    resolve({choices:[{message:{content:"Well done! You've identified some 'automatic thoughts' that pop into your head in response to the situation. These automatic thoughts are likely to be the causes of your negative emotions. Now, I want you to choose a thought from the list that is MOST responsible for your negative emotions so we can examine it further together."}}]} as any )
     }),

  (messages: ChatCompletionMessageParam[]) =>
    chatCompletions(
      messages,
      "Fill in this statment: [Great job identifying the strongest automatic thought for us to look at. Remember, our thoughts are not always helpful, so let's work together to rethink this thought into something more constructive! Tell me, what are the effects of you continuing to believe {chosen thought}?]"
    ),

async (messages: ChatCompletionMessageParam[]) => new Promise((resolve,  reject)=>{
    resolve({choices:[{message:{content:'And what are the effects if you stop believing in this thought?'}}]} as any )
     }),

  (messages: ChatCompletionMessageParam[]) =>
    chatCompletions(
      messages,
      'Fill in this statement:[Very often, we can be too focused on the problem that we forget about the positives. Are there some positives about the situation or about yourself that were ignored? Are there evidence that refutes {chosen thought}?]'
    ),
    
  async (messages: ChatCompletionMessageParam[]) => new Promise((resolve,  reject)=>{
    resolve({choices:[{message:{content:"Well done! Next step, I want you to think what's the worst that could happen? From 0-100, how likely is this worst possible outcome?"}}]} as any )
     }),  

  (messages: ChatCompletionMessageParam[]) =>
    chatCompletions(
      messages,
      "In 2 sentences, empathize with the user's worst possible outcome. Afterwards, say'Remember that sometimes our minds focus too much on the negative because it wants us to change things for the better. What change do you hope for in this case? What's the best case scenario?'"
    ),

async (messages: ChatCompletionMessageParam[]) => new Promise((resolve,  reject)=>{
    resolve({choices:[{message:{content:'And finally, how can you achieve this?'}}]} as any )
     }),

  (messages: ChatCompletionMessageParam[]) =>
    chatCompletions(
      messages,
      "Fill in: [Well done {username}, I'm so proud of you for answering these questions! Having answered a few of these questions, you may find that you already feel better. To get the most benefit though, I want you to try combining everything you said into a thought that gives you confidence to move forward. For example: {combine everything the user said into a thought that gives them the confidence to move forward. For example 'I always fail at relationships' can turn into something like: 'I am kind and thoughtful, so I really want to have a successful relationship.'}. Now you try!]"
    ),

  (messages: ChatCompletionMessageParam[]) =>
    chatCompletions(
      messages,
      'Fill in:[When we started out you were feeling {insert user feeling} because of your belief that {insert user automatic thought}.You realised that it was not helping and replaced it with a new thought: {insert user thought}. Rethinking stuff sounds simple but is really difficult to do. You should feel proud of yourself for completing this exercise! Thank you for chatting with me and have wonderful day :)]'
    )

]

export default getGptResponse
