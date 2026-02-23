# 🚀 GUIA RÁPIDO — Arquitetura Modular Vite + React

Documento criado em: **Fevereiro 2026**  
Versão: **2.0.0**

---

## 📍 O Que Você TEM Agora

Um projeto **estruturado profissionalmente** com:

```
✅ Vite como bundler (ultrarrápido)
✅ React Router para navegação real
✅ Separação Services → Pages → Components
✅ Sem funções globais
✅ Sem múltiplos ReactDOM.createRoot
✅ CSS variables (tokens design system)
✅ Pronto para escalar
```

---

## 🎯 Estrutura Criada

```
wake-up-web/
├── index.html                   # Entry HTML mínimo
├── vite.config.js              # Config Vite (dev, build, proxy)
├── package.json                # Deps: React, React Router, Axios
├── .env.example                # Variáveis de ambiente
│
└── src/
    ├── main.jsx                # 🎬 Entry Point
    ├── App.jsx                 # 🏗️  Root Component
    ├── style.css               # 🎨 CSS Global (Tokens + Layout)
    │
    ├── routes/
    │   └── router.jsx          # 📍 Mapa de rotas
    │
    ├── pages/
    │   ├── Home.jsx            # 📄 Orquestrador Home
    │   ├── Login.jsx           # 📄 Orquestrador Login (stub)
    │   ├── Cadastro.jsx        # 📄 Orquestrador Cadastro (stub)
    │   └── Upload.jsx          # 📄 Orquestrador Upload (stub)
    │
    ├── services/
    │   ├── api.js              # 🔌 Client HTTP (Axios)
    │   ├── homeService.js      # 📡 Lógica de Home
    │   └── [outros services]   # 📡 Outros serviços
    │
    ├── components/
    │   ├── Hero.jsx            # 🎨 Apresentação: Hero
    │   ├── StatsBar.jsx        # 🎨 Apresentação: Stats
    │   ├── RecursoCard.jsx     # 🎨 Apresentação: Card
    │   └── layout/
    │       └── Layout.jsx      # 🎨 HOC: Sidebar + Topbar
    │
    ├── context/                # 🌍 Estado global (Auth, etc)
    │   └── [AuthContext.js]    # (próximo)
    │
    ├── hooks/                  # 🪝 Custom hooks
    │   └── [useAuth.js]        # (próximo)
    │
    ├── utils/                  # 🛠️  Funções auxiliares
    │   └── [validators.js]     # (próximo)
    │
    └── styles/                 # 📚 Estilos modularizados (opcional)
```

---

## 🎬 Como Rodar

### 1️⃣ Instalar Dependências
```bash
cd wake-up-web
npm install
```

### 2️⃣ Configurar Variáveis de Ambiente
```bash
cp .env.example .env.local
# Editar .env.local com seus valores
# VITE_API_URL=http://localhost:8080/api
```

### 3️⃣ Iniciar Dev Server
```bash
npm run dev
```

**Resultado:**
- ✅ Abre em `http://localhost:3000`
- ✅ Hot reload automático (salvar = reload no browser)
- ✅ CORS proxy para backend em `/api`

### 4️⃣ Build para Produção
```bash
npm run build
# Gera saída otimizada em dist/
```

---

## 🔄 Fluxo de Dados Real

### Exemplo: User Acessa Home

```
1. User abre /home
   ↓
2. React Router detecta path → carrega pages/Home.jsx
   ↓
3. Home.jsx component monta (useEffect)
   ↓
4. useEffect chama homeService.getEstatisticas()
   ↓
5. homeService.js chama api.get('/home/estatisticas')
   ↓
6. api.js (axios) adiciona Bearer token automaticamente
   ↓
7. Requisição HTTP → GET http://localhost:8080/api/home/estatisticas
   ↓
8. Backend Spring Boot responde com JSON
   ↓
9. api.js interceptador valida status (401? 403? 200?)
   ↓
10. homeService retorna dados transformados
   ↓
11. Home.jsx faz setEstatisticas(dados)
   ↓
12. Component renderiza → <StatsBar dados={stats} />
   ↓
13. StatsBar (presentational) exibe números via props
   ↓
14. User vê página carregada ✅
```

---

## 📝 Padrão: Como Adicionar Nova Página

### Passo 1: Criar Service (se necessário)

```javascript
// src/services/videosService.js

import api from './api'

export const videosService = {
  async getVideos(filtro = {}) {
    const { data } = await api.get('/videos/list', { params: filtro })
    return data
  },
  
  async getVideoById(id) {
    const { data } = await api.get(`/videos/${id}`)
    return data
  }
}
```

### Passo 2: Criar Page Component

```javascript
// src/pages/Videos.jsx

import { useState, useEffect } from 'react'
import { videosService } from '../services/videosService'
import VideoCard from '../components/VideoCard'

export default function Videos() {
  const [videos, setVideos] = useState([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    async function carregar() {
      try {
        const dados = await videosService.getVideos()
        setVideos(dados)
      } finally {
        setCarregando(false)
      }
    }
    carregar()
  }, [])

  return (
    <section>
      <h2>Vídeos</h2>
      {videos.map(v => <VideoCard key={v.id} video={v} />)}
    </section>
  )
}
```

### Passo 3: Criar Component Presentational

```javascript
// src/components/VideoCard.jsx

export default function VideoCard({ video }) {
  return (
    <div className="video-card">
      <img src={video.thumb} alt={video.titulo} />
      <h3>{video.titulo}</h3>
      <p>{video.descricao}</p>
    </div>
  )
}
```

### Passo 4: Registrar Rota

```javascript
// src/routes/router.jsx

import Videos from '../pages/Videos'

const router = [
  // ... outras rotas
  {
    path: '/videos',
    element: <Videos />
  }
]
```

