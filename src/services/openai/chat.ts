import { ChatCompletionMessageParam } from '@/components/Chat'
import { chatCompletions } from '.'

const getGptResponse = async (messages: ChatCompletionMessageParam[]) => {
  const currentMessage = messages.findLastIndex(
    (message) => message.role === 'user'
  )
  console.log('hey')
  const response = await RESPONSES[currentMessage](messages)

  return response.choices[0].message.content
}

const RESPONSES = [
  (messages: ChatCompletionMessageParam[]) =>
    chatCompletions(messages, 'ask to describe their emotions')
]

export default getGptResponse
