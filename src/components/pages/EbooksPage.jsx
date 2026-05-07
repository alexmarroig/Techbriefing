import React from 'react';




const EBOOKS = [
  {
    id:'agentes',
    color:'var(--amber)',colorX:'var(--amber-x)',colorD:'var(--amber-d)',pill:'a',
    eyebrow:'Estratégia & Operação',
    title:'Agentes de IA para Negócios',
    subtitle:'Do chat à execução operacional',
    desc:'Como identificar onde agentes de IA podem trabalhar por você — com frameworks claros, casos reais e um roteiro prático para sair da teoria e chegar à aplicação.',
    pages:'180',format:'PDF + EPUB',updated:'Abril 2026',
    price:'R$ 47',priceOld:'R$ 67',
    benefits:['Mapeie processos onde agentes reduzem trabalho manual','Estruture seus primeiros fluxos sem precisar programar','Frameworks e templates prontos para implementar','Cases reais por setor: vendas, suporte, conteúdo, ops'],
    toc:['O que são agentes de IA e por que agora','Mapeando seu negócio para agentes','Os 5 tipos de agente mais úteis','Ferramentas por nível técnico','Do piloto ao processo em produção','Cases por setor e função','O próximo passo da automação inteligente'],
  },
  {
    id:'sociedade',
    color:'var(--cyan)',colorX:'var(--cyan-x)',colorD:'oklch(0.52 0.10 200)',pill:'c',
    eyebrow:'Reflexão & Posicionamento',
    title:'A Sociedade Pós-IA',
    subtitle:'Trabalho, relações e futuro',
    desc:'Os impactos reais da IA em trabalho, ansiedade, regulação, relações humanas e escolhas sociais — uma análise honesta e profunda para quem quer entender o que está realmente mudando.',
    pages:'140',format:'PDF + EPUB',updated:'Março 2026',
    price:'R$ 29',priceOld:'R$ 49',
    benefits:['Entenda o que está mudando de verdade no mercado de trabalho','Posicione-se diante das transformações sem paralisia','Análise honesta de riscos, oportunidades e escolhas','O que líderes, trabalhadores e cidadãos precisam saber'],
    toc:['A virada que já aconteceu','Trabalho no mundo dos agentes','Ansiedade, confiança e adaptação','Regulação: quem vai decidir?','Relações humanas na era dos assistentes','O que fica para os humanos','Escolhas individuais e coletivas'],
  },
];

const RELATED = [
  {tag:'IA Prática',v:'a',title:'Como montar um sistema de automação com agentes de IA sem código',date:'28 abr',rt:'11 min'},
  {tag:'Agentes',v:'c',title:'AutoGPT, CrewAI ou LangGraph? Guia definitivo para 2026',date:'28 abr',rt:'14 min'},
  {tag:'Análise',v:'',title:'O que a IA está mudando no mercado de trabalho agora',date:'21 abr',rt:'8 min'},
];


