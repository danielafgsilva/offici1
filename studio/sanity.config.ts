import {defineConfig} from 'sanity'
import {structureTool, type StructureBuilder} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

// Pages that exist exactly once: edited in place, never created, duplicated or deleted.
const SINGLETONS = ['homePage', 'aboutPage', 'siteSettings']
const SINGLETON_ACTIONS = ['publish', 'discardChanges', 'restore']

const singleton = (S: StructureBuilder, type: string, title: string) =>
  S.listItem().title(title).id(type).child(S.document().schemaType(type).documentId(type).title(title))

export default defineConfig({
  name: 'default',
  title: "Offici'um",

  projectId: 'cdj6b9v2',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Conteúdo')
          .items([
            singleton(S, 'homePage', 'Página inicial'),
            singleton(S, 'aboutPage', 'Sobre nós'),
            S.documentTypeListItem('historyMilestone').title('História'),
            S.divider(),
            S.documentTypeListItem('service').title('Serviços'),
            S.documentTypeListItem('teamMember').title('Equipa'),
            S.documentTypeListItem('teamMoment').title('Momentos da equipa'),
            S.documentTypeListItem('jobOpening').title('Vagas'),
            S.documentTypeListItem('client').title('Clientes'),
            S.documentTypeListItem('testimonial').title('Depoimentos'),
            S.documentTypeListItem('faq').title('Perguntas frequentes'),
            S.divider(),
            singleton(S, 'siteSettings', 'Contactos e definições'),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
    templates: (templates) => templates.filter(({schemaType}) => !SINGLETONS.includes(schemaType)),
  },

  document: {
    actions: (actions, {schemaType}) =>
      SINGLETONS.includes(schemaType)
        ? actions.filter(({action}) => action && SINGLETON_ACTIONS.includes(action))
        : actions,
  },
})
