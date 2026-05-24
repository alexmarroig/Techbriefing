import React from 'react';
import { db } from '../../lib/firebase';
import { collection, doc, getDocs, updateDoc, increment, setDoc, getDoc } from 'firebase/firestore';
const CATEGORIES = [
  {
    id:'automacao',
    num:'01',
    name:'Automação',
    tools:[
      {
        ico:'⚡',
        name:'n8n',
        desc:'Automação visual self-hosted. O mais poderoso para fluxos complexos — grátis se hospedar você mesmo.',
        stars:'★★★★★',
        aff:true
      },
      {
        ico:'🔗',
        name:'Make',
        desc:'Automação no-code intuitiva. Melhor custo-benefício para times pequenos e casos de uso variados.',
        stars:'★★★★★',
        aff:true
      },
    ]
  },
  {
    id:'ia',
    num:'02',
    name:'IA & LLMs',
    tools:[
      {
        ico:'🤖',
        name:'OpenAI',
        desc:'GPT-4o e API central do ecossistema IA. Essencial para qualquer projeto com modelos de linguagem.',
        stars:'★★★★★',
        aff:false
      },
      {
        ico:'🧠',
        name:'Claude (Anthropic)',
        desc:'Melhor modelo para raciocínio, escrita e código. Ideal para contextos longos e análise crítica.',
        stars:'★★★★★',
        aff:false
      },
      {
        ico:'🔍',
        name:'Perplexity',
        desc:'Pesquisa com IA em tempo real. Substitui o Google para buscas profissionais com fontes rastreáveis.',
        stars:'★★★★☆',
        aff:true
      },
    ]
  },
  {
    id:'produtividade',
    num:'03',
    name:'Produtividade',
    tools:[
      {
        ico:'📝',
        name:'Notion',
        desc:'Hub de trabalho, docs e projetos. Com IA nativa integrada, é o sistema operacional do trabalho moderno.',
        stars:'★★★★☆',
        aff:true
      },
      {
        ico:'💻',
        name:'Cursor',
        desc:'O editor de código mais avançado com IA. Essencial para desenvolvedores e quem quer aprender a programar com IA.',
        stars:'★★★★★',
        aff:true
      },
    ]
  },
  {
    id:'sites',
    num:'04',
    name:'Sites & No-code',
    tools:[
      {
        ico:'🎨',
        name:'Framer',
        desc:'Sites profissionais com design de ponta. O melhor para portefólios, landing pages e sites de produto.',
        stars:'★★★★★',
        aff:true
      },
      {
        ico:'🌐',
        name:'Webflow',
        desc:'CMS visual e desenvolvimento front-end sem código. Mais robusto que Framer para sites de conteúdo.',
        stars:'★★★★☆',
        aff:true
      },
    ]
  },
  {
    id:'email',
    num:'05',
    name:'Email & Newsletter',
    tools:[
      {
        ico:'🐝',
        name:'Beehiiv',
        desc:'A plataforma de newsletter favorita dos criadores modernos. Monetização, analytics e crescimento integrados.',
        stars:'★★★★★',
        aff:true
      },
      {
        ico:'✉️',
        name:'ConvertKit',
        desc:'Email marketing focado em criadores. Automações, landing pages e segmentação avançada.',
        stars:'★★★★☆',
        aff:true
      },
    ]
  },
  {
    id:'seo',
    num:'06',
    name:'SEO & Analytics',
    tools:[
      {ico:'📊',name:'Semrush',desc:'Suite completa de SEO, pesquisa de palavras-chave e inteligência competitiva. Padrão da indústria.',stars:'★★★★★',aff:true,href:'https://www.semrush.com/'},
      {ico:'🔎',name:'Ahrefs',desc:'Análise de backlinks e research de conteúdo. Favorito de SEOs avançados para estratégia orgânica.',stars:'★★★★★',aff:true,href:'https://ahrefs.com/'},
    ]
  },
  {
    id:'criacao',
    num:'07',
    name:'Criação de Conteúdo',
    tools:[
      {ico:'🎙️',name:'Descript',desc:'Edição de áudio e vídeo baseada em texto. Transcreve automaticamente e edita como se fosse um doc.',stars:'★★★★★',aff:true,href:'https://www.descript.com/'},
      {ico:'🎬',name:'CapCut',desc:'Edição de vídeo com IA para mobile e desktop. Legendas automáticas, templates e efeitos em segundos.',stars:'★★★★☆',aff:false,href:'https://www.capcut.com/'},
      {ico:'🎭',name:'Canva',desc:'Design acessível para tudo. Com IA generativa, gera imagens, apresentações e posts em minutos.',stars:'★★★★☆',aff:true,href:'https://www.canva.com/'},
    ]
  },
  {
    id:'dev',
    num:'08',
    name:'Desenvolvimento',
    tools:[
      {ico:'🚂',name:'Railway',desc:'Deploy de apps e APIs em segundos. O Heroku moderno — sem fricção, com escala automática.',stars:'★★★★★',aff:true,href:'https://railway.app/'},
      {ico:'▲',name:'Vercel',desc:'Plataforma de deploy para front-end e full-stack. Padrão para apps Next.js e projetos Jamstack.',stars:'★★★★★',aff:false,href:'https://vercel.com/'},
      {ico:'⚡',name:'Supabase',desc:'Backend open source com banco de dados, auth e storage. Alternativa ao Firebase com mais controle.',stars:'★★★★★',aff:true,href:'https://supabase.com/'},
      {ico:'💡',name:'Replit',desc:'IDE na nuvem para prototipagem rápida. Ideal para testar ideias e projetos com IA sem setup.',stars:'★★★★☆',aff:true,href:'https://replit.com/'},
    ]
  },
  {
    id:'forms',
    num:'09',
    name:'Formulários',
    tools:[
      {ico:'📋',name:'Tally',desc:'Formulários bonitos e gratuitos. Interface limpa, integrações nativas e plano free generoso.',stars:'★★★★★',aff:true,href:'https://tally.so/'},
      {ico:'📐',name:'Typeform',desc:'Formulários conversacionais com alta taxa de resposta. Ideal para pesquisas e onboarding.',stars:'★★★★☆',aff:true,href:'https://www.typeform.com/'},
    ]
  },
];

