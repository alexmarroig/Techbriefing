/**
 * Migração de artigos Markdown → Sanity (Portable Text)
 *
 * Uso: SANITY_WRITE_TOKEN=xxx PUBLIC_SANITY_PROJECT_ID=xxx node scripts/migrate-articles.mjs
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

// Carrega mapeamento de imagens (se existir)
const MAPPING_FILE = path.join(__dirname, 'image-mapping.json')
const imageMap = fs.existsSync(MAPPING_FILE)
  ? JSON.parse(fs.readFileSync(MAPPING_FILE, 'utf8'))
  : {}

// Schema mínimo para o block-tools converter HTML → Portable Text
// Nota: NÃO incluir type 'image' para evitar erro de sanity.imageHotspot
const defaultSchema = Schema.compile({
  name: 'default',
  types: [
    {
      name: 'blockContent',
      title: 'Block Content',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'H4', value: 'h4' },
            { title: 'Quote', value: 'blockquote' },
          ],
          marks: {
            decorators: [
              { title: 'Bold', value: 'strong' },
              { title: 'Italic', value: 'em' },
              { title: 'Code', value: 'code' },
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                fields: [{ name: 'href', type: 'url' }],
              },
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

function mdToBlocks(markdown) {
  const html = marked.parse(markdown, { gfm: true })
  const blocks = htmlToBlocks(html, blockContentType, {
    parseHtml: (htmlStr) => new JSDOM(htmlStr).window.document,
  })
  return blocks
}

async function main() {
  console.log('╔══════════════════════════════════════╗')
  console.log('║  Migração de Artigos → Sanity        ║')
  console.log('╚══════════════════════════════════════╝')
  console.log()

  if (!process.env.SANITY_WRITE_TOKEN) {
    console.error('❌ SANITY_WRITE_TOKEN não definido.')
    process.exit(1)
  }

  const articlesDir = path.join(ROOT, 'src', 'content', 'articles')
  if (!fs.existsSync(articlesDir)) {
    console.error(`❌ Diretório não encontrado: ${articlesDir}`)
    process.exit(1)
  }

  const files = fs.readdirSync(articlesDir).filter((f) => f.endsWith('.md'))
  console.log(`📄 ${files.length} artigos encontrados`)
  console.log()

  let success = 0
  let errors = 0

  for (const file of files) {
    const slug = file.replace('.md', '')
    const raw = fs.readFileSync(path.join(articlesDir, file), 'utf8')
    const { data: fm, content } = matter(raw)

    try {
      const blocks = mdToBlocks(content)

      // Resolver referência de imagem
      let imageField = undefined
      if (fm.image && imageMap[fm.image]) {
        imageField = {
          _type: 'image',
          asset: { _type: 'reference', _ref: imageMap[fm.image] },
        }
      }

      const doc = {
        _type: 'article',
        _id: `article-${slug}`,
        title: fm.title || slug,
        slug: { _type: 'slug', current: slug },
        description: fm.description || '',
        category: fm.category || '',
        author: fm.author || 'Tech Briefing',
        date: fm.date instanceof Date ? fm.date.toISOString() : fm.date,
        readTime: fm.readTime || '',
        featured: fm.featured || false,
        image: imageField,
        tags: fm.tags || [],
        body: blocks,
      }

      await client.createOrReplace(doc)
      console.log(`  ✅ ${slug}`)
      success++
    } catch (err) {
      console.error(`  ❌ ${slug}: ${err.message}`)
      errors++
    }
  }

  console.log()
  console.log(`✅ Concluído! ${success} artigos migrados, ${errors} erros.`)
}

main().catch(console.error)
