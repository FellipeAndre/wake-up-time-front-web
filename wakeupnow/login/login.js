/* ============================================================
   login/login.js
   
   RESPONSABILIDADE:
   - Lógica de autenticação (login e cadastro)
   - Comunicação com backend Spring
   - Validações de formulário
   - Gerenciamento de estado local
   
   ESTRUTURA:
   1. Estado da aplicação
   2. Funções de validação
   3. Funções de máscara (CPF, etc)
   4. Funções de API (comunicação backend)
   5. Funções de evento (UI)
   ============================================================ */

// ═══════════════════════════════════════════════════════════
// 1. ESTADO DA APLICAÇÃO
// 
// Armazena informações atuais do formulário e da sessão
// ═══════════════════════════════════════════════════════════

const AuthenticationState = {
  // Dados do formulário de LOGIN
  loginEmailValue: '',
  loginPasswordValue: '',
  isLoginLoading: false,
  
  // Dados do formulário de CADASTRO
  registerFirstNameValue: '',
  registerLastNameValue: '',
  registerEmailValue: '',
  registerCpfValue: '',
  registerPasswordValue: '',
  registerConfirmPasswordValue: '',
  registerTermsAccepted: false,
  isRegisterLoading: false,
  
  // Estado geral
  currentActiveTab: 'login', // 'login' ou 'register'
  userSession: null, // Armazena dados do usuário logado
};

// ═══════════════════════════════════════════════════════════
// 2. FUNÇÕES DE VALIDAÇÃO
// ═══════════════════════════════════════════════════════════

/**
 * Valida estrutura básica de um email
 * @param {string} emailAddress - Email a validar
 * @returns {boolean} - True se email é válido
 */
function isValidEmailFormat(emailAddress) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(emailAddress);
}

/**
 * Valida se CPF tem 11 dígitos (após remover caracteres especiais)
 * @param {string} cpfNumber - CPF com formatação
 * @returns {boolean} - True se CPF é válido
 */
function isValidCPFFormat(cpfNumber) {
  const onlyNumbers = cpfNumber.replace(/\D/g, '');
  return onlyNumbers.length === 11;
}

/**
 * Valida se a senha atende aos requisitos mínimos
 * @param {string} passwordText - Senha a validar
 * @returns {boolean} - True se senha é válida
 */
function isValidPasswordStrength(passwordText) {
  return passwordText.length >= 8;
}

/**
 * Validate o formulário de LOGIN
 * @returns {string|null} - Mensagem de erro ou null se válido
 */
function validateLoginForm() {
  const loginEmailInput = document.getElementById('loginEmailInput');
  const loginPasswordInput = document.getElementById('loginPasswordInput');
  
  const emailValue = loginEmailInput?.value.trim() || '';
  const passwordValue = loginPasswordInput?.value || '';
  
  if (!emailValue) {
    return 'Por favor, informe seu e-mail.';
  }
  
  if (!isValidEmailFormat(emailValue)) {
    return 'E-mail inválido. Verifique o formato.';
  }
  
  if (!passwordValue) {
    return 'Por favor, informe sua senha.';
  }
  
  if (passwordValue.length < 6) {
    return 'Senha deve ter no mínimo 6 caracteres.';
  }
  
  return null; // Sem erros
}

/**
 * Valida o formulário de CADASTRO
 * @returns {string|null} - Mensagem de erro ou null se válido
 */
function validateRegisterForm() {
  const firstNameInput = document.getElementById('registerFirstNameInput');
  const lastNameInput = document.getElementById('registerLastNameInput');
  const emailInput = document.getElementById('registerEmailInput');
  const cpfInput = document.getElementById('registerCpfInput');
  const passwordInput = document.getElementById('registerPasswordInput');
  const confirmPasswordInput = document.getElementById('registerConfirmPasswordInput');
  const termsCheckbox = document.getElementById('acceptTermsCheckbox');
  
  const firstName = firstNameInput?.value.trim() || '';
  const lastName = lastNameInput?.value.trim() || '';
  const email = emailInput?.value.trim() || '';
  const cpf = cpfInput?.value.trim() || '';
  const password = passwordInput?.value || '';
  const confirmPassword = confirmPasswordInput?.value || '';
  const termsAccepted = termsCheckbox?.checked || false;
  
  if (!firstName || !lastName) {
    return 'Por favor, informe seu nome completo.';
  }
  
  if (!email) {
    return 'Por favor, informe seu e-mail.';
  }
  
  if (!isValidEmailFormat(email)) {
    return 'E-mail inválido. Verifique o formato.';
  }
  
  if (!cpf) {
    return 'Por favor, informe seu CPF.';
  }
  
  if (!isValidCPFFormat(cpf)) {
    return 'CPF inválido. Deve conter 11 dígitos.';
  }
  
  if (!password) {
    return 'Por favor, informe uma senha.';
  }
  
  if (!isValidPasswordStrength(password)) {
    return 'Senha deve ter no mínimo 8 caracteres.';
  }
  
  if (password !== confirmPassword) {
    return 'As senhas não conferem. Verifique.';
  }
  
  if (!termsAccepted) {
    return 'Você deve aceitar os Termos de Uso para continuar.';
  }
  
  return null; // Sem erros
}

