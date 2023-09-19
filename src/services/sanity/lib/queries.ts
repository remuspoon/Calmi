import { Question } from '../schema/preChatSurvey'
import { client } from './client'
export async function getPreChatSurvey() {
  // Get the preChatSurvey from Sanity
  // Return the preChatSurvey
  const preChatSurvey = (await client.fetch(
    `*[_type == "preChatSurvey"]{label, Type, question, mcqOptions}`
  )) as Question[]

  return preChatSurvey
}
export async function getPostChatSurvey() {
  // Get the postChatSurvey from Sanity
  // Return the postChatSurvey
  const postChatSurvey = (await client.fetch(
    `*[_type == "postChatSurvey"]{label, Type, question, mcqOptions}`
  )) as Question[]

  return postChatSurvey
}
