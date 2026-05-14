# Tech Briefing Newsletter Funnel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn Tech Briefing into a newsletter-first editorial platform that captures leads for a daily briefing and weekly manual, using Brevo securely and tracking funnel events.

**Architecture:** Add a small newsletter subscription layer with a reusable client component, a server-side API endpoint for Brevo, contextual CTAs, and static verification. Keep Brevo responsible for sending campaigns and lists. Keep the site fast by using lightweight React components already supported by the Astro project.

**Tech Stack:** Astro 6, React 19, existing global CSS, Brevo Contacts API, GA4/GTM via existing `window.trackTechBriefingEvent`, Vercel environment variables.

---

## File Structure

- Create `src/lib/newsletter.js`: Shared constants, source names, interest names, and copy helpers for newsletter CTAs.
- Create `src/pages/api/newsletter/subscribe.js`: Server endpoint that validates submissions and calls Brevo with private env vars.
- Create `src/components/NewsletterSignup.jsx`: Reusable form used by homepage, newsletter page, footer, popup, and article CTAs.
- Create `src/components/NewsletterPopup.jsx`: Site-wide discreet popup/bottom sheet that uses `NewsletterSignup`.
- Create `src/components/ArticleContextCta.astro`: Server-rendered article CTA selector that chooses newsletter, ebook, or tools based on category/tags.
- Modify `src/layouts/BaseLayout.astro`: Mount the global popup and pass page context.
- Modify `src/components/pages/IndexPage.jsx`: Rewrite hero and newsletter blocks around the new positioning.
- Modify `src/components/pages/NewsletterPage.jsx`: Replace fake signup behavior with `NewsletterSignup` and reposition page as the free editorial product.
- Modify `src/pages/artigos/[slug].astro`: Replace current hardcoded product nudge with contextual article CTA and newsletter-first nudge.
- Modify `src/components/Footer.astro`: Add a compact real newsletter signup area.
- Modify `src/components/GoogleTag.astro`: Ensure newsletter events flow through `window.trackTechBriefingEvent`.
- Create `scripts/verify-newsletter-funnel.mjs`: Static checks for endpoint, CTAs, copy, and event names.
- Modify `package.json`: Add `verify:newsletter` script.
- Create `docs/newsletter-templates.md`: Daily briefing and weekly manual templates for Brevo campaigns.

## Required Environment Variables

Add these in Vercel and local `.env` when testing:

```bash
BREVO_API_KEY=copy_the_exact_api_key_from_brevo_smtp_api
BREVO_LIST_ID=copy_the_numeric_list_id_from_brevo_contacts_lists
PUBLIC_NEWSLETTER_ENABLED=true
```

The client must never receive `BREVO_API_KEY`.

---

### Task 1: Newsletter Constants And Verification Skeleton

**Files:**
- Create: `src/lib/newsletter.js`
- Create: `scripts/verify-newsletter-funnel.mjs`
- Modify: `package.json`

- [ ] **Step 1: Create newsletter constants**

Create `src/lib/newsletter.js`:

```js
export const NEWSLETTER_NAME = 'Tech Briefing Diario';

export const NEWSLETTER_COPY = {
  headline: 'IA e tecnologia traduzidas em acao para seu negocio, trabalho e renda.',
  shortPromise: 'Receba 3 mudancas importantes de IA e tecnologia com uma acao pratica para aplicar no mesmo dia.',
  dailyLabel: 'Briefing diario as 11h',
  weeklyLabel: 'Manual da Semana',
  opportunityLabel: 'Radar de oportunidades',
  submitLabel: 'Receber briefing diario',
  successTitle: 'Voce esta dentro.',
  successMessage: 'Agora voce vai receber o Tech Briefing com noticias aplicadas, guias e oportunidades praticas.',
};

export const NEWSLETTER_SOURCES = {
  homeHero: 'home_hero',
  newsletterPage: 'newsletter_page',
  articleInline: 'article_inline',
  articlePopup: 'article_popup',
  footer: 'footer',
  globalPopup: 'global_popup',
};

export const NEWSLETTER_INTERESTS = {
  aiBusiness: 'interesse_ia_negocios',
  extraIncome: 'interesse_renda_extra',
  automation: 'interesse_automacao',
  tools: 'interesse_ferramentas',
};

export function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizeEmail(email));
}
```

