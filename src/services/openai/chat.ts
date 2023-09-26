import { ChatCompletionMessageParam } from '@/components/Chat'
import openai, { chatCompletions } from '.'
import { isSuicidal } from './helper'

// Templates


// Static message
// async (messages: ChatCompletionMessageParam[]) => new Promise((resolve,  reject)=>{
//      resolve({choices:[{message:{content:'Sorry'}}]} as any )
//    }),

//////// Text Davinci
//   const user = messages.findLast(m=>m.role==='user')?.content
      // const rephrased = await openai.completions.create({
      //   model:'text-davinci-002',
      //   prompt: `rephrase this statement : ${user}`,
      //   temperature:0.7,
      //   max_tokens : 200
      // })
      // return {choices:[{message:{content:rephrased}}]}
      // },

//////// Normal GPT
// (messages: ChatCompletionMessageParam[]) =>
//     chatCompletions(
//       messages,
//       "say 'Great job identifying the strongest automatic thought for us to look at. Remember, our thoughts are not always helpful, so let's work together to rethink this thought into something more constructive!'"```
//     ),





const getGptResponse = async (messages: ChatCompletionMessageParam[]) => {
  const currentMessage = messages
    .filter((m) => m.role === 'user')
    .findLastIndex((message) => message.role === 'user')
  const response = await RESPONSES[currentMessage](messages)

  return (response as any).choices[0].message.content
}

const RESPONSES = [
  (messages: ChatCompletionMessageParam[]) =>
    chatCompletions(
      messages,
      'ask to describe their emotions. ask about What happened? What events led you to feel these negative emotions today? Please be as specific as possible.'
    ),

  async (messages: ChatCompletionMessageParam[]) => {
    if (
      await isSuicidal(
        messages.findLast((m) => m.role === 'user')?.content || ''
      )
    ) {
      return chatCompletions(
        messages,
        "just say I'm really sorry to hear that but I am unable to provide the help that you need. Please seek professional help or reach out to someone you trust for support."
      )
    } else {
      return chatCompletions(
        messages,
        "In 3 sentences or less, empathize with the user's feelings and situation. Do not offer solutions. and ask to try a CBT exercise together to see if it helps feel better! Also ask to list out some automatic thoughts or images that come to mind when this event happened."
      )
    }
  },

  async (messages: ChatCompletionMessageParam[]) =>{
  
  const user = messages.findLast(m=>m.role==='user')?.content
    const rephrased = await openai.completions.create({
      model:'text-davinci-002',
      prompt: ` rephrase this statement : ${user}`,
      temperature:0.7,
      max_tokens : 200
    })
    return {choices:[{message:{content:rephrased}}]}
  },

  (messages: ChatCompletionMessageParam[]) =>
    chatCompletions(
      messages,
      'congratualte or say WEll done!. then ask them to choose a thought that is MOST responsible for the negative emotions.'
    ),

  (messages: ChatCompletionMessageParam[]) =>
    chatCompletions(
      messages,
      "say 'Great job identifying the strongest automatic thought for us to look at. Remember, our thoughts are not always helpful, so let's work together to rethink this thought into something more constructive!'"
    ),
  (messages: ChatCompletionMessageParam[]) =>
    chatCompletions(
      messages,
      'ask "Tell me, what are the effects of you continuing to believe that  selected_thought"'
    ),
  (messages: ChatCompletionMessageParam[]) =>
    chatCompletions(
      messages,
      "ask 'And what are the effects if you don't believe this thought?'"
    ),
  (messages: ChatCompletionMessageParam[]) =>
    chatCompletions(
      messages,
      "say 'Very often, we can be too focused on the problem that we forget about the positives. Are there some positives about the situation or about yourself that were ignored? Are there evidence that refutes your belief that + selected_thought)'"
    ),

  (messages: ChatCompletionMessageParam[]) =>
    chatCompletions(
      messages,
      "say 'Well done! Next step, I want you to think about what's the worst that could happen?'"
    ),

  (messages: ChatCompletionMessageParam[]) =>
    chatCompletions(
      messages,
      'ask to Rate how likely this is to happen from 0-100%'
    ),
  (messages: ChatCompletionMessageParam[]) =>
    chatCompletions(
      messages,
      "say 'Sometimes our minds focus too much on the negative because it wants us to change things for the better. What change do you hope for in this case? What's the best case scenario?'"
    ),
  (messages: ChatCompletionMessageParam[]) =>
    chatCompletions(messages, 'And finally, how can you achieve this?'),
  (messages: ChatCompletionMessageParam[]) =>
    chatCompletions(
      messages,
      "'Well done {username}, I'm so proud of you for answering these questions! Having answered a few of these questions, you may find that you already feel better. To get the most benefit though, I want you to try combining everything you said into a thought that gives you confidence to move forward. For example,'I always fail at relationships' can turn into something like: 'I am kind and thoughtful, so I really want to have a successful relationship.'"
    ),
  (messages: ChatCompletionMessageParam[]) =>
    chatCompletions(
      messages,
      'conclude and say Good job username. When we started out you were feeling bad because of your belief that selected_thought.You realised that it was not helping and replaced it with a new response: alternative_response. Rethinking stuff sounds simple but is really difficult to do. You should feel proud of yourself for completing this exercise!'
    )
]

export default getGptResponse
