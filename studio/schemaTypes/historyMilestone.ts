import {defineField, defineType} from 'sanity'
import {CalendarIcon} from '@sanity/icons/Calendar'

export const historyMilestone = defineType({
  name: 'historyMilestone',
  title: 'Momento da história',
  type: 'document',
  icon: CalendarIcon,
  fields: [
    defineField({
      name: 'year',
      title: 'Ano',
      description: 'Aparece em grande na página Sobre nós. Ex.: 2004. Só datas confirmadas.',
      type: 'string',
      validation: (rule) => rule.required().max(12),
    }),
    defineField({
      name: 'verified',
      title: 'Facto confirmado',
      description:
        'Desligado = texto de exemplo. No site aparece marcado como «Exemplo, por confirmar». Ligue só depois de confirmar o facto com o gabinete e de escrever o texto real.',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'kind',
      title: 'Tipo de momento',
      description: 'Opcional. Aparece como etiqueta discreta por cima do título.',
      type: 'string',
      options: {
        list: [
          {title: 'Fundação', value: 'Fundação'},
          {title: 'Nome original', value: 'Nome original'},
          {title: 'Primeiras instalações', value: 'Primeiras instalações'},
          {title: 'Crescimento', value: 'Crescimento'},
          {title: 'Aumento da equipa', value: 'Aumento da equipa'},
          {title: 'Mudança de instalações', value: 'Mudança de instalações'},
          {title: 'Mudança de nome', value: 'Mudança de nome'},
          {title: 'Reestruturação', value: 'Reestruturação'},
          {title: 'Nova geração', value: 'Nova geração'},
          {title: 'Transformação digital', value: 'Transformação digital'},
          {title: 'Instalações atuais', value: 'Instalações atuais'},
        ],
      },
    }),
    defineField({
      name: 'title',
      title: 'Título',
      description: 'O que aconteceu, numa frase curta. Ex.: Mudámos para a Av. da República.',
      type: 'string',
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: 'description',
      title: 'Texto',
      description: 'Duas ou três frases. Apenas factos que o gabinete confirma.',
      type: 'text',
      rows: 4,
      validation: (rule) => rule.max(300).warning('Mais de 300 caracteres fica comprido na linha do tempo.'),
    }),
    defineField({
      name: 'image',
      title: 'Fotografia ou documento',
      description: 'Opcional. De preferência material da época: o primeiro escritório, a equipa, um documento, o logótipo antigo.',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Legenda',
          description: 'Aparece por baixo da imagem. Diga o que é, onde e quando, sem nomear pessoas.',
          type: 'string',
          validation: (rule) =>
            rule.custom((alt, context) =>
              (context.parent as {asset?: unknown})?.asset && !alt ? 'Escreva uma legenda para a imagem.' : true,
            ),
        }),
      ],
    }),
    defineField({
      name: 'order',
      title: 'Ordem',
      description: 'Números mais baixos aparecem primeiro. Use o próprio ano para manter a ordem cronológica.',
      type: 'number',
      validation: (rule) => rule.required(),
    }),
  ],
  orderings: [{title: 'Ordem', name: 'order', by: [{field: 'order', direction: 'asc'}]}],
  preview: {
    select: {year: 'year', title: 'title', verified: 'verified', media: 'image'},
    prepare: ({year, title, verified, media}) => ({
      title: year,
      subtitle: `${verified ? '' : '[EXEMPLO] '}${title ?? ''}`,
      media,
    }),
  },
})
