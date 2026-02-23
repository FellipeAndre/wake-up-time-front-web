# 🏗️ Refatoração para Arquitetura Modular Moderna

## 📋 Visão Geral

Você está migrando de:
```
❌ HTML + React via CDN + script.js global + funções globais
```

Para:
```
✅ Vite + React Router + Separação por Camadas (Services → Pages → Components)
```

### 🎯 Analogia com Spring Boot

Seu projeto atual é como ter **tudo em um servlet**. A nova arquitetura segue o mesmo padrão que você usa no backend:

```
SPRING BOOT                          REACT + VITE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

HTTP Request                         User Interaction (click, mount)
    ↓                                    ↓
@RestController                      pages/Home.jsx (Page Component)
(recebe requisição)                  (orquestra lógica)
    ↓                                    ↓
@Service                             services/homeService.js
(regra de negócio)                   (busca dados do backend)
    ↓                                    ↓
@Repository / Feign Client           HTTP para Spring Boot
(comunicação com DB/API externa)     (GET /api/home/estatisticas)
    ↓                                    ↓
Response JSON ← ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘ ← Back to Page
                                    (atualiza state)
                                        ↓
                                    components/
                                    (renderiza UI)
```

---

## 📁 Estrutura de Pastas

```
wake-up-web/
├── src/
│   ├── main.jsx                    ← Entry point Vite
│   ├── App.jsx                     ← Root component com layout global
│   ├── index.css                   ← Reset + tokens CSS globais
│   ├── routes/
│   │   └── router.jsx              ← Definição de rotas React Router
│   ├── pages/
│   │   ├── Home.jsx                ← Page: orquestra Home (estado + service)
│   │   ├── Login.jsx               ← Page: orquestra Login
│   │   ├── Cadastro.jsx            ← Page: orquestra Cadastro
│   │   └── Upload.jsx              ← Page: orquestra Upload
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.jsx         ← Componente: navegação lateral
│   │   │   ├── Topbar.jsx          ← Componente: barra superior
│   │   │   └── Layout.jsx          ← HOC: wrapper layout global
│   │   ├── Hero.jsx                ← Componente: seção hero
│   │   ├── StatsBar.jsx            ← Componente: barra de estatísticas
│   │   └── RecursoCard.jsx         ← Componente: card de recurso
│   ├── services/
│   │   ├── api.js                  ← Configuração axios + interceptadores
│   │   ├── homeService.js          ← Serviço: lógica de home
│   │   ├── authService.js          ← Serviço: autenticação
│   │   └── uploadService.js        ← Serviço: upload de arquivos
│   ├── hooks/
│   │   ├── useAuth.js              ← Hook: gerencia autenticação
│   │   ├── useHome.js              ← Hook: carrega dados de home
│   │   └── useFetch.js             ← Hook: wrapper axios
│   ├── context/
│   │   └── AuthContext.js          ← Context: autenticação global
│   ├── utils/
│   │   ├── validators.js           ← Validações (CPF, email, etc)
│   │   ├── formatters.js           ← Formatações (moeda, data, etc)
│   │   └── constants.js            ← Constantes da aplicação
│   └── styles/
│       ├── tokens.css              ← Variáveis CSS (cores, spacing)
│       ├── buttons.css             ← Componentes: botões
│       ├── forms.css               ← Componentes: formulários
│       └── animations.css          ← Animações globais
├── index.html                      ← HTML mínimo (Vite)
├── vite.config.js                  ← Configuração Vite
├── package.json                    ← Dependências
└── .env.example                    ← Variáveis de ambiente
```

---

## 🔄 Fluxo de Dados

### Exemplo: Home Page

```
1. User abre /home
   └─→ React Router carrega pages/Home.jsx

2. Home.jsx monta (useEffect)
   └─→ Chama homeService.buscarEstatisticas()

3. homeService.js faz requisição
   └─→ GET /api/home/estatisticas (com Bearer token)

4. Backend Spring Boot responde
   └─→ { totalUsuarios: 1000, alarmes: 2500, ... }

5. homeService retorna dados
   └─→ Home.jsx recebe via Promise

6. Home.jsx atualiza state
   └─→ setEstatisticas(dados)

7. Home.jsx renderiza componentes menores
   └─→ <StatsBar stats={estatisticas} />
   └─→ <Hero />
   └─→ <RecursoCard ... />

8. Components recebem props (read-only)
   └─→ Renderizam UI apenas
   └─→ Nunca fazem fetch direto
```

---

## 🎯 Responsabilidade de Cada Camada

### 1️⃣ **pages/** — Orquestradores (Analogia: Controller + Service)

```javascript
// pages/Home.jsx
export default function Home() {
  // ESTADO
  const [stats, setStats] = useState(null);
  
  // LÓGICA DE NEGÓCIO (similar a @Service no Spring)
  useEffect(() => {
    homeService.getEstatisticas()
      .then(setStats)
      .catch(handleError);
  }, []);
  
  // RENDERIZAÇÃO (delega para components)
  return <StatsBar stats={stats} />;
}
```

