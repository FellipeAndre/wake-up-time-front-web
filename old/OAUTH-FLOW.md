# 🔐 OAuth Flow · Wake Up Now

## Fluxo Completo de Autenticação Google/Apple

### 📊 Diagrama do Fluxo

```
┌─────────────────────────────────────────────────────────────────────┐
│                      FRONTEND (React)                              │
└─────────────────────────────────────────────────────────────────────┘
                                ↓
                     [LoginPage com OAuth]
                    Google ↓       ↓ Apple
                         ↓         ↓
┌─────────────────────────────────────────────────────────────────────┐
│                      BACKEND (Spring)                              │
│                                                                    │
│  POST /api/auth/google  ou  POST /api/auth/apple                 │
│                                                                    │
│  Body:                                                             │
│  {                                                                 │
│    "token": "google_token_xxx"  ou  "apple_token_xxx"            │
│  }                                                                 │
│                                                                    │
│  Backend faz:                                                      │
│  1️⃣ Valida o token com Google/Apple                              │
│  2️⃣ Extrai email e nome do token                                 │
│  3️⃣ Verifica se esse email JÁ EXISTE na base de dados           │
└─────────────────────────────────────────────────────────────────────┘
                                ↓
                         Resposta Backend
                                ↓
     ┌──────────────────────────┬──────────────────────────┐
     ↓                          ↓                          ↓
[Email EXISTE]         [Email NÃO EXISTE]          [Erro - Token Inválido]
   isNewUser: false        isNewUser: true           success: false
     ↓                          ↓                          ↓
  🔓 AUTO-LOGIN            📝 REDIRECIONA PARA       ❌ MOSTRA ERRO
                           CADASTRO COMPLETO
   User + Token            (com email pré-preenchido)
                            + solicita: CPF + Senha
```

---

## 🔑 Endpoints Esperados

### 1. **POST /api/auth/google** — Validar Google OAuth
**Quando**: Usuário clica "Continuar com Google" no LoginPage

**Frontend envia:**
```json
{  
  "token": "google_token_abc123xyz"
}
```

**Backend processa:**
1. Valida `token` com Google (Google Sign-In API)
2. Extrai `email` e `name` do token decodificado
3. **Verifica se email existe na base** → `SELECT * FROM users WHERE email = ?`

**Respostas do Backend:**

#### Caso 1: Email EXISTE na base
```json
{
  "success": true,
  "isNewUser": false,
  "user": {
    "id": "user_123",
    "email": "joão@email.com",
    "name": "João Silva",
    "role": "student"
  },
  "token": "jwt_token_abc123xyz"
}
```
✅ **Frontend faz login automático** + recarrega página

---

#### Caso 2: Email NÃO EXISTE na base
```json
{
  "success": true,
  "isNewUser": true,
  "userData": {
    "email": "novo@email.com",
    "name": "Novo Usuário"
  }
}
```
📝 **Frontend redireciona para SignupPage** com:
- Email pré-preenchido: `novo@email.com`
- Nome pré-preenchido: `Novo Usuário`
- Pedindo: **CPF** + **Senha**
- Armazena no sessionStorage: `oauth_data` (com token, provider='google', etc)

---

#### Caso 3: Token Inválido/Erro
```json
{
  "success": false,
  "message": "Token Google inválido ou expirado"
}
```
❌ **Frontend mostra erro**: `"❌ Erro com Google: Token inválido..."`

---

### 2. **POST /api/auth/apple** — Validar Apple OAuth
**Quando**: Usuário clica "Continuar com Apple" no LoginPage

**Frontend envia:**
```json
{
  "token": "apple_identity_token_xyz789"
}
```

**Backend processa:**
1. Valida `token` com Apple (Apple Sign-In API)
2. Extrai `email` e nome do JWT decodificado
3. **Verifica se email existe** → `SELECT * FROM users WHERE email = ?`

**Respostas**: Idênticas ao Google (veja acima)

---

### 3. **POST /api/auth/signup** — Completar Cadastro após OAuth
**Quando**: Usuário preenche CPF + Senha na SignupPage

**Frontend envia:**
```json
{
  "email": "novo@email.com",
  "name": "Novo Usuário",
  "cpf": "12345678901",
  "password": "senha_segura_123",
  "provider": "google",  // ou "apple"
  "token": "google_token_abc123xyz"
}
```

**Backend processa:**
1. Valida `token` novamente (garantir segurança)
2. Extrai email do token + compara com email enviado (previne manipulação)
3. **Cria novo usuário** com:
   - `email`, `name`, `cpf`
   - `password` (HASH com bcrypt/argon2)
   - `oauthProvider` = google/apple (rastreamento)
4. Retorna token JWT + user data

**Resposta Sucesso:**
```json
{
  "success": true,
  "user": {
    "id": "user_456",
    "email": "novo@email.com",
    "name": "Novo Usuário",
    "cpf": "12345678901",
    "role": "student"
  },
  "token": "jwt_token_new_user_xyz"
}
```
✅ **Frontend salva token** + faz login automático

