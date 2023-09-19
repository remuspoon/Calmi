import { Question } from '../schema/preChatSurvey'
import { client } from './client'
export async function getPreChatSurvey() {
  // Get the preChatSurvey from Sanity
  // Return the preChatSurvey
  const preChatSurvey = (await client.fetch(
    `*[_type == "preChatSurvey"]`
  )) as Question[]

  console.log(preChatSurvey)

  return preChatSurvey
}
export async function getPostChatSurvey() {
  // Get the postChatSurvey from Sanity
  // Return the postChatSurvey
  const postChatSurvey = (await client.fetch(
    `*[_type == "postChatSurvey"]`
  )) as Question[]

  return postChatSurvey
}