function ToolCard({t, upvotes, onUpvote}){
  const toolId = t.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const count = upvotes[toolId] || 0;
  
  const handleVote = (e) => {
    e.preventDefault();
    onUpvote(toolId);
  };

  return(
    <a className="tool-card" href={t.href || '#'}>
      <div className="tool-card-head">
        <div style={{display:'flex',gap:12,alignItems:'center'}}>
          <div className="tool-ico">{t.ico}</div>
          <div className="tool-name">{t.name}</div>
        </div>
        {t.aff&&<span className="aff-badge">Afiliado</span>}
      </div>
      <div className="tool-desc">{t.desc}</div>
      <div className="tool-footer">
        <span className="tool-stars">{t.stars}</span>
        <div style={{display:'flex',gap:12,alignItems:'center'}}>
          <button className="tool-upvote" onClick={handleVote} style={{display:'inline-flex',alignItems:'center',gap:4,background:'var(--bg-3)',border:'1px solid var(--line-s)',color:'var(--text-2)',padding:'4px 8px',borderRadius:6,fontSize:12,fontWeight:600,cursor:'pointer'}}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 9.5V2.5M6 2.5L2.5 6M6 2.5L9.5 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            {count}
          </button>
          <span className="tool-try">
            Testar
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5h6M5 2l3 3-3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </span>
        </div>
      </div>
    </a>
  );
}

