---
title: "Make com IA: Automação Visual de Agentes para Negócios em 2026"
description: "Guia completo para usar o Make (ex-Integromat) como plataforma de orquestração de IA. Construa agentes reativos, conecte LLMs a qualquer app e automatize operações completas sem código."
category: "Guias Práticos"
author: "Lucas Andrade"
date: 2026-05-20
readTime: "13 min"
featured: false
image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&q=80&w=1200"
tags:
  - Make
  - Automação
  - No-Code
  - Agentes de IA
  - Integrações
---

## Make em 2026: muito além de automações simples

![Ilustração visual para: Make com IA: Automação Visual de Agentes para Negócios em 2026](https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&q=80&w=1200)


O Make (anteriormente Integromat) nasceu como ferramenta de automação: "quando X acontece em app A, faça Y no app B". Em 2024 e 2025, a plataforma passou por uma transformação profunda para se tornar uma plataforma de **orquestração de IA**.

A diferença do Make para outros players: ele conecta IA com **1.800+ aplicativos prontos** — Shopify, ActiveCampaign, Airtable, Slack, WhatsApp Business, Stripe, Pipedrive, Typeform e centenas de outros — sem uma linha de código.

> **Site oficial**: [make.com](https://make.com) | **Acadêmia Make**: [academy.make.com](https://academy.make.com)
> 
> **Afiliado**: Experimente o Make gratuitamente com 1.000 operações/mês → [make.com/pt](https://www.make.com/en/register?pc=techbriefing)

---

## Estrutura de um cenário Make com IA

O Make usa o conceito de **Cenários** — equivalente aos workflows do n8n ou aos flows do Zapier. Cada cenário tem:

```
[Trigger] → [Módulo 1] → [Módulo IA] → [Router] → [App 1]
                                                  → [App 2]
```

### Módulos de IA disponíveis no Make

**OpenAI (GPT-4o, GPT-4 Turbo):**
- Create a Completion (text generation)
- Create a Chat Completion (conversação)
- Create an Image (DALL-E 3)
- Create an Embedding (vetores)
- Transcribe a Recording (Whisper)

**Anthropic (Claude 3.5):**
- Create a Message

**Google (Gemini Pro, Gemini 1.5):**
- Generate Content
- Generate Content with Vision (multimodal)

**Outros:**
- Cohere: Generate Text, Classify
- HuggingFace: Text Generation, Classification
- Replicate: qualquer modelo do Hub

---

## Cenário 1: Agente de suporte por WhatsApp

Um agente que responde automaticamente mensagens de clientes no WhatsApp usando GPT-4o com base nos seus dados de produto.

```
Trigger: WhatsApp Business - Watch Messages
    │
HTTP: Buscar FAQ/Documentação (sua API)
    │
OpenAI: Create a Chat Completion
  ├─ System: "Você é um suporte especializado em [produto].
  │           Responda com base nos dados fornecidos.
  │           Se não souber, ofereça transferência para humano."
  └─ User: "{{mensagem do cliente}}\n\nContexto:\n{{documentação recuperada}}"
    │
Router (condição: resposta contém "humano")
  ├─ SIM → Slack: Notificar equipe de suporte
  │         WhatsApp: Enviar mensagem + transferência
  └─ NÃO → WhatsApp: Enviar resposta gerada
              Airtable: Registrar ticket + resposta
```

### Configuração passo a passo

**1. Trigger: WhatsApp Business**
- Conecte sua conta Meta Business
- Selecione o número do WhatsApp Business
- Defina: "Watch for new messages"

**2. HTTP Request: busca contextual**
```
URL: https://api.suaempresa.com/faq?q={{1.text}}
Method: GET
Headers: Authorization: Bearer {{token}}
```

**3. OpenAI: Chat Completion**
```
Model: gpt-4o
Messages:
  - Role: system
    Content: Você é Carlos, suporte da [Empresa]. Responda em português. 
             Base de conhecimento: {{2.faq_content}}
             Limite: 200 palavras. Tom: profissional e empático.
  - Role: user  
    Content: {{1.text}}
Max tokens: 300
Temperature: 0.3
```

**4. Router com condição**
```
Filtro: {{3.choices[].message.content}} CONTAINS "humano"
```

---

## Cenário 2: Pipeline de qualificação de leads com IA

Leads chegam pelo seu site e são automaticamente qualificados, enriquecidos e distribuídos.

```
Trigger: Typeform - Watch Responses
    │
[Parallel branches]
  ├─ HTTP: Clearbit API (enriquecimento de empresa)
  └─ HTTP: Hunter.io (verificação de e-mail)
    │
OpenAI: Chat Completion (Qualificação)
  └─ Prompt: "Avalie o fit deste lead com nosso ICP..."
    │
Router (score ≥ 7 vs < 7)
  ├─ Score alto → HubSpot: Criar deal "SQL"
  │               Gmail: Enviar e-mail personalizado
  │               Slack: Alertar vendedor
  └─ Score baixo → HubSpot: Criar contato "MQL"
                   ActiveCampaign: Adicionar à sequência de nutrição
```

### O prompt de qualificação

```
Analise este lead e retorne apenas um JSON válido:

Lead:
- Nome: {{nome}}
- Empresa: {{empresa}}
- Cargo: {{cargo}}
- Email: {{email}}
- Pergunta/Mensagem: {{mensagem}}

Dados da empresa (Clearbit): {{clearbit_data}}

Nosso ICP: empresas 20-500 funcionários, setor B2B SaaS ou serviços,
Brasil, decisor (CEO, CTO, Head de Marketing/Vendas/Ops).

Retorne:
{
  "score": 1-10,
  "fit_cargo": true/false,
  "fit_empresa": true/false,
  "fit_tamanho": true/false,
  "razao": "explicação em 1 frase",
  "proxima_acao": "string"
}
```

---

## Gerenciamento de memória no Make

O Make não tem memória nativa de conversação como o n8n. A solução é usar um datastore:

### Opção 1: Make Data Store (simples)

```
Cenário: Chatbot com histórico
    │
Data Store: Get Record by key "{{userId}}"
  └─ (retorna histórico de mensagens)
    │
OpenAI: Chat Completion
  └─ Messages: {{historico}} + nova mensagem
    │
Data Store: Upsert Record
  └─ key: {{userId}}
     value: {{historico_atualizado}}
```

### Opção 2: Airtable como memória (mais robusto)

```
Airtable: Search Records
  └─ Filter: {user_id} = "{{userId}}"
  └─ Sort: created_at DESC
  └─ Limit: 10  (últimas 10 mensagens)
    │
[Agrega mensagens em array para o OpenAI]
    │
Airtable: Create Record (nova mensagem + resposta)
```

### Opção 3: Redis via HTTP (produção)

Use o módulo HTTP para chamar um Redis compatível com REST (Upstash é gratuito para testes):
```
HTTP: GET https://seu-redis.upstash.io/get/session:{{userId}}
Headers: Authorization: Bearer {{redis_token}}
```

---

## Make vs. Zapier vs. n8n — comparativo honesto 2026

| Critério | Make | Zapier | n8n |
|---|---|---|---|
| **Plano gratuito** | 1.000 ops/mês | 100 tarefas/mês | Self-hosted ilimitado |
| **Plano pago básico** | ~$9/mês (10k ops) | ~$20/mês (750 tarefas) | $20/mês (cloud) |
| **Integrações** | 1.800+ | 6.000+ | 600+ |
| **Interface** | Visual (circles) | Mais simples | Técnica |
| **Multi-step complexo** | ✅ Excelente | ⚠️ Limitado | ✅ Excelente |
| **Loops e iteradores** | ✅ Nativo | ❌ Plano pago | ✅ |
| **Agentes IA nativos** | ⚠️ Via módulos | ⚠️ Via módulos | ✅ AI Agent node |
| **Self-hosted** | ❌ | ❌ | ✅ |
| **Curva de aprendizado** | Média | Baixa | Alta |
| **Ideal para** | Automações complexas sem código | Automações simples rápidas | Agentes + automações |

### Quando escolher Make:
- Você precisa de **muitas integrações** prontas (1.800+)
- Quer uma interface **visual clara** sem programar
- Precisa de **iteradores, aggregators e routers** complexos
- Volume de operações é previsível e não explode (use n8n self-hosted se explodir)

### Quando não usar Make:
- Precisa de agentes com **memória nativa e tools estruturadas** (use n8n)
- O volume de execuções é muito alto (custo por operação sobe rápido)
- Precisa de **self-hosted por compliance** (use n8n)

---

## Custo real: calculando o que você vai pagar

O Make cobra por **operações** — cada módulo executado é uma operação.

**Cenário exemplo**: Agente de suporte WhatsApp
- 500 mensagens/dia × 5 módulos = 2.500 operações/dia
- 75.000 operações/mês
- Plano necessário: **Teams ($29/mês com 40k ops)** + overage

**Comparando com n8n cloud**: $20/mês por usuário, execuções ilimitadas.

**Comparando com n8n self-hosted**: VPS de $5-10/mês na DigitalOcean, execuções ilimitadas.

> **Conclusão de custo**: Make compensa até ~30k operações/mês. Acima disso, n8n self-hosted é muito mais barato.

---

## Templates Make para IA (prontos para usar)

Acesse em [make.com/pt/templates](https://www.make.com/en/templates):

| Template | Descrição |
|---|---|
| **AI Email Responder** | Responde e-mails automaticamente com GPT-4 |
| **Lead Qualification AI** | Qualifica leads do HubSpot com IA |
| **Social Media AI Creator** | Cria posts adaptados por plataforma |
| **Customer Support AI** | Chatbot com escalada para humano |
| **AI Document Extractor** | Extrai dados estruturados de PDFs |
| **Invoice Processor AI** | Processa notas fiscais automaticamente |

---

## Recursos essenciais

- **Make Academy (gratuito)**: [academy.make.com](https://academy.make.com) — curso oficial completo
- **Comunidade**: [community.make.com](https://community.make.com) — templates e dúvidas
- **Templates de IA**: [make.com/en/templates?categories=ai](https://www.make.com/en/templates?categories=ai)
- **Blog oficial**: [make.com/en/blog](https://www.make.com/en/blog)
- **Canal YouTube**: @MakePlatform — tutoriais semanais

> 💡 **Afiliado Tech Briefing**: Crie sua conta Make com 1.000 operações gratuitas por mês → [Começar gratuitamente](https://www.make.com/en/register?pc=techbriefing)

O Make é a plataforma de automação com IA mais equilibrada para negócios que não têm engenheiros: interface clara, integrações vastas e flexibilidade suficiente para cenários complexos. O ponto de atenção é o custo por operação — planeje bem o volume antes de escalar.
