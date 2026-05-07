---
title: "Como usar a API da OpenAI: tutorial completo para iniciantes"
description: "Aprenda a usar a API da OpenAI do zero: configuração, primeiras chamadas, embeddings, gerenciamento de custos e boas práticas para desenvolvedores iniciantes."
category: "IA Prática"
author: "Nexora Systems"
date: 2026-04-25
readTime: "11 min"
featured: false
image: "/assets/og-default.svg"
tags:
  - OpenAI
  - API
  - Tutorial
  - Desenvolvimento
---

## Por que aprender a usar a API da OpenAI?

A interface do ChatGPT é ótima para uso pessoal, mas quando você quer integrar IA nos seus sistemas, automatizar processos ou criar produtos com IA, você precisa da API. A API permite:

- Chamar os modelos programaticamente dos seus sistemas
- Processar grandes volumes de dados automaticamente
- Personalizar completamente o comportamento do modelo
- Integrar IA em qualquer linguagem de programação
- Controlar custos com precisão

Este tutorial cobre tudo que você precisa para começar a usar a API da OpenAI, do zero.

## Passo 1: Configurar sua conta e obter a API key

**1. Crie uma conta na OpenAI**: Acesse platform.openai.com e crie uma conta.

**2. Adicione créditos**: A API não tem plano gratuito permanente, mas novos usuários recebem créditos iniciais. Para uso contínuo, adicione um cartão de crédito e compre créditos.

**3. Crie sua API key**:
- Vá em "API keys" no menu lateral
- Clique em "Create new secret key"
- Dê um nome descritivo (ex: "Projeto-X-Desenvolvimento")
- Copie e guarde em local seguro — ela não será exibida novamente

**Importante sobre segurança**: Nunca coloque sua API key diretamente no código. Use variáveis de ambiente.

## Passo 2: Instalação e configuração

### Para Python (recomendado para iniciantes)

```bash
pip install openai python-dotenv
```

Crie um arquivo `.env` na raiz do projeto:
```
OPENAI_API_KEY=sk-proj-sua-chave-aqui
```

Adicione `.env` ao `.gitignore` para não expor a chave.

### Estrutura básica em Python

```python
from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
```

### Para JavaScript/Node.js

```bash
npm install openai dotenv
```

```javascript
import OpenAI from 'openai';
import * as dotenv from 'dotenv';
dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});
```

## Passo 3: Sua primeira chamada à API

### Chat Completions — o endpoint mais usado

```python
response = client.chat.completions.create(
    model="gpt-4o-mini",  # modelo mais econômico para testes
    messages=[
        {"role": "system", "content": "Você é um assistente útil que responde em português."},
        {"role": "user", "content": "O que é inteligência artificial em 3 frases?"}
    ]
)

print(response.choices[0].message.content)
```

**Entendendo a estrutura de mensagens**:
- `system`: Instruções sobre o comportamento do modelo (o "prompt de sistema")
- `user`: A mensagem do usuário
- `assistant`: Respostas anteriores do modelo (para manter o histórico de conversa)

### Mantendo uma conversa com histórico

```python
conversa = [
    {"role": "system", "content": "Você é um assistente de vendas da empresa X."}
]

while True:
    entrada = input("Você: ")
    if entrada.lower() == "sair":
        break
    
    conversa.append({"role": "user", "content": entrada})
    
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=conversa
    )
    
    resposta = response.choices[0].message.content
    conversa.append({"role": "assistant", "content": resposta})
    
    print(f"Assistente: {resposta}\n")
```

## Passo 4: Parâmetros importantes

### Model — escolha o modelo certo

| Modelo | Uso recomendado | Custo relativo |
|---|---|---|
| gpt-4o-mini | Tarefas simples, alto volume | Baixo |
| gpt-4o | Tarefas complexas, qualidade alta | Médio |
| o3-mini | Raciocínio matemático/lógico | Médio |
| o3 | Raciocínio avançado máximo | Alto |

Para aprender e testar, use sempre `gpt-4o-mini` — é muito mais barato.

### Temperature — controle de criatividade

```python
response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[{"role": "user", "content": "Escreva um slogan criativo"}],
    temperature=0.9  # 0 = determinístico, 2 = máximo de variação
)
```

- **0 a 0.3**: Respostas consistentes e previsíveis (ideal para análise, extração de dados)
- **0.7 a 1**: Respostas mais criativas e variadas (ideal para escrita criativa)
- **Acima de 1**: Muito criativo, pode ser incoerente

### Max tokens — limite o tamanho da resposta

```python
response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[{"role": "user", "content": "Explique machine learning"}],
    max_tokens=200  # limita a resposta a ~150 palavras
)
```

### Response format — JSON garantido

```python
response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {"role": "system", "content": "Extraia dados do texto e retorne JSON."},
        {"role": "user", "content": "João Silva, 35 anos, vendedor em São Paulo"}
    ],
    response_format={"type": "json_object"}
)

import json
dados = json.loads(response.choices[0].message.content)
print(dados)  # {'nome': 'João Silva', 'idade': 35, 'cargo': 'vendedor', 'cidade': 'São Paulo'}
```

## Passo 5: Embeddings — busca semântica

Embeddings transformam texto em vetores numéricos que capturam o significado semântico. São fundamentais para implementar RAG, busca semântica e sistemas de recomendação.

