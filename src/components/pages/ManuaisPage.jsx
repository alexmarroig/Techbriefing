import React from 'react';

const TRACKS = [
  {
    id: 'voz-avatar',
    label: 'Voz e avatar',
    title: 'Criar voz, clonar voz e montar seu clone digital',
    outcome: 'Sair com um fluxo seguro para gerar narração, avatar e apresentador virtual sem parecer amador.',
    items: [
      'Como criar voz com IA para vídeos, aulas e anúncios',
      'Como clonar minha voz com IA sem cair em risco jurídico',
      'Como criar meu clone/avatar com IA para aparecer menos e produzir mais',
      'Como criar avatar e não aparecer com IA em vídeos de venda, suporte e conteúdo',
    ],
    tools: ['ElevenLabs', 'HeyGen', 'D-ID', 'Synthesia', 'Descript'],
  },
  {
    id: 'video-viral',
    label: 'Vídeo viral',
    title: 'Vídeos curtos, longos e formatos que chamam atenção',
    outcome: 'Transformar ideia em vídeo publicável com roteiro, cena, legenda, thumbnail e distribuição.',
    items: [
      'Como criar vídeos virais de IA com bichos cantando',
      'Como gerar vídeos longos com IA sem perder consistência',
      'Como criar cortes virais de um vídeo longo com IA',
      'Como transformar notícia de tecnologia em Reels, Shorts e TikTok',
    ],
    tools: ['Runway', 'Kling', 'Pika', 'CapCut', 'OpusClip'],
  },
  {
    id: 'agentes-autonomos',
    label: 'Agentes autônomos',
    title: 'Agentes que executam tarefas, não só respondem perguntas',
    outcome: 'Entender quando usar agente, como testar com segurança e como montar um fluxo que trabalha de verdade.',
    items: [
      'Como criar agentes autônomos com OpenHands, OpenClaw, CrewAI e n8n',
      'Como transformar um processo manual em agente de IA',
      'Como evitar que automações com IA quebrem no primeiro cliente real',
      'Como criar um agente para pesquisar, resumir e publicar conteúdo',
    ],
    tools: ['OpenHands', 'OpenClaw', 'CrewAI', 'LangGraph', 'n8n'],
  },
  {
    id: 'video-texto',
    label: 'Reviews de vídeo',
    title: 'Melhores apps de IA para geração de vídeo por texto',
    outcome: 'Escolher a ferramenta certa olhando preço, qualidade, tempo de geração, controle e uso comercial.',
    items: [
      'Quais melhores apps de IA para geração de vídeo por texto e por quê',
      'Runway vs Kling vs Pika: qual entrega melhor custo-benefício',
      'Quanto custa criar vídeos com IA todos os dias',
      'Como avaliar se um app de vídeo por IA vale pagar',
    ],
    tools: ['Runway', 'Kling', 'Pika', 'Luma', 'Veo'],
  },
  {
    id: 'apps-texto',
    label: 'Apps por texto',
    title: 'Criar apps usando apenas texto',
    outcome: 'Saber qual ferramenta usar para protótipo, landing page, SaaS simples, automação interna ou MVP vendável.',
    items: [
      'Quais melhores apps de IA para criar app usando apenas texto',
      'Lovable vs Bolt vs Replit vs Cursor vs v0',
      'Como escrever um prompt que vira app funcional',
      'Como publicar um app simples sem depender de programador',
    ],
    tools: ['Lovable', 'Bolt', 'Replit', 'Cursor', 'v0'],
  },
  {
    id: 'renda-ia',
    label: 'Renda com IA',
    title: 'Transformar técnica em oferta',
    outcome: 'Pegar o que aprendeu e empacotar como serviço, produto digital, consultoria ou conteúdo recorrente.',
    items: [
      'Como vender criação de avatar para pequenos negócios',
      'Como vender automação com agentes para clínicas, lojas e prestadores',
      'Como criar pacote de cortes virais com IA',
      'Como montar uma oferta low ticket usando guias e templates',
    ],
    tools: ['Kiwify', 'Brevo', 'Google Ads', 'Clarity', 'Canva'],
  },
];

const EXTRA_IDEAS = [
  'Como criar um podcast inteiro com IA',
  'Como transformar artigo em vídeo narrado automaticamente',
  'Como criar atendimento por voz com IA para WhatsApp',
  'Como criar miniaturas chamativas com IA',
  'Como usar IA para vender serviço local',
  'Como montar uma newsletter diária automática',
  'Como criar roteiro viral a partir de notícia quente',
  'Como usar IA para responder leads e recuperar carrinho',
];

function TrackCard({ track, index }) {
  return (
    <article className="manual-card" id={track.id}>
      <div className="manual-card-top">
        <span>{String(index + 1).padStart(2, '0')}</span>
        <strong>{track.label}</strong>
      </div>
      <h2>{track.title}</h2>
      <p>{track.outcome}</p>
      <div className="manual-list">
        {track.items.map((item) => (
          <div className="manual-item" key={item}>
            <span aria-hidden="true">→</span>
            <b>{item}</b>
          </div>
        ))}
      </div>
      <div className="manual-tools">
        {track.tools.map((tool) => <span key={tool}>{tool}</span>)}
      </div>
    </article>
  );
}

export default function ManuaisPage() {
  return (
    <main className="manuals-page">
      <section className="manuals-hero">
        <div className="wrap">
          <div className="manuals-kicker">Central de manuais</div>
          <h1>Aprenda IA pelo caminho que dá resultado: fazer, testar, publicar e vender.</h1>
          <p>
            Aqui entram os guias práticos do Tech Briefing: voz, avatar, vídeo, agentes autônomos,
            criação de apps, reviews com preço e ideias para transformar ferramenta em oferta real.
          </p>
          <div className="manuals-tabs" aria-label="Trilhas de manuais">
            {TRACKS.map((track) => <a href={`#${track.id}`} key={track.id}>{track.label}</a>)}
          </div>
        </div>
      </section>

      <section className="manuals-tracks">
        <div className="wrap">
          <div className="manuals-section-head">
            <span>Manuais principais</span>
            <p>Cada pauta nasce com promessa clara: o leitor precisa sair sabendo o que fazer, qual ferramenta testar, quanto custa e qual erro evitar.</p>
          </div>
          <div className="manuals-grid">
            {TRACKS.map((track, index) => <TrackCard track={track} index={index} key={track.id}/>)}
          </div>
        </div>
      </section>

      <section className="manuals-ideas" id="reviews">
        <div className="wrap">
          <div className="manuals-section-head">
            <span>Próximas pautas</span>
            <p>Fila editorial para manter o blog sempre novo, misturando tutorial, review e oportunidade prática.</p>
          </div>
          <div className="manuals-ideas-grid">
            {EXTRA_IDEAS.map((idea, index) => (
              <div className="manual-idea" key={idea}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <strong>{idea}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
