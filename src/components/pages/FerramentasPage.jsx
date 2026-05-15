import React from 'react';

const CATEGORIES = [
  {
    id:'automacao',
    num:'01',
    name:'Automação',
    tools:[
      {
        ico:'⚡',
        name:'n8n',
        desc:'Automação visual self-hosted. O mais poderoso para fluxos complexos — grátis se hospedar você mesmo.',
        stars:'★★★★★',
        aff:true
      },
      {
        ico:'🔗',
        name:'Make',
        desc:'Automação no-code intuitiva. Melhor custo-benefício para times pequenos e casos de uso variados.',
        stars:'★★★★★',
        aff:true
      },
    ]
  },
  {
    id:'ia',
    num:'02',
    name:'IA & LLMs',
    tools:[
      {
        ico:'🤖',
        name:'OpenAI',
        desc:'GPT-4o e API central do ecossistema IA. Essencial para qualquer projeto com modelos de linguagem.',
        stars:'★★★★★',
        aff:false
      },
      {
        ico:'🧠',
        name:'Claude (Anthropic)',
        desc:'Melhor modelo para raciocínio, escrita e código. Ideal para contextos longos e análise crítica.',
        stars:'★★★★★',
        aff:false
      },
      {
        ico:'🔍',
        name:'Perplexity',
        desc:'Pesquisa com IA em tempo real. Substitui o Google para buscas profissionais com fontes rastreáveis.',
        stars:'★★★★☆',
        aff:true
      },
    ]
  },
  {
    id:'produtividade',
    num:'03',
    name:'Produtividade',
    tools:[
      {
        ico:'📝',
        name:'Notion',
        desc:'Hub de trabalho, docs e projetos. Com IA nativa integrada, é o sistema operacional do trabalho moderno.',
        stars:'★★★★☆',
        aff:true
      },
      {
        ico:'💻',
        name:'Cursor',
        desc:'O editor de código mais avançado com IA. Essencial para desenvolvedores e quem quer aprender a programar com IA.',
        stars:'★★★★★',
        aff:true
      },
    ]
  },
  {
    id:'sites',
    num:'04',
    name:'Sites & No-code',
    tools:[
      {
        ico:'🎨',
        name:'Framer',
        desc:'Sites profissionais com design de ponta. O melhor para portefólios, landing pages e sites de produto.',
        stars:'★★★★★',
        aff:true
      },
      {
        ico:'🌐',
        name:'Webflow',
        desc:'CMS visual e desenvolvimento front-end sem código. Mais robusto que Framer para sites de conteúdo.',
        stars:'★★★★☆',
        aff:true
      },
    ]
  },
  {
    id:'email',
    num:'05',
    name:'Email & Newsletter',
    tools:[
      {
        ico:'🐝',
        name:'Beehiiv',
        desc:'A plataforma de newsletter favorita dos criadores modernos. Monetização, analytics e crescimento integrados.',
        stars:'★★★★★',
        aff:true
      },
      {
        ico:'✉️',
        name:'ConvertKit',
        desc:'Email marketing focado em criadores. Automações, landing pages e