/* ================================================================
   src/cadastro/cadastro.jsx — Componente React do Cadastro
   ================================================================
   Funções disponíveis via script.js:
     realizarCadastro(campos)    → POST /api/auth/cadastro
     validarCamposCadastro(campos) → validação local
     calcularForcaSenha(senha)   → retorna { nivel, texto, cor, largura }
     irParaLogin()               → navega para view de login
     notificarCadastroOk(usuario) → notifica o react.jsx raiz
   ================================================================ */

const { useState, useEffect } = React;

function ViewCadastro() {

  /* ---- ESTADO DOS CAMPOS DO FORMULÁRIO ---- */
  const [nome,            setNome]            = useState('');
  const [email,           setEmail]           = useState('');
  const [telefone,        setTelefone]        = useState('');
  const [senha,           setSenha]           = useState('');
  const [confirmarSenha,  setConfirmarSenha]  = useState('');
  const [senhaVisivel,    setSenhaVisivel]    = useState(false);
  const [aceitouTermos,   setAceitouTermos]   = useState(false);

  /* Dados vindos do Google/Apple (pré-preenchidos) */
  const [provedorAuth,    setProvedorAuth]    = useState('email');
  const [dadosVindos,     setDadosVindos]     = useState(null); /* exibe badge informativo */

  /* Força da senha calculada em tempo real */
  const [forcaSenha,      setForcaSenha]      = useState(null);

  /* Estado de submissão */
  const [carregando,      setCarregando]      = useState(false);
  const [alerta,          setAlerta]          = useState(null); /* { texto, tipo } */

  /* ---- RECEBE DADOS PRÉ-PREENCHIDOS DO LOGIN SOCIAL ---- */
  useEffect(function() {
    /*
      Escuta mensagens do react.jsx raiz.
      Quando o usuário tenta logar com Google/Apple e não existe,
      o login.jsx envia postMessage com os dados para pré-preencher.
    */
    function ouvirDadosPreenchidos(evento) {
      var msg = evento.data;
      if (msg && msg.tipo === 'PRE_PREENCHER_CADASTRO' && msg.dados) {
        var d = msg.dados;
        if (d.nome)  setNome(d.nome);
        if (d.email) setEmail(d.email);
        if (d.provedorAuth) setProvedorAuth(d.provedorAuth);
        setDadosVindos(d);
      }
    }

    window.addEventListener('message', ouvirDadosPreenchidos);
    return function() { window.removeEventListener('message', ouvirDadosPreenchidos); };
  }, []);

  /* Atualiza barra de força da senha em tempo real */
  useEffect(function() {
    if (senha) {
      setForcaSenha(calcularForcaSenha(senha)); /* função do script.js */
    } else {
      setForcaSenha(null);
    }
  }, [senha]);

  /* ---- SUBMIT DO FORMULÁRIO ---- */
  async function aoSubmeter(evento) {
    evento.preventDefault();
    setAlerta(null);

    /* Monta o objeto de campos para validação */
    var campos = {
      nome:           nome,
      email:          email,
      senha:          senha,
      confirmarSenha: confirmarSenha,
      aceitouTermos:  aceitouTermos,
      provedorAuth:   provedorAuth
    };

    /* Valida localmente antes de chamar a API */
    var erros = validarCamposCadastro(campos); /* função do script.js */
    if (erros.length > 0) {
      setAlerta({ texto: erros[0], tipo: 'erro' }); /* mostra o primeiro erro */
      return;
    }

    setCarregando(true);

    try {
      /*
        realizarCadastro() está no script.js → POST /api/auth/cadastro
        Retorna { token, usuario } se sucesso.
      */
      var resultado = await realizarCadastro(campos);

      setAlerta({ texto: 'Conta criada! Bem-vindo ao Wake Up Now! ✓', tipo: 'sucesso' });

      /* Notifica o app raiz que pode fazer login automaticamente */
      setTimeout(function() {
        notificarCadastroOk(resultado.usuario); /* função do script.js */
      }, 1200);

    } catch (erro) {
      setAlerta({ texto: erro.message, tipo: 'erro' });
    } finally {
      setCarregando(false);
    }
  }

  /* ---- RENDERIZAÇÃO ---- */
  return (
    <div className="cadastro-pagina">
      <div className="cadastro-pagina__orb"></div>

      <div className="cadastro-card">

        {/* Cabeçalho */}
        <div className="cadastro-card__header">
          <h1 className="cadastro-card__titulo">Criar sua conta</h1>
          <p className="cadastro-card__sub">
            Preencha os dados abaixo para começar
            {provedorAuth !== 'email' && ' — dados do ' + provedorAuth + ' foram importados'}
          </p>
        </div>

        {/* Badge informativo se dados vieram do Google/Apple */}
        {dadosVindos && provedorAuth !== 'email' && (
          <div className="badge-preenchido">
            {provedorAuth === 'google' ? '🔵' : '⚫'}
            Dados importados do {provedorAuth === 'google' ? 'Google' : 'Apple'}.
            Complete o cadastro para continuar.
          </div>
        )}

        {/* Alerta */}
        {alerta && (
          <div className={'alerta alerta--' + alerta.tipo} style={{ marginBottom: '16px' }}>
            {alerta.tipo === 'erro' ? '⚠️' : '✓'} {alerta.texto}
          </div>
        )}

        {/* ---- FORMULÁRIO ---- */}
        <form className="form" onSubmit={aoSubmeter}>

          {/* Linha: Nome */}
          <div className="campo-grupo">
            <label className="campo-label">Nome completo *</label>
            <input
              className="campo-input"
              type="text"
              placeholder="João Silva"
              value={nome}
              onChange={function(e) { setNome(e.target.value); }}
              autoComplete="name"
              disabled={carregando}
            />
          </div>

          {/* Linha: Email + Telefone lado a lado */}
          <div className="form__linha">
            <div className="campo-grupo">
              <label className="campo-label">E-mail *</label>
              <input
                className="campo-input"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={function(e) { setEmail(e.target.value); }}
                autoComplete="email"
                disabled={carregando || (dadosVindos && !!dadosVindos.email)}
                /* desabilita se o email já veio do Google/Apple */
              />
            </div>
            <div className="campo-grupo">
              <label className="campo-label">Telefone</label>
              <input
                className="campo-input"
                type="tel"
                placeholder="(11) 99999-0000"
                value={telefone}
                onChange={function(e) { setTelefone(e.target.value); }}
                autoComplete="tel"
                disabled={carregando}
              />
            </div>
          </div>

          {/* Senha */}
          <div className="campo-grupo">
            <label className="campo-label">Senha * (mín. 8 caracteres)</label>
            <div style={{ position: 'relative' }}>
              <input
                className="campo-input"
                type={senhaVisivel ? 'text' : 'password'}
                placeholder="Crie uma senha forte"
                value={senha}
                onChange={function(e) { setSenha(e.target.value); }}
                autoComplete="new-password"
                disabled={carregando}
                style={{ paddingRight: '42px' }}
              />
              <button
                type="button"
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--texto-fraco)', cursor: 'pointer', fontSize: '14px' }}
                onClick={function() { setSenhaVisivel(!senhaVisivel); }}
                tabIndex={-1}
              >
                {senhaVisivel ? '🙈' : '👁️'}
              </button>
            </div>

            {/* Barra de força da senha — exibida em tempo real */}
            {forcaSenha && (
              <div className="senha-forca">
                <div className="senha-forca__barra">
                  <div
                    className="senha-forca__fill"
                    style={{ width: forcaSenha.largura, background: forcaSenha.cor }}
                  ></div>
                </div>
                <span className="senha-forca__texto" style={{ color: forcaSenha.cor }}>
                  {forcaSenha.texto}
                </span>
              </div>
            )}
          </div>

          {/* Confirmar senha */}
          <div className="campo-grupo">
            <label className="campo-label">Confirmar senha *</label>
            <input
              className={'campo-input' + (confirmarSenha && confirmarSenha !== senha ? ' erro' : confirmarSenha && confirmarSenha === senha ? ' valido' : '')}
              type="password"
              placeholder="Repita a senha"
              value={confirmarSenha}
              onChange={function(e) { setConfirmarSenha(e.target.value); }}
              autoComplete="new-password"
              disabled={carregando}
            />
            {confirmarSenha && confirmarSenha !== senha && (
              <span className="campo-erro-msg">As senhas não coincidem.</span>
            )}
          </div>

          {/* Aceitar termos */}
          <label className="checkbox-grupo">
            <input
              type="checkbox"
              checked={aceitouTermos}
              onChange={function(e) { setAceitouTermos(e.target.checked); }}
              disabled={carregando}
            />
            <span>
              Li e aceito os <a href="#">Termos de Uso</a> e a{' '}
              <a href="#">Política de Privacidade</a> do Wake Up Now.
            </span>
          </label>

          {/* Botão de submit */}
          <button
            type="submit"
            className="btn btn-primario btn-bloco btn-lg"
            disabled={carregando}
            style={{ marginTop: '4px' }}
          >
            {carregando
              ? <><span className="spinner" style={{ marginRight: 8 }}></span> Criando conta...</>
              : 'Criar conta →'
            }
          </button>

        </form>

        {/* Rodapé: ir para login */}
        <div className="cadastro-card__footer">
          Já tem uma conta?
          <button onClick={irParaLogin}>Faça login</button>
        </div>

      </div>
    </div>
  );
}

var raiz = ReactDOM.createRoot(document.getElementById('app-cadastro'));
raiz.render(<ViewCadastro />);
