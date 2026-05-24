---
title: "n8n com IA: Como Construir Agentes Operacionais de Automação em 2026"
description: "Guia prático para construir agentes de IA com n8n — do nó AI Agent básico até um agente SDR completo com memória, ferramentas e integração com CRM. Inclui templates prontos."
category: "Guias Práticos"
author: "Lucas Andrade"
date: 2026-05-20
readTime: "16 min"
featured: false
image: "https://images.unsplash.com/photo-1535223289827-42f1e9919769?auto=format&fit=crop&q=80&w=1200"
tags:
  - n8n
  - Automação
  - Agentes de IA
  - No-Code
  - CRM
---

## n8n não é só automação — é infraestrutura de agentes

![Ilustração do Artigo](https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1200)


Quando a maioria das pessoas pensa em n8n, pensa em automações: "se receber um e-mail, crie uma tarefa no Notion". Isso ainda é verdade, mas é só metade da história.

A partir da versão 1.0, o n8n se tornou uma plataforma séria para construir **agentes de IA operacionais** — sistemas que tomam decisões, usam ferramentas, mantêm memória e executam tarefas complexas com supervisão mínima.

A diferença crucial em relação a plataformas como LangGraph ou CrewAI: o n8n conecta seu agente a **600+ integrações prontas** — Gmail, Slack, HubSpot, Notion, Google Sheets, Stripe, Salesforce — sem uma linha de código extra.

