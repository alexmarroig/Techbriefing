import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import dotenv from 'dotenv';
import matter from 'gray-matter';
import {
  renderEditorialArticle,
  scoreCandidate,
} from './lib/editorial-automation.mjs';
import { resolveArticleImage } from './lib/resolve-image.mjs';
import { slugify, todayParts } from './lib/feed-sources.mjs';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const ROOT = process.cwd();
const ARTICLES_DIR = path.join(ROOT, 'src', 'content', 'articles');
const TARGET_COUNT = 100;

const THEMES = [
  { keyword: 'agentes de IA', source: 'Tech Briefing Local Radar', category: 'Agentes de IA', base: 'Agentes de IA entram em nova fase operacional' },
  { keyword: 'automacao com IA', source: 'Tech Briefing Local Radar', category: 'Automacao', base: 'Automacao com IA vira prioridade em pequenas equipes' },
  { keyword: 'SEO e AIO', source: 'Tech Briefing Local Radar', category: 'SEO e AIO', base: 'Busca com IA redefine a estrategia de conteudo' },
  { keyword: 'desenvolvimento com IA', source: 'Tech Briefing Local Radar', category: 'Desenvolvimento', base: 'Ferramentas de desenvolvimento com IA aceleram produto' },
  { keyword: 'IA para negocios', source: 'Tech Briefing Local Radar', category: 'IA aplicada', base: 'IA aplicada ganha tracao em operacoes de negocio' },
  { keyword: 'robotica com IA', source: 'Tech Briefing Local Radar', category: 'IA aplicada', base: 'Robotica com IA volta ao radar de produto' },
  { keyword: 'governanca de IA', source: 'Tech Briefing Local Radar', category: 'Risco e governanca', base: 'Governanca de IA entra em pauta executiva' },
  { keyword: 'atendimento com IA', source: 'Tech Briefing Local Radar', category: 'Agentes de IA', base: 'Atendimento com IA amadurece em fluxos de suporte' },
  { keyword: 'criacao de conteudo com IA', source: 'Tech Briefing Local Radar', category: 'SEO e AIO', base: 'Conteudo com IA exige processo editorial mais forte' },
  { keyword: 'produtividade com IA', source: 'Tech Briefing Local Radar', category: 'IA aplicada', base: 'Produtividade com IA deixa de ser promessa abstrata' },
];

const ANGLES = [
  'o que muda para pequenas empresas',
  'impacto em equipes enxutas',
  'como aplicar sem hype',
  'riscos antes de adotar',
  'sinais para monitorar',
  'como medir resultado',
  'qual teste rodar primeiro',
  'quando vale esperar',
  'diferenças entre ferramentas',
  'efeitos em SEO e AIO',
];

function makeCandidate(theme, angle, index) {
  const title = `${theme.base}: ${angle}`;
  const urlSlug = slugify(`${theme.keyword}-${angle}-${index}`);
  return scoreCandidate({
    title,
    summary: `Pauta editorial sobre ${theme.keyword}, com foco em ${angle} e em decisao pratica para o leitor.`,
    source: theme.source,
    url: `https://www.techbriefing.com.br/radar/${urlSlug}`,
    publishedAt: new Date(Date.now() - index * 3600_000).toISOString(),
    points: 12 + (index % 18),
  });
}

async function main() {
  await mkdir(ARTICLES_DIR, { recursive: true });
  const dateIso = todayParts().iso;
  const created = [];

  for (let i = 0; i < TARGET_COUNT; i++) {
    const theme = THEMES[i % THEMES.length];
    const angle = ANGLES[Math.floor(i / THEMES.length)];
    const candidate = makeCandidate(theme, angle, i);
    const baseSlug = slugify(`${theme.keyword}-${angle}-${i + 1}`);
    const slug = `${baseSlug}-${dateIso}`;

    const image = await resolveArticleImage({
      slug,
      title: candidate.title,
      category: theme.category,
      image: '',
      sourceUrl: candidate.url,
      apply: true,
      preferRemote: false,
    });

    const markdown = renderEditorialArticle({
      candidate,
      slug,
      dateIso,
      imagePath: image.path,
    });

    const outputPath = path.join(ARTICLES_DIR, `${slug}.md`);
    await writeFile(outputPath, markdown, 'utf8');
    const { data } = matter(markdown);
    created.push({ slug, title: data.title });
    console.log(`[generate:100] created=${outputPath}`);
  }

  console.log(`\n[generate:100] finalizado: ${created.length}/${TARGET_COUNT} artigos gerados.`);
}

main().catch((error) => {
  console.error(`[generate:100] ${error.message}`);
  process.exit(1);
});
