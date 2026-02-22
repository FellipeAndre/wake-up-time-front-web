/**
 * API SERVICE - Authentication Module
 * 
 * Responsabilidade:
 * - Centralizar todas as chamadas de autenticação com o backend
 * - Gerenciar Bearer token nos headers
 * - Tratar erros de forma consistente
 * - Facilitar testes e manutenção
 * 
 * Exemplo de uso:
 *   const response = await AuthService.login(email, password);
 *   const response = await AuthService.register(userData);
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

/**
 * AuthService - Gerencia comunicação com endpoints de autenticação
 */
const AuthService = {
  
  /**
   * Obter token do localStorage
   */
  getToken() {
    return localStorage.getItem('userToken') || null;
  },

  /**
   * Construir headers com autenticação
   */
  getAuthHeaders() {
    const token = this.getToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  },

  /**
   * Fazer requisição autenticada
   * 
   * @param {string} endpoint - Caminho do endpoint (ex: '/auth/login')
   * @param {string} method - Método HTTP (GET, POST, PUT, DELETE)
   * @param {object} body - Corpo da requisição (opcional)
   * @returns {object} Dados da resposta
   * @throws {object} Objeto com erro
   */
  async request(endpoint, method = 'GET', body = null) {
    try {
      const options = {
        method,
        headers: this.getAuthHeaders()
      };

      // Adicionar corpo se fornecido
      if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
        options.body = JSON.stringify(body);
      }

      const fullUrl = `${API_BASE_URL}${endpoint}`;
      console.log(`📤 ${method} ${endpoint}`, body || '');

      const response = await fetch(fullUrl, options);

      // Tentar fazer parse do JSON
      let responseData;
      try {
        responseData = await response.json();
      } catch {
        responseData = null;
      }

      // Se resposta não foi ok, lançar erro
      if (!response.ok) {
        const errorMessage = 
          responseData?.message || 
          responseData?.error || 
          `Erro ${response.status}: ${response.statusText}`;
        
        console.error(`❌ ${errorMessage}`);
        
        throw {
          status: response.status,
          message: errorMessage,
          data: responseData
        };
      }

      console.log(`✅ Sucesso`, responseData);
      return responseData;

    } catch (error) {
      // Se é erro de rede
      if (error instanceof TypeError) {
        console.error('🔌 Erro de conexão:', error.message);
        throw {
          status: 0,
          message: 'Erro de conexão com o servidor. Verifique sua internet.',
          originalError: error
        };
      }

      // Re-lançar erro já tratado
      throw error;
    }
  },

  /**
   * POST /auth/login
   * 
   * @param {string} email - E-mail do usuário
   * @param {string} password - Senha do usuário
   * @returns {object} { token, user: {...} }
   */
  async login(email, password) {
    return this.request('/auth/login', 'POST', { email, password });
  },

  /**
   * POST /auth/register
   * 
   * @param {object} userData - { name, email, cpf, password }
   * @returns {object} { token, user: {...} }
   */
  async register(userData) {
    return this.request('/auth/register', 'POST', userData);
  },

  /**
   * POST /auth/google
   * 
   * @param {string} googleToken - Token JWT do Google Sign-In
   * @returns {object} { token, user: {...} }
   */
  async loginWithGoogle(googleToken) {
    return this.request('/auth/google', 'POST', { token: googleToken });
  },

  /**
   * POST /auth/apple
   * 
   * @param {string} appleToken - Token de identificação do Apple Sign-In
   * @returns {object} { token, user: {...} }
   */
  async loginWithApple(appleToken) {
    return this.request('/auth/apple', 'POST', { token: appleToken });
  },

  /**
   * POST /auth/refresh
   * 
   * Renovar JWT token
   * 
   * @returns {object} { token, user: {...} }
   */
  async refreshToken() {
    return this.request('/auth/refresh', 'POST');
  },

  /**
   * POST /auth/logout
   * 
   * Fazer logout no backend
   * 
   * @returns {object} { message: "..." }
   */
  async logout() {
    return this.request('/auth/logout', 'POST');
  }
};

/**
 * VideoService - Gerencia operações com vídeos
 */
