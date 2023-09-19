import { Survey } from '../schema/survey'
import { client } from './client'
// export async function getPreChatSurvey() {
//   // Get the preChatSurvey from Sanity
//   // Return the preChatSurvey
//   const preChatSurvey = (await client.fetch(
//     `*[_type == "preChatSurvey"]`
//   )) as Question[]

//   return preChatSurvey
// }
// export async function getPostChatSurvey() {
//   // Get the postChatSurvey from Sanity
//   // Return the postChatSurvey
//   const postChatSurvey = (await client.fetch(
//     `*[_type == "postChatSurvey"]`
//   )) as Question[]

//   return postChatSurvey
// }

export async function getSurvey() {
  const surveys = (await client.fetch(`*[_type == "survey"]`)) as Survey[]
  return surveys
}
