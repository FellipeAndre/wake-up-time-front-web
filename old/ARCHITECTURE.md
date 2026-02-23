# 🏗️ Arquitetura - OAuth Flow Wake Up Now

## 📐 Diagrama de Componentes

```
┌─────────────────────────────────────────────────────────────────┐
│                     FRONTEND (React + Vanilla)                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Home Page                  LoginPage                SignupPage   │
│  ┌──────────────────┐      ┌──────────────────┐   ┌───────────┐ │
│  │  Hero Section    │      │ OAuth Buttons    │   │ CPF Form  │ │
│  │  Feature Grid    │  →   │ • Google ✅      │ → │ Password  │ │
│  │  Plans Preview   │      │ • Apple ✅       │   │ Confirm   │ │
│  │                  │      │ • Email/Pwd ✅   │   │           │ │
│  │ [🚀 Começar]     │      │ Loading States   │   │ [✅ Send] │ │
│  │      ↓           │      │ Error Handling   │   │           │ │
│  │ navigateTo('L')  │      └────────┬─────────┘   └─────┬─────┘ │
│  └──────────────────┘               │                   │        │
│         ↓                           │                   │        │
│  [HTML vanilla button]              │ sessionStorage    │        │
│         ↓                           │ oauth_data        │        │
│  window.navigateTo('login')         │                   │        │
│         ↓                           └───────────────────┘        │
│  window.setCurrentViewGlobal('login')              ↓             │
│         ↓                                   AuthService          │
│  React App: setCurrentView('login')       ┌──────────────────┐  │
│         ↓                                  │ Methods:         │  │
│  renderView() → <LoginPage />              │ • validateGoogle │  │
│         ↓                                  │ • validateApple  │  │
│  LoginPage renders with OAuth buttons      │ • completeSignup │  │
│                                            │ • loginEmail     │  │
│                                            │ • saveAuthData   │  │
│                                            │ • isAuthenticated│  │
│                                            │ • logout         │  │
│                                            └────────┬─────────┘  │
│                                                     │             │
│                                              POST /api/auth/*    │
│                                                     │             │
│                                                     ▼             │
│─────────────────────────────────────────────────────────────────│
│                      BACKEND (Java Spring Boot)                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  @RestController @ "/api/auth"                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                                                             │ │
│  │  POST /google          POST /apple        POST /login       │ │
│  │  ├─ Token received     ├─ Token received  ├─ Email received│ │
│  │  ├─ Validate Google    ├─ Validate Apple  ├─ Hash check   │ │
│  │  ├─ Search DB          ├─ Search DB       ├─ Search DB    │ │
│  │  └─ Return User+Token  └─ Return User+T.  └─ Return U+T   │ │
│  │                                                             │ │
│  │  POST /signup                                              │ │
│  │  ├─ CPF received                                           │ │
│  │  ├─ Validate CPF (modulo 11)                              │ │
│  │  ├─ Hash password (bcrypt)                                │ │
│  │  ├─ Create user                                           │ │
│  │  └─ Generate JWT                                          │ │
│  │                                                             │ │
│  └────────────────────────────────────────────────────────────┘ │
│                           ↓                                      │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │          JWT Token Provider                                 │ │
│  │  ├─ generateToken(userId)                                   │ │
│  │  ├─ validateToken(token)                                    │ │
│  │  └─ extractUserId(token)                                    │ │
│  └────────────────────┬───────────────────────────────────────┘ │
│                       │                                          │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │          Database Layer                                     │ │
│  │  ┌──────────────────────────────────────────────────────┐  │ │
│  │  │ TABLE users                                          │  │ │
│  │  │ ├─ id (UUID)                                         │  │ │
│  │  │ ├─ email (UNIQUE)                                    │  │ │
│  │  │ ├─ name                                              │  │ │
│  │  │ ├─ cpf (UNIQUE, validated)                           │  │ │
│  │  │ ├─ password (bcrypt hash)                            │  │ │
│  │  │ ├─ provider (google/apple/email)                     │  │ │
│  │  │ ├─ role (user/admin)                                 │  │ │
│  │  │ └─ created_at                                        │  │ │
│  │  └──────────────────────────────────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                   │
│─────────────────────────────────────────────────────────────────│
│              EXTERNAL SERVICES (Google, Apple)                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────┐     ┌──────────────────────────┐  │
│  │  Google OAuth            │     │  Apple OAuth             │  │
│  │  ├─ accounts.google.com  │     │  ├─ appleid.apple.com    │  │
│  │  ├─ gsi/client SDK       │     │  ├─ Sign In JS           │  │
│  │  └─ Token validation     │     │  └─ Token validation     │  │
│  └──────────────────────────┘     └──────────────────────────┘  │
│                                                                   │
│─────────────────────────────────────────────────────────────────│
│                       STORAGE LAYER                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Client Side:                      Server Side:                  │
│  ┌────────────────────┐           ┌────────────────────┐        │
│  │  localStorage      │           │  Database          │        │
│  │  wun_token  ─────→ ├──────────→│  users table       │        │
│  │  wun_user          │           │  (MySQL/PG)        │        │
│  │                    │           └────────────────────┘        │
│  └────────────────────┘                                         │
│                                                                   │
│  ┌────────────────────┐                                         │
│  │  sessionStorage    │           (Temporary OAuth data)        │
│  │  oauth_data ─────→ │           (Cleared after signup)        │
│  └────────────────────┘                                         │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Sequence Diagram - Fluxo Completo

### Cenário: User Novo + Google OAuth

```
User                    Frontend              Backend              DB
│                          │                    │                  │
├─ Clica "Começar" ────→   │                    │                  │
│                          ├─ redireciona ─────→ LoginPage          │
│                          │                    │                  │
├─ Clica Google button ──→ │                    │                  │
│                          ├─ abre Google SDK   │                  │
│                          │                    │                  │
├─ Autoriza Google ────→   │                    │                  │
│                          ├─ recebe ID token   │                  │
│                          │                    │                  │
│                          ├─ POST /auth/google ─────→  │          │
│                          │                    ├─ Validar token    │
│                          │                    │                  │
│                          │                    ├─ Procurar user ──→
│                          │                    │ ← Não encontrado  │
│                          │                    │                  │
│                          │                    ├─ Retornar:       │
│                          │ ← { isNewUser: true, userData }        │
│                          │                    │                  │
│                          ├─ Salvar       │
│                          │  sessionStorage    │                  │
│                          │  oauth_data        │                  │
│                          │                    │                  │
│                          ├─ Redireciona para SignupPage           │
│                          │                    │                  │
├─ Preenche CPF ────────→  │                    │                  │
├─ Preenche Senha ─────→   │                    │                  │
├─ Clica Cadastrar ────→   │                    │                  │
│                          ├─ Validar inputs   │                  │
│                          │                    │                  │
│                          ├─ POST /auth/signup ──────→│           │
│                          │                    ├─ Validar CPF     │
│                          │                    ├─ Hash senha      │
│                          │                    ├─ Criar user ────→
│                          │                    │ ├─ INSERT user   │
│                          │                    │ ← Success        │
│                          │                    │                  │
│                          │                    ├─ Generate JWT     │
│                          │                    │                  │
│                          │ ← { user, token }  │                  │
│                          ├─ Salvar token     │                  │
│                          │  localStorage      │                  │
│                          │                    │                  │
│                          ├─ Recarregar       │                  │
│                          │ (auto-login)      │                  │
│                          │                    │                  │
├─ Ver Dashboard ───────→  │                    │                  │
│  (Authenticado!)         │                    │                  │
│                          │                    │                  │
```

---

## 🎯 Data Flow - Request/Response

### Google OAuth Endpoint

```
REQUEST:
POST /api/auth/google
Content-Type: application/json

