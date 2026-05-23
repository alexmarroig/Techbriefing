/**
 * Migração de comparativos Markdown → Sanity (Portable Text)
 *
 * Uso: SANITY_WRITE_TOKEN=xxx PUBLIC_SANITY_PROJECT_ID=xxx node scripts/migrate-comparativos.mjs
 */
import { createClient } from '@sanity/client'
import { htmlToBlocks } from '@portabletext/block-tools'
import { Schema } from '@sanity/schema'
import { JSDOM } from 'jsdom'
import { marked } from 'marked'
import matter from 'gray-matter'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

const client = createClient({
  projectId: process.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN,
})

const MAPPING_FILE = path.join(__dirname, 'image-mapping.json')
const imageMap = fs.existsSync(MAPPING_FILE)
  ? JSON.parse(fs.readFileSync(MAPPING_FILE, 'utf8'))
  : {}

const defaultSchema = Schema.compile({
  name: 'default',
  types: [
    {
      name: 'blockContent',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'Quote', value: 'blockquote' },
          ],
          marks: {
            decorators: [
              { title: 'Bold', value: 'strong' },
              { title: 'Italic', value: 'em' },
              { title: 'Code', value: 'code' },
            ],
            annotations: [
              { name: 'link', type: 'object', fields: [{ name: 'href', type: 'url' }] },
            ],
          },
          lists: [
            { title: 'Bullet', value: 'bullet' },
            { title: 'Number', value: 'number' },
          ],
        },
      ],
    },
  ],
})

const blockContentType = defaultSchema.get('blockContent')

async function main() {
  console.log('╔══════════════════════════════════════════╗')
  console.log('║  Migração de Comparativos → Sanity       ║')
  console.log('╚══════════════════════════════════════════╝')
  console.log()

  if (!process.env.SANITY_WRITE_TOKEN) {
    console.error('❌ SANITY_WRITE_TOKEN não definido.')
    process.exit(1)
  }

  const dir = path.join(ROOT, 'src', 'content', 'comparativos')
  if (!fs.existsSync(dir)) {
    console.error(`❌ Diretório não encontrado: ${dir}`)
    process.exit(1)
  }

  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.md'))
  console.log(`📄 ${files.length} comparativos encontrados`)
  console.log()

  let success = 0

  for (const file of files) {
    const slug = file.replace('.md', '')
    const raw = fs.readFileSync(path.join(dir, file), 'utf8')
    const { data: fm, content } = matter(raw)

    try {
      const html = marked.parse(content, { gfm: true })
      const blocks = htmlToBlocks(html, blockContentType, {
        parseHtml: (h) => new JSDOM(h).window.document,
      })

      let imageField = undefined
      if (fm.image && imageMap[fm.image]) {
        imageField = {
          _type: 'image',
          asset: { _type: 'reference', _ref: imageMap[fm.image] },
        }
      }

      const doc = {
        _type: 'comparativo',
        _id: `comparativo-${slug}`,
        title: fm.title || slug,
        slug: { _type: 'slug', current: slug },
        description: fm.description || '',
        category: fm.category || 'Comparativo',
        author: fm.author || 'Tech Briefing',
        date: fm.date instanceof Date ? fm.date.toISOString() : fm.date,
        readTime: fm.readTime || '',
        featured: fm.featured || false,
        image: imageField,
        tools: fm.tools || [],
        body: blocks,
      }

      await client.createOrReplace(doc)
      console.log(`  ✅ ${slug}`)
      success++
    } catch (err) {
      console.error(`  ❌ ${slug}: ${err.message}`)
    }
  }

  console.log()
  console.log(`✅ Concluído! ${success} comparativos migrados.`)
}

main().catch(console.error)
