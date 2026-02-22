// 📡 WAKE UP NOW · API Integration Guide
// Como conectar o frontend React ao backend Spring Boot

// ═══════════════════════════════════════════════════════════════
// 1. CONFIGURAÇÃO BASE
// ═══════════════════════════════════════════════════════════════

// Defina a URL da API (adicione em index.html antes dos scripts)
const API_URL = 'http://localhost:8080/api';
// Ou use variável de ambiente em produção
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// ═══════════════════════════════════════════════════════════════
// 2. SERVICE LAYER (Abstrair chamadas HTTP)
// ═══════════════════════════════════════════════════════════════

const authService = {
  async login(email, password) {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao fazer login');
    }
    
    const data = await response.json();
    // Response esperado: { user: { id, name, email, role }, token: "jwt_token" }
    return data;
  },

  async register(userData) {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao registrar');
    }
    
    return await response.json();
  },

  async logout() {
    const token = localStorage.getItem('wun_token');
    if (!token) return;
    
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      console.warn('Logout request failed:', error);
    }
    
    // Mesmo se falhar, limpe localStorage
    window.AuthState.logout();
  }
};

const videoService = {
  async listVideos() {
    const response = await fetch(`${API_URL}/videos`, {
      headers: {
        'Authorization': `Bearer ${window.AuthState.userToken || ''}`
      }
    });
    
    if (!response.ok) throw new Error('Erro ao carregar vídeos');
    // Response esperado: { videos: [...] }
    return await response.json();
  },

  async getVideosByTheme(theme) {
    const response = await fetch(`${API_URL}/videos?theme=${theme}`, {
      headers: {
        'Authorization': `Bearer ${window.AuthState.userToken || ''}`
      }
    });
    
    if (!response.ok) throw new Error('Erro ao carregar vídeos');
    return await response.json();
  },

  async getVideoById(id) {
    const response = await fetch(`${API_URL}/videos/${id}`, {
      headers: {
        'Authorization': `Bearer ${window.AuthState.userToken || ''}`
      }
    });
    
    if (!response.ok) throw new Error('Erro ao carregar vídeo');
    return await response.json();
  },

  async uploadVideo(formData) {
    const token = window.AuthState.userToken;
    if (!token) throw new Error('Não autenticado');
    
    // formData já tem: title, description, theme, file
    const response = await fetch(`${API_URL}/videos/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
        // NÃO set Content-Type - o navegador vai fazer multipart/form-data
      },
      body: formData
    });
    
    if (!response.ok) throw new Error('Erro ao fazer upload');
    return await response.json();
  }
};

const paymentService = {
  async listPlans() {
    const response = await fetch(`${API_URL}/payment/plans`);
    if (!response.ok) throw new Error('Erro ao carregarpanos');
    // Response esperado: { plans: [...] }
    return await response.json();
  },

  async checkout(planId, paymentMethod) {
    const token = window.AuthState.userToken;
    if (!token) throw new Error('Não autenticado');
    
    const response = await fetch(`${API_URL}/payment/checkout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        planId,
        paymentMethod // 'card', 'pix', 'boleto'
      })
    });
    
    if (!response.ok) throw new Error('Erro ao processar pagamento');
    return await response.json();
  }
};

// ═══════════════════════════════════════════════════════════════
// 3. ATUALIZAR COMPONENTES PARA USAR SERVICES
// ═══════════════════════════════════════════════════════════════

// EXEMPLO: Componente Cadastro refatorado

function CadastroRefatorado() {
  const [loginForm, setLoginForm] = React.useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // ✅ Usar service ao invés de simular
      const response = await authService.login(
        loginForm.email,
        loginForm.password
      );
      
      // Response: { user: {...}, token: "jwt" }
      window.AuthState.login(response.user, response.token);
      
      // Navegar ou recarregar
      window.location.href = '/wakeupnow/';
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // ... resto do componente ...
}

// ═══════════════════════════════════════════════════════════════
// 4. AUTENTICAÇÃO COM BEARER TOKEN
// ═══════════════════════════════════════════════════════════════

// Helper para fazer requests com token automaticamente
async function apiCall(endpoint, options = {}) {
  const token = window.AuthState.userToken;
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers
  });
  
  // Se token expirou (401)
  if (response.status === 401) {
    window.AuthState.logout();
    window.location.href = '/wakeupnow/';
    return null;
  }
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Erro na requisição');
  }
  
  return await response.json();
}

// Uso:
const videos = await apiCall('/videos');
const userData = await apiCall('/users/me');

// ═══════════════════════════════════════════════════════════════
// 5. CONFIGURAÇÃO CORS (Backend Spring Boot)
// ═══════════════════════════════════════════════════════════════

/*
// application.properties ou application.yml

# Permite requisições do frontend
server.servlet.cors.allowed-origins=http://localhost:5173,http://localhost:3000,https://wakeupnow.com
server.servlet.cors.allowed-methods=GET,POST,PUT,DELETE,OPTIONS
server.servlet.cors.allowed-headers=*
server.servlet.cors.allow-credentials=true

# Ou configure via WebConfig.java:

@Configuration
public class WebConfig implements WebMvcConfigurer {
  @Override
  public void addCorsMappings(CorsRegistry registry) {
    registry.addMapping("/api/**")
        .allowedOrigins("http://localhost:5173", "https://wakeupnow.com")
        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
        .allowedHeaders("*")
        .allowCredentials(true)
        .maxAge(3600);
  }
}
*/

