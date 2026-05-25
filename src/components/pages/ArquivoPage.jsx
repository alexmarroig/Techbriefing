import React from 'react';

/* ── ARTICLE COVER SVG GENERATOR ── */
const PATTERNS = [
  // Neural network / nodes
  (seed) => {
    const nodes = Array.from({length:8},(_,i)=>({
      x: 30 + ((i*47+seed*13)%240),
      y: 20 + ((i*31+seed*7)%120),
      r: 3 + (i%3)*2,
    }));
    return `<g opacity="0.6">${nodes.map((n,i)=>
      `<circle cx="${n.x}" cy="${n.y}" r="${n.r}" fill="none" stroke="oklch(0.80 0.14 62)" stroke-width="0.8"/>` +
      (i>0?`<line x1="${nodes[i-1].x}" y1="${nodes[i-1].y}" x2="${n.x}" y2="${n.y}" stroke="oklch(0.80 0.14 62/.3)" stroke-width="0.5"/>`:'')
    ).join('')}<circle cx="${nodes[2].x}" cy="${nodes[2].y}" r="${nodes[2].r}" fill="oklch(0.80 0.14 62/.4)"/></g>`;
  },
  // Circuit / grid
  (seed) => {
    const lines = Array.from({length:6},(_,i)=>{
      const y = 20 + i*25;
      const x1 = (seed*17+i*40)%100;
      const x2 = x1 + 80 + (i*20)%120;
      return `<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="oklch(0.55 0.15 230/.4)" stroke-width="0.8"/>
        <circle cx="${x1}" cy="${y}" r="2" fill="oklch(0.55 0.15 230/.5)"/>
        <circle cx="${x2}" cy="${y}" r="2" fill="oklch(0.55 0.15 230/.5)"/>`;
    });
    return `<g>${lines.join('')}</g>`;
  },
  // Data flow / arrows
  (seed) => {
    const paths = Array.from({length:4},(_,i)=>{
      const y = 30 + i*35;
      const offset = (seed*23+i*50)%60;
      return `<path d="M${offset},${y} C${offset+60},${y-15} ${offset+120},${y+15} ${offset+180},${y}" fill="none" stroke="oklch(0.75 0.12 160/.4)" stroke-width="0.8"/>
        <circle cx="${offset+180}" cy="${y}" r="3" fill="oklch(0.75 0.12 160/.3)"/>`;
    });
    return `<g>${paths.join('')}</g>`;
  },
  // Hexagonal
  (seed) => {
    const hexes = Array.from({length:5},(_,i)=>{
      const cx = 50 + ((i*70+seed*11)%200);
      const cy = 40 + ((i*45+seed*5)%80);
      const r = 15 + (i%3)*8;
      const pts = Array.from({length:6},(_,j)=>{
        const a = (Math.PI/3)*j - Math.PI/6;
        return `${cx+r*Math.cos(a)},${cy+r*Math.sin(a)}`;
      }).join(' ');
      return `<polygon points="${pts}" fill="none" stroke="oklch(0.80 0.14 62/.25)" stroke-width="0.7"/>`;
    });
    return `<g>${hexes.join('')}</g>`;
  },
];

function articleCoverSvg(index) {
  const pattern = PATTERNS[index % PATTERNS.length];
  const svgContent = pattern(index);
  return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 160" width="300" height="160"><rect width="300" height="160" fill="oklch(0.10 0.01 240)"/>${svgContent}</svg>`)}`;
}

