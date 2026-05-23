/**
 * Migração de módulos JS (prompts, manuals, pillars) → Sanity
 *
 * Uso: SANITY_WRITE_TOKEN=xxx PUBLIC_SANITY_PROJECT_ID=xxx node scripts/migrate-data-modules.mjs
 */
import { createClient } from '@sanity/client'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

const client = createClient({
  projectId: process.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN,
})

function slugify(str) {
  return str.toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

// ─── PROMPTS ───────────────────────────────────────────────────
async function migratePrompts() {
  console.log('💬 Migrando prompts...')

  try {
    const mod = await import(`file://${path.join(ROOT, 'src', 'data', 'prompts.js')}`)
    const prompts = mod.PROMPTS || mod.default?.PROMPTS || []

    for (const p of prompts) {
      const slug = p.slug || slugify(p.title)
      try {
        await client.createOrReplace({
          _type: 'prompt',
          _id: `prompt-${slug}`,
          title: p.title,
          slug: { _type: 'slug', current: slug },
          category: p.category || '',
          objective: p.objective || '',
          whenToUse: p.whenToUse || '',
          prompt: p.prompt || '',
          variations: p.variations || [],
          nextSteps: p.nextSteps || [],
        })
        console.log(`  ✅ ${p.title}`)
      } catch (err) {
        console.error(`  ❌ ${p.title}: ${err.message}`)
      }
    }
    console.log(`  Total: ${prompts.length} prompts`)
  } catch (err) {
    console.error('  ⚠️ Não foi possível importar prompts.js:', err.message)
  }
}

// ─── MANUALS ───────────────────────────────────────────────────
async function migrateManuals() {
  console.log()
  console.log('📖 Migrando manuais...')

  try {
    const mod = await import(`file://${path.join(ROOT, 'src', 'data', 'manuals.js')}`)
    const manuals = mod.MANUALS || mod.default?.MANUALS || []

    for (const m of manuals) {
      const slug = m.slug || slugify(m.title)
      try {
        await client.createOrReplace({
          _type: 'manual',
          _id: `manual-${slug}`,
          title: m.title,
          slug: { _type: 'slug', current: slug },
          category: m.category || '',
          description: m.description || '',
          outcome: m.outcome || '',
          tools: m.tools || [],
          steps: m.steps || [],
          mistakes: m.mistakes || [],
        })
        console.log(`  ✅ ${m.title}`)
      } catch (err) {
        console.error(`  ❌ ${m.title}: ${err.message}`)
      }
    }
    console.log(`  Total: ${manuals.length} manuais`)
  } catch (err) {
    console.error('  ⚠️ Não foi possível importar manuals.js:', err.message)
  }
}

// ─── PILLARS ───────────────────────────────────────────────────
async function migratePillars() {
  console.log()
  console.log('🏛️ Migrando páginas pilar...')

  try {
    const mod = await import(`file://${path.join(ROOT, 'src', 'data', 'pillars.js')}`)
    const pillars = mod.PILLARS || mod.default?.PILLARS || []

    for (const p of pillars) {
      const slug = p.slug || slugify(p.title)
      try {
        await client.createOrReplace({
          _type: 'pillar',
          _id: `pillar-${slug}`,
          title: p.title,
          slug: { _type: 'slug', current: slug },
          description: p.description || '',
          kicker: p.kicker || '',
          sections: (p.sections || []).map((s, i) => ({
            _type: 'object',
            _key: `section-${i}`,
            heading: s.heading || s.title || '',
            body: s.body || s.text || '',
          })),
          links: (p.links || []).map((l, i) => ({
            _type: 'object',
            _key: `link-${i}`,
            label: l.label || l.text || '',
            href: l.href || l.url || '',
          })),
        })
        console.log(`  ✅ ${p.title}`)
      } catch (err) {
        console.error(`  ❌ ${p.title}: ${err.message}`)
      }
    }
    console.log(`  Total: ${pillars.length} páginas pilar`)
  } catch (err) {
    console.error('  ⚠️ Não foi possível importar pillars.js:', err.message)
  }
}

// ─── MAIN ──────────────────────────────────────────────────────
async function main() {
  console.log('╔══════════════════════════════════════════╗')
  console.log('║  Migração de Módulos JS → Sanity         ║')
  console.log('╚══════════════════════════════════════════╝')
  console.log()

  if (!process.env.SANITY_WRITE_TOKEN) {
    console.error('❌ SANITY_WRITE_TOKEN não definido.')
    process.exit(1)
  }

  await migratePrompts()
  await migrateManuals()
  await migratePillars()

  console.log()
  console.log('✅ Migração de módulos JS concluída!')
}

main().catch(console.error)
