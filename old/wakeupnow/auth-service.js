/**
 * 🔐 AUTH SERVICE · Wake Up Now
 * 
 * Responsabilidade:
 * - Chamadas à API de autenticação
 * - Google & Apple OAuth
 * - Validar usuário na base
 * - Redirecionar pra cadastro se novo
 */

const AuthService = {
  /**
   * Valida credencial Google no backend
   * Se existe: faz login
   * Se não existe: retorna dados para cadastro
   */
  async validateGoogleToken(googleToken) {
    try {
      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: googleToken })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      
      // Resposta do backend:
      // { success: true, user: {...}, token: "jwt", isNewUser: false }
      // OU
      // { success: false, isNewUser: true, userData: {email, name} }
      
      return data;
    } catch (error) {
      console.error('Google validation error:', error);
      throw error;
    }
  },

  /**
   * Valida credencial Apple no backend
   */
  async validateAppleToken(appleToken) {
    try {
      const response = await fetch('/api/auth/apple', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: appleToken })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Apple validation error:', error);
      throw error;
    }
  },

  /**
   * Completa o cadastro de novo usuário
   */
  async completeSignup(userData) {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        throw new Error('Erro ao completar cadastro');
      }

      return await response.json();
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  },

  /**
   * Faz login com email/senha
   */
  async loginEmail(email, password) {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao fazer login');
      }

      return await response.json();
    } catch (error) {
      console.error('Email login error:', error);
      throw error;
    }
  },

  /**
   * Salva token e dados do usuário localmente
   */
  saveAuthData(user, token) {
    localStorage.setItem('wun_user', JSON.stringify(user));
    localStorage.setItem('wun_token', token);
    window.AuthState.login(user, token);
  },

  /**
   * Recupera dados salvos
   */
  getAuthData() {
    const token = localStorage.getItem('wun_token');
    const user = localStorage.getItem('wun_user');
    return {
      token,
      user: user ? JSON.parse(user) : null
    };
  },

  /**
   * Faz logout
   */
  logout() {
    localStorage.removeItem('wun_token');
    localStorage.removeItem('wun_user');
    window.AuthState.logout();
  },

  /**
   * Verifica se está autenticado
   */
  isAuthenticated() {
    const { token } = this.getAuthData();
    return !!token;
  }
};

// Exportar para uso global
window.AuthService = AuthService;
