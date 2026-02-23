/* ================================================================
   react.jsx — COMPONENTE REACT RAIZ DO PROJETO
   ================================================================
   Responsável por:
   1. Renderizar o layout principal (sidebar esquerda + conteúdo)
   2. Controlar qual VIEW está ativa (home, login, cadastro)
   3. Gerenciar o estado de autenticação global
   4. Injetar dinamicamente o HTML de cada view no conteúdo

   Montado pelo index.html raiz dentro de <div id="app-raiz">.
   ================================================================ */

const { useState, useEffect, useCallback } = React;

/* ----------------------------------------------------------------
   CONFIGURAÇÃO DOS ITENS DA SIDEBAR
   Cada item representa uma rota/view do projeto.
   pagina → corresponde ao nome da pasta em src/
   ---------------------------------------------------------------- */
const ITENS_SIDEBAR = [
  {
    grupo:  'MENU',
    itens: [
      { icone: '🏠', texto: 'Home',       pagina: 'home',      publica: true  },
      { icone: '📊', texto: 'Dashboard',  pagina: 'dashboard', publica: false },
      { icone: '⏰', texto: 'Alarmes',    pagina: 'alarmes',   publica: false },
      { icone: '📈', texto: 'Progresso',  pagina: 'progresso', publica: false },
    ]
  },
  {
    grupo:  'CONTA',
    itens: [
      { icone: '🔐', texto: 'Login',      pagina: 'login',     publica: true  },
      { icone: '📝', texto: 'Cadastro',   pagina: 'cadastro',  publica: true  },
    ]
  }
];

/* ================================================================
   COMPONENTE: Sidebar
   Barra de navegação lateral esquerda.

   Props recebidas:
     paginaAtiva    → string com a view atual (ex: 'home')
     aoNavegar      → função chamada ao clicar em um item
     usuarioLogado  → objeto com dados do usuário (ou null)
     estaAberta     → boolean — se o menu mobile está aberto
     aoFechar       → função para fechar o menu mobile
   ================================================================ */
