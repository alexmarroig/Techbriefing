---
title: "CrewAI: Como Criar Times de Agentes de IA com Papéis Definidos"
description: "Guia completo de CrewAI em Python — crie crews de agentes especializados que colaboram para completar tarefas complexas. Com exemplos reais de código, comparativo e casos de uso."
category: "Guias Práticos"
author: "Lucas Andrade"
date: 2026-05-20
readTime: "15 min"
featured: false
image: "/images/news/crewai-times-agentes-ia-python.svg"
tags:
  - CrewAI
  - Python
  - Multi-Agente
  - Agentes de IA
  - Frameworks
---

## O conceito por trás do CrewAI

![Ilustração visual para: CrewAI: Como Criar Times de Agentes de IA com Papéis Definidos](https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=1200)


O CrewAI parte de uma premissa elegante: tarefas complexas são resolvidas melhor por **especialistas colaborando** do que por um generalista tentando fazer tudo sozinho.

Em vez de um único agente enorme tentando pesquisar, analisar, escrever e revisar ao mesmo tempo, você define uma **crew** — uma equipe de agentes especializados, cada um com:
- Um **papel** (researcher, writer, analyst, manager)
- Uma **meta** clara
- Uma **história de contexto** que define sua expertise
- **Ferramentas** específicas para seu trabalho
- **Memória** própria e compartilhada

Cada agente foca no que faz melhor. A crew colabora. O resultado final é significativamente mais rico do que o que um agente isolado produziria.

