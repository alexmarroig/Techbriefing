---
title: "LangChain tutorial em português: guia completo para iniciantes"
description: "Aprenda LangChain do zero em português: instalação, chains, agentes, RAG e exemplos práticos. O framework mais popular para desenvolvimento com LLMs explicado de forma simples."
category: "IA Prática"
author: "Lucas Andrade"
date: 2026-05-06
readTime: "13 min"
featured: true
image: "/images/article-api-dev.png"
tags:
  - LangChain
  - Python
  - Tutorial
  - Desenvolvimento
  - LLM
---

## Resumo rápido

Aprenda LangChain do zero em português: instalação, chains, agentes, RAG e exemplos práticos. O framework mais popular para desenvolvimento com LLMs explicado de forma simples.

## O que é LangChain e por que aprender?

LangChain é o framework de código aberto mais popular para construir aplicações com modelos de linguagem (LLMs). Se você quer ir além do uso básico de APIs de IA e construir produtos reais — agentes, sistemas de RAG, chatbots com memória, pipelines de processamento de documentos — o LangChain é o ponto de partida padrão da indústria.

Em termos simples: a API da OpenAI ou da Anthropic te dá o motor. O LangChain te dá o carro completo — com câmbio, GPS, freios e painel de controle.

Este tutorial foi escrito especialmente em português para o programador brasileiro que quer entrar no desenvolvimento com LLMs de forma estruturada.

## Pré-requisitos

Para seguir este tutorial, você precisa de:
- Python 3.9+ instalado
- Conhecimento básico de Python (variáveis, funções, listas)
- Uma chave de API da OpenAI ou Anthropic
- Um ambiente virtual configurado (recomendado: venv ou conda)

## Instalação

```bash
# Criar e ativar ambiente virtual
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows

# Instalar LangChain e dependências
pip install langchain langchain-openai langchain-anthropic python-dotenv

# Para funcionalidades de RAG
pip install langchain-community chromadb pypdf
```

Crie um arquivo `.env`:
```
OPENAI_API_KEY=sk-proj-sua-chave-aqui
```

## Conceito 1: LLMs e Chat Models

O componente mais básico do LangChain é a abstração de modelos de linguagem.

```python
from langchain_openai import ChatOpenAI
from langchain_anthropic import ChatAnthropic
from langchain_core.messages import HumanMessage, SystemMessage
from dotenv import load_dotenv

load_dotenv()

# Inicializar o modelo
modelo = ChatOpenAI(model="gpt-4o-mini", temperature=0.7)

# Invocar diretamente
resposta = modelo.invoke("Olá! O que é LangChain?")
print(resposta.content)

# Usar com mensagens estruturadas
mensagens = [
    SystemMessage(content="Você é um especialista em Python que responde em português."),
    HumanMessage(content="Explique o que é um decorator em Python.")
]

resposta = modelo.invoke(mensagens)
print(resposta.content)
```

O LangChain abstrai as diferenças entre diferentes provedores — o mesmo código funciona com Claude só mudando a classe importada:

```python
# Usando Claude em vez de GPT com o mesmo código
modelo = ChatAnthropic(model="claude-3-5-sonnet-20241022")
resposta = modelo.invoke(mensagens)  # Mesmo código!
```

## Conceito 2: Prompt Templates

Templates de prompt permitem criar prompts reutilizáveis com variáveis dinâmicas.

```python
from langchain_core.prompts import ChatPromptTemplate

# Template simples
template = ChatPromptTemplate.from_messages([
    ("system", "Você é um {papel} especializado em {area}."),
    ("human", "{pergunta}")
])

# Formatar o template com valores
prompt_formatado = template.invoke({
    "papel": "consultor financeiro",
    "area": "investimentos de renda variável",
    "pergunta": "O que é um ETF e quais são os principais no Brasil?"
})

# Invocar o modelo com o prompt formatado
modelo = ChatOpenAI(model="gpt-4o-mini")
resposta = modelo.invoke(prompt_formatado)
print(resposta.content)
```

### Templates com Few-shot (exemplos)

```python
from langchain_core.prompts import FewShotChatMessagePromptTemplate

exemplos = [
    {"input": "Isso é incrível!", "output": "positivo"},
    {"input": "Produto horrível, não recomendo.", "output": "negativo"},
    {"input": "Chegou no prazo.", "output": "neutro"},
]

exemplo_template = ChatPromptTemplate.from_messages([
    ("human", "{input}"),
    ("ai", "{output}"),
])

few_shot_prompt = FewShotChatMessagePromptTemplate(
    example_prompt=exemplo_template,
    examples=exemplos,
)

prompt_final = ChatPromptTemplate.from_messages([
    ("system", "Classifique o sentimento do texto como positivo, negativo ou neutro."),
    few_shot_prompt,
    ("human", "{text}"),
])

chain = prompt_final | modelo
resultado = chain.invoke({"text": "Demorou um pouco mais que o esperado, mas chegou."})
print(resultado.content)  # "neutro"
```