**Resposta Erro:**
```json
{
  "success": false,
  "message": "Erro ao criar usuário: Email já cadastrado"
}
```

---

## 🔐 Fluxo de Email/Senha (Login Tradicional)

### **POST /api/auth/login** — Login com email + senha
**Quando**: Usuário clica "Usar email/senha" no LoginPage

**Frontend envia:**
```json
{
  "email": "user@email.com",
  "password": "senha_123"
}
```

**Backend processa:**
1. Busca usuário por email
2. Compara password (hash) com entrada
3. Se credenciais OK → gera JWT token

**Resposta Sucesso:**
```json
{
  "success": true,
  "user": { "id", "email", "name", "role" },
  "token": "jwt_token_abc123"
}
```

**Resposta Erro:**
```json
{
  "success": false,
  "message": "Email ou senha inválidos"
}
```

---

## 🗄️ Estrutura de BD Esperada

```sql
-- Tabela de Usuários
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  cpf VARCHAR(11) UNIQUE,
  password_hash VARCHAR(255),  -- SEMPRE HASHED
  oauth_provider VARCHAR(50),   -- 'google', 'apple', null para email/senha
  oauth_id VARCHAR(255),        -- ID único do OAuth provider
  role VARCHAR(50) DEFAULT 'student',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_email ON users(email);
CREATE INDEX idx_oauth ON users(oauth_provider, oauth_id);
```

---

## 🎯 Frontend: Fluxo Implementado

### LoginPage (`src/LoginPage`)
```jsx
// 1. Usuário clica Google/Apple
const handleGoogleClick = async () => {
  // 2. Frontend obtém token do Google (via @react-oauth/google library)
  const result = await AuthService.validateGoogleToken(token);
  
  // 3. Se email EXISTE → Faz login
  if (!result.isNewUser) {
    AuthService.saveAuthData(result.user, result.token);
    location.reload(); // ✅ Entra vendo conteúdo autenticado
  }
  
  // 4. Se email NÃO EXISTE → Vai para cadastro
  else if (result.isNewUser) {
    sessionStorage.setItem('oauth_data', {...});  // Armazena dados
    onSignupRequired();  // Muda para SignupPage
  }
};
```

### SignupPage (`src/SignupPage`)
```jsx
// 1. Página já mostra email pré-preenchido (do OAuth)
// 2. Usuário preenche: CPF + Senha + Confirmar Senha
// 3. Clica "Criar Conta"
const handleSubmit = async () => {
  // 4. Frontend envia dados completos para backend
  const result = await AuthService.completeSignup({
    email: oauthData.email,
    name: oauthData.name,
    cpf,
    password,
    provider: oauthData.provider,
    token: oauthData.token
  });
  
  // 5. Se sucesso → Login automático
  if (result.success) {
    AuthService.saveAuthData(result.user, result.token);
    location.reload();
  }
};
```

---

## 🔒 Checklist de Segurança

- [ ] **Sempre fazer HASH de passwords** (bcrypt, Argon2)
- [ ] **Validar tokens COM a Google/Apple API** (nunca confiar no JWT do cliente!)
- [ ] **Comparar email do token COM email enviado** no SignupPage (previne manipulação)
- [ ] **Usar HTTPS** em produção
- [ ] **Rate limiting** nos endpoints `/auth/*` (brute force protection)
- [ ] **Validar CPF** no backend (formato + dígitos verificadores)
- [ ] **Testar expiração de tokens** OAuth (alguns expiram em minutos)

---

## 📝 Como o Backend VALIDA Google OAuth (Exemplo em Spring)

```java
// OAuth2RestTemplate ou RestTemplate
String googleTokenUrl = "https://oauth2.googleapis.com/tokeninfo?id_token=" + token;
ResponseEntity<Map> response = restTemplate.getForEntity(googleTokenUrl, Map.class);

if (response.getStatusCode() == HttpStatus.OK) {
  Map<String, Object> tokenData = response.getBody();
  String email = (String) tokenData.get("email");
  String name = (String) tokenData.get("name");
  
  User existingUser = userRepository.findByEmail(email).orElse(null);
  
  if (existingUser != null) {
    // Email EXISTS → Retorna user + token
    return { success: true, isNewUser: false, user: existingUser, token };
  } else {
    // Email NÃO EXISTS → Retorna dados para cadastro
    return { success: true, isNewUser: true, userData: { email, name } };
  }
}
```

---

## ✅ Resumo do Fluxo

| Etapa | Frontend | Backend | Resultado |
|-------|----------|---------|-----------|
| 1 | Usuário clica Google/Apple no Login | — | Modal do OAuth |
| 2 | Obtém token e envia para `/api/auth/google` | Valida token + lookup email | — |
| 3 | Email EXISTE? | Retorna user + JWT | Login automático ✅ |
| 4 | Email NÃO EXISTE? | Retorna userData (email+name) | Redireciona para Signup 📝 |
| 5 | — | Usuário preenche CPF + Senha no Signup | — |
| 6 | Envia dados completos para `/api/auth/signup` | Cria usuário + retorna JWT | Login automático ✅ |

