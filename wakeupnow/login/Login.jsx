import React, { useState } from 'react';
import './login.css';

/**
 * COMPONENTE: LoginForm
 * 
 * Responsabilidade:
 * - Renderizar tela de login/cadastro
 * - Gerenciar estado dos formulários
 * - Validar entradas
 * - Comunicar com backend
 * - Exibir feedbacks ao usuário
 * 
 * Props:
 * - onLoginSuccess(userData): Callback quando login é bem-sucedido
 */
export default function LoginForm({ onLoginSuccess = null }) {
  
  // ═══════════════════════════════════════════════════════════
  // ESTADO DO COMPONENTE
  // ═══════════════════════════════════════════════════════════
  
  // Aba ativa (login ou register)
  const [activeTab, setActiveTab] = useState('login');
  
  // Formulário de LOGIN
  const [loginFormData, setLoginFormData] = useState({
    email: '',
    password: ''
  });
  const [loginError, setLoginError] = useState('');
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  
  // Formulário de CADASTRO
  const [registerFormData, setRegisterFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    cpf: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });
  const [registerError, setRegisterError] = useState('');
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(null);
  
  // ═══════════════════════════════════════════════════════════
  // VALIDAÇÕES
  // ═══════════════════════════════════════════════════════════
  
  /**
   * Valida formato de email
   */
  const isValidEmail = (emailAddress) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailAddress);
  };
  
  /**
   * Valida CPF (apenas conta dígitos)
   */
  const isValidCPF = (cpfNumber) => {
    const onlyNumbers = cpfNumber.replace(/\D/g, '');
    return onlyNumbers.length === 11;
  };
  
  /**
   * Valida força da senha
   */
  const evaluatePasswordStrength = (passwordValue) => {
    const hasMinLength = passwordValue.length >= 8;
    const hasUppercase = /[A-Z]/.test(passwordValue);
    const hasNumbers = /\d/.test(passwordValue);
    const hasSpecial = /[^a-zA-Z0-9]/.test(passwordValue);
    
    const score = [hasMinLength, hasUppercase, hasNumbers, hasSpecial]
      .filter(Boolean).length;
    
    if (score <= 1) return { level: 'weak', text: 'Fraca' };
    if (score <= 3) return { level: 'medium', text: 'Média' };
    return { level: 'strong', text: 'Forte' };
  };
  
  /**
   * Valida formulário de LOGIN
   */
  const validateLogin = () => {
    const { email, password } = loginFormData;
    
    if (!email.trim()) {
      setLoginError('Por favor, informe seu e-mail.');
      return false;
    }
    
    if (!isValidEmail(email)) {
      setLoginError('E-mail inválido. Verifique o formato.');
      return false;
    }
    
    if (!password) {
      setLoginError('Por favor, informe sua senha.');
      return false;
    }
    
    if (password.length < 6) {
      setLoginError('Senha deve ter no mínimo 6 caracteres.');
      return false;
    }
    
    return true;
  };
  
  /**
   * Valida formulário de CADASTRO
   */
  const validateRegister = () => {
    const { firstName, lastName, email, cpf, password, confirmPassword, acceptTerms } = registerFormData;
    
    if (!firstName.trim() || !lastName.trim()) {
      setRegisterError('Por favor, informe seu nome completo.');
      return false;
    }
    
    if (!email.trim()) {
      setRegisterError('Por favor, informe seu e-mail.');
      return false;
    }
    
    if (!isValidEmail(email)) {
      setRegisterError('E-mail inválido. Verifique o formato.');
      return false;
    }
    
    if (!cpf.trim()) {
      setRegisterError('Por favor, informe seu CPF.');
      return false;
    }
    
    if (!isValidCPF(cpf)) {
      setRegisterError('CPF inválido. Deve conter 11 dígitos.');
      return false;
    }
    
    if (!password) {
      setRegisterError('Por favor, informe uma senha.');
      return false;
    }
    
    if (password.length < 8) {
      setRegisterError('Senha deve ter no mínimo 8 caracteres.');
      return false;
    }
    
    if (password !== confirmPassword) {
      setRegisterError('As senhas não conferem. Verifique.');
      return false;
    }
    
    if (!acceptTerms) {
      setRegisterError('Você deve aceitar os Termos de Uso para continuar.');
      return false;
    }
    
    return true;
  };
  
  // ═══════════════════════════════════════════════════════════
  // HANDLERS DE EVENTO
  // ═══════════════════════════════════════════════════════════
  
  /**
   * Maneja mudança no campo de CPF (aplica máscara)
   */
  const handleCPFChange = (value) => {
    let cpfNumbers = value.replace(/\D/g, '').slice(0, 11);
    
    if (cpfNumbers.length > 9) {
      cpfNumbers = cpfNumbers.replace(/(\d{3})(\d{3})(\d{3})(\d+)/, '$1.$2.$3-$4');
    } else if (cpfNumbers.length > 6) {
      cpfNumbers = cpfNumbers.replace(/(\d{3})(\d{3})(\d+)/, '$1.$2.$3');
    } else if (cpfNumbers.length > 3) {
      cpfNumbers = cpfNumbers.replace(/(\d{3})(\d+)/, '$1.$2');
    }
    
    setRegisterFormData({
      ...registerFormData,
      cpf: cpfNumbers
    });
  };
  
  /**
   * Maneja mudança na senha e avalia força
   */
  const handlePasswordChange = (passwordValue) => {
    setRegisterFormData({
      ...registerFormData,
      password: passwordValue
    });
    
    if (passwordValue) {
      setPasswordStrength(evaluatePasswordStrength(passwordValue));
    } else {
      setPasswordStrength(null);
    }
  };
  
  /**
   * Maneja envio do LOGIN
   */
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    
    setLoginError('');
    
    if (!validateLogin()) {
      return;
    }
    
    setIsLoginLoading(true);
    
    try {
      const backendUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';
      
      const response = await fetch(`${backendUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: loginFormData.email,
          password: loginFormData.password
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao fazer login');
      }
      
      const data = await response.json();
      
      // Salva token e dados do usuário
      localStorage.setItem('userToken', data.token);
      localStorage.setItem('userData', JSON.stringify(data.user));
      
      // Callback de sucesso
      if (onLoginSuccess) {
        onLoginSuccess(data.user);
      } else {
        // Navegação padrão
        window.location.href = '/home';
      }
      
    } catch (errorException) {
      setLoginError(
        errorException.message || 'Erro ao fazer login. Verifique suas credenciais.'
      );
    } finally {
      setIsLoginLoading(false);
    }
  };
  
  /**
   * Maneja envio do CADASTRO
   */
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    
    setRegisterError('');
    
    if (!validateRegister()) {
      return;
    }
    
    setIsRegisterLoading(true);
    
    try {
      const backendUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';
      
      const response = await fetch(`${backendUrl}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: `${registerFormData.firstName} ${registerFormData.lastName}`,
          email: registerFormData.email,
          cpf: registerFormData.cpf,
          password: registerFormData.password
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao criar conta');
      }
      
      const data = await response.json();
      
      // Salva token e dados do usuário
      localStorage.setItem('userToken', data.token);
      localStorage.setItem('userData', JSON.stringify(data.user));
      
      // Callback de sucesso
      if (onLoginSuccess) {
        onLoginSuccess(data.user);
      } else {
        // Navegação padrão
        window.location.href = '/home';
      }
      
    } catch (errorException) {
      setRegisterError(
        errorException.message || 'Erro ao criar conta. Tente novamente.'
      );
    } finally {
      setIsRegisterLoading(false);
    }
  };
  
  // ═══════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════
  
  return (
    <div id="viewLogin" className="view">
      <div className="loginContainer">
        
        {/* LADO ESQUERDO: FORMULÁRIO */}
        <div className="loginFormSection">
          
          {/* HEADER COM LOGO */}
          <div className="loginHeader">
            <div className="logoBox">
              <svg viewBox="0 0 80 92" fill="none" xmlns="http://www.w3.org/2000/svg" className="logoBrand">
                <polygon points="40,3 77,22.5 77,69.5 40,89 3,69.5 3,22.5"
                  stroke="rgba(200,200,200,0.6)" strokeWidth="3" fill="none"/>
                <polygon points="40,9 71,26.5 71,65.5 40,83 9,65.5 9,26.5"
                  stroke="rgba(200,200,200,0.25)" strokeWidth="1.5" fill="none"/>
                <rect x="22" y="52" width="24" height="10" rx="1" fill="rgba(200,200,200,0.7)"/>
                <rect x="22" y="48" width="10" height="5" rx="1" fill="rgba(200,200,200,0.7)"/>
                <rect x="22" y="61" width="3" height="5" rx="1" fill="rgba(200,200,200,0.5)"/>
                <rect x="40" y="61" width="3" height="5" rx="1" fill="rgba(200,200,200,0.5)"/>
                <circle cx="54" cy="38" r="6" stroke="rgba(200,200,200,0.6)" strokeWidth="2" fill="none"/>
                <line x1="54" y1="44" x2="54" y2="50" stroke="rgba(200,200,200,0.5)" strokeWidth="1.5"/>
                <circle cx="51" cy="52" r="1" fill="rgba(200,200,200,0.5)"/>
                <circle cx="54" cy="53" r="1" fill="rgba(200,200,200,0.5)"/>
                <circle cx="57" cy="52" r="1" fill="rgba(200,200,200,0.5)"/>
              </svg>
            </div>
            <h1 className="brandName">WAKE UP NOW</h1>
            <p className="brandSlogan">Desperte seu potencial</p>
          </div>
          
          {/* ABAS */}
          <div className="authTabsContainer">
            <button 
              className={`authTabButton ${activeTab === 'login' ? 'authTabButtonActive' : ''}`}
              onClick={() => {
                setActiveTab('login');
                setLoginError('');
                setRegisterError('');
              }}
            >
              Entrar
            </button>
            <button 
              className={`authTabButton ${activeTab === 'register' ? 'authTabButtonActive' : ''}`}
              onClick={() => {
                setActiveTab('register');
                setLoginError('');
                setRegisterError('');
              }}
            >
              Criar Conta
            </button>
          </div>
          
          {/* FORMULÁRIO DE LOGIN */}
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="authFormWrapper">
              <h2 className="formTitle">Bem-vindo de volta</h2>
              <p className="formSubtitle">Acesse sua conta para continuar aprendendo</p>
              
              {loginError && (
                <div className="errorMessageBox">{loginError}</div>
              )}
              
              <div className="formGroup">
                <label className="formLabel" htmlFor="loginEmailInput">E-mail</label>
                <input 
                  id="loginEmailInput"
                  type="email"
                  className="formInput"
                  placeholder="seu@email.com"
                  value={loginFormData.email}
                  onChange={(e) => setLoginFormData({...loginFormData, email: e.target.value})}
                />
              </div>
              
              <div className="formGroup">
                <label className="formLabel" htmlFor="loginPasswordInput">Senha</label>
                <div className="passwordFieldWrapper">
                  <input 
                    id="loginPasswordInput"
                    type="password"
                    className="formInput"
                    placeholder="Sua senha"
                    value={loginFormData.password}
                    onChange={(e) => setLoginFormData({...loginFormData, password: e.target.value})}
                  />
                  <button 
                    type="button"
                    className="passwordToggleButton"
                    onClick={() => {
                      const input = document.getElementById('loginPasswordInput');
                      input.type = input.type === 'password' ? 'text' : 'password';
                    }}
                  >
                    👁
                  </button>
                </div>
              </div>
              
              <div className="forgotPasswordLink">
                <a href="#" className="linkText">Esqueceu sua senha?</a>
              </div>
              
              <button type="submit" className="submitButton" disabled={isLoginLoading}>
                {isLoginLoading ? '⏳ Autenticando...' : '➔ Entrar'}
              </button>
            </form>
          )}
          
          {/* FORMULÁRIO DE CADASTRO */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="authFormWrapper">
              <h2 className="formTitle">Criar Conta</h2>
              <p className="formSubtitle">Preencha seus dados para se cadastrar</p>
              
              {registerError && (
                <div className="errorMessageBox">{registerError}</div>
              )}
              
              <div className="formGroup">
                <label className="formLabel">Nome</label>
                <input 
                  type="text"
                  className="formInput"
                  placeholder="Seu nome"
                  value={registerFormData.firstName}
                  onChange={(e) => setRegisterFormData({...registerFormData, firstName: e.target.value})}
                />
              </div>
              
              <div className="formGroup">
                <label className="formLabel">Sobrenome</label>
                <input 
                  type="text"
                  className="formInput"
                  placeholder="Seu sobrenome"
                  value={registerFormData.lastName}
                  onChange={(e) => setRegisterFormData({...registerFormData, lastName: e.target.value})}
                />
              </div>
              
              <div className="formGroup">
                <label className="formLabel">E-mail</label>
                <input 
                  type="email"
                  className="formInput"
                  placeholder="seu@email.com"
                  value={registerFormData.email}
                  onChange={(e) => setRegisterFormData({...registerFormData, email: e.target.value})}
                />
              </div>
              
              <div className="formGroup">
                <label className="formLabel">CPF</label>
                <input 
                  type="text"
                  className="formInput"
                  placeholder="000.000.000-00"
                  maxLength="14"
                  value={registerFormData.cpf}
                  onChange={(e) => handleCPFChange(e.target.value)}
                />
              </div>
              
              <div className="formGroup">
                <label className="formLabel">Senha</label>
                <div className="passwordFieldWrapper">
                  <input 
                    type="password"
                    className="formInput"
                    placeholder="Mín. 8 caracteres"
                    value={registerFormData.password}
                    onChange={(e) => handlePasswordChange(e.target.value)}
                  />
                  <button 
                    type="button"
                    className="passwordToggleButton"
                    onClick={() => {
                      const input = document.querySelector('.passwordFieldWrapper input[type="password"]');
                      if (input) input.type = input.type === 'password' ? 'text' : 'password';
                    }}
                  >
                    👁
                  </button>
                </div>
                
                {passwordStrength && (
                  <div className="passwordStrengthBox">
                    <div className="strengthBar">
                      <div className={`strengthBarFill ${passwordStrength.level}`}></div>
                    </div>
                    <span className={`strengthText ${passwordStrength.level}`}>
                      {passwordStrength.text}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="formGroup">
                <label className="formLabel">Confirmar Senha</label>
                <div className="passwordFieldWrapper">
                  <input 
                    type="password"
                    className="formInput"
                    placeholder="Repita a senha"
                    value={registerFormData.confirmPassword}
                    onChange={(e) => setRegisterFormData({...registerFormData, confirmPassword: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="termsCheckboxContainer">
                <input 
                  id="termsCheckbox"
                  type="checkbox"
                  className="termsCheckbox"
                  checked={registerFormData.acceptTerms}
                  onChange={(e) => setRegisterFormData({...registerFormData, acceptTerms: e.target.checked})}
                />
                <label htmlFor="termsCheckbox" className="termsLabel">
                  Li e aceito os <a href="#" className="linkText">Termos de Uso</a> 
                  e a <a href="#" className="linkText">Política de Privacidade</a>
                </label>
              </div>
              
              <button type="submit" className="submitButton submitButtonPrimary" disabled={isRegisterLoading}>
                {isRegisterLoading ? '⏳ Criando conta...' : '🚀 Criar Minha Conta'}
              </button>
            </form>
          )}
          
          {/* DIVIDER */}
          <div className="dividerContainer">
            <span className="dividerText">ou</span>
          </div>
          
          {/* SOCIAL LOGIN */}
          <div className="socialLoginContainer">
            <button type="button" className="socialButtonGoogle" disabled>
              🔹 Continuar com Google (Em breve)
            </button>
          </div>
        </div>
        
        {/* LADO DIREITO: BENEFÍCIOS */}
        <div className="loginBenefitsSection">
          <div className="benefitsCard">
            <h3 className="benefitsTitle">Sua jornada começa aqui</h3>
            <p className="benefitsSubtitle">Junte-se a mais de 3.400+ pessoas que já despertaram seu potencial</p>
            
            <ul className="benefitsList">
              <li className="benefitItem">
                <span className="benefitCheck">✓</span>
                <span>Acesso imediato a 120+ vídeos</span>
              </li>
              <li className="benefitItem">
                <span className="benefitCheck">✓</span>
                <span>Conteúdo organizado por módulos</span>
              </li>
              <li className="benefitItem">
                <span className="benefitCheck">✓</span>
                <span>Certificado de conclusão</span>
              </li>
              <li className="benefitItem">
                <span className="benefitCheck">✓</span>
                <span>Suporte dedicado</span>
              </li>
              <li className="benefitItem">
                <span className="benefitCheck">✓</span>
                <span>Cancele quando quiser</span>
              </li>
            </ul>
            
            <div className="testimonialBox">
              <p className="testimonialText">"Essa plataforma mudou minha rotina completamente. Os conteúdos são diretos e aplicáveis."</p>
              <div className="testimonialAuthor">
                <div className="authorAvatar">MR</div>
                <div className="authorInfo">
                  <strong className="authorName">Marcos R.</strong>
                  <small className="authorRole">Aluno desde 2023</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