## Conceito 3: Chains (Cadeias)

Chains conectam componentes em sequência. O operador `|` (pipe) cria cadeias de forma elegante.

```python
from langchain_core.output_parsers import StrOutputParser

# Chain simples: prompt | modelo | parser
prompt = ChatPromptTemplate.from_template(
    "Resuma o seguinte texto em 3 pontos principais em português:\n\n{texto}"
)

chain = prompt | modelo | StrOutputParser()

resultado = chain.invoke({
    "texto": """
    A inteligência artificial está transformando como as empresas operam. 
    Desde automação de processos rotineiros até análise preditiva avançada,
    as organizações que adotam IA reportam ganhos significativos de eficiência.
    Contudo, a implementação bem-sucedida requer estratégia clara, dados de qualidade
    e gestão de mudança adequada para os times envolvidos.
    """
})

print(resultado)
```

### Chain com múltiplas etapas

```python
# Chain 1: Extrair palavras-chave
prompt_keywords = ChatPromptTemplate.from_template(
    "Extraia 5 palavras-chave do texto abaixo (separadas por vírgula):\n{texto}"
)
chain_keywords = prompt_keywords | modelo | StrOutputParser()

# Chain 2: Gerar artigo baseado nas palavras-chave
prompt_artigo = ChatPromptTemplate.from_template(
    "Escreva um parágrafo de 100 palavras usando estas palavras-chave: {keywords}"
)
chain_artigo = prompt_artigo | modelo | StrOutputParser()

# Combinar as chains
from langchain_core.runnables import RunnableLambda

chain_completa = (
    {"texto": lambda x: x["texto"]}
    | chain_keywords
    | (lambda keywords: {"keywords": keywords})
    | chain_artigo
)

resultado = chain_completa.invoke({
    "texto": "A automação com IA reduz custos e aumenta a produtividade das equipes..."
})
print(resultado)
```

## Conceito 4: Structured Output (Saída Estruturada)

Extraia dados estruturados do texto usando Pydantic:

```python
from pydantic import BaseModel, Field
from typing import List

class DadosEmpresa(BaseModel):
    nome: str = Field(description="Nome da empresa")
    setor: str = Field(description="Setor de atuação")
    funcionarios: int = Field(description="Número aproximado de funcionários")
    tecnologias: List[str] = Field(description="Tecnologias mencionadas")

# Modelo com saída estruturada
modelo_estruturado = modelo.with_structured_output(DadosEmpresa)

resultado = modelo_estruturado.invoke(
    """
    A TechBrasil é uma empresa de software com cerca de 250 funcionários,
    atuando no setor de fintech. Usam principalmente Python, React e AWS
    em sua stack tecnológica.
    """
)

print(resultado.nome)         # TechBrasil
print(resultado.funcionarios) # 250
print(resultado.tecnologias)  # ['Python', 'React', 'AWS']
```

## Conceito 5: Memória para conversas

Para criar chatbots com memória de conversa, use o histórico de mensagens:

```python
from langchain_core.chat_history import InMemoryChatMessageHistory
from langchain_core.runnables.history import RunnableWithMessageHistory

# Armazenamento de histórico
store = {}

def obter_historico(session_id: str) -> InMemoryChatMessageHistory:
    if session_id not in store:
        store[session_id] = InMemoryChatMessageHistory()
    return store[session_id]

# Prompt que inclui histórico
prompt_com_historico = ChatPromptTemplate.from_messages([
    ("system", "Você é um assistente prestativo que responde em português."),
    ("placeholder", "{historico}"),
    ("human", "{input}"),
])

chain = prompt_com_historico | modelo | StrOutputParser()

# Adicionar gestão de histórico
chain_com_memoria = RunnableWithMessageHistory(
    chain,
    obter_historico,
    input_messages_key="input",
    history_messages_key="historico",
)

# Simular uma conversa
config = {"configurable": {"session_id": "usuario-123"}}

resposta1 = chain_com_memoria.invoke(
    {"input": "Meu nome é Carlos e trabalho com análise de dados."},
    config=config
)
print(resposta1)

resposta2 = chain_com_memoria.invoke(
    {"input": "Qual é o meu nome?"},  # O chatbot deve lembrar!
    config=config
)
print(resposta2)  # Responderá "Carlos"
```

## Conceito 6: RAG (Retrieval Augmented Generation)

Construir um sistema de RAG do zero com LangChain:

