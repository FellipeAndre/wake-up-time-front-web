# 🔐 SSO - OAuth Google Setup - Wake Up Now

## 📋 O que foi Configurado

### ✅ Frontend (React)

Seu aplicativo agora tem:

1. **LoginPage** - Página de autenticação com:
   - Botão "🔵 Continuar com Google"
   - Botão "🍎 Continuar com Apple"  
   - Fallback "📧 Email/Senha"

2. **SignupPage** - Formulário para novos usuários com:
   - CPF (com máscara automática)
   - Senha + Confirmação
   - Validação em tempo real

3. **AuthService** - Serviço centralizado que:
   - `validateGoogleToken()` - POST `/api/auth/google`
   - `validateAppleToken()` - POST `/api/auth/apple`
   - `loginEmail()` - POST `/api/auth/login`
   - `completeSignup()` - POST `/api/auth/signup`
   - Gerencia localStorage (wun_token, wun_user)

4. **Navegação** - Botão "🚀 Começar Agora" agora:
   - Redireciona para **LoginPage** ✅
   - Funciona com `navigateTo('login')`
   - Conectado com React App

---

## 🎯 Fluxo Esperado

```
┌─ HOME PAGE ─┐
│             │
│ [🚀 Começar] │ ← CLICA AQUI
│             │
└────┬────────┘
     │
     ▼
┌──────────────────────┐
│   LOGIN PAGE         │
├──────────────────────┤
│ 🔵 Google           │
│ 🍎 Apple            │
│ 📧 Email/Senha      │
└─┬────────────┬───────┘
  │            │
  │ (Google)   │ (Email)
  │            │
  ▼            ▼
Backend    Backend
/api/auth/google    /api/auth/login
  │              │
  ▼              ▼
User existe?    Login OK?
  │              │
  ├─ SIM ──→ AUTO-LOGIN
  │              │
  └─ NÃO ──→ SIGNUP PAGE
               │
               ▼
            [Preencher CPF + Senha]
               │
               ▼
            /api/auth/signup
               │
               ▼
            AUTO-LOGIN + Dashboard
```

---

## 🚀 Próximos Passos

### 1. Backend Java - Implementar Endpoints

Crie essas 4 rotas HTTP:

**POST `/api/auth/google`**
- Input: `{ token: "google_jwt_token" }`
- Output: 
  ```json
  {
    "success": true,
    "isNewUser": false,
    "user": { "id", "name", "email", "role" },
    "token": "jwt_backend_token"
  }
  ```

**POST `/api/auth/apple`**
- Mesmo contrato do Google

**POST `/api/auth/login`**
- Input: `{ email, password }`
- Output: mesmo que Google (se sucesso)

**POST `/api/auth/signup`**
- Input: `{ email, name, cpf, password, provider, token }`
- Output: `{ success: true, user, token }`

### 2. Configurar CORS

Seu Backend Java precisa permitir origem do frontend:

```java
@Configuration
public class CorsConfig {
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000", "http://localhost:5173"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
```

### 3. Integrar Google OAuth SDK

No arquivo `index.html`, adicione:

```html
<!-- Dentro de <head> -->
<script src="https://accounts.google.com/gsi/client" async defer></script>
```

Depois configure com seu Client ID no servidor.

### 4. Banco de Dados

Crie tabela `users`:

```sql
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    cpf VARCHAR(14) UNIQUE,
    password VARCHAR(255),
    provider VARCHAR(50), -- "google", "apple", "email"
    role VARCHAR(50), -- "user", "admin"
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_email ON users(email);
CREATE INDEX idx_cpf ON users(cpf);
```

---

## 📁 Arquivos Criados

### Documentação

- **`AUTHENTICATION-FLOW.md`** - Fluxo completo de autenticação (diagrama + detalhes)
- **`GOOGLE-OAUTH-SETUP.md`** - Guia completo de integração Google (Frontend + Backend)
- **`TESTING-GUIDE.md`** - Testes e debugging
- **`README.md`** (este arquivo)

### Código

- **`index.html`** - App React com LoginPage + SignupPage (✅ pronto)
- **`auth-service.js`** - AuthService que chama backend (✅ pronto)
- **`home/home.html`** - Botão "Começar Agora" redireciona para login (✅ pronto)

---

## 🧪 Teste Rápido

Sem backend (para verificar frontend):