function Sidebar({ paginaAtiva, aoNavegar, usuarioLogado, estaAberta, aoFechar }) {

  /*
    Pega as iniciais do nome do usuário para o avatar.
    Ex: "João Silva" → "JS"
  */
  function pegarIniciais(nome) {
    if (!nome) return '?';
    return nome
      .split(' ')                   /* divide por espaço: ['João', 'Silva'] */
      .map(function(p) { return p[0]; }) /* pega a primeira letra de cada parte */
      .slice(0, 2)                  /* pega no máximo 2 iniciais */
      .join('')                     /* junta: 'JS' */
      .toUpperCase();
  }

  return (
    <aside className={'sidebar' + (estaAberta ? ' aberta' : '')}>

      {/* Logo */}
      <div className="sidebar__logo">
        <img src="logo.jpg" alt="Wake Up Now" />
        <span className="sidebar__logo-texto">
          Wake Up<span>.</span>
        </span>
      </div>

      {/* Navegação */}
      <nav className="sidebar__nav">
        {ITENS_SIDEBAR.map(function(grupo, gi) {
          return (
            <div key={gi}>
              {/* Label do grupo */}
              <div className="sidebar__grupo-label">{grupo.grupo}</div>

              {/* Itens do grupo */}
              {grupo.itens.map(function(item, ii) {
                /*
                  Se o item exige login e o usuário não está logado,
                  mostra o item desabilitado (não clicável).
                */
                var estaDesabilitado = !item.publica && !usuarioLogado;
                var estaAtivo       = paginaAtiva === item.pagina;

                return (
                  <div
                    key={ii}
                    className={'sidebar__item' + (estaAtivo ? ' ativo' : '') + (estaDesabilitado ? ' desabilitado' : '')}
                    onClick={function() {
                      if (!estaDesabilitado) {
                        aoNavegar(item.pagina);
                        aoFechar(); /* fecha menu mobile ao navegar */
                      }
                    }}
                    style={{ opacity: estaDesabilitado ? 0.35 : 1, cursor: estaDesabilitado ? 'not-allowed' : 'pointer' }}
                    title={estaDesabilitado ? 'Faça login para acessar' : ''}
                  >
                    <span className="sidebar__item-icone">{item.icone}</span>
                    <span className="sidebar__item-texto">{item.texto}</span>

                    {/* Badge "NOVO" apenas na home */}
                    {item.pagina === 'home' && !estaAtivo && (
                      <span className="sidebar__badge">NOVO</span>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* Rodapé: usuário logado ou botão de login */}
      <div className="sidebar__footer">
        {usuarioLogado ? (
          <>
            <div className="sidebar__avatar">
              {pegarIniciais(usuarioLogado.nome)}
            </div>
            <div style={{ overflow: 'hidden', flex: 1 }}>
              <div className="sidebar__usuario-nome">{usuarioLogado.nome}</div>
              <div className="sidebar__usuario-email">{usuarioLogado.email}</div>
            </div>
          </>
        ) : (
          <div
            onClick={function() { aoNavegar('login'); }}
            style={{ cursor: 'pointer', color: 'var(--acento)', fontSize: '12px', display: 'flex', gap: '6px', alignItems: 'center' }}
          >
            <span>🔐</span> Fazer login
          </div>
        )}
      </div>

    </aside>
  );
}

/* ================================================================
   COMPONENTE: BotaoHamburguer
   Botão que aparece apenas no mobile para abrir/fechar a sidebar.
   ================================================================ */
function BotaoHamburguer({ estaAberto, aoClicar }) {
  return (
    <button
      onClick={aoClicar}
      style={{
        display:    'none',       /* o CSS mostra no mobile via media query */
        background: 'none',
        border:     'none',
        color:      'var(--texto-branco)',
        fontSize:   '20px',
        cursor:     'pointer',
        padding:    '4px',
      }}
      className="btn-hamburguer"
      aria-label="Abrir menu"
    >
      {estaAberto ? '✕' : '☰'}
    </button>
  );
}

/* ================================================================
   COMPONENTE: CarregadorDeView
   Carrega o iframe/conteúdo da view correspondente à página ativa.

   Em vez de reescrever toda a lógica de cada página aqui,
   cada view tem seu próprio index.html completo com seu React,
   CSS e JS. Usamos um iframe para exibir cada view de forma isolada.

   Alternativa: usar fetch para carregar e injetar o HTML.
   ================================================================ */
function CarregadorDeView({ pagina }) {
  /*
    Mapa de páginas → arquivos HTML
    Cada página tem seu próprio index.html dentro de src/{pagina}/
  */
  var mapaPaginas = {
    'home':     'src/home/index.html',
    'login':    'src/login/index.html',
    'cadastro': 'src/cadastro/index.html',
  };

  var urlDaView = mapaPaginas[pagina];

  /* Página sem view dedicada ainda */
  if (!urlDaView) {
    return (
      <div style={{
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        height:         '60vh',
        flexDirection:  'column',
        gap:            '16px'
      }}>
        <span style={{ fontSize: '48px' }}>🚧</span>
        <p style={{ color: 'var(--texto-fraco)', fontFamily: 'var(--fonte-titulo)', fontSize: '18px' }}>
          Em construção
        </p>
        <span style={{ fontSize: '12px', color: 'var(--texto-fraco)' }}>
          A view <strong style={{ color: 'var(--acento)' }}>{pagina}</strong> ainda não foi criada.
        </span>
      </div>
    );
  }

  /*
    iframe → carrega o index.html da view de forma isolada.
    O CSS e JS de cada view não interferem nos outros.
    style="border: none" → remove a borda padrão do iframe.
  */
  return (
    <iframe
      src={urlDaView}
      title={'view-' + pagina}
      style={{
        width:   '100%',
        height:  'calc(100vh - 100px)', /* desconta o header */
        border:  'none',
        display: 'block',
      }}
    />
  );
}

/* ================================================================
   COMPONENTE RAIZ: AppRaiz
   Monta toda a aplicação: sidebar + conteúdo principal.
   ================================================================ */
function AppRaiz() {

  /*
    paginaAtiva → qual view está sendo exibida no momento.
    Começa na 'home'. Muda ao clicar na sidebar.
  */
  const [paginaAtiva, setPaginaAtiva] = useState('home');

  /*
    usuarioLogado → dados do usuário autenticado.
    null = não logado.
    Lê do localStorage ao iniciar (JWT salvo pelo login).
  */
  const [usuarioLogado, setUsuarioLogado] = useState(null);

  /*
    menuMobileAberto → controla visibilidade da sidebar no mobile.
  */
  const [menuMobileAberto, setMenuMobileAberto] = useState(false);

  /*
    Títulos e subtítulos de cada página (exibidos no header)
  */
  var titulos = {
    'home':      { titulo: 'Home',      sub: 'Bem-vindo ao Wake Up Now' },
    'login':     { titulo: 'Login',     sub: 'Acesse sua conta'         },
    'cadastro':  { titulo: 'Cadastro',  sub: 'Crie sua conta grátis'    },
    'dashboard': { titulo: 'Dashboard', sub: 'Seu painel de controle'   },
    'alarmes':   { titulo: 'Alarmes',   sub: 'Gerencie seus alarmes'    },
    'progresso': { titulo: 'Progresso', sub: 'Sua evolução'             },
  };

  var paginaInfo = titulos[paginaAtiva] || { titulo: paginaAtiva, sub: '' };

  /* Verifica autenticação ao carregar */
  useEffect(function() {
    var tokenSalvo   = localStorage.getItem('wun_token');
    var usuarioSalvo = localStorage.getItem('wun_usuario');

    if (tokenSalvo && usuarioSalvo) {
      try {
        setUsuarioLogado(JSON.parse(usuarioSalvo));
      } catch (e) {
        /* Token corrompido — limpa o storage */
        localStorage.removeItem('wun_token');
        localStorage.removeItem('wun_usuario');
      }
    }

    /*
      Escuta mensagens das views (iframes filhos).
      As views podem enviar eventos como login bem-sucedido
      usando window.parent.postMessage().

      Ex no Login.jsx:
        window.parent.postMessage({ tipo: 'LOGIN_OK', usuario: dadosDoUsuario }, '*');
    */
    function ouvirMensagens(evento) {
      var msg = evento.data;
      if (!msg || !msg.tipo) return;

      if (msg.tipo === 'LOGIN_OK') {
        setUsuarioLogado(msg.usuario);
        setPaginaAtiva('home');
      }

      if (msg.tipo === 'CADASTRO_OK') {
        setPaginaAtiva('login');
      }

      if (msg.tipo === 'LOGOUT') {
        setUsuarioLogado(null);
        localStorage.removeItem('wun_token');
        localStorage.removeItem('wun_usuario');
        setPaginaAtiva('login');
      }

      if (msg.tipo === 'IR_PARA') {
        setPaginaAtiva(msg.pagina);
      }
    }

    window.addEventListener('message', ouvirMensagens);
    return function() { window.removeEventListener('message', ouvirMensagens); };
  }, []);

  /* Navega para uma página e fecha o menu mobile */
  function aoNavegar(pagina) {
    setPaginaAtiva(pagina);
    setMenuMobileAberto(false);
  }

  return (
    <div className="app-container">

      {/* SIDEBAR ESQUERDA */}
      <Sidebar
        paginaAtiva={paginaAtiva}
        aoNavegar={aoNavegar}
        usuarioLogado={usuarioLogado}
        estaAberta={menuMobileAberto}
        aoFechar={function() { setMenuMobileAberto(false); }}
      />

      {/* CONTEÚDO PRINCIPAL (direita) */}
      <div className="conteudo-principal">

        {/* Header fixo com título da página */}
        <header className="conteudo-header">
          <div>
            <div className="conteudo-header__titulo">{paginaInfo.titulo}</div>
            <div className="conteudo-header__subtitulo">{paginaInfo.sub}</div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Mostra botão de logout se logado */}
            {usuarioLogado && (
              <button
                className="btn btn-sm btn-secundario"
                onClick={function() {
                  setUsuarioLogado(null);
                  localStorage.removeItem('wun_token');
                  localStorage.removeItem('wun_usuario');
                  setPaginaAtiva('login');
                }}
              >
                Sair
              </button>
            )}

            {/* Botão hamburguer — mobile only (controlado via CSS) */}
            <button
              className="btn-hamburguer"
              onClick={function() { setMenuMobileAberto(!menuMobileAberto); }}
              style={{
                background: 'none', border: 'none',
                color: 'var(--texto-branco)', fontSize: '20px', cursor: 'pointer'
              }}
            >
              {menuMobileAberto ? '✕' : '☰'}
            </button>
          </div>
        </header>

        {/* VIEW ATIVA — carregada via iframe */}
        <div className="conteudo-view" style={{ padding: 0 }}>
          <CarregadorDeView pagina={paginaAtiva} />
        </div>

      </div>
    </div>
  );
}

/* ----------------------------------------------------------------
   Monta a aplicação no elemento <div id="app-raiz"> do index.html
   ---------------------------------------------------------------- */
var raiz = ReactDOM.createRoot(document.getElementById('app-raiz'));
raiz.render(<AppRaiz />);
