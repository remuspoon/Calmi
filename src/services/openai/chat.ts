import { ChatCompletionMessageParam } from '@/components/Chat'
import { chatCompletions } from '.'

const getGptResponse = async (messages: ChatCompletionMessageParam[]) => {
  const currentMessage = messages
    .filter((m) => m.role === 'user')
    .findLastIndex((message) => message.role === 'user')
  const response = await RESPONSES[currentMessage](messages)

  return response.choices[0].message.content
}

const RESPONSES = [
  (messages: ChatCompletionMessageParam[]) =>
    chatCompletions(messages, 'ask to describe their emotions')
]

export default getGptResponse