- [ ] **Step 2: Create the verification script**

Create `scripts/verify-newsletter-funnel.mjs`:

```js
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const checks = [];

function file(path) {
  const absolute = join(root, path);
  if (!existsSync(absolute)) {
    throw new Error(`Missing required file: ${path}`);
  }
  return readFileSync(absolute, 'utf8');
}

function expectContains(path, text) {
  const content = file(path);
  if (!content.includes(text)) {
    checks.push(`FAIL ${path} does not contain ${text}`);
  } else {
    checks.push(`PASS ${path} contains ${text}`);
  }
}

expectContains('src/lib/newsletter.js', 'NEWSLETTER_COPY');
expectContains('src/lib/newsletter.js', 'interesse_ia_negocios');
expectContains('package.json', 'verify:newsletter');

if (checks.some((line) => line.startsWith('FAIL'))) {
  console.error(checks.join('\n'));
  process.exit(1);
}

console.log(checks.join('\n'));
```

- [ ] **Step 3: Add the package script**

Modify `package.json` scripts:

```json
"verify:newsletter": "node scripts/verify-newsletter-funnel.mjs"
```

Keep existing scripts unchanged.

- [ ] **Step 4: Run verification**

Run:

```bash
npm run verify:newsletter
```

Expected: all checks print `PASS`.

- [ ] **Step 5: Commit**

```bash
git add src/lib/newsletter.js scripts/verify-newsletter-funnel.mjs package.json
git commit -m "Add newsletter funnel constants"
```

---

### Task 2: Secure Brevo Subscribe Endpoint

**Files:**
- Create: `src/pages/api/newsletter/subscribe.js`
- Modify: `scripts/verify-newsletter-funnel.mjs`

- [ ] **Step 1: Create the endpoint**

Create `src/pages/api/newsletter/subscribe.js`:

```js
import { isValidEmail, normalizeEmail, NEWSLETTER_INTERESTS, NEWSLETTER_SOURCES } from '../../../lib/newsletter.js';

export const prerender = false;

const BREVO_URL = 'https://api.brevo.com/v3/contacts';

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  });
}

function cleanText(value, maxLength = 120) {
  return String(value || '').trim().slice(0, maxLength);
}

function allowedValue(value, allowed, fallback) {
  return Object.values(allowed).includes(value) ? value : fallback;
}

export async function POST({ request }) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: 'invalid_json' }, 400);
  }

  const email = normalizeEmail(body.email);
  const firstName = cleanText(body.firstName || body.name, 80);
  const source = allowedValue(body.source, NEWSLETTER_SOURCES, NEWSLETTER_SOURCES.newsletterPage);
  const interest = allowedValue(body.interest, NEWSLETTER_INTERESTS, NEWSLETTER_INTERESTS.aiBusiness);
  const signupPage = cleanText(body.signupPage, 240);

  if (!isValidEmail(email)) {
    return json({ ok: false, error: 'invalid_email' }, 400);
  }

  const apiKey = import.meta.env.BREVO_API_KEY;
  const listId = Number(import.meta.env.BREVO_LIST_ID);

  if (!apiKey || !Number.isFinite(listId)) {
    return json({ ok: false, error: 'newsletter_not_configured' }, 503);
  }

  const brevoPayload = {
    email,
    updateEnabled: true,
    listIds: [listId],
    attributes: {
      FIRSTNAME: firstName,
      SOURCE: source,
      INTEREST: interest,
      SIGNUP_PAGE: signupPage,
    },
  };

  const response = await fetch(BREVO_URL, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'api-key': apiKey,
      'content-type': 'application/json',
    },
    body: JSON.stringify(brevoPayload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    return json({ ok: false, error: 'brevo_error', detail: errorText.slice(0, 300) }, 502);
  }

  return json({ ok: true });
}
```

