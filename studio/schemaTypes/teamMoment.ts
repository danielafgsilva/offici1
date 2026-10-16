import {defineArrayMember, defineField, defineType} from 'sanity'
import {ImagesIcon} from '@sanity/icons/Images'

export const teamMoment = defineType({
  name: 'teamMoment',
  title: 'Momento da equipa',
  type: 'document',
  icon: ImagesIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Título',
      description: 'O que foi, em poucas palavras. Ex.: Jantar de Natal.',
      type: 'string',
      validation: (rule) => rule.required().max(60),
    }),
    defineField({name: 'year', title: 'Ano', description: 'Opcional. Ex.: 2025.', type: 'string'}),
    defineField({
      name: 'category',
      title: 'Tipo',
      description: 'Opcional.',
      type: 'string',
      options: {list: ['Convívio', 'Celebração', 'Formação', 'Team building', 'Viagem', 'No gabinete']},
    }),
    defineField({
      name: 'description',
      title: 'Texto',
      description: 'Opcional. Uma ou duas frases.',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'images',
      title: 'Fotografias',
      description:
        'Fotografias reais. Confirme que todas as pessoas autorizam a publicação. As duas primeiras do primeiro momento aparecem também na página inicial.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'image',
          options: {hotspot: true},
          fields: [
            defineField({
              name: 'alt',
              title: 'Legenda',
              description: 'Aparece por baixo da fotografia. Diga o que é e onde foi tirada, sem nomear pessoas.',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'whole',
              title: 'Mostrar inteira',
              description: 'Ligue para a fotografia aparecer sem cortes (por exemplo, uma fotografia com moldura). Desligado, é ajustada ao cartão.',
              type: 'boolean',
              initialValue: false,
            }),
          ],
        }),
      ],
      validation: (rule) => rule.required().min(1).max(8),
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
  preview: {select: {title: 'title', subtitle: 'year', media: 'images.0'}},
})
