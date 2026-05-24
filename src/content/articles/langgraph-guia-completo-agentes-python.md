---
title: "LangGraph: Guia Completo para Construir Agentes com Python em 2026"
description: "Aprenda a construir agentes de IA robustos com LangGraph — o runtime de orquestração do LangChain. Do StateGraph básico até agentes com memória, human-in-the-loop e deploy em produção."
category: "Guias Práticos"
author: "Lucas Andrade"
date: 2026-05-20
readTime: "18 min"
featured: false
image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=1200"
tags:
  - LangGraph
  - Python
  - Agentes de IA
  - LangChain
  - Frameworks
---

## O que é LangGraph e por que importa

![Ilustração do Artigo](https://images.unsplash.com/photo-1535223289827-42f1e9919769?auto=format&fit=crop&q=80&w=1200)


LangGraph é o runtime de orquestração de agentes do ecossistema LangChain. Enquanto o LangChain fornece as abstrações para modelos, ferramentas e cadeias de raciocínio, o LangGraph resolve um problema diferente e mais difícil: como você controla o **fluxo de execução** de um agente ao longo do tempo?

A resposta do LangGraph é elegante: modele seu agente como um **grafo dirigido com estado compartilhado**. Cada nó do grafo é uma função Python. Cada aresta é uma transição de estado. O estado persiste entre os nós e pode ser inspecionado, modificado ou interrompido em qualquer ponto.

> **Referência oficial:** [docs.langchain.com/langgraph](https://docs.langchain.com/langgraph)

### Por que não usar apenas LangChain Agents?

Os agentes "clássicos" do LangChain funcionam bem para tarefas simples: chame uma ferramenta, processe o resultado, decida se terminou. Mas eles têm limitações estruturais:

- **Sem persistência nativa**: cada execução começa do zero
- **Sem controle de fluxo granular**: você não controla os ciclos
- **Difícil de debugar**: o estado interno não é visível
- **Sem human-in-the-loop estruturado**: interrupções são gambiarras

LangGraph foi criado para resolver exatamente isso. Em produção, a diferença é enorme.

---

## Instalação e configuração

```bash
pip install -U langgraph langchain-openai
```

Para rastreamento em produção (altamente recomendado):

```bash
pip install langsmith
export LANGSMITH_TRACING=true
export LANGSMITH_API_KEY=sua_chave_aqui
export OPENAI_API_KEY=sua_chave_openai
```

---

## Conceitos fundamentais

### StateGraph — o coração do LangGraph

O `StateGraph` define o estado compartilhado que todos os nós leem e escrevem. Pense nele como a memória de trabalho do agente.

```python
from langgraph.graph import StateGraph, MessagesState, START, END
from langchain_openai import ChatOpenAI

# MessagesState é um estado pré-definido com lista de mensagens
# Você pode criar estados customizados com TypedDict

llm = ChatOpenAI(model="gpt-4o")

def agent_node(state: MessagesState):
    """Nó principal: chama o LLM com o histórico de mensagens."""
    response = llm.invoke(state["messages"])
    return {"messages": [response]}

# Montando o grafo
graph = StateGraph(MessagesState)
graph.add_node("agent", agent_node)
graph.add_edge(START, "agent")
graph.add_edge("agent", END)

# Compilando — isso valida a estrutura
app = graph.compile()

# Invocando
result = app.invoke({
    "messages": [{"role": "user", "content": "Qual é a capital do Brasil?"}]
})

print(result["messages"][-1].content)
# → "A capital do Brasil é Brasília."
```

### Estado customizado

Para agentes mais complexos, defina seu próprio estado:

```python
from typing import TypedDict, Annotated, List
from langgraph.graph import StateGraph, START, END
import operator

class AgentState(TypedDict):
    messages: Annotated[List, operator.add]  # lista acumulativa
    task: str                                 # tarefa atual
    step_count: int                           # contador de passos
    final_answer: str                         # resposta final

def planner(state: AgentState):
    """Planeja os próximos passos."""
    # ...
    return {"step_count": state["step_count"] + 1}
```

---

## Construindo um agente com ferramentas

O padrão mais comum: um agente que chama ferramentas, processa resultados e decide quando parar.

```python
from langchain_core.tools import tool
from langchain_openai import ChatOpenAI
from langgraph.graph import StateGraph, MessagesState, START, END
from langgraph.prebuilt import ToolNode

# 1. Definindo ferramentas
@tool
def buscar_preco_produto(nome_produto: str) -> str:
    """Busca o preço atual de um produto no sistema."""
    # Em produção: chamada real à API/banco de dados
    precos = {"notebook": "R$ 3.500", "mouse": "R$ 150", "teclado": "R$ 280"}
    return precos.get(nome_produto.lower(), "Produto não encontrado")

@tool
def calcular_desconto(preco: str, percentual: float) -> str:
    """Calcula o preço com desconto aplicado."""
    valor = float(preco.replace("R$ ", "").replace(".", "").replace(",", "."))
    desconto = valor * (percentual / 100)
    return f"R$ {valor - desconto:.2f}"

ferramentas = [buscar_preco_produto, calcular_desconto]

# 2. LLM com ferramentas vinculadas
llm_com_tools = ChatOpenAI(model="gpt-4o").bind_tools(ferramentas)

# 3. Nó do agente
def agente(state: MessagesState):
    return {"messages": [llm_com_tools.invoke(state["messages"])]}

# 4. Roteador: decide se executa ferramenta ou termina
def deve_continuar(state: MessagesState):
    ultima_msg = state["messages"][-1]
    if ultima_msg.tool_calls:
        return "tools"  # ir para o nó de ferramentas
    return END          # terminar

# 5. Montando o grafo
graph = StateGraph(MessagesState)
graph.add_node("agente", agente)
graph.add_node("tools", ToolNode(ferramentas))

graph.add_edge(START, "agente")
graph.add_conditional_edges("agente", deve_continuar)
graph.add_edge("tools", "agente")  # volta ao agente após ferramenta

app = graph.compile()

# Testando
for evento in app.stream({
    "messages": [{"role": "user", "content": "Qual o preço do notebook com 10% de desconto?"}]
}):
    for nó, valores in evento.items():
        if nó != "__end__":
            print(f"[{nó}]: {valores['messages'][-1].content[:100]}")
```

---

## Persistência e memória entre sessões

Uma das capacidades mais poderosas do LangGraph é a **persistência de estado**. O agente pode ser interrompido e retomado, mantendo todo o contexto.

```python
from langgraph.checkpoint.memory import MemorySaver

# MemorySaver = memória em RAM (para dev)
# SqliteSaver, PostgresSaver = para produção
checkpointer = MemorySaver()

app = graph.compile(checkpointer=checkpointer)

# Thread ID: identifica uma conversa/sessão
config = {"configurable": {"thread_id": "usuario-123"}}

# Primeira interação
app.invoke(
    {"messages": [{"role": "user", "content": "Meu nome é Carlos."}]},
    config=config
)

# Segunda interação — o agente lembra do nome!
resultado = app.invoke(
    {"messages": [{"role": "user", "content": "Qual é meu nome?"}]},
    config=config
)
print(resultado["messages"][-1].content)
# → "Seu nome é Carlos."

# Inspecionar o estado salvo
estado = app.get_state(config)
print(f"Mensagens na memória: {len(estado.values['messages'])}")
```

---

## Human-in-the-loop: aprovação humana antes de executar

Agentes que tomam ações irreversíveis (enviar e-mail, executar código, fazer compra) precisam de aprovação humana em pontos críticos. LangGraph resolve isso com `interrupts`.

```python
from langgraph.types import interrupt

def nó_critico(state: MessagesState):
    """Pede aprovação antes de executar ação sensível."""
    acao = preparar_acao(state)
    
    # PAUSA a execução e retorna ao chamador
    aprovado = interrupt({
        "pergunta": "Confirma o envio do e-mail?",
        "para": "cliente@empresa.com",
        "assunto": "Proposta Comercial",
        "preview": acao["preview"]
    })
    
    if aprovado:
        return executar_acao(acao)
    else:
        return {"messages": [{"role": "ai", "content": "Envio cancelado."}]}

# No frontend, você verifica se há interrupts pendentes:
estado = app.get_state(config)
if estado.next:
    # Há uma interrupção aguardando
    interrupt_data = estado.tasks[0].interrupts[0].value
    # Mostra para o usuário e coleta resposta...
    
    # Retoma com a resposta do usuário
    app.invoke(Command(resume=True), config=config)
```

---

## Deploy em produção

Para produção, use **LangSmith** — a plataforma gerenciada do LangChain:

```python
# langgraph.json — configuração de deploy
{
  "dependencies": ["."],
  "graphs": {
    "meu_agente": "./agente.py:app"
  },
  "env": ".env"
}
```

```bash
# Deploy no LangSmith
pip install langgraph-cli
langgraph deploy
```

Alternativamente, o LangGraph Server pode ser rodado self-hosted com Docker:

```bash
docker run -p 8123:8000 \
  -e OPENAI_API_KEY=$OPENAI_API_KEY \
  langchain/langgraph-api
```

---

## Quando usar LangGraph (e quando não usar)

### Use LangGraph quando:
- O agente precisa de **múltiplos passos com lógica condicional** complexa
- Você precisa de **persistência entre sessões** (histórico de conversa, memória)
- A tarefa exige **human-in-the-loop** estruturado
- Você quer **debugar** e rastrear cada passo do agente
- O sistema precisa **retomar** após falha ou timeout

### Prefira alternativas quando:
- A tarefa é simples e linear (use LangChain sem grafo)
- Você não tem experiência em Python (use Flowise ou n8n)
- Precisa de deploy rápido sem infra (use Relevance AI ou Make)
- O time não tem engenheiros de software (use soluções no-code)

---

## Comparativo rápido

| Critério | LangGraph | CrewAI | AutoGPT |
|---|---|---|---|
| **Curva de aprendizado** | Alta | Média | Baixa |
| **Controle** | Total | Alto | Baixo |
| **Multi-agente** | Sim (Subgraphs) | Nativo | Sim |
| **Persistência** | Nativa | Plugin | Parcial |
| **Community** | Grande | Crescente | Enorme |
| **Ideal para** | Devs Python sênior | Times de agentes | Prototipagem |

---

## Recursos para aprender mais

- **Documentação oficial**: [docs.langchain.com/langgraph](https://docs.langchain.com/langgraph)
- **Tutoriais interativos**: [academy.langchain.com](https://academy.langchain.com)
- **GitHub**: [github.com/langchain-ai/langgraph](https://github.com/langchain-ai/langgraph) (34k+ ⭐)
- **Exemplos prontos**: [github.com/langchain-ai/langgraph/tree/main/examples](https://github.com/langchain-ai/langgraph/tree/main/examples)
- **LangSmith (rastreamento)**: [smith.langchain.com](https://smith.langchain.com)

LangGraph é hoje o framework Python mais maduro para agentes em produção. A curva de aprendizado é real, mas o controle que você ganha — sobre fluxo, estado, memória e rastreamento — é insubstituível para sistemas que precisam ser confiáveis.
