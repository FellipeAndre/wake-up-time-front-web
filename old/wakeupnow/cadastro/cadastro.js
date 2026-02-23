/* ============================================================
   cadastro/cadastro.js — Lógica de Cadastro e Login
   Integração: substituir mock por chamadas à sua API REST
   ============================================================ */

/* ── Trocar entre abas Cadastro / Login ── */
function switchTab(tab) {
  const isRegister = tab === 'register';

  document.getElementById('form-register').style.display = isRegister ? 'block' : 'none';
  document.getElementById('form-login').style.display    = isRegister ? 'none'  : 'block';

  document.getElementById('tab-register').classList.toggle('active', isRegister);
  document.getElementById('tab-login').classList.toggle('active', !isRegister);
}

/* ── Máscara CPF ── */
function maskCPF(input) {
  let v = input.value.replace(/\D/g, '').slice(0, 11);
  if (v.length > 9)      v = v.replace(/(\d{3})(\d{3})(\d{3})(\d+)/, '$1.$2.$3-$4');
  else if (v.length > 6) v = v.replace(/(\d{3})(\d{3})(\d+)/, '$1.$2.$3');
  else if (v.length > 3) v = v.replace(/(\d{3})(\d+)/, '$1.$2');
  input.value = v;
}

/* ── Força da senha ── */
function checkPasswordStrength(password) {
  const wrap  = document.getElementById('strengthWrap');
  const fill  = document.getElementById('strengthFill');
  const label = document.getElementById('strengthLabel');

  if (!password) { wrap.style.display = 'none'; return; }
  wrap.style.display = 'flex';

  const hasLen  = password.length >= 8;
  const hasUpp  = /[A-Z]/.test(password);
  const hasNum  = /\d/.test(password);
  const hasSpc  = /[^a-zA-Z0-9]/.test(password);

  const score = [hasLen, hasUpp, hasNum, hasSpc].filter(Boolean).length;

  fill.className = 'strength-fill';
  label.className = 'strength-label';

  if (score <= 1) {
    fill.classList.add('weak');
    label.classList.add('weak');
    label.textContent = 'Fraca';
  } else if (score <= 3) {
    fill.classList.add('medium');
    label.classList.add('medium');
    label.textContent = 'Média';
  } else {
    fill.classList.add('strong');
    label.classList.add('strong');
    label.textContent = 'Forte';
  }
}

/* ── Toggle visibilidade da senha ── */
function togglePassword(inputId) {
  const input = document.getElementById(inputId);
  input.type = input.type === 'password' ? 'text' : 'password';
}

/* ── Validação do formulário de cadastro ── */
function validateCadastro() {
  const nome     = document.getElementById('reg-nome').value.trim();
  const sobrenome= document.getElementById('reg-sobrenome').value.trim();
  const email    = document.getElementById('reg-email').value.trim();
  const cpf      = document.getElementById('reg-cpf').value.trim();
  const senha    = document.getElementById('reg-senha').value;
  const senha2   = document.getElementById('reg-senha2').value;
  const terms    = document.getElementById('reg-terms').checked;

  if (!nome || !sobrenome)      return 'Preencha nome e sobrenome.';
  if (!email || !email.includes('@')) return 'E-mail inválido.';
  if (cpf.replace(/\D/g,'').length !== 11) return 'CPF inválido.';
  if (senha.length < 8)         return 'A senha deve ter no mínimo 8 caracteres.';
  if (senha !== senha2)         return 'As senhas não conferem.';
  if (!terms)                   return 'Aceite os Termos de Uso para continuar.';
  return null;
}

/* ── Submeter Cadastro ── */
async function submitCadastro() {
  const error = validateCadastro();
  const errorEl = document.getElementById('cadastro-error');

  if (error) {
    errorEl.style.display = 'block';
    errorEl.textContent = '⚠ ' + error;
    return;
  }

  errorEl.style.display = 'none';

  const btn = document.getElementById('btnCadastro');
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span> Criando conta...';

  const payload = {
    nome:      document.getElementById('reg-nome').value.trim(),
    sobrenome: document.getElementById('reg-sobrenome').value.trim(),
    email:     document.getElementById('reg-email').value.trim(),
    whatsapp:  document.getElementById('reg-whatsapp').value.trim(),
    cpf:       document.getElementById('reg-cpf').value.replace(/\D/g,''),
    plano:     document.getElementById('reg-plano').value,
    origem:    document.getElementById('reg-origem').value,
  };

  try {
    // TODO: substituir por chamada real
    // const res = await fetch('/api/auth/register', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(payload)
    // });
    // if (!res.ok) throw new Error((await res.json()).message);

    // Simular delay
    await new Promise(r => setTimeout(r, 1500));

    showToast(`Conta criada! Bem-vindo, ${payload.nome}!`, 'success');

    if (payload.plano) {
      setTimeout(() => navigateTo('pagamento'), 1200);
    } else {
      setTimeout(() => navigateTo('videos'), 1200);
    }

  } catch (err) {
    errorEl.style.display = 'block';
    errorEl.textContent = '⚠ ' + (err.message || 'Erro ao criar conta. Tente novamente.');
    btn.disabled = false;
    btn.innerHTML = '🚀 Criar Minha Conta';
  }
}

/* ── Submeter Login ── */
async function submitLogin() {
  const email = document.getElementById('login-email').value.trim();
  const senha = document.getElementById('login-senha').value;
  const errorEl = document.getElementById('login-error');

  if (!email || !senha) {
    errorEl.style.display = 'block';
    errorEl.textContent = '⚠ Preencha e-mail e senha.';
    return;
  }

  errorEl.style.display = 'none';
  const btn = document.getElementById('btnLogin');
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span> Entrando...';

  try {
    // TODO: substituir por chamada real
    // const res = await fetch('/api/auth/login', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email, senha })
    // });
    // const data = await res.json();
    // if (!res.ok) throw new Error(data.message);
    // localStorage.setItem('wun_token', data.token);

    await new Promise(r => setTimeout(r, 1200));

    showToast('Login realizado com sucesso!', 'success');
    setTimeout(() => navigateTo('videos'), 800);

  } catch (err) {
    errorEl.style.display = 'block';
    errorEl.textContent = '⚠ ' + (err.message || 'E-mail ou senha incorretos.');
    btn.disabled = false;
    btn.innerHTML = '➔ Entrar';
  }
}

/* ── Login com Google ── */
function loginGoogle() {
  // TODO: implementar OAuth2 Google
  // window.location.href = '/api/auth/google';
  showToast('Login com Google será integrado em breve.', 'success');
}
