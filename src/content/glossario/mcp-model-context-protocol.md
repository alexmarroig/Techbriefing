---
title: "O que é MCP (Model Context Protocol)?"
description: "O MCP é um protocolo de código aberto da Anthropic que padroniza como assistentes de IA se conectam com fontes de dados e ferramentas externas."
author: "Lucas Andrade"
date: 2026-05-23
---

## Resumo rápido
O Model Context Protocol (MCP) é como um cabo USB universal para a IA. Ele permite que modelos como o Claude se conectem facilmente aos seus bancos de dados locais, GitHub, Slack e outras ferramentas, padronizando a comunicação sem exigir integrações personalizadas caras.

## Definição Simples
Lançado em 2024, o MCP resolve o problema de isolamento dos LLMs. Em vez de desenvolvedores criarem dezenas de conexões API inseguras, o MCP cria uma ponte segura e padronizada em que você dita exatamente quais pastas ou dados o modelo pode acessar na sua máquina ou nuvem.

## Como funciona na prática
1. Você roda um "Servidor MCP" na sua máquina (ex: Servidor GitHub).
2. O assistente de IA envia um pedido MCP: "Me dê os arquivos mais recentes".
3. O servidor autoriza, retorna o contexto e o assistente usa esses dados para gerar código.

## Quando usar
- Dar acesso seguro a bancos de dados SQL para assistentes de IA.
- Permitir que a IA leia repositórios locais sem fazer upload para nuvens públicas.

## Ferramentas relacionadas
Claude Desktop, Cursor, LangGraph.
