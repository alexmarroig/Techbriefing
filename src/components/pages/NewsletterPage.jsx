import React from 'react';




const BENEFITS = [
  {n:'01',title:'Guias que você usa segunda-feira',desc:'Sem teoria vazia. Cada edição traz pelo menos um passo acionável — algo para testar, aplicar ou adaptar no seu trabalho.'},
  {n:'02',title:'Ferramentas testadas antes de você',desc:'Avaliamos novas ferramentas de IA antes de recomendar. Você recebe o veredito honesto, não o pitch do lançamento.'},
  {n:'03',title:'Análise do que importa',desc:'O campo muda rápido. Filtramos o ruído e explicamos o que realmente mudou — e o que isso significa na prática.'},
  {n:'04',title:'Curadoria de conteúdo da semana',desc:'Os melhores artigos, threads e recursos sobre IA da semana — organizados e explicados para você não precisar garimpar.'},
  {n:'05',title:'Acesso antecipado a guias',desc:'Assinantes recebem novos guias e comparativos antes de todo mundo, com links exclusivos antes da publicação.'},
  {n:'06',title:'Sem spam, nunca',desc:'Uma edição por semana. Editada com cuidado. Cancele a qualquer momento com um clique — sem confirmar nem justificar.'},
];

const TOPICS = [
  {title:'Agentes de IA em produção: o que funciona de verdade',tag:'Guia',v:'a'},
  {title:'As 5 ferramentas de automação mais úteis de 2026 — testadas',tag:'Comparativo',v:''},
  {title:'Como usar Claude e GPT-4o juntos no mesmo fluxo',tag:'Tutorial',v:'c'},
  {title:'O que a IA está mudando no trabalho dos criadores agora',tag:'Análise',v:''},
  {title:'n8n vs Make: qual usar no seu negócio em 2026',tag:'Comparativo',v:''},
  {title:'RAG, embeddings e memória: o guia que ninguém escreve simples',tag:'Guia',v:'a'},
];

const AUDIENCE = ['Pequenos empresários','Freelancers','Criadores de conteúdo','Gestores de operações','Desenvolvedores','Fundadores de startups','Profissionais de marketing'];

const FAQS = [
  {q:'Com que frequência você envia?',a:'Uma vez por semana, toda quinta-feira. Às vezes uma edição extra quando algo muito relevante acontece — mas nunca spam.'},
  {q:'O que está incluso em cada edição?',a:'Um guia ou análise principal, curadoria das melhores ferramentas e artigos da semana, e pelo menos uma dica acionável. Leitura de 5 a 10 minutos.'},
  {q:'Posso cancelar quando quiser?',a:'Sim. Cada e-mail tem um link de cancelamento no rodapé. Um clique, cancelado. Sem confirmar, sem justificar, sem e-mail de "você tem certeza?".'},
  {q:'O conteúdo é pago?',a:'A newsletter é gratuita. Publicamos guias e ebooks premium separados, mas a newsletter nunca vai atrás de paywall.'},
  {q:'Você vende meus dados?',a:'Não. Nunca. Usamos seus dados apenas para enviar a newsletter. Veja nossa política de privacidade para os detalhes completos.'},
];


function NlForm({compact}){
  const [name,setName]=React.useState('');
  const [email,setEmail]=React.useState('');
  const [done,setDone]=React.useState(false);
  if(done) return(
    <div className="nl-success">
      <div className="nl-success-icon">✓</div>
      <div className="nl-success-title">Você está dentro.</div>
      <div className="nl-success-sub">Confirme seu e-mail — a primeira edição chega na próxima quinta-feira.</div>
    </div>
  );
  return(
    <form onSubmit={e=>{e.preventDefault();if(email)setDone(true)}}>
      {!compact && <div className="nl-form-row">
        <input className="nl-input" type="text" placeholder="Seu primeiro nome" value={name} onChange={e=>setName(e.target.value)}/>
        <input className="nl-input" type="email" placeholder="seu@email.com" value={email} onChange={e=>setEmail(e.target.value)} required/>
      </div>}
      {compact && <div style={{marginBottom:12}}>
        <input className="nl-input" type="email" placeholder="seu@email.com" value={email} onChange={e=>setEmail(e.target.value)} required/>
      </div>}
      <button type="submit" className="btn btn-fill" style={{width:'100%',justifyContent:'center',padding:'14px',borderRadius:10,fontSize:15}}>
        Quero receber toda semana →
      </button>
      <div className="nl-form-note" style={{textAlign:'center',marginTop:14}}>
        Gratuita · Cancele quando quiser · LGPD compliant · Nunca spam
      </div>
    </form>
  );
}

function FaqItem({q,a}){
  const [open,setOpen]=React.useState(false);
  return(
    <div className="faq-item">
      <div className="faq-q" onClick={()=>setOpen(o=>!o)}>
        <span>{q}</span>
        <span className={`faq-icon ${open?'open':''}`}>+</span>
      </div>
      <div className={`faq-a ${open?'open':''}`}>
        <div className="faq-a-inner">{a}</div>
      </div>
    </div>
  );
}


