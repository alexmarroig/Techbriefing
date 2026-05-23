import { createClient } from '@sanity/client'

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID || process.env.PUBLIC_SANITY_PROJECT_ID || 'vn3iz3iz'
const dataset = import.meta.env.PUBLIC_SANITY_DATASET || process.env.PUBLIC_SANITY_DATASET || 'production'

export const client = createClient({
  projectId,
  dataset,
  useCdn: true,
  apiVersion: '2024-01-01',
})

// Write client for mutations (server-side only)
export const writeClient = createClient({
  projectId,
  dataset,
  useCdn: false,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN,
})
