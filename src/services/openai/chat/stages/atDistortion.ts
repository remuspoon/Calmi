import { RESPONSE_TYPE } from '..'
import { staticResponse, userAffirmed,lastbotanduser } from '../../helper'
import { chatCompletions } from '../..'


const EXERCISE: RESPONSE_TYPE | RESPONSE_TYPE[] = [
  {response: async (messages) => {
    const gptResponse = (await chatCompletions(
      messages,
      'Ask the user: [What are some automatic thoughts they have during their situation?].'
    )) as string

    const res = staticResponse([gptResponse, "I want you to list out as many reasons why this might make you feel upset."])()
    return res
  },
},

{response: async (messages) => {
  const gptResponse = (await chatCompletions(
    messages,
    "In 2 sentences, empathize with the user's automatic thoughts and situation."
  )) as string

  const res = staticResponse([gptResponse, "In an ideal world, how would you want the situation to be?"])()
  return res
},
},

{response: async (messages) => {
  const gptResponse = (await chatCompletions(
    messages,
    "In 5 sentences or less, suggest one cognitive distortion that applies to the user based on their automatic thoughts. Next, explain what the cognitive distortion is. State that this cognitive distortion might be preventing user's ideal situation from happening. Then, explain how the user is showing this cognitive distortion. Finish by asking the user if they think your judgement is correct."
  )) as string

  const res = staticResponse(["I think I've identified a cognitive distortion in your automatic thoughts.", 
  "A cognitive distortion is a biased or irrational way of thinking that can lead to inaccurate perceptions, false beliefs, or negative emotions. These distortions often reinforce negative thought patterns.",
  gptResponse])()
  return res
},

next: async (messages) => {
  const params = lastbotanduser(messages as any)
    const userAffirm = await userAffirmed(params)

  if (userAffirm) {
    return { token: 'crExercise'}
  } else {
    return { token: 'identifyDistortion' }
  }
}
},

]

export default EXERCISE
