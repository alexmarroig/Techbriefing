import React from 'react';

const TWEAK_DEFAULTS = {
  accentColor: 'amber',
  heroSize: 'large',
  showAff: true,
  density: 'comfortable'
};

/* ── DATA ───────────────────────────────────────────────── */

const FEATURED = {
  tags:[{l:'Agentes',v:'c'},{l:'Prioridade',v:''}],
  title:'Como montar um sistema de automação com agentes de IA — sem escrever uma linha de código',
  excerpt:'O novo paradigma de automação está aqui — e ele não exige programação. Descubra como combinar n8n, Make e modelos de linguagem para criar fluxos que trabalham enquanto você dorme.',
  author:'Tech Briefing',
  date:'28 abr 2026',
  readTime:'11 min',
  href:'/artigos/como-criar-agente-ia-sem-codigo',
  image:'/images/editorial/automation-workflow.svg',
};

const ASIDE = [
  {tag:'Agentes',v:'c',title:'AutoGPT, CrewAI ou LangGraph? Qual framework escolher em 2026',date:'26 abr',rt:'8 min',href:'/artigos/autogpt-crewai-langgraph/'},
  {tag:'IA Aplicada',v:'a',title:'As 7 ferramentas de produtividade que os pros usam e você nunca ouviu falar',date:'24 abr',rt:'6 min',href:'/ferramentas'},
  {tag:'Automação',v:'a',title:'Integre CRM, e-mail e Notion num único fluxo automatizado',date:'22 abr',rt:'9 min',href:'/artigos/como-automatizar-processos-com-ia'},
];

const CATS = [
  {num:'01',name:'Notícias e ideias',nameEm:'para aplicar IA',desc:'O que mudou, por que importa e como transformar em ação real',href:'/arquivo'},
  {num:'02',name:'Guias e',nameEm:'manuais',desc:'Tutoriais práticos para criar voz, vídeo, agentes, apps e automações',href:'/guias'},
  {num:'03',name:'Prompts',nameEm:'essenciais',desc:'Modelos copiáveis para trabalhar melhor com IA em qualquer etapa',href:'/prompts'},
  {num:'04',name:'Ferramentas e',nameEm:'reviews',desc:'Análises para escolher stack sem cair em demo bonita',href:'/ferramentas'},
  {num:'05',name:'Agentes e',nameEm:'automação',desc:'Arquitetura, processos, limites e implementação operacional',href:'/agentes'},
];

const GUIDES = [
  {tag:'Manual',v:'a',title:'Como criar voz com IA e usar em conteúdo, aulas e anúncios',desc:'Ferramentas, roteiro, cuidados de direitos e fluxo para publicar.',href:'/guias/como-criar-voz-com-ia'},
  {tag:'Tutorial',v:'c',title:'Como criar agentes autônomos com n8n e CrewAI',desc:'Do conceito ao primeiro agente que executa tarefas reais.',href:'/guias/como-criar-agentes-autonomos'},
  {tag:'Review',v:'',title:'Melhores apps de IA para vídeo por texto: preço, qualidade e limite',desc:'Comparativo para escolher sem desperdiçar assinatura.',href:'/guias/melhores-apps-ia-video-por-texto'},
  {tag:'Guia',v:'a',title:'Como criar cortes virais de um vídeo longo com IA',desc:'Pipeline para transformar live, aula ou podcast em posts curtos.',href:'/guias/como-criar-cortes-virais-com-ia'},
];

const MANUAL_TRACKS = [
  {
    tag:'Prompts',
    title:'Biblioteca gratuita de prompts para aplicar IA',
    desc:'Modelos para diagnosticar processos, criar agentes, analisar dados e transformar ideia em execução.',
    href:'/prompts',
    icon:'📋',
  },
  {
    tag:'Manuais',
    title:'Voz, avatar, vídeo e apps criados com IA',
    desc:'Guias práticos para produzir conteúdo, criar ativos digitais e publicar sem depender de tentativa solta.',
    href:'/guias',
    icon:'📖',
  },
  {
    tag:'Ferramentas',
    title:'Benchmarks e Reviews de Ferramentas de IA',
    desc:'Análises práticas para escolher ferramenta sem cair em promessa bonita. ROI em primeiro lugar.',
    href:'/ferramentas',
    icon:'⚙️',
  },
  {
    tag:'Estratégia',
    title:'Guias de Adoção de IA para Negócios',
    desc:'Frameworks de decisão para líderes que precisam aplicar IA com segurança e retorno.',
    href:'/guias',
    icon:'🎯',
  },
];

