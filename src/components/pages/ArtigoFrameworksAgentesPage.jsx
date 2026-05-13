import React from 'react';




/* ── DATA ──────────────────────────────── */
const TOC = [
  {id:'intro',label:'Introdução'},
  {id:'o-que-sao',label:'O que são esses frameworks?'},
  {id:'autogpt',label:'AutoGPT'},
  {id:'crewai',label:'CrewAI'},
  {id:'langgraph',label:'LangGraph'},
  {id:'comparativo',label:'Comparativo direto'},
  {id:'quando-usar',label:'Quando usar cada um?'},
  {id:'ferramentas',label:'Ferramentas citadas'},
  {id:'faq',label:'FAQ'},
  {id:'conclusao',label:'Conclusão'},
];

const FRAMEWORKS = [
  {
    name:'AutoGPT',label:'Pioneiro',
    tagline:'O agente autônomo original. Bom para tarefas abertas, mas exige infraestrutura e paciência.',
    metrics:[
      {l:'Facilidade',v:72,c:'var(--amber)'},
      {l:'Autonomia',v:95,c:'var(--cyan)'},
      {l:'Controle',v:40,c:'var(--text-3)'},
      {l:'Maturidade',v:78,c:'var(--amber)'},
    ],
    verdict:'Melhor para: exploração, pesquisa automatizada e tarefas que toleram falhas.',
    pill:{l:'Open Source',v:''},
  },
  {
    name:'CrewAI',label:'Mais indicado',featured:true,
    tagline:'Multi-agente com papéis definidos. O equilíbrio certo entre simplicidade e poder.',
    metrics:[
      {l:'Facilidade',v:85,c:'var(--cyan)'},
      {l:'Autonomia',v:78,c:'var(--amber)'},
      {l:'Controle',v:70,c:'var(--amber)'},
      {l:'Maturidade',v:82,c:'var(--cyan)'},
    ],
    verdict:'Melhor para: workflows multi-agente com papéis claros e tarefas colaborativas.',
    pill:{l:'Recomendado',v:'c'},
  },
  {
    name:'LangGraph',label:'Avançado',
    tagline:'Controle máximo sobre o fluxo. Ideal para sistemas complexos que precisam de precisão.',
    metrics:[
      {l:'Facilidade',v:45,c:'var(--text-3)'},
      {l:'Autonomia',v:70,c:'var(--amber)'},
      {l:'Controle',v:98,c:'var(--cyan)'},
      {l:'Maturidade',v:88,c:'var(--cyan)'},
    ],
    verdict:'Melhor para: sistemas de produção que precisam de controle fino e auditabilidade.',
    pill:{l:'Pro',v:'a'},
  },
];

const TABLE_DATA = [
  {criterio:'Curva de aprendizado',autogpt:{v:'Média',t:'m'},crewai:{v:'Baixa',t:'b'},langgraph:{v:'Alta',t:'n'}},
  {criterio:'Controle de fluxo',autogpt:{v:'Limitado',t:'n'},crewai:{v:'Médio',t:'m'},langgraph:{v:'Total',t:'b'}},
  {criterio:'Multi-agente nativo',autogpt:{v:'Parcial',t:'m'},crewai:{v:'Sim',t:'b'},langgraph:{v:'Sim',t:'b'}},
  {criterio:'Deploy em produção',autogpt:{v:'Complexo',t:'n'},crewai:{v:'Moderado',t:'m'},langgraph:{v:'Robusto',t:'b'}},
  {criterio:'Debugging & observ.',autogpt:{v:'Fraco',t:'n'},crewai:{v:'Médio',t:'m'},langgraph:{v:'Excelente',t:'b'}},
  {criterio:'Comunidade',autogpt:{v:'Grande',t:'b'},crewai:{v:'Crescendo',t:'m'},langgraph:{v:'Técnica',t:'m'}},
  {criterio:'Custo de uso',autogpt:{v:'Alto',t:'n'},crewai:{v:'Médio',t:'m'},langgraph:{v:'Variável',t:'m'}},
];

