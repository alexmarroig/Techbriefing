import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import {
  auditArticleRecord,
  auditTextQuality,
  createCoverageIndex,
  renderEditorialArticle,
  renderLlmsIndex,
  repairArticleText,
  scoreCandidate,
  selectCandidates,
} from './lib/editorial-automation.mjs';
import { fetchRankedFeedItems, slugify, todayParts } from './lib/feed-sources.mjs';
import { resolveArticleImage } from './lib/resolve-image.mjs';

const ROOT = process.cwd();
const ARTICLES_DIR = path.join(ROOT, 'src', 'content', 'articles');
const LLMS_PATH = path.join(ROOT, 'public', 'llms.txt');
const DEFAULT_LIMIT = Number(process.env.EDITORIAL_DAILY_LIMIT || 10);
const DEFAULT_MIN_SCORE = Number(process.env.EDITORIAL_MIN_SCORE || 35);
const REPORT_LIMIT = Number(process.env.EDITORIAL_REPORT_LIMIT || 30);

const KEYWORD_CANDIDATES = [
  {
    title: 'Como aparecer no ChatGPT e no Google AI com conteudo estruturado',
    summary: 'Pauta evergreen sobre SEO, AIO, FAQ, schema, fontes e leitura por LLMs.',
    source: 'Tech Briefing Keyword Radar',
    url: 'https://www.techbriefing.com.br/guias/como-aparecer-no-chatgpt-e-google-ai/',
  },
  {
    title: 'Automacao com IA para pequenos negocios: processos antes de ferramentas',
    summary: 'Pauta de alta intencao sobre automacao, n8n, Make, atendimento e operacao.',
    source: 'Tech Briefing Keyword Radar',
    url: 'https://www.techbriefing.com.br/guias/como-montar-stack-ia-para-negocios/',
  },
  {
    title: 'Agentes de IA para atendimento: quando usar chatbot, fluxo ou agente',
    summary: 'Pauta evergreen sobre agentes de IA, suporte, vendas, dados e revisao humana.',
    source: 'Tech Briefing Keyword Radar',
    url: 'https://www.techbriefing.com.br/artigos/chatbot-vs-agente-ia-diferencas/',
  },
  {
    title: 'Ferramentas de IA para criar apps por prompt sem perder controle',
    summary: 'Pauta de busca sobre apps por prompt, vibe coding, prototipos e riscos.',
    source: 'Tech Briefing Keyword Radar',
    url: 'https://www.techbriefing.com.br/guias/melhores-apps-ia-criar-app-com-texto/',
  },
];

function parseArgs(argv) {
  const valueAfter = (name, fallback = '') => {
    const index = argv.indexOf(name);
    return index >= 0 ? argv[index + 1] : fallback;
  };

  return {
    dryRun: argv.includes('--dry-run'),
    publish: argv.includes('--publish'),
    repairExisting: !argv.includes('--skip-repair'),
    limit: Number(valueAfter('--limit', DEFAULT_LIMIT)) || DEFAULT_LIMIT,
    minScore: Number(valueAfter('--min-score', DEFAULT_MIN_SCORE)) || DEFAULT_MIN_SCORE,
    skipKeywords: argv.includes('--skip-keywords'),
  };
}

function extractSourceFromBody(body = '') {
  const source = body.match(/\*\*Fonte:\*\*\s*\[[^\]]+\]\((https?:\/\/[^)]+)\)/i);
  if (source?.[1]) return source[1];
  const link = body.match(/\((https?:\/\/[^)]+)\)/);
  return link?.[1] || '';
}

async function loadExistingArticles() {
  await mkdir(ARTICLES_DIR, { recursive: true });
  const files = (await readdir(ARTICLES_DIR)).filter((file) => file.endsWith('.md'));
  const records = [];

  for (const file of files) {
    const raw = await readFile(path.join(ARTICLES_DIR, file), 'utf8');
    const { data, content } = matter(raw);
    records.push({
      file,
      raw,
      slug: file.replace(/\.md$/, ''),
      title: data.title || file.replace(/\.md$/, ''),
      description: data.description || '',
      category: data.category || '',
      tags: data.tags || [],
      date: data.date || '',
      image: data.image || '',
      sourceUrl: data.sourceUrl || extractSourceFromBody(content),
      sourceName: data.sourceName || '',
      data,
      body: content,
    });
  }

  return records;
}

