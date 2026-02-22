# 🔐 Fluxo de Autenticação - Wake Up Now

## Visão Geral

Implementamos um fluxo de autenticação moderno com:
- ✅ **OAuth** (Google + Apple)
- ✅ **Email/Senha** como fallback
- ✅ **Validação de usuário** no backend
- ✅ **Cadastro automático** para novos usuários

---

## 🔄 Fluxo de Usuário

```
┌─────────────────┐
│   Home Page     │
│ "Começar Agora" │
└────────┬────────┘
         │
         ▼
┌─────────────────────────┐
│    LoginPage            │
├─────────────────────────┤
│ 🔵 Google              │
│ 🍎 Apple               │
│ 📧 Email/Senha         │
└────┬───────────┬────────┘
     │           │
  OAuth      Email/Senha
     │           │
     └─────┬─────┘
           │
           ▼
    ┌──────────────────────┐
    │  Backend Validation  │
    │  /api/auth/google    │
    │  /api/auth/apple     │
    │  /api/auth/login     │
    └─────┬────────┬───────┘
          │        │
     Existe?   Novo?
          │        │
          ▼        ▼
       Login   Signup
          │        │
          └────┬───┘
               │
               ▼
         ┌──────────────┐
         │  Dashboard   │
         │  Protected   │
         └──────────────┘
```

---

## 📋 Estrutura de Componentes

### 1. **LoginPage** (index.html)
Exibe:
- Botões Google/Apple OAuth
- Alternativa email/senha
- Validação no backend

**Handler:**
```javascript
Google/Apple clica
   ↓
validateGoogleToken() / validateAppleToken()
   ↓
Backend responde:
   - { success: true, user, token, isNewUser: false } → Login automático
   - { success: false, isNewUser: true, userData } → Redireciona pra Signup
```

### 2. **SignupPage** (index.html)
Exibe após OAuth retornar usuário novo:
- Email pré-preenchido (do OAuth)
- Campo CPF
- Campo Senha
- Confirmação Senha

**Handler:**
```javascript
User clica "Finalizar Cadastro"
   ↓
completeSignup()
   ↓
Backend salva no BD:
   - User record
   - Senha criptografada
   ↓
Login automático após sucesso
```

### 3. **AuthService** (auth-service.js no index.html)
Responsável por:
```javascript
validateGoogleToken(token)      // POST /api/auth/google
validateAppleToken(token)       // POST /api/auth/apple
loginEmail(email, password)     // POST /api/auth/login
completeSignup(userData)        // POST /api/auth/signup
saveAuthData(user, token)       // localStorage
getAuthData()                   // Recupera dados salvos
logout()                        // Limpa localStorage
isAuthenticated()               // Verifica se logado
```

---

## 🔧 Fluxo Técnico Detalhado

### Cenário 1: Usuário Existente com Google

```
1. User clica "🔵 Google"
   ↓
2. AuthService.validateGoogleToken(googleToken)
   ↓
3. Requisição:
   POST /api/auth/google
   { token: "google_123456" }
   ↓
4. Backend valida token no Google API
   ↓
5. Procura user na base:
   - achado → { success: true, user, token, isNewUser: false }
   - não achado → { success: true, isNewUser: true, userData }
   ↓
6. Se achado:
   a) AuthService.saveAuthData(user, token)
   b) localStorage['wun_token'] = token
   c) localStorage['wun_user'] = JSON.stringify(user)
   d) window.location.reload()
   e) User vê Home page já autenticado
   ↓
7. Sidebar mostra:
   - Avatar com iniciais
   - Nome e email do user
   - Menu "Upload" (se admin)
```

### Cenário 2: Usuário Novo com Apple

```
1. User clica "🍎 Apple"
   ↓
2. AuthService.validateAppleToken(appleToken)
   ↓
3. Requisição:
   POST /api/auth/apple
   { token: "apple_123456" }
   ↓
4. Backend valida token no Apple API
   ↓
5. Procura user na base:
   - achado → login automático (ver Cenário 1)
   - não achado → prepara dados pra signup
   ↓
6. Se não achado:
   a) sessionStorage.setItem('oauth_data', {
        email: "user@apple.com",
        name: "John Doe",
        provider: "apple",
        token: "apple_123456"
      })
   b) App.setState({ currentView: 'signup' })
   c) SignupPage renderiza com email pré-preenchido
   ↓
7. User preenche:
   - CPF
   - Senha
   - Confirma Senha
   ↓
8. User clica "✅ Finalizar Cadastro"
   ↓
9. AuthService.completeSignup({
      email, name, cpf, password, provider, token
   })
   ↓
10. Requisição:
    POST /api/auth/signup
    { email, name, cpf, password, provider, token }
    ↓
11. Backend:
    a) Cria novo User record
    b) Criptografa senha
    c) Valida CPF
    d) Retorna { success: true, user, token }
    ↓
12. Frontend:
    a) AuthService.saveAuthData(user, token)
    b) sessionStorage.removeItem('oauth_data')
    c) window.location.reload()
    d) Sidebar mostra user autenticado
```

### Cenário 3: Email/Senha