- [ ] **Step 2: Extend static verification**

Modify `scripts/verify-newsletter-funnel.mjs` by adding:

```js
expectContains('src/pages/api/newsletter/subscribe.js', 'BREVO_API_KEY');
expectContains('src/pages/api/newsletter/subscribe.js', 'BREVO_LIST_ID');
expectContains('src/pages/api/newsletter/subscribe.js', 'updateEnabled: true');
```

- [ ] **Step 3: Run verification and build**

Run:

```bash
npm run verify:newsletter
npm run build
```

Expected: verification passes and Astro builds without errors.

- [ ] **Step 4: Commit**

```bash
git add src/pages/api/newsletter/subscribe.js scripts/verify-newsletter-funnel.mjs
git commit -m "Add Brevo newsletter subscribe endpoint"
```

---

### Task 3: Reusable Newsletter Signup Component

**Files:**
- Create: `src/components/NewsletterSignup.jsx`
- Modify: `scripts/verify-newsletter-funnel.mjs`

- [ ] **Step 1: Create the reusable component**

Create `src/components/NewsletterSignup.jsx`:

```jsx
import React from 'react';
import { NEWSLETTER_COPY, NEWSLETTER_INTERESTS, NEWSLETTER_SOURCES } from '../lib/newsletter.js';

export default function NewsletterSignup({
  source = NEWSLETTER_SOURCES.newsletterPage,
  interest = NEWSLETTER_INTERESTS.aiBusiness,
  compact = false,
  showName = true,
  buttonLabel = NEWSLETTER_COPY.submitLabel,
}) {
  const [firstName, setFirstName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [status, setStatus] = React.useState('idle');
  const [message, setMessage] = React.useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus('loading');
    setMessage('');

    if (typeof window.trackTechBriefingEvent === 'function') {
      window.trackTechBriefingEvent('newsletter_signup_submit', { source, interest });
    }

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          firstName,
          email,
          source,
          interest,
          signupPage: window.location.pathname,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.error || 'subscribe_failed');
      }

      setStatus('success');
      setMessage(NEWSLETTER_COPY.successMessage);

      if (typeof window.trackTechBriefingEvent === 'function') {
        window.trackTechBriefingEvent('newsletter_signup_success', { source, interest });
      }
    } catch {
      setStatus('error');
      setMessage('Nao consegui confirmar sua inscricao agora. Tente novamente em alguns minutos.');
    }
  }

  if (status === 'success') {
    return (
      <div className={`newsletter-signup newsletter-signup-${compact ? 'compact' : 'full'} is-success`}>
        <div className="newsletter-success-title">{NEWSLETTER_COPY.successTitle}</div>
        <p>{message}</p>
      </div>
    );
  }

  return (
    <form className={`newsletter-signup newsletter-signup-${compact ? 'compact' : 'full'}`} onSubmit={handleSubmit}>
      {!compact && (
        <div className="newsletter-form-copy">
          <strong>{NEWSLETTER_COPY.dailyLabel}</strong>
          <span>{NEWSLETTER_COPY.shortPromise}</span>
        </div>
      )}

      <div className="newsletter-form-fields">
        {showName && (
          <input
            className="nl-input"
            type="text"
            name="firstName"
            autoComplete="given-name"
            placeholder="Seu nome"
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
          />
        )}
        <input
          className="nl-input"
          type="email"
          name="email"
          autoComplete="email"
          placeholder="seu@email.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </div>

      <button className="btn btn-fill newsletter-submit" type="submit" disabled={status === 'loading'}>
        {status === 'loading' ? 'Enviando...' : buttonLabel}
      </button>

      {message && <p className="newsletter-form-message">{message}</p>}
      <p className="newsletter-form-note">Gratis. Sem spam. Cancele quando quiser.</p>
    </form>
  );
}
```

- [ ] **Step 2: Add styles**

Append to `src/styles/global.css`:

