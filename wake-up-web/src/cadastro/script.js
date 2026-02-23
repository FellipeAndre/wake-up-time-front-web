/* ================================================================
   src/cadastro/script.js — Regras de Negócio do Cadastro
   ================================================================
   Responsável por:
   1. Validar os campos do formulário de cadastro
   2. Enviar os dados para o Spring Boot
   3. Receber dados pré-preenchidos vindos do login Google/Apple

   Endpoint Spring Boot que este arquivo consome:
   POST /api/auth/cadastro → cria o usuário e retorna JWT

   Equivalente Spring Boot:
   @PostMapping("/api/auth/cadastro")
   public ResponseEntity<TokenDTO> cadastrar(@RequestBody @Valid CadastroDTO dto) {
     if (usuarioService.emailJaExiste(dto.getEmail())) {
       throw new EmailJaCadastradoException();
     }
     Usuario novo = usuarioService.criar(dto);
     String token = jwtService.gerarToken(novo);
     return ResponseEntity.status(201).body(new TokenDTO(token, novo));
   }
   ================================================================ */

var API_BASE = 'http://localhost:8080/api';

/* ----------------------------------------------------------------
   UTILITÁRIOS DE VALIDAÇÃO
   Equivalente às anotações do Bean Validation no Spring:
   @NotBlank, @Email, @Size, etc.
   ---------------------------------------------------------------- */

/*
  Valida se o email tem formato correto.
  Equivalente a @Email no Bean Validation.
*/
function emailEhValido(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/*
  Calcula a força da senha de 0 a 4.
  Retorna objeto com { nivel: 0-4, texto, cor, largura }
  Exibido na barra de força da senha no cadastro.jsx.
*/
function calcularForcaSenha(senha) {
  var pontos = 0;

  if (senha.length >= 8)               pontos++; /* comprimento mínimo */
  if (/[A-Z]/.test(senha))             pontos++; /* tem maiúscula */
  if (/[0-9]/.test(senha))             pontos++; /* tem número */
  if (/[^A-Za-z0-9]/.test(senha))      pontos++; /* tem caractere especial */

  var niveis = [
    { texto: 'Muito fraca', cor: '#ff4d6d', largura: '15%' },
    { texto: 'Fraca',       cor: '#f97316', largura: '35%' },
    { texto: 'Razoável',    cor: '#f59e0b', largura: '60%' },
    { texto: 'Boa',         cor: '#22c55e', largura: '80%' },
    { texto: 'Forte',       cor: '#00e5ff', largura: '100%' },
  ];

  return { nivel: pontos, ...niveis[pontos] };
}

/*
  Valida todos os campos antes de enviar ao backend.
  Retorna array de strings com os erros encontrados.
  Array vazio = tudo válido.

  Equivalente ao @Valid + BindingResult do Spring MVC.
*/
function validarCamposCadastro(campos) {
  var erros = [];

  if (!campos.nome || campos.nome.trim().length < 3) {
    erros.push('Nome deve ter pelo menos 3 caracteres.');
  }

  if (!campos.email || !emailEhValido(campos.email)) {
    erros.push('E-mail inválido.');
  }

  if (!campos.senha || campos.senha.length < 8) {
    erros.push('Senha deve ter pelo menos 8 caracteres.');
  }

  if (campos.senha !== campos.confirmarSenha) {
    erros.push('As senhas não coincidem.');
  }

  if (!campos.aceitouTermos) {
    erros.push('Você precisa aceitar os Termos de Uso.');
  }

  return erros;
}

/* ================================================================
   FUNÇÃO PRINCIPAL: realizarCadastro
   ================================================================
   Envia os dados do novo usuário para o Spring Boot.

   @param campos → objeto com { nome, email, senha, provedorAuth? }
   @returns dados de autenticação (token + usuario)
   ================================================================ */
async function realizarCadastro(campos) {
  /*
    Monta o payload.
    provedorAuth → 'email' | 'google' | 'apple'
    Informa o Spring Boot como o usuário se cadastrou.
    O backend pode usar isso para lógicas específicas por provedor.
  */
  var payload = {
    nome:          campos.nome.trim(),
    email:         campos.email.trim().toLowerCase(),
    senha:         campos.senha,
    provedorAuth:  campos.provedorAuth || 'email',
    idGoogle:      campos.idGoogle  || null,
    telefone:      campos.telefone  || null,
    dataNascimento: campos.dataNascimento || null
  };

  var resposta = await fetch(API_BASE + '/auth/cadastro', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(payload)
  });

  var dados = await resposta.json();

  /* HTTP 409 Conflict → e-mail já cadastrado */
  if (resposta.status === 409) {
    throw new Error('Este e-mail já está cadastrado. Faça login.');
  }

  /* HTTP 422 Unprocessable → dados inválidos segundo o backend */
  if (resposta.status === 422) {
    var mensagensErro = dados.errors
      ? dados.errors.join(' ')
      : (dados.mensagem || 'Dados inválidos.');
    throw new Error(mensagensErro);
  }

  if (!resposta.ok) {
    throw new Error(dados.mensagem || dados.message || 'Erro ao criar conta.');
  }

  /* Salva o token JWT e dados do usuário no browser */
  localStorage.setItem('wun_token', dados.token);
  localStorage.setItem('wun_usuario', JSON.stringify(dados.usuario));

  return dados;
}

/* Navega para o login */
function irParaLogin() {
  window.parent.postMessage({ tipo: 'IR_PARA', pagina: 'login' }, '*');
}

/* Notifica o react.jsx raiz que o cadastro foi concluído */
function notificarCadastroOk(usuario) {
  window.parent.postMessage({ tipo: 'LOGIN_OK', usuario: usuario }, '*');
}

/*
  Recebe dados pré-preenchidos do login Google/Apple via URL params.
  O login envia esses dados quando redireciona para cadastro.

  Alternativa: usar sessionStorage ou postMessage para passar os dados.
*/
function lerDadosPreenchidos() {
  try {
    var params = new URLSearchParams(window.location.search);
    var dados  = params.get('dados');
    return dados ? JSON.parse(decodeURIComponent(dados)) : null;
  } catch (e) {
    return null;
  }
}