function uniqueSlug(baseSlug, dateIso) {
  let slug = baseSlug;
  let suffix = 0;
  while (existsSync(path.join(ARTICLES_DIR, `${slug}.md`))) {
    suffix += 1;
    slug = `${baseSlug}-${dateIso}${suffix > 1 ? `-${suffix}` : ''}`;
  }
  return slug;
}

function buildKeywordCandidates(dateIso) {
  return KEYWORD_CANDIDATES.map((candidate) => ({
    ...candidate,
    publishedAt: `${dateIso}T09:00:00-03:00`,
    keywordCandidate: true,
  }));
}

function printCandidateReport(candidates, selected) {
  const selectedUrls = new Set(selected.map((item) => item.normalizedUrl));
  console.log(`[editorial:pipeline] candidates=${candidates.length} selected=${selected.length}`);
  for (const candidate of candidates.slice(0, REPORT_LIMIT)) {
    const marker = selectedUrls.has(candidate.normalizedUrl) ? 'SELECTED' : 'candidate';
    console.log(`- [${marker}] score=${candidate.score} source=${candidate.source} title=${candidate.title}`);
    if (candidate.reasons?.length) console.log(`  reasons=${candidate.reasons.join(', ')}`);
    if (candidate.penalties?.length) console.log(`  penalties=${candidate.penalties.join(', ')}`);
    console.log(`  url=${candidate.normalizedUrl}`);
  }
}

async function writeLlmsIndex(records) {
  await writeFile(LLMS_PATH, renderLlmsIndex(records), 'utf8');
  console.log(`[editorial:pipeline] llms=${LLMS_PATH}`);
}

function articleCandidateFromRecord(record) {
  return scoreCandidate({
    title: record.title,
    summary: record.description || record.data?.summary || '',
    source: record.sourceName || record.data?.sourceName || 'Fonte original',
    url: record.sourceUrl || '',
    publishedAt: record.date || record.data?.date || '',
    points: record.data?.points || 0,
  });
}

function articleIssues(record) {
  const strictData = {
    ...record.data,
    image: record.image,
    sourceUrl: record.sourceUrl,
  };
  return [
    ...auditArticleRecord({ slug: record.slug, data: strictData, body: record.body }),
    ...auditTextQuality({
      title: record.title,
      description: record.description,
      body: record.body,
      faq: record.data?.faq || [],
      discussionPrompts: record.data?.discussionPrompts || [],
    }).map((code) => ({ code, message: `Qualidade textual: ${code}` })),
  ];
}

async function repairRecord(record, candidate, dateIso) {
  const sourceCandidate = candidate || articleCandidateFromRecord(record);
  const image = await resolveArticleImage({
    slug: record.slug,
    title: sourceCandidate.title || record.title,
    category: record.category || sourceCandidate.reasons?.[0] || '',
    image: record.image || '',
    sourceUrl: sourceCandidate.normalizedUrl || record.sourceUrl || '',
    rssImageUrl: '',
    apply: true,
    preferRemote: true,
  });

  const markdown = renderEditorialArticle({
    candidate: {
      ...sourceCandidate,
      title: sourceCandidate.title || record.title,
      summary: sourceCandidate.summary || record.description || '',
      source: sourceCandidate.source || record.sourceName || 'Fonte original',
      url: sourceCandidate.normalizedUrl || record.sourceUrl || '',
      publishedAt: dateIso,
    },
    slug: record.slug,
    dateIso,
    imagePath: image.path,
  });

  await writeFile(path.join(ARTICLES_DIR, record.file), markdown, 'utf8');
  return markdown;
}

