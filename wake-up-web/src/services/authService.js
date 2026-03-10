/**
 * authService.js — Serviço de Autenticação Wake Up Now
 * 
 * FLUXO SIMPLIFICADO (Email/Password com Spring Backend):
 * 1. Usuario tenta login com email + password
 * 2. Backend valida e retorna JWT token
 * 3. Token salvo em localStorage + usado em todas requisições
 * 4. Se login falhar (usuario não existe), redireciona para cadastro
 * 5. Cadastro cria nova conta (email + nome + senha)
 * 6. Cadastro bem-sucedido retorna JWT
 */

import api from './api'

const authService = {
  /**
   * LOGIN COM EMAIL E SENHA
   * 
   * POST /auth/login
   * Body: { email, password }
   * Response: { token: "jwt_string" }
   * 
   * @param {string} email
   * @param {string} password
   * @returns { token }
   */
  async loginWithEmail(email, password) {
    try {
      console.log('[authService.loginWithEmail] Iniciando login com email:', email)
      console.log('[authService.loginWithEmail] Body sendo enviado:', { email, password: '***' })

      const { data } = await api.post('/auth/login', {
        email,
        password
      })

      console.log('[authService.loginWithEmail] Login bem-sucedido, resposta:', data)
      return data
    } catch (error) {
      console.error('[authService.loginWithEmail] Login falhou com erro:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
        code: error.code
      })
      
      // 🔴 DEBUG: Mostrar a resposta exata do backend
      console.error('[authService.loginWithEmail] Resposta completa do backend:', error.response?.data)

      if (error.response?.status === 401 || error.response?.status === 403) {
        // Credenciais inválidas
        console.error('[authService.loginWithEmail] ❌ 401/403: Backend retornou credenciais inválidas')
        throw new Error('Email ou senha incorretos')
      }
      if (error.response?.status === 404) {
        // Usuario não encontrado
        console.error('[authService.loginWithEmail] ❌ 404: Usuário não encontrado no backend')
        throw new Error('Usuário não encontrado. Faça cadastro primeiro.')
      }

      throw new Error(error.message || 'Erro ao fazer login')
    }
  },

  /**
   * CADASTRO NOVO
   * 
   * POST /users
   * Body: { email, name, password }
   * Response: { token: "jwt", user: { id, email, name, role } }
   * 
   * @param {object} userData - { email, name, password }
   * @returns { token, user }
   */
  async signup(userData) {
    try {
      console.log('[authService.signup] Iniciando cadastro com dados:', {
        email: userData.email,
        name: userData.name,
        password: '***'
      })

      console.log('[authService.signup] Enviando POST /users...')
      const { data } = await api.post('/users', {
        email: userData.email,
        name: userData.name,
        password: userData.password
      })

      console.log('[authService.signup] Cadastro bem-sucedido, resposta:', data)
      return data
    } catch (error) {
      console.error('[authService.signup] Cadastro falhou com erro:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
        code: error.code
      })

      if (error.response?.status === 409) {
        throw new Error('Email já cadastrado')
      }
      if (error.response?.status === 400) {
        throw new Error(error.response.data?.message || 'Dados inválidos')
      }

      throw new Error(error.message || 'Erro ao cadastrar')
    }
  },

  /**
   * LOGOUT
   * Remove token do localStorage
   */
  logout() {
    console.log('[authService.logout] Removendo token do localStorage')
    localStorage.removeItem('wun_token')
  },

  /**
   * SALVAR TOKEN NO LOCALSTORAGE
   * 
   * @param {string} token - JWT token de autenticação
   */
  saveAuthData(token) {
    console.log('[authService.saveAuthData] Salvando token:', token ? 'token recebido' : 'SEM TOKEN')
    if (!token) {
      console.warn('[authService.saveAuthData] AVISO: Token vazio ou undefined!')
      return
    }
    localStorage.setItem('wun_token', token)
    console.log('[authService.saveAuthData] Token salvo com sucesso em localStorage')
  },

  /**
   * RESTAURAR SESSÃO DO LOCALSTORAGE
   */
  getStoredAuth() {
    const token = localStorage.getItem('wun_token')
    console.log('[authService.getStoredAuth] Token recuperado:', token ? 'token encontrado' : 'nenhum token')
    return token ? { token } : null
  },

  /**
   * SOLICITAR RESET DE SENHA
   * 
   * POST /password-reset/request
   * Body: { email, callbackUrl }
   * Response: { message: "Email enviado com sucesso" }
   * 
   * @param {string} email
   * @returns { message }
   */
  async requestPasswordReset(email) {
    try {
      console.log('[authService.requestPasswordReset] Iniciando reset de senha para:', email)

      // Construir URL de callback (onde o usuario será redirecionado após clicar no link do email)
      const callbackUrl = `${window.location.origin}/reset-password`
      console.log('[authService.requestPasswordReset] Callback URL:', callbackUrl)

      const { data } = await api.post('/password-reset/request', {
        email,
        callbackUrl // Backend vai usar para construir: http://localhost:3000/reset-password?token=xxxxx
      })

      console.log('[authService.requestPasswordReset] Email enviado com sucesso')
      return data
    } catch (error) {
      console.error('[authService.requestPasswordReset] Falha ao solicitar reset:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      })

      if (error.response?.status === 404) {
        throw new Error('Email não encontrado no sistema')
      }

      throw new Error(error.response?.data?.message || 'Erro ao solicitar reset de senha')
    }
  },

  /**
   * CONFIRMAR RESET DE SENHA
   * 
   * POST /password-reset/confirm ou /update/password
   * Body: { token, newPassword }
   * Response: { message: "Senha alterada com sucesso" }
   * 
   * @param {string} token - Token enviado no email
   * @param {string} newPassword - Nova senha
   * @returns { message }
   */
  async resetPassword(token, newPassword) {
    try {
      console.log('[authService.resetPassword] Confirmando reset de senha com token')

      const { data } = await api.post('/update/password', {
        token,
        newPassword
      })

      console.log('[authService.resetPassword] Senha alterada com sucesso')
      return data
    } catch (error) {
      console.error('[authService.resetPassword] Falha ao resetar senha:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      })

      if (error.response?.status === 400) {
        throw new Error('Token inválido ou expirado')
      }

      throw new Error(error.response?.data?.message || 'Erro ao alterar senha')
    }
  },

  /**
   * VERIFICAR SE USUÁRIO ESTÁ AUTENTICADO
   */
  isAuthenticated() {
    return !!localStorage.getItem('wun_token')
  },

  /**
   * OBTER TOKEN ATUAL
   */
  getToken() {
    return localStorage.getItem('wun_token')
  },

  /**
   * VALIDAR TOKEN COM BACKEND
   * 
   * GET /auth/validate com Bearer token no header
   * Response: { valid: true } ou erro
   * 
   * @param {string} token - JWT token
   * @returns { valid: true }
   */
  async validateToken(token) {
    try {
      if (!token) {
        console.warn('[authService.validateToken] Token vazio ou undefined')
        return false
      }

      console.log('[authService.validateToken] Validando token com backend...')

      // Cria uma requisição com Bearer token no header
      const { data } = await api.get('/auth/validate', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      console.log('[authService.validateToken] Token válido', data)
      return data.valid === true || data.isValid === true || true

    } catch (error) {
      console.error('[authService.validateToken] Validação de token falhou:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      })

      if (error.response?.status === 401 || error.response?.status === 403) {
        console.error('[authService.validateToken] Token inválido ou expirado')
        return false
      }

      // Se o backend não pode validar (endpoint não existe ainda), retorna false
      console.warn('[authService.validateToken] Não foi possível validar token no backend')
      return false
    }
  }
}

export default authService

