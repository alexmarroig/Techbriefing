const fs = require('fs');
const path = require('path');

const comparativos = [
  {
    slug: 'chatgpt-vs-claude',
    title: 'ChatGPT vs Claude: Qual a melhor IA em 2026?',
    desc: 'Comparativo definitivo entre o ChatGPT (OpenAI) e o Claude (Anthropic). Descubra qual é o melhor modelo de linguagem para programação, redação e análise de dados.',
    author: 'Mariana Costa'
  },
  {
    slug: 'chatgpt-vs-gemini',
    title: 'ChatGPT vs Gemini: Qual o melhor LLM?',
    desc: 'Análise aprofundada das diferenças entre o ChatGPT da OpenAI e o ecossistema Gemini do Google para uso corporativo e pessoal.',
    author: 'Mariana Costa'
  },
  {
    slug: 'make-vs-zapier',
    title: 'Make vs Zapier: Qual a melhor plataforma de automação?',
    desc: 'Comparação completa de preços, facilidade de uso e integrações entre Make (Integromat) e Zapier.',
    author: 'Thiago Mendes'
  },
  {
    slug: 'n8n-vs-make',
    title: 'n8n vs Make: Automação Open Source vs SaaS Visual',
    desc: 'Descubra se o n8n vale o esforço de hospedagem própria ou se a interface visual perfeita do Make vence a batalha das automações de IA.',
    author: 'Thiago Mendes'
  },
  {
    slug: 'perplexity-vs-chatgpt',
    title: 'Perplexity vs ChatGPT: Qual o melhor para pesquisa?',
    desc: 'O Perplexity substitui o Google? Veja como a ferramenta de pesquisa conversacional se compara com o modo web do ChatGPT.',
    author: 'Mariana Costa'
  },
  {
    slug: 'midjourney-vs-leonardo-ai',
    title: 'Midjourney vs Leonardo AI: Geração de Imagens',
    desc: 'Qual gerador de imagens por IA usar? O poder artístico bruto do Midjourney ou o controle granular e UI do Leonardo AI.',
    author: 'Lucas Andrade'
  },
  {
    slug: 'runway-vs-kling',
    title: 'Runway vs Kling AI: Geradores de Vídeo em 2026',
    desc: 'Comparativo dos modelos gigantes de geração de vídeo. Qual plataforma oferece o maior fotorrealismo e consistência física?',
    author: 'Lucas Andrade'
  },
  {
    slug: 'elevenlabs-vs-playht',
    title: 'ElevenLabs vs PlayHT: Vozes por IA',
    desc: 'As melhores ferramentas de clonagem e geração de voz por Inteligência Artificial frente a frente.',
    author: 'Lucas Andrade'
  },
  {
    slug: 'crewai-vs-langgraph',
    title: 'CrewAI vs LangGraph: Frameworks de Agentes de IA',
    desc: 'Uma análise técnica focada em desenvolvedores: como orquestrar múltiplos agentes usando a simplicidade do CrewAI ou o controle absoluto do LangGraph.',
    author: 'Lucas Andrade'
  },
  {
    slug: 'notebooklm-vs-chatgpt',
    title: 'NotebookLM vs ChatGPT: Qual o melhor para estudar?',
    desc: 'Como a ferramenta de pesquisa do Google focada em fontes próprias (NotebookLM) se compara à análise de PDFs do ChatGPT.',
    author: 'Thiago Mendes'
  }
];

const dir = path.join(__dirname, 'src', 'content', 'comparativos');

for (const comp of comparativos) {
  const [toolA, toolB] = comp.title.split(':')[0].split(' vs ');
  const dateStr = new Date().toISOString().split('T')[0];
  
  const markdown = `---
title: "${comp.title}"
description: "${comp.desc.replace(/"/g, "'")}"
author: "${comp.author}"
date: ${dateStr}
readTime: "6 min"
featured: true
tools: ["${toolA}", "${toolB}"]
faq:
  - question: "Qual é mais barato entre ${toolA} e ${toolB}?"
    answer: "Os custos variam com o nível de uso. Acesse a seção de 'Preço' acima para o detalhamento dos planos atualizados."
  - question: "${toolA} é melhor para iniciantes?"
    answer: "A curva de aprendizado depende muito da sua bagagem técnica. Detalhamos essa resposta na seção 'Facilidade de uso' deste artigo."
  - question: "Posso integrar essas ferramentas via API?"
    answer: "Sim, ambas possuem endpoints robustos, embora os limites de rate e autenticação difiram."
---

## Resumo rápido
Nesta análise direta entre **${toolA}** e **${toolB}**, destilamos qual atende melhor necessidades operacionais e de criação de forma prática e pragmática, sem enrolação. Se você está em dúvida sobre qual usar, abordaremos prós, contras e casos de uso específicos de cada uma.

## Tabela comparativa

| Funcionalidade/Critério | ${toolA} | ${toolB} |
| :--- | :--- | :--- |
| **Foco principal** | [Inserir foco do ${toolA}] | [Inserir foco do ${toolB}] |
| **Curva de aprendizado** | Média | Média |
| **Modelo de precificação** | Freemium | Freemium |
| **Qualidade da API** | Alta | Alta |

## Melhor para

### Use o ${toolA} se:
- Você prioriza X.
- O seu time precisa de Y.
- Você tem conhecimento prévio em Z.

### Use o ${toolB} se:
- A facilidade de uso for crucial.
- Você quiser integrar com W rapidamente.
- O orçamento é estrito no formato pay-as-you-go.

## Preço
**${toolA}:** Geralmente oferece um plano base em torno de $20/mês para funcionalidades padrão, com cobranças adicionais baseadas no consumo (credits/tokens).
**${toolB}:** Conta com um plano gratuito generoso, e a progressão para contas Pro ocorre em *tiers* fixos (ex: $15, $30).

## Facilidade de uso
O **${toolA}** tende a ter uma interface mais robusta e inicialmente intimidadora, enquanto o **${toolB}** prioriza um onboarding visual rápido (drag and drop ou interface de chat fluida), ideal para quem não é da área técnica.

## Recursos
Aqui estão os destaques que diferenciam as plataformas em ambiente corporativo. Enquanto o ${toolA} domina em precisão absoluta, o ${toolB} se sobressai em velocidade e plugins nativos.

## Limitações
Nenhuma ferramenta é mágica. As principais falhas apontadas pela comunidade são a instabilidade de servidores (durante altos picos) no ${toolB} e a falta de personalização fina no ${toolA}.

## Qual escolher?
O veredito é pragmático: se você for um desenvolvedor buscando escalabilidade, **${toolA}** leva a vantagem. Se você é um líder de operação querendo automatizar o setor amanhã de forma visual, o **${toolB}** é insuperável.
`;

  fs.writeFileSync(path.join(dir, `${comp.slug}.md`), markdown, 'utf-8');
}

console.log('Comparativos gerados com sucesso!');
