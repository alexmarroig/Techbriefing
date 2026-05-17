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
