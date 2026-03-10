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
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
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
    console.log('[API REQUEST]', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      fullURL: config.baseURL + config.url,
      data: config.data,
      headers: config.headers
    })

    // Busca token salvo no localStorage
    const token = localStorage.getItem('wun_token')

    // Se existe token, adiciona no header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      console.log('[API] Token adicionado ao header')
    } else {
      console.log('[API] Nenhum token encontrado no localStorage')
    }

    return config
  },
  (error) => {
    console.error('[API REQUEST ERROR]', error)
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
    console.log('[API RESPONSE]', {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
      headers: response.headers
    })
    // Status 2xx: enviar resposta normalmente
    return response
  },
  (error) => {
    console.error('[API RESPONSE ERROR]', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
      code: error.code,
      fullError: error
    })

    /*
      Se erro 401 (Unauthorized → credenciais inválidas em login)
      Mostrar mensagem de erro (não redirecionar automaticamente)
    */
    if (error.response?.status === 401) {
      console.log('[API] Erro 401 - credenciais inválidas')
      // Não redirecionar automaticamente - deixar a página mostrar mensagem de erro
      // localStorage.removeItem('wun_token')
      // localStorage.removeItem('wun_user')
      // window.location.href = '/login'
    }

    /*
      Se erro 403 (Forbidden → sem permissão em rotas autenticadas)
      Redirecionar para home apenas em rotas protegidas
    */
    if (error.response?.status === 403) {
      console.log('[API] Erro 403 - sem permissão')
      // Redirecionar apenas em rotas que exigem autenticação
      // window.location.href = '/'
    }

    return Promise.reject(error)
  }
)

export default api
