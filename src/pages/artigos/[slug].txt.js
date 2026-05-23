import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const articles = await getCollection('articles');
  return articles.map((entry) => ({
    params: { slug: entry.id },
    props: { entry },
  }));
}

export async function GET({ props, site }) {
  const { entry } = props;
  const { title, description, category, author, date, tags } = entry.data;
  
  const url = new URL(`/artigos/${entry.id}/`, site || 'https://www.techbriefing.com.br').toString();
  const formattedDate = new Date(date).toISOString().split('T')[0];

  let content = `# ${title}\n\n`;
  content += `- URL Original: ${url}\n`;
  content += `- Data: ${formattedDate}\n`;
  if (author) content += `- Autor: ${author}\n`;
  if (category) content += `- Categoria: ${category}\n`;
  if (tags && tags.length > 0) content += `- Tags: ${tags.join(', ')}\n`;
  if (description) content += `- Resumo: ${description}\n\n`;
  content += `---\n\n`;
  content += `${entry.body}\n`;

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600'
    }
  });
}
