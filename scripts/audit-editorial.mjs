import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import { auditArticleRecord, canonicalSourceUrl } from './lib/editorial-automation.mjs';
import { extractSourceFromMarkdown } from './lib/resolve-image.mjs';

const ROOT = process.cwd();
const ARTICLES_DIR = path.join(ROOT, 'src', 'content', 'articles');
const STRICT_ALL = process.argv.includes('--strict-all');
const UNIVERSAL_CODES = new Set(['mojibake', 'missing_image', 'broken_image']);

async function loadArticles() {
  const files = (await readdir(ARTICLES_DIR)).filter((file) => file.endsWith('.md')).sort();
  return Promise.all(files.map(async (file) => {
    const raw = await readFile(path.join(ARTICLES_DIR, file), 'utf8');
    const parsed = matter(raw);
    return {
      file,
      slug: file.replace(/\.md$/, ''),
      raw,
      data: parsed.data,
      body: parsed.content,
    };
  }));
}

function isStrictArticle(data = {}) {
  return STRICT_ALL || data.editorialType === 'automated-news-analysis';
}

async function main() {
  const articles = await loadArticles();
  const issues = [];
  const sourceOwners = new Map();

  for (const article of articles) {
    const sourceUrl = article.data.sourceUrl || extractSourceFromMarkdown(article.body);
    const data = { ...article.data, sourceUrl };
    const strict = isStrictArticle(data);
    const articleIssues = auditArticleRecord({ slug: article.slug, data, body: article.body })
      .filter((issue) => strict || UNIVERSAL_CODES.has(issue.code));

    for (const issue of articleIssues) {
      issues.push({ slug: article.slug, file: article.file, ...issue });
    }

    if (strict && sourceUrl) {
      const key = canonicalSourceUrl(sourceUrl);
      const owner = sourceOwners.get(key);
      if (owner && owner !== article.slug) {
        issues.push({
          slug: article.slug,
          file: article.file,
          code: 'duplicate_source',
          message: `Fonte ja usada por ${owner}: ${key}`,
        });
      } else {
        sourceOwners.set(key, article.slug);
      }
    }
  }

  console.log(`[audit:editorial] articles=${articles.length} issues=${issues.length} strictAll=${STRICT_ALL}`);
  for (const issue of issues) {
    console.log(`- [${issue.code}] ${issue.slug}: ${issue.message}`);
  }

  if (issues.length > 0) process.exit(1);
}

main().catch((error) => {
  console.error(`[audit:editorial] ${error.message}`);
  process.exit(1);
});
