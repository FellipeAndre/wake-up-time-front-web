/* ================================================================
   src/login/script.js — Regras de Negócio do Login
   ================================================================
   Responsável por TODO o fluxo de autenticação:

   1. Login com e-mail e senha → POST /api/auth/login
   2. Login com Google SDK    → valida token → POST /api/auth/google
   3. Login com Apple SDK     → valida token → POST /api/auth/apple

   FLUXO PRINCIPAL:
   Usuário autentica (qualquer método)
     → Backend Spring Boot valida
       → Usuário existe na base? → retorna JWT → vai para Home
       → Usuário NÃO existe?     → redireciona para Cadastro

   Cada função aqui é chamada pelo login.jsx.
   ================================================================ */

/* ----------------------------------------------------------------
   CONFIGURAÇÃO GERAL
   ---------------------------------------------------------------- */
var API_BASE = 'http://localhost:8080/api';

/*
  IDs dos provedores de autenticação social.
  Substitua com suas credenciais reais obtidas nos consoles
  do Google e Apple (instruções no index.html).
*/
var GOOGLE_CLIENT_ID = 'SEU_GOOGLE_CLIENT_ID.apps.googleusercontent.com';
var APPLE_CLIENT_ID  = 'com.seudominio.wakeupnow';
var APPLE_REDIRECT_URI = window.location.origin + '/auth/apple/callback';

/* ----------------------------------------------------------------
   UTILITÁRIOS
   ---------------------------------------------------------------- */

/*
  Salva os dados de autenticação no localStorage do browser.
  Chamado após qualquer login bem-sucedido.

  @param token   → JWT retornado pelo Spring Boot
  @param usuario → objeto com dados do usuário
*/
function salvarSessao(token, usuario) {
  localStorage.setItem('wun_token', token);
  localStorage.setItem('wun_usuario', JSON.stringify(usuario));
}

/*
  Notifica o react.jsx raiz (que controla o layout com sidebar)
  que o login foi bem-sucedido e envia os dados do usuário.
  O react.jsx atualiza o estado global e navega para a home.

  window.parent.postMessage → comunica do iframe (view login)
  para o frame pai (index.html raiz com react.jsx).
*/
function notificarLoginOk(usuario) {
  window.parent.postMessage({ tipo: 'LOGIN_OK', usuario: usuario }, '*');
}

/*
  Redireciona para a tela de Cadastro passando os dados
  pré-preenchidos do provedor social (nome, email).
  O cadastro.jsx usa esses dados para facilitar o preenchimento.
*/
function redirecionarParaCadastro(dadosPreenchidos) {
  window.parent.postMessage({
    tipo:   'IR_PARA',
    pagina: 'cadastro',
    dados:  dadosPreenchidos || {}  /* dados do Google/Apple para pré-preencher */
  }, '*');
}

/* ================================================================
   AUTENTICAÇÃO POR E-MAIL E SENHA
   ================================================================
   Endpoint Spring Boot:
   @PostMapping("/api/auth/login")
   public ResponseEntity<?> login(@RequestBody @Valid LoginDTO dto) {
     // authService.autenticar(dto.email, dto.senha)
     // → retorna { token, usuario } se sucesso
     // → lança UsernameNotFoundException se não existe
     // → lança BadCredentialsException se senha errada
   }
   ================================================================ */
async function loginComEmailSenha(email, senha) {
  var resposta = await fetch(API_BASE + '/auth/login', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ email: email, senha: senha })
  });

  var dados = await resposta.json();

  /*
    HTTP 404 → usuário não existe no banco.
    Redireciona para cadastro com o email pré-preenchido.
    Equivalente ao tratamento de UsernameNotFoundException no Spring.
  */
  if (resposta.status === 404) {
    redirecionarParaCadastro({ email: email });
    throw new Error('REDIRECT'); /* sinaliza que já foi tratado */
  }

  /* HTTP 401 → credenciais inválidas */
  if (resposta.status === 401) {
    throw new Error('E-mail ou senha incorretos.');
  }

  if (!resposta.ok) {
    throw new Error(dados.mensagem || dados.message || 'Erro ao fazer login.');
  }

  /* Sucesso: salva sessão e notifica o app raiz */
  salvarSessao(dados.token, dados.usuario);
  notificarLoginOk(dados.usuario);
  return dados;
}

