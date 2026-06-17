export function escapeXml(value = '') {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const CATEGORY_THEMES = {
  'agentes de ia': { label: 'AGENTES', hue: 190, accent: '#22d3ee', badge: '#ffb15c' },
  'agentes': { label: 'AGENTES', hue: 190, accent: '#22d3ee', badge: '#ffb15c' },
  'automação': { label: 'AUTOMACAO', hue: 145, accent: '#34d399', badge: '#ffb15c' },
  'automacao': { label: 'AUTOMACAO', hue: 145, accent: '#34d399', badge: '#ffb15c' },
  'ia prática': { label: 'IA PRATICA', hue: 260, accent: '#a78bfa', badge: '#ffb15c' },
  'ia pratica': { label: 'IA PRATICA', hue: 260, accent: '#a78bfa', badge: '#ffb15c' },
  'software': { label: 'SOFTWARE', hue: 300, accent: '#ff4da6', badge: '#ffb15c' },
  'comparativo': { label: 'COMPARATIVO', hue: 220, accent: '#60a5fa', badge: '#ffb15c' },
  'radar tech': { label: 'RADAR TECH', hue: 190, accent: '#22d3ee', badge: '#ffb15c' },
  'tendências': { label: 'TENDENCIAS', hue: 35, accent: '#fb923c', badge: '#ffb15c' },
  'tendencias': { label: 'TENDENCIAS', hue: 35, accent: '#fb923c', badge: '#ffb15c' },
  'mercado': { label: 'MERCADO', hue: 226, accent: '#ff4da6', badge: '#ffb15c' },
  'desenvolvimento': { label: 'DESENVOLVIMENTO', hue: 300, accent: '#ff4da6', badge: '#ffb15c' },
  'guia': { label: 'GUIA', hue: 200, accent: '#38bdf8', badge: '#ffb15c' },
  'tutorial': { label: 'TUTORIAL', hue: 160, accent: '#4ade80', badge: '#ffb15c' },
};

const TITLE_KEYWORDS = [
  [/agent|agentic|crew|langgraph|autogpt/i, 'agentes de ia'],
  [/automat|workflow|n8n|make|zapier/i, 'automação'],
  [/comparativ| vs |versus/i, 'comparativo'],
  [/radar/i, 'radar tech'],
  [/security|seguran|cyber|appsec/i, 'software'],
  [/robot|humanoid|genesis/i, 'ia prática'],
  [/funding|capex|mercado|enterprise|startup/i, 'mercado'],
  [/github|developer|codex|cursor|api|openai/i, 'desenvolvimento'],
  [/guia|tutorial|como /i, 'guia'],
];

export function categoryTheme(category = '', title = '') {
  const normalized = String(category || '').trim().toLowerCase();
  if (CATEGORY_THEMES[normalized]) return CATEGORY_THEMES[normalized];

  const text = `${category} ${title}`.toLowerCase();
  for (const [pattern, key] of TITLE_KEYWORDS) {
    if (pattern.test(text) && CATEGORY_THEMES[key]) return CATEGORY_THEMES[key];
  }

  return { label: 'TECNOLOGIA', hue: 226, accent: '#ff4da6', badge: '#ffb15c' };
}

export function wrapTitleLines(title, maxChars = 34, maxLines = 4) {
  const words = String(title || '').trim().split(/\s+/).filter(Boolean);
  const lines = [];
  let current = '';

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length <= maxChars) {
      current = next;
      continue;
    }
    if (current) lines.push(current);
    current = word;
    if (lines.length >= maxLines - 1) break;
  }

  if (current) lines.push(current);
  if (lines.length > maxLines) return lines.slice(0, maxLines);

  const usedWords = lines.join(' ').split(/\s+/).length;
  if (usedWords < words.length && lines.length === maxLines) {
    lines[maxLines - 1] = `${lines[maxLines - 1].replace(/\.*$/, '')}…`;
  }

  return lines.length ? lines : ['Tech Briefing'];
}

