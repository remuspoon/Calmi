import { defineField, defineType } from 'sanity'

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
export const initialValue = {
  type: 'short',
  required: false
}

const Schema = defineType({
  name: 'preChatSurvey',
  title: 'Pre Chat Survey',
  type: 'document',
  fields: QuestionFields,
  initialValue
})

export default Schema
