import {defineField, defineType} from 'sanity'

export const seo = defineType({
  name: 'seo',
  title: 'Google e redes sociais',
  description: 'Opcional. Se deixar em branco, usamos o título e o texto da própria página.',
  type: 'object',
  options: {collapsible: true, collapsed: true},
  fields: [
    defineField({
      name: 'title',
      title: 'Título nos resultados do Google',
      type: 'string',
      validation: (rule) => rule.max(60).warning('Títulos com mais de 60 caracteres aparecem cortados.'),
    }),
    defineField({
      name: 'description',
      title: 'Descrição nos resultados do Google',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.max(160).warning('Descrições com mais de 160 caracteres aparecem cortadas.'),
    }),
    defineField({
      name: 'image',
      title: 'Imagem ao partilhar a página',
      description: 'Formato horizontal. Aparece quando a página é partilhada no WhatsApp, LinkedIn ou Facebook.',
      type: 'image',
    }),
  ],
})