> **Referências:** [n8n.io](https://n8n.io) | [docs.n8n.io/advanced-ai](https://docs.n8n.io/advanced-ai/)

---

## O nó AI Agent no n8n — anatomia

O nó central para agentes no n8n é o **AI Agent**. Ele tem quatro entradas configuráveis:

```
[Chat Trigger] ──→ [AI Agent]
                      │
          ┌───────────┼───────────────┐
          ▼           ▼               ▼
     [Chat Model]  [Memory]     [Tools (1-n)]
     (GPT-4o,       (Buffer,     (Gmail, Slack,
      Claude)        Redis...)    Calculator...)
```

### Configurando o AI Agent básico

1. **Trigger**: "Chat Trigger" (para conversa) ou qualquer nó (e-mail, webhook, schedule)
2. **Chat Model**: configure OpenAI, Anthropic ou Google Gemini com sua API key
3. **System Prompt**: o comportamento e persona do agente
4. **Memory**: persistência do histórico de conversa
5. **Tools**: o que o agente pode fazer no mundo

### System Prompt efetivo

```
Você é um assistente comercial especializado para [EMPRESA].

Seu objetivo: qualificar leads, responder dúvidas sobre produtos e agendar demonstrações.

Regras:
- Sempre responda em português do Brasil
- Se não souber a resposta, diga explicitamente e ofereça transferir para um humano
- Nunca invente preços ou prazos — consulte as ferramentas disponíveis
- Se o lead demonstrar interesse claro, ofereça agendamento imediato

Ferramentas disponíveis: busca de produtos, verificação de disponibilidade, agendamento de reuniões.
```

---

## Construindo um Agente SDR Completo

Um agente SDR (Sales Development Representative) que:
1. Recebe leads por webhook
2. Pesquisa a empresa no LinkedIn/web
3. Qualifica com base no ICP
4. Envia e-mail personalizado
5. Registra tudo no HubSpot

### Estrutura do workflow

```
[Webhook: Lead Novo]
        │
[AI Agent: Qualificador]
  ├─ Tool: HTTP Request (pesquisa empresa via SerpAPI)
  ├─ Tool: HTTP Request (LinkedIn via Proxycurl API)
  └─ Tool: Code (scoring de ICP)
        │
[If: Score >= 7]
  ├─ YES → [AI Agent: Redator de E-mail]
  │            ├─ Tool: Gmail (busca histórico)
  │            └─ Tool: Gmail (envia e-mail personalizado)
  │         → [HubSpot: Criar/Atualizar Contato]
  └─ NO  → [HubSpot: Marcar como Baixo Fit]
```

### Nó 1: Webhook de entrada

Configure o webhook para receber:
```json
{
  "nome": "João Silva",
  "empresa": "TechCorp",
  "cargo": "CEO",
  "email": "joao@techcorp.com.br",
  "origem": "formulário-site"
}
```

### Nó 2: AI Agent Qualificador

**System Prompt:**
```
Você é um analista de qualificação de leads B2B.

Analise o lead fornecido e faça:
1. Pesquise a empresa usando a ferramenta de busca
2. Identifique: setor, tamanho, tecnologias usadas, momento atual
3. Avalie o fit com nosso ICP (empresas 10-200 funcionários, setor tech/services, Brasil)
4. Retorne um JSON com: score (1-10), razão, próximos_passos

Seja preciso. Use apenas dados reais das pesquisas.
```

**Ferramentas conectadas:**
- HTTP Request → SerpAPI: `https://serpapi.com/search?q={{empresa}}&gl=br&hl=pt`
- HTTP Request → LinkedIn (se tiver acesso)
- Code Node: scoring baseado em regras

### Nó 3: AI Agent Redator

**System Prompt:**
```
Você é um especialista em cold email B2B.

Com base no perfil do lead e na pesquisa realizada:
1. Escreva um e-mail de prospecção personalizado (máx 150 palavras)
2. Referencie algo específico da empresa pesquisada
3. Inclua um CTA claro para uma call de 20 minutos
4. Tom: profissional mas conversacional, sem jargões
5. Nunca mencione que é automatizado

Assunto: máximo 50 caracteres, direto ao ponto, sem emoji.
```

### Nó 4: Integração HubSpot

Use o nó nativo do HubSpot para:
```javascript
// Criar contato com todos os dados enriquecidos
{
  "email": "{{$json.email}}",
  "firstname": "{{$json.nome}}",
  "company": "{{$json.empresa}}",
  "jobtitle": "{{$json.cargo}}",
  // Propriedades customizadas:
  "iq_score": "{{$json.score}}",
  "iq_razao": "{{$json.razao}}",
  "iq_data": "{{$now}}",
  "lead_source": "{{$json.origem}}"
}
```

---

## Memória: mantendo contexto entre conversas

O n8n oferece três opções de memória para agentes:

### 1. Window Buffer Memory (in-memory)
Mantém as últimas N mensagens. Bom para desenvolvimento.
```
Configuração: Window Size = 10 mensagens
Limitação: perdida ao reiniciar o n8n
```

### 2. Redis Chat Memory (recomendado para produção)
```
Configuração:
- Host: seu-redis.servidor.com
- Port: 6379
- Session Key: {{ $json.userId }}  // identificador único por usuário
- TTL: 86400 (24h)
```

### 3. Postgres Chat History
Persiste todas as conversas em banco de dados para auditoria e análise posterior.

---

## Templates prontos de agentes n8n

A comunidade n8n mantém uma biblioteca de workflows prontos em [n8n.io/workflows](https://n8n.io/workflows/). Os mais úteis para agentes:

| Template | Descrição | Link |
|---|---|---|
| AI Customer Support | Chatbot com RAG sobre docs | #3765 |
| AI SDR Agent | Qualificação e outreach automatizado | #3892 |
| Social Media Agent | Cria e posta conteúdo automaticamente | #3201 |
| Document Analyzer | Extrai dados estruturados de PDFs | #2987 |
| Meeting Prep Agent | Pesquisa e brief antes de reunião | #4102 |

Para usar: acesse n8n → Import → paste o ID do template.

---

## n8n Self-Hosted vs. Cloud

| Critério | Self-Hosted | n8n Cloud |
|---|---|---|
| **Custo** | Infra (VPS ~$10-20/mês) | $20-50/mês/usuário |
| **Execuções** | Ilimitadas | 2.500-50.000/mês |
| **Controle de dados** | Total | Compartilhado |
| **Setup** | 30 min (Docker) | Imediato |
| **Atualizações** | Manual | Automático |
| **Suporte** | Comunidade | Email/Chat |

**Recomendação**: Para agentes que processam dados sensíveis de clientes, self-hosted. Para times pequenos que querem velocidade, Cloud.

### Docker self-hosted em 5 minutos:

```bash
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  -e N8N_BASIC_AUTH_ACTIVE=true \
  -e N8N_BASIC_AUTH_USER=admin \
  -e N8N_BASIC_AUTH_PASSWORD=senha_segura \
  -e WEBHOOK_URL=https://seu-dominio.com \
  n8nio/n8n
```

---

## n8n vs. Make para Agentes

| Critério | n8n | Make |
|---|---|---|
| **Interface** | Mais técnica | Mais visual |
| **Open Source** | ✅ | ❌ |
| **Self-hosted** | ✅ | ❌ |
| **Agente nativo** | ✅ AI Agent node | ⚠️ HTTP + IA manual |
| **Memória nativa** | ✅ | ❌ (via HTTP) |
| **Preço execuções** | Self: ilimitado | $0.001-0.004/op |
| **Curva** | Mais íngreme | Mais suave |
| **Integrações** | 600+ | 1.800+ |

**Conclusão**: n8n é superior para agentes complexos e volumes altos. Make é melhor para automações simples com muitas integrações prontas.

---

## Recursos essenciais

- **Documentação AI**: [docs.n8n.io/advanced-ai](https://docs.n8n.io/advanced-ai/)
- **Templates de agentes**: [n8n.io/workflows](https://n8n.io/workflows/?categories=25)
- **Blog de agentes**: [n8n.io/blog/ai-agents](https://n8n.io/blog/ai-agents/)
- **Comunidade**: [community.n8n.io](https://community.n8n.io)
- **GitHub**: [github.com/n8n-io/n8n](https://github.com/n8n-io/n8n) (50k+ ⭐)
- **Curso oficial**: [n8n.io/academy](https://n8n.io/academy)

O n8n é hoje a ferramenta mais completa para quem quer agentes operacionais sem precisar escrever código Python do zero — especialmente quando o agente precisa se conectar ao ecossistema de ferramentas que sua empresa já usa.
