import React from 'react';




const VALUES = [
  {n:'01',title:'Clareza antes de tudo',desc:'A IA é complexa. O nosso trabalho é torná-la simples, direta e útil — sem sacrificar a profundidade.'},
  {n:'02',title:'Prática, não teoria',desc:'Cada guia, comparativo e ferramenta é pensado para aplicação real. Se não funciona no dia a dia, não publicamos.'},
  {n:'03',title:'Honestidade editorial',desc:'Links de afiliados são identificados. Opiniões são nossas. Nenhum patrocinador dita o que escrevemos.'},
  {n:'04',title:'Profundidade com ritmo',desc:'Longos guias que valem o tempo. Conteúdo que você salva e volta — não apenas lê e esquece.'},
  {n:'05',title:'Relevância contínua',desc:'O campo da IA muda rápido. Atualizamos nosso conteúdo para refletir o estado real da tecnologia.'},
  {n:'06',title:'Feito para crescer',desc:'Portal construído para escalar com muito conteúdo, automação e um ecossistema de produtos digitais.'},
];

const PRINCIPLES = [
  {title:'Testamos antes de publicar',desc:'Ferramentas que recomendamos foram usadas pela equipe. Guias refletem implementações reais.'},
  {title:'Identificamos afiliados',desc:'Quando um link é de afiliado, dizemos claramente. Transparência não é opcional.'},
  {title:'Atualizamos com frequência',desc:'Artigos com data têm contexto. Revisamos guias quando o campo muda. Você sabe o que está lendo.'},
  {title:'Não vendemos acesso editorial',desc:'Nenhuma empresa paga para aparecer em nosso conteúdo. Avaliações são independentes.'},
];


function NlCta(){
  const [email,setEmail]=React.useState('');
  const [done,setDone]=React.useState(false);
  return(
    <section className="nl-cta"><div className="wrap"><div className="nl-cta-inner">
      <h2 className="nl-cta-title">IA aplicada na sua caixa.<br/><em>Toda semana.</em></h2>
      <p className="nl-cta-sub">Guias práticos, ferramentas testadas e novidades da semana — sem hype, sem enrolação. 3.000+ leitores já recebem.</p>
      {done?(
        <div style={{textAlign:'center',padding:'24px',fontFamily:'var(--serif)',fontSize:24,color:'var(--amber)'}}>✓ Você está dentro!</div>
      ):(
        <form className="nl-cta-form" onSubmit={e=>{e.preventDefault();if(email)setDone(true)}}>
          <input className="nl-cta-input" type="email" placeholder="seu@email.com" value={email} onChange={e=>setEmail(e.target.value)} required/>
          <button type="submit" className="btn btn-fill" style={{padding:'13px 28px',borderRadius:100}}>Quero receber →</button>
        </form>
      )}
      <div style={{marginTop:14,fontFamily:'var(--mono)',fontSize:11,color:'var(--text-4)',letterSpacing:'.04em'}}>LGPD compliant · Cancele em 1 clique · Sem spam</div>
    </div></div></section>
  );
}


