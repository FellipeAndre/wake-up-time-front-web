/* ================================================================
   src/login/login.jsx — Componente React do Login
   ================================================================
   Funções disponíveis via script.js:
     loginComEmailSenha(email, senha)
     inicializarGoogleSDK(callback)
     abrirPopupGoogle()
     aoReceberRespostaGoogle(response)  ← callback do SDK Google
     loginComApple()
     inicializarAppleSDK()
     irParaCadastro()
   ================================================================ */

const { useState, useEffect } = React;

function ViewLogin() {

  /* ---- ESTADOS ---- */
  const [tabAtiva,      setTabAtiva]      = useState('entrar');
  const [email,         setEmail]         = useState('');
  const [senha,         setSenha]         = useState('');
  const [senhaVisivel,  setSenhaVisivel]  = useState(false);
  const [carregando,    setCarregando]    = useState(false);
  const [carregandoOp,  setCarregandoOp]  = useState(''); /* 'google'|'apple'|'email' */
  const [alerta,        setAlerta]        = useState(null); /* { texto, tipo } */

  /* ---- INICIALIZA OS SDKs AO MONTAR ---- */
  useEffect(function() {
    /*
      Pequeno delay para garantir que os SDKs do Google e Apple
      (carregados com async/defer no HTML) já estejam disponíveis.
    */
    var timer = setTimeout(function() {

      /* Inicializa Google SDK passando o callback que processa a resposta */
      inicializarGoogleSDK(async function(response) {
        setCarregandoOp('google');
        setAlerta(null);
        try {
          await aoReceberRespostaGoogle(response); /* função do script.js */
        } catch (erro) {
          if (erro.message !== 'REDIRECT') {
            setAlerta({ texto: erro.message, tipo: 'erro' });
          }
        } finally {
          setCarregandoOp('');
        }
      });

      /* Inicializa Apple SDK */
      inicializarAppleSDK();

    }, 800);

    return function() { clearTimeout(timer); };
  }, []);

  /* ---- HANDLERS ---- */

  /* Submit do formulário de e-mail/senha */
  async function aoSubmeter(evento) {
    evento.preventDefault();

    if (!email || !senha) {
      setAlerta({ texto: 'Preencha todos os campos.', tipo: 'erro' });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setAlerta({ texto: 'E-mail inválido.', tipo: 'erro' });
      return;
    }

    setCarregando(true);
    setCarregandoOp('email');
    setAlerta(null);

    try {
      /* Chama a função do script.js → POST /api/auth/login */
      await loginComEmailSenha(email, senha);
      /*
        Se chegou aqui sem erro e sem redirect:
        notificarLoginOk() já foi chamado dentro de loginComEmailSenha()
        e o react.jsx raiz vai navegar para a home.
      */
    } catch (erro) {
      /* 'REDIRECT' significa que já foi redirecionado para cadastro */
      if (erro.message !== 'REDIRECT') {
        setAlerta({ texto: erro.message, tipo: 'erro' });
      }
    } finally {
      setCarregando(false);
      setCarregandoOp('');
    }
  }

  /* Login com Google */
  async function aoClicarGoogle() {
    setAlerta(null);
    setCarregandoOp('google');
    try {
      abrirPopupGoogle(); /* abre o popup do Google — callback no useEffect */
    } catch (erro) {
      setAlerta({ texto: erro.message, tipo: 'erro' });
      setCarregandoOp('');
    }
  }

  /* Login com Apple */
  async function aoClicarApple() {
    setAlerta(null);
    setCarregandoOp('apple');
    try {
      await loginComApple(); /* função do script.js */
    } catch (erro) {
      setAlerta({ texto: erro.message, tipo: 'erro' });
    } finally {
      setCarregandoOp('');
    }
  }

  /* ---- RENDERIZAÇÃO ---- */
  return (
    <div className="login-pagina">
      <div className="login-pagina__orb"></div>

      <div className="login-card">

        {/* Cabeçalho */}
        <div className="login-card__header">
          <img src="../../logo.jpg" alt="Wake Up Now" className="login-card__logo" />
          <h1 className="login-card__titulo">Bem-vindo de volta</h1>
          <p className="login-card__sub">
            {tabAtiva === 'entrar' ? 'Acesse sua conta' : 'Escolha como continuar'}
          </p>
        </div>

        {/* ---- BOTÕES DE LOGIN SOCIAL ---- */}
        <div className="login-social">

          {/* Google */}
          <button
            className="btn btn-google btn-bloco"
            onClick={aoClicarGoogle}
            disabled={!!carregandoOp}
          >
            {carregandoOp === 'google' ? (
              <span className="spinner"></span>
            ) : (
              /* Ícone SVG oficial do Google */
              <svg className="btn-social-icone" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            {carregandoOp === 'google' ? 'Conectando...' : 'Continuar com Google'}
          </button>

          {/* Apple */}
          <button
            className="btn btn-apple btn-bloco"
            onClick={aoClicarApple}
            disabled={!!carregandoOp}
          >
            {carregandoOp === 'apple' ? (
              <span className="spinner"></span>
            ) : (
              /* Ícone SVG da Apple */
              <svg className="btn-social-icone" viewBox="0 0 24 24" fill="white">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
            )}
            {carregandoOp === 'apple' ? 'Conectando...' : 'Continuar com Apple'}
          </button>

        </div>

        {/* Divisor "ou" */}
        <div className="divisor-texto">ou entre com e-mail</div>

        {/* Alerta de erro/sucesso */}
        {alerta && (
          <div className={'alerta alerta--' + alerta.tipo} style={{ marginBottom: '12px' }}>
            {alerta.tipo === 'erro' ? '⚠️' : '✓'} {alerta.texto}
          </div>
        )}

        {/* ---- FORMULÁRIO EMAIL/SENHA ---- */}
        <form className="form" onSubmit={aoSubmeter}>

          <div className="campo-grupo">
            <label className="campo-label">E-mail</label>
            <input
              className="campo-input"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={function(e) { setEmail(e.target.value); setAlerta(null); }}
              autoComplete="email"
              disabled={!!carregandoOp}
            />
          </div>

          <div className="campo-grupo">
            <label className="campo-label">Senha</label>
            <div className="campo-senha-wrapper">
              <input
                className="campo-input"
                type={senhaVisivel ? 'text' : 'password'}
                placeholder="••••••••"
                value={senha}
                onChange={function(e) { setSenha(e.target.value); setAlerta(null); }}
                autoComplete="current-password"
                disabled={!!carregandoOp}
              />
              <button
                type="button"
                className="campo-senha-olho"
                onClick={function() { setSenhaVisivel(!senhaVisivel); }}
                tabIndex={-1}
              >
                {senhaVisivel ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primario btn-bloco"
            disabled={!!carregandoOp}
          >
            {carregandoOp === 'email'
              ? <><span className="spinner" style={{ marginRight: 8 }}></span> Entrando...</>
              : 'Entrar →'
            }
          </button>

          <div className="form__rodape">
            <button type="button" style={{ background: 'none', border: 'none', color: 'var(--texto-fraco)', cursor: 'pointer', fontFamily: 'var(--fonte-corpo)', fontSize: '11px' }}>
              Esqueceu sua senha?
            </button>
          </div>

        </form>

        {/* Rodapé: ir para cadastro */}
        <div className="login-card__footer">
          Não tem conta?
          <button onClick={irParaCadastro}>
            Cadastre-se
          </button>
        </div>

      </div>
    </div>
  );
}

var raiz = ReactDOM.createRoot(document.getElementById('app-login'));
raiz.render(<ViewLogin />);
