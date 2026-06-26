import { GoogleGenAI } from '@google/genai';
import { createClient } from '@sanity/client';
import { htmlToBlocks } from '@sanity/block-tools';
import { Schema } from '@sanity/schema';
import { marked } from 'marked';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  console.error("ERRO: GEMINI_API_KEY não encontrada no .env");
  console.log("Por favor, adicione sua chave do Google Gemini Studio no arquivo .env");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
const sanityClient = createClient({
  projectId: process.env.PUBLIC_SANITY_PROJECT_ID || 'vn3iz3iz',
  dataset: process.env.PUBLIC_SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
  token: process.env.SANITY_API_WRITE_TOKEN
});

// A basic schema to satisfy @sanity/block-tools
const defaultSchema = Schema.compile({
  name: 'default',
  types: [
    {
      type: 'object',
      name: 'blogPost',
      fields: [
        {
          title: 'Body',
          name: 'body',
          type: 'array',
          of: [{ type: 'block' }, { type: 'image' }]
        }
      ]
    }
  ]
});
const blockContentType = defaultSchema.get('blogPost').fields.find((f) => f.name === 'body').type;

const TOPICS = [
  "O que são Agentes de IA Autônomos?",
  "Como usar o Cursor AI para Programação",
  "N8N vs Make: Qual a melhor ferramenta de Automação IA?",
  "Como implementar Answer Engine Optimization (AIO)",
  "Guia Completo de Prompt Engineering para Negócios",
  "O que é RAG (Retrieval-Augmented Generation)?",
  "Como criar um Assistente de Voz com ElevenLabs e Vapi",
  "CrewAI vs LangGraph: Frameworks de Multi-Agentes",
  "Como a IA está transformando o Atendimento ao Cliente",
  "OpenAI GPT-5: Expectativas e Rumores",
  "O impacto da IA Generativa no Marketing Digital",
  "Como usar a IA para Análise de Dados e BI",
  "Modelos Open Source vs Proprietários (Llama 3 vs GPT-4)",
  "O que é Fine-Tuning e quando utilizar na sua empresa?",
  "Ferramentas No-Code com IA para criar produtos rápidos",
  "O Futuro do Trabalho com Agentes de IA",
  "Como proteger dados da sua empresa ao usar LLMs",
  "Casos de Uso de IA na Saúde",
  "O que é AI Workflow Automation?",
  "Melhores IAs para Geração de Vídeo (Sora, Runway, Kling)",
  "Como construir um Chatbot Inteligente para o seu Site",
  "O papel da IA na Cibersegurança",
  "Midjourney vs DALL-E 3: Comparativo Definitivo",
  "Como usar IA para SEO e Rankeamento no Google",
  "Os melhores plugins e extensões de IA para o Chrome",
  "O que é Agentic Workflow?",
  "IA no Setor Jurídico: Ferramentas e Riscos",
  "Como as Big Techs estão investindo em Infraestrutura de IA",
  "O que são Modelos Fundacionais (Foundation Models)?",
  "IA Local: Rodando LLMs no seu próprio computador com Ollama",
  "Como treinar seu time para usar IA",
  "Diferença entre Machine Learning e IA Generativa",
  "A corrida dos Robôs Humanoides (Figure, Tesla, Boston Dynamics)",
  "Como a Apple Intelligence vai mudar o iPhone",
  "Anthropic Claude 3.5 Sonnet vs GPT-4o",
  "Guia de uso do Github Copilot Enterprise",
  "O que é Token Limit e Context Window em LLMs?",
  "A ascensão das buscas com IA (Perplexity AI)",
  "Como automatizar vendas B2B com Agentes de IA",
  "IA em Recursos Humanos e Recrutamento",
  "Melhores IAs para Geração de Áudio e Música",
  "O que são Hallucinations em IA e como mitigá-las?",
  "Como montar um AI Center of Excellence (CoE) na sua empresa",
  "O que são LLMs Multimodais?",
  "Impacto da IA na Educação e Aprendizagem",
  "O papel do Chief AI Officer (CAIO) nas empresas",
  "Como a IA está revolucionando o e-commerce",
  "Desmistificando embeddings e bancos de dados vetoriais",
  "IA para pequenas empresas: por onde começar?",
  "Previsões sobre Inteligência Artificial para 2026"
];

