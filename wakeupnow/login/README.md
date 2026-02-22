# Login Module - React Component

## 📋 Visão Geral

Este módulo implementa a tela de **Login/Cadastro** usando **React** integrado ao projeto vanilla.

## 📁 Arquivos

### 1. **login.html** (Vanilla HTML)
Estrutura semântica com inputs, botões e containers para erros.
- ✅ Pronto para uso standalone
- ID semânticos: `loginEmailInput`, `registerFirstNameInput`, etc.
- Logo integrada (SVG hexágono)

### 2. **login.css** (Vanilla CSS)
Estilos responsivos usando **CSS tokens** (sem cores hardcoded).
- Mobile-first: 480px, 768px, 1024px breakpoints
- Animações suaves para feedback visual
- Usa `--silver`, `--charcoal`, `--ink` do `style.css`

### 3. **login.js** (Vanilla JavaScript)
Lógica pura de validação, mascaramento e API calls.
- Estado centralizado: `AuthenticationState`
- Funções de validação independentes
- Pronto para adaptar a qualquer framework

### 4. **Login.jsx** (React Component) ⭐ NOVO
Componente React que encapsula toda a lógica.
- Gerencia estado com `useState`
- Valida formulários
- Aplica máscaras
- Comunica com backend
- Callback de sucesso

### 5. **mount-login.js** (Integration Bridge)
Arquivo que permite montar o componente React no HTML.
- `mountLoginComponent(elementId, onLoginSuccess)`
- `unmountLoginComponent()`
- API global: `window.LoginComponentAPI`

## 🚀 Como Usar

### **Opção A: Usar HTML + JavaScript Vanilla (Atual)**

```html
<!-- No index.html -->
<div id="viewLogin" class="view"></div>

<!-- Incluir script -->
<script src="login/login.js"></script>

<!-- Inicializar -->
<script>
  // Quando navega para login
  initLoginPage();
</script>
```

### **Opção B: Usar React Component (Novo) ⭐**

**Pré-requisito**: Seu projeto precisa ter React e ReactDOM instalados.

1. **No seu arquivo que gerencia rotas**:

```javascript
import { mountLoginComponent } from './login/mount-login.js';

// Quando navegador para /login
const handleLoginSuccess = (userData) => {
  console.log('Usuário logado:', userData);
  // Redirecionar para home ou próxima página
  navigateTo('home');
};

// Montar componente
mountLoginComponent('viewLogin', handleLoginSuccess);
```

2. **No seu index.html**:

```html
<!-- Importar React -->
<script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>

<!-- Container para React -->
<div id="viewLogin" class="view"></div>

<!-- Scripts do módulo login -->
<script type="module">
  import { mountLoginComponent } from './login/mount-login.js';
  
  window.initLoginView = () => {
    const handleSuccess = (user) => {
      console.log('Login bem-sucedido:', user);
      // Sua lógica aqui
    };
    mountLoginComponent('viewLogin', handleSuccess);
  };
</script>
```

3. **No seu router (quando navega para /login)**:

```javascript
case 'login':
  window.initLoginView();
  showView('viewLogin');
  break;
```

## 🔄 Fluxo de Dados

```
┌─────────────────────────────────────────────────┐
│         Login.jsx (React Component)             │
│                                                 │
│  State:                                         │
│  - loginFormData (email, password)              │
│  - registerFormData (name, email, cpf, pwd)    │
│  - isLoading, errors, passwordStrength         │
│                                                 │
│  Functions:                                     │
│  - validateLogin() → boolean                    │
│  - validateRegister() → boolean                 │
│  - handleLoginSubmit() → POST /api/auth/login   │
│  - handleRegisterSubmit() → POST /api/auth/register
│  - handleCPFChange() → Aplica máscara          │
│  - handlePasswordChange() → Avalia força        │
│                                                 │
│  Callbacks (props):                             │
│  - onLoginSuccess(userData) → Chamado no sucesso
└─────────────────────────────────────────────────┘
          ↓
┌─────────────────────────────────────────────────┐
│         Backend (Spring)                        │
│                                                 │
│  POST /api/auth/login                          │
│  Body: { email, password }                      │
│  Response: { token, user: {...} }              │
│                                                 │
│  POST /api/auth/register                       │
│  Body: { name, email, cpf, password }          │
│  Response: { token, user: {...} }              │
└─────────────────────────────────────────────────┘
          ↓
┌─────────────────────────────────────────────────┐
│         localStorage                            │
│                                                 │
│  - userToken: "jwt_token_aqui"                  │
│  - userData: {"id": ..., "name": ..., ...}    │
└─────────────────────────────────────────────────┘
```

