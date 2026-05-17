export const PROMPT_CATEGORIES = [
  { id: 'negocios', label: 'Negócios', description: 'Diagnóstico, estratégia, ofertas e decisões melhores.' },
  { id: 'agentes', label: 'Agentes', description: 'Arquitetura, testes, ferramentas e limites de agentes.' },
  { id: 'automacao', label: 'Automação', description: 'Fluxos repetíveis para operação, vendas e suporte.' },
  { id: 'conteudo', label: 'Conteúdo', description: 'Ideias, roteiros, artigos, newsletters e distribuição.' },
  { id: 'video-voz', label: 'Vídeo, imagem e voz', description: 'Prompts para criativos, avatares, voz e vídeos.' },
  { id: 'dados', label: 'Análise de dados', description: 'Leitura de planilhas, métricas, relatórios e insights.' },
  { id: 'design-produto', label: 'Design e produto', description: 'UX, landing pages, apps, copy e protótipos.' },
  { id: 'vendas-marketing', label: 'Vendas e marketing', description: 'Anúncios, funis, objeções, propostas e follow-up.' },
];

export const PROMPTS = [
  {
    slug: 'diagnostico-processos-ia',
    category: 'negocios',
    title: 'Diagnóstico de processos para aplicar IA',
    objective: 'Encontrar onde IA pode economizar tempo, reduzir erro ou virar oferta.',
    whenToUse: 'Use antes de comprar ferramenta, contratar freelancer ou prometer automação para cliente.',
    prompt: `Atue como consultor sênior de operações e IA aplicada.

Analise o negócio abaixo e encontre oportunidades reais de aplicação de IA.

Contexto do negócio:
[descreva o negócio, público, equipe, canais, ferramentas e principais tarefas]

Quero que você entregue:
1. lista das tarefas repetitivas que consomem mais tempo;
2. quais tarefas podem virar automação simples;
3. quais tarefas podem virar agente de IA;
4. risco de cada ideia;
5. impacto esperado em tempo, custo ou receita;
6. primeiro experimento de baixo risco para testar em 7 dias.

Responda em tabela e termine com uma recomendação objetiva do que fazer primeiro.`,
    variations: ['Troque “negócio” por “consultoria”, “clínica”, “loja online” ou “agência”.', 'Peça uma versão com orçamento de R$0, R$100 e R$500 por mês.'],
    nextSteps: ['Transforme a melhor oportunidade em checklist.', 'Leve a ideia para um manual ou automação pequena.', 'Meça antes/depois por 7 dias.'],
  },
  {
    slug: 'arquitetura-agente-ia',
    category: 'agentes',
    title: 'Arquitetura de agente de IA antes de construir',
    objective: 'Desenhar o agente com objetivo, entrada, saída, ferramentas, regras e limites.',
    whenToUse: 'Use antes de abrir n8n, CrewAI, LangGraph, OpenHands, OpenClaw ou qualquer builder.',
    prompt: `Atue como arquiteto de agentes de IA.

Quero criar um agente para:
[descreva a tarefa real]

Monte a arquitetura mínima do agente com:
1. objetivo do agente;
2. entrada esperada;
3. saída esperada;
4. ferramentas que ele pode usar;
5. dados ou memória necessários;
6. regras e limites;
7. quando pedir aprovação humana;
8. riscos técnicos e operacionais;
9. critérios para dizer que funcionou;
10. primeiro teste com 3 casos reais.

Não escreva código ainda. Primeiro desenhe o sistema de forma clara.`,
    variations: ['Peça versão no-code com n8n.', 'Peça versão técnica com LangGraph.', 'Peça versão segura para dados sensíveis.'],
    nextSteps: ['Teste com 3 entradas reais.', 'Adicione logs.', 'Só automatize ação depois de validar a resposta.'],
  },
  {
    slug: 'fluxo-automacao-n8n',
    category: 'automacao',
    title: 'Fluxo de automação com n8n ou Make',
    objective: 'Transformar uma rotina manual em fluxo com gatilho, etapas e tratamento de erro.',
    whenToUse: 'Use quando você já sabe a tarefa, mas ainda não sabe como ligar as ferramentas.',
    prompt: `Atue como especialista em automação no-code.

Quero automatizar esta rotina:
[descreva o passo a passo manual atual]

Ferramentas disponíveis:
[liste ferramentas como Gmail, Sheets, Notion, CRM, WhatsApp, Stripe, Kiwify, etc.]

Crie um desenho de fluxo com:
1. gatilho inicial;
2. etapas em ordem;
3. dados que entram e saem de cada etapa;
4. onde usar IA;
5. validações obrigatórias;
6. tratamento de erro;
7. logs;
8. teste mínimo antes de publicar;
9. versão simples e versão avançada.

Responda como se eu fosse montar isso no n8n ou Make.`,
    variations: ['Peça um fluxo sem código.', 'Peça um fluxo com webhook.', 'Peça uma versão para atendimento ou vendas.'],
    nextSteps: ['Monte só o gatilho e a primeira ação.', 'Teste com dados falsos.', 'Depois conecte dados reais.'],
  },
  {
    slug: 'roteiro-video-viral-ia',
    category: 'video-voz',
    title: 'Roteiro para vídeo curto com IA',
    objective: 'Criar roteiro vertical com gancho, imagem forte, fala curta e CTA.',
    whenToUse: 'Use para Reels, Shorts, TikTok, anúncio ou vídeo de produto.',
    prompt: `Atue como roteirista de vídeos curtos e estrategista de retenção.

Tema do vídeo:
[tema]

Público:
[público]

Objetivo:
[vender, captar lead, explicar, viralizar, educar]

Crie 5 roteiros de até 30 segundos com:
1. gancho nos 2 primeiros segundos;
2. promessa clara;
3. sequência visual cena por cena;
4. fala ou narração;
5. texto na tela;
6. sugestão de imagem/vídeo gerado por IA;
7. CTA final.

Evite frases genéricas. Quero ideias específicas e chamativas.`,
    variations: ['Peça versão sensacionalista, premium ou educativa.', 'Peça prompts para Runway, Kling, Veo ou Pika.'],
    nextSteps: ['Produza 3 variações do gancho.', 'Publique e compare retenção.', 'Transforme o melhor em anúncio.'],
  },
  {
    slug: 'analise-planilha-metricas',
    category: 'dados',
    title: 'Análise de planilha e métricas',
    objective: 'Transformar dados crus em leitura executiva e próximos passos.',
    whenToUse: 'Use com exportações de Google Ads, GA4, Kiwify, Stripe, CRM ou planilhas internas.',
    prompt: `Atue como analista de dados de crescimento.

Vou colar uma tabela/exportação abaixo.

Dados:
[cole os dados]

Analise e entregue:
1. principais padrões;
2. gargalos;
3. oportunidades;
4. métricas que importam;
5. métricas que podem enganar;
6. hipóteses para testar;
7. plano de ação de 7 dias;
8. o que eu não posso concluir com esses dados ainda.

Se faltar dado, diga exatamente o que falta.`,
    variations: ['Peça leitura focada em vendas.', 'Peça leitura focada em tráfego pago.', 'Peça versão com tabela de prioridade.'],
    nextSteps: ['Salvar hipóteses.', 'Executar um teste por vez.', 'Voltar com dados novos.'],
  },
  {
    slug: 'landing-page-conversao',
    category: 'design-produto',
    title: 'Auditoria de landing page para conversão',
    objective: 'Encontrar por que a página recebe clique, mas não converte.',
    whenToUse: 'Use antes de trocar paleta, baixar preço ou refazer a página inteira.',
    prompt: `Atue como consultor sênior de UX, copywriting e conversão.

Analise esta landing page:
[cole URL, prints ou texto da página]

Produto:
[produto, preço, público e oferta]

Dados disponíveis:
[cliques, CTR, sessões, checkout, abandono, vendas]

Entregue:
1. o que reduz confiança;
2. o que está confuso;
3. o que está fraco na promessa;
4. onde inserir prova;
5. o que remover;
6. nova ordem da página;
7. 5 testes A/B simples;
8. prioridade de implementação.

Seja direto, sem elogio vazio.`,
    variations: ['Peça versão para ebook low-ticket.', 'Peça versão para mobile.', 'Peça checklist de Clarity.'],
    nextSteps: ['Corrigir só os 3 maiores atritos.', 'Medir por 3 dias.', 'Não mudar tudo ao mesmo tempo.'],
  },
  {
    slug: 'oferta-produto-digital',
    category: 'vendas-marketing',
    title: 'Oferta para produto digital low-ticket',
    objective: 'Clarear promessa, bônus, garantia, objeções e checkout.',
    whenToUse: 'Use para ebook, template, mini-curso, pack de prompts ou aula gravada.',
    prompt: `Atue como estrategista de oferta para produto digital low-ticket.

Produto:
[descreva o produto]

Preço:
[preço]

Público:
[quem compra]

Dor principal:
[dor]

Crie uma oferta completa com:
1. promessa principal;
2. 5 bullets de benefício;
3. 3 bônus simples;
4. garantia;
5. objeções e respostas;
6. headline;
7. CTA principal;
8. texto curto para anúncio;
9. texto curto para checkout.

Não use promessa milagrosa. Quero algo forte, mas confiável.`,
    variations: ['Peça versão mais premium.', 'Peça versão mais direta para Google Ads.', 'Peça versão com urgência honesta.'],
    nextSteps: ['Aplicar na landing.', 'Revisar checkout.', 'Criar remarketing para quem clicou e não comprou.'],
  },
  {
    slug: 'newsletter-diaria-tech',
    category: 'conteudo',
    title: 'Newsletter diária de tecnologia aplicável',
    objective: 'Transformar notícias em briefing útil com ponto de vista e ação.',
    whenToUse: 'Use para criar edições diárias sem virar cópia de notícia.',
    prompt: `Atue como editor-chefe de uma newsletter de tecnologia e IA aplicada.

Fontes e notícias do dia:
[cole links ou resumos]

Público:
profissionais, empreendedores e criadores que querem aplicar IA no trabalho.

Crie uma edição com:
1. assunto de e-mail;
2. abertura curta;
3. 5 notícias selecionadas;
4. para cada notícia: o que aconteceu, por que importa, como aplicar;
5. uma recomendação prática do dia;
6. um CTA para guia, prompt ou ferramenta;
7. tom claro, premium e sem hype.

Não traduza literalmente. Faça curadoria.`,
    variations: ['Peça edição para negócios.', 'Peça edição para criadores.', 'Peça edição com foco em ferramentas.'],
    nextSteps: ['Publicar no blog.', 'Enviar por e-mail.', 'Medir cliques por tema.'],
  },
];

export const getPromptCategory = (id) => PROMPT_CATEGORIES.find((category) => category.id === id);
export const getPromptsByCategory = (id) => PROMPTS.filter((prompt) => prompt.category === id);