function EbookCard({e}){
  const [tocOpen,setTocOpen]=React.useState(false);
  return(
    <div className="ebook-card">
      <div className="ebook-cover" style={{background:`oklch(from ${e.color} l c h / 0.10)`}}>
        <div className="ebook-cover-bg" style={{background:`radial-gradient(ellipse at 50% 50%, ${e.color}, transparent 70%)`}}/>
        <div className="ebook-cover-content">
          <div className="ebook-cover-mark" style={{color:e.color}}>IA</div>
          <div className="ebook-cover-line" style={{background:e.color}}/>
          <div style={{fontFamily:'var(--serif)',fontSize:15,fontWeight:600,color:'var(--text)',textAlign:'center',lineHeight:1.3,letterSpacing:'-.01em',maxWidth:140}}>{e.title}</div>
          <div className="ebook-cover-pub">Nexora<br/>Systems</div>
          <div className="ebook-cover-pages">{e.pages} páginas</div>
        </div>
      </div>
      <div className="ebook-body">
        <div className="ebook-subtitle">{e.eyebrow}</div>
        <h2 className="ebook-title">{e.title}</h2>
        <p className="ebook-desc">{e.desc}</p>
        <div className="ebook-benefits">
          {e.benefits.map((b,i)=>(
            <div className="ebook-benefit" key={i}>
              <span style={{color:e.color,flexShrink:0,fontSize:12,paddingTop:3}}>✓</span>
              {b}
            </div>
          ))}
        </div>
        <div className="ebook-toc">
          <div className="ebook-toc-label" style={{display:'flex',alignItems:'center',justifyContent:'space-between',cursor:'pointer'}} onClick={()=>setTocOpen(o=>!o)}>
            <span>Conteúdo do livro</span>
            <span style={{fontFamily:'var(--mono)',fontSize:14,transition:'transform .2s',display:'inline-block',transform:tocOpen?'rotate(45deg)':'none'}}>+</span>
          </div>
          {tocOpen&&(
            <div className="ebook-toc-list" style={{marginTop:12}}>
              {e.toc.map((t,i)=>(
                <div className="ebook-toc-item" key={i}>
                  <span className="ebook-toc-num">0{i+1}</span>
                  <span>{t}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="ebook-footer">
          <div>
            <div className="ebook-price-block">
              <span className="ebook-price" style={{color:e.color}}>{e.price}</span>
              <span className="ebook-price-old">{e.priceOld}</span>
            </div>
            <div className="ebook-specs">
              {[`${e.pages} páginas`,e.format,`Atualizado: ${e.updated}`].map((s,i)=>(
                <div className="ebook-spec" key={i}><span style={{color:e.color}}>·</span>{s}</div>
              ))}
            </div>
          </div>
          <div className="ebook-cta-group">
            <button className="btn btn-fill" style={{fontSize:14,padding:'12px 28px'}}>Comprar agora →</button>
            <button className="btn btn-stroke" style={{fontSize:13}}>Ver prévia</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TrustStrip(){
  return(
    <div className="trust-strip">
      <div className="wrap">
        <div className="trust-strip-inner">
          {[
            {ico:'📄',label:'PDF + EPUB inclusos',sub:'Leia em qualquer dispositivo'},
            {ico:'⚡',label:'Acesso imediato',sub:'Entregue por email instantaneamente'},
            {ico:'🔒',label:'Pagamento seguro',sub:'Stripe — criptografia SSL'},
            {ico:'🔄',label:'Atualizado em 2026',sub:'Conteúdo revisado e atual'},
            {ico:'🌐',label:'Nexora Systems',sub:'Produto desenvolvido no Brasil'},
          ].map((t,i)=>(
            <div className="trust-block" key={i}>
              <div className="trust-icon">{t.ico}</div>
              <div>
                <div className="trust-label">{t.label}</div>
                <div className="trust-sub">{t.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function NlStrip(){
  const [email,setEmail]=React.useState('');
  const [done,setDone]=React.useState(false);
  return(
    <div className="nl-strip">
      <div className="wrap">
        <div className="nl-strip-inner">
          <div>
            <div className="nl-strip-eyebrow">Newsletter semanal</div>
            <div className="nl-strip-title">IA aplicada na<br/><em>sua caixa. Toda semana.</em></div>
            <div className="nl-strip-sub">Guias, ferramentas e novidades — sem hype.</div>
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
              <div style={{fontFamily:'var(--mono)',fontSize:10.5,color:'var(--text-4)',letterSpacing:'.03em'}}>3.000+ leitores · Conforme LGPD · Cancele quando quiser</div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}


function App(){
  return(
    <>
      <div className="bc"><div className="wrap"><div className="bc-inner">
        <a href="/" className="bc-a">Home</a>
        <span className="bc-sep">›</span>
        <span className="bc-cur">Ebooks</span>
      </div></div></div>
      <section className="hero">
        <div className="hero-bg"/>
        <div className="wrap"><div className="hero-inner">
          <div className="hero-eyebrow"><div className="hero-eyebrow-rule"/><span className="hero-eyebrow-text">Produtos Digitais</span></div>
          <h1 className="hero-title">Conhecimento que<br/>vira <em>resultado.</em></h1>
          <p className="hero-sub">Ebooks escritos pela equipe do Tech Briefing e Nexora Systems. Sem enrolação — só o que você pode aplicar na prática, no negócio e na vida.</p>
          <div className="hero-trust">
            {['PDF + EPUB inclusos','Acesso imediato','Atualizado em 2026','Feito no Brasil'].map(t=>(
              <div className="trust-item" key={t}><div className="trust-dot"/>{t}</div>
            ))}
          </div>
        </div></div>
      </section>
      <TrustStrip/>
      <section className="ebooks-section">
        <div className="wrap">
          {EBOOKS.map(e=><EbookCard key={e.id} e={e}/>)}
        </div>
      </section>
      <section className="related">
        <div className="wrap">
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:40}}>
            <div style={{fontFamily:'var(--serif)',fontSize:'clamp(24px,3vw,32px)',fontWeight:700,letterSpacing:'-.02em'}}>Leitura complementar</div>
            <a href="/agentes-de-ia" className="arrow-link">Ver categoria →</a>
          </div>
          <div className="related-grid">
            {RELATED.map((r,i)=>(
              <div className="rel-card" key={i}>
                <div className="rel-card-img" style={{fontFamily:'var(--mono)',fontSize:11,color:'var(--text-4)',padding:'8px 14px',border:'1px solid var(--line-s)',borderRadius:4}}>imagem do artigo</div>
                <div className="rel-card-body">
                  <span className={`pill ${r.v}`}>{r.tag}</span>
                  <div className="rel-card-title">{r.title}</div>
                  <div className="rel-card-meta">{r.date} · {r.rt} de leitura</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <NlStrip/>
      </>
  );
}




export default App;
