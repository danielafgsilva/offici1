import {defineArrayMember, defineField, defineType} from 'sanity'
import {UsersIcon} from '@sanity/icons/Users'

const list = (name: string, title: string, description?: string) =>
  defineField({name, title, description, type: 'array', of: [defineArrayMember({type: 'string'})]})

export const jobOpening = defineType({
  name: 'jobOpening',
  title: 'Vaga',
  type: 'document',
  icon: UsersIcon,
  fields: [
    defineField({name: 'title', title: 'Título', type: 'string', validation: (rule) => rule.required()}),
    defineField({
      name: 'slug',
      title: 'Endereço da página',
      description: 'A parte final do endereço da vaga, por exemplo «assistente-de-contabilidade». Clique em «Generate». Evite alterar depois de publicada.',
      type: 'slug',
      options: {source: 'title'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Data de publicação',
      type: 'date',
      initialValue: () => new Date().toISOString().slice(0, 10),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'status',
      title: 'Estado',
      description: 'Só as vagas abertas aparecem no site. Para fechar uma vaga, escolha «Fechada» e publique.',
      type: 'string',
      options: {
        list: [
          {title: 'Aberta', value: 'open'},
          {title: 'Fechada', value: 'closed'},
        ],
        layout: 'radio',
      },
      initialValue: 'open',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'closingDate',
      title: 'Candidaturas até',
      description: 'Opcional. Depois deste dia a vaga deixa de aparecer no site, mesmo que continue «Aberta».',
      type: 'date',
    }),
    defineField({
      name: 'contractType',
      title: 'Tipo',
      description: 'Ex.: Estágio profissional, Tempo inteiro.',
      type: 'string',
    }),
    defineField({
      name: 'location',
      title: 'Local',
      description: 'Ex.: Vila Nova de Gaia.',
      type: 'string',
      initialValue: 'Vila Nova de Gaia',
    }),
    defineField({
      name: 'workModel',
      title: 'Regime',
      description: 'Opcional. Indique apenas o que o gabinete realmente oferece.',
      type: 'string',
      options: {list: ['Presencial', 'Híbrido', 'Remoto']},
    }),
    defineField({
      name: 'summary',
      title: 'Resumo',
      description: 'Uma ou duas frases. Aparece sempre, logo abaixo do título.',
      type: 'text',
      rows: 2,
      validation: (rule) => rule.max(240),
    }),
    defineField({
      name: 'description',
      title: 'Descrição',
      description: 'O contexto da vaga. Aparece ao abrir os detalhes.',
      type: 'text',
      rows: 5,
    }),
    list('responsibilities', 'O que vai fazer'),
    list('requirements', 'Requisitos'),
    list('offer', 'O que oferecemos', 'Opcional. Apenas o que é garantido.'),
    defineField({
      name: 'order',
      title: 'Ordem',
      description: 'Números mais baixos aparecem primeiro.',
      type: 'number',
      initialValue: 10,
    }),
  ],
  orderings: [{title: 'Ordem', name: 'order', by: [{field: 'order', direction: 'asc'}]}],
  preview: {
    select: {title: 'title', status: 'status', contractType: 'contractType'},
    prepare: ({title, status, contractType}) => ({
      title,
      subtitle: [status === 'open' ? 'Aberta' : 'Fechada', contractType].filter(Boolean).join(' · '),
    }),
  },
})
