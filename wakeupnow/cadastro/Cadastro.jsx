import React, { useState } from 'react';

/**
 * COMPONENTE: Cadastro
 * 
 * Responsabilidade:
 * - Tela de cadastro/login para usuários
 * - Validação de formulários
 * - Integração com backend
 */

export default function Cadastro() {
  const [activeTab, setActiveTab] = useState('login');
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    cpf: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });
  const [loginError, setLoginError] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);

  // Validações
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidCPF = (cpf) => cpf.replace(/\D/g, '').length === 11;

  // Validar login
  const validateLogin = () => {
    if (!loginForm.email.trim()) {
      setLoginError('Por favor, informe seu e-mail.');
      return false;
    }
    if (!isValidEmail(loginForm.email)) {
      setLoginError('E-mail inválido.');
      return false;
    }
    if (!loginForm.password) {
      setLoginError('Por favor, informe sua senha.');
      return false;
    }
    if (loginForm.password.length < 6) {
      setLoginError('Senha deve ter no mínimo 6 caracteres.');
      return false;
    }
    setLoginError('');
    return true;
  };

  // Validar cadastro
  const validateRegister = () => {
    if (!registerForm.firstName.trim() || !registerForm.lastName.trim()) {
      setRegisterError('Por favor, informe seu nome completo.');
      return false;
    }
    if (!registerForm.email.trim()) {
      setRegisterError('Por favor, informe seu e-mail.');
      return false;
    }
    if (!isValidEmail(registerForm.email)) {
      setRegisterError('E-mail inválido.');
      return false;
    }
    if (!registerForm.cpf.trim()) {
      setRegisterError('Por favor, informe seu CPF.');
      return false;
    }
    if (!isValidCPF(registerForm.cpf)) {
      setRegisterError('CPF inválido (11 dígitos).');
      return false;
    }
    if (!registerForm.password) {
      setRegisterError('Por favor, informe uma senha.');
      return false;
    }
    if (registerForm.password.length < 8) {
      setRegisterError('Senha deve ter no mínimo 8 caracteres.');
      return false;
    }
    if (registerForm.password !== registerForm.confirmPassword) {
      setRegisterError('As senhas não conferem.');
      return false;
    }
    if (!registerForm.acceptTerms) {
      setRegisterError('Você deve aceitar os Termos de Uso.');
      return false;
    }
    setRegisterError('');
    return true;
  };

  // Máscara CPF
  const handleCPFChange = (value) => {
    let cpf = value.replace(/\D/g, '').slice(0, 11);
    if (cpf.length > 9) {
      cpf = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d+)/, '$1.$2.$3-$4');
    } else if (cpf.length > 6) {
      cpf = cpf.replace(/(\d{3})(\d{3})(\d+)/, '$1.$2.$3');
    } else if (cpf.length > 3) {
      cpf = cpf.replace(/(\d{3})(\d+)/, '$1.$2');
    }
    setRegisterForm({ ...registerForm, cpf });
  };

  // Enviar login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!validateLogin()) return;

    setIsLoginLoading(true);
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginForm.email,
          password: loginForm.password
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Erro ao fazer login');

      // Salvar autenticação
      window.AuthState.login(data.user, data.token);
      
      // Recarregar página para atualizar UI
      window.location.reload();
    } catch (error) {
      setLoginError(error.message || 'Erro ao fazer login');
    } finally {
      setIsLoginLoading(false);
    }
  };

  // Enviar cadastro
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!validateRegister()) return;

    setIsRegisterLoading(true);
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';
      const response = await fetch(`${apiUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${registerForm.firstName} ${registerForm.lastName}`,
          email: registerForm.email,
          cpf: registerForm.cpf,
          password: registerForm.password
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Erro ao criar conta');

      // Salvar autenticação
      window.AuthState.login(data.user, data.token);
      
      // Recarregar página para atualizar UI
      window.location.reload();
    } catch (error) {
      setRegisterError(error.message || 'Erro ao criar conta');
    } finally {
      setIsRegisterLoading(false);
    }
  };

  return (
    <div className="view active" style={{padding: '40px'}}>
      <div className="cadastro-container">
        
        {/* Abas */}
        <div className="auth-tabs">
          <button 
            className={`tab-btn ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => { setActiveTab('login'); setLoginError(''); setRegisterError(''); }}
          >
            Entrar
          </button>
          <button 
            className={`tab-btn ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => { setActiveTab('register'); setLoginError(''); setRegisterError(''); }}
          >
            Criar Conta
          </button>
        </div>

        {/* LOGIN */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="auth-form">
            <h2>Bem-vindo de volta</h2>
            <p>Acesse sua conta para continuar aprendendo</p>

            {loginError && <div className="error-box">{loginError}</div>}

            <div className="form-group">
              <label>E-mail</label>
              <input 
                type="email"
                placeholder="seu@email.com"
                value={loginForm.email}
                onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label>Senha</label>
              <input 
                type="password"
                placeholder="Sua senha"
                value={loginForm.password}
                onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={isLoginLoading}>
              {isLoginLoading ? '⏳ Autenticando...' : '➔ Entrar'}
            </button>
          </form>
        )}

        {/* CADASTRO */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="auth-form">
            <h2>Criar Conta</h2>
            <p>Preencha seus dados para se cadastrar</p>

            {registerError && <div className="error-box">{registerError}</div>}

            <div className="form-group">
              <label>Nome</label>
              <input 
                type="text"
                placeholder="Seu nome"
                value={registerForm.firstName}
                onChange={(e) => setRegisterForm({...registerForm, firstName: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label>Sobrenome</label>
              <input 
                type="text"
                placeholder="Seu sobrenome"
                value={registerForm.lastName}
                onChange={(e) => setRegisterForm({...registerForm, lastName: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label>E-mail</label>
              <input 
                type="email"
                placeholder="seu@email.com"
                value={registerForm.email}
                onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label>CPF</label>
              <input 
                type="text"
                placeholder="000.000.000-00"
                value={registerForm.cpf}
                maxLength="14"
                onChange={(e) => handleCPFChange(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Senha</label>
              <input 
                type="password"
                placeholder="Mín. 8 caracteres"
                value={registerForm.password}
                onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label>Confirmar Senha</label>
              <input 
                type="password"
                placeholder="Repita a senha"
                value={registerForm.confirmPassword}
                onChange={(e) => setRegisterForm({...registerForm, confirmPassword: e.target.value})}
              />
            </div>

            <div className="form-group checkbox">
              <input 
                id="terms"
                type="checkbox"
                checked={registerForm.acceptTerms}
                onChange={(e) => setRegisterForm({...registerForm, acceptTerms: e.target.checked})}
              />
              <label htmlFor="terms">
                Li e aceito os Termos de Uso
              </label>
            </div>

            <button type="submit" className="btn btn-primary" disabled={isRegisterLoading}>
              {isRegisterLoading ? '⏳ Criando conta...' : '🚀 Criar Minha Conta'}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}

// Styles
const styles = `
.cadastro-container {
  max-width: 500px;
  margin: 0 auto;
}

.auth-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
  border-bottom: 1px solid var(--border);
}

.tab-btn {
  flex: 1;
  padding: 12px;
  background: none;
  border: none;
  border-bottom: 3px solid transparent;
  color: var(--text-muted);
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s;
}

.tab-btn.active {
  color: var(--silver);
  border-bottom-color: var(--silver);
}

.auth-form h2 {
  margin-bottom: 5px;
  color: var(--text-primary);
}

.auth-form p {
  color: var(--text-muted);
  margin-bottom: 25px;
  font-size: 0.95rem;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: var(--text-primary);
  font-size: 0.95rem;
}

.form-group input {
  width: 100%;
  padding: 12px;
  background: var(--bg-input);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: 1rem;
  transition: all 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: var(--silver);
  box-shadow: 0 0 0 3px rgba(200, 200, 200, 0.1);
}

.form-group.checkbox {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 25px;
}

.form-group.checkbox input {
  width: auto;
}

.form-group.checkbox label {
  margin: 0;
  font-size: 0.9rem;
}

.error-box {
  padding: 12px;
  background: rgba(255, 100, 100, 0.1);
  border: 1px solid rgba(255, 100, 100, 0.3);
  border-radius: var(--radius-md);
  color: #ff6464;
  margin-bottom: 20px;
  font-size: 0.9rem;
}
`;
