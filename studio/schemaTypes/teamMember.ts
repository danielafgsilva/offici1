import {defineField, defineType} from 'sanity'
import {UserIcon} from '@sanity/icons/User'

export const teamMember = defineType({
  name: 'teamMember',
  title: 'Membro da equipa',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({
      name: 'verified',
      title: 'Dados confirmados',
      description:
        'Desligado = texto de exemplo. No site a página da pessoa aparece marcada como «Exemplo, por confirmar» e a função não aparece na página inicial. Ligue só depois de a pessoa confirmar o que está escrito.',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({name: 'name', title: 'Nome', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'role', title: 'Função', type: 'string', validation: (rule) => rule.required()}),
    defineField({
      name: 'qualification',
      title: 'Qualificação profissional',
      description: 'Opcional. Ex.: Contabilista Certificada. Indique apenas qualificações reais.',
      type: 'string',
    }),
    defineField({
      name: 'photo',
      title: 'Fotografia',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Descrição da fotografia',
          description: 'Opcional. Se ficar em branco, usamos "Retrato de" seguido do nome.',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'bio',
      title: 'Apresentação',
      description:
        'Duas ou três frases sobre quem é, a experiência que tem e como acompanha os clientes. Opcional.',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'since',
      title: 'Na Offici’um',
      description: 'Há quanto tempo, pelas suas palavras. Ex.: Desde 2012.',
      type: 'string',
    }),
    defineField({
      name: 'speciality',
      title: 'Especialidade',
      description: 'Opcional. O assunto em que mais ajuda os clientes. Ex.: IVA e IRC.',
      type: 'string',
    }),
    defineField({
      name: 'background',
      title: 'Percurso profissional',
      description: 'Opcional. Formação e experiência anterior, em duas ou três frases. Apenas factos reais.',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'quote',
      title: 'Uma frase sua',
      description: 'Opcional. Uma frase na voz da pessoa, sobre o trabalho ou sobre os clientes. Aparece em destaque.',
      type: 'string',
      validation: (rule) => rule.max(140),
    }),
    defineField({
      name: 'answers',
      title: 'Três perguntas rápidas',
      description: 'Opcional. Respostas curtas e pessoais. Ex.: «O que mais gosto no trabalho» ou «O que faço ao fim de semana».',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'answer',
          fields: [
            defineField({name: 'question', title: 'Pergunta', type: 'string', validation: (rule) => rule.required()}),
            defineField({name: 'answer', title: 'Resposta', type: 'text', rows: 2, validation: (rule) => rule.required()}),
          ],
          preview: {select: {title: 'question', subtitle: 'answer'}},
        },
      ],
      validation: (rule) => rule.max(4),
    }),
    defineField({
      name: 'personalNote',
      title: 'Um detalhe pessoal',
      description: 'Opcional, e só com a autorização da pessoa. Ex.: Corre a meia maratona do Porto todos os anos.',
      type: 'string',
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
  preview: {
    select: {name: 'name', role: 'role', verified: 'verified', media: 'photo'},
    prepare: ({name, role, verified, media}) => ({title: name, subtitle: `${verified ? '' : '[EXEMPLO] '}${role ?? ''}`, media}),
  },
})
