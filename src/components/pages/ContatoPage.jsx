import React from 'react';




function ContactForm(){
  const [form,setForm]=React.useState({nome:'',email:'',assunto:'editorial',msg:''});
  const [done,setDone]=React.useState(false);
  const set=k=>e=>setForm(f=>({...f,[k]:e.target.value}));
  if(done) return(
    <div className="form-success">
      <div className="form-success-icon">✓</div>
      <div className="form-success-title">Mensagem enviada.</div>
      <div className="form-success-sub">Respondemos em até 3 dias úteis. Obrigado pelo contato.</div>
    </div>
  );
  return(
    <form onSubmit={e=>{e.preventDefault();if(form.nome&&form.email&&form.msg)setDone(true)}}>
      <div className="form-row">
        <div>
          <label className="form-label">Nome</label>
          <input className="form-input" type="text" placeholder="Seu nome" value={form.nome} onChange={set('nome')} required/>
        </div>
        <div>
          <label className="form-label">E-mail</label>
          <input className="form-input" type="email" placeholder="seu@email.com" value={form.email} onChange={set('email')} required/>
        </div>
      </div>
      <label className="form-label">Assunto</label>
      <select className="form-input form-select" value={form.assunto} onChange={set('assunto')}>
        <option value="editorial">Sugestão editorial</option>
        <option value="parceria">Parceria e colaboração</option>
        <option value="anuncio">Anunciar no Tech Briefing</option>
        <option value="afiliado">Programa de afiliados</option>
        <option value="imprensa">Imprensa e media</option>
        <option value="outro">Outro</option>
      </select>
      <label className="form-label">Mensagem</label>
      <textarea className="form-input form-textarea" placeholder="Descreva sua mensagem..." value={form.msg} onChange={set('msg')} required/>
      <button type="submit" className="btn btn-fill" style={{width:'100%',justifyContent:'center',padding:'14px',borderRadius:10,fontSize:15}}>Enviar mensagem →</button>
      <div className="form-note">Respondemos em até 3 dias úteis. Seus dados não são compartilhados.</div>
    </form>
  );
}


function App(){
  return(
    <>
      <div className="bc"><div className="wrap"><div className="bc-inner">
        <a href="/" className="bc-a">Home</a>
        <span className="bc-sep">›</span>
        <span className="bc-cur">Contato</span>
      </div></div></div>
      <div className="wrap">
        <div className="contact-layout">
          <div>
            <h1 className="contact-left-title">Fale com<br/><em>a gente.</em></h1>
            <p className="contact-left-sub">Sugestões, parcerias, anúncios ou só um feedback honesto — estamos disponíveis. Respondemos toda mensagem em até 3 dias úteis.</p>
            <div className="contact-options">
              {[
                {ico:'✉️',title:'E-mail geral',desc:'contato@iaworld.com.br'},
                {ico:'🤝',title:'Parcerias e anúncios',desc:'Acesso ao media kit e formatos disponíveis'},
                {ico:'📋',title:'Programa de afiliados',desc:'Indique ferramentas e ganhe comissão'},
                {ico:'🌐',title:'Imprensa',desc:'Entrevistas, dados e contato editorial'},
              ].map((o,i)=>(
                <div className="contact-opt" key={i}>
                  <div className="contact-opt-ico">{o.ico}</div>
                  <div>
                    <div className="contact-opt-title">{o.title}</div>
                    <div className="contact-opt-desc">{o.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="form-card">
            <div style={{fontFamily:'var(--mono)',fontSize:11,fontWeight:500,letterSpacing:'.1em',textTransform:'uppercase',color:'var(--text-3)',marginBottom:20}}>Formulário de contato</div>
            <ContactForm/>
          </div>
        </div>
      </div>
      </>
  );
}



export default App;
