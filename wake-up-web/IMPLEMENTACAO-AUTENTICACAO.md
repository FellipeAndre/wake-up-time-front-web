# Implementação de Autenticação - Wake Up Now

## ✅ O que foi implementado

### 1. **Redirecionamento após Cadastro bem-sucedido → Login**
- ✅ Quando cadastro é sucesso, usuário é redirecionado para `/login` ao invés de home
- ✅ Página de login mostra mensagem de sucesso vindo do cadastro
- ✅ Email pré-preenchido no formulário de login (opcional)

**Arquivo:** [src/pages/Cadastro.jsx](src/pages/Cadastro.jsx)

---

### 2. **Validação de Token ao fazer Login**
- ✅ Ao fazer login, chamamos `POST /auth/login` para obter JWT
- ✅ Depois validamos o token com `GET /auth/validate` (Bearer token no header)
- ✅ Se token é válido → salva em localStorage + AuthContext
- ✅ Se token é inválido → mostra erro, usuário tenta novamente

**Arquivos:**
- [src/pages/Login.jsx](src/pages/Login.jsx) - Lógica atualizada
- [src/services/authService.js](src/services/authService.js) - Método `validateToken()` adicionado

---

### 3. **ProtectedRoute - Proteger Rotas Autenticadas**
- ✅ Componente novo que valida se usuário tem token antes de acessar rota
- ✅ Se tem token → renderiza componente
- ✅ Se sem token → redireciona para `/login`
- ✅ Mostra loading enquanto carrega sessão do localStorage

**Arquivo:** [src/components/ProtectedRoute.jsx](src/components/ProtectedRoute.jsx) - **NOVO**

---

### 4. **Router - Rotas Protegidas**
- ✅ Rota `/upload` agora usa `<ProtectedRoute>`
- ✅ Outras rotas protegidas podem ser adicionadas facilmente

**Arquivo:** [src/routes/router.jsx](src/routes/router.jsx)

---

## 📋 Fluxo Completo

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. CADASTRO (Novo Usuário)                                      │
├─────────────────────────────────────────────────────────────────┤
│ User → /cadastro                                                │
│ Preenche: Email, Nome, Senha                                   │
│ Clica "Cadastrar"                                              │
│ ↓                                                               │
│ POST /users { email, name, password }                          │
│ ↓                                                               │
│ Backend retorna: { token, user }                               │
│ ↓                                                               │
│ ✅ Salva em localStorage + AuthContext                         │
│ ✅ Redireciona para /login com mensagem de sucesso             │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ 2. LOGIN (Usuário Existente)                                    │
├─────────────────────────────────────────────────────────────────┤
│ User → /login                                                   │
│ Vê mensagem de sucesso do cadastro (se veio de /cadastro)      │
│ Preenche: Email, Senha                                         │
│ Clica "Entrar"                                                 │
│ ↓                                                               │
│ POST /auth/login { email, password }                           │
│ ↓                                                               │
│ Backend retorna: { token, user }                               │
│ ↓                                                               │
│ 🔄 NOVO: Valida Token                                          │
│ GET /auth/validate (Bearer token)                              │
│ ↓                                                               │
│ ✅ Token válido?                                               │
│    → Salva em localStorage + AuthContext                       │
│    → Redireciona para /                                        │
│                                                                 │
│ ❌ Token inválido?                                              │
│    → Mostra erro                                               │
│    → User tenta novamente                                      │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ 3. ACESSO A ROTAS PROTEGIDAS                                    │
├─────────────────────────────────────────────────────────────────┤
│ User acessa /upload (rota protegida)                           │
│ ↓                                                               │
│ ProtectedRoute verifica:                                       │
│ - Tem token em AuthContext?                                    │
│ ↓                                                               │
│ ✅ Sim → Renderiza <Upload />                                  │
│ ❌ Não → Redireciona para /login                               │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ 4. LOGOUT                                                       │
├─────────────────────────────────────────────────────────────────┤
│ User clica "Logout"                                            │
│ ↓                                                               │
│ authService.logout()                                           │
│ - Remove localStorage.wun_token                                │
│ - Chama AuthContext.logout()                                   │
│ - Limpa estado global                                          │
│ ↓                                                               │
│ ✅ Redireciona para / ou /login                                │
│ ✅ ProtectedRoute detecta falta de token                       │
│ ✅ Próximas tentativas de /upload → /login                     │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🧪 Como Testar

