import OpenAI from 'openai'
import { ChatCompletionMessageParam } from './chat'
const openAi = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})
export const chatCompletions = async (
  messages: ChatCompletionMessageParam<'user'>[],
  systemMessage?: string
) => {
  const response = await openAi.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: systemMessage
      ? [...messages, { role: 'system', content: systemMessage }]
      : messages,
    max_tokens: 250,
    temperature: 0.7
  })
  return response.choices[0].message.content
}

export type ChatCompletionsResponse = ReturnType<typeof chatCompletions>
export default openAi