export function renderNewsCover({ title, category = '', source = 'TECH BRIEFING', slug = '' }) {
  const theme = categoryTheme(category, title);
  const lines = wrapTitleLines(title);
  const badgeWidth = Math.max(180, theme.label.length * 11 + 48);
  const footer = source ? `TECH BRIEFING · ${String(source).toUpperCase()}` : 'TECH BRIEFING';
  const safeTitle = escapeXml(title);
  const safeSlug = escapeXml(slug);

  const tspans = lines
    .map((line, index) => `<tspan x="0" y="${index * 74}">${escapeXml(line)}</tspan>`)
    .join('\n      ');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675" role="img" aria-labelledby="title desc">
  <title id="title">${safeTitle}</title>
  <desc id="desc">Capa editorial Tech Briefing${safeSlug ? ` para ${safeSlug}` : ''}.</desc>
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#05070a"/>
      <stop offset="0.55" stop-color="#0c1016"/>
      <stop offset="1" stop-color="#12141b"/>
    </linearGradient>
    <radialGradient id="glow" cx="68%" cy="38%" r="55%">
      <stop offset="0" stop-color="hsl(${theme.hue} 86% 62% / .45)"/>
      <stop offset=".48" stop-color="hsl(${theme.hue} 86% 48% / .12)"/>
      <stop offset="1" stop-color="transparent"/>
    </radialGradient>
    <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
      <path d="M48 0H0v48" fill="none" stroke="#ffffff" stroke-opacity=".055"/>
    </pattern>
  </defs>
  <rect width="1200" height="675" fill="url(#bg)"/>
  <rect width="1200" height="675" fill="url(#grid)"/>
  <rect width="1200" height="675" fill="url(#glow)"/>
  <g opacity=".68" stroke="${theme.accent}" stroke-width="2" fill="none">
    <path d="M80 500 C220 420 270 560 410 470 S650 330 780 390 960 520 1120 410"/>
    <path d="M830 95 h170 v80 h92"/>
    <path d="M910 560 h-150 v-85 h-120"/>
    <circle cx="1002" cy="175" r="7" fill="${theme.accent}"/>
    <circle cx="640" cy="475" r="7" fill="${theme.accent}"/>
  </g>
  <g transform="translate(78 82)">
    <rect x="0" y="0" width="${badgeWidth}" height="38" rx="19" fill="${theme.badge}" fill-opacity=".12" stroke="${theme.badge}" stroke-opacity=".65"/>
    <text x="20" y="25" fill="${theme.badge}" font-family="JetBrains Mono, Consolas, monospace" font-size="15" font-weight="700" letter-spacing="2">${theme.label}</text>
  </g>
  <g transform="translate(78 176)">
    <text fill="#f7f4ee" font-family="Georgia, 'Times New Roman', serif" font-weight="700" font-size="64" letter-spacing="-2">
      ${tspans}
    </text>
  </g>
  <g transform="translate(78 565)">
    <text fill="#9ca3af" font-family="JetBrains Mono, Consolas, monospace" font-size="18" letter-spacing="1.4">${escapeXml(footer)}</text>
  </g>
</svg>`;
}

export function renderRadarCover({ title, dateLabel, items = [] }) {
  const topTitle = escapeXml(title);
  const date = escapeXml(dateLabel);
  const counts = { agents: 0, automation: 0, business: 0 };

  for (const item of items) {
    const text = `${item.title || ''} ${item.summary || ''}`.toLowerCase();
    if (/agent|agentic|voice|assistant/.test(text)) counts.agents += 1;
    if (/automation|workflow|process|robot|deploy|api/.test(text)) counts.automation += 1;
    if (/business|enterprise|funding|startup|customer|revenue|market/.test(text)) counts.business += 1;
  }

  const max = Math.max(1, items.length);
  const bars = [
    ['AGENTES', counts.agents, '#22d3ee', '#0891b2'],
    ['AUTOMACAO', counts.automation, '#ffb15f', '#ea580c'],
    ['NEGOCIOS', counts.business, '#ff4ab8', '#db2777'],
  ];

  return `<svg width="1200" height="675" viewBox="0 0 1200 675" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="title desc">
  <title id="title">Radar Tech ${date}</title>
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
  <g opacity=".08">
    <path d="M0 96H1200M0 192H1200M0 288H1200M0 384H1200M0 480H1200M0 576H1200" stroke="#4b5563" stroke-width="1"/>
    <path d="M96 0V675M192 0V675M288 0V675M384 0V675M480 0V675M576 0V675M672 0V675M768 0V675M864 0V675M960 0V675M1056 0V675" stroke="#4b5563" stroke-width="1"/>
  </g>
  <rect x="72" y="60" width="1056" height="555" rx="24" fill="#090d16" fill-opacity="0.8" stroke="url(#card-stroke)" stroke-width="2"/>
  <text x="112" y="122" fill="#ffb15f" class="txt-mono" font-size="14" letter-spacing="4">TECH BRIEFING / RADAR ${date}</text>
  <text x="112" y="195" fill="#f8fafc" class="txt-title" font-size="52" letter-spacing="-0.02em">3 ideias para aplicar</text>
  <text x="112" y="250" fill="#94a3b8" class="txt-title" font-size="52" letter-spacing="-0.02em">antes que vire hype.</text>
  <foreignObject x="112" y="295" width="610" height="115">
    <div xmlns="http://www.w3.org/1999/xhtml" style="font-family:'Plus Jakarta Sans', sans-serif; color:#f1f5f9; font-size:22px; line-height:1.45; font-weight:700; border-left:4px solid #22d3ee; padding-left:18px;">
      ${topTitle}
    </div>
  </foreignObject>
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
  <g transform="translate(780 164)">
    <rect width="276" height="318" rx="24" fill="#0f172a" fill-opacity="0.6" stroke="url(#card-stroke)" stroke-width="1.5"/>
    <circle cx="138" cy="135" r="70" fill="#22d3ee" fill-opacity="0.03" filter="blur(20px)"/>
    <path d="M68 214C108 150 168 154 208 74" stroke="url(#hot)" stroke-width="6" stroke-linecap="round"/>
    <circle cx="68" cy="214" r="12" fill="#22d3ee" stroke="#090d16" stroke-width="2"/>
    <circle cx="208" cy="74" r="12" fill="#ff4ab8" stroke="#090d16" stroke-width="2"/>
    <circle cx="138" cy="144" r="36" fill="#0b0f19" stroke="#ffb15f" stroke-width="3"/>
    <path d="M138 128 L128 146 H138 L134 160 L148 140 H138 Z" fill="#ffb15f" stroke="#ffb15f" stroke-width="1" stroke-linejoin="round"/>
    <text x="138" y="258" fill="#f8fafc" class="txt-title" font-size="24" text-anchor="middle">Ideia vira ação</text>
    <text x="138" y="282" fill="#64748b" class="txt-body" font-size="13" text-anchor="middle">Prática diária de IA</text>
  </g>
</svg>`;
}

export function renderCover(options) {
  if (options.variant === 'radar') return renderRadarCover(options);
  return renderNewsCover(options);
}
