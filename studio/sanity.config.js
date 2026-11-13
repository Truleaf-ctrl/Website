import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './schemaTypes'

// Documents that exist exactly once: shown as a single entry in the sidebar, no "create new" button.
const SINGLETONS = ['homeFeatured']

export default defineConfig({
  name: 'default',
  title: 'Trueleaf',

  projectId: 'qir915mw',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Home page: featured items')
              .id('homeFeatured')
              .child(S.document().schemaType('homeFeatured').documentId('homeFeatured')),
            S.divider(),
            ...S.documentTypeListItems().filter((item) => !SINGLETONS.includes(item.getId())),
          ]),
    }),
  ],

  schema: {
    types: schemaTypes,
    templates: (templates) => templates.filter(({ schemaType }) => !SINGLETONS.includes(schemaType)),
  },

  document: {
    newDocumentOptions: (prev) => prev.filter((item) => !SINGLETONS.includes(item.templateId)),
  },
})
