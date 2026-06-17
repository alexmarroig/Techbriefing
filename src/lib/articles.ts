import { getCollection } from 'astro:content';
import { client } from '../sanity/lib/client';
import { archiveQuery, allArticlesQuery } from '../sanity/lib/queries';
import { resolveArticleImage } from './articleImage';

type ArticleRecord = {
  slug: string;
  href: string;
  title: string;
  description?: string;
  category?: string;
  author?: string;
  date?: string | Date;
  readTime?: string;
  featured?: boolean;
  image?: string;
  tags?: string[];
  type?: string;
};

function normalizeLocalArticle(entry: Awaited<ReturnType<typeof getCollection<'articles'>>>[number]): ArticleRecord {
  const slug = entry.id;
  return {
    slug,
    href: `/artigos/${slug}`,
    title: entry.data.title,
    description: entry.data.description,
    category: entry.data.category,
    author: entry.data.author,
    date: entry.data.date,
    readTime: entry.data.readTime,
    featured: entry.data.featured,
    image: resolveArticleImage({
      slug,
      image: entry.data.image,
      title: entry.data.title,
      category: entry.data.category,
    }),
    tags: entry.data.tags,
    type: 'article',
  };
}

function normalizeSanityArticle(entry: Record<string, unknown>): ArticleRecord {
  const slug = String(entry.slug || '');
  return {
    slug,
    href: `/artigos/${slug}`,
    title: String(entry.title || ''),
    description: String(entry.description || ''),
    category: String(entry.category || ''),
    author: String(entry.author || ''),
    date: entry.date as string | Date | undefined,
    readTime: String(entry.readTime || ''),
    featured: Boolean(entry.featured),
    image: resolveArticleImage({
      slug,
      image: entry.image,
      title: String(entry.title || ''),
      category: String(entry.category || ''),
    }),
    tags: Array.isArray(entry.tags) ? entry.tags.map(String) : [],
    type: String(entry._type || 'article'),
  };
}

export async function getMergedArticles(): Promise<ArticleRecord[]> {
  const [sanityArticles, localArticles] = await Promise.all([
    client.fetch(allArticlesQuery),
    getCollection('articles'),
  ]);

  const bySlug = new Map<string, ArticleRecord>();

  for (const entry of localArticles) {
    bySlug.set(entry.id, normalizeLocalArticle(entry));
  }

  for (const entry of sanityArticles) {
    bySlug.set(String(entry.slug), normalizeSanityArticle(entry));
  }

  return [...bySlug.values()].sort(
    (a, b) => new Date(b.date || 0).valueOf() - new Date(a.date || 0).valueOf(),
  );
}

export async function getMergedArchiveItems(): Promise<ArticleRecord[]> {
  const [sanityItems, localArticles] = await Promise.all([
    client.fetch(archiveQuery),
    getCollection('articles'),
  ]);

  const bySlug = new Map<string, ArticleRecord>();

  for (const entry of localArticles) {
    bySlug.set(entry.id, normalizeLocalArticle(entry));
  }

  for (const entry of sanityItems) {
    const slug = String(entry.slug || '');
    const href = entry._type === 'comparativo' ? `/comparativos/${slug}` : `/artigos/${slug}`;
    bySlug.set(`${entry._type}:${slug}`, {
      slug,
      href,
      title: String(entry.title || ''),
      description: String(entry.description || ''),
      category: String(entry.category || ''),
      author: String(entry.author || ''),
      date: entry.date as string | Date | undefined,
      readTime: String(entry.readTime || ''),
      featured: Boolean(entry.featured),
      image: resolveArticleImage({
        slug,
        image: entry.image,
        title: String(entry.title || ''),
        category: String(entry.category || ''),
      }),
      tags: Array.isArray(entry.tags) ? entry.tags.map(String) : [],
      type: String(entry._type || 'article'),
    });
  }

  return [...bySlug.values()].sort(
    (a, b) => new Date(b.date || 0).valueOf() - new Date(a.date || 0).valueOf(),
  );
}