```
1. User clica "📧 Usar email/senha"
   ↓
2. Mostra formulário de email/password
   ↓
3. User preenche:
   - Email
   - Senha
   ↓
4. User clica "🔓 Entrar"
   ↓
5. AuthService.loginEmail(email, password)
   ↓
6. Requisição:
   POST /api/auth/login
   { email, password }
   ↓
7. Backend:
   a) Procura user por email
   b) Valida password com bcrypt
   c) Se ok → { success: true, user, token }
   d) Se erro → { success: false, message: "..." }
   ↓
8. Frontend:
   a) Se sucesso: AuthService.saveAuthData(user, token)
   b) Se erro: setError(result.message)
```

---

## 💾 localStorage Structure

Após login bem-sucedido:

```javascript
localStorage = {
  'wun_token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  'wun_user': JSON.stringify({
    id: 'uuid-123',
    name: 'João Silva',
    email: 'joao@example.com',
    cpf: '12345678901',
    role: 'user',        // ou 'admin'
    provider: 'google',  // ou 'apple', 'email'
    createdAt: '2024-01-15'
  })
}
```

---

## 🔌 API Endpoints Esperados

### POST /api/auth/google

**Request:**
```json
{
  "token": "google_jwt_token"
}
```

**Response (Usuário Existente):**
```json
{
  "success": true,
  "isNewUser": false,
  "user": {
    "id": "uuid",
    "name": "João Silva",
    "email": "joao@example.com",
    "role": "user"
  },
  "token": "jwt_token_backend"
}
```

**Response (Usuário Novo):**
```json
{
  "success": true,
  "isNewUser": true,
  "userData": {
    "email": "joao@example.com",
    "name": "João Silva"
  }
}
```

---

### POST /api/auth/apple

Mesmo contrato do Google, apenas mudando `provider`.

---

### POST /api/auth/login

**Request:**
```json
{
  "email": "joao@example.com",
  "password": "senha123"
}
```

**Response (Sucesso):**
```json
{
  "success": true,
  "user": { ... },
  "token": "jwt_token"
}
```

**Response (Erro):**
```json
{
  "success": false,
  "message": "Credenciais inválidas"
}
```

---

### POST /api/auth/signup

**Request:**
```json
{
  "email": "joao@example.com",
  "name": "João Silva",
  "cpf": "12345678901",
  "password": "senha123",
  "provider": "google",
  "token": "google_token"
}
```

**Response:**
```json
{
  "success": true,
  "user": { ... },
  "token": "jwt_token"
}
```

---

## 🛡️ Security Measures

1. **JWT Token** - Armazenado em localStorage
2. **Senha Criptografada** - bcrypt no backend
3. **CPF Validado** - Formato check digit
4. **HTTPS** - Em produção obrigatório
5. **CORS** - Configurado no backend
6. **Role-Based Access** - `role` field no user

---

## 🚀 Implementação Backend Checklist

- [ ] Rota POST `/api/auth/google` - validar Google token
- [ ] Rota POST `/api/auth/apple` - validar Apple token
- [ ] Rota POST `/api/auth/login` - validar email/senha
- [ ] Rota POST `/api/auth/signup` - criar novo user
- [ ] Model User com campos:
  - id (UUID)
  - email (unique)
  - name
  - cpf (unique, validado)
  - password (bcrypt)
  - provider (google/apple/email)
  - role (user/admin)
  - createdAt
- [ ] JWT Secret configurado
- [ ] CORS permitindo frontend URL
- [ ] Validação de CPF (modulo 11)
- [ ] Middleware de autenticação

---

## 🧪 Testing com Postman/Curl

### 1. Testar Google OAuth

```bash
curl -X POST http://localhost:8080/api/auth/google \
  -H "Content-Type: application/json" \
  -d '{"token":"google_fake_token_123"}'
```

**Esperado se user existe:**
```json
{
  "success": true,
  "isNewUser": false,
  "user": {...},
  "token": "jwt..."
}
```

### 2. Testar Login Email

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"senha123"}'
```

### 3. Testar Signup

```bash
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email":"novo@example.com",
    "name":"Novo User",
    "cpf":"12345678901",
    "password":"senha123",
    "provider":"google",
    "token":"google_token"
  }'
```

---

## 🔑 Próximos Passos

1. **Backend Implementation**
   - Criar tabela Users
   - Implementar Google/Apple OAuth validation
   - Implementar JWT generation
   - Implementar CPF validation

2. **Frontend Refinements**
   - Adicionar loading spinner durante OAuth
   - Melhorar UX de erros
   - Adicionar "Remember Me"
   - Implementar refresh token

3. **Security**
   - HTTPS em produção
   - Rate limiting nos endpoints auth
   - CSRF token validation
   - Session timeout

---

## 📞 Troubleshooting

**Problema:** Clica Google mas nada acontece
- Verificar console do navegador (F12)
- Checar se `/api/auth/google` está respondendo
- Verificar CORS headers

**Problema:** Erro "Credenciais inválidas"
- Email/senha está correto?
- Usuário existe na base?
- Password está criptografado no backend?

**Problema:** SignupPage aparece mas não completa
- sessionStorage contém 'oauth_data'?
- Rota `/api/auth/signup` está funcionando?
- Response contém 'success: true'?

---

## 📚 Referências

- [JWT.io](https://jwt.io)
- [Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)
- [Apple Sign in](https://developer.apple.com/sign-in-with-apple/)
- [OWASP Authentication](https://owasp.org/www-project-top-ten/)

---

**Status: PRONTO PARA IMPLEMENTAR** ✅
