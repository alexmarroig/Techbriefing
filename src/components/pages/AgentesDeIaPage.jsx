import React from 'react';




/* ── DATA ───────────────────────────────────── */
const TAGS = ['AutoGPT','LangGraph','CrewAI','n8n','Multi-agente','Orquestração','RAG','LLM'];

const FEATURE_ART = {
  tags:[{l:'Agentes de IA',v:'c'},{l:'Framework',v:''}],
  title:'AutoGPT, CrewAI ou LangGraph? Guia definitivo para escolher o framework certo em 2026',
  excerpt:'O ecossistema de frameworks para agentes de IA cresceu muito em pouco tempo. Mas qual usar? Testamos os três em cenários reais — automação, análise de dados e suporte ao cliente — e comparamos performance, custo e complexidade.',
  author:'Lucas Faria', date:'28 abr 2026', readTime:'14 min', href:'/artigos/autogpt-crewai-langgraph', image:'/images/editorial/agents-operations.svg',
};

const ASIDE = [
  {tag:'Tutorial',v:'c',title:'Como criar um agente ReAct do zero com LangChain',date:'25 abr',rt:'9 min',href:'/artigos/langchain-tutorial-portugues'},
  {tag:'Análise',v:'',title:'O que mudou no GPT-4o para uso em agentes autônomos',date:'22 abr',rt:'6 min',href:'/artigos/futuro-da-ia-nos-negocios'},
  {tag:'Agentes',v:'c',title:'Multi-agente vs. agente único: quando cada um faz sentido',date:'18 abr',rt:'8 min',href:'/artigos/multi-agente-vs-agente-unico'},
];

const ARTS = [
  {tag:'Tutorial',v:'c',title:'Construindo um agente de pesquisa com n8n e Claude 3.7',excerpt:'Passo a passo completo para criar um agente que pesquisa, sintetiza e entrega resultados.',date:'26 abr',rt:'10 min',href:'/artigos/como-criar-agente-ia-sem-codigo',image:'/images/editorial/agents-operations.svg'},
  {tag:'Agentes',v:'c',title:'Orquestração de agentes: o guia que você não encontra em lugar nenhum',excerpt:'Arquiteturas, padrões de comunicação e como evitar os erros mais comuns.',date:'23 abr',rt:'12 min',href:'/artigos/agentes-ia-nao-sao-chatbots',image:'/images/editorial/api-components.svg'},
  {tag:'Análise',v:'',title:'Por que a maioria dos agentes de IA falha em produção',excerpt:'Os problemas reais que aparecem depois do tutorial — e como resolver cada um.',date:'20 abr',rt:'7 min',href:'/artigos/erro-automacoes-com-ia-quebram',image:'/images/editorial/failure-blocks.svg'},
];

const ART_LIST = [
  {num:'04',tag:'Caso de uso',v:'',title:'Agentes de IA para atendimento ao cliente: o que funciona de verdade',date:'17 abr',rt:'8 min',href:'/artigos/agentes-ia-para-vendas'},
  {num:'05',tag:'Tutorial',v:'c',title:'RAG com agentes: quando recuperar contexto muda tudo',date:'14 abr',rt:'11 min',href:'/artigos/rag-explicado-guia-pratico'},
  {num:'06',tag:'Ferramentas',v:'',title:'Relevance AI vs Voiceflow: qual plataforma usar para seus agentes',date:'11 abr',rt:'9 min',href:'/comparativos/relevance-ai-vs-voiceflow'},
  {num:'07',tag:'Estratégia',v:'a',title:'Como monetizar agentes de IA no seu negócio em 2026',date:'8 abr',rt:'6 min',href:'/artigos/agentes-ia-oferta-servico'},
  {num:'08',tag:'Agentes',v:'c',title:'Memory e contexto em agentes de longa duração',date:'5 abr',rt:'10 min',href:'/artigos/multi-agente-vs-agente-unico'},
];

const GUIDES = [
  {tag:'Guia',v:'a',title:'Do zero ao agente em produção: o roadmap completo',desc:'Infraestrutura, escolha de framework, deploy e monitoramento.',href:'/artigos/o-que-sao-agentes-de-ia'},
  {tag:'Comparativo',v:'',title:'Comparativo completo: AutoGPT vs CrewAI vs LangGraph vs Relevance',desc:'Testamos os quatro em 6 cenários diferentes. Veja os resultados.',href:'/comparativo'},
  {tag:'Tutorial',v:'c',title:'Construindo um time de agentes especializados com CrewAI',desc:'Como dividir tarefas complexas entre agentes que colaboram.',href:'/artigos/automacao-agentes-sem-codigo'},
  {tag:'Guia',v:'a',title:'Avaliação e debug de agentes: como saber se está funcionando',desc:'Métricas, logs e ferramentas para monitorar agentes em produção.',href:'/artigos/erro-automacoes-com-ia-quebram'},
];

