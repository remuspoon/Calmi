import { defineField, defineType } from 'sanity'
import { QuestionFields, initialValue } from './preChatSurvey'

const Schema = defineType({
  name: 'postChatSurvey',
  title: 'Post Chat Survey',
  type: 'document',
  fields: QuestionFields,
  initialValue
})

export default Schema
