import { mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, 'src', 'content', 'articles');
const MAX_ITEMS = Number(process.env.RADAR_MAX_ITEMS || 12);
const HN_LIMIT = Number(process.env.RADAR_HN_LIMIT || 35);

const SOURCES = [
  { name: 'TechCrunch AI', type: 'rss', url: 'https://techcrunch.com/category/artificial-intelligence/feed/' },
  { name: 'The Verge', type: 'rss', url: 'https://www.theverge.com/rss/index.xml' },
  { name: 'Ars Technica', type: 'rss', url: 'https://feeds.arstechnica.com/arstechnica/technology-lab' },
  { name: 'MIT Technology Review AI', type: 'rss', url: 'https://www.technologyreview.com/topic/artificial-intelligence/feed/' },
  { name: 'VentureBeat AI', type: 'rss', url: 'https://venturebeat.com/category/ai/feed/' },
  { name: 'OpenAI News', type: 'rss', url: 'https://openai.com/news/rss.xml' },
  { name: 'Google AI Blog', type: 'rss', url: 'https://blog.google/technology/ai/rss/' },
  { name: 'Microsoft AI Blog', type: 'rss', url: 'https://blogs.microsoft.com/ai/feed/' },
  { name: 'GitHub Blog', type: 'rss', url: 'https://github.blog/feed/' },
];

const KEYWORDS = [
  ['agent', 16], ['agents', 16], ['agentic', 16], ['ai agent', 18],
  ['artificial intelligence', 12], ['ai', 8], ['machine learning', 8],
  ['automation', 12], ['workflow', 10], ['enterprise', 10], ['customer', 8],
  ['voice', 9], ['robot', 9], ['robotics', 10], ['openai', 9], ['anthropic', 9],
  ['google', 5], ['microsoft', 5], ['github', 5], ['startup', 5],
  ['funding', 5], ['model', 7], ['llm', 8], ['claude', 8], ['chatgpt', 8],
  ['security', 7], ['developer', 6], ['api', 6], ['business', 8],
];

const STOP_DOMAINS = new Set([
  'youtube.com',
  'youtu.be',
]);

function todayParts() {
  const timeZone = process.env.RADAR_TIMEZONE || 'America/Sao_Paulo';
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  const yyyy = values.year;
  const mm = values.month;
  const dd = values.day;
  return { yyyy, mm, dd, iso: `${yyyy}-${mm}-${dd}` };
}

function stripHtml(value = '') {
  return decodeEntities(value)
    .replace(/<!\[CDATA\[|\]\]>/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function decodeEntities(value = '') {
  return value
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(parseInt(dec, 10)))
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8211;/g, '-')
    .replace(/&#8212;/g, '-');
}

function slugify(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 70);
}