const RANKING = [
  {n:'01',name:'LangGraph',sub:'Controle fino de fluxo',score:'9.2',gold:true},
  {n:'02',name:'CrewAI',sub:'Multi-agente rápido',score:'8.9',gold:false},
  {n:'03',name:'AutoGPT',sub:'Autônomo, versátil',score:'8.5',gold:false},
  {n:'04',name:'Relevance AI',sub:'No-code, visual',score:'8.1',gold:false},
];

const TOOLS = [
  {ico:'🤖',name:'Relevance AI',desc:'A plataforma mais acessível para criar e orquestrar agentes sem código. Interface visual, templates prontos e integrações nativas.',stars:'★★★★★',aff:true},
  {ico:'🔗',name:'n8n + AI',desc:'Combine automação visual com LLMs. Ideal para agentes que precisam integrar APIs, bancos de dados e sistemas externos.',stars:'★★★★★',aff:true},
  {ico:'⚙️',name:'LangSmith',desc:'Monitoramento e debug de aplicações com LLM. Essencial para qualquer agente em produção que você precisar debugar.',stars:'★★★★☆',aff:false},
  {ico:'🧠',name:'LlamaIndex',desc:'Framework para RAG e agentes com acesso a dados. Melhor opção quando seu agente precisa de contexto de documentos.',stars:'★★★★☆',aff:true},
];

/* ── COMPONENTS ─────────────────────────────── */

function SH({num, label, more, moreHref}){
  return (
    <div className="sh">
      <span className="sh-num">{num}</span>
      <div className="sh-rule"/>
      <span className="sh-label">{label}</span>
      {more && <><div className="sh-rule" style={{flex:'0 0 20px'}}/><a href={moreHref || "/arquivo"} className="sh-more">{more} -&gt;</a></>}
    </div>
  );
}


function Breadcrumb(){
  return (
    <div className="breadcrumb">
      <div className="wrap">
        <div className="breadcrumb-inner">
          <a href="/" className="breadcrumb-home">Home</a>
          <span className="breadcrumb-sep">›</span>
          <span className="breadcrumb-current">Agentes de IA</span>
        </div>
      </div>
    </div>
  );
}

