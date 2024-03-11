import 'server-only'

import openai, { chatCompletions } from '.'
import { ChatCompletionMessageParam } from './chat'

export const isSuicidal = async (text: string) => {
  const prompt = `Does this response suggest the person is suicidal, harmful to themselves or others, or in immediate risk of danger: ${text} \nAnswer either 'yes' or 'no'`

  const result = await openai.completions.create({
    model: 'gpt-3.5-turbo-instruct',
    prompt,
    temperature: 0
  })

  const response = result.choices[0].text
  return response.toLowerCase().includes('yes')
}

export const lastbotanduser = (
  messages: (
    | ChatCompletionMessageParam<'user'>
    | ChatCompletionMessageParam<'assistant'>
  )[]
) => {
  const user = messages[messages.length - 1].content
  let botR = ''
  let i = 2
  let bot = messages[messages.length - i]
  while (bot.role === 'assistant') {
    botR = bot.content + botR
    i++
    bot = messages[messages.length - i]
  }

  return [botR, user] as [string, string]
}

/*
 * @params: either a single string or array of strings of length 2:
 * 1: affirms to what eg: the bot
 * 2: the affirming eg: the user
 */
export const userAffirmed = async (text: string | [string, string]) => {
  let prompt = `Is the user's response affirmative: ${text} \nAnswer only 'yes' or 'no'`
  if (Array.isArray(text)) {
    prompt = `Is the user's response "${text[1]}" affirmative to the system's response "${text[0]}" \nAnswer only 'yes' or 'no'`
  }

  const result = await openai.completions.create({
    model: 'gpt-3.5-turbo-instruct',
    prompt,
    temperature: 0
  })

  const response = result.choices[0].text
  console.log(response);
  return response.toLowerCase().includes('yes')
}

export const isNotQuestion = async (text: string | [string, string]) => {
  let prompt = `Is the user's response a question: ${text} \nAnswer only 'yes' or 'no'`
  if (Array.isArray(text)) {
    prompt = `Is the user's response "${text[1]}" a question to this passage "${text[0]}"\nAnswer only 'yes' or 'no'`
  }

  const result = await openai.completions.create({
    model: 'gpt-3.5-turbo-instruct',
    prompt,
    temperature: 0
  })

  
  const response = result.choices[0].text
  console.log(response);
  return response.toLowerCase().includes('no')
}

export const ventOrAdvice = async (text: string | [string, string]) => {
  let prompt = `Does the user want to vent or are they looking for therapy exercise: "${text}" \nOnly answer 'vent' or 'therapy exercise'`
  if (Array.isArray(text)) {
    prompt = `Based on the user's response "${text[1]}" to this question "${text[0]}", does the user want to vent or are they looking for therapy exercise?  \nOnly answer 'vent' or 'therapy exercise'`
  }

  const result = await openai.completions.create({
    model: 'gpt-3.5-turbo-instruct',
    prompt,
    temperature: 0.7,
    max_tokens: 50

  })

  const response = result.choices[0].text
  console.log(response);
  return response.toLowerCase().includes('vent');
}

export const staticResponse = (content: string | string[]) => () =>
  Promise.resolve(content)

export const provideEmpathy = async (text: string) => {}

export const summariseTheCause = async (
  messages: ChatCompletionMessageParam<'user' | 'assistant' | 'system'>[]
) => {
  const filtered = messages.filter(
    (m) => m.role === 'user' || m.role === 'assistant'
  ) as ChatCompletionMessageParam<'user' | 'assistant'>[]

  const res = await chatCompletions(
    filtered,
    "Summarise the the conversation in less than 5 sentences and write in first person and past tense"
  )

  console.log('summariseTheCause', res)
  return res
}

export const rephrase = async (text: string) => {
  const res = await chatCompletions(
    [{ content: text, role: 'user', token: 'START', subtoken: 1 }],
    'Rephrase the user response properly and write it in first person'
  )
  return res
}
