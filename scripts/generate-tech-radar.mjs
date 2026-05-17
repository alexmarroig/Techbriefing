import { mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, 'src', 'content', 'articles');
const OUT_IMAGE_DIR = path.join(ROOT, 'public', 'images', 'radar');
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

function escapeXml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
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

function signalCounts(items) {
  const counters = { agents: 0, automation: 0, business: 0 };
  for (const item of items) {
    const text = `${item.title} ${item.summary || ''}`.toLowerCase();
    if (/agent|agentic|voice|assistant/.test(text)) counters.agents += 1;
    if (/automation|workflow|process|robot|deploy|api/.test(text)) counters.automation += 1;
    if (/business|enterprise|funding|startup|customer|revenue|market/.test(text)) counters.business += 1;
  }
  return counters;
}

function practicalAction(item) {
  const text = `${item.title} ${item.summary || ''}`.toLowerCase();
  if (/agent|agentic|voice|assistant/.test(text)) {
    return 'Liste um atendimento, resposta ou análise repetitiva que hoje depende de você e desenhe quais dados um agente precisaria acessar.';
  }
  if (/automation|workflow|api|deploy/.test(text)) {
    return 'Escolha um fluxo manual de 3 passos e escreva como ele ficaria em gatilho, ação e revisão humana.';
  }
  if (/security|governance|risk/.test(text)) {
    return 'Revise uma automação ou uso de IA atual e defina onde a aprovação humana continua obrigatória.';
  }
  if (/funding|startup|market|enterprise/.test(text)) {
    return 'Transforme a tendência em oferta: qual problema pequeno você poderia resolver para um cliente usando essa tecnologia?';
  }
  return 'Anote uma forma concreta de transformar essa notícia em teste, processo, conteúdo ou oferta nos próximos 7 dias.';
}

function opportunityAngle(item) {
  const text = `${item.title} ${item.summary || ''}`.toLowerCase();
  if (/voice|customer|support|call/.test(text)) return 'Pacote de atendimento com IA para pequenos negócios que perdem vendas por demora na resposta.';
  if (/coding|developer|github|claude code/.test(text)) return 'Serviço de automação interna: transformar tarefas repetidas de planilha, e-mail e relatório em fluxos assistidos por IA.';
  if (/security|governance/.test(text)) return 'Diagnóstico simples de risco em IA: mapear onde a empresa usa IA sem regra, revisão ou registro.';
  if (/robot|physical/.test(text)) return 'Conteúdo educativo para setores tradicionais explicando como IA operacional reduz retrabalho antes de chegar na robótica.';
  return 'Newsletter, consultoria rápida ou mini-guia explicando como aplicar essa tendência em um nicho específico.';
}

function renderSignalBoard(items) {
  const counts = signalCounts(items);
  const max = Math.max(1, items.length);
  const data = [
    ['Agentes', counts.agents, 'Ideias sobre IA executando tarefas'],
    ['Automação', counts.automation, 'Ideias sobre fluxos, APIs e operação'],
    ['Negócios', counts.business, 'Ideias sobre mercado, clientes e renda'],
  ];

  return `<div class="radar-signal-board">
  <h3>Painel visual do dia</h3>
  <div class="radar-signal-grid">
${data.map(([label, value, desc]) => `    <div class="radar-signal-card">
      <div class="radar-signal-label">${label}</div>
      <div class="radar-signal-value">${value}/${max}</div>
      <div class="radar-signal-bar"><span style="width:${Math.max(12, Math.round((value / max) * 100))}%"></span></div>
      <p>${desc}</p>
    </div>`).join('\n')}
  </div>
</div>`;
}

