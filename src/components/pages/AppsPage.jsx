import React from 'react';




const APPS = [
  {ico:'🌟',name:'Ethos',desc:'Produtividade, valores e intenção. Seu companheiro pessoal para viver e trabalhar com mais propósito e clareza.',platform:'iOS · Android',status:'available',tags:['Produtividade','Personal']},
  {ico:'🌙',name:'Celestia',desc:'Guia de astrologia e insights de vida. Descubra padrões, ciclos e perspectivas para suas decisões pessoais e profissionais.',platform:'iOS · Android',status:'available',tags:['Bem-estar','Astrologia']},
  {ico:'🌐',name:'BioHub',desc:'Seu hub de identidade digital. Tudo que você é, tudo que você cria, tudo que você oferece — em um único link profissional.',platform:'Web · Mobile',status:'available',tags:['Criadores','Link Bio']},
  {ico:'🔮',name:'Código do Destino',desc:'Numerologia, arquétipos e autoconhecimento. Descubra os padrões que guiam sua trajetória e tome decisões mais alinhadas.',platform:'iOS · Android',status:'available',tags:['Autoconhecimento']},
  {ico:'⏱️',name:'M-Timer',desc:'Foco, tempo e ritmo. O timer que respeita como você pensa e trabalha — com técnicas como Pomodoro adaptadas ao seu estilo.',platform:'iOS · Android · Web',status:'available',tags:['Foco','Produtividade']},
  {ico:'📔',name:'Dream Diary',desc:'Diário de sonhos com IA. Registre, interprete e explore padrões no que acontece enquanto você dorme. Autoconhecimento noturno.',platform:'iOS · Android',status:'available',tags:['IA','Diário']},
];


function NlStrip(){
  const [email,setEmail]=React.useState('');
  const [done,setDone]=React.useState(false);
  return(
    <div className="nl-strip">
      <div className="wrap"><div className="nl-strip-inner">
        <div>
          <div style={{fontFamily:'var(--mono)',fontSize:11,fontWeight:500,letterSpacing:'.1em',textTransform:'uppercase',color:'var(--amber)',marginBottom:10}}>Newsletter semanal</div>
          <div style={{fontFamily:'var(--serif)',fontSize:'clamp(22px,3vw,32px)',fontWeight:700,letterSpacing:'-.02em',lineHeight:1.1,marginBottom:8}}>Novos produtos e<br/><em style={{fontStyle:'italic',color:'var(--amber)'}}>atualizações em primeira mão.</em></div>
          <div style={{fontSize:14,color:'var(--text-2)'}}>Seja o primeiro a saber quando um novo app chega.</div>
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
            <div style={{fontFamily:'var(--mono)',fontSize:10.5,color:'var(--text-4)',letterSpacing:'.03em'}}>12.000 leitores · LGPD · Cancele quando quiser</div>
          </form>
        )}
      </div></div>
    </div>
  );
}


function App(){
  return(
    <>
      <div className="bc"><div className="wrap"><div className="bc-inner">
        <a href="/" className="bc-a">Home</a>
        <span className="bc-sep">›</span>
        <span className="bc-cur">Nossos Apps</span>
      </div></div></div>

      <section className="hero">
        <div className="hero-bg"/>
        <div className="wrap">
          <div className="nexora-badge"><div className="nexora-pip"/><span className="nexora-text">Nexora Systems</span></div>
          <h1 className="hero-title">Produtos que<br/><em>você usa todo dia.</em></h1>
          <p className="hero-sub">Aplicativos desenvolvidos pela Nexora Systems — focados em produtividade, autoconhecimento e organização digital. Simples, bonitos e funcionais.</p>
        </div>
      </section>

      <section className="featured-app">
        <div className="wrap">
          <div className="featured-layout">
            <div>
              <div className="featured-app-eyebrow">Destaque — App principal</div>
              <h2 className="featured-app-title">Ethos</h2>
              <p className="featured-app-desc">Seu companheiro pessoal de produtividade, valores e intenção. Construído para quem quer viver e trabalhar com mais propósito — não apenas ser mais produtivo, mas ser mais você.</p>
              <div className="featured-app-tags">
                <span className="pill c">iOS</span>
                <span className="pill c">Android</span>
                <span className="pill">Produtividade</span>
                <span className="pill">Personal</span>
              </div>
              <div className="featured-app-actions">
                <button className="btn btn-fill">Baixar grátis →</button>
                <button className="btn btn-stroke">Saiba mais</button>
              </div>
            </div>
            <div className="featured-app-visual">
              <div className="featured-app-visual-inner">
                <div className="featured-app-icon">🌟</div>
                <div style={{fontFamily:'var(--mono)',fontSize:11,color:'var(--text-4)',letterSpacing:'.06em'}}>screenshot do app Ethos</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="apps-section">
        <div className="wrap">
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:48}}>
            <div>
              <div style={{fontFamily:'var(--mono)',fontSize:11,fontWeight:500,letterSpacing:'.1em',textTransform:'uppercase',color:'var(--text-3)',marginBottom:10}}>Todos os produtos</div>
              <div style={{fontFamily:'var(--serif)',fontSize:'clamp(26px,3vw,36px)',fontWeight:700,letterSpacing:'-.02em'}}>Nosso portfólio</div>
            </div>
            <div style={{fontFamily:'var(--mono)',fontSize:11,color:'var(--text-3)',letterSpacing:'.04em'}}>6 apps disponíveis</div>
          </div>
          <div className="apps-grid">
            {APPS.map((a,i)=>(
              <div className="app-card" key={i}>
                <div className="app-card-header">
                  <div className="app-icon">{a.ico}</div>
                  <div className={`app-status ${a.status}`}>{a.status==='available'?'Disponível':'Em breve'}</div>
                </div>
                <div>
                  <div className="app-card-name">{a.name}</div>
                  <div className="app-card-desc">{a.desc}</div>
                </div>
                <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                  {a.tags.map(t=><span key={t} className="pill" style={{fontSize:9.5}}>{t}</span>)}
                </div>
                <div className="app-card-footer">
                  <span className="app-platform">{a.platform}</span>
                  <a href="#" className="arrow-link" style={{fontSize:11}}>Ver app →</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="nexora-strip">
        <div className="wrap">
          <div className="nexora-strip-inner">
            <div>
              <div className="nexora-strip-num">06</div>
              <div style={{fontFamily:'var(--mono)',fontSize:11,fontWeight:500,letterSpacing:'.1em',textTransform:'uppercase',color:'var(--cyan)',marginBottom:14}}>Apps ativos</div>
              <h2 className="nexora-strip-title">Construídos pela<br/><em>Nexora Systems.</em></h2>
              <p className="nexora-strip-desc">Todos os apps do portfólio Tech Briefing são desenvolvidos, mantidos e atualizados pela equipe da Nexora Systems — focada em tecnologia, sistemas e inteligência artificial aplicada ao mundo real.</p>
              <a href="/sobre" className="arrow-link">Conhecer a Nexora Systems →</a>
            </div>
            <div className="nexora-strip-items">
              {APPS.map((a,i)=>(
                <div className="nexora-strip-item" key={i}>
                  <div className="nexora-strip-item-ico">{a.ico}</div>
                  <div>
                    <div className="nexora-strip-item-name">{a.name}</div>
                    <div className="nexora-strip-item-desc">{a.platform}</div>
                  </div>
                  <div style={{marginLeft:'auto'}}><div className={`app-status ${a.status}`} style={{fontSize:9}}>{a.status==='available'?'Ativo':'Em breve'}</div></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <NlStrip/>
      </>
  );
}




export default App;
