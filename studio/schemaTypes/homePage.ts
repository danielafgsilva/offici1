import {defineField, defineType} from 'sanity'
import {HomeIcon} from '@sanity/icons/Home'

export const homePage = defineType({
  name: 'homePage',
  title: 'Página inicial',
  type: 'document',
  icon: HomeIcon,
  groups: [
    {name: 'hero', title: 'Topo da página', default: true},
    {name: 'cta', title: 'Apelo ao contacto'},
    {name: 'seo', title: 'Google e redes sociais'},
  ],
  fields: [
    defineField({
      name: 'heroTitle',
      title: 'Título principal',
      description: 'A frase mais importante do site. A resposta, logo abaixo, são os nomes da equipa.',
      type: 'string',
      group: 'hero',
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: 'heroText',
      title: 'Texto de apresentação',
      description: 'Duas ou três frases: o que fazemos, para quem e o que nos distingue.',
      type: 'text',
      rows: 4,
      group: 'hero',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'ctaTitle',
      title: 'Título',
      description: 'Aparece na faixa azul, no fim da página inicial e das outras páginas.',
      type: 'string',
      group: 'cta',
    }),
    defineField({name: 'ctaText', title: 'Texto', type: 'text', rows: 3, group: 'cta'}),
    defineField({name: 'seo', type: 'seo', group: 'seo'}),
  ],
  preview: {prepare: () => ({title: 'Página inicial'})},
})