function CategoryHero(){
  return (
    <section className="cat-hero">
      <div className="cat-hero-bg"/>
      <div className="cat-hero-glow"/>
      <div className="cat-hero-inner wrap">
        <div>
          <div className="cat-hero-label">
            <div className="cat-hero-label-rule"/>
            <span className="cat-hero-label-text">Categoria</span>
          </div>
          <h1 className="cat-hero-title">
            Agentes<br/>de <em>IA</em>
          </h1>
          <p className="cat-hero-desc">
            Frameworks, arquiteturas, casos de uso e tutoriais práticos para quem quer construir agentes de IA que funcionam de verdade — em produção, não só em demo.
          </p>
          <div className="cat-hero-tags">
            {TAGS.map(t=>(
              <span key={t} className="pill c">{t}</span>
            ))}
          </div>
        </div>
        <div className="cat-hero-meta">
          <div className="cat-hero-stat-block">
            {[
              {n:'87',em:'',l:'Artigos publicados'},
              {n:'24',em:'',l:'Guias e tutoriais'},
              {n:'6',em:'',l:'Ferramentas avaliadas'},
              {n:'abr',em:' 2026',l:'Última atualização'},
            ].map((s,i)=>(
              <div className="cat-hero-stat-row" key={i}>
                <div className="cat-hero-stat-n">{s.n}<em>{s.em}</em></div>
                <div className="cat-hero-stat-l">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="cat-hero-bar wrap">
        {['Todos os artigos','Guias','Comparativos','Ferramentas','Mais recentes'].map((l,i)=>(
          <div key={l} className={`cat-hero-bar-item ${i===0?'active':''}`}>
            <div className="cat-hero-bar-dot"/>
            <span>{l}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function FeaturedArticle(){
  return (
    <section className="feature">
      <div className="wrap">
        <SH num="01" label="Artigo em destaque"/>
        <div className="feature-grid">
          <div>
            <a className="feature-img" href={FEATURE_ART.href}>
              <img src={FEATURE_ART.image} alt={FEATURE_ART.title} loading="lazy"/>
            </a>
            <div className="feature-tags">
              {FEATURE_ART.tags.map((t,i)=><span key={i} className={`pill ${t.v}`}>{t.l}</span>)}
            </div>
            <h2 className="feature-title">{FEATURE_ART.title}</h2>
            <p className="feature-excerpt">{FEATURE_ART.excerpt}</p>
            <div className="feature-meta">
              <span>{FEATURE_ART.author}</span>
              <span className="feature-meta-sep">—</span>
              <span>{FEATURE_ART.date}</span>
              <span className="feature-meta-sep">—</span>
              <span>{FEATURE_ART.readTime} de leitura</span>
            </div>
            <a href={FEATURE_ART.href} className="arrow-link">Ler artigo completo -&gt;</a>
          </div>
          <div>
            <div className="aside-title">Também em destaque</div>
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

function RecentArticles(){
  return (
    <section className="recent">
      <div className="wrap">
        <SH num="02" label="Artigos recentes" more="Ver todos"/>
        <div className="article-grid">
          {ARTS.map((a,i)=>(
            <a className="art-card" href={a.href} key={i}>
              <div className="art-card-img">
                <img src={a.image} alt={a.title} loading="lazy"/>
              </div>
              <div className="art-card-body">
                <span className={`pill ${a.v}`}>{a.tag}</span>
                <div className="art-card-title">{a.title}</div>
                <div className="art-card-excerpt">{a.excerpt}</div>
                <div className="art-card-meta">
                  <span>{a.date}</span>
                  <div className="art-card-meta-dot"/>
                  <span>{a.rt} de leitura</span>
                </div>
              </div>
            </a>
          ))}
        </div>
        <div className="art-list">
          {ART_LIST.map((a,i)=>(
            <a className="art-list-item" href={a.href} key={i}>
              <div className="art-list-num">{a.num}</div>
              <div>
                <span className={`pill ${a.v}`} style={{marginBottom:8,display:'inline-block'}}>{a.tag}</span>
                <div className="art-list-title">{a.title}</div>
              </div>
              <div className="art-list-meta">{a.date} · {a.rt}</div>
            </a>
          ))}
        </div>
        <div style={{marginTop:36,display:'flex',justifyContent:'center'}}><a href="/arquivo" className="btn btn-stroke">Ver todos os artigos</a>
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
        <div className="guides-layout">
          <div>
            {GUIDES.map((g,i)=>(
              <a className="guide-row" href={g.href} key={i}>
                <div className="guide-n">0{i+1}</div>
                <div>
                  <div className="guide-tag-row"><span className={`pill ${g.v}`}>{g.tag}</span></div>
                  <div className="guide-title">{g.title}</div>
                  <div className="guide-desc">{g.desc}</div>
                </div>
              </a>
            ))}
          </div>
          <div className="rank-card">
            <div className="rank-head">
              <span className="rank-head-title">Frameworks 2026</span>
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

function ToolsSection(){
  return (
    <section className="tools">
      <div className="wrap">
        <SH num="04" label="Ferramentas para Agentes de IA" more="Ver todas" moreHref="/ferramentas"/>
        <div style={{marginBottom:28,marginTop:-16}}>
          <p style={{fontSize:13,color:'var(--text-3)'}}>
            Ferramentas testadas e recomendadas para criar e escalar agentes de IA.
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
                {t.aff && <span className="tool-aff-badge">Afiliado</span>}
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

function NewsletterStrip(){
  const [email,setEmail]=React.useState('');
  const [done,setDone]=React.useState(false);
  return (
    <section className="nl-strip">
      <div className="wrap">
        <div className="nl-strip-inner">
          <div className="nl-strip-left">
            <div className="nl-strip-eyebrow">Newsletter semanal</div>
            <div className="nl-strip-title">Novidades sobre agentes<br/><em>direto na sua caixa.</em></div>
            <div className="nl-strip-sub">Sem hype. Só o que funciona de verdade.</div>
          </div>
          {done ? (
            <div style={{textAlign:'center',padding:'16px 32px',border:'1px solid var(--line-s)',borderRadius:12,background:'var(--bg-2)'}}>
              <div style={{fontFamily:'var(--serif)',fontSize:28,color:'var(--amber)',marginBottom:4}}>✓</div>
              <div style={{fontFamily:'var(--serif)',fontSize:16,fontWeight:600}}>Confirmado!</div>
              <div style={{fontSize:13,color:'var(--text-2)',marginTop:4}}>Verifique seu e-mail.</div>
            </div>
          ):(
            <form style={{display:'flex',flexDirection:'column',gap:8}} onSubmit={e=>{e.preventDefault();if(email)setDone(true)}}>
              <div style={{display:'flex',gap:10}}>
                <input className="nl-strip-input" type="email" placeholder="seu@email.com" value={email} onChange={e=>setEmail(e.target.value)} required/>
                <button type="submit" className="btn btn-fill" style={{whiteSpace:'nowrap'}}>Quero receber →</button>
              </div>
              <div className="nl-strip-note">Briefing editorial · LGPD · Cancele quando quiser</div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}


/* ── APP ────────────────────────────────────── */
function App(){
  return (
    <>
      <Breadcrumb/>
      <CategoryHero/>
      <FeaturedArticle/>
      <RecentArticles/>
      <GuidesSection/>
      <ToolsSection/>
      <NewsletterStrip/>
      </>
  );
}




export default App;
