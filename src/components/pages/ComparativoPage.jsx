import React from 'react';




const TOC = [
  {id:'intro',label:'Introdução'},
  {id:'overview',label:'Visão geral das ferramentas'},
  {id:'n8n',label:'n8n em detalhe'},
  {id:'make',label:'Make em detalhe'},
  {id:'comparativo',label:'Comparativo direto'},
  {id:'preco',label:'Preços e planos'},
  {id:'quando-usar',label:'Quando usar cada um'},
  {id:'ferramentas',label:'Links e recursos'},
  {id:'faq',label:'FAQ'},
  {id:'conclusao',label:'Conclusão'},
];

const TABLE = [
  {c:'Plano gratuito',n:{v:'Sim (self-host)',t:'g'},m:{v:'Sim (1.000 ops)',t:'m'}},
  {c:'Curva de aprendizado',n:{v:'Média/Alta',t:'m'},m:{v:'Baixa',t:'g'}},
  {c:'Self-hosting',n:{v:'Nativo',t:'g'},m:{v:'Não',t:'n'}},
  {c:'Número de integrações',n:{v:'500+',t:'g'},m:{v:'1.500+',t:'g'}},
  {c:'Interface visual',n:{v:'Boa',t:'m'},m:{v:'Excelente',t:'g'}},
  {c:'Controle de fluxo',n:{v:'Avançado',t:'g'},m:{v:'Moderado',t:'m'}},
  {c:'Suporte a IA/LLMs',n:{v:'Nativo + plugins',t:'g'},m:{v:'Via integrações',t:'m'}},
  {c:'Preço no plano pago',n:{v:'€20/mês+',t:'m'},m:{v:'€9/mês+',t:'g'}},
  {c:'Comunidade',n:{v:'Técnica e ativa',t:'g'},m:{v:'Grande e acessível',t:'g'}},
];

const FAQS = [
  {q:'Posso migrar de Make para n8n depois?',a:'Sim, mas não é automático. Você precisará recriar os fluxos manualmente. A lógica é similar, mas a sintaxe e os conectores diferem. Planeje a migração antes de começar, se isso for uma possibilidade.'},
  {q:'n8n é realmente gratuito?',a:'O código é open source e gratuito para self-hosting. Você precisará de um servidor (Railway, Render ou similar — a partir de ~R$25/mês). O plano cloud pago começa em €20/mês para hospedar na infraestrutura deles.'},
  {q:'Make funciona com modelos de linguagem como ChatGPT?',a:'Sim, via integração nativa com OpenAI e outros. É mais limitado que n8n para casos de uso avançados com IA, mas cobre bem os cenários de automação com LLM mais comuns.'},
  {q:'Qual é melhor para iniciantes?',a:'Make. Interface mais visual, curva de aprendizado menor e documentação mais acessível. n8n é poderoso mas exige mais conhecimento técnico para extrair o máximo.'},
];


function ProgressBar(){
  const [p,setP]=React.useState(0);
  React.useEffect(()=>{
    const fn=()=>{const d=document.documentElement;const h=d.scrollHeight-d.clientHeight;setP(h>0?Math.min(100,(d.scrollTop||window.scrollY)/h*100):0)};
    window.addEventListener('scroll',fn,{passive:true});return()=>window.removeEventListener('scroll',fn);
  },[]);
  return <div className="progress-bar" style={{width:`${p}%`}}/>;
}