const RANKING = [
  {n:'01',name:'Claude 3.5 Sonnet',sub:'Raciocínio avançado e código',score:'9.8',gold:true},
  {n:'02',name:'GPT-4o',sub:'Multimodal, versátil',score:'9.5',gold:false},
  {n:'03',name:'Gemini 1.5 Pro',sub:'Contexto longo (2M tokens)',score:'9.3',gold:false},
  {n:'04',name:'DeepSeek-V3',sub:'Custo-benefício imbatível',score:'9.0',gold:false},
];

const TOOLS = [
  {ico:'⚡',name:'n8n',desc:'Automação visual agent-ready. O queridinho dos operadores avançados.',stars:'★★★★★',aff:true},
  {ico:'🔗',name:'Make',desc:'Automação visual no-code. Melhor interface para fluxos multietapas.',stars:'★★★★★',aff:true},
  {ico:'🤖',name:'Relevance AI',desc:'Crie e orquestre agentes de IA sem programar. Templates prontos.',stars:'★★★★☆',aff:true},
  {ico:'💻',name:'Cursor',desc:'O editor de código com IA que está mudando o desenvolvimento.',stars:'★★★★★',aff:false},
];

const FALLBACK_ARTICLE_IMAGE = '/images/editorial/tech-radar.svg';

function formatArticleDate(date, opts = { day: '2-digit', month: 'short' }) {
  if (!date) return '';
  return new Date(date).toLocaleDateString('pt-BR', opts);
}

/* ── COMPONENTS ─────────────────────────────────────────── */

function SH({num, label, more, moreHref}){
  return (
    <div className="sh">
      <span className="sh-num">{num}</span>
      <div className="sh-rule"/>
      <span className="sh-label">{label}</span>
      {more && (
        <>
          <div className="sh-rule" style={{flex:'0 0 20px'}}/>
          <a href={moreHref || '/arquivo'} className="sh-more">{more} →</a>
        </>
      )}
    </div>
  );
}

function Hero(){
  return (
    <section className="hero">
      <div className="hero-bg"/>
      <div className="hero-glow-top"/>
      <div className="hero-inner">
        <div className="hero-eyebrow">
          <span className="hero-eyebrow-mark">Tech Briefing</span>
          <div className="hero-eyebrow-rule"/>
          <span className="hero-eyebrow-tag">Inteligência Artificial aplicada para negócios</span>
        </div>

        <h1 className="hero-h1">
          IA que funciona.<br/>Aplicada com <em>método.</em>
        </h1>

        <p className="hero-sub">
          Notícias filtradas, guias práticos, prompts gratuitos e comparativos
          para transformar IA, agentes e automação em resultado real.
        </p>

        <div className="hero-actions">
          <a href="/guias" className="btn btn-fill">
            Começar pelos guias
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
          <a href="/prompts" className="arrow-link">Ver prompts gratuitos →</a>
        </div>
      </div>

      <div className="hero-bar wrap">
        {[
          {n:'Análises',em:'',l:'com leitura aplicável', href: '/arquivo'},
          {n:'Guias',em:'',l:'para executar melhor', href: '/guias'},
          {n:'Prompts',em:'',l:'gratuitos e copiáveis', href: '/prompts'},
          {n:'Reviews',em:'',l:'com critério editorial', href: '/ferramentas'},
        ].map((s,i)=>(
          <a href={s.href} className="hero-stat" key={i} style={{ textDecoration: 'none', color: 'inherit', transition: 'transform 0.2s, background 0.2s', cursor: 'pointer' }} onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.background = 'rgba(0,0,0,0.02)' }} onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.background = 'transparent' }}>
            <div className="hero-stat-n">{s.n}{s.em && <em>{s.em}</em>}</div>
            <div className="hero-stat-l">{s.l}</div>
          </a>
        ))}
      </div>
    </section>
  );
}

