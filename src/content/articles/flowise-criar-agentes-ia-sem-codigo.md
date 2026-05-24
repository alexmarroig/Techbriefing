---
title: "Flowise: Como Criar Agentes de IA Visualmente — Sem Escrever Código"
description: "Guia completo sobre Flowise, o builder open-source de agentes de IA com interface drag-and-drop. Instale, construa seu primeiro agente RAG e entenda quando usar o Flowise vs. alternativas."
category: "Guias Práticos"
author: "Lucas Andrade"
date: 2026-05-20
readTime: "14 min"
featured: false
image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=1200"
tags:
  - Flowise
  - No-Code
  - Agentes de IA
  - RAG
  - Open Source
---

## O que é Flowise

![Ilustração visual para: Flowise: Como Criar Agentes de IA Visualmente — Sem Escrever Código](https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1200)


Flowise é uma plataforma open-source para construir agentes de IA, pipelines de LLM e sistemas de RAG (Retrieval Augmented Generation) através de uma interface visual drag-and-drop. Você conecta nós — modelo de linguagem, memória, ferramentas, fontes de dados — e o Flowise gera o agente funcional automaticamente.

Com mais de 35.000 estrelas no GitHub, o Flowise se tornou a referência para quem quer o poder do LangChain sem a curva de aprendizado do Python.

