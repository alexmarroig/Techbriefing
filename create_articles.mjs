import fs from 'fs';
import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
dotenv.config();

const client = createClient({
  projectId: process.env.PUBLIC_SANITY_PROJECT_ID || 'vn3iz3iz',
  dataset: process.env.PUBLIC_SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
  token: process.env.SANITY_API_WRITE_TOKEN
});

async function run() {
  console.log("Creating dummy image...");
  fs.writeFileSync('dummy_image.svg', '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400"><rect width="800" height="400" fill="#111"/><text x="400" y="200" fill="#fff" font-family="sans-serif" font-size="40" text-anchor="middle">AIO &amp; SEO 2026</text></svg>');
  
  const asset1 = await client.assets.upload('image', fs.createReadStream('dummy_image.svg'), { filename: 'aio-seo.svg' });
  
  fs.writeFileSync('dummy_image2.svg', '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400"><rect width="800" height="400" fill="#111"/><text x="400" y="200" fill="#fff" font-family="sans-serif" font-size="40" text-anchor="middle">Comunidades &amp; IA</text></svg>');
  const asset2 = await client.assets.upload('image', fs.createReadStream('dummy_image2.svg'), { filename: 'comunidades.svg' });

  const articles = [
    {
      _type: 'article',
      title: 'AIO é o novo SEO: Otimizando para Agentes de IA',
      slug: { _type: 'slug', current: 'aio-novo-seo-otimizando-para-agentes' },
      description: 'Como preparar o seu conteúdo não apenas para ranquear no Google, mas para ser a resposta padrão nos motores baseados em LLM e agentes de IA.',
      category: 'Tendências',
      author: 'Tech Briefing',
      date: new Date().toISOString(),
      readTime: '6 min',
      featured: true,
      image: {
        _type: 'image',
        asset: { _type: 'reference', _ref: asset1._id },
        alt: 'Representação visual da otimização para IAs'
      },
      tags: ['AIO', 'SEO', 'Agentes'],
      faq: [
        { _key: 'q1', question: 'O que é AIO?', answer: 'AIO (Artificial Intelligence Optimization) é a prática de estruturar o conteúdo de forma a ser perfeitamente entendido por LLMs e sistemas RAG.' }
      ],
      seo: {
        metaTitle: 'AIO é o novo SEO: Como otimizar para LLMs',
        metaDescription: 'Descubra as táticas essenciais de AIO para que o seu conteúdo seja referenciado pelo ChatGPT, Perplexity e Copilot.'
      },
      body: [
        {
          _type: 'block',
          _key: 'b1',
          style: 'normal',
          children: [{ _type: 'span', _key: 's1', text: 'Enquanto o SEO tradicional foca em palavras-chave e backlinks para algoritmos de indexação baseados em links, o AIO foca em relevância semântica e clareza estrutural para LLMs. Com o avanço rápido das respostas generativas no Google (AI Overviews) e a adoção em massa de ferramentas como Perplexity, otimizar para agentes de IA deixou de ser um diferencial e virou sobrevivência.\n\nComentário editorial: A mudança no consumo de informação exige que autores entreguem as respostas "de bandeja" no primeiro parágrafo (padrão pirâmide invertida) e utilizem marcações semânticas precisas. O uso intensivo de FAQs estruturados e de tabelas Markdown ajuda muito a inteligência artificial a ler seus dados perfeitamente.' }]
        }
      ]
    },
    {
      _type: 'article',
      title: 'A Era dos Comentários Sintéticos: Comunidades Moderadas por IA',
      slug: { _type: 'slug', current: 'comentarios-sinteticos-comunidades-moderadas-ia' },
      description: 'Análise de como os agentes de IA estão não apenas moderando fóruns e redes, mas ativamente interagindo, curando e comentando conteúdos de forma quase humana.',
      category: 'IA Prática',
      author: 'Tech Briefing',
      date: new Date().toISOString(),
      readTime: '8 min',
      featured: false,
      image: {
        _type: 'image',
        asset: { _type: 'reference', _ref: asset2._id },
        alt: 'IA analisando e organizando comunidades'
      },
      tags: ['Comunidades', 'Moderação', 'LLMs'],
      faq: [
        { _key: 'q1', question: 'A IA pode moderar comentários sozinha?', answer: 'Sim, sistemas baseados em RAG e políticas de moderação claras conseguem identificar nuances como sarcasmo e discurso de ódio com precisão superior aos filtros antigos.' }
      ],
      seo: {
        metaTitle: 'Comunidades e Moderação via IA: O Futuro dos Fóruns',
        metaDescription: 'Veja como a inteligência artificial revoluciona a interação em comunidades digitais.'
      },
      body: [
        {
          _type: 'block',
          _key: 'b1',
          style: 'normal',
          children: [{ _type: 'span', _key: 's1', text: 'Plataformas de comunidades como o Reddit e o Discord estão vivenciando a chegada de "bots participativos". Diferente dos antigos bots passivos, os novos agentes conseguem interagir com o conteúdo da postagem, oferecer perspectivas úteis e cruzar fontes.\n\nNos bastidores, ferramentas de AIO (Artificial Intelligence Optimization) ajudam essas inteligências a não engolir ruído. E para as marcas, gerenciar o que a IA pensa da sua empresa nessas comunidades já é a nova fronteira da reputação digital.\n\nComentário da moderação: Sempre configure seus agentes de comunidade com uma "system prompt" estrita para evitar alucinações nas respostas aos usuários.' }]
        }
      ]
    }
  ];

  for (const doc of articles) {
    console.log("Creating article:", doc.title);
    await client.create(doc);
  }
  
  console.log("Articles created!");
}

run().catch(console.error);
