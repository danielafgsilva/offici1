import {defineField, defineType} from 'sanity'
import {UsersIcon} from '@sanity/icons/Users'

const verified = defineField({
  name: 'verified',
  title: 'Confirmado',
  description:
    'Desligado = exemplo. No site aparece como «exemplo, por confirmar». Ligue só depois de o cliente autorizar que o nome (e o depoimento) aparece no site.',
  type: 'boolean',
  initialValue: false,
})

const order = defineField({
  name: 'order',
  title: 'Ordem',
  description: 'Números mais baixos aparecem primeiro.',
  type: 'number',
  initialValue: 10,
})

// A company the firm works for, shown on "Sobre nós"
export const client = defineType({
  name: 'client',
  title: 'Cliente',
  type: 'document',
  icon: UsersIcon,
  fields: [
    verified,
    defineField({name: 'name', title: 'Nome', type: 'string', validation: (rule) => rule.required()}),
    defineField({
      name: 'sector',
      title: 'Setor',
      description: 'Opcional. Ex.: Restauração.',
      type: 'string',
    }),
    defineField({
      name: 'logo',
      title: 'Logótipo',
      description: 'Opcional, de preferência SVG ou PNG com fundo transparente. Sem logótipo, o nome aparece em texto.',
      type: 'image',
    }),
    order,
  ],
  orderings: [{title: 'Ordem', name: 'order', by: [{field: 'order', direction: 'asc'}]}],
  preview: {
    select: {name: 'name', verified: 'verified', sector: 'sector', media: 'logo'},
    prepare: ({name, verified, sector, media}) => ({title: `${verified ? '' : '[EXEMPLO] '}${name}`, subtitle: sector, media}),
  },
})

// What a client says about the firm, shown on "Sobre nós" and "Serviços"
export const testimonial = defineType({
  name: 'testimonial',
  title: 'Depoimento',
  type: 'document',
  fields: [
    verified,
    defineField({
      name: 'quote',
      title: 'Depoimento',
      description: 'Até três linhas, nas palavras do cliente, e só com a sua autorização.',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required().max(280),
    }),
    defineField({name: 'author', title: 'Quem disse', type: 'string', validation: (rule) => rule.required()}),
    defineField({
      name: 'photo',
      title: 'Fotografia',
      description: 'Opcional, e só com a autorização da pessoa. Sem fotografia, o cartão mostra a inicial do nome.',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({name: 'company', title: 'Empresa ou função', type: 'string'}),
    order,
  ],
  orderings: [{title: 'Ordem', name: 'order', by: [{field: 'order', direction: 'asc'}]}],
  preview: {
    select: {title: 'author', quote: 'quote', verified: 'verified'},
    prepare: ({title, quote, verified}) => ({title: `${verified ? '' : '[EXEMPLO] '}${title}`, subtitle: quote}),
  },
})
