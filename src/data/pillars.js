export const PILLARS = [
  {
    slug: 'guia-definitivo-agentes-ia',
    title: 'Guia definitivo de agentes de IA',
    description: 'Entenda o que são agentes de IA, quando usar, como desenhar arquitetura e como evitar automações frágeis.',
    kicker: 'Página-pilar',
    sections: [
      ['O que é um agente de IA', 'Um agente combina objetivo, contexto, ferramentas, regras, memória e avaliação. A diferença não está no nome, mas na capacidade de executar uma tarefa com limites definidos.'],
      ['Quando faz sentido usar', 'Use agentes quando existe uma tarefa repetitiva, entrada clara, decisão intermediária e saída revisável. Se o processo ainda é confuso para humanos, automatizar cedo demais aumenta o risco.'],
      ['Arquitetura mínima', 'Todo agente útil precisa de objetivo, entrada, saída, ferramentas permitidas, memória, regra de segurança, logs, aprovação humana e métrica de qualidade.'],
      ['Primeiro passo', 'Escolha uma tarefa pequena, teste com três casos reais e só depois conecte a sistemas sensíveis.'],
    ],
    links: [
      ['Como criar agentes autônomos', '/guias/como-criar-agentes-autonomos/'],
      ['Agentes de IA não são chatbots', '/artigos/agentes-ia-nao-sao-chatbots/'],
      ['Prompts para agentes', '/prompts/#arquitetura-agente-ia'],
    ],
  },
  {
    slug: 'melhores-ferramentas-ia-categoria',
    title: 'Melhores ferramentas de IA por categoria',
    description: 'Um mapa para escolher ferramentas de IA por uso: texto, vídeo, voz, automação, agentes, análise e criação de apps.',
    kicker: 'Stack prática',
    sections: [
      ['Como escolher sem desperdiçar assinatura', 'Comece pelo trabalho que você precisa entregar. Depois compare qualidade, custo, limite mensal, licença comercial e integração com seu fluxo.'],
      ['Categorias principais', 'Texto e pesquisa, vídeo por texto, voz e avatar, automação, agentes, criação de apps, análise de dados e design.'],
      ['Critério editorial', 'Ferramenta boa é a que reduz tempo, aumenta qualidade ou permite uma entrega que antes não era viável. Demo bonita não basta.'],
      ['Primeiro passo', 'Teste três ferramentas com o mesmo prompt e compare custo por resultado aprovado, não apenas qualidade da melhor geração.'],
    ],
    links: [
      ['Ferramentas recomendadas', '/ferramentas/'],
      ['Apps para vídeo por texto', '/guias/melhores-apps-ia-video-por-texto/'],
      ['Apps para criar app com texto', '/guias/melhores-apps-ia-criar-app-com-texto/'],
    ],
  },
  {
    slug: 'stack-ia-para-empresas',
    title: 'Stack de IA para empresas',
    description: 'Como montar uma stack enxuta de IA para conteúdo, atendimento, operação, análise e automação sem criar bagunça.',
    kicker: 'Operação',
    sections: [
      ['A stack mínima', 'Uma empresa não precisa de vinte ferramentas. Precisa de uma camada de criação, uma de automação, uma de dados, uma de documentação e uma de governança.'],
      ['O erro comum', 'Assinar ferramenta antes de mapear processo cria custo recorrente sem ganho operacional. Primeiro vem fluxo, depois ferramenta.'],
      ['Governança simples', 'Defina quem pode usar IA, quais dados entram, onde revisar saída, como salvar prompts e como medir qualidade.'],
      ['Primeiro passo', 'Escolha um departamento, mapeie três tarefas repetitivas e crie um piloto com revisão humana.'],
    ],
    links: [
      ['Diagnóstico de processos com IA', '/prompts/#diagnostico-processos-ia'],
      ['Como automatizar processos com IA', '/artigos/como-automatizar-processos-com-ia/'],
      ['Como usar n8n', '/artigos/como-usar-n8n-automacao/'],
    ],
  },
  {
    slug: 'automacao-ia-para-negocios',
    title: 'Automação com IA para negócios',
    description: 'Como transformar tarefas manuais em fluxos com IA, n8n, Make, agentes e revisão humana.',
    kicker: 'Processo',
    sections: [
      ['Automação não é mágica', 'Automação boa começa com processo claro. Se a rotina é ambígua, a IA só acelera a confusão.'],
      ['Onde aplicar primeiro', 'Atendimento, triagem de leads, resumo de reuniões, produção de conteúdo, organização de dados e follow-up comercial são bons pontos de partida.'],
      ['Como evitar quebra', 'Inclua validações, logs, fallback, aprovação humana e limite de ação para casos sensíveis.'],
      ['Primeiro passo', 'Transforme uma rotina de até 15 minutos em checklist. Depois automatize uma etapa, não o processo inteiro.'],
    ],
    links: [
      ['Prompt de fluxo n8n', '/prompts/#fluxo-automacao-n8n'],
      ['n8n vs Make', '/comparativos/n8n-vs-make/'],
      ['Erro que quebra automações', '/artigos/erro-automacoes-com-ia-quebram/'],
    ],
  },
];