async function repairExistingArticles(existing, dateIso, limit, minScore) {
  const coverage = createCoverageIndex(existing.filter((article) => {
    const issues = articleIssues(article);
    const duplicate = article.data?.editorialType === 'automated-news-analysis' && article.sourceUrl;
    return issues.length === 0 && duplicate;
  }));
  const feedItems = await fetchRankedFeedItems();
  const keywordItems = buildKeywordCandidates(dateIso);
  const candidates = [...feedItems, ...keywordItems].map(scoreCandidate).sort((a, b) => b.score - a.score);
  const replacements = selectCandidates(candidates, { coverage, limit: existing.length + limit, minScore });
  const replacementQueue = [...replacements];

  const repaired = [];
  for (const record of existing) {
    const issues = articleIssues(record);
    const strict = record.data?.editorialType === 'automated-news-analysis';
    if (!strict || issues.length === 0) continue;

    const duplicateIssue = issues.find((issue) => issue.code === 'duplicate_source');
    const chosen = duplicateIssue ? replacementQueue.shift() : null;
    const markdown = await repairRecord(record, chosen, dateIso);
    repaired.push({
      slug: record.slug,
      title: matter(markdown).data.title,
      description: matter(markdown).data.description,
      category: matter(markdown).data.category,
      tags: matter(markdown).data.tags || [],
      date: dateIso,
    });
    console.log(`[editorial:pipeline] repaired=${record.file}${chosen ? ` replacement=${chosen.title}` : ''}`);
  }

  return repaired;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const date = todayParts();
  const existing = await loadExistingArticles();
  const coverage = createCoverageIndex(existing);
  const feedItems = await fetchRankedFeedItems();
  const keywordItems = options.skipKeywords ? [] : buildKeywordCandidates(date.iso);
  const candidates = [...feedItems, ...keywordItems].map(scoreCandidate).sort((a, b) => b.score - a.score);
  const selected = selectCandidates(candidates, { coverage, limit: options.limit, minScore: options.minScore });

  printCandidateReport(candidates, selected);

  if (options.dryRun) {
    console.log('[editorial:pipeline] dry-run=true; nenhum arquivo foi escrito.');
    return;
  }

  const repairLog = options.repairExisting
    ? await repairExistingArticles(existing, date.iso, options.limit, options.minScore)
    : [];

  const refreshedExisting = options.repairExisting ? await loadExistingArticles() : existing;
  const refreshedCoverage = createCoverageIndex(refreshedExisting);
  const refreshedSelected = selectCandidates(candidates, {
    coverage: refreshedCoverage,
    limit: options.limit,
    minScore: options.minScore,
  });

  const created = [];
  for (const candidate of refreshedSelected) {
    const baseSlug = slugify(candidate.title || candidate.slug || 'tech-briefing');
    const slug = uniqueSlug(baseSlug, date.iso);
    const resolved = await resolveArticleImage({
      slug,
      title: candidate.title,
      category: candidate.reasons?.[0] || '',
      image: '',
      sourceUrl: candidate.normalizedUrl,
      rssImageUrl: '',
      apply: true,
      preferRemote: true,
    });
    const markdown = renderEditorialArticle({
      candidate,
      slug,
      dateIso: date.iso,
      imagePath: resolved.path,
    });
    const outputPath = path.join(ARTICLES_DIR, `${slug}.md`);
    await writeFile(outputPath, markdown, 'utf8');
    created.push({
      slug,
      title: matter(markdown).data.title,
      description: matter(markdown).data.description,
      category: matter(markdown).data.category,
      tags: matter(markdown).data.tags || [],
      date: date.iso,
    });
    console.log(`[editorial:pipeline] created=${outputPath}`);
  }

  const finalRecords = [...(options.repairExisting ? await loadExistingArticles() : existing)];
  finalRecords.push(...repairLog);
  finalRecords.push(...created);

  if (finalRecords.length > 0) {
    await writeLlmsIndex(finalRecords);
  } else {
    console.log('[editorial:pipeline] nada novo para publicar.');
  }

  console.log(`[editorial:pipeline] repaired=${repairLog.length} created=${created.length}`);

  if (options.publish) {
    console.log('[editorial:pipeline] publish requested; use the workflow to push/build.');
  }
}

main().catch((error) => {
  console.error(`[editorial:pipeline] ${error.message}`);
  process.exit(1);
});
