import React from 'react';




const TWEAK_DEFAULTS = {
  "accentColor": "amber",
  "heroSize": "large",
  "showAff": true,
  "density": "comfortable"
};

/* ── DATA ───────────────────────────────────────────────── */

const FEATURED = {
  tags:[{l:'IA Prática',v:'a'},{l:'Guia',v:''}],
  title:'Como montar um sistema de automação com agentes de IA — sem escrever uma linha de código',
  excerpt:'O novo paradigma de automação está aqui — e ele não exige programação. Descubra como combinar n8n, Make e modelos de linguagem para criar fluxos que trabalham enquanto você dorme.',
  author:'Lucas Faria', date:'28 abr 2026', readTime:'11 min',
  href:'/arquivo',
  image:'/images/editorial/automation-workflow.svg',
};
const ASIDE = [
  {tag:'Agentes de IA',v:'c',title:'AutoGPT, CrewAI ou LangGraph? Qual framework escolher em 2026',date:'26 abr',rt:'8 min',href:'/arquivo'},
  {tag:'Software',v:'',title:'As 7 ferramentas de produtividade que os pros usam e você nunca ouviu falar',date:'24 abr',rt:'6 min',href:'/ferramentas'},
  {tag:'Automação',v:'a',title:'Integre CRM, e-mail e Notion num único fluxo automatizado',date:'22 abr',rt:'9 min',href:'/arquivo'},
];

const CATS = [
  {num:'01',name:'IA Prática',nameEm:'',desc:'Tutoriais, casos de uso e guias diretos ao ponto',href:'/arquivo'},
  {num:'02',name:'Agentes de',nameEm:'IA',desc:'Frameworks, ferramentas e arquiteturas para agentes',href:'/agentes-de-ia'},
  {num:'03',name:'Automação',nameEm:'',desc:'Flows no-code, integração e sistemas automáticos',href:'/arquivo'},
  {num:'04',name:'Software e',nameEm:'Ferramentas',desc:'Reviews honestos e comparativos aprofundados',href:'/ferramentas'},
  {num:'05',name:'Negócios',nameEm:'Digitais',desc:'Estratégia, monetização e produtos digitais',href:'/ebooks'},
];

const GUIDES = [
  {tag:'Guia',v:'a',title:'Automação para freelancers: do zero ao sistema em 7 dias',desc:'Passo a passo para montar seu primeiro sistema de automação completo.',href:'/artigos/erro-automacoes-com-ia-quebram'},
  {tag:'Tutorial',v:'c',title:'Crie seu primeiro agente de IA com n8n + GPT-4o',desc:'Sem código. Do setup ao agente funcionando em produção.',href:'/artigos/agentes-ia-nao-sao-chatbots'},
  {tag:'Guia',v:'a',title:'Workflow de conteúdo com IA: pesquisa, pauta, escrita e publicação',desc:'O processo completo para criadores que querem escalar.',href:'/artigos/transformar-ia-em-processo'},
  {tag:'Comparativo',v:'',title:'Automação de vendas B2B: da prospecção ao fechamento',desc:'Como construir um pipeline inteligente com ferramentas acessíveis.',href:'/artigos/agentes-ia-oferta-servico'},
];

const RANKING = [
  {n:'01',name:'Claude Opus 4',sub:'Raciocínio avançado e código',score:'9.6',gold:true},
  {n:'02',name:'GPT-4.1',sub:'Multimodal, versátil',score:'9.3',gold:false},
  {n:'03',name:'Gemini 2.5 Pro',sub:'Contexto longo, multimodal',score:'9.1',gold:false},
  {n:'04',name:'Llama 4 Scout',sub:'Open source, eficiente',score:'8.5',gold:false},
];