```python
def gerar_embedding(texto):
    response = client.embeddings.create(
        model="text-embedding-3-small",  # modelo de embedding mais econômico
        input=texto
    )
    return response.data[0].embedding

# Gerar embeddings
embedding_produto = gerar_embedding("Notebook Dell XPS 15, 32GB RAM, i9")
embedding_busca = gerar_embedding("computador portátil de alta performance")

# Calcular similaridade (cosine similarity)
import numpy as np

def similaridade(vec1, vec2):
    return np.dot(vec1, vec2) / (np.linalg.norm(vec1) * np.linalg.norm(vec2))

score = similaridade(embedding_produto, embedding_busca)
print(f"Similaridade: {score:.3f}")  # Próximo de 1 = muito similar
```

## Passo 6: Function calling — ferramentas para o modelo

Function calling permite que o modelo "chame" funções do seu código para buscar dados ou executar ações.

```python
import json

# Define as ferramentas disponíveis
tools = [
    {
        "type": "function",
        "function": {
            "name": "buscar_status_pedido",
            "description": "Busca o status de um pedido pelo número",
            "parameters": {
                "type": "object",
                "properties": {
                    "numero_pedido": {
                        "type": "string",
                        "description": "O número do pedido"
                    }
                },
                "required": ["numero_pedido"]
            }
        }
    }
]

# Função real que busca dados
def buscar_status_pedido(numero_pedido):
    # Aqui você consultaria seu banco de dados real
    return {"status": "Em trânsito", "previsao": "2026-04-28", "transportadora": "Correios"}

# Primeira chamada — o modelo decide se precisa usar a ferramenta
response = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "Qual o status do pedido 12345?"}],
    tools=tools,
    tool_choice="auto"
)

# Verificar se o modelo quer usar uma ferramenta
if response.choices[0].finish_reason == "tool_calls":
    tool_call = response.choices[0].message.tool_calls[0]
    args = json.loads(tool_call.function.arguments)
    
    # Executar a função
    resultado = buscar_status_pedido(args["numero_pedido"])
    
    # Segunda chamada com o resultado da função
    response_final = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "user", "content": "Qual o status do pedido 12345?"},
            response.choices[0].message,
            {"role": "tool", "tool_call_id": tool_call.id, "content": json.dumps(resultado)}
        ]
    )
    
    print(response_final.choices[0].message.content)
```

## Passo 7: Processamento em batch para alto volume

Para processar centenas ou milhares de itens, use o Batch API que é 50% mais barato:

```python
import json

# Preparar as requisições em formato JSONL
requisicoes = []
textos = ["Texto 1 para classificar", "Texto 2 para classificar", ...]  # até 50.000

for i, texto in enumerate(textos):
    requisicoes.append({
        "custom_id": f"req-{i}",
        "method": "POST",
        "url": "/v1/chat/completions",
        "body": {
            "model": "gpt-4o-mini",
            "messages": [{"role": "user", "content": f"Classifique o sentimento: {texto}"}],
            "max_tokens": 10
        }
    })

# Salvar arquivo JSONL e submeter batch
with open("batch_input.jsonl", "w") as f:
    for req in requisicoes:
        f.write(json.dumps(req) + "\n")

# Upload do arquivo
with open("batch_input.jsonl", "rb") as f:
    batch_file = client.files.create(file=f, purpose="batch")

# Criar o batch
batch = client.batches.create(
    input_file_id=batch_file.id,
    endpoint="/v1/chat/completions",
    completion_window="24h"
)

print(f"Batch ID: {batch.id}")  # Salve para verificar o status depois
```

## Monitoramento de custos

Nunca deixe custos saírem do controle:

**1. Configure limites de uso**: Em platform.openai.com > Billing > Usage limits, configure um limite mensal.

**2. Monitore no código**:
```python
response = client.chat.completions.create(...)

# Tokens usados nesta chamada
print(f"Tokens usados: {response.usage.total_tokens}")
print(f"Custo estimado: ${response.usage.total_tokens * 0.00000015:.6f}")
```

**3. Use o modelo certo**: gpt-4o-mini custa ~20x menos que gpt-4o. Use o menor modelo que resolve seu problema.

## Erros comuns e como resolver

**`AuthenticationError`**: API key inválida ou não configurada. Verifique se o `.env` está carregado corretamente.

**`RateLimitError`**: Você excedeu os limites de taxa. Implemente exponential backoff:

```python
import time

def chamar_com_retry(prompt, max_tentativas=3):
    for tentativa in range(max_tentativas):
        try:
            return client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": prompt}]
            )
        except Exception as e:
            if tentativa == max_tentativas - 1:
                raise
            time.sleep(2 ** tentativa)  # 1s, 2s, 4s
```

**`ContextLengthExceededError`**: O prompt + histórico excede o limite de tokens do modelo. Reduza o histórico ou use um modelo com janela maior.

## Conclusão

Você agora tem o conhecimento fundamental para usar a API da OpenAI em projetos reais. Os próximos passos naturais são:

1. **Experimente com casos de uso reais** do seu negócio — encontre um problema e resolva com a API
2. **Explore outros endpoints**: Vision (análise de imagens), TTS/STT (voz)
3. **Estude LangChain ou LlamaIndex** para construir aplicações mais complexas em cima da API
4. **Monitore custos desde o início** — é fácil escalar inadvertidamente

A documentação oficial em platform.openai.com/docs é excelente e está constantemente atualizada com novos recursos.
