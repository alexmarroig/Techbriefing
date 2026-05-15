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
  {num:'01',name:'Notícias',nameEm:'aplicáveis',desc:'O que mudou hoje e como isso vira ação no trabalho',href:'/arquivo'},
  {num:'02',name:'Manuais e',nameEm:'Tutoriais',desc:'Passo a passo para criar, testar e publicar com IA',href:'/manuais'},
  {num:'03',name:'Agentes de',nameEm:'IA',desc:'Frameworks, ferramentas e arquiteturas para agentes autônomos',href:'/agentes-de-ia'},
  {num:'04',name:'Reviews de',nameEm:'Ferramentas',desc:'Análise de preço, uso real, pontos fortes e limites',href:'/ferramentas'},
  {num:'05',name:'Negócios',nameEm:'Digitais',desc:'Estratégia, monetização, ofertas e produtos digitais',href:'/ebooks'},
];

const GUIDES = [
  {tag:'Manual',v:'a',title:'Como criar voz com IA e usar em conteúdo, aulas e anúncios',desc:'Ferramentas, roteiro, cuidados de direitos e fluxo para publicar.',href:'/manuais#voz-ia'},
  {tag:'Tutorial',v:'c',title:'Como criar agentes autônomos com OpenHands, OpenClaw, n8n e CrewAI',desc:'Do conceito ao primeiro agente que executa tarefas reais.',href:'/manuais#agentes-autonomos'},
  {tag:'Review',v:'',title:'Melhores apps de IA para vídeo por texto: preço, qualidade e limite',desc:'Comparativo para escolher sem desperdiçar assinatura.',href:'/manuais#video-texto'},
  {tag:'Guia',v:'a',title:'Como criar cortes virais de um vídeo longo com IA',desc:'Pipeline para transformar live, aula ou podcast em posts curtos.',href:'/manuais#cortes-virais'},
];

const MANUAL_TRACKS = [
  {
    tag:'Voz e avatar',
    title:'Como criar voz, clonar voz e montar um clone/avatar com IA',
    desc:'Guia para ElevenLabs, HeyGen, Synthesia, D-ID e alternativas, com cuidados legais e roteiro pronto.',
    href:'/manuais#voz-avatar',
  },
  {
    tag:'Vídeo viral',
    title:'Como criar vídeos virais de IA, bichos cantando e vídeos longos',
    desc:'Prompt, ferramenta, edição, thumbnail, legenda e publicação em Shorts, Reels e TikTok.',
    href:'/manuais#video-viral',
  },
  {
    tag:'Agentes autônomos',
    title:'Como criar agentes autônomos com OpenHands, OpenClaw, CrewAI e n8n',
    desc:'Quando usar cada stack, como testar com segurança e como transformar em serviço para clientes.',
    href:'/manuais#agentes-autonomos',
  },
  {
    tag:'Apps com texto',
    title:'Melhores apps para criar aplicativos usando apenas texto',
    desc:'Lovable, Bolt, Replit, Cursor, v0 e similares: preço, pontos fortes e quando vale pagar.',
    href:'/manuais#apps-texto',
  },
  {
    tag:'Reviews',
    title:'Reviews com preço: vídeo, voz, automação, imagem, agentes e criação de app',
    desc:'Análises práticas para escolher ferramenta sem cair em promessa bonita.',
    href:'/manuais#reviews',
  },
  {
    tag:'Renda com IA',
    title:'Como transformar essas técnicas em serviço, produto e oferta',
    desc:'Ideias de pacotes para freelancers, pequenos negócios e criadores venderem usando IA.',
    href:'/manuais#renda-ia',
  },
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
          <span className="hero-eyebrow-tag">Blog de IA aplicada</span>
        </div>
        <h1 className="hero-h1">
          IA aplicada para transformar tecnologia em resultado.
        </h1>
        <p className="hero-sub">
          Notícias filtradas, manuais, reviews e comparativos para aplicar IA no trabalho, no negócio e nos produtos digitais. Menos hype. Mais processo.
        </p>
        <div className="hero-actions">
          <a href="/arquivo" className="btn btn-fill">
            Ler últimas publicações
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </a>
          <a href="/manuais" className="arrow-link">Ver manuais práticos →</a>
        </div>
      </div>
      <div className="hero-bar wrap">
        {[
          {n:'Briefing',em:'',l:'notícias filtradas'},
          {n:'Manuais',em:'',l:'passo a passo aplicável'},
          {n:'Reviews',em:'',l:'ferramentas com critério'},
          {n:'BR',em:'',l:'conteúdo em português'},
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
        <SH num="01" label="Matéria em destaque" more="Todos os artigos"/>
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
            <div className="aside-title">Também no radar</div>
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
              <div className="latest-img">
                <img
                  src={article.image || FALLBACK_ARTICLE_IMAGE}
                  alt={article.title}
                  loading="lazy"
                  width="720"
                  height="405"
                />
              </div>
              <div className="latest-body">
                <div className="latest-kicker">
                  <span>{article.category || 'Artigo'}</span>
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
        <SH num="03" label="Categorias"/>
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
        <SH num="05" label="Guias e Comparativos" more="Ver biblioteca" moreHref="/arquivo"/>
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

function ManualsSection(){
  return (
    <section className="manuals-home">
      <div className="wrap">
        <SH num="04" label="Manuais, Guias e Tutoriais" more="Ver central" moreHref="/manuais"/>
        <div className="manuals-home-head">
          <h2>Aprenda o que está bombando antes de virar lugar comum.</h2>
          <p>Não é só notícia. Cada tema vira manual prático: ferramenta, passo a passo, custo, risco, prompt, teste e forma de aplicar no trabalho ou vender como serviço.</p>
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
        <SH num="06" label="Ferramentas Recomendadas" more="Ver todas"/>
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
                  <div className="nl-stat-n">IA</div>
                  <div className="nl-stat-l">briefing editorial gratuito para aplicar melhor</div>
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
  const latestArticles = articles.filter((article)=>article.href !== FEATURED.href);
  return (
    <>
      <Hero/>
      <FeatureSection/>
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
