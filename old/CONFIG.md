# ⚙️ Configuração do Frontend - Wake Up Now

## 🔧 Configurar URL da API

O frontend está configurado para chamar a API em `http://localhost:8080/api`.

### Se o Backend Estiver Rodando Localmente

Seu backend Spring Boot deve estar em:
```
http://localhost:8080/api/auth/google
http://localhost:8080/api/auth/apple
http://localhost:8080/api/auth/signup
http://localhost:8080/api/auth/login
```

**Verificar se está rodando:**
```bash
curl http://localhost:8080/api/auth/google -X POST -H "Content-Type: application/json" -d '{"token": "test"}'
```

---

## 🧪 Usar Mock para Desenvolvimento

Se o backend **ainda não está pronto**, ative o modo MOCK no arquivo `wakeupnow/index.html`:

### 1. Abrir `wakeupnow/index.html`
### 2. Procurar por (linha ~28):
```html
<script>
    // ⚙️ Configure sua URL base aqui (ou deixe como está para produção)
    window.API_CONFIG = {
        BASE_URL: 'http://localhost:8080/api',
        USE_MOCK: false  // 👈 MUDE PARA true
    };
</script>
```

### 3. Mudar para:
```html
<script>
    window.API_CONFIG = {
        BASE_URL: 'http://localhost:8080/api',
        USE_MOCK: true  // ✅ Ativado
    };
</script>
```

### Agora o frontend usa dados fictícios:
✅ **Google/Apple login** → Retorna user mock automático  
✅ **Cadastro** → Cria usuário mock  
✅ **Email/Senha** → Testa com `teste@email.com` / `123456`

---

## 🌐 Mudar URL Base da API

Se seu backend está em outro servidor:

```html
<script>
    window.API_CONFIG = {
        BASE_URL: 'https://api.wakeupnow.com',  // Sua URL produção
        USE_MOCK: false
    };
</script>
```

---

## 📝 Problemas Comuns

### ❌ "HTTP 405 - Method Not Allowed"
- Backend não tem o endpoint implementado
- **Solução**: Implemente os 4 endpoints (veja `BACKEND-IMPLEMENTATION.md`)
- **Ou**: Ative `USE_MOCK: true` para testar o fluxo

### ❌ "HTTP 0 ou CORS Error"
- Backend não está rodando
- **Solução**: Inicie o backend com `mvn spring-boot:run`
- **Ou**: Mude `BASE_URL` para servidor correto

### ❌ "Network Error"
- URL errada ou servidor offline
- **Verificar**: Mude `BASE_URL` e tente `curl http://...`

---

## ✅ Fluxo de Teste Recomendado

**Com MOCK ativado:**

1. Clique `🔵 Continuar com Google`
   - ✅ Faz login automático (usuário mock)
   - ✅ Redireciona para Home página

2. Logout e teste email/senha:
   - Email: `teste@email.com`
   - Senha: `123456`
   - ✅ Faz login

3. Teste cadastro novo:
   - Desative mock
   - Backend deve ter `/api/auth/signup` implementado
   - Frontend enviará dados reais

---

## 🚀 Deploy em Produção

Antes de fazer deploy:

1. **Desative MOCK**: `USE_MOCK: false`
2. **Configure URL real**: `BASE_URL: 'https://seu-dominio.com/api'`
3. **Certifique-se que backend tem CORS habilitado**:
   ```java
   @Configuration
   public class CorsConfig {
       @Bean
       public WebMvcConfigurer corsConfigurer() {
           return new WebMvcConfigurer() {
               @Override
               public void addCorsMappings(CorsRegistry registry) {
                   registry.addMapping("/api/**")
                       .allowedOrigins("https://wakeupnow.com")
                       .allowedMethods("GET", "POST", "PUT", "DELETE")
                       .allowCredentials(true);
               }
           };
       }
   }
   ```

---

## 📊 Fluxo de Autenticação Completo

```
┌─────────────────┐
│  LoginPage      │
└────────┬────────┘
         │
    ┌────┴────┐
    ▼         ▼
[Google]  [Apple]  [Email/Senha]
    │         │           │
    └────┬────┴───────────┘
         │
    POST /api/auth/google
    POST /api/auth/apple
    POST /api/auth/login
         │
    ┌────┴─────────────────┐
    │ Checa Backend         │
    └────┬─────────────────┘
         │
    ┌────┴────────────────────────┐
    │ Email EXISTE?               │
    ├─────────────────────────────┤
    ▼ SIM                    NÃO ▼
  [Auto Login]    [Redireciona para Signup]
     ✅                          📝
   Home Page              CPF + Senha
                          ▼
                      POST /api/auth/signup
                          │
                        ✅ Home Page
```

---

## 🎯 Checklist de Saída

- [ ] Backend implementou os 4 endpoints (OAuth + Email/Senha)
- [ ] `USE_MOCK: false` no código
- [ ] `BASE_URL` aponta para backend correto
- [ ] Testou login com Google (backend valida token)
- [ ] Testou login com Apple (backend valida token)
- [ ] Testou cadastro novo (backend cria user)
- [ ] Testou email/senha (backend valida credenciais)
- [ ] CORS habilitado no backend
- [ ] JWT token sendo gerado e salvo