// ═══════════════════════════════════════════════════════════
// 3. FUNÇÕES DE MÁSCARA (Formatação de entrada)
// ═══════════════════════════════════════════════════════════

/**
 * Aplica máscara de CPF ao campo (XXX.XXX.XXX-XX)
 * @param {HTMLInputElement} cpfInputElement - Campo de input do CPF
 */
function applyMaskCPF(cpfInputElement) {
  if (!cpfInputElement) return;
  
  // Remove tudo que não é número
  let cpfNumbers = cpfInputElement.value.replace(/\D/g, '').slice(0, 11);
  
  // Aplica máscara progressivamente
  if (cpfNumbers.length > 9) {
    cpfNumbers = cpfNumbers.replace(/(\d{3})(\d{3})(\d{3})(\d+)/, '$1.$2.$3-$4');
  } else if (cpfNumbers.length > 6) {
    cpfNumbers = cpfNumbers.replace(/(\d{3})(\d{3})(\d+)/, '$1.$2.$3');
  } else if (cpfNumbers.length > 3) {
    cpfNumbers = cpfNumbers.replace(/(\d{3})(\d+)/, '$1.$2');
  }
  
  cpfInputElement.value = cpfNumbers;
}

// ═══════════════════════════════════════════════════════════
// 4. FUNÇÕES DE AVALIAÇÃO (Força de senha, etc)
// ═══════════════════════════════════════════════════════════

/**
 * Avalia a força da senha e exibe indicador visual
 * @param {string} passwordText - Texto da senha
 */
function evaluatePasswordStrength(passwordText) {
  const strengthIndicatorElement = document.getElementById('passwordStrengthIndicator');
  const strengthBarFillElement = document.getElementById('strengthBarFill');
  const strengthLabelElement = document.getElementById('strengthLabel');
  
  if (!passwordText) {
    strengthIndicatorElement.style.display = 'none';
    return;
  }
  
  strengthIndicatorElement.style.display = 'flex';
  
  // Critérios de força
  const hasMinimumLength = passwordText.length >= 8;
  const hasUppercaseLetters = /[A-Z]/.test(passwordText);
  const hasNumbers = /\d/.test(passwordText);
  const hasSpecialCharacters = /[^a-zA-Z0-9]/.test(passwordText);
  
  // Calcula pontuação
  const strengthScore = [
    hasMinimumLength,
    hasUppercaseLetters,
    hasNumbers,
    hasSpecialCharacters
  ].filter(Boolean).length;
  
  // Remove classes anteriores
  strengthBarFillElement.className = 'strengthBarFill';
  strengthLabelElement.className = 'strengthText';
  
  // Aplica classe e texto baseado na pontuação
  if (strengthScore <= 1) {
    strengthBarFillElement.classList.add('weak');
    strengthLabelElement.classList.add('weak');
    strengthLabelElement.textContent = 'Fraca';
  } else if (strengthScore <= 3) {
    strengthBarFillElement.classList.add('medium');
    strengthLabelElement.classList.add('medium');
    strengthLabelElement.textContent = 'Média';
  } else {
    strengthBarFillElement.classList.add('strong');
    strengthLabelElement.classList.add('strong');
    strengthLabelElement.textContent = 'Forte';
  }
}

// ═══════════════════════════════════════════════════════════
// 5. FUNÇÕES DE INTERAÇÃO COM UI
// ═══════════════════════════════════════════════════════════

/**
 * Alterna entre abas (LOGIN vs CADASTRO)
 * @param {string} tabName - Nome da aba ('login' ou 'register')
 */