function escapeYaml(value) {
  return String(value).replace(/"/g, '\\"');
}

function getDomain(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

function scoreItem(item) {
  const text = `${item.title} ${item.summary || ''} ${item.source}`.toLowerCase();
  let score = item.points ? Math.min(item.points / 8, 30) : 0;
  for (const [keyword, weight] of KEYWORDS) {
    if (text.includes(keyword)) score += weight;
  }
  if (/launch|raises|acquires|announces|new|security|enterprise|agent/i.test(text)) score += 6;
  if (/deal|coupon|black friday|sponsored/i.test(text)) score -= 12;
  return Math.round(score);
}

function categorize(item) {
  const text = `${item.title} ${item.summary || ''}`.toLowerCase();
  if (text.includes('agent') || text.includes('agentic') || text.includes('voice')) return 'Agentes de IA';
  if (text.includes('robot')) return 'IA Prática';
  if (text.includes('automation') || text.includes('workflow')) return 'Automação';
  if (text.includes('security')) return 'Software';
  return 'IA Prática';
}

function translateAngle(title) {
  const lower = title.toLowerCase();
  if (lower.includes('slackbot')) return 'O Slackbot virou agente: o escritório está entrando na era da IA operacional';
  if (lower.includes('claude code')) return 'A guerra dos agentes de programação está ficando mais barata e mais intensa';
  if (lower.includes('cowork')) return 'Agentes de desktop começam a chegar para usuários não técnicos';
  if (lower.includes('railway')) return 'A infraestrutura de cloud está sendo redesenhada para a era da IA';
  if (lower.includes('token efficiency')) return 'Eficiência de tokens virou vantagem competitiva em agentes';
  if (lower.includes('state machine')) return 'Máquinas de estado podem deixar agentes de IA mais confiáveis';
  if (lower.includes('analytics for ai agents')) return 'Medição e analytics viraram camada obrigatória para agentes';
  if (lower.includes('vibe coding')) return 'Vibe coding está virando método de aprendizado para agentes';
  if (lower.includes('agent') || lower.includes('agentic')) return 'Agentes de IA entram em uma nova fase operacional';
  if (lower.includes('voice')) return 'IA de voz começa a virar atendimento real';
  if (lower.includes('robot')) return 'Robótica com IA volta ao centro da disputa';
  if (lower.includes('raise') || lower.includes('funding') || lower.includes('valuation')) return 'Capital está correndo para infraestrutura de IA';
  if (lower.includes('security')) return 'Segurança vira tema central na adoção de IA';
  if (lower.includes('developer') || lower.includes('github')) return 'Desenvolvedores estão ganhando novas ferramentas com IA';
  if (lower.includes('openai') || lower.includes('anthropic') || lower.includes('google')) return 'Big tech acelera a disputa por IA aplicada';
  return 'O movimento merece atenção de quem usa tecnologia no negócio';
}

function whyItMatters(item) {
  const text = `${item.title} ${item.summary || ''}`.toLowerCase();
  if (text.includes('coding') || text.includes('developer') || text.includes('github') || text.includes('claude code')) {
    return 'Ferramentas de desenvolvimento com IA estão deixando de ser autocomplete e virando agentes que planejam, editam, testam e monitoram trabalho.';
  }
  if (text.includes('cloud') || text.includes('infrastructure')) {
    return 'A adoção de IA cria pressão por infraestrutura mais simples, barata e pronta para deploys rápidos de agentes e automações.';
  }
  if (text.includes('analytics') || text.includes('token efficiency')) {
    return 'Agentes só escalam quando podem ser medidos, depurados e otimizados. Observabilidade deixa de ser detalhe técnico.';
  }
  if (text.includes('state machine')) {
    return 'Confiabilidade é um gargalo real em agentes. Estruturas como máquinas de estado ajudam a reduzir improviso e comportamento imprevisível.';
  }
  if (text.includes('agent') || text.includes('voice')) {
    return 'Mostra que a próxima onda não é só conversar com IA, mas colocar agentes para executar partes reais da operação.';
  }
  if (text.includes('robot')) {
    return 'Indica que a IA está saindo da tela e indo para sistemas que precisam perceber, decidir e agir no mundo físico.';
  }
  if (text.includes('funding') || text.includes('valuation') || text.includes('raises')) {
    return 'Quando capital pesado entra no setor, normalmente há uma tese clara de produtividade, infraestrutura ou redução de custo.';
  }
  if (text.includes('security')) {
    return 'Quanto mais IA entra no fluxo de trabalho, maior fica a necessidade de governança, segurança e revisão humana.';
  }
  return 'Ajuda a separar tendência útil de hype e aponta onde podem surgir novas oportunidades de automação, conteúdo ou produto.';
}

function makeSummary(item) {
  const clean = stripHtml(item.summary || '');
  if (clean.length > 70) return clean.slice(0, 260).replace(/\s+\S*$/, '') + '.';
  return `${item.source} publicou ou destacou: "${item.title}". O tema entra no radar porque conversa com IA aplicada, automação e negócios digitais.`;
}

async function fetchJson(url) {
  const res = await fetch(url, { headers: { 'user-agent': 'TechBriefingRadar/1.0' } });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

async function fetchText(url) {
  const res = await fetch(url, { headers: { 'user-agent': 'TechBriefingRadar/1.0' } });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.text();
}

function parseRss(xml, sourceName) {
  const blocks = [...xml.matchAll(/<item\b[\s\S]*?<\/item>|<entry\b[\s\S]*?<\/entry>/gi)].map((m) => m[0]);
  return blocks.map((block) => {
    const title = stripHtml(matchTag(block, 'title'));
    const link = stripHtml(matchTag(block, 'link')) || matchAtomLink(block);
    const summary = stripHtml(matchTag(block, 'description') || matchTag(block, 'summary') || matchTag(block, 'content:encoded'));
    const pubDate = stripHtml(matchTag(block, 'pubDate') || matchTag(block, 'updated') || matchTag(block, 'published'));
    return { title, url: link, summary, source: sourceName, publishedAt: pubDate };
  }).filter((item) => item.title && item.url);
}

function matchTag(block, tag) {
  const safe = tag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = block.match(new RegExp(`<${safe}[^>]*>([\\s\\S]*?)<\\/${safe}>`, 'i'));
  return match?.[1] || '';
}

function matchAtomLink(block) {
  const match = block.match(/<link[^>]+href=["']([^"']+)["'][^>]*>/i);
  return match?.[1] || '';
}

async function getHackerNewsItems() {
  try {
    const ids = await fetchJson('https://hacker-news.firebaseio.com/v0/topstories.json');
    const selected = ids.slice(0, HN_LIMIT);
    const items = await Promise.allSettled(
      selected.map((id) => fetchJson(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)),
    );
    return items
      .filter((result) => result.status === 'fulfilled')
      .map((result) => result.value)
      .filter((item) => item?.title && item?.url)
      .map((item) => ({
        title: item.title,
        url: item.url,
        summary: `Discussão em alta no Hacker News com ${item.score || 0} pontos e ${item.descendants || 0} comentários.`,
        source: 'Hacker News',
        points: item.score || 0,
        comments: item.descendants || 0,
      }));
  } catch (error) {
    console.warn(`[radar] Hacker News falhou: ${error.message}`);
    return [];
  }
}

async function getRssItems() {
  const results = await Promise.allSettled(
    SOURCES.map(async (source) => parseRss(await fetchText(source.url), source.name)),
  );
  return results.flatMap((result, index) => {
    if (result.status === 'fulfilled') return result.value.slice(0, 8);
    console.warn(`[radar] ${SOURCES[index].name} falhou: ${result.reason.message}`);
    return [];
  });
}

function dedupe(items) {
  const seen = new Set();
  const clean = [];
  for (const item of items) {
    const domain = getDomain(item.url);
    if (STOP_DOMAINS.has(domain)) continue;
    const key = `${domain}:${slugify(item.title).slice(0, 45)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    clean.push(item);
  }
  return clean;
}

function renderMarkdown(items, date) {
  const top = items[0];
  const title = `Radar Tech: ${items.length} movimentos de IA e tecnologia para acompanhar`;
  const description = `Uma curadoria em português com as notícias de tecnologia mais relevantes do dia e o que elas significam para IA, automação e negócios digitais.`;
  const tags = [...new Set(items.flatMap((item) => [categorize(item), item.source]).slice(0, 8))];

  return `---
title: "${escapeYaml(title)}"
description: "${escapeYaml(description)}"
category: "Radar Tech"
author: "Nexora Systems"
date: ${date.iso}
readTime: "${Math.max(6, Math.ceil(items.length * 1.1))} min"
featured: true
image: "/images/article-scenario.png"
tags:
${tags.map((tag) => `  - ${tag}`).join('\n')}
---

Este é o Radar Tech do dia: uma curadoria das notícias e discussões que mais importam para quem acompanha IA aplicada, automação, agentes, software e negócios digitais.

A ideia aqui não é traduzir a internet inteira. É separar sinal de ruído e explicar, em português direto, o que pode virar oportunidade, risco ou mudança prática.

## Manchete do dia

**${translateAngle(top.title)}.**

A notícia que mais chamou atenção no radar foi: [${top.title}](${top.url}), publicada/destacada em ${top.source}. ${whyItMatters(top)}

## Principais movimentos

${items.map((item, index) => `### ${index + 1}. ${translateAngle(item.title)}

**Fonte:** [${item.source}](${item.url})  
**Título em português:** ${translateAngle(item.title)}  
**Título original:** ${item.title}

${makeSummary(item)}

**Por que importa:** ${whyItMatters(item)}

**Leitura prática:** se isso toca seu mercado, pense em qual processo poderia ser melhorado com uma camada de IA: atendimento, análise, suporte, criação, revisão, monitoramento ou venda.
`).join('\n')}

## O padrão que aparece nas notícias

O fio comum é simples: IA está migrando de ferramenta isolada para infraestrutura de operação. As empresas mais rápidas não estão apenas testando prompts. Elas estão conectando modelos a processos, dados, atendimento, desenvolvimento e tomada de decisão.

Para negócios menores, isso abre uma janela interessante: dá para aplicar a mesma lógica em escala menor, começando por um fluxo repetitivo e mensurável.

## Como transformar esse radar em ação

Escolha uma notícia da lista e responda:

- qual processo do meu negócio parece com esse movimento?
- existe uma tarefa repetida que poderia virar agente?
- qual dado ou ferramenta esse agente precisaria acessar?
- onde a revisão humana continua obrigatória?
- qual métrica provaria que a automação funcionou?

Se você responder essas perguntas, a notícia deixa de ser curiosidade e começa a virar estratégia.

## Próximo passo

Se você quer aprender a estruturar agentes de IA com método, veja o ebook [Agentes de IA para Negócios](/ebook-agentes-ia/). Ele foi feito para transformar esse tipo de tendência em aplicação real.

---

Curadoria gerada com apoio de automação editorial do Tech Briefing. Sempre consulte as fontes originais antes de tomar decisões de negócio.
`;
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const date = todayParts();
  const allItems = dedupe([...(await getHackerNewsItems()), ...(await getRssItems())])
    .map((item) => ({ ...item, score: scoreItem(item) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_ITEMS);

  if (allItems.length < 3) {
    throw new Error(`Poucos itens encontrados para gerar radar (${allItems.length}).`);
  }

  const filename = `radar-tech-${date.iso}.md`;
  const outputPath = path.join(OUT_DIR, filename);
  if (existsSync(outputPath) && !process.env.RADAR_OVERWRITE) {
    throw new Error(`Arquivo já existe: ${outputPath}. Use RADAR_OVERWRITE=1 para sobrescrever.`);
  }

  await writeFile(outputPath, renderMarkdown(allItems, date), 'utf8');

  console.log(`[radar] ${allItems.length} itens selecionados.`);
  for (const item of allItems) {
    console.log(`- (${item.score}) ${item.source}: ${item.title}`);
  }
  console.log(`[radar] Post gerado: ${outputPath}`);
}

main().catch((error) => {
  console.error(`[radar] ${error.message}`);
  process.exit(1);
});
