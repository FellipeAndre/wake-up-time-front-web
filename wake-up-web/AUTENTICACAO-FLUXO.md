/**
 * FLUXO DE AUTENTICAÇÃO - Wake Up Now
 * 
 * Este arquivo documenta o novo fluxo de autenticação implementado
 */

# Fluxo Completo de Autenticação

## 1. CADASTRO (Novo Usuário)

### Fluxo:
1. Usuário acessa `/cadastro`
2. Preenche formulário (Email, Nome, Senha)
3. SignupForm valida os dados localmente
4. POST `/users` → backend cria conta e retorna JWT token
5. ✅ Sucesso → Redireciona para `/login` com mensagem de sucesso

### Código:
- [Cadastro.jsx](src/pages/Cadastro.jsx) - Página de cadastro
- [SignupForm.jsx](src/components/SignupForm.jsx) - Formulário de cadastro
- `authService.signup()` - Chamada à API

---

## 2. LOGIN (Usuário Existente)

### Fluxo:
1. Usuário acessa `/login`
2. Preenche Email + Senha
3. POST `/auth/login` → Backend valida credenciais e retorna JWT
4. **NOVO**: Valida token com GET `/auth/validate` (Bearer token no header)
5. ✅ Token válido → 
   - Salva token em `localStorage` (wun_token)
   - Atualiza `AuthContext` via `login(token)`
   - Redireciona para `/` (home)
6. ❌ Token inválido ou expirado → Mostra erro, usuário tenta novamente

### Código:
- [Login.jsx](src/pages/Login.jsx) - Página de login
- `authService.loginWithEmail(email, password)` - Chamada login
- `authService.validateToken(token)` - **NOVO**: Valida token
- [AuthContext.jsx](src/context/AuthContext.jsx) - Gerencia estado global

---

## 3. ACESSO A ROTAS PROTEGIDAS

### Fluxo:
1. Usuário autenticado tenta acessar `/upload` (rota protegida)
2. ProtectedRoute verifica se existe token no `AuthContext`
3. ✅ Token existe → Renderiza componente (Upload)
4. ❌ Sem token → Redireciona para `/login`

### Rotas Protegidas:
- `/upload` - Área de upload de vídeos

### Código:
- [ProtectedRoute.jsx](src/components/ProtectedRoute.jsx) - **NOVO**: Protetor de rotas
- [router.jsx](src/routes/router.jsx) - Configuração de rotas

---

## 4. LOGOUT

### Fluxo:
1. Usuário clica em "Sair" (botão no navbar/menu)
2. `authService.logout()` remove token de localStorage
3. `AuthContext.logout()` limpa estado global
4. ✅ Redireciona para `/` ou `/login`
5. ProtectedRoute detecta ausência de token nas próximas requisições

### Código:
- `authService.logout()` - Remove dados do localStorage
- `AuthContext.logout()` - Limpa contexto

---

## 5. VALIDAÇÃO DE TOKEN AO CARREGAR APP

### Fluxo:
1. App.jsx inicia
2. AuthContext useEffect executa na montagem
3. Verifica `localStorage` para token salvo
4. Se encontra token → restaura em `AuthContext`
5. Ao fazer requisições, token é automaticamente enviado (interceptor em api.js)

### Código:
- [AuthContext.jsx](src/context/AuthContext.jsx) - useEffect de montagem
- [api.js](src/services/api.js) - Interceptor do Axios

---

## Endpoints Backend Esperados

### POST /auth/login
**Body:**
```json
{ "email": "user@email.com", "password": "senha123" }
```

**Response (200):**
```json
{
  "token": "eyJhbGc...",
  "user": { "id": 1, "email": "user@email.com", "name": "João", "role": "USER" }
}
```

**Errors:**
- `401` - Email/Senha incorretos
- `404` - Usuário não encontrado
- `400` - Dados inválidos

---

### POST /users (Cadastro)
**Body:**
```json
{ "email": "newuser@email.com", "name": "João Silva", "password": "senha123" }
```

**Response (201):**
```json
{
  "token": "eyJhbGc...",
  "user": { "id": 42, "email": "newuser@email.com", "name": "João Silva", "role": "USER" }
}
```

**Errors:**
- `409` - Email já existe
- `400` - Dados inválidos (nome vazio, etc)

---

### GET /auth/validate
**Headers:**
```
Authorization: Bearer eyJhbGc...
```

**Response (200):**
```json
{ "valid": true, "isValid": true }
```

**Errors:**
- `401` - Token inválido
- `403` - Token expirado

---

## Estrutura de Pastas

```
src/
├── context/
│   └── AuthContext.jsx           # Contexto global de autenticação
├── services/
│   ├── authService.js            # Serviço de auth (login, signup, validate)
│   └── api.js                    # Axios instance com interceptors
├── components/
│   ├── ProtectedRoute.jsx        # ✅ NOVO: Protetor de rotas
│   ├── SignupForm.jsx            # Formulário de cadastro
│   └── ...
├── pages/
│   ├── Cadastro.jsx              # ✅ ATUALIZADO: Redireciona para login
│   ├── Login.jsx                 # ✅ ATUALIZADO: Valida token
│   └── ...
└── routes/
    └── router.jsx                # ✅ ATUALIZADO: Usa ProtectedRoute
```

---

## Arquitetura: Validação de Token

### Antes (Sem Validação):
```
Login Form
    ↓
POST /auth/login
    ↓
Salva token em localStorage
    ↓
Redireciona para home
    ❌ Sem validar se token realmente funciona
```

### Depois (Com Validação):
```
Login Form
    ↓
POST /auth/login → retorna token
    ↓
GET /auth/validate (envia token) → verifica se é válido
    ↓
✅ Válido? Salva em localStorage + AuthContext
❌ Inválido? Mostra erro → user tenta novamente
    ↓
Redireciona para home apenas com token válido
```

---

## Fluxo de Rotas Protegidas

```
User acessa /upload
    ↓
ProtectedRoute verifica AuthContext
    ↓
Tem token? → Renderiza <Upload />
    ↓
Sem token? → Redireciona para /login
```

---

## Teste Manual do Fluxo

### 1️⃣ Cadastro
- [ ] Acessa `/cadastro`
- [ ] Preenche formulário
- [ ] Clica "Cadastrar"
- [ ] Vê mensagem de sucesso no login
- [ ] Token salvo em `localStorage.wun_token`

### 2️⃣ Login
- [ ] Acessa `/login`
- [ ] Vê mensagem de sucesso do cadastro (opcional)
- [ ] Preenche email e senha
- [ ] Clica "Entrar"
- [ ] Backend valida credenciais
- [ ] Token é validado (GET /auth/validate)
- [ ] Redireciona para home
- [ ] Pode acessar `/upload` sem erro

### 3️⃣ ProtectedRoute
- [ ] Abre DevTools → Application → localStorage
- [ ] Delete `wun_token`
- [ ] Tenta acessar `/upload` diretamente
- [ ] Redireciona para `/login` automaticamente

### 4️⃣ Logout
- [ ] Clica botão "Logout"
- [ ] localStorage limpo
- [ ] AuthContext limpo
- [ ] Redireciona para `/` ou `/login`
- [ ] Tenta `/upload` → redireciona para `/login`

---

## Próximos Passos

- [ ] Implementar componente de Logout no Layout/Navbar
- [ ] Testar outros endpoints (Videos, Pagamento)
- [ ] Proteger rotas `/videos` e `/pagamento` com ProtectedRoute
- [ ] Implementar refresh token (opcional)
- [ ] Adicionar mensagem de "Token expirado" com opção de fazer login novamente
