const fs = require('fs');
const path = require('path');

const terms = [
  {
    slug: 'rag-retrieval-augmented-generation',
    title: 'O que é RAG (Retrieval-Augmented Generation)?',
    desc: 'Entenda como o RAG permite que IAs consultem documentos privados e bancos de dados antes de responder, evitando alucinações e garantindo precisão.',
    author: 'Lucas Andrade',
    body: `## Resumo rápido\nRAG é uma técnica que conecta um modelo de IA aos dados privados da sua empresa. Em vez de a IA tentar "lembrar" fatos que aprendeu no treinamento, ela pesquisa nos seus PDFs ou banco de dados em tempo real e usa essas informações exatas para gerar a resposta.\n\n## Definição Simples\nO Retrieval-Augmented Generation (Geração Aumentada por Recuperação) funciona como uma consulta de livro aberto. Quando um usuário faz uma pergunta, o sistema (1) pesquisa a resposta em uma base de dados vetorizada e (2) envia os textos encontrados para o LLM formular uma resposta humanizada e baseada em fatos.\n\n## Como funciona na prática\n1. Você faz upload de manuais corporativos.\n2. O sistema "quebra" os textos em pedaços e os transforma em números (Embeddings).\n3. O usuário pergunta: "Qual a nossa política de reembolso?"\n4. O RAG busca o trecho exato no manual e entrega ao ChatGPT, dizendo: "Responda a pergunta baseando-se apenas neste texto".\n\n## Quando usar\n- Criação de chatbots de suporte ao cliente.\n- Análise automatizada de milhares de contratos jurídicos.\n- Base de conhecimento interna para funcionários.\n\n## Ferramentas relacionadas\nPinecone (Vector Database), LangChain (Framework), OpenAI Embeddings.`
  },
  {
    slug: 'mcp-model-context-protocol',
    title: 'O que é MCP (Model Context Protocol)?',
    desc: 'O MCP é um protocolo de código aberto da Anthropic que padroniza como assistentes de IA se conectam com fontes de dados e ferramentas externas.',
    author: 'Lucas Andrade',
    body: `## Resumo rápido\nO Model Context Protocol (MCP) é como um cabo USB universal para a IA. Ele permite que modelos como o Claude se conectem facilmente aos seus bancos de dados locais, GitHub, Slack e outras ferramentas, padronizando a comunicação sem exigir integrações personalizadas caras.\n\n## Definição Simples\nLançado em 2024, o MCP resolve o problema de isolamento dos LLMs. Em vez de desenvolvedores criarem dezenas de conexões API inseguras, o MCP cria uma ponte segura e padronizada em que você dita exatamente quais pastas ou dados o modelo pode acessar na sua máquina ou nuvem.\n\n## Como funciona na prática\n1. Você roda um "Servidor MCP" na sua máquina (ex: Servidor GitHub).\n2. O assistente de IA envia um pedido MCP: "Me dê os arquivos mais recentes".\n3. O servidor autoriza, retorna o contexto e o assistente usa esses dados para gerar código.\n\n## Quando usar\n- Dar acesso seguro a bancos de dados SQL para assistentes de IA.\n- Permitir que a IA leia repositórios locais sem fazer upload para nuvens públicas.\n\n## Ferramentas relacionadas\nClaude Desktop, Cursor, LangGraph.`
  },
  {
    slug: 'embeddings',
    title: 'O que são Embeddings na IA?',
    desc: 'Descubra como os embeddings transformam palavras e conceitos em coordenadas matemáticas que os computadores conseguem compreender e comparar.',
    author: 'Mariana Costa',
    body: `## Resumo rápido\nEmbeddings são representações numéricas de texto. Eles transformam palavras em listas gigantes de números (coordenadas) para que o computador consiga calcular a "distância" e o significado semântico entre elas. É a tecnologia base para buscas inteligentes e RAG.\n\n## Definição Simples\nComo o computador não entende "gato" ou "cachorro", ele converte a palavra em um vetor (ex: [0.2, -0.9, 0.4]). Palavras com significados parecidos terão números parecidos. Assim, a IA sabe que "Rei" está para "Rainha" assim como "Homem" está para "Mulher".\n\n## Como funciona na prática\n1. O modelo lê o texto.\n2. Ele gera um vetor matemático refletindo o significado da frase.\n3. Quando um usuário faz uma busca, sua pergunta também vira vetor.\n4. O sistema calcula a distância entre os vetores; os mais próximos são a resposta.\n\n## Quando usar\n- Buscas semânticas (encontrar respostas pelo significado, não pela palavra-chave exata).\n- Sistemas de recomendação (Netflix, Amazon).\n\n## Ferramentas relacionadas\nOpenAI text-embedding-3-small, Pinecone, Milvus.`
  },
  {
    slug: 'llm-large-language-model',
    title: 'O que é um LLM (Large Language Model)?',
    desc: 'O motor por trás do ChatGPT: como os Grandes Modelos de Linguagem prevêem a próxima palavra e mudaram a inteligência artificial para sempre.',
    author: 'Mariana Costa',
    body: `## Resumo rápido\nUm LLM é um programa de computador treinado em uma quantidade massiva de textos da internet. O único objetivo fundamental dele é adivinhar qual é a palavra mais provável de vir a seguir em uma frase, mas, por ser tão grande, ele acabou desenvolvendo raciocínio aparente.\n\n## Definição Simples\nO Large Language Model (Grande Modelo de Linguagem) é como um teclado preditivo do celular, só que com o conhecimento de trilhões de livros e artigos. Ele não "pensa" da forma humana, mas reconhece padrões de linguagem de forma tão avançada que consegue traduzir, programar e redigir redações perfeitas.\n\n## Quando usar\n- O motor principal ("Cérebro") de qualquer agente autônomo.\n- Geração de texto em massa, tradução fluente e análise de sentimento.\n\n## Ferramentas relacionadas\nGPT-4o (OpenAI), Claude 3.5 Sonnet (Anthropic), Gemini 1.5 Pro (Google), Llama 3 (Meta).`
  },
  {
    slug: 'vector-database',
    title: 'O que é um Vector Database (Banco de Dados Vetorial)?',
    desc: 'Bancos de dados vetoriais armazenam significados, não tabelas. Entenda como essa tecnologia sustenta a nova geração de IA.',
    author: 'Thiago Mendes',
    body: `## Resumo rápido\nUm banco de dados vetorial (Vector Database) é um sistema de armazenamento projetado para guardar *Embeddings* (coordenadas matemáticas de texto ou imagem). Ele permite que sistemas de IA busquem informações por "semelhança de significado" em milissegundos.\n\n## Definição Simples\nBancos de dados tradicionais buscam palavras exatas (SQL). Bancos vetoriais buscam contexto. Se você pesquisar "felino" num banco vetorial, ele retornará textos sobre "gatos" e "leões", mesmo que a palavra "felino" não esteja no texto original.\n\n## Quando usar\n- Quando a sua empresa for implementar um sistema RAG de alta performance.\n- Para comparar similaridade de imagens ou textos em grandes catálogos.\n\n## Ferramentas relacionadas\nPinecone, Milvus, Qdrant, Weaviate.`
  },
  {
    slug: 'fine-tuning',
    title: 'O que é Fine-tuning em IA?',
    desc: 'O processo de pegar um modelo genérico e refiná-lo para que ele fale, aja e responda com a voz e as regras exatas da sua empresa.',
    author: 'Lucas Andrade',
    body: `## Resumo rápido\nFine-tuning é o treinamento complementar (ajuste fino) que você faz em um LLM pronto. Você fornece milhares de exemplos de "pergunta-resposta" para ensinar o modelo a adotar um tom de voz específico ou um formato rígido de saída, como código JSON estruturado.\n\n## Definição Simples\nImagine que o ChatGPT é um funcionário superinteligente, mas recém-saído da faculdade. O Fine-tuning é o treinamento de integração da empresa: você mostra a ele centenas de casos antigos resolvidos para que ele aprenda o seu padrão corporativo de agir.\n\n## Quando usar (e quando não usar)\n- USE para ensinar a IA a imitar o estilo de escrita da sua marca.\n- NÃO USE para ensinar "fatos novos" à IA. Para adicionar conhecimento, use RAG. Fine-tuning muda *comportamento*, não adiciona *memória factual*.\n\n## Ferramentas relacionadas\nOpenAI Fine-tuning API, HuggingFace, Lora.`
  },
  {
    slug: 'prompt-engineering',
    title: 'O que é Prompt Engineering?',
    desc: 'A arte e ciência de instruir LLMs para obter a resposta perfeita na primeira tentativa, minimizando alucinações e desvios lógicos.',
    author: 'Thiago Mendes',
    body: `## Resumo rápido\nEngenharia de Prompt (Prompt Engineering) é o processo de estruturar textos de entrada de forma lógica para maximizar o desempenho de um LLM. Vai muito além de "conversar"; envolve o uso de delimitadores, formatação XML, e diretrizes sistêmicas (System Prompts).\n\n## Definição Simples\nAssim como programar é dar ordens exatas a um computador, a engenharia de prompt é dar ordens não-ambíguas a uma rede neural. Se o prompt é ruim, a IA gera lixo ("Garbage in, garbage out"). Um bom engenheiro de prompt economiza tempo e dinheiro limitando os caminhos que a IA pode tomar.\n\n## Técnicas comuns\n- **Few-Shot Prompting:** Dar de 3 a 5 exemplos no prompt antes de pedir a resposta.\n- **Chain-of-Thought (Cadeia de Raciocínio):** Pedir para a IA "pensar passo a passo" antes de dar a resposta final.\n\n## Quando usar\nSempre. Todo fluxo de automação que envolve IA depende crucialmente da estabilidade do Prompt base.`
  },
  {
    slug: 'agentic-workflow',
    title: 'O que é Fluxo de Trabalho Agêntico (Agentic Workflow)?',
    desc: 'O novo paradigma onde as IAs não dão apenas uma resposta e param, mas iteram, revisam e se corrigem como uma equipe humana.',
    author: 'Mariana Costa',
    body: `## Resumo rápido\nUm Agentic Workflow (Fluxo Agêntico) é um padrão de arquitetura onde uma IA executa um processo em vários passos de auto-correção. Em vez do usuário pedir o texto final, ele pede que a IA faça um rascunho, critique o próprio rascunho, e reescreva, gerando resultados vastamente superiores.\n\n## Definição Simples\nO pesquisador Andrew Ng popularizou este termo. Modelos antigos agiam no modelo "Zero-shot" (tentam acertar de primeira). Em fluxos agênticos, as IAs recebem capacidades iterativas: elas pesquisam na web (Research), criam versões, testam falhas, e corrigem o curso antes de avisar o humano.\n\n## Padrões Agênticos\n- **Reflexão (Reflection):** A IA critica a própria saída.\n- **Uso de Ferramentas (Tool Use):** A IA decide usar buscas na web ou calculadoras.\n- **Colaboração Multi-agente:** Uma IA escreve o código, outra testa, outra aprova.\n\n## Ferramentas relacionadas\nLangGraph, CrewAI, AutoGen.`
  },
  {
    slug: 'context-window',
    title: 'O que é Janela de Contexto (Context Window)?',
    desc: 'O limite de memória de curto prazo de uma IA: quantas páginas, linhas de código ou imagens ela consegue "lembrar" de uma só vez.',
    author: 'Lucas Andrade',
    body: `## Resumo rápido\nA Janela de Contexto (Context Window) é o número máximo de "Tokens" (pedaços de palavras) que um modelo de IA consegue processar simultaneamente numa mesma interação. Se o texto passar desse limite, o modelo "esquece" do que foi falado no início da conversa.\n\n## Definição Simples\nPense nisso como a memória RAM do computador ou a memória de trabalho humana. Modelos antigos tinham janelas minúsculas (4.000 tokens, umas 8 páginas). Hoje, modelos como o Gemini 1.5 Pro possuem janelas massivas (2.000.000 de tokens, o equivalente a várias horas de vídeo ou centenas de livros).\n\n## Impacto Operacional\nJanelas maiores permitem enviar bases de código inteiras de uma vez, mas custam exponencialmente mais caro na API e podem degradar um pouco a velocidade de resposta do modelo.\n\n## Ferramentas relacionadas\nGemini 1.5 Pro, Claude 3.5 Sonnet (200k tokens), GPT-4o (128k tokens).`
  },
  {
    slug: 'semantic-search',
    title: 'O que é Busca Semântica (Semantic Search)?',
    desc: 'Como a IA tornou a busca por palavras-chave obsoleta, encontrando resultados pela intenção e significado real do que você perguntou.',
    author: 'Thiago Mendes',
    body: `## Resumo rápido\nBusca Semântica é a tecnologia que entende a intenção de quem pesquisa. Ela não exige que você digite a palavra-chave exata presente no documento; em vez disso, ela compreende que "calçado esportivo" e "tênis de corrida" significam a mesma coisa no contexto correto.\n\n## Definição Simples\nSistemas tradicionais (como Elasticsearch básico) buscam palavras isoladas. Sistemas semânticos usam redes neurais e *Embeddings* para converter a pergunta e a base de dados em matemática. Assim, você pode buscar por "aquele filme do barco que afunda" e o sistema retorna "Titanic", mesmo sem as palavras baterem.\n\n## Quando usar\n- E-commerces que não querem perder vendas por erros de digitação de clientes.\n- Portais corporativos onde os funcionários procuram políticas RH sem saberem a nomenclatura técnica correta.\n\n## Ferramentas relacionadas\nAlgolia, Typesense, Pinecone.`
  }
];

const dir = path.join(__dirname, 'src', 'content', 'glossario');

for (const term of terms) {
  const dateStr = new Date().toISOString().split('T')[0];
  const safeDesc = term.desc.replace(/"/g, "'");
  const markdown = `---
title: "${term.title}"
description: "${safeDesc}"
author: "${term.author}"
date: ${dateStr}
---

${term.body}
`;

  fs.writeFileSync(path.join(dir, `${term.slug}.md`), markdown, 'utf-8');
}

console.log('Glossário gerado com sucesso!');
