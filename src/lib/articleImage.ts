export const DEFAULT_ARTICLE_IMAGE = '/images/editorial/tech-radar.svg';
export const DEFAULT_OG_IMAGE = '/assets/og-default.webp';

type ResolveArticleImageInput = {
  slug?: string;
  image?: unknown;
  title?: string;
  category?: string;
};

function isHttpUrl(value: string) {
  return /^https?:\/\//i.test(value);
}

function isLocalPath(value: string) {
  return value.startsWith('/');
}

export function normalizeSanityImage(image: unknown): string | undefined {
  if (!image) return undefined;
  if (typeof image === 'string') return image;
  if (typeof image === 'object' && image !== null) {
    const record = image as { asset?: { url?: string }; url?: string };
    return record.asset?.url || record.url;
  }
  return undefined;
}

export function resolveArticleImage({
  slug = '',
  image,
  title = '',
  category = '',
}: ResolveArticleImageInput): string {
  const normalized = normalizeSanityImage(image);
  if (normalized) {
    if (isHttpUrl(normalized)) return normalized;
    if (isLocalPath(normalized)) return normalized;
  }

  if (slug) {
    return `/images/news/${slug}.svg`;
  }

  if (category?.toLowerCase().includes('automa')) {
    return '/images/editorial/automation-workflow.svg';
  }

  if (category?.toLowerCase().includes('agent')) {
    return '/images/editorial/agents-operations.svg';
  }

  if (title) return DEFAULT_ARTICLE_IMAGE;
  return DEFAULT_ARTICLE_IMAGE;
}

export function resolveOgImage({
  slug = '',
  image,
}: ResolveArticleImageInput = {}): string {
  const normalized = normalizeSanityImage(image);

  if (normalized && isHttpUrl(normalized)) {
    return normalized;
  }

  if (normalized && isLocalPath(normalized)) {
    if (normalized.endsWith('.svg') && slug) {
      return `/images/og/${slug}.webp`;
    }
    return normalized;
  }

  if (slug) {
    return `/images/og/${slug}.webp`;
  }

  return DEFAULT_OG_IMAGE;
}