/* ================================================================
   AUTENTICAÇÃO COM GOOGLE (Google Identity Services SDK)
   ================================================================
   Fluxo:
   1. Usuário clica em "Continuar com Google"
   2. SDK do Google abre popup de seleção de conta
   3. Google retorna um "credential" (token JWT do Google)
   4. Enviamos esse token para o nosso Spring Boot validar
   5. Spring Boot verifica o token com a API do Google
   6. Se o usuário existe → retorna nosso JWT → login OK
   7. Se NÃO existe → retorna 404 → redireciona para cadastro

   Endpoint Spring Boot:
   @PostMapping("/api/auth/google")
   public ResponseEntity<?> loginGoogle(@RequestBody GoogleTokenDTO dto) {
     GoogleIdToken idToken = googleVerifier.verify(dto.getCredential());
     GoogleIdToken.Payload payload = idToken.getPayload();
     String email = payload.getEmail();
     String nome  = (String) payload.get("name");
     // Verifica se existe no banco...
   }
   ================================================================ */
function inicializarGoogleSDK(callbackAoReceber) {
  /*
    Verifica se o SDK do Google foi carregado.
    O script do Google é carregado de forma assíncrona no HTML.
  */
  if (typeof google === 'undefined') {
    console.warn('[login/script.js] Google SDK ainda não carregou.');
    return;
  }

  /*
    google.accounts.id.initialize → configura o SDK com nosso client_id.
    callback → função chamada quando o usuário seleciona uma conta Google.
    A resposta contém { credential: "eyJhbGciOiJSUzI1NiIsImtpZCI..." }
  */
  google.accounts.id.initialize({
    client_id: GOOGLE_CLIENT_ID,
    callback:  callbackAoReceber,
    /*
      auto_select → true = loga automaticamente se houver uma conta salva.
      Útil para UX, mas use com cuidado em apps com múltiplas contas.
    */
    auto_select: false,
    /*
      ux_mode → 'popup' abre janela popup (melhor UX em SPAs).
      Alternativa: 'redirect' para fluxo de redirecionamento.
    */
    ux_mode: 'popup'
  });
}

/*
  Abre o popup de seleção de conta Google.
  Chamado ao clicar no botão "Continuar com Google".
*/
function abrirPopupGoogle() {
  if (typeof google === 'undefined') {
    alert('Google SDK não disponível. Verifique a conexão com a internet.');
    return;
  }
  google.accounts.id.prompt(); /* abre o One Tap do Google */
}

/*
  Callback chamado pelo SDK do Google após o usuário selecionar conta.
  Recebe o credential (token JWT do Google) e envia ao backend.

  @param response → { credential: "tokenJWT", select_by: "..." }
*/
async function aoReceberRespostaGoogle(response) {
  /*
    response.credential → JWT assinado pelo Google.
    Contém: email, nome, foto, sub (ID único do usuário no Google).
    NUNCA confie apenas neste token no frontend — o backend deve validar.
  */
  var credentialGoogle = response.credential;

  try {
    /* Envia o token do Google para o Spring Boot validar */
    var respostaBackend = await fetch(API_BASE + '/auth/google', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ credential: credentialGoogle })
    });

    var dados = await respostaBackend.json();

    /*
      HTTP 404 → usuário Google não cadastrado na nossa base.
      O backend pode retornar os dados do Google para pré-preencher o cadastro.
    */
    if (respostaBackend.status === 404) {
      redirecionarParaCadastro({
        nome:         dados.nome  || '',
        email:        dados.email || '',
        provedorAuth: 'google',
        idGoogle:     dados.idGoogle || ''
      });
      return;
    }

    if (!respostaBackend.ok) {
      throw new Error(dados.mensagem || 'Erro ao autenticar com Google.');
    }

    /* Login Google bem-sucedido */
    salvarSessao(dados.token, dados.usuario);
    notificarLoginOk(dados.usuario);

  } catch (erro) {
    console.error('[login/script.js] Erro no login Google:', erro);
    throw erro;
  }
}

