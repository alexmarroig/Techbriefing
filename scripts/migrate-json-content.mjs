/**
 * Migração de conteúdo JSON (tools, ebooks, apps) + dados hardcoded → Sanity
 *
 * Uso: SANITY_WRITE_TOKEN=xxx PUBLIC_SANITY_PROJECT_ID=xxx node scripts/migrate-json-content.mjs
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

function slugify(str) {
  return str.toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

// ─── TOOLS ─────────────────────────────────────────────────────
// Hardcoded tools from FerramentasPage.jsx (primary source)
const HARDCODED_TOOLS = [
  { name:'n8n', icon:'⚡', description:'Automação visual self-hosted. O mais poderoso para fluxos complexos — grátis se hospedar você mesmo.', category:'Automação', categoryId:'automacao', rating:5, affiliate:true },
  { name:'Make', icon:'🔗', description:'Automação no-code intuitiva. Melhor custo-benefício para times pequenos e casos de uso variados.', category:'Automação', categoryId:'automacao', rating:5, affiliate:true },
  { name:'OpenAI', icon:'🤖', description:'GPT-4o e API central do ecossistema IA. Essencial para qualquer projeto com modelos de linguagem.', category:'IA & LLMs', categoryId:'ia', rating:5, affiliate:false },
  { name:'Claude (Anthropic)', icon:'🧠', description:'Melhor modelo para raciocínio, escrita e código. Ideal para contextos longos e análise crítica.', category:'IA & LLMs', categoryId:'ia', rating:5, affiliate:false },
  { name:'Perplexity', icon:'🔍', description:'Pesquisa com IA em tempo real. Substitui o Google para buscas profissionais com fontes rastreáveis.', category:'IA & LLMs', categoryId:'ia', rating:4, affiliate:true },
  { name:'Notion', icon:'📝', description:'Hub de trabalho, docs e projetos. Com IA nativa integrada, é o sistema operacional do trabalho moderno.', category:'Produtividade', categoryId:'produtividade', rating:4, affiliate:true },
  { name:'Cursor', icon:'💻', description:'O editor de código mais avançado com IA. Essencial para desenvolvedores e quem quer aprender a programar com IA.', category:'Produtividade', categoryId:'produtividade', rating:5, affiliate:true },
  { name:'Framer', icon:'🎨', description:'Sites profissionais com design de ponta. O melhor para portefólios, landing pages e sites de produto.', category:'Sites & No-code', categoryId:'sites', rating:5, affiliate:true },
  { name:'Webflow', icon:'🌐', description:'CMS visual e desenvolvimento front-end sem código. Mais robusto que Framer para sites de conteúdo.', category:'Sites & No-code', categoryId:'sites', rating:4, affiliate:true },
  { name:'Beehiiv', icon:'🐝', description:'A plataforma de newsletter favorita dos criadores modernos. Monetização, analytics e crescimento integrados.', category:'Email & Newsletter', categoryId:'email', rating:5, affiliate:true },
  { name:'ConvertKit', icon:'✉️', description:'Email marketing focado em criadores. Automações, landing pages e segmentação avançada.', category:'Email & Newsletter', categoryId:'email', rating:4, affiliate:true },
  { name:'Semrush', icon:'📊', description:'Suite completa de SEO, pesquisa de palavras-chave e inteligência competitiva. Padrão da indústria.', category:'SEO & Analytics', categoryId:'seo', rating:5, affiliate:true },
  { name:'Ahrefs', icon:'🔎', description:'Análise de backlinks e research de conteúdo. Favorito de SEOs avançados para estratégia orgânica.', category:'SEO & Analytics', categoryId:'seo', rating:5, affiliate:true },
  { name:'Descript', icon:'🎙️', description:'Edição de áudio e vídeo baseada em texto. Transcreve automaticamente e edita como se fosse um doc.', category:'Criação de Conteúdo', categoryId:'criacao', rating:5, affiliate:true },
  { name:'CapCut', icon:'🎬', description:'Edição de vídeo com IA para mobile e desktop. Legendas automáticas, templates e efeitos em segundos.', category:'Criação de Conteúdo', categoryId:'criacao', rating:4, affiliate:false },
  { name:'Canva', icon:'🎭', description:'Design acessível para tudo. Com IA generativa, gera imagens, apresentações e posts em minutos.', category:'Criação de Conteúdo', categoryId:'criacao', rating:4, affiliate:true },
  { name:'Railway', icon:'🚂', description:'Deploy de apps e APIs em segundos. O Heroku moderno — sem fricção, com escala automática.', category:'Desenvolvimento', categoryId:'dev', rating:5, affiliate:true },
  { name:'Vercel', icon:'▲', description:'Plataforma de deploy para front-end e full-stack. Padrão para apps Next.js e projetos Jamstack.', category:'Desenvolvimento', categoryId:'dev', rating:5, affiliate:false },
  { name:'Supabase', icon:'⚡', description:'Backend open source com banco de dados, auth e storage. Alternativa ao Firebase com mais controle.', category:'Desenvolvimento', categoryId:'dev', rating:5, affiliate:true },
  { name:'Replit', icon:'💡', description:'IDE na nuvem para prototipagem rápida. Ideal para testar ideias e projetos com IA sem setup.', category:'Desenvolvimento', categoryId:'dev', rating:4, affiliate:true },
  { name:'Tally', icon:'📋', description:'Formulários bonitos e gratuitos. Interface limpa, integrações nativas e plano free generoso.', category:'Formulários', categoryId:'forms', rating:5, affiliate:true },
  { name:'Typeform', icon:'📐', description:'Formulários conversacionais com alta taxa de resposta. Ideal para pesquisas e onboarding.', category:'Formulários', categoryId:'forms', rating:4, affiliate:true },
]

async function migrateTools() {
  console.log('🔧 Migrando ferramentas...')

  // Merge: hardcoded + JSON files (dedup by name)
  const seen = new Set()
  const allTools = []

  for (const t of HARDCODED_TOOLS) {
    seen.add(t.name.toLowerCase())
    allTools.push(t)
  }

  // Also read from JSON files
  const toolsDir = path.join(ROOT, 'src', 'content', 'tools')
  if (fs.existsSync(toolsDir)) {
    for (const file of fs.readdirSync(toolsDir).filter(f => f.endsWith('.json'))) {
      const data = JSON.parse(fs.readFileSync(path.join(toolsDir, file), 'utf8'))
      if (!seen.has(data.name.toLowerCase())) {
        allTools.push(data)
        seen.add(data.name.toLowerCase())
      }
    }
  }

  let order = 0
  for (const t of allTools) {
    const slug = slugify(t.name)
    try {
      await client.createOrReplace({
        _type: 'tool',
        _id: `tool-${slug}`,
        name: t.name,
        slug: { _type: 'slug', current: slug },
        icon: t.icon || '',
        description: t.description || '',
        category: t.category || '',
        categoryId: t.categoryId || slugify(t.category || ''),
        rating: t.rating || 5,
        affiliate: t.affiliate || false,
        url: t.url || '/ferramentas',
        sortOrder: order++,
      })
      console.log(`  ✅ ${t.name}`)
    } catch (err) {
      console.error(`  ❌ ${t.name}: ${err.message}`)
    }
  }
  console.log(`  Total: ${allTools.length} ferramentas`)
}

// ─── EBOOKS ────────────────────────────────────────────────────
async function migrateEbooks() {
  console.log()
  console.log('📚 Migrando ebooks...')

  const dir = path.join(ROOT, 'src', 'content', 'ebooks')
  if (!fs.existsSync(dir)) {
    console.log('  Nenhum ebook encontrado em content/ebooks/')
    return
  }

  for (const file of fs.readdirSync(dir).filter(f => f.endsWith('.json'))) {
    const data = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'))
    const slug = file.replace('.json', '')

    try {
      await client.createOrReplace({
        _type: 'ebook',
        _id: `ebook-${slug}`,
        title: data.title,
        slug: { _type: 'slug', current: slug },
        description: data.description || '',
        price: data.price || '',
        oldPrice: data.oldPrice || '',
        pages: data.pages || 0,
        color: data.color || 'amber',
        benefits: data.benefits || [],
        url: data.url || '/ebooks',
        formats: data.formats || [],
        toc: data.toc || [],
      })
      console.log(`  ✅ ${data.title}`)
    } catch (err) {
      console.error(`  ❌ ${data.title}: ${err.message}`)
    }
  }
}

// ─── APPS ──────────────────────────────────────────────────────
async function migrateApps() {
  console.log()
  console.log('📱 Migrando apps...')

  const dir = path.join(ROOT, 'src', 'content', 'apps')
  if (!fs.existsSync(dir)) {
    console.log('  Nenhum app encontrado em content/apps/')
    return
  }

  for (const file of fs.readdirSync(dir).filter(f => f.endsWith('.json'))) {
    const data = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'))
    const slug = file.replace('.json', '')

    try {
      await client.createOrReplace({
        _type: 'app',
        _id: `app-${slug}`,
        name: data.name,
        slug: { _type: 'slug', current: slug },
        icon: data.icon || '',
        description: data.description || '',
        status: data.status || 'Disponível',
        platform: data.platform || '',
        url: data.url || '/apps',
      })
      console.log(`  ✅ ${data.name}`)
    } catch (err) {
      console.error(`  ❌ ${data.name}: ${err.message}`)
    }
  }
}

// ─── MAIN ──────────────────────────────────────────────────────
async function main() {
  console.log('╔══════════════════════════════════════════╗')
  console.log('║  Migração JSON → Sanity                  ║')
  console.log('╚══════════════════════════════════════════╝')
  console.log()

  if (!process.env.SANITY_WRITE_TOKEN) {
    console.error('❌ SANITY_WRITE_TOKEN não definido.')
    process.exit(1)
  }

  await migrateTools()
  await migrateEbooks()
  await migrateApps()

  console.log()
  console.log('✅ Migração JSON concluída!')
}

main().catch(console.error)
