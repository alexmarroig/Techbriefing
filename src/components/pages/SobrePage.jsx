import React from 'react';

const VALUES = [
  {n:'01',title:'Pragmatismo Operacional',desc:'Ignoramos o hype. Se a IA não resolve um gargalo, não reduz custo ou não gera ROI, ela não tem espaço em nossa pauta.'},
  {n:'02',title:'Transparência Técnica',desc:'Nossas análises mostram onde a ferramenta quebra, não apenas onde ela brilha. Documentamos limitações reais.'},
  {n:'03',title:'Independência Editorial',desc:'O TechBriefing não aceita pagamento por posições em rankings. Nossa curadoria é técnica, não comercial.'},
];

const PRINCIPLES = [
  {title:'Nós testamos em produção',desc:'Diferente de portais de notícias, cada workflow ou ferramenta recomendada foi integrada em nossa própria operação antes de virar guia.'},
  {title:'Foco em People-First',desc:'Acreditamos que a IA é um multiplicador humano. Nosso conteúdo é escrito por especialistas para profissionais, não por bots para o Google.'},
  {title:'Atualização Ativa',desc:'O campo da IA muda semanalmente. Mantemos nossos guias e rankings atualizados com base nos últimos benchmarks.'},
];


function NlCta(){
  const [email,setEmail]=React.useState('');
  const [done,setDone]=React.useState(false);
  return(
    <section className="nl-cta"><div className="wrap"><div className="nl-cta-inner">
      <h2 className="nl-cta-title">Receba o Briefing.<br/><em>Opere melhor.</em></h2>
      <p className="nl-cta-sub">A dose semanal de estratégia de IA que chega antes da sua primeira reunião de segunda-feira. 3.000+ profissionais já assinam.</p>
      {done?(
        <div style={{textAlign:'center',padding:'24px',fontFamily:'var(--serif)',fontSize:24,color:'var(--amber)'}}>✓ Você está no Briefing!</div>
      ):(
        <form className="nl-cta-form" onSubmit={e=>{e.preventDefault();if(email)setDone(true)}}>
          <input className="nl-cta-input" type="email" placeholder="seu@trabalho.com" value={email} onChange={e=>setEmail(e.target.value)} required/>
          <button type="submit" className="btn btn-fill" style={{padding:'13px 28px',borderRadius:100}}>Quero participar →</button>
        </form>
      )}
      <div style={{marginTop:14,fontFamily:'var(--mono)',fontSize:11,color:'var(--text-4)',letterSpacing:'.04em'}}>LGPD · Cancele quando quiser · Sem Spam</div>
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

      <section className="about-hero">
        <div className="about-hero-bg"/>
        <div className="wrap"><div className="about-hero-inner">
          <div>
            <div className="about-hero-eyebrow"><div className="about-hero-rule"/><span className="about-hero-eyebrow-text">A Referência</span></div>
            <h1 className="about-hero-title">Onde a IA encontra a<br/><em>Operação Real.</em></h1>
            <p className="about-hero-sub">O TechBriefing não é um portal de notícias. É um laboratório editorial focado em transformar a complexidade da Inteligência Artificial em vantagem competitiva e ROI operacional para empresas e profissionais.</p>
          </div>
          <div className="about-hero-card">
            <div className="about-hero-card-logo"><div className="nav-pip"/>Nexora Systems</div>
            <div className="about-hero-card-desc">Operamos o TechBriefing como um braço editorial da Nexora, focando em documentar a transição global para fluxos de trabalho agentic e autônomos.</div>
            <div className="about-hero-stat-grid">
              {[{n:'50+',em:'',l:'Guias de Operação'},{n:'3.000+',em:'',l:'Membros Ativos'},{n:'Weekly',em:'',l:'Briefing Estratégico'},{n:'1',em:'',l:'Ebook Premium'}].map((s,i)=>(
                <div className="about-stat" key={i}>
                  <div className="about-stat-n">{s.n}{s.em&&<em>{s.em}</em>}</div>
                  <div className="about-stat-l">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div></div>
      </section>

      <section className="mission">
        <div className="wrap"><div className="mission-inner">
          <div className="mission-num" aria-hidden="true">01</div>
          <div>
            <h2 className="mission-title">Nossa Visão<br/><em>Pragmática.</em></h2>
            <div className="mission-body">
              <p>O TechBriefing nasceu de uma necessidade clara: <strong>separar o hype da utilidade</strong>. Em um mercado saturado de promessas de IA, nós focamos no que pode ser implementado hoje para reduzir custos e aumentar a escala operacional.</p>
              <p>Nossa abordagem é a de um <strong>praticante</strong>. Não apenas relatamos o que as Big Techs estão lançando; nós quebramos o código, testamos as integrações e documentamos o processo para que você não precise cometer os mesmos erros.</p>
              <p>Tratamos o TechBriefing como um <strong>produto editorial premium</strong>, onde a curadoria e a profundidade superam o volume. Se está no nosso radar, é porque tem potencial de impacto real no seu negócio.</p>
            </div>
            <a href="/metodologia" className="arrow-link">Conheça nossa metodologia de teste →</a>
          </div>
        </div></div>
      </section>

      <section className="values">
        <div className="wrap">
          <div style={{fontFamily:'var(--serif)',fontSize:'clamp(28px,4vw,44px)',fontWeight:700,letterSpacing:'-.02em'}}>O que nos guia</div>
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

      <section className="editorial">
        <div className="wrap">
          <div style={{fontFamily:'var(--serif)',fontSize:'clamp(28px,4vw,44px)',fontWeight:700,letterSpacing:'-.02em',marginBottom:0}}>Compromisso com a Autoridade</div>
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
              <div className="nexora-box-label">Iniciativa Nexora</div>
              <div className="nexora-box-title">O ecossistema por trás do portal</div>
              <div className="nexora-box-desc">A Nexora Systems é uma empresa de operações de IA. Desenvolvemos o TechBriefing para servir como a base de conhecimento para o mercado brasileiro de tecnologia aplicada.</div>
              <div className="nexora-box-links">
                {[{name:'Guias Estratégicos',desc:'Páginas-pilar de conhecimento',href:'/guias'},{name:'Laboratório de IA',desc:'Reviews e benchmarks reais',href:'/ferramentas'}].map((l,i)=>(
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

      <section className="contact">
        <div className="wrap"><div className="contact-inner">
          <div>
            <h2 className="contact-title">Fale com<br/><em>a equipe.</em></h2>
            <p className="contact-desc">Para sugestões editoriais, parcerias estratégicas ou feedback técnico sobre nossas automações.</p>
            <div className="contact-links">
              {[
                {ico:'✉️',title:'E-mail Editorial',desc:'contato@techbriefing.com.br',href:'mailto:contato@techbriefing.com.br'},
                {ico:'🤝',title:'Parcerias',desc:'Solicite nosso media kit estratégico',href:'/contato'},
                {ico:'𝕏',title:'X (Twitter)',desc:'Acompanhe o radar diário',href:'/contato'},
                {ico:'in',title:'LinkedIn',desc:'Foco em IA Profissional',href:'/contato'},
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
            <div style={{fontFamily:'var(--mono)',fontSize:11,fontWeight:600,letterSpacing:'.1em',textTransform:'uppercase',color:'var(--amber)',marginBottom:16}}>Media Kit 2026</div>
            <div style={{fontFamily:'var(--serif)',fontSize:'clamp(22px,2.5vw,28px)',fontWeight:700,letterSpacing:'-.02em',lineHeight:1.2,marginBottom:14}}>Alcance quem lidera a adoção de IA.</div>
            <div style={{fontSize:14,color:'var(--text-2)',lineHeight:1.7,marginBottom:24}}>Nosso público é composto por decisores, engenheiros de operações e fundadores que buscam escala. Não vendemos cliques, vendemos atenção qualificada.</div>
            <div style={{display:'flex',flexDirection:'column',gap:10,marginBottom:24}}>
              {['Briefing Semanal: 3k+ decisores','Reviews e Native Advertising','Sponsorships de Longo Prazo'].map((i,k)=>(
                <div key={k} style={{display:'flex',alignItems:'center',gap:10,fontSize:13.5,color:'var(--text-2)'}}>
                  <span style={{color:'var(--cyan)',fontSize:12}}>✓</span>{i}
                </div>
              ))}
            </div>
            <button className="btn btn-fill" style={{width:'100%',justifyContent:'center'}}>Solicitar Media Kit →</button>
          </div>
        </div></div>
      </section>

      <NlCta/>
      </>
  );
}

export default App;
