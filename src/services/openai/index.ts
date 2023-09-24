import { ChatCompletionMessageParam } from '@/components/Chat'
import OpenAI from 'openai'
const openAi = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})
export const chatCompletions = (
  messages: ChatCompletionMessageParam[],
  systemMessage?: string
) =>
  openAi.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: systemMessage
      ? [...messages, { role: 'system', content: systemMessage }]
      : messages,
    max_tokens: 150,
    temperature: 0.7
  })
export default openAi