/* ── DATA ── */
const ARTICLES = [
  {cat:'Agentes de IA',cv:'c',title:'AutoGPT, CrewAI ou LangGraph? Guia definitivo para escolher o framework certo em 2026',excerpt:'Testamos os três frameworks em cenários reais e comparamos performance, custo e complexidade para que você tome a decisão certa.',date:'28 abr 2026',rt:'14 min',href:'/artigos/autogpt-crewai-langgraph/'},
  {cat:'Automação',cv:'a',title:'Como montar um sistema de automação com agentes de IA sem escrever uma linha de código',excerpt:'O novo paradigma de automação está aqui — e ele não exige programação. Descubra como combinar n8n, Make e LLMs em fluxos que trabalham por você.',date:'25 abr 2026',rt:'11 min',href:'/agentes'},
  {cat:'Comparativo',cv:'',title:'n8n vs Make: qual ferramenta de automação escolher em 2026?',excerpt:'Testamos as duas em cinco cenários reais. Este é o comparativo honesto que você precisava antes de escolher.',date:'22 abr 2026',rt:'12 min',href:'/comparativos/n8n-vs-make/'},
  {cat:'IA Prática',cv:'a',title:'Construindo um agente de pesquisa com n8n e Claude 3.7 Sonnet',excerpt:'Passo a passo completo para criar um agente que pesquisa, sintetiza e entrega resultados sem intervenção manual.',date:'20 abr 2026',rt:'10 min',href:'/agentes'},
  {cat:'Agentes de IA',cv:'c',title:'Multi-agente vs. agente único: quando cada arquitetura faz sentido',excerpt:'Nem sempre mais agentes é melhor. Aprenda quando simplificar é a decisão mais inteligente.',date:'17 abr 2026',rt:'8 min',href:'/agentes'},
  {cat:'Software',cv:'',title:'As 7 ferramentas de produtividade que os profissionais de IA usam e você nunca ouviu falar',excerpt:'Da captura de contexto ao gerenciamento de prompts — curadoria das ferramentas que mudam o fluxo de trabalho.',date:'14 abr 2026',rt:'7 min',href:'/ferramentas'},
  {cat:'Automação',cv:'a',title:'Integre CRM, e-mail e Notion num único fluxo automatizado — guia completo',excerpt:'Do zero ao sistema rodando: como conectar suas ferramentas de vendas, comunicação e gestão sem código.',date:'11 abr 2026',rt:'9 min',href:'/comparativos/n8n-vs-make/'},
  {cat:'IA Prática',cv:'a',title:'RAG com agentes: quando recuperar contexto muda tudo',excerpt:'Como combinar busca semântica e LLMs para criar agentes que realmente entendem os seus dados.',date:'8 abr 2026',rt:'11 min',href:'/agentes'},
  {cat:'Agentes de IA',cv:'c',title:'Memory e contexto em agentes de longa duração',excerpt:'Os desafios reais de manter contexto entre sessões e como os frameworks modernos resolvem esse problema.',date:'5 abr 2026',rt:'9 min',href:'/agentes'},
  {cat:'Comparativo',cv:'',title:'Relevance AI vs Voiceflow: qual plataforma para criar agentes no-code?',excerpt:'Testamos as duas com o mesmo caso de uso. Veja qual vai mais longe para o seu perfil.',date:'2 abr 2026',rt:'10 min',href:'/comparativos/n8n-vs-make/'},
];

const CATS = ['Todos','Agentes de IA','Automação','IA Prática','Comparativo','Software'];

/* ── ANIMATED BACKGROUND ── */
function FloatingParticles() {
  return (
    <div className="arch-particles" aria-hidden="true">
      {Array.from({length:20},(_,i)=>(
        <div
          key={i}
          className="arch-particle"
          style={{
            left: `${(i*13+7)%100}%`,
            top: `${(i*17+3)%100}%`,
            animationDelay: `${(i*0.7)%5}s`,
            animationDuration: `${4 + (i%4)*2}s`,
            width: `${2 + (i%3)*2}px`,
            height: `${2 + (i%3)*2}px`,
            opacity: 0.15 + (i%5)*0.05,
          }}
        />
      ))}
    </div>
  );
}

/* ── SIDEBAR ── */
function Sidebar(){
  const [email,setEmail]=React.useState('');
  const [done,setDone]=React.useState(false);
  return(
    <div className="arch-sidebar">
      <div className="sidebar-card">
        <div className="sidebar-card-head">Categorias</div>
        <div className="sidebar-card-body">
          {[['Agentes de IA','20+','/agentes'],['IA Prática','15+','/arquivo'],['Automação','15+','/arquivo'],['Comparativos','10+','/comparativos/n8n-vs-make/'],['Software','10+','/ferramentas']].map(([n,c,h],i)=>(
            <a href={h} className="sidebar-cat-row" key={i}>
              <span className="sidebar-cat-name">{n}</span>
              <span className="sidebar-cat-count">{c} artigos</span>
            </a>
          ))}
        </div>
      </div>
      <div className="nl-mini">
        <div className="nl-mini-label">Newsletter semanal</div>
        <div className="nl-mini-title">IA aplicada toda semana.</div>
        <div className="nl-mini-sub">Guias, ferramentas e análises. Sem hype, toda quinta.</div>
        {done?(
          <div style={{textAlign:'center',padding:'10px 0',fontFamily:'var(--serif)',fontSize:18,color:'var(--amber)'}}>✓ Confirmado!</div>
        ):(
          <form onSubmit={e=>{e.preventDefault();if(email)setDone(true)}}>
            <input className="nl-mini-input" type="email" placeholder="seu@email.com" value={email} onChange={e=>setEmail(e.target.value)} required/>
            <button type="submit" className="btn btn-fill" style={{width:'100%',justifyContent:'center',fontSize:13,borderRadius:8,padding:'10px'}}>Quero receber →</button>
          </form>
        )}
      </div>
      <div style={{background:'var(--bg-2)',border:'1px solid oklch(0.80 0.14 62/.2)',borderRadius:12,padding:20}}>
        <div style={{fontFamily:'var(--mono)',fontSize:10,fontWeight:500,letterSpacing:'.1em',textTransform:'uppercase',color:'var(--amber)',marginBottom:10}}>Ebook em destaque</div>
        <div style={{fontFamily:'var(--serif)',fontSize:17,fontWeight:700,letterSpacing:'-.01em',lineHeight:1.3,marginBottom:8}}>Agentes de IA para Negócios</div>
        <div style={{fontSize:13,color:'var(--text-2)',lineHeight:1.6,marginBottom:14}}>126 páginas de implementação prática. R$ 37,00.</div>
        <a href="/ebook-agentes-ia" className="btn btn-fill" style={{fontSize:12,padding:'9px 14px',justifyContent:'center',width:'100%',borderRadius:8}}>Ver ebook →</a>
      </div>
    </div>
  );
}


