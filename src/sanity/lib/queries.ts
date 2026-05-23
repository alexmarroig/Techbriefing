// ─── Article Queries ───────────────────────────────────────────
export const allArticlesQuery = `
  *[_type == "article"] | order(date desc) {
    _id, title, "slug": slug.current, description, category, author,
    date, readTime, featured, "image": image.asset->url, tags
  }
`

export const featuredArticlesQuery = `
  *[_type == "article" && featured == true] | order(date desc) {
    _id, title, "slug": slug.current, description, category, author,
    date, readTime, featured, "image": image.asset->url, tags
  }
`

export const articleBySlugQuery = `
  *[_type == "article" && slug.current == $slug][0] {
    _id, title, "slug": slug.current, description, category, author,
    date, readTime, featured, "image": image.asset->url, tags,
    body, seo
  }
`

export const articlesByCategoryQuery = `
  *[_type == "article" && category == $category] | order(date desc) {
    _id, title, "slug": slug.current, description, category, author,
    date, readTime, featured, "image": image.asset->url, tags
  }
`

// ─── Comparativo Queries ───────────────────────────────────────
export const allComparativosQuery = `
  *[_type == "comparativo"] | order(date desc) {
    _id, title, "slug": slug.current, description, category, author,
    date, readTime, featured, "image": image.asset->url, tools
  }
`

export const comparativoBySlugQuery = `
  *[_type == "comparativo" && slug.current == $slug][0] {
    _id, title, "slug": slug.current, description, category, author,
    date, readTime, featured, "image": image.asset->url, tools,
    comparisonTable, faqs, body, seo
  }
`

// ─── Archive (articles + comparativos merged) ──────────────────
export const archiveQuery = `
  *[_type in ["article", "comparativo"]] | order(date desc) {
    _id, _type, title, "slug": slug.current, description, category,
    author, date, readTime, featured, "image": image.asset->url,
    "tags": coalesce(tags, tools, [])
  }
`

// ─── Tool Queries ──────────────────────────────────────────────
export const allToolsQuery = `
  *[_type == "tool"] | order(categoryId asc, sortOrder asc) {
    _id, name, "slug": slug.current, icon, description,
    category, categoryId, rating, affiliate, url, sortOrder
  }
`

// ─── Ebook Queries ─────────────────────────────────────────────
export const allEbooksQuery = `
  *[_type == "ebook"] {
    _id, title, "slug": slug.current, description, price, oldPrice,
    pages, color, benefits, url, checkoutUrl, formats,
    "coverImage": coverImage.asset->url, toc
  }
`

// ─── App Queries ───────────────────────────────────────────────
export const allAppsQuery = `
  *[_type == "app"] {
    _id, name, "slug": slug.current, icon, description, status, platform, url
  }
`

// ─── Prompt Queries ────────────────────────────────────────────
export const allPromptsQuery = `
  *[_type == "prompt"] | order(category asc) {
    _id, title, "slug": slug.current, category, objective,
    whenToUse, prompt, variations, nextSteps
  }
`

// ─── Manual Queries ────────────────────────────────────────────
export const allManualsQuery = `
  *[_type == "manual"] {
    _id, title, "slug": slug.current, category, description,
    outcome, tools, steps, mistakes
  }
`

export const manualBySlugQuery = `
  *[_type == "manual" && slug.current == $slug][0] {
    _id, title, "slug": slug.current, category, description,
    outcome, tools, steps, mistakes
  }
`

// ─── Pillar Queries ────────────────────────────────────────────
export const allPillarsQuery = `
  *[_type == "pillar"] {
    _id, title, "slug": slug.current, description, kicker,
    sections, links
  }
`

export const pillarBySlugQuery = `
  *[_type == "pillar" && slug.current == $slug][0] {
    _id, title, "slug": slug.current, description, kicker,
    sections, links
  }
`
