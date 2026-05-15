import React from 'react';

const TWEAK_DEFAULTS = {
  "accentColor": "amber",
  "heroSize": "large",
  "showAff": true,
  "density": "comfortable"
};

/* ── DATA ───────────────────────────────────────────────── */

const FEATURED = {
  tags:[{l:'Agentes',v:'c'},{l:'Prioridade',v:''}],
  title:'Como montar um sistema de automação com agentes de IA — sem escrever uma linha de código',
  excerpt:'O novo paradigma de automação está aqui — e ele não exige programação. Descubra como combinar n8n, Make e modelos de linguagem para criar fluxos que trabalham enquanto você dorme.',
  author:'Lucas Faria', date:'28 abr 2026', readTime:'11 min',
  href:'/artigos/como-criar-agente-ia-sem-codigo',
  image:'/images/editorial/automation-workflow.svg',
};
const ASIDE = [
  {tag:'Agentes',v:'c',title:'AutoGPT, CrewAI ou LangGraph? Qual framework escolher em 2026',date:'26 abr',rt:'8 min',href:'/artigos/autogpt-crewai-langgraph'},
  {tag:'IA Aplicada',v:'a',title:'As 7 ferramentas de produtividade que os pros usam e você nunca ouviu falar',date:'24 abr',rt:'6 min',href:'/ferramentas'},
  {tag:'Automação',v:'a',title:'Integre CRM, e-mail e Notion num único fluxo automatizado',date:'22 abr',rt:'9 min',href:'/artigos/como-automatizar-processos-com-ia'},
];

const CATS = [
  {num:'01',name:'IA',nameEm:'Aplicada',desc:'Casos de uso reais, produtividade e workflows práticos',href:'/ia-aplicada'},
  {num:'02',name:'Agentes de',nameEm:'IA',desc:'Frameworks, memória e ferramentas para agentes autônomos',href:'/agentes'},
  {num:'03',name:'Laboratório de',nameEm:'Ferramentas',desc:'Reviews, comparativos e benchmarks que aumentam o ROI',href:'/ferramentas'},
  {num:'04',name:'Automação e',nameEm:'Operações',desc:'Integrações, no-code e agentes em produção',href:'/automacao'},
  {num:'05',name:'Guias',nameEm:'Estratégicos',desc:'Frameworks de decisão e adoção de IA profissional',href:'/guias'},
];

const GUIDES = [
  {tag:'Manual',v:'a',title:'Como criar voz com IA e usar em conteúdo, aulas e anúncios',desc:'Ferramentas, roteiro, cuidados de direitos e fluxo para publicar.',href:'/manuais/como-criar-voz-com-ia'},
  {tag:'Tutorial',v:'c',title:'Como criar agentes autônomos com n8n e CrewAI',desc:'Do conceito ao primeiro agente que executa tarefas reais.',href:'/manuais/como-criar-agentes-autonomos'},
  {tag:'Review',v:'',title:'Melhores apps de IA para vídeo por texto: preço, qualidade e limite',desc:'Comparativo para escolher sem desperdiçar assinatura.',href:'/manuais/melhores-apps-ia-video-por-texto'},
  {tag:'Guia',v:'a',title:'Como criar cortes virais de um vídeo longo com IA',desc:'Pipeline para transformar live, aula ou podcast em posts curtos.',href:'/manuais/como-criar-cortes-virais-com-ia'},
];

