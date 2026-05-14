# Tech Briefing Transformation Design

## Goal

Transform Tech Briefing from a generic technology blog into an editorial platform that helps small business owners, autonomous professionals, freelancers, and working professionals understand technology changes and turn them into productivity, business growth, and new income opportunities.

The site should not only answer "what happened in technology?" It should answer "what does this let me do now?"

## Core Positioning

Tech Briefing is a daily and weekly intelligence system for people who want to apply AI and technology in work, business, and income generation.

Primary promise:

> Understand the most important changes in AI and technology before they become missed opportunities, and learn how to apply them to your business, work, and income.

The tone should be practical, direct, and outcome-oriented. The reader should feel that every article, newsletter issue, and product recommendation helps them save time, sell better, automate work, or create a new useful offer.

## Primary Audience

The site is built first for:

- Small business owners and autonomous professionals who want to sell more, save time, improve operations, and use AI without becoming technical experts.
- Freelancers and employed professionals who want to use AI to work better, stand out, build services, and create extra income.

The content may still cover broader technology news, but each piece should translate the news into practical relevance for these two audiences.

## Editorial Product

Tech Briefing should have three connected editorial products.

### Daily Briefing

Working title: `Tech Briefing Diario`.

Cadence: every day at 11:00.

Format:

- 3 essential technology or AI updates.
- A short explanation of why each update matters.
- One practical action the reader can take today.
- One opportunity angle when relevant, such as a service idea, automation idea, tool to test, or skill to learn.

Outcome:

The reader stays current without wasting time and leaves with at least one action.

### Weekly Manual

Working title: `Manual da Semana`.

Cadence: once per week.

Format:

- One deeper guide focused on a specific achievable outcome.
- Examples: create a simple AI sales assistant, automate lead follow-up, build a reusable prompt library, use AI to create a service package, compare tools for a real workflow.

Outcome:

The reader learns a practical skill or workflow they can apply.

### Opportunity Radar

This can be a section inside the daily and weekly newsletters rather than a separate newsletter at first.

Format:

- AI service ideas.
- Digital product ideas.
- Affiliate/tool opportunities.
- Automation packages a freelancer could sell.
- Trends that can become offers for small businesses.

Outcome:

The reader starts seeing technology as opportunity, not just information.

## Website Funnel

Every major page should have a clear conversion path into the newsletter or a relevant product. The default conversion is newsletter signup, not ebook purchase.

### Homepage

The homepage should position Tech Briefing as a transformation platform, not just a list of posts.

Suggested hero direction:

> IA e tecnologia traduzidas em acao para o seu negocio, trabalho e renda.

The homepage should quickly explain:

- What the reader gets daily.
- What they learn weekly.
- Why this matters for productivity and income.
- How to subscribe.

### Articles

Articles should follow a practical structure:

1. What happened.
2. Why it matters.
3. What changes for small businesses and professionals.
4. What to do next.
5. Related action: newsletter signup, guide, tool, or ebook.

The article experience should avoid showing the same ebook card everywhere. Product offers should be contextual:

- AI agents and automation articles can promote the ebook.
- Tool/comparison articles can promote affiliate tools.
- News/radar articles should primarily promote the newsletter.

### Newsletter Page

The newsletter page should be treated as a free product landing page.

It should sell the outcome:

- Stay updated without wasting time.
- Learn what to apply.
- Discover opportunities before most people.
- Receive practical steps, not hype.

The page should show:

- Daily format.
- Weekly manual format.
- Example sections.
- Who it is for.
- Signup form integrated with Brevo.

## Popup And Signup Strategy

Use newsletter-first capture across the site.

Popup behavior should be useful and discreet:

- Do not show immediately on page load.
- Trigger after scroll depth, time on page, or exit intent.
- Store dismissal in local storage/session storage so it does not annoy returning users.
- On mobile, use a bottom sheet style rather than a blocking modal.

Popup copy should focus on outcome, not generic signup.

Example:

> Receba o briefing diario: 3 mudancas de IA explicadas em portugues, com uma acao pratica para aplicar no seu negocio ou trabalho.

Primary CTA:

> Receber briefing diario

Secondary CTA:

> Agora nao

## Brevo Integration

Brevo is the chosen email platform.

Initial setup:

- Create list: `Tech Briefing - Newsletter`.
- Create fields: `FIRSTNAME`, `SOURCE`, `INTEREST`, `SIGNUP_PAGE`.
- Create segments or tags:
  - `interesse_ia_negocios`
  - `interesse_renda_extra`
  - `interesse_automacao`
  - `interesse_ferramentas`

Lead sources:

- `home_hero`
- `newsletter_page`
- `article_inline`
- `article_popup`
- `footer`

The website forms should submit contacts to Brevo. If direct API integration requires a private key, use a serverless/API route or a secure form endpoint rather than exposing the key in client-side JavaScript.

## Measurement

Newsletter and funnel events should be tracked in GA4/GTM:

- `newsletter_popup_view`
- `newsletter_popup_close`
- `newsletter_signup_submit`
- `newsletter_signup_success`
- `article_cta_click`
- `product_nudge_click`
- `ebook_cta_click`

Important dimensions:

- Page path.
- CTA placement.
- Topic/category.
- Lead source.

The goal is to understand which content produces subscribers and which subscribers later click product offers.

## Content Rules

Every article should pass this checklist:

- The headline promises a clear practical reason to click.
- The image matches the topic and can attract attention visually.
- The first paragraph explains why the reader should care now.
- There is a section translating news into practical impact.
- There is a concrete next action.
- There is a relevant CTA, preferably newsletter first.
- Product offers appear only when contextually relevant.

## Scope For First Implementation

The first implementation should focus on:

1. Add a reusable newsletter popup/nudge component.
2. Connect newsletter signup forms to Brevo or prepare the secure integration boundary if credentials are not yet available.
3. Rewrite homepage and newsletter page copy around the new positioning.
4. Add contextual article CTA logic so not every article pushes the ebook.
5. Add tracking events for newsletter and product CTAs.
6. Prepare a daily newsletter template and weekly manual template.

The implementation should not attempt to build a full email automation platform inside the site. Brevo should own sending, lists, and campaigns.

## Non-Goals

- Do not make the site feel like a pure sales page.
- Do not force the ebook into every article.
- Do not make popups aggressive or hard to dismiss.
- Do not expose Brevo API keys in browser code.
- Do not promise unrealistic income results.

## Success Criteria

The work is successful when:

- A visitor understands within seconds that Tech Briefing helps them apply AI and technology for business, work, and income.
- Newsletter signup is visible and compelling on the homepage, newsletter page, articles, and footer.
- Article CTAs feel relevant to the article topic.
- Brevo can receive leads with source information.
- GA4/GTM can identify which placements generate newsletter signups.
- The site supports a daily briefing and weekly manual editorial rhythm.
