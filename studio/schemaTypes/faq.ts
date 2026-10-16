import {defineField, defineType} from 'sanity'
import {HelpCircleIcon} from '@sanity/icons/HelpCircle'

export const faq = defineType({
  name: 'faq',
  title: 'Pergunta frequente',
  type: 'document',
  icon: HelpCircleIcon,
  fields: [
    defineField({
      name: 'question',
      title: 'Pergunta',
      description: 'Como um cliente a faria. Ex.: Posso mudar de contabilista a meio do ano?',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'answer',
      title: 'Resposta',
      description: 'Curta e direta, em duas ou três frases. Apenas o que o gabinete realmente faz.',
      type: 'text',
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Ordem',
      description: 'Números mais baixos aparecem primeiro.',
      type: 'number',
      initialValue: 10,
    }),
  ],
  orderings: [{title: 'Ordem', name: 'order', by: [{field: 'order', direction: 'asc'}]}],
  preview: {select: {title: 'question', subtitle: 'answer'}},
})
