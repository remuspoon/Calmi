import { defineType, defineField } from 'sanity'
import { QuestionFields } from './preChatSurvey'

const Schema = defineType({
  name: 'survey',
  title: 'Survey',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => [Rule.required()],
      options: {
        list: [
          { title: 'Pre Chat Survey', value: 'preChatSurvey' },
          { title: 'Post Chat Survey', value: 'postChatSurvey' }
        ]
      }
    },
    {
      name: 'questions',
      title: 'Questions',
      type: 'array',
      of: [
        {
          name: 'question',
          title: 'Question',
          type: 'document',
          fields: QuestionFields
        }
      ]
    }
  ]
})

export default Schema