```css
.newsletter-signup{display:flex;flex-direction:column;gap:12px}
.newsletter-form-copy{display:flex;flex-direction:column;gap:6px;margin-bottom:4px}
.newsletter-form-copy strong{font-family:var(--serif);font-size:22px;letter-spacing:-.01em;color:var(--text)}
.newsletter-form-copy span{font-size:14px;line-height:1.55;color:var(--text-2)}
.newsletter-form-fields{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.newsletter-signup-compact .newsletter-form-fields{grid-template-columns:1fr}
.newsletter-submit{justify-content:center;min-height:46px;border:0}
.newsletter-form-note,.newsletter-form-message{margin:0;font-family:var(--mono);font-size:11px;letter-spacing:.03em;color:var(--text-4);line-height:1.5}
.newsletter-form-message{color:var(--amber)}
.newsletter-signup.is-success{padding:18px;border:1px solid var(--line-s);border-radius:14px;background:var(--bg-2)}
.newsletter-success-title{font-family:var(--serif);font-size:22px;font-weight:700;color:var(--text);letter-spacing:-.01em}
@media(max-width:640px){.newsletter-form-fields{grid-template-columns:1fr}}
```

- [ ] **Step 3: Extend verification**

Add to `scripts/verify-newsletter-funnel.mjs`:

```js
expectContains('src/components/NewsletterSignup.jsx', 'newsletter_signup_submit');
expectContains('src/components/NewsletterSignup.jsx', '/api/newsletter/subscribe');
expectContains('src/styles/global.css', '.newsletter-signup');
```

- [ ] **Step 4: Run verification and build**

Run:

```bash
npm run verify:newsletter
npm run build
```

Expected: both pass.

- [ ] **Step 5: Commit**

```bash
git add src/components/NewsletterSignup.jsx src/styles/global.css scripts/verify-newsletter-funnel.mjs
git commit -m "Add reusable newsletter signup form"
```

---

### Task 4: Reposition Homepage And Newsletter Page

**Files:**
- Modify: `src/components/pages/IndexPage.jsx`
- Modify: `src/components/pages/NewsletterPage.jsx`
- Modify: `src/pages/newsletter.astro`

- [ ] **Step 1: Update homepage hero copy**

Modify the `Hero` component in `src/components/pages/IndexPage.jsx`:

```jsx
function Hero(){
  return (
    <section className="hero">
      <div className="hero-bg"/>
      <div className="hero-glow-top"/>
      <div className="hero-inner">
        <div className="hero-eyebrow">
          <span className="hero-eyebrow-mark">Tech Briefing</span>
          <div className="hero-eyebrow-rule"/>
          <span className="hero-eyebrow-tag">IA aplicada ao trabalho, negocio e renda</span>
        </div>
        <h1 className="hero-h1">
          Tecnologia que vira acao. IA que vira resultado.
        </h1>
        <p className="hero-sub">
          Noticias, guias e oportunidades traduzidas para quem quer aplicar IA no negocio, ganhar produtividade e criar novas fontes de renda sem viver perdido no hype.
        </p>
        <div className="hero-actions">
          <a href="/newsletter" className="btn btn-fill">
            Receber briefing diario
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </a>
          <a href="/arquivo" className="arrow-link">Explorar ultimas publicacoes -&gt;</a>
        </div>
      </div>
      <div className="hero-bar wrap">
        {[
          {n:'3',em:'',l:'sinais essenciais por dia'},
          {n:'1',em:'',l:'acao pratica por briefing'},
          {n:'1x',em:'',l:'manual profundo por semana'},
          {n:'BR',em:'',l:'portugues direto ao ponto'},
        ].map((s,i)=>(
          <div className="hero-stat" key={i}>
            <div className="hero-stat-n">{s.n}{s.em&&<em>{s.em}</em>}</div>
            <div className="hero-stat-l">{s.l}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Replace fake newsletter forms on newsletter page**

In `src/components/pages/NewsletterPage.jsx`, import:

```jsx
import NewsletterSignup from '../NewsletterSignup.jsx';
import { NEWSLETTER_INTERESTS, NEWSLETTER_SOURCES } from '../../lib/newsletter.js';
```

Replace the current `NlForm` implementation with:

```jsx
function NlForm({compact}) {
  return (
    <NewsletterSignup
      compact={compact}
      showName={!compact}
      source={NEWSLETTER_SOURCES.newsletterPage}
      interest={NEWSLETTER_INTERESTS.aiBusiness}
    />
  );
}
```

Update newsletter page headline copy:

```jsx
<h1 className="nl-hero-title">O briefing que transforma noticia em acao.</h1>
<p className="nl-hero-sub">Todo dia as 11h: 3 mudancas importantes de IA e tecnologia, explicadas em portugues, com uma acao pratica para aplicar no seu negocio, trabalho ou renda.</p>
```

- [ ] **Step 3: Update page metadata**

Modify `src/pages/newsletter.astro`:

```astro
<BaseLayout
  title="Newsletter diaria de IA aplicada - Tech Briefing"
  description="Receba todos os dias um briefing com noticias de IA e tecnologia traduzidas em acoes praticas para negocio, trabalho e renda."
  active="Newsletter"