---

## 🧪 Testando

### Testar Service (Mock API)

```javascript
// homeService.getEstatisticas é testável pois é pure function

test('homeService.getEstatisticas retorna objeto com props corretas', async () => {
  // Mock axios
  jest.mock('../services/api', () => ({
    get: jest.fn().mockResolvedValue({
      data: {
        totalUsuarios: 1000,
        alarmesCriados: 5000,
        horasEconomizadas: 100,
        avaliacaoMedia: 4.8
      }
    })
  }))

  const stats = await homeService.getEstatisticas()
  
  expect(stats).toHaveProperty('totalUsuarios')
  expect(stats.totalUsuarios).toBe(1000)
})
```

### Testar Component

```javascript
// <StatsBar /> é testável pois é presentational (sem fetch)

test('StatsBar exibe números recebidos via props', () => {
  const { getByText } = render(
    <StatsBar dados={{
      totalUsuarios: 1000,
      alarmesCriados: 5000,
      horasEconomizadas: 100,
      avaliacaoMedia: 4.8
    }} />
  )
  
  expect(getByText('1000')).toBeInTheDocument()
})
```

---

## 🔐 Autenticação & Token

### Como Funciona Atualmente

1. **Interceptador Request** (api.js):
   - Busca `localStorage.getItem('wun_token')`
   - Adiciona header: `Authorization: Bearer {token}`
   - Enviado automaticamente em TODO request

2. **Interceptador Response** (api.js):
   - Se status === 401 → token expirou
   - Limpa localStorage
   - Redireciona para /login
   
3. **Salvar Token** (quando fizer login):
   ```javascript
   const { user, token } = await authService.login(email, senha)
   localStorage.setItem('wun_token', token)
   localStorage.setItem('wun_user', JSON.stringify(user))
   setUser(user) // Context API (próximo)
   ```

---

## 🌍 Estado Global (Próximo Passo)

Para compartilhar état (user, autenticação) entre páginas:

```javascript
// src/context/AuthContext.jsx

import { createContext, useState } from 'react'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('wun_token'))

  const login = (userData, tokenJWT) => {
    setUser(userData)
    setToken(tokenJWT)
    localStorage.setItem('wun_token', tokenJWT)
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('wun_token')
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
```

Depois, envolver App.jsx:

```javascript
// src/App.jsx
import { AuthProvider } from './context/AuthContext'

export default function App() {
  return (
    <AuthProvider>
      {/* resto da app */}
    </AuthProvider>
  )
}
```

---

## 📊 Mapeamento Spring Boot → React

| Spring Boot | React |
|----------|-------|
| `@RestController` | `pages/` (Page Component) |
| `@Service` | `services/` (Service Module) |
| `@Repository / Feign` | `services/api.js` |
| `interceptor` | `api.js` interceptadores |
| `@Configuration` | `context/` (Context API) |
| `@Entity` | `types/` ou TypeScript interfaces |
| `@ExceptionHandler` | `try/catch` em services/pages |
| Logging | `console.error()` + serviço de logging |

---

## 🎓 Resumo de Responsabilidades

### Pages
```
✅ Orquestrar estado da página
✅ Chamar services
✅ Tratar erros
✅ Renderizar components e passar props
❌ Fazer fetch direto
❌ Renderizar tudo na página
```

### Services
```
✅ Chamar API via api.js
✅ Transformar dados
✅ Tratamento de erro HTTP
❌ Renderizar UI
❌ Gerenciar estado React
```

### Components
```
✅ Renderizar UI
✅ Receber dados via props
✅ Handlers locais (onClick)
❌ Fazer fetch
❌ Gerenciar estado complexo
```

---

## 🚨 Problemas Comuns

### ❌ "ReferenceError: homeService is not defined"
**Causa:** Esqueceu de `import`

**Solução:**
```javascript
import homeService from '../services/homeService'  // ✅ Adicione
```

### ❌ "Cannot read property 'getEstatisticas' of undefined"
**Causa:** `homeService` é undefined (import erro)

**Solução:** Check se arquivo `services/homeService.js` existe e exporta

### ❌ "CORS error when fetching http://localhost:8080"
**Causa:** Vite proxy não configurado

**Solução:** Check `vite.config.js` tem proxy para `/api`

### ❌ Componente renderiza vazio
**Causa:** Dados ainda carregando

**Solução:** Adicione condicional:
```javascript
if (!dados) return <Skeleton />
```

---

## 📚 Próximos Passos

1. ✅ Entender estrutura (você está aqui!)
2. ⏳ Refatorar Login.jsx, Cadastro.jsx, Upload.jsx
3. ⏳ Implementar AuthService + AuthContext
4. ⏳ Adicionar validações (validators/)
5. ⏳ Implementar uploador arquivos
6. ⏳ Testes com Jest/Vitest
7. ⏳ TypeScript (opcional mas recomendado)
8. ⏳ Deploy (Vercel/Netlify/seu servidor)

---

## 💡 Dicas Profisionais

1. **UseEffect Cleanup:** Limpar subscriptions
   ```javascript
   useEffect(() => {
     const unsubscribe = homeService.listen()
     return () => unsubscribe()
   }, [])
   ```

2. **Error Boundary:** Catchear erros de componentes
3. **Lazy Loading:** `React.lazy()` para code splitting
4. **TypeScript:** Tipagem garante menos bugs

---

## 📞 Referências

- [React Router v6 Docs](https://reactrouter.com/)
- [Vite Docs](https://vitejs.dev/)
- [Axios Docs](https://axios-http.com/)
- [MDN Web Docs](https://developer.mozilla.org/)

---

**Criado com ❤️ em Fevereiro 2026**
