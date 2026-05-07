import React from 'react';




const ARTICLES = [
  {num:'01',cat:'Agentes de IA',cv:'c',title:'AutoGPT, CrewAI ou LangGraph? Guia definitivo para escolher o framework certo em 2026',excerpt:'Testamos os três frameworks em cenários reais e comparamos performance, custo e complexidade para que você tome a decisão certa.',date:'28 abr 2026',rt:'14 min',href:'/artigos/autogpt-crewai-langgraph'},
  {num:'02',cat:'Automação',cv:'a',title:'Como montar um sistema de automação com agentes de IA sem escrever uma linha de código',excerpt:'O novo paradigma de automação está aqui — e ele não exige programação. Descubra como combinar n8n, Make e LLMs em fluxos que trabalham por você.',date:'25 abr 2026',rt:'11 min',href:'/agentes-de-ia'},
  {num:'03',cat:'Comparativo',cv:'',title:'n8n vs Make: qual ferramenta de automação escolher em 2026?',excerpt:'Testamos as duas em cinco cenários reais. Este é o comparativo honesto que você precisava antes de escolher.',date:'22 abr 2026',rt:'12 min',href:'/comparativos/n8n-vs-make'},
  {num:'04',cat:'IA Prática',cv:'a',title:'Construindo um agente de pesquisa com n8n e Claude 3.7 Sonnet',excerpt:'Passo a passo completo para criar um agente que pesquisa, sintetiza e entrega resultados sem intervenção manual.',date:'20 abr 2026',rt:'10 min',href:'/agentes-de-ia'},
  {num:'05',cat:'Agentes de IA',cv:'c',title:'Multi-agente vs. agente único: quando cada arquitetura faz sentido',excerpt:'Nem sempre mais agentes é melhor. Aprenda quando simplificar é a decisão mais inteligente.',date:'17 abr 2026',rt:'8 min',href:'/agentes-de-ia'},
  {num:'06',cat:'Software',cv:'',title:'As 7 ferramentas de produtividade que os profissionais de IA usam e você nunca ouviu falar',excerpt:'Da captura de contexto ao gerenciamento de prompts — curadoria das ferramentas que mudam o fluxo de trabalho.',date:'14 abr 2026',rt:'7 min',href:'/ferramentas'},
  {num:'07',cat:'Automação',cv:'a',title:'Integre CRM, e-mail e Notion num único fluxo automatizado — guia completo',excerpt:'Do zero ao sistema rodando: como conectar suas ferramentas de vendas, comunicação e gestão sem código.',date:'11 abr 2026',rt:'9 min',href:'/comparativos/n8n-vs-make'},
  {num:'08',cat:'IA Prática',cv:'a',title:'RAG com agentes: quando recuperar contexto muda tudo',excerpt:'Como combinar busca semântica e LLMs para criar agentes que realmente entendem os seus dados.',date:'8 abr 2026',rt:'11 min',href:'/agentes-de-ia'},
  {num:'09',cat:'Agentes de IA',cv:'c',title:'Memory e contexto em agentes de longa duração',excerpt:'Os desafios reais de manter contexto entre sessões e como os frameworks modernos resolvem esse problema.',date:'5 abr 2026',rt:'9 min',href:'/agentes-de-ia'},
  {num:'10',cat:'Comparativo',cv:'',title:'Relevance AI vs Voiceflow: qual plataforma para criar agentes no-code?',excerpt:'Testamos as duas com o mesmo caso de uso. Veja qual vai mais longe para o seu perfil.',date:'2 abr 2026',rt:'10 min',href:'/comparativos/n8n-vs-make'},
];

const CATS = ['Todos','Agentes de IA','Automação','IA Prática','Comparativo','Software'];


function Sidebar(){
  const [email,setEmail]=React.useState('');
  const [done,setDone]=React.useState(false);
  return(
    <div className="arch-sidebar">
      <div className="sidebar-card">
        <div className="sidebar-card-head">Categorias</div>
        <div className="sidebar-card-body">
          {[['Agentes de IA','87','/agentes-de-ia'],['IA Prática','124','/arquivo'],['Automação','96','/arquivo'],['Comparativos','32','/comparativos/n8n-vs-make'],['Software','203','/ferramentas']].map(([n,c,h],i)=>(
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
        <div style={{fontSize:13,color:'var(--text-2)',lineHeight:1.6,marginBottom:14}}>180 páginas de implementação prática. R$ 47.</div>
        <a href="/ebooks" className="btn btn-fill" style={{fontSize:12,padding:'9px 14px',justifyContent:'center',width:'100%',borderRadius:8}}>Ver ebook →</a>
      </div>
    </div>
  );
}


function App({ articles = [] }){
  if (articles.length) {
    ARTICLES.splice(0, ARTICLES.length, ...articles.map((a, i)=>({
      num: String(i + 1).padStart(2, '0'),
      cat: a.category,
      cv: a.category === 'Comparativo' ? '' : a.category.includes('Agentes') ? 'c' : 'a',
      title: a.title,
      excerpt: a.description,
      date: new Date(a.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }),
      rt: a.readTime,
      href: a.href,
    })));
  }
  const [query,setQuery]=React.useState('');
  const [cat,setCat]=React.useState('Todos');
  const filtered=ARTICLES.filter(a=>{
    const matchCat=cat==='Todos'||a.cat===cat;
    const matchQ=!query||a.title.toLowerCase().includes(query.toLowerCase())||a.excerpt.toLowerCase().includes(query.toLowerCase());
    return matchCat&&matchQ;
  });
  return(
    <>
      <div className="bc"><div className="wrap"><div className="bc-inner">
        <a href="/" className="bc-a">Home</a>
        <span className="bc-sep">›</span>
        <span className="bc-cur">Arquivo</span>
      </div></div></div>
      <section className="arch-hero">
        <div className="arch-hero-bg"/>
        <div className="wrap"><div className="arch-hero-inner">
          <div>
            <div className="arch-eyebrow"><div className="arch-eyebrow-rule"/>Biblioteca de conteúdo</div>
            <h1 className="arch-title">Todos os<br/><em>artigos.</em></h1>
            <p className="arch-sub">Guias, tutoriais, comparativos e análises sobre IA, automação e tecnologia aplicada. Atualizados semanalmente.</p>
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
        <div className="arch-layout">
          <div className="art-list">
            {filtered.length===0?(
              <div style={{padding:'60px 0',textAlign:'center',color:'var(--text-3)',fontFamily:'var(--mono)',fontSize:13,letterSpacing:'.04em'}}>
                Nenhum artigo encontrado para "{query}".
              </div>
            ):filtered.map((a,i)=>(
              <a href={a.href} className="art-row" key={i}>
                <div className="art-row-num">{a.num}</div>
                <div>
                  <div className="art-row-tag"><span className={`pill ${a.cv}`}>{a.cat}</span></div>
                  <div className="art-row-title">{a.title}</div>
                  <div className="art-row-excerpt">{a.excerpt}</div>
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
