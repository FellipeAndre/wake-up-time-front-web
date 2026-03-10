# Páginas de Autenticação - Wake Up Now 🔐

Implementação completa de **Cadastro** e **Login** com OAuth (Google e Apple) + Email/Senha.

## 📋 Componentes Criados

### 1. **GoogleOAuthButton.jsx**
Botão de autenticação com Google usando Google Identity Services SDK.

```jsx
<GoogleOAuthButton
  onSuccess={(userData) => console.log(userData)}
  onError={(error) => console.error(error)}
  label="Continuar com Google"
/>
```

**Retorna:**
```javascript
{
  email: "usuario@gmail.com",
  name: "João Silva",
  picture: "https://...",
  provider: "google",
  token: "jwt_token"
}
```

### 2. **AppleSignInButton.jsx**
Botão de autenticação com Apple Sign-In SDK.

```jsx
<AppleSignInButton
  onSuccess={(userData) => console.log(userData)}
  onError={(error) => console.error(error)}
  label="Continuar com Apple"
/>
```

**Retorna:**
```javascript
{
  email: "usuario@icloud.com",
  name: "João Silva",
  provider: "apple",
  token: "identity_token"
}
```

### 3. **SignupForm.jsx**
Formulário de cadastro com validação de:
- Email
- Nome
- CPF (11 dígitos)
- Senha (mínimo 6 caracteres)
- Confirmação de Senha

```jsx
<SignupForm
  initialData={{ email, name, provider }}
  onSuccess={(result) => console.log(result)}
  onError={(msg) => console.error(msg)}
/>
```

### 4. **Cadastro.jsx** - Página Completa
2 steps:
1. **Step 1 (OAuth)**: Botões Google e Apple
2. **Step 2 (Form)**: Formulário para novos usuários

**Fluxo:**
```
1. Usuário clica em Google/Apple
   ↓
2. Backend valida: email existe?
   ├─ SIM → Login direto
   └─ NÃO → Mostra formulário
3. Usuário preenche CPF + Senha
4. Backend cria conta nova
5. Redireciona para home
```

### 5. **Login.jsx** - Página de Login
Permite:
- Login com Google/Apple
- Login com Email + Senha
- Link para criar conta se novo usuário

## 🔧 Configuração Necessária

### 1. **Google OAuth**

Configurar em [Google Cloud Console](https://console.cloud.google.com):

```bash
# .env.local
VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
```

**Passos:**
1. Criar Project no Google Cloud
2. Ativar "Google+ API"
3. Criar "OAuth 2.0 Client ID" com:
   - Application type: Web application
   - Authorized origins:
     - http://localhost:3001 (dev)
     - https://seu-dominio.com (prod)
   - Authorized redirect URIs:
     - http://localhost:3001
     - https://seu-dominio.com

### 2. **Apple Sign-In**

Configurar em [Apple Developer](https://developer.apple.com):

```bash
# .env.local
VITE_APPLE_TEAM_ID=your-team-id
VITE_APPLE_KEY_ID=your-key-id
VITE_APPLE_BUNDLE_ID=com.wakeupnow.web
```

**Passos:**
1. Registrar App ID com "Sign in with Apple"
2. Criar Service ID (Web)
3. Configurar Redirect URIs:
   - http://localhost:3001 (dev)
   - https://seu-dominio.com (prod)

## 🔗 Integração com authService

O serviço já tem métodos integrados:

### Fluxo Google/Apple
```javascript
// 1. Frontend autentica
const userData = await handleGoogleAuth() // OAuth SDK

// 2. Valida email
const { exists } = await authService.checkEmailExists(userData.email)

// 3. Se existe → Login
if (exists) {
  const result = await authService.loginWithGoogle(email, name, picture)
}

// 4. Se não existe → Cadastro
else {
  const result = await authService.signup({
    email, name, cpf, password, provider: 'google'
  })
}
```

### Fluxo Email/Senha
```javascript
// Login
const result = await authService.loginWithEmail(email, password)

// Signup (novo usuário)
const result = await authService.signup({
  email, name, cpf, password, provider: 'email'
})
```

## 📊 AuthContext - Estado Global

```javascript
import { useAuth } from './hooks/useAuth'

export function MyComponent() {
  const { user, token, isAuthenticated, login, logout } = useAuth()

  return (
    <>
      {isAuthenticated && <p>Bem-vindo, {user.name}!</p>}
      <button onClick={() => logout()}>Sair</button>
    </>
  )
}
```

## 🎨 Padrão de Design

- **Tema**: Dark mode com magenta (#ff006d)
- **Layout**: Centered card com gradiente
- **Validações**: Em tempo real com feedback visual
- **Loading States**: Spinner animado
- **Error Handling**: Mensagens claras em vermelho

## 📍 Rotas

```javascript
GET  /                    // Home
GET  /login               // Página de Login
GET  /cadastro            // Página de Cadastro
GET  /upload              // Admin (não implementado)
GET  /videos              // Biblioteca (não implementado)
```

## 📱 Requisitos do Backend

### Endpoints Necessários

```
POST /api/auth/check-email          ✅ Verifica se email existe
POST /api/auth/oauth-login          ✅ Login via OAuth (Google/Apple)
POST /api/auth/signup               ✅ Cria nova conta
POST /api/auth/login                ✅ Login email/senha
```

### Request/Response Examples

Ver arquivo `BACKEND-OAUTH-ENDPOINTS.md` para detalhes completos.

## 🚀 Próximos Passos

- [ ] Testar Google OAuth com credentials reais
- [ ] Testar Apple Sign-In
- [ ] Implementar backend endpoints
- [ ] Setup Database (User table)
- [ ] JWT validation
- [ ] Protected routes (redirect to login se não autenticado)
- [ ] Forgot password flow
- [ ] Email verification

## 🐛 Troubleshooting

**"AppleID SDK não carregado"**
- Verificar internet connection
- Apple Sign-In requer HTTPS em produção

**"Google credential is undefined"**
- Verificar Client ID está correto
- Verificar authorized origins no Google Cloud Console

**"Erro ao verificar email"**
- Verificar se backend está rodando
- Verificar CORS configurado
- Ver console do browser para mais detalhes