const FAQS = [
  {q:'Preciso saber programar para usar esses frameworks?',a:'Para AutoGPT e CrewAI, conhecimentos básicos em Python são suficientes para começar. LangGraph exige um nível mais avançado — você precisa entender grafos, estados e callbacks. Se não quer programar, considere Relevance AI ou n8n com IA.'},
  {q:'Qual consome menos tokens e é mais barato de rodar?',a:'LangGraph tende a ser mais econômico porque você controla exatamente o que é passado ao LLM a cada etapa. AutoGPT é o mais caro — ele frequentemente faz chamadas desnecessárias. CrewAI fica no meio-termo.'},
  {q:'Posso usar modelos de linguagem locais com esses frameworks?',a:'Sim, os três suportam modelos locais via Ollama ou LM Studio. CrewAI tem a integração mais simples. LangGraph é o mais flexível para customização do provedor de LLM.'},
  {q:'Qual é mais estável para produção hoje?',a:'LangGraph é o mais maduro para produção — tem suporte oficial da LangChain, LangSmith para observabilidade e uma API de deploy robusta. CrewAI está crescendo rápido e já tem casos de uso em produção sólidos. AutoGPT ainda é mais experimental.'},
  {q:'Vale a pena usar os três juntos?',a:'Alguns casos avançados combinam LangGraph como orquestrador de alto nível com agentes CrewAI como "workers" internos. É uma arquitetura poderosa mas adiciona complexidade — recomendada só para quem já domina cada um individualmente.'},
];

const RELATED = [
  {tag:'Tutorial',v:'c',title:'Construindo um agente de pesquisa com n8n e Claude 3.7',date:'26 abr',rt:'10 min',href:'/artigos/como-criar-agente-ia-sem-codigo',image:'/images/article-ai-agent.png'},
  {tag:'Comparativo',v:'',title:'Relevance AI vs Voiceflow: qual plataforma para seus agentes?',date:'11 abr',rt:'9 min',href:'/comparativos/relevance-ai-vs-voiceflow',image:'/images/article-scenario.png'},
  {tag:'Guia',v:'a',title:'RAG com agentes: quando recuperar contexto muda tudo',date:'14 abr',rt:'11 min',href:'/artigos/rag-explicado-guia-pratico',image:'/images/article-components.png'},
];

/* ── COMPONENTS ────────────────────────── */

function ProgressBar(){
  const [pct,setPct]=React.useState(0);
  React.useEffect(()=>{
    const fn=()=>{
      const el=document.documentElement;
      const s=el.scrollTop||document.body.scrollTop;
      const h=el.scrollHeight-el.clientHeight;
      setPct(h>0?Math.min(100,Math.round((s/h)*100)):0);
    };
    window.addEventListener('scroll',fn,{passive:true});
    return()=>window.removeEventListener('scroll',fn);
  },[]);
  return <div className="progress-bar" style={{width:`${pct}%`}}/>;
}


function Breadcrumb(){
  return (
    <div className="breadcrumb">
      <div className="wrap">
        <div className="bc-inner">
          <a href="/" className="bc-link">Home</a>
          <span className="bc-sep">›</span>
          <a href="/agentes-de-ia" className="bc-link">Agentes de IA</a>
          <span className="bc-sep">›</span>
          <span className="bc-cur">AutoGPT, CrewAI ou LangGraph?</span>
        </div>
      </div>
    </div>
  );
}

