import {defineField, defineType} from 'sanity'
import {CogIcon} from '@sanity/icons/Cog'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Contactos e definições',
  type: 'document',
  icon: CogIcon,
  groups: [
    {name: 'contact', title: 'Contactos', default: true},
    {name: 'seo', title: 'Google e redes sociais'},
  ],
  fields: [
    defineField({
      name: 'phone',
      title: 'Telefone',
      description: 'Aparece no topo de todas as páginas. Ex.: 223 710 585',
      type: 'string',
      group: 'contact',
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'mobile', title: 'Telemóvel', description: 'Opcional.', type: 'string', group: 'contact'}),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      group: 'contact',
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: 'address',
      title: 'Morada',
      description: 'Rua e número na primeira linha, código postal e localidade na segunda.',
      type: 'text',
      rows: 2,
      group: 'contact',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'openingHours',
      title: 'Horário',
      description: 'Ex.: Segunda a sexta, das 9h00 às 18h00',
      type: 'string',
      group: 'contact',
    }),
    defineField({
      name: 'seoDescription',
      title: 'Descrição do site no Google',
      description: 'Usada nas páginas que não tenham descrição própria.',
      type: 'text',
      rows: 3,
      group: 'seo',
      validation: (rule) => rule.max(160).warning('Descrições com mais de 160 caracteres aparecem cortadas.'),
    }),
    defineField({
      name: 'socialImage',
      title: 'Imagem ao partilhar o site',
      description: 'Formato horizontal. Usada nas páginas que não tenham imagem própria.',
      type: 'image',
      group: 'seo',
    }),
  ],
  preview: {prepare: () => ({title: 'Contactos e definições'})},
})