function App(){
  return(
    <>
      <section className="nl-hero">
        <div className="nl-hero-bg"/>
        <div className="nl-hero-glow"/>
        <div className="nl-hero-inner">
          <div className="nl-hero-eyebrow"><div className="nl-hero-rule"/><span className="nl-hero-eyebrow-text">Newsletter gratuita</span><div className="nl-hero-rule"/></div>
          <h1 className="nl-hero-title">IA aplicada.<br/><em>Toda semana.</em></h1>
          <p className="nl-hero-sub">Guias práticos, ferramentas testadas e análises honestas sobre inteligência artificial e automação — para quem quer aplicar, não apenas ler.</p>
          <div className="nl-social-proof">
            <div className="nl-sp-item"><div className="nl-sp-dot"/><span className="nl-sp-strong">12.000</span> leitores</div>
            <div className="nl-sp-item"><div className="nl-sp-dot"/>Toda quinta-feira</div>
            <div className="nl-sp-item"><div className="nl-sp-dot"/>Gratuita, sempre</div>
            <div className="nl-sp-item"><div className="nl-sp-dot"/>Cancele quando quiser</div>
          </div>
          <div className="nl-form-card">
            <div className="nl-form-title">Inscreva-se gratuitamente</div>
            <div className="nl-form-sub">Junte-se a 12.000 freelancers, fundadores e gestores que aplicam IA no dia a dia.</div>
            <NlForm compact={false}/>
          </div>
        </div>
        <div className="nl-hero-bottom wrap">
          {[{n:'12',em:'k',l:'Assinantes'},{n:'52+',em:'',l:'Edições publicadas'},{n:'100%',em:'',l:'Gratuita'},{n:'1×',em:'',l:'Por semana'}].map((s,i)=>(
            <div className="nl-hb-item" key={i}>
              <div className="nl-hb-n">{s.n}{s.em&&<em>{s.em}</em>}</div>
              <div className="nl-hb-l">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="nl-benefits">
        <div className="wrap">
          <div style={{textAlign:'center',marginBottom:0}}>
            <div style={{fontFamily:'var(--mono)',fontSize:11,fontWeight:500,letterSpacing:'.1em',textTransform:'uppercase',color:'var(--text-3)',marginBottom:14}}>O que você recebe</div>
            <div style={{fontFamily:'var(--serif)',fontSize:'clamp(28px,4vw,44px)',fontWeight:700,letterSpacing:'-.02em',lineHeight:1.1}}>Cada edição vale o seu tempo.</div>
          </div>
          <div className="nl-benefits-grid">
            {BENEFITS.map((b,i)=>(
              <div className="nl-benefit-card" key={i}>
                <div className="nl-benefit-num">{b.n}</div>
                <div className="nl-benefit-title">{b.title}</div>
                <div className="nl-benefit-desc">{b.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="nl-topics">
        <div className="wrap">
          <div className="nl-topics-header">
            <div className="nl-topics-title">Tópicos recentes</div>
            <a href="/arquivo" className="arrow-link">Ver todos os guias →</a>
          </div>
          <div className="nl-topics-list">
            {TOPICS.map((t,i)=>(
              <div className="nl-topic-row" key={i}>
                <div className="nl-topic-num">0{i+1}</div>
                <div className="nl-topic-title">{t.title}</div>
                <span className={`pill ${t.v} nl-topic-pill`}>{t.tag}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="nl-audience">
        <div className="wrap"><div className="nl-audience-inner">
          <div>
            <div style={{fontFamily:'var(--mono)',fontSize:11,fontWeight:500,letterSpacing:'.1em',textTransform:'uppercase',color:'var(--text-3)',marginBottom:14}}>Para quem é</div>
            <h2 className="nl-audience-title">Feita para quem<br/><em>aplica, não só lê.</em></h2>
            <p className="nl-audience-desc">O Tech Briefing não é para pesquisadores de IA. É para quem quer usar tecnologia no dia a dia — no trabalho, no negócio, nos projetos pessoais.</p>
            <div className="nl-audience-tags">
              {AUDIENCE.map(a=><span key={a} className="pill" style={{marginBottom:6}}>{a}</span>)}
            </div>
          </div>
          <div className="nl-audience-form">
            <div className="nl-audience-form-title">Junte-se a 12.000 leitores</div>
            <div className="nl-audience-form-sub">Gratuita. Toda quinta-feira. Cancele quando quiser.</div>
            <NlForm compact={true}/>
          </div>
        </div></div>
      </section>

      <section className="nl-faq">
        <div className="wrap"><div className="nl-faq-inner">
          <h2 className="nl-faq-title">Perguntas frequentes</h2>
          <div className="faq-list">
            {FAQS.map((f,i)=><FaqItem key={i} q={f.q} a={f.a}/>)}
          </div>
        </div></div>
      </section>

      <section className="nl-final">
        <div className="wrap"><div className="nl-final-inner">
          <h2 className="nl-final-title">IA aplicada.<br/><em>Toda semana.</em><br/>Grátis.</h2>
          <p className="nl-final-sub">Nenhum motivo para esperar. Assine agora e receba a próxima edição na quinta-feira.</p>
          <div style={{background:'var(--bg)',border:'1px solid var(--line-s)',borderRadius:16,padding:36,textAlign:'left'}}>
            <NlForm compact={false}/>
          </div>
        </div></div>
      </section>

      </>
  );
}




export default App;