>
  <NewsletterPage client:load />
</BaseLayout>
```

- [ ] **Step 4: Run verification and build**

Run:

```bash
npm run verify:newsletter
npm run build
```

Expected: both pass.

- [ ] **Step 5: Commit**

```bash
git add src/components/pages/IndexPage.jsx src/components/pages/NewsletterPage.jsx src/pages/newsletter.astro
git commit -m "Reposition newsletter as daily applied briefing"
```

---

### Task 5: Site-Wide Newsletter Popup

**Files:**
- Create: `src/components/NewsletterPopup.jsx`
- Modify: `src/layouts/BaseLayout.astro`
- Modify: `src/styles/global.css`
- Modify: `scripts/verify-newsletter-funnel.mjs`

- [ ] **Step 1: Create popup component**

Create `src/components/NewsletterPopup.jsx`:

```jsx
import React from 'react';
import NewsletterSignup from './NewsletterSignup.jsx';
import { NEWSLETTER_COPY, NEWSLETTER_INTERESTS, NEWSLETTER_SOURCES } from '../lib/newsletter.js';

const STORAGE_KEY = 'tb_newsletter_popup_closed_v1';

export default function NewsletterPopup({ pageType = 'website' }) {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    if (pageType === 'ebook') return;
    if (window.localStorage.getItem(STORAGE_KEY) === '1') return;

    let shown = false;
    const show = (reason) => {
      if (shown) return;
      shown = true;
      setVisible(true);
      if (typeof window.trackTechBriefingEvent === 'function') {
        window.trackTechBriefingEvent('newsletter_popup_view', { source: NEWSLETTER_SOURCES.globalPopup, reason });
      }
    };

    const timer = window.setTimeout(() => show('time'), 18000);
    const onScroll = () => {
      if (window.scrollY > Math.min(900, document.documentElement.scrollHeight * 0.22)) {
        show('scroll');
      }
    };
    const onMouseLeave = (event) => {
      if (event.clientY <= 0) show('exit_intent');
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [pageType]);

  function close() {
    window.localStorage.setItem(STORAGE_KEY, '1');
    setVisible(false);
    if (typeof window.trackTechBriefingEvent === 'function') {
      window.trackTechBriefingEvent('newsletter_popup_close', { source: NEWSLETTER_SOURCES.globalPopup });
    }
  }

  if (!visible) return null;

  return (
    <aside className="newsletter-popup" aria-label="Assinar newsletter">
      <button className="newsletter-popup-close" type="button" aria-label="Fechar newsletter" onClick={close}>×</button>
      <div className="newsletter-popup-kicker">{NEWSLETTER_COPY.dailyLabel}</div>
      <strong>{NEWSLETTER_COPY.headline}</strong>
      <p>{NEWSLETTER_COPY.shortPromise}</p>
      <NewsletterSignup
        compact
        showName={false}
        source={NEWSLETTER_SOURCES.globalPopup}
        interest={NEWSLETTER_INTERESTS.aiBusiness}
      />
    </aside>
  );
}
```

- [ ] **Step 2: Mount popup in layout**

Modify `src/layouts/BaseLayout.astro` imports:

```astro
import NewsletterPopup from '../components/NewsletterPopup.jsx';
```

Add before `</body>`:

```astro
<NewsletterPopup pageType={active === 'Ebook' ? 'ebook' : type} client:idle />
```

- [ ] **Step 3: Add popup styles**

Append to `src/styles/global.css`:

```css
.newsletter-popup{position:fixed;right:22px;bottom:22px;z-index:430;width:min(380px,calc(100vw - 32px));padding:22px;border:1px solid oklch(0.80 0.14 62/.32);border-radius:18px;background:radial-gradient(circle at 92% 0%,oklch(0.80 0.14 62/.16),transparent 48%),oklch(0.14 0.01 245/.96);box-shadow:0 20px 70px oklch(0 0 0/.5);backdrop-filter:blur(14px)}
.newsletter-popup-close{position:absolute;top:10px;right:10px;width:30px;height:30px;border:1px solid var(--line-s);border-radius:999px;background:var(--bg-2);color:var(--text-2);cursor:pointer;font-size:18px;line-height:1}
.newsletter-popup-kicker{margin-bottom:10px;color:var(--amber);font-family:var(--mono);font-size:10px;letter-spacing:.12em;text-transform:uppercase}
.newsletter-popup strong{display:block;max-width:300px;color:var(--text);font-family:var(--serif);font-size:25px;line-height:1.08;letter-spacing:-.02em}
.newsletter-popup p{margin:12px 0 16px;color:var(--text-2);font-size:14px;line-height:1.55}
@media(max-width:640px){.newsletter-popup{left:12px;right:12px;bottom:12px;width:auto;padding:18px;border-radius:16px}}
```

- [ ] **Step 4: Extend verification**

Add to `scripts/verify-newsletter-funnel.mjs`:

```js
expectContains('src/components/NewsletterPopup.jsx', 'newsletter_popup_view');
expectContains('src/layouts/BaseLayout.astro', 'NewsletterPopup');
expectContains('src/styles/global.css', '.newsletter-popup');
```

- [ ] **Step 5: Run verification and build**

Run:

```bash
npm run verify:newsletter
npm run build
```

Expected: both pass.

- [ ] **Step 6: Commit**

```bash
git add src/components/NewsletterPopup.jsx src/layouts/BaseLayout.astro src/styles/global.css scripts/verify-newsletter-funnel.mjs
git commit -m "Add newsletter popup capture"
```

---

### Task 6: Contextual Article CTAs

**Files:**
- Create: `src/components/ArticleContextCta.astro`
- Modify: `src/pages/artigos/[slug].astro`
- Modify: `src/styles/global.css`
- Modify: `scripts/verify-newsletter-funnel.mjs`

- [ ] **Step 1: Create contextual CTA component**

Create `src/components/ArticleContextCta.astro`:

```astro
---
const { category = '', tags = [] } = Astro.props;
const tagText = [category, ...(tags || [])].join(' ').toLowerCase();
const isAgentOrAutomation = /agente|automacao|automação|n8n|make|workflow|processo/.test(tagText);
const isTool = /ferramenta|comparativo|software|tool/.test(tagText);