### Teste 1: Cadastro → Login
```bash
1. Acessa http://localhost:5173/cadastro
2. Preenche:
   - Email: teste@example.com
   - Nome: João Silva
   - Senha: senha123
3. Clica "Cadastrar"
4. ✅ Verifica: Redireciona para /login
5. ✅ Verifica: Vê mensagem "Cadastro realizado com sucesso"
6. ✅ Verifica: Email pré-preenchido no formulário
7. localStorage.getItem('wun_token') → deve ter um token
```

### Teste 2: Login com Validação de Token
```bash
1. Acessa http://localhost:5173/login
2. Preenche:
   - Email: teste@example.com
   - Senha: senha123
3. Clica "Entrar"
4. ✅ Verifica: Mostra "Entrando..." durante a requisição
5. ✅ Verifica: GET /auth/validate é chamado no Network
6. ✅ Verifica: Redireciona para / (home)
7. ✅ Verifica: localStorage.wun_token existe
8. ✅ Verifica: AuthContext tem token
```

### Teste 3: Rotas Protegidas
```bash
1. Sem fazer login:
   - Acessa http://localhost:5173/upload
   - ✅ Redireciona para /login automaticamente
   
2. Depois de fazer login:
   - Acessa http://localhost:5173/upload
   - ✅ Carrega a página de upload normalmente
   
3. Remove token e tenta acessar:
   - DevTools → Application → localStorage
   - Delete wun_token
   - Tenta acessar /upload
   - ✅ Redireciona para /login
```

### Teste 4: Logout
```bash
1. Depois de fazer login
2. Clica botão "Logout" (quando implementado)
3. ✅ Verifica: localStorage.wun_token removido
4. ✅ Verifica: AuthContext limpo (token = null)
5. ✅ Verifica: Redireciona para / ou /login
6. Tenta acessar /upload
7. ✅ Redireciona para /login
```

### Teste 5: Token Temporário (DevTools)
```bash
1. Faz login normalmente
2. DevTools → Network → Vê GET /auth/validate
3. DevTools → Application → localStorage
4. ✅ Verifica: wun_token tem valor
5. Delete o token
6. Recarrega página (F5)
7. ✅ Verifica: Sem token, pode acessar / e /login
8. Tenta /upload
9. ✅ Redireciona para /login
```

---

## 📁 Arquivos Modificados

| Arquivo | Mudança |
|---------|---------|
| [src/pages/Cadastro.jsx](src/pages/Cadastro.jsx) | ✏️ Redireciona para `/login` ao invés de home |
| [src/pages/Login.jsx](src/pages/Login.jsx) | ✏️ Valida token + mostra mensagem de sucesso do cadastro |
| [src/services/authService.js](src/services/authService.js) | ✏️ Novo método `validateToken()` |
| [src/routes/router.jsx](src/routes/router.jsx) | ✏️ Importa `ProtectedRoute` + protege `/upload` |
| [src/components/ProtectedRoute.jsx](src/components/ProtectedRoute.jsx) | **✅ NOVO FILE** |

---

## 🔌 Endpoints Backend Esperados

### POST /auth/login
```
Request:
{
  "email": "teste@example.com",
  "password": "senha123"
}

Response (200):
{
  "token": "eyJhbGc...",
  "user": {
    "id": 1,
    "email": "teste@example.com",
    "name": "João Silva",
    "role": "USER"
  }
}

Errors:
- 401: Email ou senha incorretos
- 404: Usuário não encontrado
- 400: Dados inválidos
```

### GET /auth/validate
```
Headers:
Authorization: Bearer eyJhbGc...

Response (200):
{
  "valid": true
}

Errors:
- 401: Token inválido
- 403: Token expirado
```

### POST /users (Cadastro)
```
Request:
{
  "email": "newuser@example.com",
  "name": "Novo Usuário",
  "password": "senha123"
}

Response (201):
{
  "token": "eyJhbGc...",
  "user": {
    "id": 42,
    "email": "newuser@example.com",
    "name": "Novo Usuário",
    "role": "USER"
  }
}

Errors:
- 409: Email já existe
- 400: Dados inválidos
```

---

## 🎯 Próximas Features

- [ ] Implementar botão "Logout" no Layout/Navbar
- [ ] Proteger rotas `/videos` e `/pagamento` com ProtectedRoute
- [ ] Implementar refresh token (JWT com expiration + refresh)
- [ ] Mensagem de "Token expirado" com opção de fazer login novamente
- [ ] Fazer logout automático ao expirar token
- [ ] Integrar com redes sociais (Google OAuth, Apple Sign In)
- [ ] Recuperação de senha (Forget Password)

---

## 📚 Referência

Ver documento completo em: [AUTENTICACAO-FLUXO.md](AUTENTICACAO-FLUXO.md)