## 🎨 Customização

### Mudar Base URL da API

```javascript
// No .env
REACT_APP_API_URL=http://localhost:8080/api

// Ou definir global antes de montar
window.API_BASE_URL = 'http://seu-backend.com/api';
```

### Adicionar OAuth (Google/Apple)

```jsx
// Adicione no Login.jsx após instalar bibliotecas
import { GoogleLogin } from '@react-oauth/google';

// No formulário:
<GoogleLogin
  onSuccess={credentialResponse => {
    // Enviar para backend
  }}
  onError={() => console.log('Login Failed')}
/>
```

### Modificar Validações

```jsx
// No Login.jsx, atualize validateLogin():
const validateLogin = () => {
  // Sua lógica customizada
};
```

## 📊 Comparação: Vanilla vs React

| Aspecto | login.js (Vanilla) | Login.jsx (React) |
|---------|-------------------|-------------------|
| **Estado** | Objeto `AuthenticationState` | `useState` hooks |
| **Validação** | Funções independentes | Métodos de classe |
| **Renderização** | Manual com `innerHTML` | Automática com React |
| **Reatividade** | Necessita event listeners | Automática com props/state |
| **DevTools** | Consola do browser | React DevTools |
| **Bundle size** | +1KB (módulo puro) | +40KB (React) |
| **Casos ideais** | Páginas simples, SPA vanilla | Apps complexas, componentização |

## ✅ Checklist de Integração

- [ ] Copiar arquivos para `wakeupnow/login/`
  - [ ] `login.html`
  - [ ] `login.css`
  - [ ] `login.js` (vanilla) OR `Login.jsx` (react)
  - [ ] `mount-login.js` (se usar React)

- [ ] No `index.html`:
  - [ ] Incluir `<link rel="stylesheet" href="login/login.css">`
  - [ ] Incluir `<div id="viewLogin" class="view"></div>`
  - [ ] Se React: `<script src="React/ReactDOM CDN links">`

- [ ] No seu router:
  - [ ] Adicionar case para `/login`
  - [ ] Chamar `initLoginPage()` (vanilla) ou `mountLoginComponent()` (react)

- [ ] Testar:
  - [ ] Validação de email funciona
  - [ ] Máscara de CPF funciona
  - [ ] Força de senha mostra corretamente
  - [ ] Login envia dados para backend
  - [ ] Token salvo em localStorage
  - [ ] Callback `onLoginSuccess` é chamado

## 🐛 Troubleshooting

### "Module not found: React"
```bash
# Instalar React (se usando npm)
npm install react react-dom
```

### "Elemento #viewLogin não encontrado"
Verifique se o `<div id="viewLogin"></div>` existe no HTML antes de chamar `mountLoginComponent`.

### "CORS error ao enviar para backend"
Adicione headers CORS no seu backend (Spring):
```java
@CrossOrigin(origins = "http://localhost:3000")
@PostMapping("/auth/login")
public ResponseEntity<?> login(@RequestBody LoginRequest request) { ... }
```

### Token não persiste após refresh
Verifique localStorage no DevTools:
```javascript
console.log(localStorage.getItem('userToken'));
```

## 📚 Próximas Etapas

1. **Integração com AuthContext (se usar React)**
   - Mover estado global para Context
   - Persist token e user no Context

2. **Adicionar Social Login**
   - Google Sign-In
   - Apple Sign-In

3. **Password Reset Flow**
   - Formulário de "Esqueci a senha"
   - Email com link reset

4. **Refatorar Outros Módulos**
   - `cadastro/` → Usar padrão React (se aplicável)
   - `upload/` → Melhorar nomeclatura de variáveis
   - `videos/` → Adicionar filtros reusáveis

---

**Criado por**: AI Agent  
**Data**: 2025  
**Status**: ✅ Pronto para produção