const cta = isAgentOrAutomation
  ? {
      eyebrow: 'Transforme em execucao',
      title: 'Quer criar agentes e automacoes de verdade?',
      body: 'Use o ebook Agentes de IA para Negocios para sair do prompt solto e estruturar fluxos que executam tarefas reais.',
      href: '/ebook-agentes-ia/',
      label: 'Ver ebook por R$ 37',
      eventTarget: 'ebook',
    }
  : isTool
    ? {
        eyebrow: 'Ferramentas testadas',
        title: 'Quer escolher a ferramenta certa sem perder semanas?',
        body: 'Veja nossa curadoria de ferramentas para automacao, IA e produtividade aplicada.',
        href: '/ferramentas/',
        label: 'Ver ferramentas',
        eventTarget: 'tools',
      }
    : {
        eyebrow: 'Receba todo dia',
        title: 'Transforme noticia de tecnologia em acao pratica.',
        body: 'Assine o briefing diario e receba 3 mudancas importantes com uma acao para aplicar no negocio, trabalho ou renda.',
        href: '/newsletter/',
        label: 'Receber briefing diario',
        eventTarget: 'newsletter',
      };
---

<aside class="article-context-cta" data-article-context-cta={cta.eventTarget}>
  <div>
    <div class="article-context-kicker">{cta.eyebrow}</div>
    <h2>{cta.title}</h2>
    <p>{cta.body}</p>
  </div>
  <a href={cta.href} class="btn btn-fill" data-context-cta-link={cta.eventTarget}>{cta.label}</a>