function App(){
  return(
    <>
      <div className="bc"><div className="wrap"><div className="bc-inner">
        <a href="/" className="bc-a">Home</a>
        <span className="bc-sep">›</span>
        <span className="bc-cur">Sobre</span>
      </div></div></div>

      {/* HERO */}
      <section className="about-hero">
        <div className="about-hero-bg"/>
        <div className="wrap"><div className="about-hero-inner">
          <div>
            <div className="about-hero-eyebrow"><div className="about-hero-rule"/><span className="about-hero-eyebrow-text">O portal</span></div>
            <h1 className="about-hero-title">Por trás do<br/><em>Tech Briefing.</em></h1>
            <p className="about-hero-sub">O Tech Briefing é uma iniciativa da Nexora Systems — focada em tornar a inteligência artificial mais acessível, mais clara e mais relevante para negócios, trabalho e sociedade.</p>
          </div>
          <div className="about-hero-card">
            <div className="about-hero-card-logo"><div className="nav-pip"/>Nexora Systems</div>
            <div className="about-hero-card-desc">Tecnologia, sistemas e inteligência artificial aplicada ao mundo real. Criamos conteúdo, ferramentas e produtos para quem quer transformar IA em resultado.</div>
            <div className="about-hero-stat-grid">
              {[{n:'70+',em:'',l:'Guias e artigos'},{n:'3',em:'k+',l:'Na newsletter'},{n:'20+',em:'',l:'Fontes monitoradas'},{n:'1',em:'',l:'Ebook publicado'}].map((s,i)=>(
                <div className="about-stat" key={i}>
                  <div className="about-stat-n">{s.n}{s.em&&<em>{s.em}</em>}</div>
                  <div className="about-stat-l">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div></div>
      </section>

      {/* MISSION */}
      <section className="mission">
        <div className="wrap"><div className="mission-inner">
          <div className="mission-num" aria-hidden="true">01</div>
          <div>
            <h2 className="mission-title">Nossa<br/><em>missão.</em></h2>
            <div className="mission-body">
              <p>O Tech Briefing surgiu da percepção de que <strong>muita gente ouve falar de IA todos os dias, mas ainda encontra dificuldade para entender o que realmente importa</strong>, o que muda na prática e como usar essa tecnologia de forma útil, estratégica e responsável.</p>
              <p>Não queremos ser mais um canal que amplifica hype. Queremos ser o lugar onde você chega quando precisa de <strong>clareza real</strong> — um guia que funciona, uma comparação honesta, uma ferramenta que vale o teste.</p>
              <p>A missão é simples: <strong>tornar a IA mais acessível, mais clara e mais relevante</strong> para negócios, trabalho e sociedade. Com conteúdo sério, produtos úteis e uma curadoria que respeita o seu tempo.</p>
            </div>
            <a href="/ebooks" className="arrow-link">Ver nossos ebooks →</a>
          </div>
        </div></div>
      </section>

      {/* VALUES */}
      <section className="values">
        <div className="wrap">
          <div style={{display:'flex',alignItems:'baseline',gap:24,marginBottom:0}}>
            <div style={{fontFamily:'var(--serif)',fontSize:clamp_('clamp(28px,4vw,44px)'),fontWeight:700,letterSpacing:'-.02em'}}>O que nos guia</div>
          </div>
          <div className="values-grid" style={{marginTop:48}}>
            {VALUES.map((v,i)=>(
              <div className="value-card" key={i}>
                <div className="value-num">{v.n}</div>
                <div className="value-title">{v.title}</div>
                <div className="value-desc">{v.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EDITORIAL */}
      <section className="editorial">
        <div className="wrap">
          <div style={{fontFamily:'var(--serif)',fontSize:'clamp(28px,4vw,44px)',fontWeight:700,letterSpacing:'-.02em',marginBottom:0}}>Compromisso editorial</div>
          <div className="editorial-layout">
            <div className="editorial-principles">
              {PRINCIPLES.map((p,i)=>(
                <div className="editorial-principle" key={i}>
                  <div className="ep-num">0{i+1}</div>
                  <div>
                    <div className="ep-title">{p.title}</div>
                    <div className="ep-desc">{p.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="nexora-box">
              <div className="nexora-box-label">Nexora Systems</div>
              <div className="nexora-box-title">O ecossistema por trás do portal</div>
              <div className="nexora-box-desc">A Nexora Systems desenvolve o Tech Briefing, nossos guias e ebooks. Somos uma equipe focada em tecnologia aplicada — conteúdo, produtos e sistemas que funcionam no mundo real.</div>
              <div className="nexora-box-links">
                {[{name:'Ebooks',desc:'1 título publicado',href:'/ebooks'},{name:'Ferramentas recomendadas',desc:'20+ ferramentas testadas',href:'/ferramentas'}].map((l,i)=>(
                  <a href={l.href} className="nexora-link" key={i}>
                    <div>
                      <div className="nexora-link-name">{l.name}</div>
                      <div style={{fontFamily:'var(--mono)',fontSize:11,color:'var(--text-3)',letterSpacing:'.02em',marginTop:2}}>{l.desc}</div>
                    </div>
                    <div className="nexora-link-arrow">↗</div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="contact">
        <div className="wrap"><div className="contact-inner">
          <div>
            <h2 className="contact-title">Fale com<br/><em>a gente.</em></h2>
            <p className="contact-desc">Sugestões editoriais, parcerias, oportunidades de anúncio ou só um feedback honesto — estamos disponíveis.</p>
            <div className="contact-links">
              {[
                {ico:'✉️',title:'E-mail geral',desc:'contato@iaworld.com.br',href:'mailto:contato@iaworld.com.br'},
                {ico:'🤝',title:'Parcerias e anúncios',desc:'Acesso ao media kit e formatos',href:'/contato'},
                {ico:'𝕏',title:'Twitter / X',desc:'@iaworldbr',href:'/contato'},
                {ico:'in',title:'LinkedIn',desc:'Tech Briefing — Nexora Systems',href:'/contato'},
              ].map((c,i)=>(
                <a href={c.href} className="contact-link" key={i}>
                  <div className="contact-link-ico">{c.ico}</div>
                  <div>
                    <div className="contact-link-title">{c.title}</div>
                    <div className="contact-link-desc">{c.desc}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>
          <div style={{background:'var(--bg-2)',border:'1px solid var(--line-s)',borderRadius:16,padding:36}}>
            <div style={{fontFamily:'var(--mono)',fontSize:11,fontWeight:500,letterSpacing:'.1em',textTransform:'uppercase',color:'var(--amber)',marginBottom:16}}>Anuncie no Tech Briefing</div>
            <div style={{fontFamily:'var(--serif)',fontSize:'clamp(22px,2.5vw,28px)',fontWeight:700,letterSpacing:'-.02em',lineHeight:1.2,marginBottom:14}}>Alcance quem decide sobre IA e tecnologia.</div>
            <div style={{fontSize:14,color:'var(--text-2)',lineHeight:1.7,marginBottom:24}}>Nosso público são fundadores, gestores, freelancers e criadores que aplicam IA no dia a dia. Se a sua ferramenta ou produto serve essa audiência, fale com a gente.</div>
            <div style={{display:'flex',flexDirection:'column',gap:10,marginBottom:24}}>
              {['Newsletter: 3.000+ assinantes','Artigos patrocinados','Comparativos e reviews','Banners editoriais'].map((i,k)=>(
                <div key={k} style={{display:'flex',alignItems:'center',gap:10,fontSize:13.5,color:'var(--text-2)'}}>
                  <span style={{color:'var(--cyan)',fontSize:12}}>✓</span>{i}
                </div>
              ))}
            </div>
            <button className="btn btn-fill" style={{width:'100%',justifyContent:'center'}}>Solicitar media kit →</button>
          </div>
        </div></div>
      </section>

      <NlCta/>
      </>
  );
}

const clamp_=v=>v;



export default App;
