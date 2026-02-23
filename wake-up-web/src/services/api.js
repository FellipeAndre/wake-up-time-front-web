import axios from 'axios'

/*
  services/api.js — HTTP Client Base

  Responsabilidade:
  - Configurar cliente HTTP (axios)
  - Adicionar interceptadores (autenticação, erros)
  - Base URL centralizada
  - Headers padrão

  Analogia Spring Boot:
  - é como um RestTemplate ou Feign Client bean
  - Todos os services usam este cliente

  INTERCEPTADORES:
  1. Request: adiciona Bearer token automaticamente
  2. Response: trata erros globais

  Exemplo uso:
  ```javascript
  import api from './api'

  // GET /api/home/estatisticas?param=valor
  api.get('/home/estatisticas', { params: { param: 'valor' } })

  // POST /api/auth/login com JSON
  api.post('/auth/login', { email, password })

  // Bearer é adicionado automaticamente!
  ```
*/

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  timeout: 10000, // 10 segundos
  headers: {
    'Content-Type': 'application/json'
  }
})

/*
  ─────────────────────────────────────────────────────────
  INTERCEPTADOR DE REQUISIÇÃO
  Executado ANTES de enviar requisição ao backend
  ─────────────────────────────────────────────────────────

  Responsabilidade:
  - Adicionar Bearer token no header Authorization
  - Transformar dados antes de enviar (se necessário)

  Análogo em Spring:
  - Similar a @Component implementando ClientHttpRequestInterceptor
*/
api.interceptors.request.use(
  (config) => {
    // Busca token salvo no localStorage
    const token = localStorage.getItem('wun_token')

    // Se existe token, adiciona no header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

/*
  ─────────────────────────────────────────────────────────
  INTERCEPTADOR DE RESPOSTA
  Executado DEPOIS que backend responde
  ─────────────────────────────────────────────────────────

  Responsabilidade:
  - Tratar erros HTTP globalmente
  - Renovar token se expirou (401)
  - Redirecionar para login se não autenticado
  - Logar erros

  Análogo em Spring:
  - Similar a ExceptionHandler global
  - Similar a AuthenticationEntryPoint para 401
*/
api.interceptors.response.use(
  (response) => {
    // Status 2xx: enviar resposta normalmente
    return response
  },
  (error) => {
    /*
      Se erro 401 (Unauthorized → token expirou ou inválido)
      1. Limpa localStorage
      2. Redireciona para /login
      3. Lança erro tratado
    */
    if (error.response?.status === 401) {
      localStorage.removeItem('wun_token')
      localStorage.removeItem('wun_user')
      window.location.href = '/login'
    }

    /*
      Se erro 403 (Forbidden → sem permissão)
      1. Redireciona para home
      2. Lança erro
    */
    if (error.response?.status === 403) {
      window.location.href = '/'
    }

    // Log de erros (útil para debugging)
    console.error('[API ERROR]', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    })

    return Promise.reject(error)
  }
)

export default api