// ═══════════════════════════════════════════════════════════════
// 6. RESPONSE ESPERADOS DO BACKEND
// ═══════════════════════════════════════════════════════════════

// POST /api/auth/login
// Response:
// {
//   "user": {
//     "id": "uuid",
//     "name": "João Silva",
//     "email": "joao@example.com",
//     "role": "user"  // ou "admin"
//   },
//   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
// }

// POST /api/auth/register
// Request:
// {
//   "firstName": "João",
//   "lastName": "Silva",
//   "email": "joao@example.com",
//   "cpf": "12345678901",
//   "password": "senha123"
// }
// Response: { user: {...}, token: "jwt" }

// GET /api/videos
// Response:
// {
//   "videos": [
//     {
//       "id": "uuid",
//       "title": "Como acordar cedo",
//       "theme": "Rotina",
//       "duration": "12:30",
//       "thumbnail": "url",
//       "locked": false,
//       "url": "url-do-video"
//     },
//     ...
//   ]
// }

// GET /api/videos/:id
// Response:
// {
//   "id": "uuid",
//   "title": "Como acordar cedo",
//   "description": "...",
//   "url": "url-do-video",
//   ...
// }

// GET /api/payment/plans
// Response:
// {
//   "plans": [
//     {
//       "id": "starter",
//       "name": "Starter",
//       "price": 29.90,
//       "features": ["feature1", "feature2", ...]
//     },
//     ...
//   ]
// }

// POST /api/payment/checkout
// Request:
// {
//   "planId": "pro",
//   "paymentMethod": "card"
// }
// Response:
// {
//   "success": true,
//   "subscription": {
//     "id": "uuid",
//     "userId": "uuid",
//     "planId": "pro",
//     "startDate": "2024-01-15",
//     "endDate": "2025-01-15"
//   }
// }

// POST /api/videos/upload (multipart/form-data)
// Form fields: title, description, theme, file (binary)
// Response:
// {
//   "id": "uuid",
//   "title": "...",
//   "url": "url-do-video-armazenado"
// }

// ═══════════════════════════════════════════════════════════════
// 7. ERROR HANDLING
// ═══════════════════════════════════════════════════════════════

async function safeApiCall(endpoint, options = {}) {
  try {
    return await apiCall(endpoint, options);
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error.message);
    
    // Mostrar mensagem amigável ao usuário
    const userMessage = error.message
      .replace('Erro ao', 'Falha ao')
      .toLowerCase();
    
    // Você pode deixar isso para o componente tratar
    throw new Error(userMessage);
  }
}

// ═══════════════════════════════════════════════════════════════
// 8. MELHOR: USAR AXIOS (Opcional)
// ═══════════════════════════════════════════════════════════════

/*
npm install axios

// Instância configurada
const API = axios.create({
  baseURL: 'http://localhost:8080/api'
});

// Interceptor para adicionar token automaticamente
API.interceptors.request.use(config => {
  const token = window.AuthState.userToken;
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para tratar erros
API.interceptors.response.use(
  response => response.data,
  error => {
    if (error.response?.status === 401) {
      window.AuthState.logout();
      window.location.href = '/login';
    }
    throw error;
  }
);

// Uso:
const { user, token } = await API.post('/auth/login', { email, password });
const videos = await API.get('/videos');
*/

// ═══════════════════════════════════════════════════════════════
// 9. TESTING COM POSTMAN
// ═══════════════════════════════════════════════════════════════

/*
1. POST http://localhost:8080/api/auth/login
   Body (JSON):
   {
     "email": "test@example.com",
     "password": "password123"
   }

2. Copie o token da resposta

3. GET http://localhost:8080/api/videos
   Header:
   Authorization: Bearer <token-copiado>

4. POST http://localhost:8080/api/videos/upload
   Body (form-data):
   - title: "Novo Vídeo"
   - description: "..."
   - theme: "Rotina"
   - file: <selecionar arquivo de vídeo>
   
   Header:
   Authorization: Bearer <token>
*/

// ═══════════════════════════════════════════════════════════════
// 10. CHECKLISTA DE INTEGRAÇÃO
// ═══════════════════════════════════════════════════════════════

/*
Backend está rodando?
☐ Spring Boot server listening on :8080
☐ Database conectado e migrado
☐ CORS configurado

Endpoints implementados?
☐ POST /api/auth/login
☐ POST /api/auth/register
☐ POST /api/auth/logout
☐ GET /api/videos
☐ GET /api/videos/{id}
☐ POST /api/videos/upload
☐ GET /api/payment/plans
☐ POST /api/payment/checkout

Frontend pronto?
☐ Services criados (authService, videoService, etc)
☐ Componentes atualizados para usar services
☐ Erro handling implementado
☐ Loading states funcionando
☐ Token sendo salvo/enviado corretamente

Testing?
☐ Testar login/registro com Postman
☐ Verificar token no localStorage
☐ Testar upload de vídeo
☐ Testar fluxo de pagamento
☐ Testar admin controls
*/

export {
  authService,
  videoService,
  paymentService,
  apiCall,
  safeApiCall
};
