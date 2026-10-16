import {defineArrayMember, defineField, defineType} from 'sanity'
import {CaseIcon} from '@sanity/icons/Case'

export const service = defineType({
  name: 'service',
  title: 'Serviço',
  type: 'document',
  icon: CaseIcon,
  fields: [
    defineField({name: 'title', title: 'Título', type: 'string', validation: (rule) => rule.required()}),
    defineField({
      name: 'slug',
      title: 'Endereço da página',
      description:
        'A parte final do endereço, por exemplo "fiscalidade" em offici1.pt/servicos/fiscalidade. Clique em "Generate" para criar a partir do título. Evite alterar depois de publicado: as ligações antigas deixam de funcionar.',
      type: 'slug',
      options: {source: 'title'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'icon',
      title: 'Ícone',
      description: 'Usado na página Serviços e na página inicial. Se ficar vazio, o site escolhe um ícone adequado.',
      type: 'string',
      options: {
        list: [
          {title: 'Caderno (contabilidade)', value: 'notebook'},
          {title: 'Percentagem (fiscalidade)', value: 'percent'},
          {title: 'Pessoas (salários)', value: 'users'},
          {title: 'Loja (constituição de empresas)', value: 'storefront'},
          {title: 'Gráfico (gestão)', value: 'chart'},
          {title: 'Balança (jurídico)', value: 'scales'},
          {title: 'Aperto de mão (consultoria)', value: 'handshake'},
          {title: 'Portátil (digital)', value: 'laptop'},
          {title: 'Recibo (faturação)', value: 'receipt'},
          {title: 'Pasta (outros)', value: 'briefcase'},
        ],
      },
    }),
    defineField({
      name: 'summary',
      title: 'Resumo',
      description: 'Uma frase curta, do ponto de vista do cliente. Usada nas listagens.',
      type: 'string',
      validation: (rule) => rule.required().max(120),
    }),
    defineField({
      name: 'description',
      title: 'O que é',
      description: 'Em linguagem simples, sem termos técnicos por explicar.',
      type: 'text',
      rows: 4,
    }),
    defineField({name: 'audience', title: 'Para quem', type: 'text', rows: 3}),
    defineField({name: 'problem', title: 'O que resolve', type: 'text', rows: 3}),
    defineField({
      name: 'includes',
      title: 'Como apoiamos',
      description: 'Uma linha por tarefa. Explique os termos técnicos na própria linha.',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
    }),
    defineField({
      name: 'related',
      title: 'Serviços relacionados',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'service'}]})],
      validation: (rule) => rule.max(2),
    }),
    defineField({name: 'seo', type: 'seo'}),
    defineField({
      name: 'order',
      title: 'Ordem',
      description: 'Números mais baixos aparecem primeiro.',
      type: 'number',
      initialValue: 10,
    }),
  ],
  orderings: [{title: 'Ordem', name: 'order', by: [{field: 'order', direction: 'asc'}]}],
  preview: {select: {title: 'title', subtitle: 'summary'}},
})