function renderRadarImage(items, date) {
  const top = items[0];
  const counts = signalCounts(items);
  const max = Math.max(1, items.length);
  const topTitle = escapeXml(translateAngle(top.title));
  const dateLabel = escapeXml(date.iso);
  const bars = [
    ['AGENTES', counts.agents, '#22d3ee', '#0891b2'],
    ['AUTOMACAO', counts.automation, '#ffb15f', '#ea580c'],
    ['NEGOCIOS', counts.business, '#ff4ab8', '#db2777'],
  ];

  return `<svg width="1200" height="675" viewBox="0 0 1200 675" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="title desc">
  <title id="title">Radar Tech ${dateLabel}</title>
  <desc id="desc">Painel editorial visual com principais notícias e ideias de tecnologia do dia.</desc>
  <defs>
    <radialGradient id="glow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(942 130) rotate(142) scale(820 560)">
      <stop stop-color="#22d3ee" stop-opacity=".22"/>
      <stop offset=".42" stop-color="#ffb15f" stop-opacity=".12"/>
      <stop offset="1" stop-color="#02040a" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="hot" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="#22d3ee"/>
      <stop offset=".5" stop-color="#ffb15f"/>
      <stop offset="1" stop-color="#ff4ab8"/>
    </linearGradient>
    <linearGradient id="card-stroke" x1="0" y1="0" x2="0" y2="1">
      <stop stop-color="#334155" stop-opacity="0.5"/>
      <stop offset="1" stop-color="#1e293b" stop-opacity="0.2"/>
    </linearGradient>
  </defs>
  
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;700;800&amp;family=Space+Grotesk:wght@500;700&amp;family=JetBrains+Mono:wght@600;800&amp;display=swap');
    .txt-title { font-family: 'Space Grotesk', -apple-system, sans-serif; font-weight: 700; }
    .txt-body { font-family: 'Plus Jakarta Sans', -apple-system, sans-serif; font-weight: 700; }
    .txt-mono { font-family: 'JetBrains Mono', monospace; font-weight: 800; }
  </style>

  <rect width="1200" height="675" fill="#030712"/>
  <rect width="1200" height="675" fill="url(#glow)"/>
  
  <!-- Subtle Grid -->
  <g opacity=".08">
    <path d="M0 96H1200M0 192H1200M0 288H1200M0 384H1200M0 480H1200M0 576H1200" stroke="#4b5563" stroke-width="1"/>
    <path d="M96 0V675M192 0V675M288 0V675M384 0V675M480 0V675M576 0V675M672 0V675M768 0V675M864 0V675M960 0V675M1056 0V675" stroke="#4b5563" stroke-width="1"/>
  </g>
  
  <!-- Outer Frame -->
  <rect x="72" y="60" width="1056" height="555" rx="24" fill="#090d16" fill-opacity="0.8" stroke="url(#card-stroke)" stroke-width="2"/>
  
  <!-- Header elements -->
  <text x="112" y="122" fill="#ffb15f" class="txt-mono" font-size="14" letter-spacing="4">TECH BRIEFING / RADAR ${dateLabel}</text>
  
  <text x="112" y="195" fill="#f8fafc" class="txt-title" font-size="52" letter-spacing="-0.02em">3 ideias para aplicar</text>
  <text x="112" y="250" fill="#94a3b8" class="txt-title" font-size="52" letter-spacing="-0.02em">antes que vire hype.</text>
  
  <!-- Headline box -->
  <foreignObject x="112" y="295" width="610" height="115">
    <div xmlns="http://www.w3.org/1999/xhtml" style="font-family:'Plus Jakarta Sans', sans-serif; color:#f1f5f9; font-size:22px; line-height:1.45; font-weight:700; border-left:4px solid #22d3ee; padding-left:18px;">
      ${topTitle}
    </div>
  </foreignObject>
  
  <!-- Progress Bars -->
  <g transform="translate(112 458)">
${bars.map(([label, value, color, colorDark], index) => {
    const width = Math.max(58, Math.round((value / max) * 340));
    const y = index * 48;
    return `    <text x="0" y="${y + 16}" fill="#94a3b8" class="txt-mono" font-size="13" letter-spacing="2">${label}</text>
    <rect x="140" y="${y}" width="360" height="20" rx="10" fill="#1e293b" />
    <rect x="140" y="${y}" width="${width}" height="20" rx="10" fill="url(#grad-${index})"/>
    <text x="524" y="${y + 16}" fill="#f8fafc" class="txt-mono" font-size="14" font-weight="800">${value}/${max}</text>
    
    <defs>
      <linearGradient id="grad-${index}" x1="0" y1="0" x2="1" y2="0">
        <stop stop-color="${color}"/>
        <stop offset="1" stop-color="${colorDark}"/>
      </linearGradient>
    </defs>`;
  }).join('\n')}
  </g>
  
  <!-- Interactive Side Widget -->
  <g transform="translate(780 164)">
    <!-- Widget Container -->
    <rect width="276" height="318" rx="24" fill="#0f172a" fill-opacity="0.6" stroke="url(#card-stroke)" stroke-width="1.5"/>
    
    <!-- Decorative Glowing Elements -->
    <circle cx="138" cy="135" r="70" fill="#22d3ee" fill-opacity="0.03" filter="blur(20px)"/>
    
    <!-- Flow Graph -->
    <path d="M68 214C108 150 168 154 208 74" stroke="url(#hot)" stroke-width="6" stroke-linecap="round"/>
    
    <!-- Node circles -->
    <circle cx="68" cy="214" r="12" fill="#22d3ee" stroke="#090d16" stroke-width="2"/>
    <circle cx="208" cy="74" r="12" fill="#ff4ab8" stroke="#090d16" stroke-width="2"/>
    
    <!-- Action Node -->
    <circle cx="138" cy="144" r="36" fill="#0b0f19" stroke="#ffb15f" stroke-width="3"/>
    
    <!-- Little Action Bolt Icon inside Circle -->
    <path d="M138 128 L128 146 H138 L134 160 L148 140 H138 Z" fill="#ffb15f" stroke="#ffb15f" stroke-width="1" stroke-linejoin="round"/>
    
    <text x="138" y="258" fill="#f8fafc" class="txt-title" font-size="24" text-anchor="middle">Ideia vira ação</text>
    <text x="138" y="282" fill="#64748b" class="txt-body" font-size="13" text-anchor="middle">Prática diária de IA</text>
  </g>
</svg>`;
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

function renderMarkdown(items, date, imagePath) {
  const top = items[0];
  const title = `Radar Tech: ${items.length} movimentos de IA e tecnologia para acompanhar`;
  const description = `Uma curadoria em português com as notícias de tecnologia mais relevantes do dia, traduzidas em impacto prático, oportunidade e próximo passo.`;
  const tags = [...new Set(items.flatMap((item) => [categorize(item), item.source]).slice(0, 8))];

  return `---
title: "${escapeYaml(title)}"
description: "${escapeYaml(description)}"
category: "Radar Tech"
author: "Nexora Systems"
date: ${date.iso}
readTime: "${Math.max(6, Math.ceil(items.length * 1.1))} min"
featured: true
image: "${imagePath}"
tags:
${tags.map((tag) => `  - ${tag}`).join('\n')}
---

Este é o Radar Tech do dia: uma curadoria das notícias e discussões que mais importam para quem quer transformar IA, automação e tecnologia em produtividade, negócio e renda.

A ideia aqui não é traduzir a internet inteira. É separar sinal de ruído e mostrar o que você pode aplicar, testar ou transformar em oferta.

${renderSignalBoard(items)}

## Manchete do dia

**${translateAngle(top.title)}.**

A notícia que mais chamou atenção no radar foi: [${top.title}](${top.url}), publicada/destacada em ${top.source}. ${whyItMatters(top)}

<div class="radar-action-box">
  <strong>Ação de 10 minutos</strong>
  <p>${practicalAction(top)}</p>
</div>

## Principais movimentos

${items.map((item, index) => `### ${index + 1}. ${translateAngle(item.title)}

**Fonte:** [${item.source}](${item.url})  
**Título em português:** ${translateAngle(item.title)}  
**Título original:** ${item.title}

${makeSummary(item)}

**Por que importa:** ${whyItMatters(item)}

**Leitura prática:** se isso toca seu mercado, pense em qual processo poderia ser melhorado com uma camada de IA: atendimento, análise, suporte, criação, revisão, monitoramento ou venda.

**Ação sugerida:** ${practicalAction(item)}

**Oportunidade possível:** ${opportunityAngle(item)}
`).join('\n')}

## O padrão que aparece nas notícias

O fio comum é simples: IA está migrando de ferramenta isolada para infraestrutura de operação. As empresas mais rápidas não estão apenas testando prompts. Elas estão conectando modelos a processos, dados, atendimento, desenvolvimento e tomada de decisão.

Para negócios menores, isso abre uma janela interessante: dá para aplicar a mesma lógica em escala menor, começando por um fluxo repetitivo e mensurável.

## Mini-manual: como transformar esse radar em ação

Use este processo sempre que uma notícia parecer importante, mas ainda abstrata:

1. **Traduza a notícia em problema.** Quem está ganhando tempo, reduzindo custo ou vendendo melhor com isso?
2. **Encontre o processo equivalente no seu contexto.** Atendimento, vendas, relatório, criação, suporte, pesquisa ou operação.
3. **Desenhe o fluxo simples.** Entrada, decisão, ferramenta, saída e revisão humana.
4. **Teste pequeno.** Uma automação, um prompt operacional, uma página, um serviço ou um conteúdo.
5. **Meça o resultado.** Tempo economizado, erro reduzido, lead gerado, resposta enviada ou venda influenciada.

Se você seguir esses passos, a notícia deixa de ser curiosidade e começa a virar estratégia.

## Radar de oportunidades

- **Para pequenos negócios:** escolha uma tarefa que o dono faz toda semana e transforme em checklist automatizável.
- **Para freelancers:** empacote uma dessas tendências como serviço simples: diagnóstico, automação, setup ou treinamento.
- **Para criadores:** transforme o tema mais forte do dia em post, carrossel, roteiro curto ou newsletter de nicho.
- **Para profissionais:** use o assunto para propor uma melhoria concreta no seu trabalho antes que alguém peça.

## Próximo passo

Se você quer receber esse tipo de leitura todos os dias, assine a [newsletter do Tech Briefing](/newsletter/). Se quer ir direto para execução com agentes, veja o ebook [Agentes de IA para Negócios](/ebook-agentes-ia/).

---

Curadoria gerada com apoio de automação editorial do Tech Briefing. Sempre consulte as fontes originais antes de tomar decisões de negócio.
`;
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  await mkdir(OUT_IMAGE_DIR, { recursive: true });
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
  const imageFilename = `radar-tech-${date.iso}.svg`;
  const imageOutputPath = path.join(OUT_IMAGE_DIR, imageFilename);
  const imagePublicPath = `/images/radar/${imageFilename}`;
  if (existsSync(outputPath) && !process.env.RADAR_OVERWRITE) {
    throw new Error(`Arquivo já existe: ${outputPath}. Use RADAR_OVERWRITE=1 para sobrescrever.`);
  }

  await writeFile(imageOutputPath, renderRadarImage(allItems, date), 'utf8');
  await writeFile(outputPath, renderMarkdown(allItems, date, imagePublicPath), 'utf8');

  console.log(`[radar] ${allItems.length} itens selecionados.`);
  for (const item of allItems) {
    console.log(`- (${item.score}) ${item.source}: ${item.title}`);
  }
  console.log(`[radar] Post gerado: ${outputPath}`);
  console.log(`[radar] Imagem gerada: ${imageOutputPath}`);
}

main().catch((error) => {
  console.error(`[radar] ${error.message}`);
  process.exit(1);
});
