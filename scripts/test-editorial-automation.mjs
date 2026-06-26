import assert from 'node:assert/strict';
import {
  auditArticleRecord,
  buildDiscussionPrompts,
  createCoverageIndex,
  hasMojibake,
  renderLlmsIndex,
  renderEditorialArticle,
  scoreCandidate,
  selectCandidates,
} from './lib/editorial-automation.mjs';
import { renderNewsCover } from './lib/render-cover.mjs';

function test(name, fn) {
  try {
    fn();
    console.log(`PASS ${name}`);
  } catch (error) {
    console.error(`FAIL ${name}`);
    console.error(error);
    process.exitCode = 1;
  }
}

const freshAgentNews = {
  title: 'OpenAI launches agentic workflow tools for enterprise automation',
  summary: 'New AI agents help businesses automate support and internal operations.',
  source: 'OpenAI News',
  url: 'https://openai.com/news/example-agentic-workflows?utm_source=rss',
  publishedAt: new Date().toISOString(),
};

test('scoreCandidate rewards fresh AI automation business news and penalizes promo noise', () => {
  const strong = scoreCandidate(freshAgentNews);
  const weak = scoreCandidate({
    title: 'Black Friday coupon roundup for gadgets',
    summary: 'Sponsored deal list with discounts.',
    source: 'Deals Blog',
    url: 'https://example.com/deals',
  });

  assert.ok(strong.score > weak.score + 30);
  assert.ok(strong.reasons.some((reason) => reason.includes('Agentes')));
  assert.ok(weak.penalties.some((penalty) => penalty.includes('promocional')));
});

test('createCoverageIndex detects covered URLs, slugs and similar titles', () => {
  const coverage = createCoverageIndex([
    {
      slug: 'openai-agentes-workflows-enterprise',
      title: 'OpenAI lança agentes para workflows enterprise',
      sourceUrl: 'https://openai.com/news/example-agentic-workflows',
    },
  ]);

  assert.equal(coverage.hasUrl('https://openai.com/news/example-agentic-workflows?utm_campaign=feed'), true);
  assert.equal(coverage.hasSlug('openai-agentes-workflows-enterprise'), true);
  assert.equal(coverage.hasSimilarTitle('OpenAI lanca agentes para workflows enterprise'), true);
});

test('selectCandidates keeps only unique candidates above threshold', () => {
  const coverage = createCoverageIndex([]);
  const selected = selectCandidates(
    [
      freshAgentNews,
      { ...freshAgentNews, url: 'https://openai.com/news/example-agentic-workflows#section' },
      {
        title: 'A new robotics AI system reaches factory pilots',
        summary: 'Robotics and AI automation for industrial operations.',
        source: 'MIT Technology Review AI',
        url: 'https://technologyreview.com/robotics-ai-pilots',
      },
    ],
    { coverage, limit: 10, minScore: 20 },
  );

  assert.equal(selected.length, 2);
  assert.equal(new Set(selected.map((item) => item.normalizedUrl)).size, 2);
});

test('auditArticleRecord blocks missing source, mojibake, weak body and missing prompts', () => {
  assert.equal(hasMojibake('Curadoria em portug\u00C3\u0192\u00C2\u00AAs com erro de encoding.'), true);

  const issues = auditArticleRecord({
    slug: 'teste',
    data: {
      title: 'Teste de automacao',
      description: 'Curadoria em portug\u00C3\u0192\u00C2\u00AAs com erro de encoding.',
      category: 'IA Pratica',
      author: 'Nexora Systems',
      date: '2026-06-18',
      readTime: '5 min',
      image: '/images/news/teste.svg',
      tags: ['IA'],
      faq: [],
      discussionPrompts: [],
    },
    body: 'Texto curto demais sem fonte, sem analise propria e com portug\u00C3\u0192\u00C2\u00AAs quebrado.',
  });

  assert.ok(issues.some((issue) => issue.code === 'missing_source'));
  assert.ok(issues.some((issue) => issue.code === 'missing_faq'));
  assert.ok(issues.some((issue) => issue.code === 'missing_discussion_prompts'));
  assert.ok(issues.some((issue) => issue.code === 'short_body'));
});

test('buildDiscussionPrompts returns transparent editorial questions', () => {
  const prompts = buildDiscussionPrompts({
    title: 'Agentes de IA chegam ao atendimento',
    category: 'Agentes de IA',
  });

  assert.equal(prompts.length, 4);
  assert.ok(prompts.every((prompt) => prompt.includes('?')));
  assert.ok(prompts.every((prompt) => !/eu usei|meu cliente|depoimento/i.test(prompt)));
});

test('renderLlmsIndex includes sitemap and recent article links', () => {
  const content = renderLlmsIndex([
    {
      slug: 'agentes-ia-atendimento',
      title: 'Agentes de IA no atendimento',
      description: 'Como agentes mudam suporte e vendas.',
      category: 'Agentes de IA',
      tags: ['Agentes de IA', 'Atendimento'],
      date: '2026-06-18',
    },
  ]);

  assert.match(content, /Sitemap: https:\/\/www\.techbriefing\.com\.br\/sitemap-index\.xml/);
  assert.match(content, /https:\/\/www\.techbriefing\.com\.br\/artigos\/agentes-ia-atendimento\//);
  assert.match(content, /Para agentes de IA/);
});

test('renderEditorialArticle creates local Markdown with source, FAQ and discussion prompts', () => {
  const article = renderEditorialArticle({
    candidate: scoreCandidate(freshAgentNews),
    slug: 'openai-agentic-workflows-enterprise',
    dateIso: '2026-06-18',
    imagePath: '/images/news/openai-agentic-workflows-enterprise.svg',
  });

  assert.match(article, /^---\ntitle: "/);
  assert.match(article, /sourceUrl: "https:\/\/openai\.com\/news\/example-agentic-workflows"/);
  assert.match(article, /editorialScore: \d+/);
  assert.match(article, /discussionPrompts:/);
  assert.match(article, /faq:/);
  assert.match(article, /## Resposta rapida/);
  assert.match(article, /\*\*Fonte:\*\*/);
  assert.ok(article.split(/\s+/).length > 650);
});

test('renderNewsCover produces a topic-specific SVG with title and source context', () => {
  const svg = renderNewsCover({
    title: 'Agentes de IA entram em nova fase operacional',
    category: 'Agentes de IA',
    source: 'Tech Briefing',
    slug: 'agentes-de-ia-2026',
  });

  assert.match(svg, /<svg[\s\S]*<title id="title">Agentes de IA entram em nova fase operacional<\/title>/i);
  assert.match(svg, /<desc id="desc">Capa editorial Tech Briefing para agentes-de-ia-2026\.<\/desc>/i);
  assert.match(svg, /AGENTES|TECNOLOGIA/i);
  assert.match(svg, /TECH BRIEFING/i);
});
