/**
 * Migração de imagens locais para Sanity CDN
 *
 * Uso: SANITY_WRITE_TOKEN=xxx PUBLIC_SANITY_PROJECT_ID=xxx node scripts/migrate-images.mjs
 */
import { createClient } from '@sanity/client'
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

const IMAGE_DIR = path.join(ROOT, 'public', 'images')
const MAPPING_FILE = path.join(__dirname, 'image-mapping.json')
const SUPPORTED_EXT = ['.png', '.jpg', '.jpeg', '.webp', '.svg', '.gif']

const mapping = {}
let uploaded = 0
let skipped = 0

async function uploadDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      await uploadDir(fullPath)
      continue
    }

    const ext = path.extname(entry.name).toLowerCase()
    if (!SUPPORTED_EXT.includes(ext)) {
      skipped++
      continue
    }

    const relativePath = '/' + path.relative(path.join(ROOT, 'public'), fullPath).replace(/\\/g, '/')

    try {
      console.log(`  Uploading: ${relativePath}`)
      const asset = await client.assets.upload('image', fs.createReadStream(fullPath), {
        filename: entry.name,
      })
      mapping[relativePath] = asset._id
      uploaded++
    } catch (err) {
      console.error(`  ❌ Erro ao subir ${relativePath}:`, err.message)
    }
  }
}

async function main() {
  console.log('╔══════════════════════════════════════╗')
  console.log('║  Migração de Imagens → Sanity CDN    ║')
  console.log('╚══════════════════════════════════════╝')
  console.log()

  if (!process.env.SANITY_WRITE_TOKEN) {
    console.error('❌ SANITY_WRITE_TOKEN não definido.')
    console.error('   Crie um token em: sanity.io/manage → API → Tokens')
    process.exit(1)
  }

  if (!fs.existsSync(IMAGE_DIR)) {
    console.error(`❌ Diretório não encontrado: ${IMAGE_DIR}`)
    process.exit(1)
  }

  console.log(`📁 Diretório: ${IMAGE_DIR}`)
  console.log()

  await uploadDir(IMAGE_DIR)

  fs.writeFileSync(MAPPING_FILE, JSON.stringify(mapping, null, 2))

  console.log()
  console.log(`✅ Concluído!`)
  console.log(`   ${uploaded} imagens enviadas`)
  console.log(`   ${skipped} arquivos ignorados`)
  console.log(`   Mapeamento salvo em: ${MAPPING_FILE}`)
}

main().catch(console.error)