const TOOLS = [
  {ico:'⚡',name:'n8n',desc:'Automação visual self-hosted. O queridinho dos operadores avançados. Grátis se hospedar você mesmo.',stars:'★★★★★',aff:true},
  {ico:'🔗',name:'Make',desc:'Automação visual no-code para fluxos complexos. Melhor custo-benefício do mercado.',stars:'★★★★★',aff:true},
  {ico:'🤖',name:'Relevance AI',desc:'Crie e orquestre agentes de IA sem programar. Interface robusta e templates prontos.',stars:'★★★★☆',aff:true},
  {ico:'📝',name:'Notion AI',desc:'O hub de trabalho da sua equipe com IA nativa. Integra com tudo que você já usa.',stars:'★★★★☆',aff:false},
];

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
          IA que trabalha.<br/>
          Negócio que <em>escala.</em>
        </h1>
        <p className="hero-sub">
          Guias práticos, comparativos honestos e ferramentas testadas. Para quem quer aplicar IA e automação no negócio, no trabalho e na vida — sem hype, sem papo de guru.
        </p>
        <div className="hero-actions">
          <a href="/arquivo" className="btn btn-fill">
            Explorar conteúdo
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </a>
          <a href="/ferramentas" className="arrow-link">Ver ferramentas →</a>
        </div>
      </div>
      <div className="hero-bar wrap">
        {[
          {n:'50+',em:'',l:'Guias e artigos'},
          {n:'3',em:'k+',l:'Leitores na newsletter'},
          {n:'20+',em:'',l:'Ferramentas testadas'},
          {n:'2',em:'',l:'Ebooks publicados'},
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
        <SH num="01" label="Destaque da semana" more="Todos os artigos"/>
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
              <a href={FEATURED.href} className="arrow-link">Ler artigo completo -&gt;</a>
            </div>
          </div>
          <div className="feature-side">
            <div className="aside-title">Mais lidos</div>
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

function CategoriesSection(){
  return (
    <section className="categories">
      <div className="wrap">
        <SH num="02" label="Categorias"/>
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
        <SH num="03" label="Guias e Comparativos" more="Ver biblioteca" moreHref="/arquivo"/>
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
              <span className="rank-head-title">Ranking LLMs 2026</span>
              <span className="pill c">Atualizado</span>
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
              <a href="/comparativo" className="arrow-link" style={{fontSize:11}}>Ver comparativo completo -&gt;</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ToolsSection({tweaks}){
  return (
    <section className="tools">
      <div className="wrap">
        <SH num="04" label="Ferramentas Recomendadas" more="Ver todas"/>
        <div style={{marginBottom:32,marginTop:-20}}>
          <p style={{fontSize:13,color:'var(--text-3)',fontWeight:300}}>
            Testadas pela equipe. Links marcados como <span style={{color:'var(--text-4)',fontFamily:'var(--mono)',fontSize:11,letterSpacing:'.05em'}}>AFILIADO</span> nos ajudam a manter o conteúdo gratuito.
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
                  Testar grátis
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
            <h2 className="nl-h">IA aplicada<br/>na sua caixa.<br/><em>Toda semana.</em></h2>
            <p className="nl-sub">Sem hype, sem papo de guru. Só o que você pode aplicar segunda-feira de manhã.</p>
            <div className="nl-checks">
              {[
                'Guias práticos e novidades da semana',
                'Ferramentas testadas antes de todo mundo',
                'Fluxos prontos para usar hoje',
                'Sem spam — cancele em 1 clique',
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
                <div style={{fontFamily:'var(--serif)',fontSize:28,fontWeight:600,marginBottom:8,letterSpacing:'-.01em'}}>Você está dentro.</div>
                <div style={{fontSize:14,color:'var(--text-2)',fontWeight:300}}>Confirme seu e-mail — o primeiro guia chega em instantes.</div>
              </div>
            ):(
              <form style={{display:'flex',flexDirection:'column',gap:14}} onSubmit={e=>{e.preventDefault();if(email)setDone(true)}}>
                <div className="nl-stat">
                  <div className="nl-stat-n">3k+</div>
                  <div className="nl-stat-l">leitores — freelancers, fundadores e criadores</div>
                </div>
                <div>
                  <label className="nl-label">Seu nome</label>
                  <input className="nl-input" type="text" placeholder="Como posso te chamar?" value={name} onChange={e=>setName(e.target.value)}/>
                </div>
                <div>
                  <label className="nl-label">E-mail</label>
                  <input className="nl-input" type="email" placeholder="seu@email.com" value={email} onChange={e=>setEmail(e.target.value)} required/>
                </div>
                <button type="submit" className="btn btn-fill" style={{justifyContent:'center',borderRadius:10,padding:'14px'}}>
                  Quero receber toda semana →
                </button>
                <p className="nl-note">Conforme LGPD · Dados protegidos · Cancele em 1 clique</p>
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
    FEATURED.tags = [{l: featuredArticle.category || 'Artigo', v: featuredArticle.category?.includes('Agentes') ? 'c' : 'a'}];
    ASIDE.splice(0, ASIDE.length, ...articles.slice(1, 4).map((a)=>({
      tag: a.category || 'Artigo',
      v: a.category?.includes('Agentes') ? 'c' : a.category?.includes('Autom') ? 'a' : '',
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
  return (
    <>
      <Hero/>
      <FeatureSection/>
      <CategoriesSection/>
      <GuidesSection/>
      <ToolsSection tweaks={tweaks}/>
      <NewsletterSection/>
      </>
  );
}




export default App;
