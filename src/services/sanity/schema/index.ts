import { type SchemaTypeDefinition } from 'sanity'
import preChatSurvey from './preChatSurvey'
import postChatSurvey from './postChatSurvey'
import survey from './survey'

const schema: { types: SchemaTypeDefinition[] } = {
  types: [survey, preChatSurvey, postChatSurvey]
}

export default schema
