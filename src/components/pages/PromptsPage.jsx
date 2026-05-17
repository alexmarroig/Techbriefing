import React from 'react';
import { PROMPT_CATEGORIES, PROMPTS, getPromptCategory } from '../../data/prompts.js';

function PromptCard({ prompt, index }) {
  const category = getPromptCategory(prompt.category);

  return (
    <article className="prompt-card" id={prompt.slug}>
      <div className="prompt-card-top">
        <span>{String(index + 1).padStart(2, '0')}</span>
        <a href={`#${prompt.category}`}>{category?.label}</a>
      </div>
      <h2>{prompt.title}</h2>
      <p>{prompt.objective}</p>

      <div className="prompt-meta-grid">
        <div>
          <strong>Quando usar</strong>
          <span>{prompt.whenToUse}</span>
        </div>
        <div>
          <strong>Próximos passos</strong>
          <span>{prompt.nextSteps.slice(0, 2).join(' · ')}</span>
        </div>
      </div>

      <div className="prompt-copy-box">
        <button type="button" data-copy-prompt={prompt.slug}>Copiar prompt</button>
        <pre><code>{prompt.prompt}</code></pre>
      </div>

      <div className="prompt-variations">
        {prompt.variations.map((variation) => <span key={variation}>{variation}</span>)}
      </div>
    </article>
  );
}

export default function PromptsPage() {
  React.useEffect(() => {
    document.querySelectorAll('[data-copy-prompt]').forEach((button) => {
      const code = button.parentElement?.querySelector('code');
      if (!code || !navigator.clipboard) return;
      button.addEventListener('click', async () => {
        await navigator.clipboard.writeText(code.textContent || '');
        button.textContent = 'Copiado';
        window.setTimeout(() => { button.textContent = 'Copiar prompt'; }, 1400);
      });
    });
  }, []);

  return (
    <main className="prompts-page">
      <section className="prompts-hero">
        <div className="wrap">
          <div className="prompts-kicker">Biblioteca gratuita</div>
          <h1>Prompts para aplicar IA de verdade no trabalho e nos negócios.</h1>
          <p>
            Modelos prontos para diagnosticar processos, criar agentes, automatizar rotinas,
            analisar dados, produzir conteúdo e transformar ferramenta em resultado.
          </p>
          <div className="prompts-actions">
            <a className="btn btn-fill" href="#biblioteca">Explorar prompts</a>
            <a className="btn btn-stroke" href="/newsletter/">Receber novos prompts</a>
          </div>
        </div>
      </section>

      <section className="prompts-categories" aria-label="Categorias de prompts">
        <div className="wrap">
          <div className="prompts-section-head">
            <span>Mapa da biblioteca</span>
            <p>Comece pelo tipo de resultado que você quer gerar, não pela ferramenta.</p>
          </div>
          <div className="prompt-cat-grid">
            {PROMPT_CATEGORIES.map((category, index) => (
              <a className="prompt-cat-card" href={`#${category.id}`} id={category.id} key={category.id}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <strong>{category.label}</strong>
                <p>{category.description}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="prompts-library" id="biblioteca">
        <div className="wrap">
          <div className="prompts-section-head">
            <span>Prompts essenciais</span>
            <p>Copie, adapte ao seu contexto e salve as respostas que virarem processo.</p>
          </div>
          <div className="prompt-list">
            {PROMPTS.map((prompt, index) => <PromptCard prompt={prompt} index={index} key={prompt.slug}/>)}
          </div>
        </div>
      </section>

      <section className="prompts-newsletter">
        <div className="wrap">
          <div className="prompts-newsletter-box">
            <div>
              <span>Novos prompts toda semana</span>
              <h2>Receba prompts, guias e análises para aplicar IA com mais método.</h2>
            </div>
            <a className="btn btn-fill" href="/newsletter/">Entrar na newsletter</a>
          </div>
        </div>
      </section>

    </main>
  );
}