function switchAuthTab(tabName) {
  AuthenticationState.currentActiveTab = tabName;
  
  const loginFormElement = document.getElementById('loginFormContainer');
  const registerFormElement = document.getElementById('registerFormContainer');
  const loginTabButton = document.getElementById('tabLoginButton');
  const registerTabButton = document.getElementById('tabRegisterButton');
  
  // Alterna visibilidade dos formulários
  const showLoginForm = tabName === 'login';
  if (loginFormElement) loginFormElement.style.display = showLoginForm ? 'block' : 'none';
  if (registerFormElement) registerFormElement.style.display = showLoginForm ? 'none' : 'block';
  
  // Atualiza estado visual dos botões
  if (loginTabButton) {
    loginTabButton.classList.toggle('authTabButtonActive', showLoginForm);
  }
  if (registerTabButton) {
    registerTabButton.classList.toggle('authTabButtonActive', !showLoginForm);
  }
  
  // Limpa mensagens de erro
  const loginErrorElement = document.getElementById('loginErrorMessage');
  const registerErrorElement = document.getElementById('registerErrorMessage');
  if (loginErrorElement) loginErrorElement.style.display = 'none';
  if (registerErrorElement) registerErrorElement.style.display = 'none';
}

/**
 * Alterna visibilidade da senha entre texto e pontos
 * @param {string} inputFieldId - ID do campo de input
 */
function togglePasswordVisibility(inputFieldId) {
  const inputElement = document.getElementById(inputFieldId);
  if (!inputElement) return;
  
  const isPasswordType = inputElement.type === 'password';
  inputElement.type = isPasswordType ? 'text' : 'password';
}

/**
 * Exibe mensagem de erro no formulário
 * @param {string} errorMessageText - Texto da mensagem
 * @param {string} formType - Tipo do formulário ('login' ou 'register')
 */
function displayErrorMessage(errorMessageText, formType = 'login') {
  const errorElementId = formType === 'login' ? 'loginErrorMessage' : 'registerErrorMessage';
  const errorElement = document.getElementById(errorElementId);
  
  if (errorElement) {
    errorElement.textContent = '⚠ ' + errorMessageText;
    errorElement.style.display = 'block';
  }
}

/**
 * Limpa mensagem de erro
 * @param {string} formType - Tipo do formulário ('login' ou 'register')
 */
function clearErrorMessage(formType = 'login') {
  const errorElementId = formType === 'login' ? 'loginErrorMessage' : 'registerErrorMessage';
  const errorElement = document.getElementById(errorElementId);
  
  if (errorElement) {
    errorElement.style.display = 'none';
    errorElement.textContent = '';
  }
}

/**
 * Habilita ou desabilita botão de submit
 * @param {string} buttonId - ID do botão
 * @param {boolean} isLoading - Se está em processo de envio
 */
function setButtonLoadingState(buttonId, isLoading) {
  const buttonElement = document.getElementById(buttonId);
  if (!buttonElement) return;
  
  buttonElement.disabled = isLoading;
  
  if (isLoading) {
    buttonElement.innerHTML = '<span class="spinner"></span> Processando...';
  } else {
    // Restaura texto original (você pode melhorar isso com data attributes)
    if (buttonId === 'loginSubmitButton') {
      buttonElement.textContent = '➔ Entrar';
    } else if (buttonId === 'registerSubmitButton') {
      buttonElement.textContent = '🚀 Criar Minha Conta';
    }
  }
}

// ═══════════════════════════════════════════════════════════
// 6. FUNÇÕES DE API (Comunicação com Backend)
// ═══════════════════════════════════════════════════════════

/**
 * Envia credenciais de LOGIN para o backend
 * @param {string} emailUser - Email do usuário
 * @param {string} passwordUser - Senha do usuário
 * @returns {Promise<Object>} - Resposta do servidor
 */
async function sendLoginRequest(emailUser, passwordUser) {
  try {
    const backendUrl = 'http://localhost:8080/api/auth/login'; // Ajuste conforme seu backend
    
    const requestPayload = {
      email: emailUser,
      password: passwordUser
    };
    
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestPayload)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao fazer login');
    }
    
    return await response.json();
    
  } catch (errorException) {
    console.error('Erro ao conectar com servidor:', errorException);
    throw errorException;
  }
}

/**
 * Envia dados de CADASTRO para o backend
 * @param {Object} userData - Dados do usuário (name, email, cpf, password)
 * @returns {Promise<Object>} - Resposta do servidor
 */
async function sendRegisterRequest(userData) {
  try {
    const backendUrl = 'http://localhost:8080/api/auth/register'; // Ajuste conforme seu backend
    
    const requestPayload = {
      name: userData.fullName,
      email: userData.email,
      cpf: userData.cpf,
      password: userData.password
    };
    
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestPayload)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao criar conta');
    }
    
    return await response.json();
    
  } catch (errorException) {
    console.error('Erro ao conectar com servidor:', errorException);
    throw errorException;
  }
}