**Responsabilidades:**
- ✅ Orquestrar estado da página
- ✅ Chamar services
- ✅ Tratar erros
- ✅ Passar dados via props para components
- ❌ Não renderizar UI diretamente (delega)
- ❌ Não fazer fetch direto (usa service)

---

### 2️⃣ **services/** — Camada de Dados (Analogia: @Repository / Feign Client)

```javascript
// services/homeService.js
import api from './api';

export const homeService = {
  async getEstatisticas() {
    const { data } = await api.get('/home/estatisticas');
    return data;
  },
  
  async getRecursos() {
    const { data } = await api.get('/home/recursos');
    return data;
  }
};
```

**Responsabilidades:**
- ✅ Comunicação com backend (HTTP)
- ✅ Transformação de dados (se necessário)
- ✅ Tratamento de erros de requisição
- ❌ Renderização UI
- ❌ Lógica de negócio complexa (fica na page)

---

### 3️⃣ **components/** — Apresentação (Analogia: View Template)

```javascript
// components/StatsBar.jsx
export default function StatsBar({ stats }) {
  // SÓ RECEBE PROPS, SÓ RENDERIZA
  if (!stats) return <Skeleton />;
  
  return (
    <div className="stats-bar">
      <div className="stat">
        <span>{stats.totalUsuarios}</span>
      </div>
    </div>
  );
}
```

**Responsabilidades:**
- ✅ Renderizar UI
- ✅ Receber e exibir dados via props
- ✅ Handlers de interação local
- ❌ Fazer fetch
- ❌ Gerenciar estado complexo
- ❌ Chamar services direto

---

### 4️⃣ **services/api.js** — HTTP Client (Analogia: RestTemplate/Feign)

```javascript
// services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api'
});

// Interceptor: adiciona Bearer token automaticamente
api.interceptors.request.use(config => {
  const token = localStorage.getItem('wun_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

**Responsabilidades:**
- ✅ Configurar cliente HTTP (axios)
- ✅ Interceptadores (autenticação, erro)
- ✅ Base URL e timeouts
- ❌ Lógica de negócio

---

### 5️⃣ **context/AuthContext.js** — Estado Global (Analogia: Singleton/Spring Bean)

```javascript
// context/AuthContext.js
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('wun_token'));
  
  const login = (userData, tokenJWT) => {
    setUser(userData);
    setToken(tokenJWT);
    localStorage.setItem('wun_token', tokenJWT);
  };
  
  return (
    <AuthContext.Provider value={{ user, token, login }}>
      {children}
    </AuthContext.Provider>
  );
}
```

**Responsabilidades:**
- ✅ Estado compartilhado (autenticação)
- ✅ Funções globais (login, logout)
- ❌ Não armazenar estado de cada página

---

## 🚀 Vantagens dessa Arquitetura

| Aspecto | Antes | Depois |
|---------|-------|--------|
| **Escalabilidade** | Funções globais caoticas | Estrutura previsível |
| **Testabilidade** | Difícil testar funções globais | Fácil: export services, mock api |
| **Manutenção** | Bugalho em um arquivo quebra tudo | Alteração isolada e previsível |
| **Reutilização** | Copy-paste de código | Import/export |
| **Debugging** | console.log no escopo global | Stack trace claro |
| **Tipagem** | Sem JSDoc | TypeScript (opcional) |

---

## 📚 Resumo de Paradigmas

### Você vai APRENDER:

1. **Separação de Responsabilidades** — cada arquivo tem uma função
2. **Composição de Componentes** — builds complexas com peças simples
3. **Hooks do React** — useState, useEffect, useContext (a nova forma)
4. **React Router** — navegação propria do SPA moderno
5. **Axios Interceptadores** — gerenciar autenticação automaticamente

### Você vai ABANDONAR:

1. ❌ Funções globais
2. ❌ Script tags espalhadas
3. ❌ Múltiplos ReactDOM.createRoot
4. ❌ HTML separado por view
5. ❌ jQuery / DOM manual

---

## 🎬 Próxpos Passos

1. **Setup Vite** — `npm create vite@latest`
2. **Instalar dependências** — React Router, Axios, etc
3. **Criar estrutura de pastas**
4. **Refatorar Home.jsx** (mostrado abaixo)
5. **Refatorar outras páginas**
6. **Testar navegação**
7. **Deploy**

---

## ✨ Analogia Final: Spring Boot vs React Moderno

```
Spring Boot                         React Moderno
═════════════════════════════════════════════════════════

@Entity                             components/
(modelo de dados)                   (UI components)

@Repository                         services/
(acesso a dados)                    (acesso a API)

@Service                            pages/
(regra de negócio)                  (estado e lógica)

@RestController                     routes/
(mapear URLs)                       (React Router)

filter/interceptor                  services/api.js
(middleware)                        (axios interceptor)

@Configuration                      context/
(beans globais)                     (Context API)

application.properties              .env
(variáveis de ambiente)             (config frontend)
```

Quando você entender esse mapeamento, refatorar fica trivial! 🎯

---

**Criado por**: AI Agent  
**Data**: Fevereiro 2026  
**Próximo passo**: Implementar os exemplos abaixo
