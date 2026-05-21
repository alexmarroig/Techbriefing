import React from 'react';
import { MANUALS, MANUAL_TRACKS, getManualsByTrack } from '../../data/manuals.js';

const EXTRA_IDEAS = [
  'Como criar um podcast inteiro com IA',
  'Como transformar artigo em vídeo narrado automaticamente',
  'Como criar atendimento por voz com IA para WhatsApp',
  'Como criar miniaturas chamativas com IA',
  'Como usar IA para vender serviço local',
  'Como criar roteiro viral a partir de notícia quente',
  'Como usar prompts para criar uma oferta melhor',
  'Como montar um agente de pesquisa para notícias tech',
];

function TrackCard({ track, index }) {
  const manuals = getManualsByTrack(track);
  return (
    <article className="manual-card" id={track.id}>
      <div className="manual-card-top">
        <span>{String(index + 1).padStart(2, '0')}</span>
        <strong>{track.label}</strong>
      </div>
      <h2>{track.title}</h2>
      <p>{track.outcome}</p>
      <div className="manual-list">
        {manuals.map((manual) => (
          <a className="manual-item" href={`/guias/${manual.slug}/`} key={manual.slug}>
            <span aria-hidden="true">→</span>
            <b>{manual.title}</b>
            <small>{manual.description}</small>
          </a>
        ))}
      </div>
      <div className="manual-tools">
        {[...new Set(manuals.flatMap((manual) => manual.tools).slice(0, 7))].map((tool) => <span key={tool}>{tool}</span>)}
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
          <h1>Manuais para transformar IA em produção, conteúdo, automação e venda.</h1>
          <p>
            Aqui entram os guias práticos do Tech Briefing: voz, avatar, vídeo, agentes autônomos,
            criação de apps, prompts, reviews com preço e ideias para transformar ferramenta em oferta real.
          </p>
          <div className="manuals-tabs" aria-label="Trilhas de manuais">
            {MANUAL_TRACKS.map((track) => <a href={`#${track.id}`} key={track.id}>{track.label}</a>)}
            <a href="/prompts/">Prompts</a>
          </div>
        </div>
      </section>

      <section className="manuals-pillars" style={{background:'var(--bg-2)', borderBottom:'1px solid var(--line-s)', padding:'48px 0'}}>
        <div className="wrap">
          <div className="manuals-section-head" style={{marginBottom: 24}}>
            <span>Guias de Referência & Páginas-Pilar</span>
            <p>Nossos guias definitivos de referência para planejar e estruturar sua operação com inteligência artificial.</p>
          </div>
          <div className="pillars-grid" style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(240px, 1fr))', gap:20}}>
            {[
              {
                title: 'Guia Definitivo de Agentes de IA',
                desc: 'Entenda o que são agentes, arquitetura recomendada e quando faz sentido implementar na sua empresa.',
                href: '/guia-definitivo-agentes-ia/',
                badge: 'Pilar 01'
              },
              {
                title: 'Melhores Ferramentas por Categoria',
                desc: 'Um mapa prático e atualizado para escolher as melhores ferramentas de IA para seu workflow diário.',
                href: '/melhores-ferramentas-ia-categoria/',
                badge: 'Pilar 02'
              },
              {
                title: 'Stack de IA para Empresas',
                desc: 'Como desenhar e orquestrar uma stack de inteligência artificial enxuta, segura e de alto retorno.',
                href: '/stack-ia-para-empresas/',
                badge: 'Pilar 03'
              },
              {
                title: 'Automação com IA para Negócios',
                desc: 'Aprenda a mapear processos, criar fluxos com n8n/Make e garantir resiliência contra quebras.',
                href: '/automacao-ia-para-negocios/',
                badge: 'Pilar 04'
              }
            ].map((p, i) => (
              <a href={p.href} key={i} className="pillar-card-link" style={{
                display: 'block',
                background: 'var(--bg)',
                border: '1px solid var(--line-s)',
                borderRadius: 12,
                padding: 24,
                textDecoration: 'none',
                color: 'inherit'
              }}>
                <div style={{
                  fontFamily: 'var(--mono)',
                  fontSize: 10,
                  fontWeight: 600,
                  color: 'var(--amber)',
                  letterSpacing: '.08em',
                  textTransform: 'uppercase',
                  marginBottom: 8
                }}>{p.badge}</div>
                <h3 style={{
                  fontFamily: 'var(--serif)',
                  fontSize: 18,
                  fontWeight: 700,
                  lineHeight: 1.3,
                  marginBottom: 10
                }}>{p.title}</h3>
                <p style={{
                  fontSize: 13,
                  color: 'var(--text-2)',
                  lineHeight: 1.5,
                  margin: 0
                }}>{p.desc}</p>
                <div style={{
                  marginTop: 16,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  fontSize: 12,
                  fontWeight: 500,
                  color: 'var(--amber)'
                }}>
                  Ler guia de referência <span>→</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="manuals-tracks">
        <div className="wrap">
          <div className="manuals-section-head">
            <span>Manuais principais</span>
            <p>Cada pauta agora tem página própria: promessa clara, ferramentas, passo a passo e erros para evitar.</p>
          </div>
          <div className="manuals-grid">
            {MANUAL_TRACKS.map((track, index) => <TrackCard track={track} index={index} key={track.id}/>)}
          </div>
        </div>
      </section>

      <section className="manuals-ideas" id="proximas-pautas">
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
          <div className="manuals-all">
            {MANUALS.map((manual) => (
              <a href={`/guias/${manual.slug}/`} key={manual.slug}>
                <span>{manual.category}</span>
                <strong>{manual.title}</strong>
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