function ArticleHeader(){
  return (
    <header className="art-header">
      <div className="art-header-inner">
        <div className="art-tags">
          <span className="pill c">Agentes de IA</span>
          <span className="pill a">Comparativo</span>
          <span className="pill">Framework</span>
        </div>
        <h1 className="art-title">AutoGPT, CrewAI ou LangGraph? Guia definitivo para escolher o framework certo em 2026</h1>
        <p className="art-subtitle">
          Testamos os três em cenários reais — automação, análise de dados e suporte ao cliente. Este é o comparativo mais completo que você vai encontrar para tomar a decisão certa.
        </p>
        <div className="art-meta">
          <div className="art-author">
            <div className="art-avatar">LF</div>
            <div>
              <div className="art-author-name">Lucas Faria</div>
              <div className="art-author-role">Editor · Tech Briefing</div>
            </div>
          </div>
          <div className="art-meta-divider"/>
          <div className="art-meta-items">
            {[
              {label:'Publicado em',val:'28 abr 2026'},
              {label:'Atualizado',val:'28 abr 2026'},
              {label:'Leitura',val:'14 min'},
            ].map((m,i)=>(
              <div className="art-meta-item" key={i}>
                <span className="art-meta-label">{m.label}</span>
                <span className="art-meta-val">{m.val}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="art-share">
          <span className="art-share-label">Compartilhar</span>
          {['𝕏 Twitter','LinkedIn','Copiar link'].map(l=>(
            <button key={l} className="share-btn">{l}</button>
          ))}
        </div>
      </div>
    </header>
  );
}

function FwCards(){
  return (
    <div className="fw-cards">
      {FRAMEWORKS.map((f,i)=>(
        <div key={i} className={`fw-card ${f.featured?'featured':''}`}>
          <div className="fw-badge">
            <span className={`pill ${f.pill.v}`}>{f.pill.l}</span>
            {f.featured && <span style={{fontFamily:'var(--mono)',fontSize:10,color:'var(--cyan)',letterSpacing:'.08em',textTransform:'uppercase'}}>★ Editor's pick</span>}
          </div>
          <div>
            <div className="fw-card-label">{f.label}</div>
            <div className="fw-name">{f.name}</div>
          </div>
          <div className="fw-tagline">{f.tagline}</div>
          <div className="fw-metrics">
            {f.metrics.map((m,j)=>(
              <div className="fw-metric-row" key={j}>
                <span className="fw-metric-label">{m.l}</span>
                <div className="fw-bar-wrap">
                  <div className="fw-bar" style={{width:`${m.v}%`,background:m.c}}/>
                </div>
                <span className="fw-score">{m.v}</span>
              </div>
            ))}
          </div>
          <div className="fw-verdict">{f.verdict}</div>
        </div>
      ))}
    </div>
  );
}

function CompTable(){
  return (
    <div className="comp-table-wrap">
      <table className="comp-table">
        <thead>
          <tr>
            <th>Critério</th>
            <th>AutoGPT</th>
            <th>CrewAI</th>
            <th>LangGraph</th>
          </tr>
        </thead>
        <tbody>
          {TABLE_DATA.map((r,i)=>(
            <tr key={i}>
              <td>{r.criterio}</td>
              <td><span className={`td-tag ${r.autogpt.t}`}>{r.autogpt.v}</span></td>
              <td><span className={`td-tag ${r.crewai.t}`}>{r.crewai.v}</span></td>
              <td><span className={`td-tag ${r.langgraph.t}`}>{r.langgraph.v}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DecisionGuide(){
  return (
    <div className="decision-grid">
      {[
        {fw:'AutoGPT',if:'Se você quer explorar',desc:'Prototipagem rápida, tarefas abertas sem resultado previsível, pesquisa automatizada. Não use em produção ainda.',featured:false},
        {fw:'CrewAI',if:'Se você quer escalar',desc:'Times de agentes com papéis definidos, pipelines de conteúdo, atendimento e automações colaborativas.',featured:true},
        {fw:'LangGraph',if:'Se você precisa de controle',desc:'Sistemas críticos, fluxos auditáveis, aplicações que precisam de comportamento determinístico.',featured:false},
      ].map((d,i)=>(
        <div key={i} className={`decision-card ${d.featured?'featured':''}`}>
          <div className="decision-if">{d.if}</div>
          <div className="decision-title">{d.fw}</div>
          <div className="decision-desc">{d.desc}</div>
        </div>
      ))}
    </div>
  );
}

function FaqSection(){
  const [open,setOpen]=React.useState(null);
  return (
    <div className="faq-list">
      {FAQS.map((f,i)=>(
        <div className="faq-item" key={i}>
          <div className="faq-q" onClick={()=>setOpen(open===i?null:i)}>
            <span>{f.q}</span>
            <span className={`faq-icon ${open===i?'open':''}`}>+</span>
          </div>
          <div className={`faq-a ${open===i?'open':''}`}>
            <div className="faq-a-inner">{f.a}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ArticleBody(){
  return (
    <div className="art-body">
      <div id="intro"/>
      <p className="art-lead">
        Em 2024, a maioria das pessoas ainda falava em "usar ChatGPT". Em 2026, a conversa mudou: agora o desafio é <strong>construir agentes de IA que trabalham por você</strong> — e a escolha do framework certo pode definir se o seu sistema funciona ou falha.
      </p>
      <p>
        AutoGPT, CrewAI e LangGraph são os três frameworks mais populares hoje para criar agentes de IA. Cada um tem uma filosofia diferente, uma curva de aprendizado diferente e casos de uso muito específicos. Neste guia, vamos desmistificar cada um com base em testes reais.
      </p>

      <div id="o-que-sao"/>
      <h2>O que são esses frameworks — e por que você precisa de um</h2>
      <p>
        Um agente de IA não é um chatbot. É um sistema que <strong>planeja, executa ações e se adapta</strong> baseado nos resultados. Para construir isso, você precisa de uma infraestrutura que gerencie o loop de raciocínio do modelo, as ferramentas disponíveis, a memória e o fluxo de execução.
      </p>
      <p>
        É exatamente isso que esses frameworks fazem. A diferença está em <em>quanta liberdade versus controle</em> eles te dão.
      </p>
      <div className="callout">
        <strong>Definição rápida</strong>
        Framework de agente = a "cola" entre o modelo de linguagem, as ferramentas externas e a lógica de tomada de decisão. Sem um bom framework, você está reinventando a roda a cada projeto.
      </div>

      <div id="autogpt"/>
      <h2>AutoGPT — O pioneiro autônomo</h2>
      <p>
        Lançado em abril de 2023, o AutoGPT foi o primeiro projeto a mostrar ao mundo o que agentes autônomos podiam fazer. A ideia é simples: você define um objetivo, e o agente decide sozinho como alcançá-lo — quebrando em sub-tarefas, usando ferramentas, avaliando os resultados.
      </p>
      <h3>O que funciona bem</h3>
      <ul>
        <li>Ideal para tarefas exploratórias sem resultado muito definido</li>
        <li>Interface web (AutoGPT Platform) acessível para não-devs</li>
        <li>Grande comunidade com muitos plugins e extensões</li>
        <li>Boa para automação de pesquisa e coleta de dados</li>
      </ul>
      <h3>Onde tropeça</h3>
      <ul>
        <li>Alto consumo de tokens — o agente frequentemente "se perde" em loops</li>
        <li>Pouco controle sobre o fluxo — difícil de prever o que vai acontecer</li>
        <li>Instável em produção — melhor para protótipos e experimentos</li>
      </ul>
      <div className="callout info">
        <strong>Dica prática</strong>
        Use AutoGPT para provar conceitos e entender o que é possível. Quando for escalar, migre para CrewAI ou LangGraph.
      </div>

      <div id="crewai"/>
      <h2>CrewAI — Times de agentes que colaboram</h2>
      <p>
        O CrewAI trouxe uma metáfora poderosa: um <em>crew</em> (tripulação) de agentes especializados, cada um com um papel definido, trabalhando juntos para completar uma missão. Em vez de um único agente tentando fazer tudo, você define um pesquisador, um escritor, um revisor — e eles colaboram.
      </p>
      <h3>O que funciona bem</h3>
      <ul>
        <li>API limpa e intuitiva — mais fácil de aprender que LangGraph</li>
        <li>Fluxos sequenciais e hierárquicos nativos</li>
        <li>Agentes com memória, papéis e objetivos claros</li>
        <li>Ótimo para pipelines de conteúdo, análise e atendimento</li>
      </ul>
      <h3>Onde tropeça</h3>
      <ul>
        <li>Menos controle granular que LangGraph para fluxos complexos</li>
        <li>Debugging ainda limitado sem ferramentas externas</li>
        <li>Versões mudam rápido — API não totalmente estável</li>
      </ul>

      <div id="langgraph"/>
      <h2>LangGraph — Controle total para produção</h2>
      <p>
        Se CrewAI é uma orquestra, LangGraph é a partitura. Você define cada estado possível do sistema, as transições entre eles e as condições que determinam qual caminho seguir. É mais verboso, mas o resultado é um sistema <strong>determinístico, auditável e robusto</strong>.
      </p>
      <p>
        O LangGraph é mantido pela equipe da LangChain e se integra nativamente com o LangSmith para observabilidade — o que o torna a escolha mais madura para ambientes de produção.
      </p>
      <div className="callout">
        <strong>Quando usar LangGraph</strong>
        Quando o comportamento do agente precisa ser previsível. Quando você precisa auditar cada decisão. Quando o sistema vai interagir com dados críticos ou dinheiro real.
      </div>
      <FwCards/>

      <div id="comparativo"/>
      <h2>Comparativo direto</h2>
      <p>
        A tabela abaixo consolida nossa avaliação nos 7 critérios mais relevantes para quem está escolhendo um framework para uso real.
      </p>
      <CompTable/>
      <p>
        <span className="code-badge">b azul</span> = melhor opção &nbsp;
        <span className="code-badge">âmbar</span> = médio &nbsp;
        <span className="code-badge">neutro</span> = ponto fraco
      </p>

      <div id="quando-usar"/>
      <h2>Quando usar cada um?</h2>
      <p>
        A escolha certa depende mais do seu contexto do que de qual framework é "melhor". Use este guia de decisão:
      </p>
      <DecisionGuide/>

      <div className="art-divider"/>

      <div id="ferramentas"/>
      <h2>Ferramentas citadas neste artigo</h2>
      <p>Essas são as ferramentas que usamos nos testes e que recomendamos para cada cenário:</p>
      {[
        {ico:'🤖',name:'Relevance AI',desc:'Para criar agentes sem código. Abstraí o LangGraph por baixo com uma interface visual excelente.',stars:'★★★★★',aff:true},
        {ico:'⚙️',name:'LangSmith',desc:'Observabilidade para LangGraph e LangChain. Essencial para debug em produção.',stars:'★★★★☆',aff:false},
        {ico:'🔗',name:'n8n',desc:'Para orquestrar agentes CrewAI com integrações no-code. Melhor combo para equipes técnicas.',stars:'★★★★★',aff:true},
      ].map((t,i)=>(
        <div className="tool-inline" key={i}>
          <div className="tool-inline-ico">{t.ico}</div>
          <div style={{flex:1}}>
            <div className="tool-inline-name">{t.name}</div>
            <div className="tool-inline-desc">{t.desc}</div>
            <div className="tool-inline-footer">
              <span className="tool-inline-stars">{t.stars}</span>
              {t.aff && <span className="tool-inline-aff">Afiliado</span>}
              <a href="#" className="arrow-link" style={{fontSize:11,marginLeft:'auto'}}>Testar grátis →</a>
            </div>
          </div>
        </div>
      ))}

      <div className="art-divider"/>

      <div id="faq"/>
      <h2>Perguntas frequentes</h2>
      <FaqSection/>

      <div className="art-divider"/>

      <div id="conclusao"/>
      <h2>Conclusão</h2>
      <p>
        Não existe framework perfeito. Existe o framework certo para o seu caso de uso. Se você está começando, <strong>CrewAI</strong> é a melhor porta de entrada — você aprende os conceitos sem se perder na complexidade. Se vai para produção com requisitos sérios, invista tempo no <strong>LangGraph</strong>. E se quer explorar sem comprometimento, <strong>AutoGPT</strong> ainda é divertido.
      </p>
      <p>
        O mais importante: comece simples. Valide o caso de uso com um agente de tarefa única antes de construir uma orquestra de multi-agentes. A maioria dos problemas não precisa de 5 agentes — um bem construído resolve.
      </p>
      <div className="art-cta">
        <div className="art-cta-eyebrow">Próximo passo</div>
        <div className="art-cta-title">Construa seu primeiro agente<br/><em>em menos de uma hora.</em></div>
        <div className="art-cta-sub">Nosso guia prático te leva do zero ao agente funcionando com CrewAI — sem precisar de experiência prévia com IA.</div>
        <div className="art-cta-actions">
          <button className="btn btn-fill">Ver o tutorial completo →</button>
          <button className="btn btn-stroke">Explorar mais guias</button>
        </div>
      </div>
    </div>
  );
}

function Sidebar(){
  const [activeId,setActiveId]=React.useState('intro');
  const [email,setEmail]=React.useState('');
  const [nlDone,setNlDone]=React.useState(false);

  React.useEffect(()=>{
    const ids=TOC.map(t=>t.id);
    const obs=new IntersectionObserver(entries=>{
      entries.forEach(e=>{
        if(e.isIntersecting) setActiveId(e.target.id);
      });
    },{rootMargin:'-20% 0% -70% 0%'});
    ids.forEach(id=>{
      const el=document.getElementById(id);
      if(el) obs.observe(el);
    });
    return()=>obs.disconnect();
  },[]);

  const scrollTo=id=>{
    const el=document.getElementById(id);
    if(el){
      const y=el.getBoundingClientRect().top+window.scrollY-90;
      window.scrollTo({top:y,behavior:'smooth'});
    }
  };

  return (
    <div className="sidebar-sticky">
      <div className="toc-card">
        <div className="toc-head">Neste artigo</div>
        <div className="toc-list">
          {TOC.map(t=>(
            <div key={t.id} className={`toc-item ${activeId===t.id?'active':''}`} onClick={()=>scrollTo(t.id)}>
              {t.label}
            </div>
          ))}
        </div>
      </div>
      <div className="sidebar-nl">
        <div className="sidebar-nl-label">Newsletter</div>
        <div className="sidebar-nl-title">Mais guias como este.</div>
        <div className="sidebar-nl-sub">Toda semana, sem hype.</div>
        {nlDone ? (
          <div style={{textAlign:'center',padding:'12px 0',fontFamily:'var(--serif)',fontSize:20,color:'var(--amber)'}}>✓ Confirmado!</div>
        ):(
          <form onSubmit={e=>{e.preventDefault();if(email)setNlDone(true)}}>
            <input className="sidebar-nl-input" type="email" placeholder="seu@email.com" value={email} onChange={e=>setEmail(e.target.value)} required/>
            <button type="submit" className="btn btn-fill" style={{width:'100%',justifyContent:'center',fontSize:13,borderRadius:8,padding:'11px'}}>Quero receber →</button>
          </form>
        )}
      </div>
      <div className="sidebar-share">
        <div className="sidebar-share-label">Compartilhar</div>
        <div className="share-row">
          {[['𝕏','Twitter'],['in','LinkedIn'],['🔗','Copiar link']].map(([ic,l])=>(
            <div key={l} className="share-item"><span className="share-item-icon">{ic}</span>{l}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RelatedArticles(){
  return (
    <section className="related">
      <div className="wrap">
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:0}}>
          <div>
            <div style={{fontFamily:'var(--mono)',fontSize:11,fontWeight:500,letterSpacing:'.1em',textTransform:'uppercase',color:var_text_3,marginBottom:8}}>Continue lendo</div>
            <div style={{fontFamily:'var(--serif)',fontSize:'clamp(26px,3vw,36px)',fontWeight:700,letterSpacing:'-.02em',color:'var(--text)'}}>Artigos relacionados</div>
          </div>
          <a href="/agentes-de-ia" className="arrow-link">Ver categoria →</a>
        </div>
        <div className="related-grid">
          {RELATED.map((r,i)=>(
            <a className="rel-card" href={r.href} key={i}>
              <div className="rel-card-img">
                <img src={r.image} alt={r.title} loading="lazy"/>
              </div>
              <div className="rel-card-body">
                <span className={`pill ${r.v}`}>{r.tag}</span>
                <div className="rel-card-title">{r.title}</div>
                <div className="rel-card-meta">{r.date} · {r.rt} de leitura</div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

const var_text_3 = 'var(--text-3)';


function App(){
  return (
    <>
      <ProgressBar/>
      <Breadcrumb/>
      <ArticleHeader/>
      <div style={{borderBottom:'1px solid var(--line-s)'}}>
        <div className="art-layout">
          <div className="art-body-wrap">
            <ArticleBody/>
          </div>
          <div className="art-sidebar">
            <Sidebar/>
          </div>
        </div>
      </div>
      <RelatedArticles/>
      </>
  );
}




export default App;
