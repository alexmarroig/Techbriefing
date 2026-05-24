---
title: "Como fazer sua primeira automação no n8n: Guia passo a passo"
description: "Pare de fazer tarefas repetitivas manualmente. Aprenda a criar seu primeiro fluxo visual no n8n ligando formulários, inteligência artificial e e-mail em menos de 10 minutos."
image: "/images/n8n-cover.png"
readTime: "8 min"
date: 2026-05-24
author: "Thiago Mendes"
category: "Guias"
tags: ["Automação", "n8n", "No-Code", "Tutorial"]
faq:
  - question: "O n8n é gratuito?"
    answer: "O n8n possui uma versão Community Edition de código aberto que você pode hospedar gratuitamente (self-hosted). Eles também oferecem planos na nuvem (n8n cloud) pagos para quem não quer gerenciar infraestrutura."
  - question: "Preciso saber programar para usar o n8n?"
    answer: "Não. O n8n tem uma interface visual de arrastar e soltar (drag-and-drop). Conhecimentos em lógica ajudam, mas não é necessário escrever código, a menos que você precise de lógicas extremamente avançadas."
---

O **n8n** despontou como a ferramenta de automação preferida de quem busca flexibilidade sem pagar os custos absurdos de ferramentas baseadas no modelo "pay-per-task" (pagar por tarefa). 

> **⚡ Resumo Rápido**
> - **O que é:** O n8n é uma plataforma de automação *no-code* de código aberto e hospedagem flexível, rival do Zapier.
> - **Como funciona:** Você conecta "Nós" (Nodes), onde um gatilho inicial dispara lógicas encadeadas (ex: webhook para inteligência artificial para email).
> - **Vantagem:** Integra facilmente Webhooks, Typeform, APIs da OpenAI e Gmail com escalabilidade.

Se você nunca automatizou nada, o n8n pode parecer intimidante na primeira tela. Mas a verdade é que o conceito básico é universal: **Um Gatilho (Trigger)** dispara uma **Ação**.

Neste guia, vamos criar a automação clássica: "Quando alguém preenche um formulário, a Inteligência Artificial analisa os dados e eu recebo um e-mail de alerta".

---

## 1. O que você precisa antes de começar

1. **Conta no n8n:** Recomendamos começar pelo [n8n Cloud](https://n8n.io/) (grátis para testar) ou instalá-lo no seu computador via npm/Docker se você for técnico.
2. **Conta na OpenAI (ChatGPT):** Para usar a IA.
3. **Conta no Gmail:** Para enviar o e-mail final.

## 2. Passo 1: O Gatilho (Webhook / Typeform)

No n8n, tudo começa com um `Trigger Node` (Nó de Gatilho). O gatilho decide **quando** o fluxo vai rodar.

1. Clique em **"Add first step"**.
2. Pesquise por **Webhook** (se o seu formulário enviar dados abertos) ou pesquise pelo app de formulário que você usa, como o **Typeform**.
3. Ao adicionar o Node do Typeform, o n8n pedirá que você conecte sua conta (Credentials). Faça o login com segurança.
4. Escolha o evento: "On form submission" (Ao enviar o formulário).

> [!TIP]
> Sempre use o botão "Test step" após configurar um Node. Preencha seu formulário real e clique em Testar no n8n para ver os dados puxados no painel inferior.

## 3. Passo 2: O Cérebro (OpenAI Node)

Agora temos os dados do formulário (ex: Nome do lead, Cargo, Mensagem). Vamos fazer a IA trabalhar com isso.

1. Clique no `+` do lado direito do Node do formulário.
2. Pesquise por **OpenAI** e selecione a ação **Ask AI**.
3. Adicione sua chave de API da OpenAI em Credentials.
4. No prompt, misture instruções de texto com as **variáveis** que vieram do passo anterior. 

Exemplo de Prompt que você vai inserir:
`Analise a mensagem a seguir de um potencial cliente. Resuma o interesse dele em 1 frase e diga se é Prioridade Alta ou Baixa com base na intenção de compra: {{ $json.message }}`

## 4. Passo 3: O Retorno (Gmail)

A IA pensou e gerou um resultado. Agora precisamos ser notificados.

1. Adicione mais um Node clicando no `+` à direita da OpenAI.
2. Procure por **Gmail** e selecione "Send Email".
3. Conecte sua conta do Google via OAuth.
4. Configure o e-mail:
   - **To:** seu-email@empresa.com
   - **Subject:** Novo Lead: `{{ $('Typeform').item.json.nome }}`
   - **Body:** `A Inteligência Artificial concluiu: {{ $json.text }}`

## Conclusão e Ativação

Com esses três "nós" conectados, tudo o que você precisa fazer é **salvar** e ativar a chavinha no canto superior direito do seu Canvas de "Inactive" para **"Active"**.

A partir de agora, o n8n está monitorando. Sempre que o formulário for preenchido, ele acordará, usará o modelo GPT para extrair inteligência, e você receberá um e-mail pronto em segundos.

**Próximos Passos:** Brinque com nós de roteamento (If/Switch) para enviar o e-mail para vendas se for "Prioridade Alta", ou colocar numa planilha do Sheets se for "Baixa". A imaginação é o limite.

### Você conseguiu!
Em poucos minutos, você conectou um formulário a uma IA, escreveu o e-mail sozinho e acionou sua caixa de entrada. Tudo isso sem usar código. Quando as pessoas falam de "Produtividade 10x com IA", estão falando exatamente disso.

<br>
<a href="/ferramentas" class="btn btn-fill">Explorar Diretório de Ferramentas &#8594;</a>