function NlStrip(){
  const [email,setEmail]=React.useState('');
  const [done,setDone]=React.useState(false);
  return(
    <div className="nl-strip"><div className="wrap"><div className="nl-strip-inner">
      <div>
        <div style={{fontFamily:'var(--mono)',fontSize:11,fontWeight:500,letterSpacing:'.1em',textTransform:'uppercase',color:'var(--amber)',marginBottom:10}}>Newsletter semanal</div>
        <div style={{fontFamily:'var(--serif)',fontSize:'clamp(22px,3vw,32px)',fontWeight:700,letterSpacing:'-.02em',lineHeight:1.1,marginBottom:8}}>Ferramentas novas<br/><em style={{fontStyle:'italic',color:'var(--amber)'}}>antes de todo mundo.</em></div>
        <div style={{fontSize:14,color:'var(--text-2)'}}>Reviews, comparativos e dicas toda semana.</div>
      </div>
      {done?(
        <div style={{textAlign:'center',padding:'16px 32px',border:'1px solid var(--line-s)',borderRadius:12,background:'var(--bg-3)'}}>
          <div style={{fontFamily:'var(--serif)',fontSize:28,color:'var(--amber)'}}>✓</div>
          <div style={{fontFamily:'var(--serif)',fontSize:16,fontWeight:600}}>Confirmado!</div>
        </div>
      ):(
        <form style={{display:'flex',flexDirection:'column',gap:8}} onSubmit={e=>{e.preventDefault();if(email)setDone(true)}}>
          <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
            <input className="nl-strip-input" type="email" placeholder="seu@email.com" value={email} onChange={e=>setEmail(e.target.value)} required/>
            <button type="submit" className="btn btn-fill">Quero receber →</button>
          </div>
          <div style={{fontFamily:'var(--mono)',fontSize:10.5,color:'var(--text-4)',letterSpacing:'.03em'}}>Recomendação editorial · LGPD · Cancele quando quiser</div>
        </form>
      )}
    </div></div></div>
  );
}