{
  "token": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjEyMyJ9..."
}

RESPONSE (User Exists):
{
  "success": true,
  "isNewUser": false,
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "João Silva",
    "email": "joao@example.com",
    "role": "user"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

RESPONSE (User New):
{
  "success": true,
  "isNewUser": true,
  "userData": {
    "email": "joao@example.com",
    "name": "João Silva"
  }
}
```

### Signup Endpoint

```
REQUEST:
POST /api/auth/signup
Content-Type: application/json

{
  "email": "novo@example.com",
  "name": "Novo User",
  "cpf": "12345678901",
  "password": "senha123",
  "provider": "google",
  "token": "google_token_abc123"
}

RESPONSE:
{
  "success": true,
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "name": "Novo User",
    "email": "novo@example.com",
    "cpf": "12345678901",
    "provider": "google",
    "role": "user",
    "createdAt": "2024-01-15T10:30:00Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## 🗂️ Estrutura de Pastas Backend (Esperada)

```
wake-up-now-backend/
├── pom.xml
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/wakeupnow/
│   │   │       ├── WakeUpNowApplication.java
│   │   │       ├── config/
│   │   │       │   ├── CorsConfig.java
│   │   │       │   └── SecurityConfig.java
│   │   │       ├── controller/
│   │   │       │   └── AuthController.java
│   │   │       ├── service/
│   │   │       │   ├── AuthService.java
│   │   │       │   └── JwtTokenProvider.java
│   │   │       ├── repository/
│   │   │       │   └── UserRepository.java
│   │   │       ├── entity/
│   │   │       │   └── User.java
│   │   │       ├── dto/
│   │   │       │   ├── AuthResponse.java
│   │   │       │   ├── GoogleTokenRequest.java
│   │   │       │   ├── LoginRequest.java
│   │   │       │   └── SignupRequest.java
│   │   │       └── util/
│   │   │           └── CpfValidator.java
│   │   └── resources/
│   │       ├── application.yml
│   │       └── application-prod.yml
│   └── test/
│       └── java/...
└── README.md
```

---

## 🔐 JWT Token Structure

```
Header:
{
  "alg": "HS512",
  "typ": "JWT"
}

Payload:
{
  "sub": "550e8400-e29b-41d4-a716-446655440000",  ← User ID
  "iat": 1705325400,                               ← Issued at
  "exp": 1705411800                                ← Expires at (24h)
}

Signature:
[HMAC-SHA512 signed with server secret]
```

Decoded JWT:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJzdWIiOiI1NTBlODQwMC1lMjliLTQxZDQtYTcxNi00NDY2NTU0NDAwMDAiLCJpYXQiOjE3MDUzMjU0MDAsImV4cCI6MTcwNTQxMTgwMH0.
[signature]
```

---

## 📊 State Management

### Frontend (React + localStorage)

```javascript
// In memory (React State)
currentView: 'home' | 'login' | 'signup' | 'videos' | ...
authData: { user, token } | null

// localStorage (Persistence)
{
  "wun_token": "eyJ...",
  "wun_user": "{\"id\":\"...\",\"name\":\"...\"}"
}

// sessionStorage (Temp data)
{
  "oauth_data": "{\"email\":\"...\",\"provider\":\"google\"}"
}
```

### Backend (Spring)

```
User Entity
  ├─ id (PK)
  ├─ email (UNIQUE)
  ├─ password (bcrypt)
  ├─ cpf (UNIQUE)
  ├─ provider (oauth source)
  └─ role (authorization)

JWT Token
  ├─ Issued by JwtTokenProvider
  ├─ Contains user ID
  └─ Expires in 24 hours
```

---

## 🔗 API Contracts

Todos os endpoints:

| Método | Endpoint | Input | Output |
|--------|----------|-------|--------|
| POST | `/api/auth/google` | `{token}` | `{success, user, token, isNewUser}` |
| POST | `/api/auth/apple` | `{token}` | `{success, user, token, isNewUser}` |
| POST | `/api/auth/login` | `{email, password}` | `{success, user, token}` |
| POST | `/api/auth/signup` | `{email, name, cpf, password, provider, token}` | `{success, user, token}` |

---

## ✅ Checklist de Implementação

### Frontend (DONE ✅)
- [x] LoginPage with OAuth buttons
- [x] SignupPage with validation
- [x] AuthService with all methods
- [x] navigateTo() global function
- [x] localStorage/sessionStorage integration
- [x] Sidebar authentication display

### Backend (TODO)
- [ ] AuthController with 4 endpoints
- [ ] UserRepository (JPA)
- [ ] JwtTokenProvider
- [ ] User entity model
- [ ] CpfValidator utility
- [ ] CorsConfigurationSource
- [ ] application.yml configuration
- [ ] Database schema migration

### Testing
- [ ] Unit tests for endpoints
- [ ] Integration tests
- [ ] Manual testing with Postman
- [ ] End-to-end flow testing

---

**The architecture is complete and ready for Backend implementation!** 🚀