const MANUAL_TRACKS = [
  {
    tag:'Agentes',
    title:'Criação de agentes autônomos com CrewAI e n8n',
    desc:'Quando usar cada stack, como testar com segurança e como transformar em serviço para clientes.',
    href:'/agentes',
  },
  {
    tag:'Operações',
    title:'Automação de workflows e pipelines de IA',
    desc:'Documentamos como integrar agentes e LLMs em fluxos de trabalho reais para escalar produtividade.',
    href:'/automacao',
  },
  {
    tag:'Ferramentas',
    title:'Benchmarks e Reviews de Ferramentas de IA',
    desc:'Análises práticas para escolher ferramenta sem cair em promessa bonita. ROI em primeiro lugar.',
    href:'/ferramentas',
  },
  {
    tag:'Estratégia',
    title:'Guias de Adoção de IA para Negócios',
    desc:'Frameworks de decisão para líderes que precisam aplicar IA com segurança e retorno.',
    href:'/guias',
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
      {more && <><div className="sh-rule" style={{flex:'0 0 20px'}}/><a href={moreHref||'/arquivo'} className="sh-more">{more} →</a></>}
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
          <span className="hero-eyebrow-tag">Inteligência Artificial Aplicada</span>
        </div>
        <h1 className="hero-h1">
          Onde a tecnologia encontra a <em>Operação Real.</em>
        </h1>
        <p className="hero-sub">
          Curadoria editorial estratégica sobre IA, Agentes e Automação. Sem hype, sem superficialidade — apenas o que gera ROI operacional para empresas e profissionais.
        </p>
        <div className="hero-actions">
          <a href="/ia-aplicada" className="btn btn-fill">
            Explorar IA Aplicada
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </a>
          <a href="/metodologia" className="arrow-link">Nossa metodologia de teste →</a>
        </div>
      </div>
      <div className="hero-bar wrap">
        {[
          {n:'50+',em:'',l:'Guias Práticos'},
          {n:'3.000+',em:'',l:'Membros no Briefing'},
          {n:'100%',em:'',l:'Independente'},
          {n:'Daily',em:'',l:'Monitoramento de IA'},
        ].map((s,i)=>(
          <div className="hero-stat" key={i}>
            <div className="hero-stat-n">{s.n}{s.em&&<em>{s.em}</em>}</div>
            <div className="hero-stat-l">{s.l}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function FeatureSection(){
  return (
    <section className="feature">
      <div className="wrap">
        <SH num="01" label="Foco Editorial" more="Ver tudo"/>
        <div className="feature-layout">
          <div className="feature-ord" aria-hidden="true">01</div>
          <div>
            <a className="feature-img-wrap feature-img-link" href={FEATURED.href} aria-label={FEATURED.title}>
              <img src={FEATURED.image} alt={FEATURED.title} loading="lazy" width="900" height="506"/>
            </a>
            <div style={{marginTop:32}}>
              <div className="feature-tags">
                {FEATURED.tags.map((t,i)=><span key={i} className={`pill ${t.v}`}>{t.l}</span>)}
              </div>
              <h2 className="feature-title">{FEATURED.title}</h2>
              <p className="feature-excerpt">{FEATURED.excerpt}</p>
              <div className="feature-meta">
                <span>{FEATURED.author}</span>
                <span className="feature-meta-sep">—</span>
                <span>{FEATURED.date}</span>
                <span className="feature-meta-sep">—</span>
                <span>{FEATURED.readTime} de leitura</span>
              </div>
              <a href={FEATURED.href} className="arrow-link">Ler guia completo -&gt;</a>
            </div>
          </div>
          <div className="feature-side">
            <div className="aside-title">Essenciais da Semana</div>
            {ASIDE.map((a,i)=>(
              <a className="aside-item" href={a.href} key={i}>
                <span className={`pill ${a.v}`}>{a.tag}</span>
                <div className="aside-item-title">{a.title}</div>
                <div className="aside-item-meta">{a.date} - {a.rt}</div>
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
          <span className="trust-label">Autoridade reconhecida em IA Operacional:</span>
          <div className="trust-stats">
            <div className="trust-stat"><strong>50+</strong> Testes Reais</div>
            <div className="trust-stat"><strong>3.000+</strong> Leitores</div>
            <div className="trust-stat"><strong>#1</strong> Referência em Agentes</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function RecentArticlesSection({ articles = [] }) {
  const items = articles.slice(0, 8);
  if (!items.length) return null;

  return (
    <section className="latest" id="ultimas">
      <div className="wrap">
        <SH num="02" label="Últimas publicações" more="Arquivo completo" moreHref="/arquivo"/>
        <div className="latest-grid">
          {items.map((article, index) => (
            <a className={`latest-card ${index === 0 ? 'lead' : ''}`} href={article.href} key={article.href || article.slug || index}>
              <div className="latest-img-wrap">
                <img src={article.image || FALLBACK_ARTICLE_IMAGE} alt="" loading="lazy"/>
              </div>
              <div className="latest-content">
                <div className="latest-top">
                  <span className={`pill ${article.category?.includes('Agente') ? 'c' : 'a'}`}>{article.category || 'IA'}</span>
                  <span>{formatArticleDate(article.date)}</span>
                </div>
                <h3 className="latest-title">{article.title}</h3>
                <p className="latest-desc">{article.description}</p>
                <div className="latest-meta">{article.readTime} de leitura</div>
              </div>
            </a>
          ))}
        </div>
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
              <span className="cat-row-name">{c.name} {c.nameEm&&<em>{c.nameEm}</em>}</span>
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
        <SH num="05" label="Laboratório & Rankings" more="Ver biblioteca" moreHref="/arquivo"/>
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
              <div className="rank-item" key={i}>
                <div className={`rank-n ${r.gold?'g':''}`}>{r.n}</div>
                <div>
                  <div className="rank-name">{r.name}</div>
                  <div className="rank-sub">{r.sub}</div>
                </div>
                <div className="rank-score">{r.score}</div>
              </div>
            ))}
            <div className="rank-foot">
              <a href="/comparativo" className="arrow-link" style={{fontSize:11}}>Metodologia de Benchmark -&gt;</a>
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
        <SH num="04" label="Trilhas de Implementação" more="Ver central" moreHref="/manuais"/>
        <div className="manuals-home-head">
          <h2>Não é sobre o que a IA faz, é sobre o que <em>você faz</em> com ela.</h2>
          <p>Documentamos processos repetíveis para criar valor real. De agentes autônomos a pipelines de conteúdo — testados em nossos fluxos antes de chegarem a você.</p>
        </div>
        <div className="manuals-home-grid">
          {MANUAL_TRACKS.map((item, index)=>(
            <a className="manual-track-card" href={item.href} key={item.title}>
              <span className="manual-track-num">{String(index + 1).padStart(2,'0')}</span>
              <span className="manual-track-tag">{item.tag}</span>
              <strong>{item.title}</strong>
              <p>{item.desc}</p>
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
        <SH num="06" label="Laboratório de Ferramentas" more="Ver todas"/>
        <div style={{marginBottom:32,marginTop:-20}}>
          <p style={{fontSize:13,color:'var(--text-3)',fontWeight:300}}>
            O ROI editorial e operacional começa na escolha da stack certa. Reviews 100% independentes.
          </p>
        </div>
        <div className="tools-grid">
          {TOOLS.map((t,i)=>(
            <div className="tool-card" key={i}>
              <div className="tool-head">
                <div style={{display:'flex',gap:14,alignItems:'center'}}>
                  <div className="tool-ico">{t.ico}</div>
                  <div className="tool-name">{t.name}</div>
                </div>
                {t.aff && tweaks.showAff && <span className="tool-aff-badge">Afiliado</span>}
              </div>
              <div className="tool-desc">{t.desc}</div>
              <div className="tool-foot">
                <span className="tool-stars">{t.stars}</span>
                <span className="tool-try">
                  Análise Completa
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5h6M5 2l3 3-3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function NewsletterSection(){
  const [name,setName]=React.useState('');
  const [email,setEmail]=React.useState('');
  const [done,setDone]=React.useState(false);
  return (
    <section className="nl">
      <div className="wrap">
        <SH num="07" label="Newsletter"/>
        <div className="nl-inner">
          <div>
            <h2 className="nl-h">Receba o<br/>Briefing.<br/><em>Opere melhor.</em></h2>
            <p className="nl-sub">A dose semanal de estratégia de IA que chega antes da sua primeira reunião de segunda-feira.</p>
            <div className="nl-checks">
              {[
                'Benchmarks e reviews de ferramentas',
                'Workflows de automação para copiar',
                'Análises de impacto de mercado',
                'Sem spam — foco 100% profissional',
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
                <div style={{fontSize:14,color:'var(--text-2)',fontWeight:300}}>Obrigado pela confiança. Sua primeira edição chega em breve.</div>
              </div>
            ):(
              <form style={{display:'flex',flexDirection:'column',gap:14}} onSubmit={e=>{e.preventDefault();if(email)setDone(true)}}>
                <div className="nl-stat">
                  <div className="nl-stat-n">3.000+</div>
                  <div className="nl-stat-l">operadores, gestores e fundadores</div>
                </div>
                <div>
                  <label className="nl-label">Seu nome</label>
                  <input className="nl-input" type="text" placeholder="Como podemos te chamar?" value={name} onChange={e=>setName(e.target.value)}/>
                </div>
                <div>
                  <label className="nl-label">E-mail Profissional</label>
                  <input className="nl-input" type="email" placeholder="seu@trabalho.com" value={email} onChange={e=>setEmail(e.target.value)} required/>
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
    FEATURED.date = new Date(featuredArticle.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
    FEATURED.readTime = featuredArticle.readTime;
    FEATURED.href = featuredArticle.href;
    FEATURED.image = featuredArticle.image || FEATURED.image;
    FEATURED.tags = [{l: featuredArticle.category || 'Agentes', v: 'c'}];
    ASIDE.splice(0, ASIDE.length, ...articles.slice(1, 4).map((a)=>({
      tag: a.category || 'IA Aplicada',
      v: a.category?.includes('Agente') ? 'c' : 'a',
      title: a.title,
      date: new Date(a.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
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
  const tweaks=TWEAK_DEFAULTS;
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
