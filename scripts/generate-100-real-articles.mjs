import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import dotenv from 'dotenv';
import matter from 'gray-matter';
import { renderEditorialArticle, scoreCandidate } from './lib/editorial-automation.mjs';
import { resolveArticleImage } from './lib/resolve-image.mjs';
import { slugify, todayParts } from './lib/feed-sources.mjs';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const ROOT = process.cwd();
const ARTICLES_DIR = path.join(ROOT, 'src', 'content', 'articles');
const TARGET_COUNT = 100;

const SOURCES = [
  {
    title: 'Epic wants to let you bring your Fortnite skins to other games',
    source: 'The Verge',
    url: 'https://www.theverge.com/games/951785/epic-games-fortnite-unreal-fest-2026-unreal-engine-6-ai-metaverse',
    summary: 'Epic announced a step toward cross-game interoperability and positioned AI and platform strategy around Unreal Engine 6.',
    category: 'IA aplicada',
  },
  {
    title: "Microsoft's Project Solara is an OS for AI agent gadgets",
    source: 'The Verge',
    url: 'https://www.theverge.com/news/941830/microsoft-project-solara-os-ai-agent-gadgets',
    summary: 'Microsoft is testing an Android-based platform for low-power devices meant to run agent-first experiences.',
    category: 'Agentes de IA',
  },
  {
    title: 'Apple is testing a standalone app for its overhauled Siri',
    source: 'The Verge',
    url: 'https://www.theverge.com/tech/899801/apple-wwdc-2026-new-siri-apple-intelligence-standalone-app',
    summary: 'Apple is rebuilding Siri into a systemwide AI agent with app control, personal data access and a chat-like app.',
    category: 'Agentes de IA',
  },
  {
    title: 'Nvidia launches Vera Rubin AI computing platform at CES 2026',
    source: 'The Verge',
    url: 'https://www.theverge.com/tech/855412/nvidia-launches-vera-rubin-ai-computing-platform-at-ces-2026',
    summary: 'Nvidia introduced a new AI compute platform claiming major efficiency gains for training and inference at rack scale.',
    category: 'IA aplicada',
  },
  {
    title: 'The 13 biggest announcements at Google I/O 2026',
    source: 'The Verge',
    url: 'https://www.theverge.com/tech/933415/google-io-2026-biggest-announcements-ai-gemini',
    summary: 'Google emphasized Gemini 3.5, AI Mode in Search, agentic coding and multimodal app experiences across products.',
    category: 'SEO e AIO',
  },
  {
    title: "OpenAI's 2026 'focus' is 'practical adoption'",
    source: 'The Verge',
    url: 'https://www.theverge.com/news/864229/openai-focus-practical-adoption-sarah-friar',
    summary: 'OpenAI is prioritizing enterprise adoption, infrastructure commitments and practical use cases for AI products.',
    category: 'IA aplicada',
  },
  {
    title: 'Attack of the killer script kiddies',
    source: 'The Verge',
    url: 'https://www.theverge.com/ai-artificial-intelligence/915660/mythos-script-kiddies-hackers-attack-cybersecurity-ai',
    summary: 'AI is lowering the bar for vulnerability discovery and changing expectations for software security and patch management.',
    category: 'Software',
  },
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
  'o que uma operação precisa revisar',
  'como transformar em processo',
  'ponto cego mais provável',
  'melhor pergunta executiva',
];

function buildCandidate(source, angle, index) {
  const title = `${source.title}: ${angle}`;
  return scoreCandidate({
    title,
    summary: `${source.summary} Ângulo editorial: ${angle}.`,
    source: source.source,
    url: source.url,
    publishedAt: new Date(Date.now() - index * 7200_000).toISOString(),
    points: 24 - (index % 8),
  });
}

async function main() {
  await mkdir(ARTICLES_DIR, { recursive: true });
  const dateIso = todayParts().iso;
  let created = 0;

  for (let i = 0; i < TARGET_COUNT; i++) {
    const source = SOURCES[i % SOURCES.length];
    const angle = ANGLES[Math.floor(i / SOURCES.length) % ANGLES.length];
    const candidate = buildCandidate(source, angle, i);
    const baseSlug = slugify(`${source.title}-${angle}-${i + 1}`);
    const slug = `${baseSlug}-${dateIso}`;
    const image = await resolveArticleImage({
      slug,
      title: candidate.title,
      category: source.category,
      image: '',
      sourceUrl: source.url,
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
    console.log(`[generate:100-real] created=${outputPath} title=${data.title}`);
    created += 1;
  }

  console.log(`\n[generate:100-real] finalizado: ${created}/${TARGET_COUNT} artigos gerados.`);
}

main().catch((error) => {
  console.error(`[generate:100-real] ${error.message}`);
  process.exit(1);
});
