import { getCollection } from 'astro:content';

export async function GET({ site }) {
  // Obter todos os artigos públicos
  const articles = await getCollection('articles');
  
  // Ordenar por data (mais recentes primeiro)
  articles.sort((a, b) => new Date(b.data.date).valueOf() - new Date(a.data.date).valueOf());

  let content = `# Tech Briefing - Base de Conhecimento Completa\n\n`;
  content += `> Este arquivo contém a compilação completa dos artigos, guias e análises públicas do Tech Briefing.\n`;
  content += `> Site Oficial: https://www.techbriefing.com.br\n`;
  content += `> Otimizado para leitura por Large Language Models (LLMs).\n\n`;
  content += `---\n\n`;

  for (const article of articles) {
    const { title, description, category, author, date, tags } = article.data;
    const url = new URL(`/artigos/${article.id}/`, site || 'https://www.techbriefing.com.br').toString();
    const formattedDate = new Date(date).toISOString().split('T')[0];
    
    content += `## ${title}\n\n`;
    content += `- URL: ${url}\n`;
    content += `- Data: ${formattedDate}\n`;
    if (author) content += `- Autor: ${author}\n`;
    if (category) content += `- Categoria: ${category}\n`;
    if (tags && tags.length > 0) content += `- Tags: ${tags.join(', ')}\n`;
    if (description) content += `- Resumo: ${description}\n\n`;
    
    // O conteúdo cru do Markdown está em article.body
    content += `### Conteúdo\n\n`;
    content += `${article.body}\n\n`;
    content += `---\n\n`;
  }

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600'
    }
  });
}
