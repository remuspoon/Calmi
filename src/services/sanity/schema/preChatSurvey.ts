import { defineField, defineType } from 'sanity'

const Schema = defineType({
  name: 'preChatSurvey',
  title: 'Pre Chat Survey',
  type: 'document',
  fields: [
    defineField({
      name: 'Type',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          { title: 'Text', value: 'text' },
          { title: 'MCQ', value: 'mcq' }
        ]
      }
    }),
    defineField({
      name: 'question',
      title: 'Question',
      type: 'string'
    }),
    // Add fields for MCQ options
    defineField({
      name: 'mcqOptions',
      title: 'MCQ Options',
      type: 'array',
      of: [
        {
          type: 'string',
          name: 'option',
          title: 'Option'
        }
      ],

      hidden: ({ document }) => document?.Type !== 'mcq'
    })
  ]
})

export default Schema