// ═══════════════════════════════════════════════════════════
// 7. MANIPULADORES DE EVENTOS (Event Handlers)
// ═══════════════════════════════════════════════════════════

/**
 * Maneja envio do formulário de LOGIN
 */
async function handleLoginSubmit() {
  clearErrorMessage('login');
  
  // Valida formulário
  const validationError = validateLoginForm();
  if (validationError) {
    displayErrorMessage(validationError, 'login');
    return;
  }
  
  // Prepara para envio
  setButtonLoadingState('loginSubmitButton', true);
  AuthenticationState.isLoginLoading = true;
  
  try {
    const loginEmailInput = document.getElementById('loginEmailInput');
    const loginPasswordInput = document.getElementById('loginPasswordInput');
    
    const emailValue = loginEmailInput?.value.trim() || '';
    const passwordValue = loginPasswordInput?.value || '';
    
    // Envia para backend
    const responseData = await sendLoginRequest(emailValue, passwordValue);
    
    // Salva dados do usuário no localStorage
    localStorage.setItem('userToken', responseData.token);
    localStorage.setItem('userData', JSON.stringify(responseData.user));
    
    // Notifica sucesso
    showToast('Login realizado com sucesso! Redirecionando...', 'success');
    
    // Redireciona após 1.5 segundos
    setTimeout(() => {
      navigateTo('home'); // Usa função de navigação do seu projeto
    }, 1500);
    
  } catch (errorException) {
    displayErrorMessage(
      errorException.message || 'Erro ao fazer login. Verifique suas credenciais.',
      'login'
    );
  } finally {
    setButtonLoadingState('loginSubmitButton', false);
    AuthenticationState.isLoginLoading = false;
  }
}

/**
 * Maneja envio do formulário de CADASTRO
 */
async function handleRegisterSubmit() {
  clearErrorMessage('register');
  
  // Valida formulário
  const validationError = validateRegisterForm();
  if (validationError) {
    displayErrorMessage(validationError, 'register');
    return;
  }
  
  // Prepara para envio
  setButtonLoadingState('registerSubmitButton', true);
  AuthenticationState.isRegisterLoading = true;
  
  try {
    const firstNameInput = document.getElementById('registerFirstNameInput');
    const lastNameInput = document.getElementById('registerLastNameInput');
    const emailInput = document.getElementById('registerEmailInput');
    const cpfInput = document.getElementById('registerCpfInput');
    const passwordInput = document.getElementById('registerPasswordInput');
    
    const userData = {
      fullName: `${firstNameInput?.value.trim()} ${lastNameInput?.value.trim()}`,
      email: emailInput?.value.trim(),
      cpf: cpfInput?.value.trim(),
      password: passwordInput?.value
    };
    
    // Envia para backend
    const responseData = await sendRegisterRequest(userData);
    
    // Salva dados do usuário no localStorage
    localStorage.setItem('userToken', responseData.token);
    localStorage.setItem('userData', JSON.stringify(responseData.user));
    
    // Notifica sucesso
    showToast('Conta criada com sucesso! Bem-vindo à plataforma!', 'success');
    
    // Redireciona após 1.5 segundos
    setTimeout(() => {
      navigateTo('home');
    }, 1500);
    
  } catch (errorException) {
    displayErrorMessage(
      errorException.message || 'Erro ao criar conta. Tente novamente.',
      'register'
    );
  } finally {
    setButtonLoadingState('registerSubmitButton', false);
    AuthenticationState.isRegisterLoading = false;
  }
}

// ═══════════════════════════════════════════════════════════
// 8. INICIALIZAÇÃO
// ═══════════════════════════════════════════════════════════

/**
 * Inicializa a tela de login quando carrega
 */
function initLoginPage() {
  // Garante que a aba de login está ativa por padrão
  switchAuthTab('login');
  
  // Limpa campos de entrada
  const loginEmailInput = document.getElementById('loginEmailInput');
  const loginPasswordInput = document.getElementById('loginPasswordInput');
  if (loginEmailInput) loginEmailInput.value = '';
  if (loginPasswordInput) loginPasswordInput.value = '';
  
  // Limpa campos de cadastro
  document.getElementById('registerFirstNameInput').value = '';
  document.getElementById('registerLastNameInput').value = '';
  document.getElementById('registerEmailInput').value = '';
  document.getElementById('registerCpfInput').value = '';
  document.getElementById('registerPasswordInput').value = '';
  document.getElementById('registerConfirmPasswordInput').value = '';
  document.getElementById('acceptTermsCheckbox').checked = false;
  
  console.log('✓ Página de login inicializada');
}
