import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const article = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.string(),
    author: z.string(),
    date: z.coerce.date(),
    readTime: z.string(),
    featured: z.boolean().default(false),
    image: z.string().optional(),
    tags: z.array(z.string()).default([]),
  }),
});

const comparativo = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/comparativos' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.string().default('Comparativo'),
    author: z.string(),
    date: z.coerce.date(),
    readTime: z.string(),
    featured: z.boolean().default(false),
    image: z.string().optional(),
    tools: z.array(z.string()).default([]),
  }),
});

const tool = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/tools' }),
  schema: z.object({
    name: z.string(),
    icon: z.string(),
    description: z.string(),
    category: z.string(),
    categoryId: z.string(),
    rating: z.number().min(0).max(5),
    affiliate: z.boolean().default(false),
    url: z.string().default('/ferramentas'),
  }),
});

const app = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/apps' }),
  schema: z.object({
    name: z.string(),
    icon: z.string(),
    description: z.string(),
    status: z.string(),
    platform: z.string(),
    url: z.string().default('/apps'),
  }),
});

const ebook = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/ebooks' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    price: z.string(),
    oldPrice: z.string().optional(),
    pages: z.number(),
    color: z.string().default('amber'),
    benefits: z.array(z.string()).default([]),
    url: z.string().default('/ebooks'),
  }),
});

export const collections = {
  articles: article,
  comparativos: comparativo,
  tools: tool,
  apps: app,
  ebooks: ebook,
};