/* ================================================================
   AUTENTICAÇÃO COM APPLE (Sign in with Apple JS SDK)
   ================================================================
   Fluxo similar ao Google, mas com particularidades da Apple:
   - A Apple retorna o nome do usuário APENAS no primeiro login.
     Salve o nome na primeira vez pois não virá novamente.
   - Usa fluxo OAuth 2.0 com code + id_token.

   Endpoint Spring Boot:
   @PostMapping("/api/auth/apple")
   public ResponseEntity<?> loginApple(@RequestBody AppleAuthDTO dto) {
     // Valida o identityToken com a chave pública da Apple
     // Obtém o email do usuário via JWT
     // Verifica se existe no banco...
   }
   ================================================================ */
function inicializarAppleSDK() {
  if (typeof AppleID === 'undefined') {
    console.warn('[login/script.js] Apple SDK ainda não carregou.');
    return;
  }

  /*
    AppleID.auth.init → configura o SDK com as credenciais Apple.
    clientId      → Services ID do Apple Developer Console
    scope         → dados que queremos: nome e email
    redirectURI   → URL de retorno (deve estar configurada no Apple Console)
    usePopup      → true = popup em vez de redirect (melhor para SPA)
  */
  AppleID.auth.init({
    clientId:    APPLE_CLIENT_ID,
    scope:       'name email',
    redirectURI: APPLE_REDIRECT_URI,
    usePopup:    true
  });
}

/*
  Inicia o fluxo de login com Apple.
  Chamado ao clicar no botão "Continuar com Apple".
*/
async function loginComApple() {
  if (typeof AppleID === 'undefined') {
    alert('Apple SDK não disponível.');
    return;
  }

  try {
    /*
      AppleID.auth.signIn() → abre o popup da Apple.
      Retorna: { authorization: { code, id_token }, user: { name, email } }
      
      ATENÇÃO: user.name e user.email só vêm no PRIMEIRO login.
      Salve-os imediatamente — a Apple não envia novamente.
    */
    var respostaApple = await AppleID.auth.signIn();

    var identityToken = respostaApple.authorization.id_token;
    var authCode      = respostaApple.authorization.code;
    var nomeApple     = respostaApple.user
      ? respostaApple.user.name.firstName + ' ' + (respostaApple.user.name.lastName || '')
      : null;
    var emailApple = respostaApple.user ? respostaApple.user.email : null;

    /* Envia para o Spring Boot validar */
    var respostaBackend = await fetch(API_BASE + '/auth/apple', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({
        identityToken: identityToken,
        authCode:      authCode,
        nome:          nomeApple,
        email:         emailApple
      })
    });

    var dados = await respostaBackend.json();

    if (respostaBackend.status === 404) {
      redirecionarParaCadastro({
        nome:         nomeApple || '',
        email:        emailApple || '',
        provedorAuth: 'apple'
      });
      return;
    }

    if (!respostaBackend.ok) {
      throw new Error(dados.mensagem || 'Erro ao autenticar com Apple.');
    }

    salvarSessao(dados.token, dados.usuario);
    notificarLoginOk(dados.usuario);

  } catch (erro) {
    /* Usuário fechou o popup — não é um erro real */
    if (erro.error === 'popup_closed_by_user') return;
    console.error('[login/script.js] Erro no login Apple:', erro);
    throw erro;
  }
}

/* Navega para o cadastro */
function irParaCadastro() {
  window.parent.postMessage({ tipo: 'IR_PARA', pagina: 'cadastro' }, '*');
}