async function generateArticle(topic) {
  const prompt = `Você é um redator especialista em tecnologia e SEO.
Escreva um artigo de blog altamente otimizado e focado em AIO (Answer Engine Optimization) sobre o tema: "${topic}".

Estrutura exigida:
1. Comece com um título chamativo (Markdown H1).
2. Escreva uma introdução cativante que prende o leitor.
3. Seção 'O que é...' ou 'Como funciona...' respondendo à intenção principal de forma clara e direta usando bullet points (Ideal para Google AI Overviews).
4. Subtítulos (H2 e H3) estruturando os tópicos principais.
5. Pelo menos uma tabela comparativa (em Markdown) ou checklist se aplicável.
6. Use formatação de negrito para destacar palavras-chave importantes.
7. Termine com uma conclusão e uma FAQ (Perguntas Frequentes) no formato H2 "FAQ" e perguntas em H3.

Escreva apenas o artigo em Markdown puro, sem mensagens de confirmação iniciais ou finais. Mantenha o tom profissional, direto e tecnológico. Formate tudo adequadamente.`;

  console.log(`\n🤖 Gerando artigo sobre: "${topic}"...`);
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.7,
        maxOutputTokens: 3000,
      }
    });
    
    let text = response.text;
    
    // Extrair o título (primeiro H1) e o restante do conteúdo
    let title = topic;
    const matchH1 = text.match(/^#\s+(.+)$/m);
    if (matchH1) {
      title = matchH1[1];
      text = text.replace(matchH1[0], '').trim();
    }
    
    return { title, bodyMarkdown: text };
  } catch (error) {
    console.error(`Erro ao gerar "${topic}":`, error.message);
    return null;
  }
}

function generateSlug(title) {
  return title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

async function run() {
  console.log("🚀 Iniciando a Máquina de Geração de 50 Artigos AIO/SEO...");
  
  let successCount = 0;
  
  for (let i = 0; i < TOPICS.length; i++) {
    const topic = TOPICS[i];
    console.log(`\n⏳ [${i + 1}/${TOPICS.length}] Processando: ${topic}`);
    
    const articleData = await generateArticle(topic);
    if (!articleData) {
      console.log("Pulando para o próximo devido a erro na IA...");
      continue;
    }
    
    const slug = generateSlug(articleData.title);
    
    // Converter Markdown para HTML para o block-tools
    const htmlBody = await marked.parse(articleData.bodyMarkdown);
    const portableTextBody = htmlToBlocks(htmlBody, blockContentType);
    
    // Criar o documento Sanity
    const doc = {
      _type: 'article',
      title: articleData.title,
      slug: { _type: 'slug', current: slug },
      excerpt: articleData.bodyMarkdown.substring(0, 150).replace(/[#*`]/g, '') + '...',
      category: 'Inovação e Tendências',
      author: 'Tech Briefing AI',
      date: new Date().toISOString().split('T')[0],
      readTime: '6 min',
      tags: ['Inteligência Artificial', 'Automação'],
      body: portableTextBody
    };
    
    try {
      const result = await sanityClient.create(doc);
      console.log(`✅ Artigo publicado no Sanity! ID: ${result._id}`);
      successCount++;
    } catch (err) {
      console.error(`Erro ao salvar no Sanity:`, err.message);
    }
    
    // Pequena pausa para evitar Rate Limits
    if (i < TOPICS.length - 1) {
      console.log("Aguardando 10 segundos antes do próximo...");
      await new Promise(r => setTimeout(r, 10000));
    }
  }
  
  console.log(`\n🎉 Processo finalizado! ${successCount}/${TOPICS.length} artigos gerados com sucesso.`);
}

run();