> **Referência oficial:** [flowiseai.com](https://flowiseai.com) | [docs.flowiseai.com](https://docs.flowiseai.com)
> **GitHub:** [github.com/FlowiseAI/Flowise](https://github.com/FlowiseAI/Flowise)

### O que você consegue fazer com Flowise

- **Chatbots com RAG**: pergunte sobre seus documentos PDF, Notion, site, Google Drive
- **Agentes com ferramentas**: acesse APIs, bancos de dados, execute código
- **Multi-agent flows**: orquestre agentes especializados como supervisor/executor
- **APIs de IA**: exponha seus flows como endpoints de API para integrar em qualquer sistema
- **Memória de conversação**: histórico persistente por usuário ou sessão

---

## Instalação em 5 minutos

### Opção 1: npm (desenvolvimento local)

```bash
npm install -g flowise
npx flowise start
# Acesse: http://localhost:3000
```

### Opção 2: Docker (recomendado para produção)

```yaml
# docker-compose.yml
version: '3.1'
services:
  flowise:
    image: flowiseai/flowise
    restart: always
    environment:
      - PORT=3000
      - DATABASE_PATH=/root/.flowise
      - APIKEY_PATH=/root/.flowise
      - SECRETKEY_PATH=/root/.flowise
      - FLOWISE_USERNAME=admin
      - FLOWISE_PASSWORD=sua_senha_segura
    ports:
      - '3000:3000'
    volumes:
      - ~/.flowise:/root/.flowise
```

```bash
docker-compose up -d
```

### Opção 3: Deploy gratuito na Railway

1. Acesse [railway.app](https://railway.app)
2. Clique "New Project" → "Deploy from GitHub"
3. Fork o repositório do Flowise e conecte
4. Configure as variáveis de ambiente
5. Deploy automático com URL pública em minutos

**Custo Railway**: Plano gratuito cobre uso básico; ~$5/mês para uso contínuo.

---

## Conceitos fundamentais da interface

### Chatflows vs. Agentflows

O Flowise distingue dois tipos de flows:

**Chatflows**: pipelines lineares para conversação. Ideal para chatbots com RAG simples.
- Entrada de texto → Recuperação de documentos → LLM → Resposta

**Agentflows**: agentes com ferramentas e tomada de decisão autônoma. Ideal para tarefas complexas.
- Agente avalia a tarefa → Escolhe ferramenta → Executa → Avalia resultado → Repete ou termina

### Os nós principais

| Categoria | Exemplos de nós |
|---|---|
| **Chat Models** | ChatOpenAI, ChatAnthropic, ChatOllama, ChatGoogleGenerativeAI |
| **Embeddings** | OpenAI, HuggingFace, Ollama, Cohere |
| **Vector Stores** | Pinecone, Supabase, Chroma, PGVector, Qdrant |
| **Document Loaders** | PDF, Notion, Web Scraper, GitHub, Google Drive |
| **Memory** | Buffer Memory, Redis, Zep, Motorhead |
| **Tools** | Calculator, Google Search, Custom API Tool, Code Executor |
| **Chains** | Conversational Retrieval QA, LLM Chain, SQL Database |

---

## Construindo seu primeiro agente RAG

Vamos criar um chatbot que responde perguntas sobre um documento PDF usando RAG.

### Passo 1: Novo Chatflow

1. Na sidebar, clique "Chatflows" → "+ Add New"
2. Dê um nome: "Agente RAG - Documentos"

### Passo 2: Adicionar Document Loader

1. Arraste o nó **"PDF File"** para o canvas
2. Clique no nó → faça upload do seu PDF
3. Configure:
   - **Text Chunk Size**: 1000 (caracteres por chunk)
   - **Chunk Overlap**: 200 (sobreposição para manter contexto)

### Passo 3: Embeddings

1. Arraste **"OpenAI Embeddings"**
2. Configure com sua `OPENAI_API_KEY`
3. Conecte a saída do PDF Loader na entrada de "Document" do nó de Embeddings

### Passo 4: Vector Store

1. Arraste **"In-Memory Vector Store"** (para teste) ou **"Pinecone"** (para produção)
2. Conecte:
   - Saída de Embeddings → "Embeddings" do Vector Store
   - Saída do PDF Loader → "Document" do Vector Store

### Passo 5: Retriever

1. O Vector Store já expõe uma saída "Retriever"
2. Conecte ao próximo nó

### Passo 6: Chat Model

1. Arraste **"ChatOpenAI"**
2. Configure:
   - **Model**: gpt-4o
   - **Temperature**: 0.2 (mais conservador para RAG)
   - **Max Tokens**: 1000

### Passo 7: Conversational Retrieval QA Chain

1. Arraste **"Conversational Retrieval QA Chain"**
2. Conecte:
   - ChatOpenAI → "Language Model"
   - Vector Store Retriever → "Vector Store Retriever"
3. Configure o **System Prompt**:
   ```
   Você é um assistente especializado neste documento.
   Responda apenas com base no contexto fornecido.
   Se não souber, diga "Não encontrei essa informação no documento."
   Responda sempre em português.
   ```

### Passo 8: Salvar e testar

1. Clique "Save" (canto superior direito)
2. Clique no ícone de chat para abrir o teste
3. Faça uma pergunta sobre o conteúdo do PDF
4. Veja as fontes citadas embaixo da resposta

---

## Construindo um Agente com Ferramentas

Para tarefas que exigem ação além de consulta, use um Agentflow.

### Agente de pesquisa + cálculo

```
[Tool: Calculator] ──┐
[Tool: SerpAPI Search] ──┤ → [OpenAI Functions Agent] → Resposta
[Tool: Web Browser] ──┘
```

1. Crie um novo **Agentflow**
2. Arraste **"OpenAI Functions Agent"**
3. Configure:
   - Model: gpt-4o
   - System Prompt: "Você é um assistente de pesquisa e análise. Use as ferramentas disponíveis para responder com precisão."
4. Adicione ferramentas conectadas:
   - **Calculator** (cálculos matemáticos)
   - **SerpAPI** (pesquisa web em tempo real)
   - **Custom Tool** (sua API interna)
5. Teste com: "Qual é a taxa de crescimento do mercado de IA em 2026 e quanto isso representa em dólares?"

---

## Expondo como API

Cada flow pode ser acessado via API REST:

```bash
# Após salvar o flow, pegue o ID na URL
# Ex: http://localhost:3000/chatflows/abc-123

curl -X POST \
  "http://localhost:3000/api/v1/prediction/abc-123" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer seu_api_key" \
  -d '{"question": "Qual o prazo de entrega?"}'
```

**Resposta:**
```json
{
  "text": "O prazo de entrega padrão é de 5 a 7 dias úteis...",
  "sourceDocuments": [
    {
      "pageContent": "Política de entrega...",
      "metadata": {"source": "politica-entrega.pdf", "page": 3}
    }
  ]
}
```

Isso permite integrar o Flowise em:
- **Sites**: via JavaScript fetch/axios
- **WhatsApp**: via Evolution API ou Meta API
- **Slack/Teams**: via webhooks
- **n8n/Make**: como nó de API customizado

---

## Flowise vs. Alternativas

| Critério | Flowise | LangFlow | n8n IA | Relevance AI |
|---|---|---|---|---|
| **Interface** | Drag-and-drop | Drag-and-drop | Drag-and-drop | Low-code |
| **Open Source** | ✅ MIT | ✅ MIT | ✅ (core) | ❌ SaaS |
| **Self-hosted** | ✅ | ✅ | ✅ | ❌ |
| **Agentes** | ✅ | ✅ | ✅ | ✅ |
| **RAG visual** | ✅ Excelente | ✅ Bom | ⚠️ Limitado | ✅ |
| **Comunidade** | 35k+ ⭐ | 45k+ ⭐ | 45k+ ⭐ | Paga |
| **Curva** | Baixa | Baixa | Média | Baixa |
| **Ideal para** | RAG/chatbots | Devs LangChain | Automação completa | Não-técnicos |

### Quando escolher Flowise:
- Você quer construir chatbots RAG rapidamente
- Precisa de self-hosted por questões de privacidade
- Não quer escrever Python mas quer controle
- Vai integrar via API em sistemas existentes

### Quando não usar Flowise:
- Precisa de lógica de negócio muito customizada (use LangGraph)
- Quer integrar com 500+ aplicativos prontos (use n8n)
- Precisa de suporte enterprise e SLA (use Relevance AI Enterprise)

---

## Dicas de produção

**1. Use variáveis de ambiente para credenciais**
Nunca coloque API keys diretamente nos nós. Configure-as em `.env` e acesse via `{{OPENAI_API_KEY}}` nos campos.

**2. Versione seus flows**
O Flowise suporta export/import de flows em JSON. Salve no Git para controle de versão.

**3. Configure autenticação na API**
Ative "API Key" nas configurações e exija o header `Authorization` em todas as chamadas.

**4. Monitore o uso de tokens**
Cada flow tem logs de uso. Monitore para evitar surpresas na fatura da OpenAI.

**5. Teste com Ollama antes de pagar**
Para desenvolvimento, conecte o Flowise ao [Ollama](https://ollama.ai) e use modelos locais gratuitos (Llama 3, Mistral, Phi). Troque para GPT-4o apenas em produção.

---

## Recursos para aprender mais

- **Documentação**: [docs.flowiseai.com](https://docs.flowiseai.com/getting-started)
- **GitHub**: [github.com/FlowiseAI/Flowise](https://github.com/FlowiseAI/Flowise)
- **YouTube oficial**: canal @FlowiseAI (tutoriais em vídeo)
- **Discord**: [discord.gg/jn8g7vn6f8](https://discord.gg/jn8g7vn6f8)
- **Templates de flows**: disponíveis no marketplace dentro da plataforma

O Flowise democratizou a construção de agentes de IA. Para quem não domina Python mas precisa de agentes RAG funcionais em produção, é provavelmente o caminho mais rápido disponível hoje.