```python
from langchain_community.document_loaders import PyPDFLoader, TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_core.runnables import RunnablePassthrough

# 1. Carregar documento
loader = TextLoader("documentos/politica_empresa.txt", encoding="utf-8")
documentos = loader.load()

# 2. Dividir em chunks
splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,      # tamanho de cada chunk em caracteres
    chunk_overlap=200,    # sobreposição entre chunks
    separators=["\n\n", "\n", ".", " "]
)
chunks = splitter.split_documents(documentos)
print(f"Total de chunks: {len(chunks)}")

# 3. Criar embeddings e armazenar no vetor store
embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
vectorstore = Chroma.from_documents(
    documents=chunks,
    embedding=embeddings,
    persist_directory="./chroma_db"  # salva localmente
)

# 4. Criar retriever
retriever = vectorstore.as_retriever(
    search_type="similarity",
    search_kwargs={"k": 5}  # retorna os 5 chunks mais relevantes
)

# 5. Criar chain de RAG
template_rag = ChatPromptTemplate.from_template("""
Responda a pergunta abaixo baseando-se APENAS no contexto fornecido.
Se a resposta não estiver no contexto, diga que não encontrou a informação.

Contexto:
{contexto}

Pergunta: {pergunta}

Resposta em português:
""")

def formatar_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)

chain_rag = (
    {"contexto": retriever | formatar_docs, "pergunta": RunnablePassthrough()}
    | template_rag
    | modelo
    | StrOutputParser()
)

# 6. Fazer perguntas
resposta = chain_rag.invoke("Qual é a política de home office da empresa?")
print(resposta)
```

## Conceito 7: Agentes com ferramentas

Agentes usam LLMs para decidir quais ferramentas usar:

```python
from langchain.agents import create_tool_calling_agent, AgentExecutor
from langchain.tools import tool
import requests
from datetime import datetime

# Definir ferramentas personalizadas
@tool
def buscar_cotacao_dolar() -> str:
    """Busca a cotação atual do dólar em reais."""
    # Em produção, use uma API real de câmbio
    return "1 USD = R$ 5,42 (cotação simulada)"

@tool
def calcular_preco_em_dolar(preco_reais: float) -> str:
    """Converte um preço em reais para dólares.
    
    Args:
        preco_reais: O preço em reais a ser convertido
    """
    cotacao = 5.42  # Em produção, buscar cotação real
    preco_dolar = preco_reais / cotacao
    return f"R$ {preco_reais:.2f} = US$ {preco_dolar:.2f}"

@tool
def obter_data_atual() -> str:
    """Retorna a data e hora atual."""
    return datetime.now().strftime("%d/%m/%Y %H:%M")

ferramentas = [buscar_cotacao_dolar, calcular_preco_em_dolar, obter_data_atual]

# Prompt do agente
prompt_agente = ChatPromptTemplate.from_messages([
    ("system", "Você é um assistente financeiro útil. Use as ferramentas disponíveis quando necessário."),
    ("placeholder", "{chat_history}"),
    ("human", "{input}"),
    ("placeholder", "{agent_scratchpad}"),
])

# Criar agente
agente = create_tool_calling_agent(modelo, ferramentas, prompt_agente)
executor = AgentExecutor(agente=agente, ferramentas=ferramentas, verbose=True)

# Executar
resultado = executor.invoke({
    "input": "Quanto custa em dólares um produto que vale R$ 1.500? Qual é a cotação atual?",
    "chat_history": []
})
print(resultado["output"])
```

## Streaming: respostas em tempo real

Para melhor UX, use streaming para mostrar a resposta conforme ela é gerada:

```python
prompt = ChatPromptTemplate.from_template("Explique {topico} de forma detalhada.")
chain = prompt | modelo | StrOutputParser()

# Streaming
for chunk in chain.stream({"topico": "como funciona o RAG em IA"}):
    print(chunk, end="", flush=True)
print()  # Nova linha ao finalizar
```

## LangSmith: observabilidade e debug

Para projetos em produção, configure o LangSmith para rastrear execuções:

```python
# No arquivo .env
# LANGCHAIN_TRACING_V2=true
# LANGCHAIN_API_KEY=ls__sua-chave-langsmith
# LANGCHAIN_PROJECT=meu-projeto

# Com essas variáveis configuradas, todas as execuções são
# automaticamente registradas no LangSmith para análise
```

O LangSmith permite ver cada chamada ao LLM, os tokens usados, a latência e debugar quando algo dá errado — essencial para produção.

## Próximos passos

Com este tutorial, você tem os fundamentos para construir aplicações reais com LangChain:

1. **Pratique cada conceito** com seus próprios dados e casos de uso
2. **Explore a documentação oficial** em python.langchain.com — é excelente e sempre atualizada
3. **Estude LangGraph** para agentes mais complexos com estados e grafos de fluxo
4. **Implemente um projeto real**: Um chatbot para sua empresa, um sistema de RAG para seus documentos, ou um agente para automatizar uma tarefa específica

O ecossistema LangChain é vasto — Templates, Hub de prompts, integrações com centenas de serviços. Mas os fundamentos cobertos aqui são suficientes para construir 90% das aplicações que a maioria das empresas precisa.

Boa codificação!