</aside>

<script is:inline>
  document.querySelectorAll('[data-context-cta-link]').forEach((link) => {
    link.addEventListener('click', () => {
      if (typeof window.trackTechBriefingEvent === 'function') {
        window.trackTechBriefingEvent('article_cta_click', {
          target: link.getAttribute('data-context-cta-link'),
          placement: 'article_context_cta',
        });
      }
    });
  });
</script>
```

- [ ] **Step 2: Add CTA to article template**

Modify `src/pages/artigos/[slug].astro` imports:

```astro
import ArticleContextCta from '../../components/ArticleContextCta.astro';
```

Add after `<Content />`:

```astro
<ArticleContextCta category={category} tags={tags} />
```

Remove the current `.article-product-nudge` markup, script, and related CSS from `src/pages/artigos/[slug].astro`. The site-wide newsletter popup from Task 5 handles the discreet popup behavior.

- [ ] **Step 3: Add CTA styles**

Append to `src/styles/global.css`:

```css
.article-context-cta{margin:56px 0 0;padding:26px;border:1px solid oklch(0.80 0.14 62/.28);border-radius:18px;background:radial-gradient(circle at 90% 0%,oklch(0.80 0.14 62/.14),transparent 52%),var(--bg-2);display:grid;grid-template-columns:1fr auto;gap:22px;align-items:center}
.article-context-kicker{margin-bottom:10px;color:var(--amber);font-family:var(--mono);font-size:10px;letter-spacing:.12em;text-transform:uppercase}
.article-context-cta h2{margin:0 0 8px!important;font-size:clamp(26px,3vw,34px)!important}
.article-context-cta p{margin:0!important;color:var(--text-2);font-size:15px;line-height:1.65}
.article-context-cta .btn{white-space:nowrap}
@media(max-width:720px){.article-context-cta{grid-template-columns:1fr}.article-context-cta .btn{width:100%;justify-content:center}}
```

- [ ] **Step 4: Extend verification**

Add:

```js
expectContains('src/components/ArticleContextCta.astro', 'article_cta_click');
expectContains('src/pages/artigos/[slug].astro', 'ArticleContextCta');
expectContains('src/styles/global.css', '.article-context-cta');
```

- [ ] **Step 5: Run verification and build**

Run:

```bash
npm run verify:newsletter
npm run build
```

Expected: both pass. Confirm `rg -n "article-product-nudge|Ebook recomendado" src/pages/artigos` returns no matches.

- [ ] **Step 6: Commit**

```bash
git add src/components/ArticleContextCta.astro src/pages/artigos/[slug].astro src/styles/global.css scripts/verify-newsletter-funnel.mjs
git commit -m "Add contextual article CTAs"
```

---

### Task 7: Footer Signup And Newsletter Templates

**Files:**
- Modify: `src/components/Footer.astro`
- Create: `docs/newsletter-templates.md`

- [ ] **Step 1: Add footer signup island**

Modify `src/components/Footer.astro` imports:

```astro
import NewsletterSignup from './NewsletterSignup.jsx';
import { NEWSLETTER_INTERESTS, NEWSLETTER_SOURCES } from '../lib/newsletter.js';
```

Add below the footer description:

```astro
<div class="footer-newsletter">
  <div class="footer-newsletter-title">Receba o briefing diario</div>
  <NewsletterSignup
    client:idle
    compact
    showName={false}
    source={NEWSLETTER_SOURCES.footer}
    interest={NEWSLETTER_INTERESTS.aiBusiness}
  />
