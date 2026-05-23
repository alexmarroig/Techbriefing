import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { codeInput } from '@sanity/code-input'
import { schemaTypes } from './src/sanity/schemas'
import { structure } from './src/sanity/structure'

export default defineConfig({
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID || 'vn3iz3iz',
  dataset: 'production',
  plugins: [
    structureTool({ structure }),
    codeInput(),
  ],
  schema: { types: schemaTypes },
})
