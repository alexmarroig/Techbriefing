---
title: "O que são Embeddings na IA?"
description: "Descubra como os embeddings transformam palavras e conceitos em coordenadas matemáticas que os computadores conseguem compreender e comparar."
author: "Mariana Costa"
date: 2026-05-23
---

## Resumo rápido
Embeddings são representações numéricas de texto. Eles transformam palavras em listas gigantes de números (coordenadas) para que o computador consiga calcular a "distância" e o significado semântico entre elas. É a tecnologia base para buscas inteligentes e RAG.

## Definição Simples
Como o computador não entende "gato" ou "cachorro", ele converte a palavra em um vetor (ex: [0.2, -0.9, 0.4]). Palavras com significados parecidos terão números parecidos. Assim, a IA sabe que "Rei" está para "Rainha" assim como "Homem" está para "Mulher".

## Como funciona na prática
1. O modelo lê o texto.
2. Ele gera um vetor matemático refletindo o significado da frase.
3. Quando um usuário faz uma busca, sua pergunta também vira vetor.
4. O sistema calcula a distância entre os vetores; os mais próximos são a resposta.

## Quando usar
- Buscas semânticas (encontrar respostas pelo significado, não pela palavra-chave exata).
- Sistemas de recomendação (Netflix, Amazon).

## Ferramentas relacionadas
OpenAI text-embedding-3-small, Pinecone, Milvus.