/* ── MAIN APP ── */
function App({ articles = [] }){
  if (articles.length) {
    ARTICLES.splice(0, ARTICLES.length, ...articles.map((a, i)=>({
      cat: a.category || 'Comparativo',
      cv: a.category === 'Comparativo' ? '' : a.category?.includes('Agentes') ? 'c' : 'a',
      title: a.title || 'Untitled',
      excerpt: a.description || '',
      date: a.date ? new Date(a.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }) : '',
      rt: a.readTime,
      href: a.href,
      image: a.image,
    })));
  }
  const [query,setQuery]=React.useState('');
  const [cat,setCat]=React.useState('Todos');
  const [hovered,setHovered]=React.useState(null);
  const filtered=ARTICLES.filter(a=>{
    const matchCat=cat==='Todos'||a.cat===cat;
    const matchQ=!query||a.title?.toLowerCase().includes(query.toLowerCase())||a.excerpt?.toLowerCase().includes(query.toLowerCase());
    return matchCat&&matchQ;
  });

  // Featured = first article
  const featured = filtered.length > 0 ? filtered[0] : null;
  const rest = filtered.slice(1);

  return(
    <>
      <div className="bc"><div className="wrap"><div className="bc-inner">
        <a href="/" className="bc-a">Home</a>
        <span className="bc-sep">›</span>
        <span className="bc-cur">Artigos</span>
      </div></div></div>
      <section className="arch-hero">
        <div className="arch-hero-bg"/>
        <FloatingParticles/>
        <div className="wrap"><div className="arch-hero-inner">
          <div>
            <div className="arch-eyebrow"><div className="arch-eyebrow-rule"/>Biblioteca de conteúdo</div>
            <h1 className="arch-title">Todos os<br/><em>artigos.</em></h1>
            <p className="arch-sub">Guias, tutoriais, comparativos e análises sobre IA, automação e tecnologia aplicada.</p>
          </div>
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input className="search-input" type="text" placeholder="Buscar artigos..." value={query} onChange={e=>setQuery(e.target.value)}/>
          </div>
        </div></div>
      </section>
      <div className="filters-bar">
        <div className="wrap"><div className="filters-inner">
          {CATS.map(c=>(
            <button key={c} className={`filter-btn ${cat===c?'active':''}`} onClick={()=>setCat(c)}>{c}</button>
          ))}
        </div></div>
      </div>
      <div className="wrap">
        {/* Featured article card */}
        {featured && (
          <a href={featured.href} className="art-featured" onMouseEnter={()=>setHovered('feat')} onMouseLeave={()=>setHovered(null)}>
            <div className="art-featured-img">
              <img src={featured.image || articleCoverSvg(0)} alt={featured.title} loading="lazy"/>
              <div className={`art-featured-pulse ${hovered==='feat'?'active':''}`}/>
            </div>
            <div className="art-featured-content">
              <div className="art-row-tag"><span className={`pill ${featured.cv}`}>{featured.cat}</span></div>
              <div className="art-featured-title">{featured.title}</div>
              <div className="art-featured-excerpt">{featured.excerpt}</div>
              <div className="art-row-meta">
                <span>{featured.date}</span>
                <span>·</span>
                <span>{featured.rt} de leitura</span>
              </div>
            </div>
          </a>
        )}

        <div className="arch-layout">
          <div className="art-grid">
            {rest.length===0 && filtered.length===0 ?(
              <div style={{padding:'60px 0',textAlign:'center',color:'var(--text-3)',fontFamily:'var(--mono)',fontSize:13,letterSpacing:'.04em',gridColumn:'1/-1'}}>
                Nenhum artigo encontrado para "{query}".
              </div>
            ):rest.map((a,i)=>(
              <a
                href={a.href}
                className="art-card"
                key={i}
                onMouseEnter={()=>setHovered(i)}
                onMouseLeave={()=>setHovered(null)}
              >
                <div className="art-card-img">
                  <img src={a.image || articleCoverSvg(i+1)} alt={a.title} loading="lazy"/>
                  <div className={`art-card-glow ${hovered===i?'active':''}`}/>
                </div>
                <div className="art-card-body">
                  <div className="art-row-tag"><span className={`pill ${a.cv}`}>{a.cat}</span></div>
                  <div className="art-card-title">{a.title}</div>
                  <div className="art-card-excerpt">{a.excerpt}</div>
                  <div className="art-row-meta">
                    <span>{a.date}</span>
                    <span>·</span>
                    <span>{a.rt} de leitura</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
          <Sidebar/>
        </div>
      </div>
    </>
  );
}

export default App;