const urlMap = {"n8n":"https://n8n.io/","Make":"https://www.make.com/","OpenAI":"https://openai.com/","Claude (Anthropic)":"https://claude.ai/","Perplexity":"https://www.perplexity.ai/","Notion":"https://www.notion.so/","Cursor":"https://cursor.sh/","Framer":"https://www.framer.com/","Webflow":"https://webflow.com/","Beehiiv":"https://www.beehiiv.com/","ConvertKit":"https://convertkit.com/","Semrush":"https://www.semrush.com/","Ahrefs":"https://ahrefs.com/","Descript":"https://www.descript.com/","CapCut":"https://www.capcut.com/","Canva":"https://www.canva.com/","Railway":"https://railway.app/","Vercel":"https://vercel.com/","Supabase":"https://supabase.com/","Replit":"https://replit.com/","Tally":"https://tally.so/","Typeform":"https://www.typeform.com/"};
function App({ tools = [] }){
  if (tools.length) {
    const grouped = tools.reduce((acc, tool) => {
      const id = tool.categoryId || tool.category.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-');
      if (!acc[id]) acc[id] = { id, num: String(Object.keys(acc).length + 1).padStart(2, '0'), name: tool.category, tools: [] };
      acc[id].tools.push({
        ico: tool.icon,
        name: tool.name,
        desc: tool.description,
        stars: '★'.repeat(Math.round(tool.rating)) + '☆'.repeat(Math.max(0, 5 - Math.round(tool.rating))),
        aff: tool.affiliate,
      });
      return acc;
    }, {});
    CATEGORIES.splice(0, CATEGORIES.length, ...Object.values(grouped));
  }
  const [active,setActive]=React.useState('todos');
  const [upvotes, setUpvotes] = React.useState({});
  
  React.useEffect(() => {
    async function fetchUpvotes() {
      try {
        const querySnapshot = await getDocs(collection(db, "tool_upvotes"));
        const counts = {};
        querySnapshot.forEach((doc) => {
          counts[doc.id] = doc.data().count;
        });
        setUpvotes(counts);
      } catch(e) {
        console.error("Error fetching upvotes:", e);
      }
    }
    fetchUpvotes();
  }, []);

  const handleUpvote = async (toolId) => {
    setUpvotes(prev => ({ ...prev, [toolId]: (prev[toolId] || 0) + 1 }));
    try {
      const docRef = doc(db, "tool_upvotes", toolId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        await updateDoc(docRef, { count: increment(1) });
      } else {
        await setDoc(docRef, { count: 1 });
      }
    } catch(e) {
      console.error("Error updating upvote:", e);
    }
  };

  const shown = active==='todos' ? CATEGORIES : CATEGORIES.filter(c=>c.id===active);
  const total = CATEGORIES.reduce((s,c)=>s+c.tools.length,0);
  const affCount = CATEGORIES.reduce((s,c)=>s+c.tools.filter(t=>t.aff).length,0);
  return(
    <>
      <div className="bc"><div className="wrap"><div className="bc-inner">
        <a href="/" className="bc-a">Home</a>
        <span className="bc-sep">›</span>
        <span className="bc-cur">Ferramentas Recomendadas</span>
      </div></div></div>
      <section className="tools-hero">
        <div className="tools-hero-bg"/>
        <div className="wrap"><div className="tools-hero-inner">
          <div>
            <div className="tools-hero-eyebrow"><div className="tools-hero-rule"/><span className="tools-hero-eyebrow-text">Ferramentas recomendadas</span></div>
            <h1 className="tools-hero-title">Ferramentas que<br/><em>valem seu tempo.</em></h1>
            <p className="tools-hero-sub">Testadas e recomendadas pela equipe do Tech Briefing. Organizadas por categoria, com avaliações honestas e links diretos. Links de afiliado identificados — eles nos ajudam a manter o conteúdo gratuito.</p>
          </div>
          <div className="tools-hero-stats">
            {[{n:`${total}`,em:'',l:'Ferramentas testadas'},{n:String(CATEGORIES.length),em:'',l:'Categorias'},{n:String(affCount),em:'',l:'Links afiliados'}].map((s,i)=>(
              <div className="tools-hero-stat" key={i}>
                <div className="tools-hero-stat-n">{s.n}{s.em&&<em>{s.em}</em>}</div>
                <div className="tools-hero-stat-l">{s.l}</div>
              </div>
            ))}
          </div>
        </div></div>
      </section>
      <div className="disclosure"><div className="wrap"><div className="disclosure-inner">
        <span className="disclosure-badge">Aviso</span>
        Alguns links nesta página são de afiliado e identificados com a badge <strong style={{marginLeft:2,marginRight:2}}>AFILIADO</strong>. Clicando e comprando, você nos apoia sem pagar mais. Nossas avaliações são independentes.
      </div></div></div>
      <div className="filters">
        <div className="wrap"><div className="filters-inner">
          <button className={`filter-btn ${active==='todos'?'active':''}`} onClick={()=>setActive('todos')}>Todas ({total})</button>
          {CATEGORIES.map(c=>(
            <button key={c.id} className={`filter-btn ${active===c.id?'active':''}`} onClick={()=>setActive(c.id)}>
              {c.name} ({c.tools.length})
            </button>
          ))}
        </div></div>
      </div>
      <div style={{background:'var(--bg)',paddingBottom:0}}>
        <div className="wrap">
          {shown.map(c=>(
            <section className="cat-section" key={c.id} id={c.id}>
              <div className="cat-section-header">
                <span className="cat-section-num">{c.num}</span>
                <div className="cat-section-rule"/>
                <span className="cat-section-name">{c.name}</span>
                <div className="cat-section-rule" style={{flex:'0 0 20px'}}/>
                <span className="cat-section-count">{c.tools.length} ferramenta{c.tools.length>1?'s':''}</span>
              </div>
              <div className="tools-cat-grid">
                {c.tools.map((t,i)=><ToolCard key={i} t={t} upvotes={upvotes} onUpvote={handleUpvote} />)}
              </div>
            </section>
          ))}
          <div className="compare-strip" style={{marginBottom:80}}>
            <div className="compare-strip-text">
              <div className="compare-strip-label">Guia relacionado</div>
              <div className="compare-strip-title">AutoGPT, CrewAI ou LangGraph? Guia definitivo 2026</div>
              <div className="compare-strip-desc">Comparamos os 3 principais frameworks de agentes em cenários reais.</div>
            </div>
            <a href="/artigos/autogpt-crewai-langgraph/" className="btn btn-stroke" style={{whiteSpace:'nowrap'}}>Ler o comparativo →</a>
          </div>
        </div>
      </div>
      <NlStrip/>
      </>
  );
}

export default App;
