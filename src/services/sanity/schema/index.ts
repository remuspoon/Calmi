import { type SchemaTypeDefinition } from 'sanity'
import preChatSurvey from './preChatSurvey'
import postChatSurvey from './postChatSurvey'

const schema: { types: SchemaTypeDefinition[] } = {
  types: [preChatSurvey, postChatSurvey]
}

export default schema