</div>
```

- [ ] **Step 2: Add footer styles**

Append to `src/styles/global.css`:

```css
.footer-newsletter{margin-top:22px;max-width:320px}
.footer-newsletter-title{font-family:var(--serif);font-size:20px;font-weight:700;letter-spacing:-.01em;margin-bottom:12px;color:var(--text)}
.footer-newsletter .newsletter-form-note{font-size:10px}
```

- [ ] **Step 3: Create Brevo campaign templates**

Create `docs/newsletter-templates.md`:

```md
# Tech Briefing Newsletter Templates

## Daily Briefing - 11h

Subject options:
- 3 sinais de IA para aplicar hoje
- O que mudou em IA hoje e o que fazer com isso
- Tech Briefing: 3 mudancas, 1 acao pratica

Structure:

1. Opening line: one sentence on the theme of the day.
2. Signal 1: what happened, why it matters, action.
3. Signal 2: what happened, why it matters, action.
4. Signal 3: what happened, why it matters, action.
5. Opportunity radar: one service, automation, tool, or income idea.
6. CTA: read full guide, see tool, or reply with a question.

## Weekly Manual

Subject options:
- Manual da Semana: crie [resultado] com IA
- Como aplicar [tema] no seu negocio esta semana
- O guia pratico de [tema] para sair do improviso

Structure:

1. Promise: what the reader will be able to do.
2. Context: why this matters now.
3. Step-by-step framework.
4. Example for small business.
5. Example for freelancer/professional.
6. Tools/resources.
7. CTA to ebook, tool, or article.
```

- [ ] **Step 4: Run build**

Run:

```bash
npm run build
```

Expected: build passes.

- [ ] **Step 5: Commit**

```bash
git add src/components/Footer.astro src/styles/global.css docs/newsletter-templates.md
git commit -m "Add footer signup and newsletter templates"
```

---

### Task 8: Final Verification And Deployment

**Files:**
- Verify all files changed in previous tasks.

- [ ] **Step 1: Run full verification**

Run:

```bash
npm run verify:newsletter
npm run build
git status --short --branch
```

Expected:

- `npm run verify:newsletter` prints only `PASS` lines.
- `npm run build` completes successfully.
- `git status --short --branch` shows clean tracked files, ignoring existing untracked `.claude/worktrees/...` if present.

- [ ] **Step 2: Push**

Run:

```bash
git push origin main
```

Expected: push succeeds and Vercel starts a new deployment.

- [ ] **Step 3: Configure Vercel environment variables**

In Vercel project settings, add:

```bash
BREVO_API_KEY=copy_the_exact_api_key_from_brevo_smtp_api
BREVO_LIST_ID=copy_the_numeric_list_id_from_brevo_contacts_lists
PUBLIC_NEWSLETTER_ENABLED=true
```

Redeploy after adding variables.

- [ ] **Step 4: Manual production test**

Open:

```text
https://www.techbriefing.com.br/newsletter/
```

Test:

- Submit a real email you control.
- Confirm success message appears.
- Confirm the contact appears in Brevo list `Tech Briefing - Newsletter`.
- Confirm source field is `newsletter_page`.

Open one article and test:

- Contextual CTA appears at article end.
- Global newsletter popup appears after scroll or time.
- Dismissal prevents repeat popup.

- [ ] **Step 5: Analytics check**

In GA4 DebugView or Tag Assistant, confirm these events fire:

```text
newsletter_popup_view
newsletter_popup_close
newsletter_signup_submit
newsletter_signup_success
article_cta_click
```

Expected: events include `source`, `interest`, `page_path`, and `placement` where relevant.
