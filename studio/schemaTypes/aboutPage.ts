import {defineArrayMember, defineField, defineType} from 'sanity'
import {InfoOutlineIcon} from '@sanity/icons/InfoOutline'

export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'Sobre nós',
  type: 'document',
  icon: InfoOutlineIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Título',
      type: 'string',
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: 'intro',
      title: 'A nossa história',
      description: 'Quem somos, desde quando e como trabalhamos. Separe os parágrafos com uma linha em branco.',
      type: 'text',
      rows: 8,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Fotografia',
      description: 'Opcional. Uma fotografia larga. A descrição aparece como legenda, por isso diga onde foi tirada.',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Descrição da fotografia',
          description: 'Para quem não vê a imagem. Diga quem ou o que aparece, sem repetir o texto da página.',
          type: 'string',
          validation: (rule) =>
            rule.custom((alt, context) =>
              (context.parent as {asset?: unknown})?.asset && !alt
                ? 'Descreva a fotografia para quem não a consegue ver.'
                : true,
            ),
        }),
      ],
    }),
    defineField({
      name: 'principles',
      title: 'Como trabalhamos',
      description: 'Três ou quatro compromissos concretos com os clientes.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'principle',
          title: 'Compromisso',
          fields: [
            defineField({name: 'title', title: 'Título', type: 'string', validation: (rule) => rule.required()}),
            defineField({name: 'text', title: 'Texto', type: 'text', rows: 3, validation: (rule) => rule.required()}),
          ],
        }),
      ],
      validation: (rule) => rule.max(4),
    }),
    defineField({
      name: 'continuity',
      title: 'O que mudou e o que ficou',
      description:
        'Fecha a história na página Sobre nós. Cada linha é um tema e o que lhe aconteceu. Ex.: «A tecnologia» / «mudou.»; «A relação com os clientes» / «continua pessoal.»',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'continuityItem',
          title: 'Linha',
          fields: [
            defineField({name: 'subject', title: 'Tema', type: 'string', validation: (rule) => rule.required().max(40)}),
            defineField({
              name: 'statement',
              title: 'O que aconteceu',
              type: 'string',
              validation: (rule) => rule.required().max(60),
            }),
          ],
          preview: {select: {title: 'subject', subtitle: 'statement'}},
        }),
      ],
      validation: (rule) => rule.max(6),
    }),
    defineField({name: 'seo', type: 'seo'}),
  ],
  preview: {prepare: () => ({title: 'Sobre nós'})},
})
