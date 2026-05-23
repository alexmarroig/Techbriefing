---
title: "O que é Janela de Contexto (Context Window)?"
description: "O limite de memória de curto prazo de uma IA: quantas páginas, linhas de código ou imagens ela consegue 'lembrar' de uma só vez."
author: "Lucas Andrade"
date: 2026-05-23
---

## Resumo rápido
A Janela de Contexto (Context Window) é o número máximo de "Tokens" (pedaços de palavras) que um modelo de IA consegue processar simultaneamente numa mesma interação. Se o texto passar desse limite, o modelo "esquece" do que foi falado no início da conversa.

## Definição Simples
Pense nisso como a memória RAM do computador ou a memória de trabalho humana. Modelos antigos tinham janelas minúsculas (4.000 tokens, umas 8 páginas). Hoje, modelos como o Gemini 1.5 Pro possuem janelas massivas (2.000.000 de tokens, o equivalente a várias horas de vídeo ou centenas de livros).

## Impacto Operacional
Janelas maiores permitem enviar bases de código inteiras de uma vez, mas custam exponencialmente mais caro na API e podem degradar um pouco a velocidade de resposta do modelo.

## Ferramentas relacionadas
Gemini 1.5 Pro, Claude 3.5 Sonnet (200k tokens), GPT-4o (128k tokens).