> **Referências oficiais:** [crewai.com](https://crewai.com) | [docs.crewai.com](https://docs.crewai.com) | [github.com/crewAIInc/crewAI](https://github.com/crewAIInc/crewAI) (30k+ ⭐)

---

## Instalação

```bash
pip install crewai crewai-tools
# Para o CLI (opcional mas útil):
pip install 'crewai[tools]'
```

Com Ollama (modelos locais gratuitos para desenvolvimento):
```bash
pip install crewai langchain-ollama
ollama pull llama3
```

---

## Os 4 componentes fundamentais

### 1. Agent — o especialista

```python
from crewai import Agent
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(model="gpt-4o", temperature=0.3)

pesquisador = Agent(
    role="Analista de Mercado de IA",
    goal="Encontrar informações precisas e atualizadas sobre o mercado de agentes de IA",
    backstory="""Você é um analista sênior com 10 anos de experiência em tecnologia.
    Especialista em analisar tendências emergentes, identificar dados confiáveis e
    sintetizar informações complexas em insights acionáveis para executivos.""",
    verbose=True,        # mostra raciocínio do agente
    allow_delegation=False,  # não pode delegar para outros
    llm=llm,
    tools=[ferramenta_busca, ferramenta_web]  # veremos adiante
)
```

### 2. Task — o trabalho a ser feito

```python
from crewai import Task

tarefa_pesquisa = Task(
    description="""Pesquise o mercado global de agentes de IA em 2026.
    
    Você deve encontrar:
    1. Tamanho atual do mercado e projeções para 2027-2030
    2. Os 5 principais players e suas propostas de valor
    3. Casos de uso mais adotados por empresas
    4. Barreiras de adoção mais comuns
    
    Use fontes confiáveis: Gartner, McKinsey, a16z, relatórios das próprias empresas.
    """,
    expected_output="""Um relatório estruturado com:
    - Resumo executivo (max 200 palavras)
    - Dados de mercado com fontes citadas
    - Análise de players
    - Insights e tendências
    Formato: Markdown""",
    agent=pesquisador
)
```

### 3. Crew — a equipe

```python
from crewai import Crew, Process

crew = Crew(
    agents=[pesquisador, analista, redator],
    tasks=[tarefa_pesquisa, tarefa_analise, tarefa_redacao],
    process=Process.sequential,  # ou Process.hierarchical
    verbose=True,
    memory=True  # habilita memória compartilhada
)
```

### 4. Process — como os agentes colaboram

**Sequential** (padrão): cada agente completa sua tarefa antes do próximo começar. O output de cada tarefa alimenta a próxima.

**Hierarchical**: um agente gerente coordena os demais, delega tarefas e agrega resultados. Mais poderoso para tarefas complexas.

---

## Exemplo completo: Crew de criação de conteúdo

```python
import os
from crewai import Agent, Task, Crew, Process
from crewai_tools import SerperDevTool, WebsiteSearchTool
from langchain_openai import ChatOpenAI

os.environ["OPENAI_API_KEY"] = "sua_chave"
os.environ["SERPER_API_KEY"] = "sua_chave_serper"  # busca web

llm = ChatOpenAI(model="gpt-4o")
ferramenta_busca = SerperDevTool()
ferramenta_web = WebsiteSearchTool()

# ── AGENTES ────────────────────────────────────────────

pesquisador = Agent(
    role="Pesquisador de Conteúdo",
    goal="Coletar fatos, dados e referências precisas sobre o tema dado",
    backstory="""Jornalista investigativo com especialização em tecnologia.
    Obcecado com precisão factual. Sempre cita fontes primárias.""",
    tools=[ferramenta_busca, ferramenta_web],
    llm=llm,
    verbose=True
)

redator = Agent(
    role="Redator Editorial Senior",
    goal="Transformar pesquisa em artigos informativos e envolventes",
    backstory="""Editor de publicações de tecnologia com 8 anos de experiência.
    Escreve para executivos e profissionais de negócios. 
    Tem um estilo direto, sem jargão desnecessário, com exemplos práticos.""",
    llm=llm,
    verbose=True
)

revisor = Agent(
    role="Editor de Revisão",
    goal="Garantir qualidade editorial, precisão e clareza do conteúdo",
    backstory="""Editor chefe com olho crítico para inconsistências,
    fatos sem fonte e argumentos fracos. Sempre melhora sem perder a voz do autor.""",
    llm=llm,
    verbose=True
)

# ── TAREFAS ────────────────────────────────────────────

pesquisa = Task(
    description="""Pesquise sobre: {tema}
    
    Colete:
    - Dados e estatísticas atuais (2025-2026)
    - Casos reais de empresas usando isso
    - Opiniões de especialistas reconhecidos
    - Tendências e projeções
    
    Cite todas as fontes com URLs.""",
    expected_output="Relatório de pesquisa detalhado com fontes citadas",
    agent=pesquisador
)

redacao = Task(
    description="""Com base na pesquisa fornecida, escreva um artigo para o Tech Briefing.
    
    Formato:
    - Título impactante (max 70 chars)
    - Lead de 2 parágrafos explicando por que importa
    - 4-6 seções com subtítulos H2
    - Conclusão com próximo passo claro
    - Tom: profissional, direto, sem hype
    - Comprimento: 1.200-1.500 palavras""",
    expected_output="Artigo completo em Markdown",
    agent=redator,
    context=[pesquisa]  # usa output da pesquisa
)

revisao = Task(
    description="""Revise o artigo fornecido:
    
    Verifique:
    1. Precisão factual (todos os dados têm fonte?)
    2. Clareza (qualquer executivo entenderia?)
    3. Fluxo narrativo (o artigo tem começo, meio, fim?)
    4. Afirmações sem base (remova ou justifique)
    5. Redundâncias (corte o que não agrega)
    
    Retorne o artigo revisado com uma lista de mudanças feitas.""",
    expected_output="Artigo revisado + lista de mudanças",
    agent=revisor,
    context=[redacao]
)

# ── CREW ───────────────────────────────────────────────

crew_conteudo = Crew(
    agents=[pesquisador, redator, revisor],
    tasks=[pesquisa, redacao, revisao],
    process=Process.sequential,
    verbose=True,
    memory=True
)

# Executando
resultado = crew_conteudo.kickoff(
    inputs={"tema": "Como agentes de IA estão transformando atendimento ao cliente em 2026"}
)

print(resultado.raw)
```

---

## Processo Hierárquico — o Gerente de Agentes

Para tarefas que exigem coordenação dinâmica, use `Process.hierarchical`:

```python
from crewai import Agent, Task, Crew, Process
from langchain_openai import ChatOpenAI

gerente = Agent(
    role="Gerente de Projeto",
    goal="Coordenar a equipe para entregar análises de mercado completas e precisas",
    backstory="""Líder experiente que decompõe problemas complexos,
    delega para especialistas e garante que o resultado final seja coeso.""",
    llm=ChatOpenAI(model="gpt-4o"),
    allow_delegation=True  # ESSENCIAL para modo hierárquico
)

crew = Crew(
    agents=[gerente, pesquisador, analista, redator],
    tasks=[tarefa_principal],  # o gerente decompõe automaticamente
    process=Process.hierarchical,
    manager_agent=gerente,
    memory=True,
    verbose=True
)
```

O gerente recebe a tarefa, decompõe em subtarefas, delega para os agentes certos, coleta resultados e sintetiza a resposta final.

---

## Memória no CrewAI

O CrewAI oferece 4 tipos de memória:

```python
crew = Crew(
    agents=[...],
    tasks=[...],
    memory=True,  # habilita todos os tipos
    
    # Configuração avançada:
    # Short-term: contexto da execução atual (in-memory)
    # Long-term: memória entre execuções (SQLite por padrão)
    # Entity: lembra entidades específicas (pessoas, empresas)
    # Contextual: memória semântica para recuperar contexto relevante
)
```

Para persistência entre execuções com embeddings:

```python
from crewai.memory import LongTermMemory
from langchain_openai import OpenAIEmbeddings

crew = Crew(
    agents=[...],
    tasks=[...],
    memory=True,
    long_term_memory=LongTermMemory(
        storage=SQLiteStorage(db_path="./crew_memory.db"),
        embedder={"provider": "openai", "config": {"model": "text-embedding-3-small"}}
    )
)
```

---

## Ferramentas disponíveis (crewai-tools)

```python
from crewai_tools import (
    SerperDevTool,     # Busca Google via Serper
    WebsiteSearchTool, # RAG sobre qualquer site
    FileReadTool,      # Lê arquivos locais
    CSVSearchTool,     # Pesquisa em CSV com RAG
    PDFSearchTool,     # RAG em PDFs
    CodeInterpreterTool, # Executa código Python
    GithubSearchTool,  # Pesquisa no GitHub
    YoutubeVideoSearchTool, # Transcreve e busca em YouTube
)
```

Para criar ferramentas customizadas:

```python
from crewai.tools import BaseTool
import requests

class VerificarEstoqueTool(BaseTool):
    name: str = "verificar_estoque"
    description: str = "Verifica a disponibilidade de um produto no estoque"
    
    def _run(self, produto: str) -> str:
        # Sua lógica aqui — chamada à API interna, banco de dados, etc.
        resposta = requests.get(f"https://api.suaempresa.com/estoque/{produto}")
        return resposta.json()
```

---

## CrewAI vs. LangGraph vs. AutoGPT

| Critério | CrewAI | LangGraph | AutoGPT |
|---|---|---|---|
| **Paradigma** | Equipes de agentes | Grafo de estados | Agente solo recursivo |
| **Curva Python** | Média | Alta | Baixa |
| **Multi-agente** | ✅ Nativo | ✅ Via subgraphs | ⚠️ Experimental |
| **Controle de fluxo** | Alto | Total | Baixo |
| **Memória** | ✅ 4 tipos | ✅ Configurável | ✅ Simples |
| **Human-in-loop** | ✅ | ✅ Nativo | ⚠️ |
| **Community** | 30k+ ⭐ | 34k+ ⭐ | 170k+ ⭐ |
| **Ideal para** | Times de agentes com papéis | Agentes complexos com estado | Prototipagem rápida |

### Use CrewAI quando:
- Você precisa de **múltiplos especialistas** colaborando
- A tarefa tem fases naturais: pesquisa → análise → escrita → revisão
- Quer um **processo hierárquico** com gerente de agentes
- A equipe entende Python mas não quer gerenciar grafos manualmente

### Use LangGraph quando:
- Precisa de **controle granular** sobre cada transição de estado
- O fluxo tem **ciclos condicionais** complexos
- Precisa de **debugging** detalhado por step

---

## Recursos para aprender mais

- **Documentação oficial**: [docs.crewai.com](https://docs.crewai.com)
- **GitHub**: [github.com/crewAIInc/crewAI](https://github.com/crewAIInc/crewAI)
- **Exemplos**: [github.com/crewAIInc/crewAI-examples](https://github.com/crewAIInc/crewAI-examples)
- **CrewAI Enterprise**: [crewai.com/enterprise](https://crewai.com/enterprise) (self-hosted + observabilidade)
- **Curso DeepLearning.AI**: "Multi AI Agent Systems with crewAI" (gratuito)

O CrewAI representa uma abordagem madura para o problema de multi-agência: em vez de um agente monolítico que tenta fazer tudo, times especializados que fazem o que cada um faz melhor. Para equipes técnicas que querem agentes em produção rápido, é o ponto de entrada mais eficiente do ecossistema Python.
