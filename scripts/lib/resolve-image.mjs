import { existsSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { renderNewsCover } from './render-cover.mjs';

const ROOT = process.cwd();
const NEWS_DIR = path.join(ROOT, 'public', 'images', 'news');
const RADAR_DIR = path.join(ROOT, 'public', 'images', 'radar');
const PUBLIC_DIR = path.join(ROOT, 'public');

const PLACEHOLDER_PATTERNS = [
  /placeholder/i,
  /default-share/i,
  /logo\.(png|jpg|svg)/i,
  /favicon/i,
  /avatar/i,
  /1x1/i,
  /pixel/i,
  /blank/i,
];

const UNSPLASH_PATTERN = /images\.unsplash\.com/i;

export function isUnsplashUrl(value = '') {
  return UNSPLASH_PATTERN.test(String(value));
}

export function isLocalImagePath(value = '') {
  return String(value).startsWith('/');
}

export function localImageExists(imagePath = '') {
  if (!isLocalImagePath(imagePath)) return false;
  return existsSync(path.join(PUBLIC_DIR, imagePath.replace(/^\//, '')));
}

export function newsSvgPath(slug) {
  return `/images/news/${slug}.svg`;
}

export function radarSvgPath(dateIso) {
  return `/images/radar/radar-tech-${dateIso}.svg`;
}

export function extractSourceFromMarkdown(body = '') {
  const markdownLink = body.match(/\*\*Fonte:\*\*\s*\[[^\]]+\]\((https?:\/\/[^)]+)\)/i);
  if (markdownLink?.[1]) return markdownLink[1];

  const firstLink = body.match(/\((https?:\/\/[^)]+)\)/);
  return firstLink?.[1] || '';
}

export function extractRssImage(block = '') {
  const patterns = [
    /<media:content[^>]+url=["']([^"']+)["']/i,
    /<media:thumbnail[^>]+url=["']([^"']+)["']/i,
    /<enclosure[^>]+url=["']([^"']+)["'][^>]+type=["']image/i,
    /<enclosure[^>]+type=["']image[^"']*["'][^>]+url=["']([^"']+)["']/i,
    /<image><url>([^<]+)<\/url><\/image>/i,
  ];

  for (const pattern of patterns) {
    const match = block.match(pattern);
    if (match?.[1]) return match[1].trim();
  }

  return '';
}

function isLikelyPlaceholder(url = '') {
  return PLACEHOLDER_PATTERNS.some((pattern) => pattern.test(url));
}

async function fetchWithTimeout(url, options = {}, timeoutMs = 8000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'user-agent': 'TechBriefingImageBot/1.0',
        ...(options.headers || {}),
      },
      redirect: 'follow',
    });
  } finally {
    clearTimeout(timer);
  }
}

export async function validateRemoteImage(url) {
  if (!url || isLikelyPlaceholder(url)) return null;

  try {
    const head = await fetchWithTimeout(url, { method: 'HEAD' });
    if (head.ok) {
      const type = head.headers.get('content-type') || '';
      if (type.startsWith('image/')) return url;
    }

    const res = await fetchWithTimeout(url, { method: 'GET' });
    if (!res.ok) return null;

    const type = res.headers.get('content-type') || '';
    if (!type.startsWith('image/')) return null;

    const buffer = Buffer.from(await res.arrayBuffer());
    if (buffer.length < 8000) return null;

    return url;
  } catch {
    return null;
  }
}

export async function extractOgImage(pageUrl) {
  if (!pageUrl) return null;

  try {
    const res = await fetchWithTimeout(pageUrl, { method: 'GET' });
    if (!res.ok) return null;

    const html = await res.text();
    const patterns = [
      /<meta[^>]+property=["']og:image(?::secure_url)?["'][^>]+content=["']([^"']+)["']/i,
      /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image(?::secure_url)?["']/i,
      /<meta[^>]+name=["']twitter:image(?::src)?["'][^>]+content=["']([^"']+)["']/i,
      /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image(?::src)?["']/i,
    ];

    for (const pattern of patterns) {
      const match = html.match(pattern);
      if (match?.[1]) {
        const absolute = new URL(match[1], pageUrl).toString();
        const valid = await validateRemoteImage(absolute);
        if (valid) return valid;
      }
    }
  } catch {
    return null;
  }

  return null;
}

export async function resolveRemoteImage({ sourceUrl, rssImageUrl }) {
  if (rssImageUrl) {
    const absoluteRss = sourceUrl ? new URL(rssImageUrl, sourceUrl).toString() : rssImageUrl;
    const validRss = await validateRemoteImage(absoluteRss);
    if (validRss) return { url: validRss, origin: 'rss' };
  }

  if (sourceUrl) {
    const og = await extractOgImage(sourceUrl);
    if (og) return { url: og, origin: 'og' };
  }

  return null;
}

export async function ensureNewsSvg({ slug, title, category, source, apply = false }) {
  await mkdir(NEWS_DIR, { recursive: true });
  const publicPath = newsSvgPath(slug);
  const filePath = path.join(PUBLIC_DIR, publicPath.replace(/^\//, ''));

  if (existsSync(filePath)) {
    return { path: publicPath, origin: 'existing', created: false };
  }

  const svg = renderNewsCover({ title, category, source, slug });
  if (apply) {
    await writeFile(filePath, svg, 'utf8');
  }

  return { path: publicPath, origin: 'generated', created: apply };
}

export function resolveRadarImage(dateIso) {
  const publicPath = radarSvgPath(dateIso);
  if (existsSync(path.join(PUBLIC_DIR, publicPath.replace(/^\//, '')))) {
    return { path: publicPath, origin: 'existing-radar' };
  }
  return null;
}

export function shouldReplaceImage(image = '', slug = '') {
  if (!image) return true;
  if (isUnsplashUrl(image)) return true;

  if (isLocalImagePath(image)) {
    if (!localImageExists(image)) return true;
    const expectedNews = newsSvgPath(slug);
    if (image !== expectedNews && image.startsWith('/images/article-')) return true;
    if (image.endsWith('.png')) return true;
    if (slug.startsWith('radar-tech-') && !image.startsWith('/images/radar/')) return true;
    if (existsSync(path.join(PUBLIC_DIR, 'images', 'news', `${slug}.svg`)) && image !== expectedNews) {
      return true;
    }
  }

  return false;
}

export async function resolveArticleImage({
  slug,
  title,
  category,
  image,
  sourceUrl = '',
  rssImageUrl = '',
  variant = 'news',
  apply = false,
  preferRemote = true,
}) {
  if (variant === 'radar') {
    const dateMatch = slug.match(/radar-tech-(\d{4}-\d{2}-\d{2})/);
    if (dateMatch) {
      const radar = resolveRadarImage(dateMatch[1]);
      if (radar) return radar;
    }
  }

  const existingNewsPath = newsSvgPath(slug);
  if (existsSync(path.join(PUBLIC_DIR, existingNewsPath.replace(/^\//, '')))) {
    return { path: existingNewsPath, origin: 'existing' };
  }

  if (preferRemote && !shouldReplaceImage(image, slug) && !isUnsplashUrl(image) && !isLocalImagePath(image)) {
    return { path: image, origin: 'current-remote' };
  }

  if (preferRemote && sourceUrl) {
    const remote = await resolveRemoteImage({ sourceUrl, rssImageUrl });
    if (remote) return { path: remote.url, origin: remote.origin };
  }

  const generated = await ensureNewsSvg({
    slug,
    title,
    category,
    source: sourceUrl ? new URL(sourceUrl).hostname.replace(/^www\./, '') : 'TECH BRIEFING',
    apply,
  });

  return generated;
}
