import { ChatCompletionMessageParam } from '@/components/Chat'
import { chatCompletions } from '.'

const getGptResponse = async (messages: ChatCompletionMessageParam[]) => {
  const currentMessage = messages.findLastIndex(
    (message) => message.role === 'user'
  )
  // console.log('messages', messages)
  // console.log('cm', currentMessage)
  const response = await chatCompletions(
    messages,
    'ask to describe their emotions'
  )
  console.log('response', response)
  return response.choices[0].message.content
}

const RESPONSES = [
  (messages: ChatCompletionMessageParam[]) =>
    chatCompletions(messages, 'ask to describe their emotions')
]

export default getGptResponse