function FeatureSection(){
  return (
    <section className="feature">
      <div className="wrap">
        <SH num="01" label="Destaque Editorial" more="Ver tudo" moreHref="/arquivo"/>
        <div className="feature-layout">
          <div className="feature-ord" aria-hidden="true">01</div>

          <div>
            <a className="feature-img-wrap feature-img-link" href={FEATURED.href} aria-label={FEATURED.title}>
              <img
                src={FEATURED.image}
                alt={FEATURED.title}
                loading="eager"
                fetchpriority="high"
                width="900"
                height="506"
                style={{objectFit:'cover',width:'100%',height:'100%'}}
              />
            </a>

            <div style={{marginTop:32}}>
              <div className="feature-tags">
                {FEATURED.tags.map((t,i)=>(
                  <span key={i} className={`pill ${t.v}`}>{t.l}</span>
                ))}
              </div>

              <a href={FEATURED.href} style={{textDecoration:'none', color:'inherit', display:'block'}}>
                <h2 className="feature-title">{FEATURED.title}</h2>
                <p className="feature-excerpt">{FEATURED.excerpt}</p>
              </a>

              <div className="feature-meta">
                <span>{FEATURED.author}</span>
                <span className="feature-meta-sep">—</span>
                <span>{FEATURED.date}</span>
                <span className="feature-meta-sep">—</span>
                <span>{FEATURED.readTime} de leitura</span>
              </div>

              <a href={FEATURED.href} className="arrow-link">Ler artigo completo →</a>
            </div>
          </div>

          <div className="feature-side">
            <div className="aside-title">Essenciais da Semana</div>
            {ASIDE.map((a,i)=>(
              <a className="aside-item" href={a.href} key={i}>
                <span className={`pill ${a.v}`}>{a.tag}</span>
                <div className="aside-item-title">{a.title}</div>
                <div className="aside-item-meta">{a.date} · {a.rt}</div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustSection(){
  return (
    <section className="trust-bar">
      <div className="wrap">
        <div className="trust-inner">
          <span className="trust-label">Nosso filtro editorial:</span>
          <div className="trust-stats">
            <div className="trust-stat"><span className="trust-num">①</span> O que mudou</div>
            <div className="trust-stat"><span className="trust-num">②</span> Por que importa</div>
            <div className="trust-stat"><span className="trust-num">③</span> Como aplicar</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function RecentArticlesSection({ articles = [] }) {
  const items = articles.slice(0, 9);
  if (!items.length) return null;

  const [lead, ...rest] = items;
  const secondary = rest.slice(0, 2);
  const small = rest.slice(2, 8);

  return (
    <section className="latest" id="ultimas">
      <div className="wrap">
        <SH num="02" label="Últimas publicações" more="Arquivo completo" moreHref="/arquivo"/>

        {/* Lead + 2 secondary - top row */}
        <div className="latest-top-row">
          <a className="latest-lead-card" href={lead.href}>
            <div className="latest-lead-img">
              <img
                src={lead.image || FALLBACK_ARTICLE_IMAGE}
                alt={lead.title}
                loading="eager"
                width="680"
                height="380"
                style={{objectFit:'cover',width:'100%',height:'100%'}}
              />
              <div className="latest-lead-overlay"/>
            </div>
            <div className="latest-lead-body">
              <div className="latest-lead-meta">
                <span className={`pill ${lead.category?.includes('Agente') ? 'c' : 'a'}`}>
                  {lead.category || 'IA'}
                </span>
                <span className="latest-meta-date">{formatArticleDate(lead.date)}</span>
              </div>
              <h2 className="latest-lead-title">{lead.title}</h2>
              <p className="latest-lead-desc">{lead.description}</p>
              <span className="latest-readtime">{lead.readTime} de leitura</span>
            </div>
          </a>

          <div className="latest-secondary-col">
            {secondary.map((article, i) => (
              <a className="latest-secondary-card" href={article.href} key={i}>
                <div className="latest-secondary-img">
                  <img
                    src={article.image || FALLBACK_ARTICLE_IMAGE}
                    alt={article.title}
                    loading="lazy"
                    width="280"
                    height="180"
                    style={{objectFit:'cover',width:'100%',height:'100%'}}
                  />
                </div>
                <div className="latest-secondary-body">
                  <div className="latest-secondary-meta">
                    <span className={`pill ${article.category?.includes('Agente') ? 'c' : 'a'}`}>
                      {article.category || 'IA'}
                    </span>
                    <span className="latest-meta-date">{formatArticleDate(article.date)}</span>
                  </div>
                  <h3 className="latest-secondary-title">{article.title}</h3>
                  <span className="latest-readtime">{article.readTime}</span>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Small cards grid */}
        {small.length > 0 && (
          <div className="latest-small-grid">
            {small.map((article, index) => (
              <a className="latest-small-card" href={article.href} key={index}>
                <div className="latest-small-img">
                  <img
                    src={article.image || FALLBACK_ARTICLE_IMAGE}
                    alt={article.title}
                    loading="lazy"
                    width="240"
                    height="140"
                    style={{objectFit:'cover',width:'100%',height:'100%'}}
                  />
                </div>
                <div className="latest-small-body">
                  <div className="latest-small-meta">
                    <span className={`pill ${article.category?.includes('Agente') ? 'c' : 'a'}`}>
                      {article.category || 'IA'}
                    </span>
                  </div>
                  <h3 className="latest-small-title">{article.title}</h3>
                  <span className="latest-readtime">{article.readTime}</span>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function CategoriesSection(){
  return (
    <section className="categories">
      <div className="wrap">
        <SH num="03" label="Pilares Estratégicos"/>

        <div className="cat-list">
          {CATS.map((c,i)=>(
            <a key={i} className="cat-row" href={c.href}>
              <span className="cat-row-num">{c.num}</span>
              <span className="cat-row-name">{c.name} {c.nameEm && <em>{c.nameEm}</em>}</span>
              <span className="cat-row-desc">{c.desc}</span>
              <span className="cat-row-arrow">↗</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function GuidesSection(){
  return (
    <section className="guides">
      <div className="wrap">
        <SH num="05" label="Manuais em Destaque" more="Ver biblioteca" moreHref="/arquivo"/>

        <div className="guides-grid">
          <div className="guide-list">
            {GUIDES.map((g,i)=>(
              <a className="guide-row" href={g.href} key={i}>
                <div className="guide-n">0{i+1}</div>
                <div>
                  <span className={`pill ${g.v}`}>{g.tag}</span>
                  <div className="guide-title">{g.title}</div>
                  <div className="guide-desc">{g.desc}</div>
                </div>
              </a>
            ))}
          </div>

          <div className="rank-card">
            <div className="rank-head">
              <span className="rank-head-title">Ranking LLMs — 2026</span>
              <span className="pill c">Top Agentes</span>
            </div>

            {RANKING.map((r,i)=>(
              <a className="rank-item" key={i} href={r.href || '/artigos/'}>
                <div className={`rank-n ${r.gold ? 'g' : ''}`}>{r.n}</div>
                <div>
                  <div className="rank-name">{r.name}</div>
                  <div className="rank-sub">{r.sub}</div>
                </div>
                <div className="rank-score">{r.score}</div>
              </a>
            ))}

            <div className="rank-foot">
              <a href="/comparativos/n8n-vs-make/" className="arrow-link" style={{fontSize:11}}>
                Metodologia de Benchmark →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ManualsSection(){
  return (
    <section className="manuals-home">
      <div className="wrap">
        <SH num="04" label="Trilhas de Implementação" more="Ver central" moreHref="/guias"/>

        <div className="manuals-home-head">
          <h2>Não é sobre saber a ferramenta. É sobre sair com um <em>processo pronto.</em></h2>
          <p>
            Os guias do Tech Briefing são feitos para quem quer produzir, automatizar,
            vender, analisar e decidir melhor com IA sem depender de hype.
          </p>
        </div>

        <div className="manuals-home-grid">
          {MANUAL_TRACKS.map((item, index)=>(
            <a className="manual-track-card" href={item.href} key={item.title}>
              <div className="manual-track-icon">{item.icon}</div>
              <span className="manual-track-tag">{item.tag}</span>
              <strong>{item.title}</strong>
              <p>{item.desc}</p>
              <span className="manual-track-arrow">Ver trilha →</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function ToolsSection({tweaks}){
  return (
    <section className="tools">
      <div className="wrap">
        <SH num="06" label="Laboratório de Ferramentas" more="Ver todas" moreHref="/ferramentas"/>

        <div style={{marginBottom:32,marginTop:-20}}>
          <p style={{fontSize:13,color:'var(--text-3)',fontWeight:400}}>
            Reviews 100% independentes. O ROI editorial e operacional começa na escolha da stack certa.
          </p>
        </div>

        <div className="tools-grid">
          {TOOLS.map((t,i)=>(
            <a className="tool-card" key={i} href={t.href || '/ferramentas'}>
              <div className="tool-head">
                <div style={{display:'flex',gap:14,alignItems:'center'}}>
                  <div className="tool-ico">{t.ico}</div>
                  <div className="tool-name">{t.name}</div>
                </div>

                {t.aff && tweaks.showAff && (
                  <span className="tool-aff-badge">Afiliado</span>
                )}
              </div>

              <div className="tool-desc">{t.desc}</div>

              <div className="tool-foot">
                <span className="tool-stars">{t.stars}</span>
                <span className="tool-try">
                  Análise Completa
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5h6M5 2l3 3-3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function NewsletterSection(){
  const [name,setName] = React.useState('');
  const [email,setEmail] = React.useState('');
  const [done,setDone] = React.useState(false);

  return (
    <section className="nl">
      <div className="wrap">
        <SH num="07" label="Newsletter"/>

        <div className="nl-inner">
          <div>
            <h2 className="nl-h">Receba o<br/>Briefing.<br/><em>Opere melhor.</em></h2>
            <p className="nl-sub">
              Notícias, prompts, guias e ferramentas com um filtro simples:
              o que vale a pena entender, testar e aplicar.
            </p>

            <div className="nl-checks">
              {[
                'Prompts prontos para copiar',
                'Manuais e guias acionáveis',
                'Análises de notícias com próximos passos',
                'Ferramentas úteis, sem hype vazio',
              ].map((c,i)=>(
                <div className="nl-check-row" key={i}>
                  <div className="nl-check-ico">✓</div>
                  {c}
                </div>
              ))}
            </div>
          </div>

          <div>
            {done ? (
              <div style={{textAlign:'center',padding:'48px 0'}}>
                <div style={{fontFamily:'var(--serif)',fontSize:52,fontWeight:600,color:'var(--amber)',marginBottom:12,lineHeight:1}}>✓</div>
                <div style={{fontFamily:'var(--serif)',fontSize:28,fontWeight:600,marginBottom:8,letterSpacing:'-.01em'}}>Você está no Briefing.</div>
                <div style={{fontSize:14,color:'var(--text-2)',fontWeight:400}}>Obrigado pela confiança. Sua primeira edição chega em breve.</div>
              </div>
            ) : (
              <form style={{display:'flex',flexDirection:'column',gap:14}} onSubmit={e=>{e.preventDefault();if(email)setDone(true)}}>
                <div className="nl-stat">
                  <div className="nl-stat-l">Operadores, gestores e fundadores lendo semanalmente</div>
                </div>

                <div>
                  <label className="nl-label">Seu nome</label>
                  <input
                    className="nl-input"
                    type="text"
                    placeholder="Como podemos te chamar?"
                    value={name}
                    onChange={e=>setName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="nl-label">E-mail Profissional</label>
                  <input
                    className="nl-input"
                    type="email"
                    placeholder="seu@trabalho.com"
                    value={email}
                    onChange={e=>setEmail(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-fill" style={{justifyContent:'center',borderRadius:10,padding:'14px'}}>
                  Quero participar do Briefing →
                </button>

                <p className="nl-note">LGPD Compliance · Cancele a qualquer momento</p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* APP ────────────────────────────────────────────────── */

function App({ articles = [], tools = [], apps = [], ebooks = [] }){
  const featuredArticle = articles.find((a)=>a.featured) || articles[0];

  if (featuredArticle) {
    FEATURED.title = featuredArticle.title;
    FEATURED.excerpt = featuredArticle.description;
    FEATURED.author = featuredArticle.author;
    FEATURED.date = new Date(featuredArticle.date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
    FEATURED.readTime = featuredArticle.readTime;
    FEATURED.href = featuredArticle.href;
    FEATURED.image = featuredArticle.image || FEATURED.image;
    FEATURED.tags = [{l: featuredArticle.category || 'Agentes', v: 'c'}];

    ASIDE.splice(0, ASIDE.length, ...articles.slice(1, 4).map((a)=>({
      tag: a.category || 'IA Aplicada',
      v: a.category?.includes('Agente') ? 'c' : 'a',
      title: a.title,
      date: new Date(a.date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short'
      }),
      rt: a.readTime,
      href: a.href,
    })));
  }

  if (tools.length) {
    TOOLS.splice(0, TOOLS.length, ...tools.slice(0, 4).map((t)=>({
      ico: t.icon,
      name: t.name,
      desc: t.description,
      stars: '★'.repeat(Math.round(t.rating)) + '☆'.repeat(Math.max(0, 5 - Math.round(t.rating))),
      aff: t.affiliate,
    })));
  }

  const tweaks = TWEAK_DEFAULTS;
  const latestArticles = articles.filter((article)=>article.href !== FEATURED.href);

  return (
    <>
      <Hero/>
      <FeatureSection/>
      <TrustSection/>
      <RecentArticlesSection articles={latestArticles}/>
      <CategoriesSection/>
      <ManualsSection/>
      <GuidesSection/>
      <ToolsSection tweaks={tweaks}/>
      <NewsletterSection/>
    </>
  );
}

export default App;