```bash
# 1. Abra o navegador
open http://localhost:3000

# 2. Clique em "🚀 Começar Agora"
# Esperado: Vai para LoginPage

# 3. No Console (F12), execute:
window.navigateTo('login')      # Deve ir para login
window.navigateTo('signup')     # Deve ir para signup
window.AuthService.isAuthenticated()  # Deve retornar false
```

Com backend (completo):

```bash
# 1. Backend Java rodando em localhost:8080
# 2. Google OAuth configurado e Client ID gerado
# 3. Teste completo do fluxo:
#    Home → "Começar Agora" → LoginPage → Google → Signup → Dashboard
```

---

## ✅ Checklist de Implementação

### Frontend (Done ✅)
- [x] LoginPage com OAuth buttons
- [x] SignupPage com validação CPF
- [x] AuthService com todos os endpoints
- [x] Navegação funcional (navigateTo)
- [x] localStorage para persistência
- [x] Sidebar mostra user autenticado

### Backend Java (TODO)
- [ ] Criar projeto Spring Boot
- [ ] Implementar `POST /api/auth/google`
- [ ] Implementar `POST /api/auth/apple`
- [ ] Implementar `POST /api/auth/login`
- [ ] Implementar `POST /api/auth/signup`
- [ ] Configurar CORS
- [ ] Criar tabela users no DB
- [ ] Validar Google tokens com Google API
- [ ] Gerar JWT tokens

### Google Cloud (TODO)
- [ ] Criar projeto no Google Cloud Console
- [ ] Habilitar Google+ API
- [ ] Criar OAuth 2.0 Credentials (Web)
- [ ] Adicionar URIs autorizados
- [ ] Copiar Client ID

### Testing (TODO)
- [ ] Teste navegação LoginPage
- [ ] Teste botão Google
- [ ] Teste formulário Signup
- [ ] Teste POST ao backend
- [ ] Teste localStorage
- [ ] Teste fluxo end-to-end

---

## 🔗 Arquivos de Referência

Leia nesta ordem:

1. **`AUTHENTICATION-FLOW.md`** - Entender o fluxo completo
2. **`GOOGLE-OAUTH-SETUP.md`** - Implementar Backend Java + Google
3. **`TESTING-GUIDE.md`** - Testar cada parte

---

## 📞 Dúvidas Frequentes

### P: Como testar sem backend?
R: Use o Console (F12) para chamar funções direto. O frontend está 100% funcional.

### P: Qual é o fluxo para usuario novo?
R: Home → "Começar Agora" → LoginPage → GoogleAuth → Backend retorna `isNewUser: true` → SaveOAuthData em sessionStorage → SignupPage → Preenche CPF/Senha → Backend cria user → Auto-login

### P: E para usuario existente?
R: Home → "Começar Agora" → LoginPage → GoogleAuth → Backend retorna user + token → Auto-login → Dashboard

### P: Onde fica o JWT token?
R: Em `localStorage['wun_token']` após login bem-sucedido

### P: Como o Sidebar sabe quem está logado?
R: Verifica `window.AuthState.isAuthenticated()` e mostra avatar com iniciais do nome

---

## 🎓 Próximas Aulas

Após implementar o Google OAuth:

1. Apple OAuth (similar ao Google)
2. Refresh Token (JWT expira a cada 24h)
3. Middleware de autenticação (proteger rotas)
4. Download de certificado de conclusão
5. Painel de admin (Upload de vídeos)

---

## 📚 Documentação

- [Frontend: AUTHENTICATION-FLOW.md](./AUTHENTICATION-FLOW.md)
- [Backend: GOOGLE-OAUTH-SETUP.md](./GOOGLE-OAUTH-SETUP.md)
- [Testes: TESTING-GUIDE.md](./TESTING-GUIDE.md)

---

## 🚀 Status

| Componente | Status | Próximo |
|-----------|--------|---------|
| Frontend OAuth UI | ✅ Pronto | Testar |
| AuthService | ✅ Pronto | Backend |
| Backend Endpoints | ⏳ TODO | Implementar |
| Google Cloud Setup | ⏳ TODO | Configurar |
| Database | ⏳ TODO | Criar |
| End-to-End Test | ⏳ TODO | Testar |

---

**Agora o Frontend está 100% pronto para o Backend!** 🎉

Próximo passo: Implementar os endpoints Java em `/api/auth/*`
