import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import {
  categorize,
  escapeYaml,
  fetchRankedFeedItems,
  makeSummary,
  normalizeUrl,
  opportunityAngle,
  practicalAction,
  slugify,
  todayParts,
  translateAngle,
  whyItMatters,
} from './lib/feed-sources.mjs';
import { resolveArticleImage } from './lib/resolve-image.mjs';

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, 'src', 'content', 'articles');
const SKIP_RADAR_TOP = Number(process.env.NEWS_SKIP_RADAR_TOP || 5);

function buildSlug(item, dateIso) {
  const base = slugify(item.title);
  let slug = base;
  let suffix = 0;
  while (existsSync(path.join(OUT_DIR, `${slug}.md`))) {
    suffix += 1;
    slug = `${base}-${dateIso}${suffix > 1 ? `-${suffix}` : ''}`;
  }
  return slug;
}

function buildTags(item) {
  const tags = new Set([categorize(item), item.source]);
  const text = `${item.title} ${item.summary || ''}`.toLowerCase();
  if (/agent/.test(text)) tags.add('Agentes de IA');
  if (/openai/.test(text)) tags.add('OpenAI');
  if (/google|gemini/.test(text)) tags.add('Google');
  if (/microsoft/.test(text)) tags.add('Microsoft');
  if (/automation|workflow/.test(text)) tags.add('Automação');
  return [...tags].slice(0, 6);
}

function buildFaqs(item, headline) {
  const shortTitle = item.title.length > 80 ? `${item.title.slice(0, 77)}...` : item.title;
  return [
    {
      question: `O que mudou com: ${shortTitle}?`,
      answer: `${makeSummary(item)} ${whyItMatters(item)}`,
    },
    {
      question: 'Por que isso importa para negócios e profissionais?',
      answer: whyItMatters(item),
    },
    {
      question: 'Qual o próximo passo prático?',
      answer: practicalAction(item),
    },
  ];
}

function renderArticle(item, date, slug, imagePath) {
  const headline = translateAngle(item.title);
  const category = categorize(item);
  const description = `${makeSummary(item)} Leitura em português com impacto prático para quem aplica IA no trabalho.`.slice(0, 280);
  const tags = buildTags(item);
  const faqs = buildFaqs(item, headline);
  const readTime = `${Math.max(5, Math.min(9, Math.ceil((makeSummary(item).length + whyItMatters(item).length) / 900)))} min`;

  return `---
title: "${escapeYaml(headline)}"
description: "${escapeYaml(description)}"
category: "${escapeYaml(category)}"
author: "Nexora Systems"
date: ${date.iso}
readTime: "${readTime}"
featured: false
image: "${imagePath}"
tags:
${tags.map((tag) => `  - ${escapeYaml(tag)}`).join('\n')}
faq:
${faqs.map((faq) => `  - question: "${escapeYaml(faq.question)}"\n    answer: "${escapeYaml(faq.answer)}"`).join('\n')}
---

Esta notícia entrou no radar editorial do Tech Briefing porque conversa com **IA aplicada, automação e impacto real no trabalho** — não só com hype de lançamento.

**${headline}**

A matéria original foi publicada por **${item.source}**: [${item.title}](${item.url}).

## Resposta rápida

${whyItMatters(item)}

## O que aconteceu

${makeSummary(item)}

O ponto central não é repetir o comunicado da empresa. É entender **qual mudança de comportamento** essa notícia sinaliza no mercado.

## Por que isso importa agora

${whyItMatters(item)}

Se você lidera time, vende serviço ou constrói produto digital, vale perguntar:

- isso reduz custo operacional?
- isso muda expectativa do cliente?
- isso cria nova categoria de ferramenta?
- isso exige revisão de processo interno?

## O que fazer nos próximos 7 dias

${practicalAction(item)}

<div class="radar-action-box">
  <strong>Ação de 10 minutos</strong>
  <p>Abra a fonte original, identifique uma tarefa repetitiva do seu contexto que essa tecnologia poderia acelerar e escreva o fluxo em 3 passos: entrada, decisão e revisão humana.</p>
</div>

## Oportunidade possível

${opportunityAngle(item)}

## Leitura relacionada no Tech Briefing

- [Radar Tech de hoje](/artigos/radar-tech-${date.iso}/) — visão ampla das notícias do dia
- [Como criar agente de IA sem código](/artigos/como-criar-agente-ia-sem-codigo/)
- [Newsletter](/newsletter/) — curadoria diária para aplicar IA no negócio

## Fonte

**Fonte:** [${item.source}](${item.url})

---

Curadoria editorial gerada com automação do Tech Briefing. Consulte sempre a fonte original antes de tomar decisões de negócio.
`;
}

async function loadCoveredUrls(dateIso) {
  const covered = new Set();
  const urlPattern = /https?:\/\/[^\s)"'<>]+/gi;

  const files = (await readdir(OUT_DIR)).filter((file) => file.endsWith('.md'));
  for (const file of files) {
    const raw = await readFile(path.join(OUT_DIR, file), 'utf8');
    for (const match of raw.matchAll(urlPattern)) {
      covered.add(normalizeUrl(match[0]));
    }
  }

  const radarPath = path.join(OUT_DIR, `radar-tech-${dateIso}.md`);
  if (existsSync(radarPath)) {
    const radarRaw = await readFile(radarPath, 'utf8');
    for (const match of radarRaw.matchAll(urlPattern)) {
      covered.add(normalizeUrl(match[0]));
    }
  }

  return covered;
}

function pickUncoveredItem(items, covered) {
  let skippedForRadar = 0;
  for (const item of items) {
    const normalized = normalizeUrl(item.url);
    if (covered.has(normalized)) continue;

    if (skippedForRadar < SKIP_RADAR_TOP) {
      skippedForRadar += 1;
      continue;
    }

    return item;
  }

  for (const item of items) {
    const normalized = normalizeUrl(item.url);
    if (!covered.has(normalized)) return item;
  }

  return null;
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const date = todayParts();
  const items = await fetchRankedFeedItems();

  if (items.length === 0) {
    throw new Error('Nenhum item encontrado nos feeds.');
  }

  const covered = await loadCoveredUrls(date.iso);
  const item = pickUncoveredItem(items, covered);

  if (!item) {
    throw new Error('Nenhuma notícia nova encontrada (todas as fontes já foram cobertas).');
  }

  const slug = buildSlug(item, date.iso);
  const outputPath = path.join(OUT_DIR, `${slug}.md`);

  if (existsSync(outputPath) && !process.env.NEWS_OVERWRITE) {
    throw new Error(`Artigo já existe: ${outputPath}. Use NEWS_OVERWRITE=1 para sobrescrever.`);
  }

  const category = categorize(item);
  const resolved = await resolveArticleImage({
    slug,
    title: translateAngle(item.title),
    category,
    image: '',
    sourceUrl: item.url,
    rssImageUrl: item.imageUrl || '',
    apply: true,
    preferRemote: process.env.NEWS_SKIP_REMOTE !== '1',
  });

  const markdown = renderArticle(item, date, slug, resolved.path);
  await writeFile(outputPath, markdown, 'utf8');

  console.log(`[news] slug=${slug}`);
  console.log(`[news] path=${outputPath}`);
  console.log(`[news] image=${resolved.path} (${resolved.origin})`);
  console.log(`[news] score=${item.score} source=${item.source}`);
  console.log(`[news] title=${item.title}`);
  console.log(`[news] url=${item.url}`);
}

main().catch((error) => {
  console.error(`[news] ${error.message}`);
  process.exit(1);
});
