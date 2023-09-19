import { defineField, defineType } from 'sanity'

const Schema = defineType({
  name: 'postChatSurvey',
  title: 'Post Chat Survey',
  type: 'document',
  fields: [
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
          { title: 'Text', value: 'text' },
          { title: 'MCQ', value: 'mcq' }
        ]
      },
      validation: (Rule) => Rule.required()
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