const VideoService = {

  /**
   * GET /videos/list
   * 
   * Listar todos os vídeos/temas/módulos
   * 
   * @returns {object} { videos: [...], themes: [...] }
   */
  async listVideos() {
    return AuthService.request('/videos/list', 'GET');
  },

  /**
   * GET /videos/{id}
   * 
   * Obter detalhes de um vídeo específico
   * 
   * @param {number} videoId - ID do vídeo
   * @returns {object} Dados do vídeo completo
   */
  async getVideoById(videoId) {
    return AuthService.request(`/videos/${videoId}`, 'GET');
  },

  /**
   * GET /videos/theme/{themeId}
   * 
   * Obter todos os vídeos de um tema
   * 
   * @param {number} themeId - ID do tema
   * @returns {object} { videos: [...] }
   */
  async getVideosByTheme(themeId) {
    return AuthService.request(`/videos/theme/${themeId}`, 'GET');
  }
};

/**
 * PaymentService - Gerencia operações de pagamento
 */
const PaymentService = {

  /**
   * GET /payment/plans
   * 
   * Listar planos de pagamento disponíveis
   * 
   * @returns {object} { plans: [...] }
   */
  async listPlans() {
    return AuthService.request('/payment/plans', 'GET');
  },

  /**
   * POST /payment/checkout
   * 
   * Iniciar processo de checkout
   * 
   * @param {object} checkoutData - { planId, paymentMethod, ... }
   * @returns {object} { orderId, paymentUrl, ... }
   */
  async checkout(checkoutData) {
    return AuthService.request('/payment/checkout', 'POST', checkoutData);
  },

  /**
   * GET /payment/orders
   * 
   * Listar ordens de pagamento do usuário autenticado
   * 
   * @returns {object} { orders: [...] }
   */
  async listOrders() {
    return AuthService.request('/payment/orders', 'GET');
  }
};

/**
 * UserService - Gerencia dados do usuário
 */
const UserService = {

  /**
   * GET /user/profile
   * 
   * Obter perfil do usuário autenticado
   * 
   * @returns {object} Dados completos do usuário
   */
  async getProfile() {
    return AuthService.request('/user/profile', 'GET');
  },

  /**
   * PUT /user/profile
   * 
   * Atualizar perfil do usuário
   * 
   * @param {object} userData - Campos a atualizar
   * @returns {object} Dados atualizados
   */
  async updateProfile(userData) {
    return AuthService.request('/user/profile', 'PUT', userData);
  },

  /**
   * POST /user/password-change
   * 
   * Alterar senha do usuário
   * 
   * @param {string} currentPassword - Senha atual
   * @param {string} newPassword - Nova senha
   * @returns {object} { message: "..." }
   */
  async changePassword(currentPassword, newPassword) {
    return AuthService.request('/user/password-change', 'POST', {
      currentPassword,
      newPassword
    });
  }
};

/**
 * Error Handling Utilities
 */
const ErrorHandler = {

  /**
   * Obter mensagem de erro amigável ao usuário
   * 
   * @param {object} error - Objeto de erro da API
   * @returns {string} Mensagem em português
   */
  getErrorMessage(error) {
    const errorMessages = {
      0: 'Erro de conexão. Verifique sua internet.',
      400: 'Dados inválidos. Verifique o preenchimento.',
      401: 'Credenciais inválidas. Verifique e-mail e senha.',
      403: 'Acesso negado. Você não tem permissão.',
      404: 'Recurso não encontrado.',
      409: 'Este e-mail já está registrado.',
      500: 'Erro no servidor. Tente novamente em alguns instantes.',
      503: 'Servidor indisponível. Tente novamente mais tarde.'
    };

    // Usar mensagem customizada do backend se disponível
    if (error?.message) {
      return error.message;
    }

    // Usar mensagem padrão por status code
    return errorMessages[error?.status] || 'Ocorreu um erro desconhecido.';
  },

  /**
   * Determinar se erro é terminal (não tenta retry)
   * 
   * @param {object} error - Objeto de erro
   * @returns {boolean}
   */
  isTerminalError(error) {
    // Erros 4xx (exceto timeout) e de validação são terminais
    return error?.status >= 400 && error?.status < 500;
  },

  /**
   * Determinar se erro é de autenticação (precisa re-login)
   * 
   * @param {object} error - Objeto de erro
   * @returns {boolean}
   */
  isAuthError(error) {
    return error?.status === 401;
  }
};

/**
 * Exportar serviços para uso global
 */
if (typeof window !== 'undefined') {
  window.API = {
    Auth: AuthService,
    Video: VideoService,
    Payment: PaymentService,
    User: UserService,
    ErrorHandler
  };
}

// Exportar para uso em módulos ES6
export { AuthService, VideoService, PaymentService, UserService, ErrorHandler, API_BASE_URL };
