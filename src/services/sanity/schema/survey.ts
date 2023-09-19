import { defineType, defineField } from 'sanity'

export type Sanitymeta = {
  _createdAt: string
  _id: string
  _rev: string
  _type: string
  _updatedAt: string
}

export type Question = {
  label: string
  type: string
  question: string
  options?: string[]
}

export const QuestionFields = [
  defineField({
    name: 'label',
    title: 'Label',
    type: 'string',
    validation: (Rule) => Rule.required()
  }),
  defineField({
    name: 'type',
    title: 'Type',
    type: 'string',
    options: {
      list: [
        { title: 'Short Text', value: 'short' },
        { title: 'Descriptive Text', value: 'long' },
        { title: 'Single Select', value: 'radio' },
        { title: 'Multiple Select', value: 'select' }
      ]
    },
    validation: (Rule) => Rule.required()
  }),
  defineField({
    name: 'question',
    title: 'Question',
    type: 'string',
    validation: (Rule) => Rule.required()
  }),
  defineField({
    name: 'required',
    title: 'Required',
    type: 'boolean'
  }),
  // Add fields for MCQ options
  defineField({
    name: 'options',
    title: 'Options',
    type: 'array',
    of: [
      {
        type: 'string',
        name: 'option',
        title: 'Option'
      }
    ]
  })
]
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

export type Survey = Sanitymeta & {
  title: 'preChatSurvey' | 'postChatSurvey'
  questions: Question[]
}

export default Schema