function Sidebar(){
  const [active,setActive]=React.useState('intro');
  const [email,setEmail]=React.useState('');
  const [done,setDone]=React.useState(false);
  React.useEffect(()=>{
    const obs=new IntersectionObserver(e=>{e.forEach(x=>{if(x.isIntersecting)setActive(x.target.id)})},{rootMargin:'-20% 0% -70% 0%'});
    TOC.forEach(t=>{const el=document.getElementById(t.id);if(el)obs.observe(el)});
    return()=>obs.disconnect();
  },[]);
  const go=id=>{const el=document.getElementById(id);if(el){const y=el.getBoundingClientRect().top+window.scrollY-90;window.scrollTo({top:y,behavior:'smooth'})}};
  return(
    <div className="sidebar-sticky">
      <div className="toc-card">
        <div className="toc-head">Neste comparativo</div>
        <div className="toc-list">
          {TOC.map(t=><div key={t.id} className={`toc-item ${active===t.id?'active':''}`} onClick={()=>go(t.id)}>{t.label}</div>)}
        </div>
      </div>
      <div className="sidebar-nl">
        <div className="sidebar-nl-label">Newsletter</div>
        <div className="sidebar-nl-title">Mais comparativos como este.</div>
        <div className="sidebar-nl-sub">Toda semana, sem hype.</div>
        {done?<div style={{textAlign:'center',padding:'12px 0',fontFamily:'var(--serif)',fontSize:20,color:'var(--amber)'}}>✓ Confirmado!</div>:(
          <form onSubmit={e=>{e.preventDefault();if(email)setDone(true)}}>
            <input className="sidebar-nl-input" type="email" placeholder="seu@email.com" value={email} onChange={e=>setEmail(e.target.value)} required/>
            <button type="submit" className="btn btn-fill" style={{width:'100%',justifyContent:'center',fontSize:13,borderRadius:8,padding:'10px'}}>Quero receber →</button>
          </form>
        )}
      </div>
      <div className="sidebar-ebook">
        <div style={{fontFamily:'var(--mono)',fontSize:10,fontWeight:500,letterSpacing:'.1em',textTransform:'uppercase',color:'var(--amber)',marginBottom:10}}>Ebook relacionado</div>
        <div style={{fontFamily:'var(--serif)',fontSize:17,fontWeight:700,letterSpacing:'-.01em',marginBottom:6,lineHeight:1.3}}>Agentes de IA para Negócios</div>
        <div style={{fontSize:13,color:'var(--text-2)',lineHeight:1.6,marginBottom:14}}>Aprenda a usar essas ferramentas em fluxos com IA.</div>
        <div style={{display:'flex',gap:8,flexDirection:'column'}}>
          <a href="/ebooks" className="btn btn-fill" style={{fontSize:12,padding:'9px 16px',justifyContent:'center',borderRadius:8}}>Comprar — R$ 37 →</a>
        </div>
      </div>
    </div>
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

function Body(){
  return(
    <article className="art-body">
      <div id="intro"/>
      <p className="art-lead">Em 2026, automação deixou de ser diferencial para virar infraestrutura. Mas a escolha entre n8n e Make ainda divide equipes — e a resposta certa depende de contexto, não de benchmark.</p>
      <p>Testamos as duas ferramentas em <strong>cinco cenários reais</strong>: automação de marketing, integração com CRM, pipeline de conteúdo com IA, notificações operacionais e coleta de dados. Este comparativo é o resultado desse processo.</p>
      <div className="callout">
        <strong>Resumo executivo</strong>
        Se você quer facilidade e não quer se preocupar com infraestrutura, <strong>Make</strong>. Se quer controle total, self-hosting e integrações avançadas com IA, <strong>n8n</strong>. Para a maioria dos negócios em crescimento, começar com Make e migrar para n8n faz mais sentido do que o inverso.
      </div>

      <div id="overview"/>
      <h2>Visão geral das ferramentas</h2>
      <div className="verdict-cards">
        {[
          {name:'n8n',tagline:'Automação open source com controle total',winner:false,bars:[{l:'Facilidade',v:58,c:'var(--amber)'},{l:'Controle',v:96,c:'var(--cyan)'},{l:'Integr. IA',v:90,c:'var(--cyan)'},{l:'Custo',v:78,c:'var(--amber)'}],verdict:'Melhor para: equipes técnicas, self-hosting, fluxos complexos com IA.'},
          {name:'Make',tagline:'Automação visual no-code para times ágeis',winner:true,bars:[{l:'Facilidade',v:90,c:'var(--cyan)'},{l:'Controle',v:68,c:'var(--amber)'},{l:'Integr. IA',v:72,c:'var(--amber)'},{l:'Custo',v:88,c:'var(--cyan)'}],verdict:'Melhor para: equipes não-técnicas, prototipagem rápida, integrações simples.'},
        ].map((c,i)=>(
          <div key={i} className={`verdict-card ${c.winner?'winner':''}`}>
            {c.winner&&<div className="verdict-card-badge"><div className="verdict-card-badge-dot"/>Editor's pick</div>}
            <div className="verdict-card-name">{c.name}</div>
            <div className="verdict-card-tagline">{c.tagline}</div>
            <div className="verdict-card-bars">
              {c.bars.map((b,j)=>(
                <div className="vbar-row" key={j}>
                  <span className="vbar-label">{b.l}</span>
                  <div className="vbar-track"><div className="vbar-fill" style={{width:`${b.v}%`,background:b.c}}/></div>
                  <span className="vbar-score">{b.v}</span>
                </div>
              ))}
            </div>
            <div className="verdict-card-verdict">{c.verdict}</div>
          </div>
        ))}
      </div>

      <div id="n8n"/>
      <h2>n8n — automação open source</h2>
      <p>n8n (pronunciado "nodemation") é uma plataforma de automação de fluxos de trabalho open source. O diferencial central é o <strong>self-hosting</strong>: você pode rodar na sua própria infraestrutura, sem pagar por operações, com controle total sobre os dados.</p>
      <h3>O que funciona bem</h3>
      <ul>
        <li>Self-hosting em Railway, Render ou VPS — custo fixo, sem limite de execuções</li>
        <li>Integração nativa com LLMs (GPT-4o, Claude, Gemini) e frameworks de agentes</li>
        <li>Lógica condicional avançada, loops e transformações de dados complexas</li>
        <li>Comunidade técnica ativa com centenas de fluxos prontos no GitHub</li>
      </ul>
      <h3>Pontos de atenção</h3>
      <ul>
        <li>Curva de aprendizado maior — exige algum conforto com JSON e lógica de programação</li>
        <li>Interface menos polida que Make para fluxos simples</li>
        <li>Setup inicial demanda tempo e configuração de servidor</li>
      </ul>
      <div className="callout info">
        <strong>Dica prática</strong>
        Use Railway para hospedar o n8n. Custo de ~R$25/mês e setup em menos de 30 minutos. Vale muito mais que o plano cloud do próprio n8n para a maioria dos casos.
      </div>

      <div id="make"/>
      <h2>Make — automação visual acessível</h2>
      <p>Make (antes Integromat) é a referência em automação no-code para equipes que priorizam velocidade e acessibilidade. Com mais de 1.500 conectores nativos e uma interface visual intuitiva, é possível criar fluxos complexos sem escrever uma linha de código.</p>
      <h3>O que funciona bem</h3>
      <ul>
        <li>Onboarding em minutos — plano gratuito com 1.000 operações/mês</li>
        <li>Interface visual mais clara que n8n para lógica de múltiplos caminhos</li>
        <li>Melhor biblioteca de templates prontos para casos comuns</li>
        <li>Suporte nativo a webhooks, agendamentos e triggers de formulários</li>
      </ul>
      <h3>Pontos de atenção</h3>
      <ul>
        <li>Custo escala com o volume — pode ficar caro em automações intensivas</li>
        <li>Sem self-hosting — seus dados ficam nos servidores da empresa</li>
        <li>Integrações com IA menos robustas que n8n para casos avançados</li>
      </ul>

      <div id="comparativo"/>
      <h2>Comparativo direto</h2>
      <div className="comp-wrap">
        <table className="comp-table">
          <thead><tr>
            <th>Critério</th>
            <th>n8n</th>
            <th>Make</th>
          </tr></thead>
          <tbody>
            {TABLE.map((r,i)=>(
              <tr key={i}>
                <td>{r.c}</td>
                <td><span className={`td-tag ${r.n.t}`}>{r.n.v}</span></td>
                <td><span className={`td-tag ${r.m.t}`}>{r.m.v}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div id="preco"/>
      <h2>Preços e planos</h2>
      <p><strong>n8n Cloud</strong> começa em €20/mês (5.000 execuções). Self-hosted é gratuito — você paga apenas pela infraestrutura. Para a maioria dos projetos, um servidor em Railway custa entre R$25-80/mês.</p>
      <p><strong>Make</strong> tem plano gratuito com 1.000 operações/mês. O plano Core (10.000 ops) custa €9/mês, Pro (100.000 ops) €16/mês. Para automações com alto volume de dados, o custo pode crescer rapidamente.</p>

      <div id="quando-usar"/>
      <h2>Quando usar cada um?</h2>
      <div className="decision-grid">
        {[
          {if:<>Você <strong>está começando</strong> e quer montar sua primeira automação</>,fw:'Make',pill:'m'},
          {if:<>Você quer <strong>controlar os dados</strong> e evitar dependência de cloud</>,fw:'n8n',pill:'c'},
          {if:<>Você quer integrar <strong>agentes de IA</strong> em fluxos complexos</>,fw:'n8n',pill:'c'},
          {if:<>Sua equipe é <strong>não-técnica</strong> e precisa de autonomia</>,fw:'Make',pill:'m'},
          {if:<>Você tem <strong>alto volume</strong> de automações e quer custo previsível</>,fw:'n8n',pill:'c'},
          {if:<>Você quer <strong>prototipar rápido</strong> antes de investir em infra</>,fw:'Make',pill:'m'},
        ].map((d,i)=>(
          <div className="decision-row" key={i}>
            <div className="decision-if">{d.if}</div>
            <div className="decision-fw">
              <span className={`pill ${d.pill}`}>{d.fw}</span>
            </div>
          </div>
        ))}
      </div>

      <div id="ferramentas"/>
      <h2>Links e recursos</h2>
      <div className="art-body" style={{marginBottom:0}}>
        {[
          {ico:'⚡',name:'n8n',desc:'Plataforma open source. Versão cloud ou self-hosted. Melhor para automações técnicas e fluxos com IA.',stars:'★★★★★',aff:true},
          {ico:'🔗',name:'Make',desc:'Melhor interface visual do mercado. Plano gratuito generoso. Ideal para começar rápido.',stars:'★★★★★',aff:true},
        ].map((t,i)=>(
          <div className="tool-cta" key={i}>
            <div className="tool-cta-ico">{t.ico}</div>
            <div style={{flex:1}}>
              <div className="tool-cta-name">{t.name}</div>
              <div className="tool-cta-desc">{t.desc}</div>
              <div className="tool-cta-footer">
                <span className="tool-stars">{t.stars}</span>
                {t.aff&&<span className="aff-badge">Afiliado</span>}
                <a href="/ferramentas" className="arrow-link" style={{fontSize:11,marginLeft:'auto'}}>Testar grátis →</a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Inline ebook CTA */}
      <div className="ebook-inline">
        <div className="ebook-inline-cover">
          <div className="ebook-inline-ico">IA</div>
          <div style={{fontFamily:'var(--mono)',fontSize:8,color:'var(--text-4)',letterSpacing:'.1em',textTransform:'uppercase',textAlign:'center',lineHeight:1.4}}>Tech Briefing<br/>Systems</div>
        </div>
        <div>
          <div className="ebook-inline-eyebrow">Ebook relacionado</div>
          <div className="ebook-inline-title">Agentes de IA para Negócios</div>
          <div className="ebook-inline-desc">Aprenda a estruturar fluxos com n8n, Make e LLMs em processos reais de negócios. 126 páginas + frameworks práticos.</div>
          <div className="ebook-inline-actions">
            <span className="ebook-inline-price">R$ 37</span>
            <a href="/ebooks" className="btn btn-fill" style={{fontSize:13,padding:'10px 20px'}}>Comprar na Amazon →</a>
            <a href="/ebooks" className="btn btn-stroke" style={{fontSize:13}}>Comprar direto</a>
          </div>
        </div>
      </div>

      <div id="faq"/>
      <h2>FAQ</h2>
      <div className="faq-list">
        {FAQS.map((f,i)=><FaqItem key={i} q={f.q} a={f.a}/>)}
      </div>
      <div className="art-divider"/>

      <div id="conclusao"/>
      <h2>Conclusão</h2>
      <p>Se eu precisasse escolher uma ferramenta para alguém que está começando, escolheria <strong>Make</strong>. Mais fácil, mais rápido para validar, plano gratuito real. Se a pessoa já tem alguma maturidade técnica e quer construir algo sério com IA — ou evitar custos recorrentes — <strong>n8n self-hosted</strong> é a escolha mais inteligente a médio prazo.</p>
      <p>O melhor cenário? Use Make para prototipar. Quando os fluxos estiverem validados, migre os mais críticos para n8n.</p>
    </article>
  );
}


function App(){
  return(
    <>
      <ProgressBar/>
      <div className="bc"><div className="wrap"><div className="bc-inner">
        <a href="/" className="bc-a">Home</a>
        <span className="bc-sep">›</span>
        <a href="/comparativos/n8n-vs-make/" className="bc-a">Comparativos</a>
        <span className="bc-sep">›</span>
        <span className="bc-cur">n8n vs Make</span>
      </div></div></div>
      <header className="art-header">
        <div className="art-header-inner">
          <div className="art-tags"><span className="pill a">Comparativo</span><span className="pill">Automação</span><span className="pill">Ferramentas</span></div>
          <h1 className="art-title">n8n vs Make: qual ferramenta de automação escolher em 2026?</h1>
          <p className="art-subtitle">Testamos as duas em cinco cenários reais — marketing, CRM, pipeline de IA, notificações e coleta de dados. Este é o comparativo honesto que você precisava.</p>
          <div className="art-meta">
            <div className="art-author">
              <div className="art-avatar">LF</div>
              <div><div className="art-author-name">Lucas Faria</div><div className="art-author-role">Editor · Tech Briefing</div></div>
            </div>
            <div className="art-meta-divider"/>
            <div className="art-meta-items">
              {[{l:'Publicado',v:'29 abr 2026'},{l:'Atualizado',v:'29 abr 2026'},{l:'Leitura',v:'12 min'}].map((m,i)=>(
                <div className="art-meta-item" key={i}><span className="art-meta-label">{m.l}</span><span className="art-meta-val">{m.v}</span></div>
              ))}
            </div>
          </div>
          <div className="art-share">
            <span className="art-share-label">Compartilhar</span>
            {['𝕏 Twitter','LinkedIn','Copiar link'].map(l=><button key={l} className="share-btn">{l}</button>)}
          </div>
        </div>
      </header>
      <div style={{borderBottom:'1px solid var(--line-s)'}}>
        <div className="art-layout">
          <div className="art-body-wrap"><Body/></div>
          <div className="art-sidebar"><Sidebar/></div>
        </div>
      </div>
      <section className="related">
        <div className="wrap">
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:36}}>
            <div style={{fontFamily:'var(--serif)',fontSize:'clamp(22px,3vw,32px)',fontWeight:700,letterSpacing:'-.02em'}}>Leitura complementar</div>
            <a href="/ferramentas" className="arrow-link">Ver ferramentas →</a>
          </div>
          <div className="related-grid">
            {[
              {tag:'Agentes',v:'c',title:'AutoGPT, CrewAI ou LangGraph? Guia definitivo 2026',meta:'28 abr · 14 min',href:'/artigos/autogpt-crewai-langgraph/'},
              {tag:'Tutorial',v:'c',title:'Como criar um agente de IA com n8n + GPT-4o',meta:'25 abr · 9 min',href:'/agentes'},
              {tag:'Guia',v:'a',title:'Automação para freelancers: do zero ao sistema em 7 dias',meta:'20 abr · 11 min',href:'/agentes'},
            ].map((r,i)=>(
              <a href={r.href} className="rel-card" key={i}>
                <div className="rel-card-img" style={{fontFamily:'var(--mono)',fontSize:11,color:'var(--text-4)',padding:'8px 12px',border:'1px solid var(--line-s)',borderRadius:4}}>imagem</div>
                <div className="rel-card-body">
                  <span className={`pill ${r.v}`}>{r.tag}</span>
                  <div className="rel-card-title">{r.title}</div>
                  <div className="rel-card-meta">{r.meta}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
      </>
  );
}



export default App;
